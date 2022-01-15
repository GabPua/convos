"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usernameErrorMessage = exports.passwordErrorMessage = exports.isValidEmail = exports.isValidName = exports.isValidPassword = exports.isBlank = void 0;
function isBlank(str) {
    return str === null || !str.trim();
}
exports.isBlank = isBlank;
function isValidPassword(password) {
    const re = /^(?=.*?[a-zA-Z])(?=.*?[0-9~\`!@#$%^&*()_\-+={[}\]|:;"'<,>.?/]).{5,}$/g;
    return isBlank(password) ? false : re.test(password);
}
exports.isValidPassword = isValidPassword;
function isValidName(name) {
    return !isBlank(name) && name.length <= 15;
}
exports.isValidName = isValidName;
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
exports.isValidEmail = isValidEmail;
exports.passwordErrorMessage = "Password must be at least 5 characters long with at least one letter and at least one special character/digit";
exports.usernameErrorMessage = "Username must not be blank nor exceed 15 characters";
