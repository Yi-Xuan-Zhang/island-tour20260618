/*===============核心價值資料========================*/
const values = [
    {
        icon: "🌱",
        title: "在地深度，不走馬看花",
        text: "每一個體驗都由在地嚮導精心設計，帶你看見觀光客看不見的台灣。我們拒絕複製貼上，只提供真正深入在地生活的體驗。"
    },
    {
        icon: "🛡️",
        title: "安全保障，安心出發",
        text: "所有嚮導皆通過嚴格審核與培訓，並持有相關專業證照。我們提供全程旅遊保險，讓你把心思都放在體驗上，不用擔心其他。"
    },
    {
        icon: "🍃",
        title: "綠色永續，守護這片土地",
        text: "每筆訂單的 5% 將捐入台灣環境保育基金。我們的體驗設計以低衝擊為原則，與自然共存，讓下一代的旅人也能看見同樣美麗的台灣。"
    }
];
/*=============== 團隊資料========================*/
const teams = [
    {
        name: "陳建峰",
        position: "共同創辦人、執行長",
        image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800",
        text: "在台灣踢壞了三隻登山鞋，走遍300條秘境步道。相信每一條小路都藏著一個故事。"
    },

    {
        name: "林芷瑄",
        position: "共同創辦人、體驗總監",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
        text: "前旅遊雜誌主編，走訪超過40個國家後，回到臺灣才發現家鄉是最神奇的地方。"
    },

    {
        name: "黃俊宏",
        position: "技術長",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800",
        text: "熱愛跑步與程式碼，用技術讓每個旅人與嚮導之間的連結更流暢、更溫暖。"
    },
    {
        name: "許雅婷",
        position: "嚮導關係經理",
        image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800",
        text: "負責發掘與培訓臺灣的各地嚮導，讓每個在地達人的故事都能被旅人聽見。"
    }
];
/*========================統計數據========================*/
const numbers = [
    { number: "30,000+", text: "服務旅客人數" },
    { number: "150+", text: "精選在地體驗" },
    { number: "200+", text: "精選體驗項目" },
    { number: "98%", text: "旅客滿意度" }
];
/*
========================產生核心價值========================*/

valueGroup.innerHTML = values.map(item => `
            <div class="value-card">
                <div class="icon">${item.icon}</div>
                <h3>${item.title}</h3>
                <p>${item.text}</p>
            </div>
        `).join("")
/*
========================產生團隊資料 ========================*/
teamGroup.innerHTML = teams.map(item => `
            <div class="team-card">
                <img src="${item.image}">
                <div class="team-info">
                    <small>${item.position}</small>
                    <h3>${item.name}</h3>
                    <p>${item.text}</p>
                </div>
            </div>
        `).join("");
/*=======================產生統計資料========================*/
numberGroup.innerHTML = numbers.map(item => `
        <div class="number-card">
        <h3>${item.number
        .replace("+", "<span>+</span>")
        .replace("%", "<span>%</span>")}
        </h3>
        <p>${item.text}</p>
    </div>
    `).join("");