import $ from "jquery";
import "../components/sidebar";
import "../components/searchbar";

import * as auth from "../database/auth";
import * as dbProjects from "../database/models/project";

auth.onUserChange(async user => {
    if (!user) return;
    if (user.displayName) $("#username").text(user.displayName);
    if (user.photoURL) $("#userphoto").attr("src", user.photoURL);

    $(document.body).removeClass("dismiss");
    $("#create").on("click", _ => createProject())
    $("#exit").on("click", _ => auth.logout());
    await loadProjects();
})

async function loadProjects() {
    const projects = await dbProjects.getAll();
    projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (projects.length === 0) return $("#noprojects").removeClass("dismiss");

    const projectsContainer = $(".projects");
    const projectsList= $("#projects-list");
    projectsList.empty();

    $("#noprojects").addClass("dismiss");
    projectsContainer.removeClass("dismiss");

    projects.forEach(project => {
        projectsList.append(projectTemplate(project));
    });
}

function createProject() {
    const dialogContainer = $(".dialog-container");
    const dialog = dialogContainer.find(".dialog");
    const nameField = dialogContainer.find("#project-name");
    const confirmButton = dialogContainer.find("#create-project");

    nameField.val("");
    confirmButton.prop("disabled", true);
    dialog.on("click" , e => e.stopPropagation());

    nameField.on("input", _ => {
        confirmButton.prop("disabled", (nameField.val()?.toString() || "").trim() === "");
    });

    dialogContainer.on("click", _ => {
        dialogContainer.removeClass("show");
        dialog.off("click");
        nameField.off("input");
        dialogContainer.off("click");
        confirmButton.off("click");
    });

    confirmButton.on("click", e => {
        e.preventDefault();
        const projectName = nameField.val()?.toString().trim() || "Sem nome";

        const loader = $(".loader");
        loader.removeClass("dismiss");
        dbProjects.create(projectName)
        .then(async _ => {
            await loadProjects();
            loader.addClass("dismiss");
        });

        dialogContainer.removeClass("show");
        dialog.off("click");
        nameField.off("input");
        dialogContainer.off("click");
        confirmButton.off("click");
    });

    dialogContainer.addClass("show");
    nameField.trigger("focus");
}

function projectTemplate(project: dbProjects.Project): JQuery<HTMLElement> {
    return $(`
        <li>
            <h3>${project.name}</h3>
            <span>${formateDate(project.createdAt)}</span>
        </li>
    `);
}

function formateDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds()

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}