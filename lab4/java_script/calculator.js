"use strict";

var input = document.getElementById('input'),
    number = document.querySelectorAll('.numbers div'),
    operator = document.querySelectorAll('.operators div'),
    result = document.getElementById('result'),
    clear = document.getElementById('clear'),
    deleteButton = document.getElementById('delete'), // Добавленная строка для кнопки "DEL"
    resultDisplayed = false;

// Функция приоритета операторов
function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else if (operation == '×' || operation == '÷') {
        return 2;
    } else {
        return 0;
    }
}

// Функция проверки, является ли строка числом
function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Функция проверки, является ли строка цифрой
function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Функция проверки, является ли строка оператором
function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция токенизации выражения
function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (const char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')' || char == '×' || char == '÷') {
          if (char == '×') {
              tokens.push('*');
          } else if (char == '÷') {
              tokens.push('/');
          } else {
              tokens.push(char);
          }
      }
      
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция компиляции в польскую нотацию
function compile(str) {
    let out = [];
    let stack = [];
    for (const token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && 
                   isOperation(stack[stack.length - 1]) && 
                   priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

// Функция вычисления выражения в польской нотации
function evaluate(str) {
    const stack = [];
    const tokens = str.split(' ');

    for (const token of tokens) {
        if (isNumeric(token)) {
            stack.push(parseFloat(token));
        } else if (isOperation(token)) {
            const operand2 = stack.pop();
            const operand1 = stack.pop();

            switch (token) {
                case '+':
                    stack.push(operand1 + operand2);
                    break;
                case '-':
                    stack.push(operand1 - operand2);
                    break;
                case '*':
                    stack.push(operand1 * operand2);
                    break;
                case '/':
                    stack.push(operand1 / operand2);
                    break;
            }
        }
    }

    return stack[0];
}

// Функция для добавления символов на экран
function appendToInput(value) {
    if (resultDisplayed === false) {
        input.innerHTML += value;
    } else {
        resultDisplayed = false;
        input.innerHTML = value;
    }
}

// Функция для удаления последнего символа с экрана
function deleteLast() {
    var currentString = input.innerHTML;
    input.innerHTML = currentString.substring(0, currentString.length - 4);
    resultDisplayed = false;
}

// Функция для форматирования результата
function formatResult(result) {
    // Если результат - целое число, не добавляем десятичные нули
    if (Number.isInteger(result)) {
        return result.toString();
    } else {
        return result.toFixed(2);
    }
}

// Функция для вычисления и отображения результата
function calculateAndDisplay() {
    try {
        var inputString = input.innerHTML;
        var rpnExpression = compile(inputString);
        var resultValue = evaluate(rpnExpression);
        input.innerHTML = formatResult(resultValue);
        resultDisplayed = true;
    } catch (error) {
        input.innerHTML = "Error";
        resultDisplayed = true;
    }
}

// Назначаем обработчики для цифр
for (var i = 0; i < number.length; i++) {
    number[i].addEventListener("click", function (e) {
        appendToInput(e.target.innerHTML);
    });
}

// Назначаем обработчики для операторов
for (var i = 0; i < operator.length; i++) {
    operator[i].addEventListener("click", function (e) {
        var currentString = input.innerHTML;
        var lastChar = currentString[currentString.length - 1];

        if (lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
            deleteLast();
        }

        appendToInput(e.target.innerHTML);
    });
}

// Назначаем обработчик для кнопки DEL
deleteButton.addEventListener("click", function () {
    deleteLast();
});

// Назначаем обработчик для кнопки =
result.addEventListener("click", function () {
    calculateAndDisplay();
});

// Назначаем обработчик для кнопки C
clear.addEventListener("click", function () {
    input.innerHTML = "";
    resultDisplayed = false;
});

// Назначаем обработчик для кнопок калькулятора
document.getElementById('calculator').addEventListener('click', function (event) {
    const target = event.target;

    if (target.classList.contains('digit') || target.classList.contains('operation') || target.classList.contains('bracket')) {
        // Обработка ввода цифр, операторов и скобок
        appendToInput(target.innerHTML);
    } else if (target.classList.contains('clear')) {
        // Обработка кнопки "Очистить"
        input.innerHTML = '';
    } else if (target.classList.contains('delete')) {
        // Обработка кнопки "DEL"
        deleteLast();
    } else if (target.classList.contains('result')) {
        // Обработка кнопки "Результат"
        calculateAndDisplay();
    }
});
