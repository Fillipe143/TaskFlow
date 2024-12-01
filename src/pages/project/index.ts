import  { Dialog } from "../../components/dialog/script";
import { mdToHtml } from "../../lib/markdown_viewer";
import { checkEmail } from "../../utils/checkEmail";

import * as auth from "../../database/auth";
import * as userModel from "../../database/models/userModel";
import * as noticeModel from "../../database/models/noticeModel";
import * as projectModel from "../../database/models/projectModel";
import { arrayRemove } from "firebase/firestore";

const textarea = document.getElementsByTagName("textarea")[0] as HTMLTextAreaElement;
const mdContainer = document.getElementById("md-container") as HTMLDivElement;

const homeIcon = document.getElementById("home") as HTMLSpanElement;
const crewIcon = document.getElementById("crew") as HTMLSpanElement;
const fullscreenIcon = document.getElementById("fullscreen") as HTMLSpanElement;
const flipIcon = document.getElementById("flip") as HTMLSpanElement;
const crewDialog = Dialog.FromId("edit-crew");

const loader = Dialog.FromId("loader");
const loaderMessage = loader.container.getElementsByTagName("p")[0] as HTMLParagraphElement;

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id") || "";

if (window.localStorage.getItem(`${projectId}-isVertical`) === "true") {
    document.body.classList.add("vertical");
    flipIcon.innerText = "float_landscape_2";
}
if (window.localStorage.getItem(`${projectId}-fullscreen`) === "true") {
    document.body.classList.add("fullscreen");
    fullscreenIcon.innerText = "fullscreen_exit";
}

textarea.addEventListener("input", _ => updateMDContainer());
homeIcon.onclick = () => window.location.href = "/";
fullscreenIcon.onclick = () => toggleFullscreen();
flipIcon.onclick = () => flipLayout();

auth.onUserLogged(async _ => {
    const user = await userModel.get();
    if (!user) return window.location.href = "/";

    const project = await projectModel.get(projectId);
    if (!project) return window.location.href = "/";

    document.title = project.name;
    textarea.value = project.content;

    document.addEventListener("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            saveContent();
        }
    });

    updateMDContainer();
    if (user.id === project.owner) {
        crewIcon.style.display = "inline-block";
        crewIcon.onclick = () => showCrewDialog(user, project);
    }

    loader.dismiss()
});

async function showCrewDialog(user: userModel.User, project: projectModel.Project) {
    await updateCrewList(user, project);

    const emailInput = crewDialog.container.querySelector("input[type=email]") as HTMLInputElement;
    const addButton = crewDialog.container.querySelector("input[type=submit]") as HTMLInputElement;

    emailInput.value = "";
    addButton.disabled = true;

    emailInput.oninput = () => addButton.disabled = !checkEmail(emailInput.value.trim());

    addButton.onclick = async () => {
        loader.show();
        const status = await noticeModel.send(emailInput.value.trim(), projectId, `${user.name} te convidou para o projeto ${project.name}.`);
        if (status) window.alert("Notificação enviada com sucesso!");
        else window.alert("Não foi possivel enviar a notificação")
        loader.dismiss();
    };

    crewDialog.show();
}

async function updateCrewList(user: userModel.User, project: projectModel.Project) {
    const ul = crewDialog.container.getElementsByTagName("ul")[0] as HTMLUListElement;
    ul.innerHTML = "";

    loader.show();
    for (const userId of project.crew) {
        const u = await userModel.get(userId);
        if (u) ul.appendChild(crewTemplate(u, project, u.id === user.id));
        
    }
    loader.dismiss();
}

function crewTemplate(user: userModel.User, project: projectModel.Project, isOwner: boolean): HTMLElement {
    const html = `
    <li>
        <img src="${user.picture}">
        <div>
            <h4 id="user-name">${user.name}</h4>
            <p id="user-email">${user.email}</p>
        </div>
        <span class="material-symbols-outlined">delete</span>
    </li> `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const element = doc.body.firstChild as HTMLElement;
    const deleteButton = element.getElementsByTagName("span")[0];

    if (isOwner) deleteButton.remove();
    else deleteButton.onclick = async _ => await removeUserFromCrew(user, project);
    return element;
}

async function removeUserFromCrew(user: userModel.User, project: projectModel.Project) {
    loader.show();
    const status = await projectModel.update(project.id, { crew: arrayRemove(user.id) });
    if (status) await updateCrewList(user, project);
    loader.dismiss();

    if (status) window.alert("Usuário removido com sucesso!");
    else window.alert("Não foi possivel remover o usuário");
}

async function saveContent() {
    const originalMsg = loaderMessage.innerText;
    loaderMessage.innerText = "Salvando...";
    loader.show();

    const content = textarea.value;
    await projectModel.update(projectId, { content });

    loader.dismiss();
    loaderMessage.innerText = originalMsg;
}

function updateMDContainer() {
    mdContainer.innerHTML = mdToHtml(textarea.value);
}

function toggleFullscreen() {
    document.body.classList.toggle("fullscreen");
    const isFullscreen = document.body.classList.contains("fullscreen");
    fullscreenIcon.innerText =  isFullscreen ? "fullscreen_exit" : "fullscreen";
    window.localStorage.setItem(`${projectId}-fullscreen`, isFullscreen.toString());
}

function flipLayout() {
    document.body.classList.toggle("vertical");
    const isVertical = document.body.classList.contains("vertical");
    flipIcon.innerText =  isVertical ? "float_landscape_2" : "float_portrait_2";
    window.localStorage.setItem(`${projectId}-isVertical`, isVertical.toString());
}