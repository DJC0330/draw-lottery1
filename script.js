// 初始化数据
let items = [];
let history = [];
let drawnItems = [];

// 获取DOM元素
const itemInput = document.getElementById('itemInput');
const addButton = document.getElementById('addButton');
const itemList = document.getElementById('itemList');
const drawButton = document.getElementById('drawButton');
const resetButton = document.getElementById('resetButton');
const drawResult = document.getElementById('drawResult');
const historyList = document.getElementById('historyList');
const repeatCheck = document.getElementById('repeatCheck');

// 添加抽签项
addButton.addEventListener('click', function() {
    const item = itemInput.value.trim();
    if (item) {
        items.push(item);
        itemInput.value = '';
        updateItemList();
    }
});

// 按Enter键添加
itemInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addButton.click();
    }
});

// 更新抽签列表
function updateItemList() {
    itemList.innerHTML = '';
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item}
            <button class="remove-item" data-index="${index}">删除</button>
        `;
        itemList.appendChild(li);
    });
    
    // 添加删除事件
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            items.splice(index, 1);
            updateItemList();
        });
    });
}

// 开始抽签
drawButton.addEventListener('click', function() {
    // 确定可抽签的项
    let availableItems = [];
    if (repeatCheck.checked) {
        // 允许重复抽签
        availableItems = items;
    } else {
        // 不允许重复抽签，从剩余项中选择
        availableItems = items.filter(item => !drawnItems.includes(item));
    }
    
    if (availableItems.length === 0) {
        if (items.length === 0) {
            drawResult.textContent = '请先添加抽签项';
        } else {
            drawResult.textContent = '所有项已抽完';
        }
        return;
    }
    
    // 动画效果
    drawButton.disabled = true;
    drawResult.textContent = '抽签中...';
    
    let counter = 0;
    const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        drawResult.textContent = availableItems[randomIndex];
        drawResult.classList.add('pulse');
        setTimeout(() => drawResult.classList.remove('pulse'), 100);
        counter++;
        
        if (counter >= 20) {
            clearInterval(interval);
            const finalIndex = Math.floor(Math.random() * availableItems.length);
            const winner = availableItems[finalIndex];
            drawResult.textContent = `恭喜：${winner}`;
            drawResult.classList.add('pulse');
            setTimeout(() => drawResult.classList.remove('pulse'), 300);
            
            // 记录已抽中的项（如果不允许重复）
            if (!repeatCheck.checked) {
                drawnItems.push(winner);
            }
            
            // 添加到历史记录
            history.unshift(`[${new Date().toLocaleString()}] ${winner}`);
            if (history.length > 10) history.pop(); // 只保留最近10条
            updateHistory();
            
            drawButton.disabled = false;
        }
    }, 100);
});

// 重置功能
resetButton.addEventListener('click', function() {
    items = [];
    history = [];
    drawnItems = [];
    updateItemList();
    updateHistory();
    drawResult.textContent = '点击开始抽签';
});

// 更新历史记录
function updateHistory() {
    historyList.innerHTML = '';
    history.forEach(record => {
        const li = document.createElement('li');
        li.textContent = record;
        historyList.appendChild(li);
    });
}

// 初始化页面
updateItemList();
updateHistory();