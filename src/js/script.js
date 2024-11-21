'use strict';

function select(selector, scope = document) {
  return scope.querySelector(selector);
}

function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}

const input = select('.input');
const search = select('.search');
const display = select('.display');
const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

const clearDisplay = () => { display.innerHTML = ''; };

function isLeapYear(year) {
  return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
}

function getDaysInMonth(month, year) {
  const daysInMonth = [
    31, // January
    28, // February (29 if leap year)
    31, // March
    30, // April
    31, // May
    30, // June
    31, // July
    31, // August
    30, // September
    31, // October
    30, // November
    31, // December
  ];

  if (month === 1 && isLeapYear(year)) {
    return 29;
  }

  return daysInMonth[month];
}

function checkLength() {
  const dateLength = input.value.length;
  if (dateLength < 8 || dateLength > 10) {
    throw new Error('Please use DD/MM/YYYY.');
  }
}

function getDate() {
  const userInput = input.value;
  const dateParts = userInput.split('/');
  
  if (dateParts.length === 3) {
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);

    const daysInMonth = getDaysInMonth(month, year);
    
    if (day < 1 || day > daysInMonth) {
      throw new Error(`Invalid day. Please use a number between 1 and ${daysInMonth}.`);
    }
    
    if (month < 0 || month > 11) {
      throw new Error('Invalid month. Please use a number between 1 and 12.');
    }
    
    if (year < 1000) {
      throw new Error('Invalid year. Please use a number greater than 999.');
    }

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error('Please enter numbers only.');
    }

    const selectedDate = new Date(year, month, day);

    const today = new Date();
    if (selectedDate > today) {
      throw new Error('Blastfomy you time traveller');
    }

    console.log(selectedDate);
    return selectedDate;
  } else {
    throw new Error('Please use DD/MM/YYYY.');
  }
}

function getUserBirthday() {
  const birthday = getDate();
  return birthday;
}

function getDayOfWeek() {
  const birthday = getUserBirthday();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[birthday.getDay()];
  return dayOfWeek;
}

function ageInYears() {
  const birthday = getUserBirthday();
  const today = new Date();
  const age = today.getFullYear() - birthday.getFullYear();
  return age;
}

function ageInDays() {
  const birthday = getUserBirthday();
  const today = new Date();
  const timeDifference = today - birthday; 
  const ageInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return ageInDays;
}

function daysUntilNextBirthday() {
  const birthday = getUserBirthday();
  const today = new Date();
  const nextBirthday = new Date(birthday);
  nextBirthday.setFullYear(today.getFullYear());

  if (today > nextBirthday) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  const timeDifference = nextBirthday - today;
  const daysUntilBirthday = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return daysUntilBirthday;
}

function typeWriterEffect(text, element, delay = 25) {
  let i = 0;
  element.innerHTML = '';

  const lines = text.split('\n');
  let lineIndex = 0;
  
  function type() {
    if (i < lines[lineIndex].length) {
      element.innerHTML += lines[lineIndex].charAt(i);
      i++;
      setTimeout(type, delay);
    } else {
      if (lineIndex < lines.length - 1) {
        lineIndex++; 
        i = 0;
        if (lineIndex > 0) {
          element.innerHTML += '<br>';
        }
        setTimeout(type, delay); 
      }
    }
  }
  
  type();
}



listen('click', search, () => {
  try {
    clearDisplay();
    const birthday = getDate();
    const dayOfWeek = getDayOfWeek();
    const years = ageInYears();  
    const days = ageInDays(); 
    const daysUntilBirthday = daysUntilNextBirthday();
    
    const outputText = `
      Your birthday is: ${birthday.toLocaleDateString('en-CA', options)}
      You were born on: ${dayOfWeek}
      You are ${days} days old.
      You are ${years} years old.
      Your birthday is in ${daysUntilBirthday} days.
    `;

    typeWriterEffect(outputText, display); 
    input.value = '';
  } catch (error) {
    input.focus();
    typeWriterEffect(error.message, display)
  }
});

