import { Dialog } from "../../components/dialog/script";
import "./scripts/updateSize";

import * as auth from "../../database/auth";
import * as userModel from "../../database/models/userModel";
import * as projectModel from "../../database/models/projectModel";

const createProjectDialog = Dialog.FromId("create-project");
const noticeListDialog = Dialog.FromId("notice-list");
const projectInfoDialog = Dialog.FromId("project-info");
const deleteProjectDialog = Dialog.FromId("delete-project");
const editProfileDialog = Dialog.FromId("dialog-profile");
const loader = Dialog.FromId("loader");

let visibleProjects: Array<projectModel.Project>= [];
let allProjects: Array<projectModel.Project> = [];

auth.onUserLogged(async user => {
    const currUser = await userModel.get(user.uid);
    if (!currUser) {
        auth.logout();
        return;
    }

    updateUserProfile(currUser);
    showEditProfileDialog(currUser);
    //await loadProjects();

    document.getElementsByClassName("profile")[0].addEventListener("click", _ => showEditProfileDialog(currUser));
    document.getElementById("create")?.addEventListener("click", _ => showCreateProjectDialog());
    document.getElementById("notification")?.addEventListener("click", _ => showNoticeListDialog());
    document.getElementById("exit")?.addEventListener("click", _ => auth.logout());
    
    const searchInput = document.getElementById("search") as HTMLInputElement;;
    const closeSearchButton = document.getElementById("close-search") as HTMLSpanElement;

    searchInput.addEventListener("input", () => filterProjects((searchInput.value.trim() || "")));
    closeSearchButton.addEventListener("click", () => {
        searchInput.value = "";
        filterProjects("");
    });

    loader.dismiss();
});

function updateUserProfile(user: userModel.User) {
    const username = document.getElementById("username") as HTMLParagraphElement;
    const userpicture = document.getElementById("userpicture") as HTMLImageElement;

    username.innerText = user.name;
    if (user.picture) userpicture.src = user.picture;
}

async function loadProjects() {
    allProjects = await projectModel.getAll();
    visibleProjects = allProjects;
    updateProjectList();
}

async function updateProjectList() {
    const projectSection = document.getElementById("projects-section") as HTMLSelectElement;
    const projectsList = document.getElementById("projects-list") as HTMLUListElement;
    visibleProjects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

     if (visibleProjects.length === 0) projectSection.classList.add("noprojects");
     else projectSection.classList.remove("noprojects");

    projectsList.innerHTML = "";
    for (const project of visibleProjects) {
        projectsList.appendChild(projectTemplate(project));
    }
}

function showEditProfileDialog(user: userModel.User) {
    editProfileDialog.show();
    const container = editProfileDialog.container;
    const nameInput = container.querySelector("#name") as HTMLInputElement;
    const saveButton = container.querySelector("#confirmar") as HTMLInputElement;
    const resetPassButton = container.querySelector("#redefinir-senha") as HTMLInputElement;
    const deleteAccountButton = container.querySelector("#delete-account") as HTMLInputElement;

    const pictureImg = container.getElementsByTagName("img")[0] as HTMLImageElement;
    const fileInput = container.querySelector("#picture-input") as HTMLInputElement;

    if (user.picture) pictureImg.src = user.picture;
    (container.querySelector("#email") as HTMLParagraphElement).innerHTML = user.email;
    nameInput.value = user.name;

    pictureImg.onclick = () => fileInput.click();

    fileInput.addEventListener("change",  e => {
        const target = e.target as HTMLInputElement;
        const file  = target.files ? target.files[0] : null;

        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = (e) => {
                if (!e.target)  return;
                pictureImg.src = e.target.result as string;
                saveButton.disabled = nameInput.value.trim().length === 0 || (nameInput.value.trim() === user.name && pictureImg.src === user.picture);
            };

            reader.readAsDataURL(file);
        }
    });

    nameInput.addEventListener("input", () => {
        saveButton.disabled = nameInput.value.trim().length === 0 || (nameInput.value.trim() === user.name && pictureImg.src === user.picture);

    });
    nameInput.dispatchEvent(new Event("input"));

    saveButton.onclick = (e) => {
        e.preventDefault();

        loader.show();
        editProfileDialog.dismiss();

        userModel.update(nameInput.value.trim(), pictureImg.src)
        .then(status => {
            if (status) {
                user.name = nameInput.value.trim();
                user.picture = pictureImg.src;
                updateUserProfile(user)
            }
            loader.dismiss()
    });
    };

    resetPassButton.onclick = (e) => {
        e.preventDefault();

        loader.show();
        editProfileDialog.dismiss();

        auth.resetPassword("lihoja8050@nozamas.com")
        .then(status => {
            loader.dismiss();
            if (status) window.alert("Email de redefinição de senha enviado!");
            else window.alert("Erro a o enviar email de redefinição de senha!");
        });
    };

    deleteAccountButton.onclick = () => {};
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
    projectInfoDialog.show();
    projectInfoDialog.container.getElementsByTagName("h3")[0].innerText = project.name;
    projectInfoDialog.container.getElementsByTagName("h4")[0].innerText = project.createdAt.toLocaleDateString();
    projectInfoDialog.container.getElementsByTagName("p")[0].innerText = project.description;
}

function deleteProject(id: string) {
    deleteProjectDialog.show();

    deleteProjectDialog.container.getElementsByTagName("input")[0].onclick = () => {
        loader.show();
        deleteProjectDialog.dismiss();

        projectModel.remove(id)
        .then(async _ => {
            await loadProjects();
            loader.dismiss();
        });
    };
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
        deleteProject(project.id);
    };

    element.onclick = () => openProject(project.id);

    return element;
}

function filterProjects(name: string) {
    visibleProjects = allProjects.filter(project => project.name.toLowerCase().startsWith(name.toLowerCase()));
    updateProjectList();
}