const passwordField = document.getElementById('password');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const specialCheck = document.getElementById('special');

const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const specialChars = '!@#$%^&*()';

function generatePassword() {
    let length = parseInt(lengthInput.value);
    if (length < 4) length = 4;
    if (length > 20) length = 20;

    let availableChars = '';
    let password = '';

    if (uppercaseCheck.checked) availableChars += uppercaseChars;
    if (lowercaseCheck.checked) availableChars += lowercaseChars;
    if (numbersCheck.checked) availableChars += numberChars;
    if (specialCheck.checked) availableChars += specialChars;

    if (availableChars === '') {
        alert('Please select at least one character type');
        return;
    }

    if (uppercaseCheck.checked) password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    if (lowercaseCheck.checked) password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    if (numbersCheck.checked) password += numberChars[Math.floor(Math.random() * numberChars.length)];
    if (specialCheck.checked) password += specialChars[Math.floor(Math.random() * specialChars.length)];

    for (let i = password.length; i < length; i++) {
        password += availableChars[Math.floor(Math.random() * availableChars.length)];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');
    passwordField.value = password;
}

function copyToClipboard() {
    passwordField.select();
    document.execCommand('copy');
    alert('Password copied to clipboard!');
}

// Update length display in real-time
lengthInput.addEventListener('input', () => {
    lengthValue.textContent = lengthInput.value;
    generatePassword(); // Optional: Auto-generate on slider change
});

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);
generatePassword();
