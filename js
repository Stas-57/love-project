const nick1Input = document.getElementById('nick1');
const nick2Input = document.getElementById('nick2');
const btn = document.getElementById('calcBtn');
const resultDiv = document.getElementById('result');
const error1 = document.getElementById('error1');
const error2 = document.getElementById('error2');

const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Проверка настоящего имени: только русские буквы, от 3 до 20 символов
function isRealName(name) {
  const trimmed = name.trim();
  const nameRegex = /^[а-яё]{3,20}$/i;
  return nameRegex.test(trimmed);
}

// Очищаем и приводим имя к нижнему регистру
function cleanName(name) {
  return name.trim().toLowerCase();
}

// Список "особых имён" — всегда 100%
function lovePercent(n1, n2) {
  const n1c = cleanName(n1);
  const n2c = cleanName(n2);

  const yulyaVariants = ['юля', 'юлечка', 'юлька', 'ульяна', 'юльяна'];
  const stasVariants = ['стас', 'стасик', 'станислав'];

  const isYulya = yulyaVariants.includes(n1c) && stasVariants.includes(n2c);
  const isStas = stasVariants.includes(n1c) && yulyaVariants.includes(n2c);

  if (isYulya || isStas) {
    return 100;
  }

  const sumChars = (str) => [...str].reduce((a, c) => a + c.charCodeAt(0), 0);
  return (sumChars(n1c) + sumChars(n2c)) % 50 + 50;
}

// Анимация роста числа до процента
function animateCountUp(target, duration = 1500) {
  return new Promise(resolve => {
    let start = 0;
    const stepTime = 30;
    const steps = duration / stepTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      start = Math.floor(target * (currentStep / steps));
      resultDiv.textContent = start + '%';
      if (currentStep >= steps) {
        clearInterval(interval);
        resultDiv.textContent = target + '%';
        resolve();
      }
    }, stepTime);
  });
}

// При нажатии кнопки — проверка и расчёт
btn.addEventListener('click', async () => {
  const nick1 = nick1Input.value.trim();
  const nick2 = nick2Input.value.trim();

  error1.textContent = '';
  error2.textContent = '';
  resultDiv.style.opacity = '0';

  let valid = true;

  if (!isRealName(nick1)) {
    error1.textContent = 'Введите настоящее имя (только русские буквы, минимум 3 символа)';
    valid = false;
  }

  if (!isRealName(nick2)) {
    error2.textContent = 'Введите настоящее имя (только русские буквы, минимум 3 символа)';
    valid = false;
  }

  if (!valid) return;

  if (cleanName(nick1) === cleanName(nick2)) {
    alert('Имена не должны совпадать!');
    return;
  }

  btn.disabled = true;
  resultDiv.style.opacity = '1';
  resultDiv.style.animation = 'pulseGlow 1.5s ease infinite';

  const percent = lovePercent(nick1, nick2);
  await animateCountUp(percent, 1800);

  btn.disabled = false;
  resultDiv.style.animation = '';
});

// Enter нажимает кнопку
[nick1Input, nick2Input].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btn.click();
    }
  });
});

// Открытие модального окна
infoBtn.addEventListener('click', () => {
  infoModal.removeAttribute('hidden');
  infoModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  closeModalBtn.focus();
});

// Закрытие модального окна
closeModalBtn.addEventListener('click', () => {
  infoModal.setAttribute('hidden', '');
  infoModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  infoBtn.focus();
});

// Закрытие модалки по клику вне окна
infoModal.addEventListener('click', (e) => {
  if (e.target === infoModal) {
    closeModalBtn.click();
  }
});

// Закрытие по Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !infoModal.hasAttribute('hidden')) {
    closeModalBtn.click();
  }
});
