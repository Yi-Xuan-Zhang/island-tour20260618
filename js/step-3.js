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
    // 從 localStorage 取出上一階段暫存的資料
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

    // ==========================================
    // 💡 新增：自動將此筆訂單存入 myOrders 訂單紀錄中
    // ==========================================

    // 1. 取得 HTML 上的訂單編號（避免寫死，直接抓畫面的 tag text）
    const orderTagEl = document.querySelector('.order-tag');
    const orderId = orderTagEl ? orderTagEl.textContent.trim() : 'UNKNOWN_ID';

    // 2. 從 localStorage 拿出所有已存在的訂單，若沒有則初始化為空陣列
    let currentOrders = JSON.parse(localStorage.getItem('myOrders')) || [];

    // 3. 檢查這筆訂單編號是否已經存在（防止使用者重新整理頁面重複塞入）
    const isExist = currentOrders.some(order => order.id === orderId);

    if (!isExist) {
        // 4. 建立新訂單物件（格式與 profile.html 渲染需求相同）
        const newOrder = {
            id: orderId,
            title: realTitle,
            location: realDestination,
            date: realDate.replace(/-/g, '/'), // 轉成 2026/06/17 格式
            session: realSession,
            price: parseInt(realTotalPrice).toLocaleString(),
            status: 'upcoming' // 預設狀態：未出發
        };

        // 5. 將新訂單推入陣列（最新訂單排在最前面）
        currentOrders.unshift(newOrder);

        // 6. 存回 localStorage
        localStorage.setItem('myOrders', JSON.stringify(currentOrders));
    }
});