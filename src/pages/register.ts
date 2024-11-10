import $ from "jquery";
import { validateEmail } from "../utils/validateEmail";
import { registerUser } from "../database/auth";

const loader = $(".loader");
const form = $("form");
const nameField = $("#name");
const emailField = $("#email");
const emailContainer = emailField.parent();
const passwordField = $("#password");
const passwordContainer = passwordField.parent();
const passwordCheckField = $("#passwordCheck");
const passwordCheckContainer = passwordCheckField.parent();
const submitButton = $("input[type=submit]");
const errorMsg = $(".error");

nameField.on("input", onDataChange);
emailField.on("input", onDataChange);
passwordField.on("input", onDataChange);
passwordCheckField.on("input", onDataChange);

form.on("submit", e => {
    e.preventDefault();
    loader.toggleClass("dismiss");

    const name = (nameField.val() as string).trim();
    const email = emailField.val() as string;
    const password = passwordField.val() as string;

    registerUser(name, email, password)
    .then(error => {
        loader.toggleClass("dismiss");
        changeError(error)
    });
});

function onDataChange() {
    const name = nameField.val() as string;
    const email = emailField.val() as string;
    const password = passwordField.val() as string;
    const passwordCheck = passwordCheckField.val() as string;

    let disableButton = name.trim() === "";
    disableButton = disableButton || email.trim() === "";
    disableButton = disableButton || password.trim() === "";
    disableButton = disableButton || passwordCheck.trim() === "";

    if (!disableButton) {
        disableButton = !validateEmail(email);
        changeEmailStatus(disableButton);
    } else changeEmailStatus(false);

    if (!disableButton) {
        disableButton = password !== passwordCheck;
        changePasswordStatus(disableButton);
    }

    if (!disableButton) {
        disableButton = password.length < 6;
        changePasswordStatus(disableButton, "A senha deve ter ao menos 6 caracteres");
    }

    submitButton.prop("disabled", disableButton);
}

function changeEmailStatus(error: boolean) {
    changeError(error ? "Formato de email invalido." : undefined);
    emailContainer.removeClass(error ? "positive" : "negative");
    emailContainer.addClass(error ? "negative" : "positive");
}

function changePasswordStatus(error: boolean, msg: string = "As senhas devem coincidir") {
    changeError(error ? msg : undefined);
    passwordCheckContainer.removeClass(error ? "positive" : "negative");
    passwordCheckContainer.addClass(error ? "negative" : "positive");
    passwordContainer.removeClass(error ? "positive" : "negative");
    passwordContainer.addClass(error ? "negative" : "positive");
}

function changeError(msg: string | undefined = undefined) {
    if (msg) {
        errorMsg.css("display", "flex");
        errorMsg.children()[1].innerText = msg;
    } else errorMsg.css("display", "none");
}