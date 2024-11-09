import $ from "jquery";
import { validateEmail } from "../utils/validateEmail";

const form = $("form");
const emailField = $("#email");
const emailContainer = emailField.parent();
const passwordField = $("#password");
const submitButton = $("input[type=submit]");
const errorMsg = $(".error");

emailField.on("input", onDataChange);
passwordField.on("input", onDataChange);

form.on("submit", e => {
    e.preventDefault();

    const email = emailField.val() as string;
    const password = passwordField.val() as string;
    alert(`${email}\n${password}`);
});

function onDataChange() {
    const email = emailField.val() as string;
    const password = passwordField.val() as string;

    let disableButton = email.trim() === "";
    disableButton = disableButton || password.trim() === "";

    if (!disableButton) {
        disableButton = !validateEmail(email);
        changeEmailStatus(disableButton);
    } else changeEmailStatus(false);

    submitButton.prop("disabled", disableButton);
}

function changeEmailStatus(error: boolean) {
    changeError(error ? "Formato de email invalido." : undefined);
    emailContainer.removeClass(error ? "positive" : "negative");
    emailContainer.addClass(error ? "negative" : "positive");
}

function changeError(msg: string | undefined = undefined) {
    if (msg) {
        errorMsg.css("display", "flex");
        errorMsg.children()[1].innerText = msg;
    } else errorMsg.css("display", "none");
}