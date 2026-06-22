const form = document.getElementById('booking-form-element');
const paymentMethods = document.querySelectorAll('.payment-method');
const creditCardSection = document.getElementById('credit-card-section');

// 信用卡欄位參照
const cardInputs = [
    document.getElementById('card-num-input'),
    document.getElementById('card-date-input'),
    document.getElementById('card-cvv-input')
];

// 付款方式動態切換互動
paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
        paymentMethods.forEach(m => m.classList.remove('active'));
        method.classList.add('active');

        const radio = method.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;

            // 防呆連動：如果切換至 LINE Pay 或 Apple Pay，隱藏信用卡欄位並取消 required
            if (radio.value === 'credit-card') {
                creditCardSection.style.display = 'flex';
                cardInputs.forEach(input => input.setAttribute('required', ''));
            } else {
                creditCardSection.style.display = 'none';
                cardInputs.forEach(input => input.removeAttribute('required'));
            }
        }
    });
});

// 點擊付款按鈕時觸發
function handleFormSubmit(event) {
    form.classList.add('form-submitted');

    // 如果通過 HTML5 的內建必填檢查，則允許放行跳轉頁面
    if (form.checkValidity()) {
        event.preventDefault(); // 阻擋預設送出行為

        // 取得第二頁填寫的聯絡人姓名
        const contactName = document.getElementById('name-input').value;

        // 存入暫存，讓第三頁可以抓取這個名字顯示
        localStorage.setItem('booking_name', contactName);

        // 成功跳轉到第三頁
        location.href = 'step-3.html';
    } else {
        event.preventDefault();
    }
}
