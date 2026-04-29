// Глобальные переменные
let num;        // загаданное число
let tryCount;   // количество попыток
let isGameActive; // активна ли игра
let player;     // игрок
let records = []; // рекорды

// Работа с localStorage
// Загрузка рекордов
function loadRecordsFromStorage() {
    let savedRecords = localStorage.getItem('gameRecords');
    if (savedRecords !== null) {
        records = JSON.parse(savedRecords);
        showLeaderboard();
    }
}

// Сохранение рекордов
function saveRecordsToStorage() {
    localStorage.setItem('gameRecords', JSON.stringify(records));
}

// Генерация рандомного числа
function generateNumber() {
    num = Math.floor(Math.random() * 100) + 1;
}

// Создание новой игры
function startGame(playerName) {
    player = playerName;
    generateNumber();
    tryCount = 0;
    isGameActive = true;
    
    document.getElementById('currentPlayerName').innerHTML = player;
    document.getElementById('attemptsCount').innerHTML = '0';
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').disabled = false;
    document.getElementById('checkBtn').disabled = false;
    
    let messageDiv = document.getElementById('message');
    messageDiv.innerHTML = '';
    messageDiv.className = 'message';
    
    showMessage('Игра началась. Введите число от 1 до 100', 'info');
}

// Проверка числа, подсказка
function checkGuess() {
    if (!isGameActive) {
        showMessage('Игра закончена, нажмите "Новая игра" для продолжения', 'error');
        return;
    }
    
    let guessInput = document.getElementById('guessInput');
    let guess = parseInt(guessInput.value);
    
    if (isNaN(guess)) {
        showMessage('Введите число', 'error');
        guessInput.value = '';
        return;
    }
    
    if (guess < 1 || guess > 100) {
        showMessage('Число должно быть от 1 до 100', 'error');
        guessInput.value = '';
        return;
    }
    
    tryCount++;
    document.getElementById('attemptsCount').innerHTML = tryCount;
    
    if (guess === num) {
        isGameActive = false;
        showMessage('Поздравляю. Вы угадали число ' + num + ' за ' + tryCount + ' попыток', 'success');
        
        addRecord(player, tryCount);
        
    } else if (guess > num) {
        showMessage('Загаданное число меньше, чем ' + guess, 'info');
        guessInput.value = '';
        
    } else {
        showMessage('Загаданное число больше, чем ' + guess, 'info');
        guessInput.value = '';
    }
}

// Новая игра
function newGame() {
    let newName = prompt('Введите ваше имя для новой игры:', player);
    
    if (newName === null || newName.trim() === '') {
        showMessage('Имя не может быть пустым', 'error');
        return;
    }
    
    startGame(newName.trim());
}

// Добавление или обновление рекордов
function addRecord(name, attemptsCount) {
    let existingIndex = -1;
    for (let i = 0; i < records.length; i++) {
        if (records[i].name === name) {
            existingIndex = i;
            break;
        }
    }
    
    if (existingIndex !== -1) {
        if (attemptsCount < records[existingIndex].attempts) {
            records[existingIndex].attempts = attemptsCount;
        } else {
            return;
        }
    } else {
        let newRecord = {
            name: name,
            attempts: attemptsCount
        };
        records.push(newRecord);
    }
    
    sortRecords();
    
    if (records.length > 10) {
        records = records.slice(0, 10);
    }
    
    saveRecordsToStorage();
    showLeaderboard();
}

// Пузырьковая сортировка рекордов 
function sortRecords() {
    for (let i = 0; i < records.length - 1; i++) {
        for (let j = 0; j < records.length - i - 1; j++) {
            if (records[j].attempts > records[j + 1].attempts) {
                let temp = records[j];
                records[j] = records[j + 1];
                records[j + 1] = temp;
            }
        }
    }
}

// Отображение таблицы
function showLeaderboard() {
    let leaderboardDiv = document.getElementById('leaderboard');
    
    if (records.length === 0) {
        leaderboardDiv.innerHTML = '<p>Пока что рекордов не существует</p>';
        return;
    }

    let html = '<table class="leaderboard-table">';
    html += '<thead><tr><th>Место</th><th>Игрок</th><th>Попытки</th></tr></thead>';
    html += '<tbody>';
    
    for (let i = 0; i < records.length; i++) {
        html += '<tr>';
        html += '<td>' + (i + 1) + '</td>';
        html += '<td>' + records[i].name + '</td>';
        html += '<td>' + records[i].attempts + '</td>';
        html += '</tr>';
    }
    
    html += '</tbody></table>';
    leaderboardDiv.innerHTML = html;
}

// Отображение сообщений 
function showMessage(text, type) {
    let messageDiv = document.getElementById('message');
    messageDiv.innerHTML = text;
    messageDiv.className = 'message ' + type;
}

// Кнопка "Начать игру"
document.getElementById('startGameBtn').onclick = function() {
    let nameInput = document.getElementById('playerName');
    let playerName = nameInput.value.trim();
    
    if (playerName === '') {
        showMessage('Введите ваше имя', 'error');
        return;
    }
    
    document.getElementById('nameSection').style.display = 'none';
    document.getElementById('gameSection').style.display = 'block';
    
    startGame(playerName);
};

// Кнопка "Проверить"
document.getElementById('checkBtn').onclick = function() {
    checkGuess();
};

// Кнопка "Новая игра"
document.getElementById('newGameBtn').onclick = function() {
    newGame();
};

loadRecordsFromStorage(); //загрузка
