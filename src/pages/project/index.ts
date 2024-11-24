import  { Dialog } from "../../components/dialog/script";
import { mdToHtml } from "../../lib/markdown_viewer";

const textarea = document.getElementsByTagName("textarea")[0] as HTMLTextAreaElement;
const mdContainer = document.getElementById("md-container") as HTMLDivElement;

const crewIcon = document.getElementById("crew") as HTMLSpanElement;
const fullscreenIcon = document.getElementById("fullscreen") as HTMLSpanElement;
const flipIcon = document.getElementById("flip") as HTMLSpanElement;
const crewDialog = Dialog.FromId("edit-crew");

textarea.addEventListener("input", _ => mdContainer.innerHTML = mdToHtml(textarea.value));

crewIcon.onclick = () => crewDialog.show();
fullscreenIcon.onclick = () => toggleFullscreen();
flipIcon.onclick = () => flipLayout();

function toggleFullscreen() {
    document.body.classList.toggle("fullscreen");
    fullscreenIcon.innerText = document.body.classList.contains("fullscreen") ? "fullscreen_exit" : "fullscreen";
}

function flipLayout() {
    document.body.classList.toggle("vertical");
    flipIcon.innerText = document.body.classList.contains("vertical") ? "float_landscape_2" : "float_portrait_2";
}