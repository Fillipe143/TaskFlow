import * as auth from "../../database/auth";
import { checkEmail } from "../../utils/checkEmail";
import { Dialog } from "../../components/dialog/script";

const loader =  Dialog.FromId("loader");
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const errorMessage = document.getElementsByClassName("error")[0] as HTMLParagraphElement;
const registerButton = document.getElementById("login") as HTMLInputElement;
const form = document.getElementsByTagName("form")[0] as HTMLFormElement;

form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateFields()) return;

    loader.show();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    auth.loginWithEmail(email, password)
    .then(displayError);
});

emailInput.addEventListener("input", onDataChanged);
passwordInput.addEventListener("input", onDataChanged);

function onDataChanged() {
    registerButton.disabled = !validateFields();
}

function validateFields(): boolean {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    return !(email === "" || 
            password.trim() === "" || 
            !validateEmail(email));
}

function validateEmail(email: string): boolean {
    if (checkEmail(email)) {
        emailInput.parentElement?.classList.remove("negative");
        displayError();
        return true;
    }

    displayError("Formato de email invalido");
    emailInput.parentElement?.classList.add("negative");
    return false;
}

function displayError(msg: string | null = null) {
    loader.dismiss();
    errorMessage.children[1].innerHTML = msg || "";
    errorMessage.style.display = msg === null ? "none" : "flex";
}