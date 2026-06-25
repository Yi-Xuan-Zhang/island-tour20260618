// 設定拉炮動畫持續 1 秒 (1 * 1000 毫秒)
var duration = 1 * 1000;
var end = Date.now() + duration;

// 套用品牌視覺色彩：深藍、橘色、金色、淡綠
var colors = ['#1B2A4A', '#E8613C', '#F4D03F', '#4A7C59'];

(function frame() {
    // 從畫面左下角往右上噴發
    confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 1 },
        colors: colors
    });

    // 從畫面右下角往左上噴發
    confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 },
        colors: colors
    });

    // 如果時間還沒到 1 秒，就繼續請求下一幀動畫
    if (Date.now() < end) {
        requestAnimationFrame(frame);
    }
}());

document.addEventListener('DOMContentLoaded', function () {
    // 從 localStorage 取出資料
    const realTitle = localStorage.getItem('booking_title') || '清水斷崖獨木舟探險';
    const realDestination = localStorage.getItem('booking_destination') || '花蓮';
    const realDate = localStorage.getItem('booking_date') || '2026-06-17';
    const realSession = localStorage.getItem('booking_session') || '上午場 09:00';
    const realName = localStorage.getItem('booking_name') || '旅客姓名';
    const realTotalPrice = localStorage.getItem('booking_total_price') || '1800';

    // 找到第三頁對應的欄位並塞入資料
    const valueElements = document.querySelectorAll('.order-info-list .value');
    const priceEl = document.getElementById('summary-total-price');

    if (valueElements.length >= 5) {
        valueElements[0].textContent = realTitle;       // 體驗名稱
        valueElements[1].textContent = realDestination; // 目的地
        valueElements[2].textContent = realDate;        // 體驗日期
        valueElements[3].textContent = realSession;     // 場次
        valueElements[4].textContent = realName;        // 聯絡人
    }

    if (priceEl) {
        priceEl.textContent = `NT$ ${parseInt(realTotalPrice).toLocaleString()}`;
    }
});
