import * as auth from "../../database/auth";
import { checkEmail } from "../../utils/checkEmail";
import { Dialog } from "../../components/dialog/script";

const loader =  Dialog.FromId("loader");
const nameInput = document.getElementById("name") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const passwordCheckInput = document.getElementById("passwordCheck") as HTMLInputElement;
const errorMessage = document.getElementsByClassName("error")[0] as HTMLParagraphElement;
const registerButton = document.getElementById("register") as HTMLInputElement;
const form = document.getElementsByTagName("form")[0] as HTMLFormElement;

form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateFields()) return;

    loader.show();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    auth.registerWithEmail(name, email, password)
    .then(displayError);
});

nameInput.addEventListener("input", onDataChanged);
emailInput.addEventListener("input", onDataChanged);
passwordInput.addEventListener("input", onDataChanged);
passwordCheckInput.addEventListener("input", onDataChanged);

function onDataChanged() {
    registerButton.disabled = !validateFields();
}

function validateFields(): boolean {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const passwordCheck = passwordCheckInput.value;

    return !(name === "" || 
            email === "" || 
            password.trim() === "" || 
            passwordCheck.trim() === "" || 
            !validateEmail(email) || 
            !validadePasswords(password, passwordCheck));
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

function validadePasswords(password: string, passwordCheck: string): boolean {
    if (password.length < 6) {
        displayError("A senha deve ter no minimo 6 caracteres");
        passwordInput.parentElement?.classList.add("negative");
        return false;
    }

    if (password !== passwordCheck) {
        displayError("As senhas devem corresponder");
        passwordInput.parentElement?.classList.add("negative");
        passwordCheckInput.parentElement?.classList.add("negative");
        return true;
    }

    displayError();
    passwordInput.parentElement?.classList.remove("negative");
    passwordCheckInput.parentElement?.classList.remove("negative");
    return true;
}

function displayError(msg: string | null = null) {
    loader.dismiss();
    errorMessage.children[1].innerHTML = msg || "";
    errorMessage.style.display = msg === null ? "none" : "flex";
}