const Validator = require("validator");
const empty = require("is-empty");

module.exports = function validateLoginInput(data) {
    let errors = {};

    // Преобразование пустых полей в пустую строку, чтобы мы могли использовать функции валидатора 
    data.email = !empty(data.email) ? data.email : "";
    data.password = !empty(data.password) ? data.password : "";

    // Электронная почта проверяет 
    if (Validator.isEmpty(data.email)) {
        errors.email = "EmailIsRequired";
    }
    else if (!Validator.isEmail(data.email)) {
        errors.email = "EmailIsNotValid";
    }

    // Пароль проверяет 
    if (Validator.isEmpty(data.password)) {
        errors.password = "EmptyPassword"
    }

    return {
        errors,
        isValid: empty(errors)
    };
};