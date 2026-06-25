// 設定當前基準時間為 2026 年 6 月
const BASE_YEAR = 2026;
const BASE_MONTH = 5; // 0代表一月，5代表六月

let currentYear = 2026;
let currentMonth = 5;

let selectedDateString = null;
let selectedSessionString = null; // 新增：用來記錄目前選中的場次
const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

const datesContainer = document.getElementById('dynamic-dates-container');
const titleDisplay = document.getElementById('calendar-title-display');
const titleWrapper = document.getElementById('calendar-title-wrapper');
const summaryDate = document.getElementById('summary-date');
const summarySession = document.getElementById('summary-session');

function renderCalendar(year, month) {
    datesContainer.innerHTML = '';
    titleDisplay.textContent = `${year} 年 ${monthNames[month]}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();

    // 判斷整個月份是否已經過期 (比 2026 年 6 月更早)
    const isPastMonth = (year < BASE_YEAR) || (year === BASE_YEAR && month < BASE_MONTH);

    // 1. 填補前方上個月的尾數日期（一律反灰防呆）
    for (let i = firstDayIndex; i > 0; i--) {
        const dayNum = prevTotalDays - i + 1;
        const blankDiv = document.createElement('div');
        blankDiv.className = 'date disabled';
        blankDiv.textContent = dayNum;
        datesContainer.appendChild(blankDiv);
    }

    // 2. 渲染當月日期
    for (let day = 1; day <= totalDays; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date';
        dateDiv.textContent = day;

        const monthStr = String(month + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateKey = `${year}-${monthStr}-${dayStr}`;
        dateDiv.setAttribute('data-date', dateKey);

        // 如果該月份已過期，或者在當前月份中屬於今天之前的日子，全部反灰
        if (isPastMonth || (year === BASE_YEAR && month === BASE_MONTH && day < 18)) {
            dateDiv.classList.add('disabled');
        } else {
            // 特殊視覺提示：如果是今天 18 號，且未被選取，給予灰色框外圈
            if (year === BASE_YEAR && month === BASE_MONTH && day === 18) {
                dateDiv.classList.add('is-today');
            }

            // 跨月切換回來時保持選取狀態
            if (selectedDateString === dateKey) {
                dateDiv.classList.add('selected');
            }

            // 註冊有效日期點擊事件
            dateDiv.addEventListener('click', () => {
                document.querySelector('.date.selected')?.classList.remove('selected');
                dateDiv.classList.add('selected');

                selectedDateString = dateKey;
                summaryDate.textContent = dateKey;
                summaryDate.classList.add('selected-value');
            });
        }

        datesContainer.appendChild(dateDiv);
    }
}

// 左右按鈕切換
document.getElementById('prev-month-btn').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
});

document.getElementById('next-month-btn').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
});

// 點擊中央標題切換成選單模式
titleWrapper.addEventListener('click', function (e) {
    if (document.getElementById('select-mode-container')) return;

    const textModeElement = document.getElementById('title-text-mode');
    textModeElement.style.display = 'none';

    const selectContainer = document.createElement('div');
    selectContainer.className = 'calendar-select-mode';
    selectContainer.id = 'select-mode-container';

    // 核心功能：年份選單限制「只能往後選」（由當前 2026 年提供至 2032 年）
    let yearSelectHtml = `<select class="calendar-select" id="year-dropdown">`;
    for (let y = BASE_YEAR; y <= BASE_YEAR + 6; y++) {
        yearSelectHtml += `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y} 年</option>`;
    }
    yearSelectHtml += `</select>`;

    let monthSelectHtml = `<select class="calendar-select" id="month-dropdown">`;
    for (let m = 0; m < 12; m++) {
        monthSelectHtml += `<option value="${m}" ${m === currentMonth ? 'selected' : ''}>${monthNames[m]}</option>`;
    }
    monthSelectHtml += `</select>`;

    const okBtn = document.createElement('button');
    okBtn.style = "padding: 4px 10px; background: var(--brand-primary); color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer;";
    okBtn.textContent = "完成";

    selectContainer.innerHTML = yearSelectHtml + monthSelectHtml;
    selectContainer.appendChild(okBtn);
    titleWrapper.appendChild(selectContainer);

    e.stopPropagation();

    function closeSelectMode() {
        const ySelect = document.getElementById('year-dropdown');
        const mSelect = document.getElementById('month-dropdown');

        if (ySelect && mSelect) {
            currentYear = parseInt(ySelect.value);
            currentMonth = parseInt(mSelect.value);
            renderCalendar(currentYear, currentMonth);
        }

        selectContainer.remove();
        textModeElement.style.display = 'flex';
        document.removeEventListener('click', closeSelectMode);
    }

    okBtn.addEventListener('click', function (evt) {
        evt.stopPropagation();
        closeSelectMode();
    });

    document.addEventListener('click', closeSelectMode);
    selectContainer.addEventListener('click', (evt) => evt.stopPropagation());
});

// 右欄場次連動
const sessionButtons = document.querySelectorAll('.session-btn');
sessionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.session-btn.active')?.classList.remove('active');
        btn.classList.add('active');

        const selectedSessionVal = btn.getAttribute('data-session');
        if (selectedSessionVal) {
            selectedSessionString = selectedSessionVal; // 更新選取的場次變數
            summarySession.textContent = selectedSessionVal;
            summarySession.classList.add('selected-value');
        }
    });
});

// 頁面初次載入
renderCalendar(currentYear, currentMonth);

/* ==========================================================================
  【核心修改】監聽「下一步」按鈕，執行防呆驗證並將真實資料存入 localStorage
  ========================================================================== */
document.getElementById('next-step-btn').addEventListener('click', function (e) {
    e.preventDefault();

    // 防呆驗證：檢查使用者是否真的點選了日期與場次
    if (!selectedDateString) {
        alert('請先在日曆上選擇您要體驗的日期！');
        return;
    }
    if (!selectedSessionString) {
        alert('請選擇您要參加的場次（上午場或下午場）！');
        return;
    }

    // 成功通過驗證，將正確的資料存入 localStorage 暫存區
    localStorage.setItem('booking_date', selectedDateString);
    localStorage.setItem('booking_session', selectedSessionString);

    // 真正執行跨網頁跳轉
    window.location.href = 'step-2.html';
});

/* ==========================================================================
  【動態連動】載入 localStorage 產品資料並渲染摘要卡片
  ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const title = localStorage.getItem('booking_title') || '宜蘭稻田生態農遊體驗';
    const image = localStorage.getItem('booking_image') || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80';
    const destination = localStorage.getItem('booking_destination') || '宜蘭';
    const duration = localStorage.getItem('booking_duration') || '半天';
    const quantity = localStorage.getItem('booking_quantity') || '1';
    const totalPrice = localStorage.getItem('booking_total_price') || '1100';

    // 取得 DOM 元素
    const imgEl = document.getElementById('summary-product-img');
    const titleEl = document.getElementById('summary-activity-title');
    const destEl = document.getElementById('summary-destination');
    const durEl = document.getElementById('summary-duration');
    const qtyEl = document.getElementById('summary-quantity');
    const priceEl = document.getElementById('summary-total-price');

    // 填入資料
    if (imgEl) imgEl.src = image;
    if (titleEl) titleEl.textContent = title;
    if (destEl) destEl.textContent = destination;
    if (durEl) durEl.textContent = duration;
    if (qtyEl) qtyEl.textContent = `${quantity} 人`;
    if (priceEl) {
        priceEl.textContent = `NT$ ${parseInt(totalPrice).toLocaleString()}`;
    }
});
