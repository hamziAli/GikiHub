const menuData = {
    "Monday": { Breakfast: ["Cheese Omelette", "Paratha", "Tea"], Lunch: ["Chicken Haleem", "Roti"], Dinner: ["Biryani"] },
    "Tuesday": { Breakfast: ["Chicken Sausage", "Bread", "Tea"], Lunch: ["Lobia", "Roti", "Achar"], Dinner: ["Savour rice", "Chicken"] },
    "Wednesday": { Breakfast: ["Halwa poori", "Chana", "Tea"], Lunch: ["Daal", "Rice", "Salad"], Dinner: ["Chicken spinach", "Rice kheer"] },
    "Thursday": { Breakfast: ["Alu ka paratha", "Yogurt", "Tea"], Lunch: ["Kofta", "Roti", "Fruit"], Dinner: ["Chicken shashlik", "Rice"] },
    "Friday": { Breakfast: ["Paratha", "Keema", "Tea"], Lunch: ["Pulao", "Shami kabab"], Dinner: ["Makhni haandi", "Roti"] },
    "Saturday": { Breakfast: ["French toast", "Tea"], Lunch: ["Curry", "Roti"], Dinner: ["Chicken kabli pulao"] },
    "Sunday": { Breakfast: ["Fry egg", "Omelette", "Bread", "Tea"], Lunch: ["Mix sabzi", "Roti"], Dinner: ["Chicken steam roast", "Rice"] }
};

// Simulated Backend (LocalStorage)
let storedRatings = JSON.parse(localStorage.getItem('giki_mess_db')) || {};

function loadDays() {
    const content = document.getElementById('dynamic-content');
    document.getElementById('mess-subtitle').innerText = "Select a day to explore the menu";
    document.getElementById('back-btn').classList.add('hidden');
    
    let html = '';
    Object.keys(menuData).forEach(day => {
        html += `<div class="day-card" onclick="loadDayMenu('${day}')">${day}</div>`;
    });
    content.innerHTML = html;
}

function loadDayMenu(day) {
    const content = document.getElementById('dynamic-content');
    document.getElementById('mess-subtitle').innerText = `${day}'s Full Menu`;
    document.getElementById('back-btn').classList.remove('hidden');
    
    let html = '';
    const categories = menuData[day];

    for (let mealTime in categories) {
        html += `<div class="meal-label">${mealTime}</div>`;
        categories[mealTime].forEach(dish => {
            const currentAvg = getAverage(dish);
            html += `
                <div class="food-item">
                    <div>
                        <h4 style="font-size:1.1rem;">${dish}</h4>
                        <span class="avg-text">⭐ Avg Rating: ${currentAvg}</span>
                    </div>
                    <select class="rate-select" onchange="submitUserRating('${dish}', this.value, '${day}')">
                        <option value="">Rate 1-10</option>
                        ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}">${n}</option>`).join('')}
                    </select>
                </div>`;
        });
    }
    content.innerHTML = html;
}

function submitUserRating(dish, value, day) {
    if(!value) return;
    if(!storedRatings[dish]) storedRatings[dish] = { sum: 0, count: 0 };

    storedRatings[dish].sum += parseInt(value);
    storedRatings[dish].count += 1;

    localStorage.setItem('giki_mess_db', JSON.stringify(storedRatings));
    loadDayMenu(day); // Refresh to show new average instantly
}

function getAverage(dish) {
    const data = storedRatings[dish];
    if (!data) return "New Item";
    return (data.sum / data.count).toFixed(1) + "/10";
}

// Initial Run
window.onload = loadDays;
