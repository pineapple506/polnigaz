// Проверяем авторизацию и показываем контент
function initializePage() {
    const login = localStorage.getItem('login');
    if (!login) {
        // Перенаправляем на страницу авторизации, если пользователь не авторизован
        window.location.href = 'auth.html';
    } else {
        // Показываем защищённый контент
        document.getElementById('protected-content').style.display = 'block';

        // Добавляем информацию о пользователе в заголовок
        document.getElementById('user-info').innerHTML = `
            <p>Добро пожаловать, ${login}</p>
            <button id="logout-btn">Выйти</button>
        `;

        // Обработчик выхода
        document.getElementById('logout-btn').addEventListener('click', function () {
            localStorage.clear();
            window.location.href = 'auth.html';
        });
    }
}

// Проверка авторизации и обновление состояния
document.getElementById('authForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const birthDate = document.getElementById('birthDate').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    let valid = true;

    // Очистка предыдущих ошибок
    document.getElementById('login-error').textContent = '';
    document.getElementById('birthDate-error').textContent = '';
    document.getElementById('gender-error').textContent = '';

    // Проверка логина
    const loginPattern = /^[а-яА-ЯёЁ0-9]{4,10}$/;
    if (!loginPattern.test(login)) {
        document.getElementById('login-error').textContent = 'Логин должен содержать от 4 до 10 символов и только русские буквы и цифры!';
        valid = false;
    }

    // Проверка даты рождения
    const birthDateObj = new Date(birthDate);
    const currentDate = new Date();
    const minDate = new Date('1950-01-01');
    if (birthDateObj < minDate || birthDateObj > currentDate) {
        document.getElementById('birthDate-error').textContent = 'Дата рождения должна быть не раньше 1 января 1950 года и не позже текущей даты.';
        valid = false;
    }

    // Проверка пола
    if (!gender) {
        document.getElementById('gender-error').textContent = 'Пожалуйста, выберите пол!';
        valid = false;
    }

    if (!valid) {
        return; // Если есть ошибки, не продолжаем выполнение
    }

    // Сохраняем информацию о пользователе
    localStorage.setItem('login', login);
    localStorage.setItem('birthDate', birthDate);
    localStorage.setItem('gender', gender.value);

    // Перенаправляем на страницу с описанием
    window.location.href = 'index.html';
});

// Проверка авторизации при загрузке страницы
window.onload = function () {
    const login = localStorage.getItem('login');
    const gender = localStorage.getItem('gender');
    const birthDate = localStorage.getItem('birthDate');
    if (login) {
        // Если пользователь авторизован, показываем его логин и кнопку "Выйти"
        document.getElementById('user-info').innerHTML = `
            <p>Добро пожаловать, ${login}</p>
            <button id="logout-btn">Выйти</button>
        `;

        // Обработчик выхода
        document.getElementById('logout-btn').addEventListener('click', function () {
            localStorage.clear();
            window.location.href = 'auth.html';
        });
    } else {
        // Если пользователь не авторизован, просто показываем ссылку на авторизацию
        document.getElementById('user-info').innerHTML = `
            <a href="auth.html">Войти</a>
        `;
    }
    // инициализация для первой загрузки
    if (document.getElementById('protected-content')) {
        initializePage();
    }
    if (document.getElementById('slider')) {
        showSlide(currentSlide);
    }
    if (document.getElementById('profile')) {
        loadProfileData();
    }
};

// Галерея слайдер
let currentSlide = 0;
const slides = document.querySelectorAll('#slider .slide');
const slider = document.getElementById('slider');

