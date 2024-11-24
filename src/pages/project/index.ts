import  { Dialog } from "../../components/dialog/script";
import { mdToHtml } from "../../lib/markdown_viewer";

import * as auth from "../../database/auth";
import * as projectModel from "../../database/models/projectModel";

const textarea = document.getElementsByTagName("textarea")[0] as HTMLTextAreaElement;
const mdContainer = document.getElementById("md-container") as HTMLDivElement;

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
crewIcon.onclick = () => crewDialog.show();
fullscreenIcon.onclick = () => toggleFullscreen();
flipIcon.onclick = () => flipLayout();

auth.onUserLogged(async _ => {
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
    loader.dismiss()
});

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