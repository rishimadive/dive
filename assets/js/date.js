// date.js

const times = ['8:00-9:00', '9:30-10:30', '11:00-12:00', '13:30-14:30', '15:00-16:00'];
const weekdays = ['週一', '週二', '週三', '週四', '週五'];
let currentWeekOffset = 0;

// 計算本週一
function getMondayOfWeek(offset) {
    const today = new Date();
    const day = today.getDay(); // 0=Sunday, 1=Monday
    const monday = new Date(today);
    const diffToMonday = (day === 0 ? -6 : 1 - day);
    monday.setDate(today.getDate() + diffToMonday + offset * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
}

function formatDate(date) {
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

function generateFakeStatus() {
    return Math.random() > 0.5 ? 'available' : 'booked';
}

function renderScheduleTable() {
    const container = document.getElementById('scheduleTable');
    container.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date(); // 目前時間
    const monday = getMondayOfWeek(currentWeekOffset);

    for (let i = 0; i < weekdays.length; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        currentDate.setHours(0, 0, 0, 0);

        const dateStr = `${formatDate(currentDate)} ${weekdays[i]}`;
        const dateRow = document.createElement('div');
        dateRow.className = 'day-header';

        // 今天加上紅字
        if (currentDate.getTime() === today.getTime()) {
            dateRow.classList.add('today-label');
        }

        dateRow.innerText = dateStr;
        container.appendChild(dateRow);

        const row = document.createElement('div');
        row.className = 'schedule-row';

        times.forEach(time => {
            const block = document.createElement('div');
            const [startTime, endTime] = time.split('-');
            const endHour = parseInt(endTime.split(':')[0]);
            const endMin = parseInt(endTime.split(':')[1]);

            const endDateTime = new Date(currentDate);
            endDateTime.setHours(endHour, endMin, 0, 0);

            // 過去的日子 或 今天已過時段 → 灰色
            if (currentDate < today || (currentDate.getTime() === today.getTime() && now > endDateTime)) {
                block.className = 'time-block booked';
            } else {
                block.className = `time-block ${generateFakeStatus()}`;
            }

            block.innerText = time;
            row.appendChild(block);
        });

        container.appendChild(row);
    }

    // 顯示週範圍
    const weekText = document.getElementById('weekRange');
    weekText.innerText =
        currentWeekOffset === 0 ? '本週' :
        `${currentWeekOffset > 0 ? '下' : '上'}${Math.abs(currentWeekOffset)}週`;

    // 控制「上一週」按鈕隱藏
    const prevBtn = document.getElementById('prevBtn');
    if (currentWeekOffset <= 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }
}

function changeWeek(offset) {
    currentWeekOffset += offset;
    renderScheduleTable();
}

// 初始化畫面
renderScheduleTable();