import $ from "jquery";
import "../components/sidebar";
import "../components/searchbar";

import * as auth from "../database/auth";
import * as userDB from "../database/models/userDB";
import * as projectDB from "../database/models/projectDB";

let allProjects: Array<projectDB.Project> = [];
let visibleProjects: Array<projectDB.Project>= [];


auth.onUserChange(async user => {
    if (!user) return;
    userDB.get().then(user => {
        if (user?.name) $("#username").text(user.name);
        if (user?.photoUrl) $("#userphoto").attr("src", user.photoUrl);
        $(document.body).removeClass("dismiss");
    });

    $("#create").on("click", _ => createProject())
    $("#exit").on("click", _ => auth.logout());
    await loadProjects();

    const searchInput = $("#search");
    searchInput.on("input", _ => filterProjects((searchInput.val()?.toString() || "").trim()));
    $("#close-search").on("click", _ => filterProjects(""));
});

async function loadProjects() {
    allProjects = await projectDB.getAll();
    visibleProjects = allProjects;
    updateProjectList();
}

async function updateProjectList() {
    visibleProjects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const projectsContainer = $(".projects");
    if (visibleProjects.length === 0) {
        projectsContainer.addClass("dismiss");
        $("#noprojects").removeClass("dismiss");
        return;
    }

    const projectsList = $("#projects-list");
    projectsList.empty();

    $("#noprojects").addClass("dismiss");
    projectsContainer.removeClass("dismiss");

    visibleProjects.forEach(project => {
        projectsList.append(projectTemplate(project));
    });
}

function createProject() {
    const dialogContainer = $("#dialog-create");
    const dialog = dialogContainer.find(".dialog");
    const nameField = dialogContainer.find("#project-name");
    const descriptionField = dialogContainer.find("#project-desc");
    const confirmButton = dialogContainer.find("#create-project");

    nameField.val("");
    descriptionField.val("");
    confirmButton.prop("disabled", true);
    dialog.on("click" , e => e.stopPropagation());

    const disableButton = () => 
        confirmButton.prop("disabled", (nameField.val()?.toString() || "").trim() === "" || 
                                       (descriptionField.val()?.toString() || "").trim() === "");

    nameField.on("input", _ => disableButton());
    descriptionField.on("input", _ => disableButton());

    dialogContainer.on("click", _ => {
        dialogContainer.removeClass("show");
        dialog.off("click");
        nameField.off("input");
        descriptionField.off("input");
        dialogContainer.off("click");
        confirmButton.off("click");
    });

    confirmButton.on("click", e => {
        e.preventDefault();
        const projectName = nameField.val()?.toString().trim() || "Sem nome";
        const projectDescription = descriptionField.val()?.toString().trim() || "Sem descrição";

        const loader = $(".loader");
        loader.removeClass("dismiss");
        projectDB.create(projectName, projectDescription)
        .then(async _ => {
            await loadProjects();
            loader.addClass("dismiss");
        });

        dialogContainer.removeClass("show");
        dialog.off("click");
        nameField.off("input");
        descriptionField.off("input");
        dialogContainer.off("click");
        confirmButton.off("click");
    });

    dialogContainer.addClass("show");
    nameField.trigger("focus");
}

function projectTemplate(project: projectDB.Project): JQuery<HTMLElement> {
    const template = $(`
       <li>
            <div class="icons">
                <span class="material-symbols-outlined info">info</span>
                <span class="material-symbols-outlined delete">delete</span>
            </div>
            <h3>${project.name}</h3>
        </li>
    `);
    template.find(".info").on("click", e => {
        e.stopPropagation();
        showInfo(project)
    });
    template.find(".delete").on("click", e => {
        e.stopPropagation();
        deleteProject(project.id)
    });
    template.on("click", _ => openProject(project.id));
    return template;
}

function openProject(id: string) {
    window.location.href = `/project?id=${id}`;
}

function showInfo(project: projectDB.Project) {
    const dialogContainer = $("#dialog-info");

    dialogContainer.find("#project-name").text(project.name);
    dialogContainer.find("#project-desc").text(project.description);
    dialogContainer.find("#project-date").text(project.createdAt.toLocaleDateString());
    dialogContainer.addClass("show");

    dialogContainer.on("click", _ => {
        dialogContainer.removeClass("show");
        dialogContainer.off("click");
    });
}

function deleteProject(id: string) {
    const dialogContainer = $("#dialog-delete");
    const cancelButton = dialogContainer.find("#cancel");
    const deleteButton = dialogContainer.find("#delete");
    const loader = $(".loader");

    dialogContainer.addClass("show");
    dialogContainer.on("click", e => {
        dialogContainer.removeClass("show");
        dialogContainer.off("click");
    });

    cancelButton.on("click", e => {
        e.preventDefault();
        dialogContainer.removeClass("show");
        cancelButton.off("click");
    });

    deleteButton.on("click", e => {
        e.preventDefault();
        dialogContainer.removeClass("show");
        deleteButton.off("click");
            loader.removeClass("dismiss");
            projectDB.remove(id)
            .then(async _ => {
                await loadProjects();
                loader.addClass("dismiss");
            });
    });
}

function filterProjects(name: string) {
    visibleProjects = allProjects.filter(project => project.name.toLowerCase().startsWith(name.toLowerCase()));
    updateProjectList();
}