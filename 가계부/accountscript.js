// 로그인 체크
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// 페이지 로드 시 로그인 체크
checkAuth();

// 로그아웃 함수
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// 카테고리 정의
const categories = {
    income: ['급여', '용돈', '기타 수입'],
    expense: ['식비', '교통비', '주거비', '통신비', '문화생활', '의료비', '교육비', '기타']
};

// 초기 데이터 로드
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 날짜 입력 필드의 기본값을 오늘로 설정
    document.getElementById('incomeDate').valueAsDate = new Date();
    document.getElementById('expenseDate').valueAsDate = new Date();
    
    // 데이터 표시
    updateDisplay();
});

// 수입 추가 폼 제출
document.getElementById('incomeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const transaction = {
        id: Date.now(),
        type: 'income',
        category: document.getElementById('incomeCategory').value,
        amount: Number(document.getElementById('incomeAmount').value),
        date: document.getElementById('incomeDate').value,
        memo: document.getElementById('incomeMemo').value
    };
    
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    this.reset();
    document.getElementById('incomeDate').valueAsDate = new Date();
    updateDisplay();
});

// 지출 추가 폼 제출
document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const transaction = {
        id: Date.now(),
        type: 'expense',
        category: document.getElementById('expenseCategory').value,
        amount: Number(document.getElementById('expenseAmount').value),
        date: document.getElementById('expenseDate').value,
        memo: document.getElementById('expenseMemo').value
    };
    
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    this.reset();
    document.getElementById('expenseDate').valueAsDate = new Date();
    updateDisplay();
});

// 금액을 원화 형식으로 포맷
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })
        .format(amount)
        .replace('₩', '') + '원';
}

// 거래 내역 표시
function displayTransactions() {
    // 날짜순으로 정렬
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 전체 내역
    const allList = document.getElementById('allTransactionList');
    allList.innerHTML = '';
    
    // 수입 내역
    const incomeList = document.getElementById('incomeTransactionList');
    incomeList.innerHTML = '';
    
    // 지출 내역
    const expenseList = document.getElementById('expenseTransactionList');
    expenseList.innerHTML = '';
    
    sortedTransactions.forEach(transaction => {
        const div = document.createElement('div');
        div.className = `alert ${transaction.type === 'income' ? 'alert-success' : 'alert-danger'} d-flex justify-content-between align-items-center`;
        
        div.innerHTML = `
            <div>
                <strong>${transaction.category}</strong><br>
                <small>${transaction.date} - ${transaction.memo}</small>
            </div>
            <div class="d-flex align-items-center">
                <span class="me-3">${formatCurrency(transaction.amount)}</span>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // 전체 내역에 추가
        allList.appendChild(div.cloneNode(true));
        
        // 수입/지출 내역에 추가
        if (transaction.type === 'income') {
            incomeList.appendChild(div.cloneNode(true));
        } else {
            expenseList.appendChild(div.cloneNode(true));
        }
    });
}

// 거래 삭제
function deleteTransaction(id) {
    if (confirm('이 거래를 삭제하시겠습니까?')) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateDisplay();
    }
}

// 총계 업데이트
function updateSummary() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const balance = totalIncome - totalExpense;
    
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
    document.getElementById('balance').textContent = formatCurrency(balance);
}

// 전체 디스플레이 업데이트
function updateDisplay() {
    updateSummary();
    displayTransactions();
} 