function showSlide(index) {
    if (index < 0) {
        index = slides.length - 1;
    }
    if (index >= slides.length) {
        index = 0;
    }

    slider.style.transform = `translateX(-${index * 100}%)`;
    document.getElementById('slide-number').textContent = `${index + 1} из ${slides.length}`;
    currentSlide = index;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Инициализация слайдера
if (document.getElementById('slider')) {
    showSlide(currentSlide);
}


// Тест
document.getElementById('test-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    let score = 0;
    const correctAnswers = {
        q1: '2013',
        q2: 'botfather',
        q3: 'End-to-End',
        q4: 'C++'
    };
    const q1Answer = document.getElementById('q1').value.trim();
    const q2Answer = document.getElementById('q2').value.trim();
    const q3Answer = document.querySelector('input[name="q3"]:checked');
    const q4Answer = document.getElementById('q4').value;

    // Проверка и вывод результатов для каждого вопроса
    function checkAnswer(questionId, userAnswer, correctAnswer) {
        const resultDiv = document.getElementById(`${questionId}-result`);
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase() || (correctAnswer === 'End-to-End' && q3Answer && q3Answer.value === correctAnswer)) {
            resultDiv.textContent = 'Верно!';
            resultDiv.classList.remove('incorrect');
            resultDiv.classList.add('correct');
            return true;
        } else {
            resultDiv.textContent = `Неверно, правильный ответ: ${correctAnswer}`;
            resultDiv.classList.remove('correct');
            resultDiv.classList.add('incorrect');
            return false;
        }
    }

    if (checkAnswer('q1', q1Answer, correctAnswers.q1)) score++;
    if (checkAnswer('q2', q2Answer, correctAnswers.q2)) score++;
    if (checkAnswer('q3', q3Answer, correctAnswers.q3)) score++;
    if (checkAnswer('q4', q4Answer, correctAnswers.q4)) score++;


    document.getElementById('result').textContent = `Ваш результат: ${score} из 4`;
    document.getElementById('restart-test').style.display = 'block';
    localStorage.setItem('testScore', score);
});

document.getElementById('restart-test')?.addEventListener('click', function () {
    const testForm = document.getElementById('test-form');
    testForm.reset();
    document.getElementById('result').textContent = '';
    document.getElementById('restart-test').style.display = 'none';
    const resultDivs = document.querySelectorAll('[id$="-result"]');
    resultDivs.forEach(div => {
        div.textContent = '';
        div.classList.remove('incorrect', 'correct');
    });
});

function searchGlossary() {
    const searchInput = document.getElementById('search');
    const searchTerm = searchInput.value.toLowerCase();
    const terms = document.querySelectorAll('#glossary-list .term');

    terms.forEach(term => {
        const termText = term.textContent.toLowerCase();
        if (termText.includes(searchTerm)) {
            term.style.display = 'block';
        } else {
            term.style.display = 'none';
        }
    });
}

function showTerm(term) {
    const termDescription = document.getElementById('term-description');
    let description = '';
    switch (term) {
        case 'Telegram':
            description = 'Telegram — это бесплатный мессенджер, позволяющий обмениваться сообщениями и файлами.';
            break;
        case 'Bot':
            description = 'Боты Telegram — это аккаунты, управляемые программным обеспечением, которые могут выполнять различные задачи.';
            break;
        case 'Channel':
            description = 'Каналы Telegram — это инструменты для трансляции сообщений широкой аудитории.';
            break;
        case 'Group':
            description = 'Группы Telegram — это чаты для общения нескольких пользователей.';
            break;
        case 'Secret Chat':
            description = 'Секретные чаты Telegram обеспечивают сквозное шифрование и самоуничтожение сообщений.';
            break;
        case 'Sticker':
            description = 'Стикеры Telegram — это анимированные изображения для выражения эмоций.';
            break;
        case 'Message':
            description = 'Сообщения Telegram — текстовые, графические или мультимедийные данные.';
            break;
        case 'Cloud Storage':
            description = 'Telegram позволяет хранить сообщения и файлы в облаке.';
            break;
        case 'Encryption':
            description = 'Telegram использует шифрование для защиты пользовательских данных.';
            break;
        case 'Broadcast':
            description = 'Рассылка Telegram — отправка одного сообщения нескольким контактам.';
            break;
        default:
            description = 'Описание для данного термина не найдено.';
    }
    termDescription.innerHTML = `<p>${description}</p>`;
}

function loadProfileData() {
    const login = localStorage.getItem('login');
    const testScore = localStorage.getItem('testScore');
    const gender = localStorage.getItem('gender');
    const birthDate = localStorage.getItem('birthDate');

    if (login) {
        document.getElementById('user-login').textContent = login;
    }
    if (gender) {
        document.getElementById('user-gender').textContent = gender === 'male' ? 'Мужской' : 'Женский';
    }
    if (birthDate) {
        const birthDateObj = new Date(birthDate);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDateObj.getFullYear();
        document.getElementById('user-age').textContent = age;
    }

    if (testScore) {
        document.getElementById('user-score').textContent = `${testScore} балл(ов)`;
    }
}