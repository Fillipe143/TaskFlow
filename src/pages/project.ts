import $ from "jquery";
import * as auth from "../database/auth";
import * as projectDB from "../database/models/projectDB";
import { mdToHtml } from "../lib/markdown_viewer";

const body = $("body");
const flip = $("#flip");
const fullscreen= $("#fullscreen");
const loader = $(".loader");
const textarea = $("textarea");
const loaderMsg = loader.find("p");
const htmlContainer = $(".container")

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id") || "";

if (window.localStorage.getItem(`${projectId}-isVertical`) === "true") {
    body.addClass("vertical");
    flip.text("float_landscape_2");
}
if (window.localStorage.getItem(`${projectId}-fullscreen`) === "true") {
    body.addClass("fullscreen");
    fullscreen.text("fullscreen_exit");
}

auth.onUserChange(async _ => {
    const project = await projectDB.get(projectId);
    if (!project) return window.location.href = "/";

    $("title").text(project.name);
    textarea.text(project.content)
    updateHtmlContainer();

    loader.addClass("dismiss");

    $(document).on("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault()
            saveContent()
        }
    });

    textarea.on("input", _ => updateHtmlContainer());

    flip.on("click", _ => {
        body.toggleClass("vertical");
        const isVertical = body.hasClass("vertical");
        flip.text(isVertical ? "float_landscape_2" : "float_portrait_2");
        window.localStorage.setItem(`${projectId}-isVertical`, isVertical.toString());
    });
    fullscreen.on("click", _ => {
        body.toggleClass("fullscreen");
        const inFullscreen = body.hasClass("fullscreen");
        fullscreen.text(inFullscreen ? "fullscreen_exit" : "fullscreen");
        window.localStorage.setItem(`${projectId}-fullscreen`, inFullscreen.toString());
    });
});

async function saveContent() {
    const originalMsg = loaderMsg.text();
    loaderMsg.text("Salvando...");
    loader.removeClass("dismiss");
    const content = $("textarea").val();
    await projectDB.update(projectId, {content});
    loader.addClass("dismiss");
    loaderMsg.text(originalMsg);
}

function updateHtmlContainer() {
    const source = textarea.val()?.toString() || "";
    htmlContainer.html(mdToHtml(source));
}