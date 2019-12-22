const Validator = require("validator");
let empty = require('is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Преобразование пустых полей в пустую строку, чтобы мы могли использовать функции валидатора 
    data.nickname = !empty(data.nickname) ? data.nickname : "";
    data.email = !empty(data.email) ? data.email : "";
    data.password = !empty(data.password) ? data.password : "";
    data.password2 = !empty(data.password2) ? data.password2 : "";

    // Имя проверяет 
    if (Validator.isEmpty(data.nickname)) {
        errors.nickname = "NicknameIsRequired";
    }

    // Email проверяет 
    if (Validator.isEmpty(data.nickname)) {
        errors.email = "EmailIsRequired";
    }
    else if (!Validator.isEmail(data.email)) {
        errors.email = "NotValidEmail";
    }

    // Пароль проверяет 
    if (Validator.isEmpty(data.nickname)) {
        errors.password = "Поле пароля обязательно";
    }
    if (Validator.isEmpty(data.nickname)) {
        errors.password2 = "Поле подтверждения пароля обязательно";
    }
    if (!Validator.isLength(data.password, { min: 5, max: 30 })) {
        errors.password = "PasswordLenght5Symbols";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Пароли должны совпадать";
    }

    return {
        errors,
        isValid: empty(errors)
    };
};