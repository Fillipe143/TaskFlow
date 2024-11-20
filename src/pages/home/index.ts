import { Dialog } from "../../components/dialog/script";
import "../../components/resizable/script";
import "./scripts/updateSize";

import * as auth from "../../database/auth";
import * as userModel from "../../database/models/userModel";
import * as projectModel from "../../database/models/projectModel";

const createProjectDialog = Dialog.FromId("create-project");
const noticeListDialog = Dialog.FromId("notice-list");
const loader = Dialog.FromId("loader");

auth.onUserLogged(async user => {
    const currUser = await userModel.get(user.uid);
    if (!currUser) {
        auth.logout();
        return;
    }

    updateUserProfile(currUser);
    document.getElementById("create")?.addEventListener("click", _ => showCreateProjectDialog());
    document.getElementById("notification")?.addEventListener("click", _ => showNoticeListDialog());

    loader.dismiss();
});

function updateUserProfile(user: userModel.User) {
    const username = document.getElementById("username") as HTMLParagraphElement;
    const userpicture = document.getElementById("userpicture") as HTMLImageElement;

    username.innerText = user.name;
    if (user.picture) userpicture.src = user.picture;
}

function showCreateProjectDialog() {
    createProjectDialog.show();

    const form = createProjectDialog.container.querySelector("form") as HTMLFormElement;
    const nameField = createProjectDialog.container.querySelector("#project-name") as HTMLInputElement;
    const descriptionField = createProjectDialog.container.querySelector("#project-description") as HTMLTextAreaElement;
    const submitButton = createProjectDialog.container.querySelector("input[type=submit]") as HTMLInputElement;

    nameField.value = "";
    descriptionField.value = "";
    submitButton.disabled = true;

    const onInput = () => { submitButton.disabled = nameField.value.trim().length < 3 };
    const onSubmit = async (e: SubmitEvent)  => {
        loader.show();
        e.preventDefault();
        nameField.removeEventListener("input", onInput);
        form.removeEventListener("submit", onSubmit);

        await projectModel.create(nameField.value, descriptionField.value);
        createProjectDialog.dismiss();
        loader.dismiss();
    }

    nameField.addEventListener("input", onInput);
    form.addEventListener("submit", onSubmit);
}

function showNoticeListDialog() {
    noticeListDialog.show();
}