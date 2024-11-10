import $ from "jquery";
import * as auth from "../database/auth";
import * as projectDB from "../database/models/projectDB";

const loader = $(".loader");
const textarea = $("textarea");
const loaderMsg = loader.find("p");

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id") || "";

auth.onUserChange(async _ => {
    const project = await projectDB.get(projectId);
    if (!project) return window.location.href = "/";

    $("title").text(project.name);
    textarea.text(project.content)

    loader.addClass("dismiss");

    $(document).on("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault()
            saveContent()
        }
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