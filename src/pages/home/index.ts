import { Dialog } from "../../components/dialog/script";
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
    loadProjects();

    document.getElementById("create")?.addEventListener("click", _ => showCreateProjectDialog());
    document.getElementById("notification")?.addEventListener("click", _ => showNoticeListDialog());
    document.getElementById("exit")?.addEventListener("click", _ => auth.logout());

  loader.dismiss();
});

function updateUserProfile(user: userModel.User) {
    const username = document.getElementById("username") as HTMLParagraphElement;
    const userpicture = document.getElementById("userpicture") as HTMLImageElement;

    username.innerText = user.name;
    if (user.picture) userpicture.src = user.picture;
}

async function loadProjects() {
    const projects = await projectModel.getAll();
    const projectsList = document.getElementById("projects-list") as HTMLUListElement;
    projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    projectsList.innerHTML = "";
    for (const project of projects) {
        projectsList.appendChild(projectTemplate(project));
    }
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
        await loadProjects();
        createProjectDialog.dismiss();
        loader.dismiss();
    }

    nameField.addEventListener("input", onInput);
    form.addEventListener("submit", onSubmit);
}

function showNoticeListDialog() {
    noticeListDialog.show();
}

function openProject(id: string) {
    window.location.href = `/project?id=${id}`;
}

function showProjectInfo(project: projectModel.Project) {
    console.log("Info", project);
}

function deleteProject(project: projectModel.Project) {
    console.log("Delete", project);
}

function projectTemplate(project: projectModel.Project): HTMLElement {
    const html = `<li>
        <div class="icons">
            <span class="material-symbols-outlined info">info</span>
            <span class="material-symbols-outlined delete">delete</span>
        </div>
        <h3>${project.name}</h3>
    </li>`;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const element = doc.body.firstChild as HTMLElement;
    (element.getElementsByClassName("info")[0] as HTMLElement).onclick = (e) => {
        e.stopPropagation();
        showProjectInfo(project);
    };

    (element.getElementsByClassName("delete")[0] as HTMLElement).onclick = (e) => {
        e.stopPropagation();
        deleteProject(project);
    };

    element.onclick = () => openProject(project.id);

    return element;
}