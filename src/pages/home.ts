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
    console.log(projects)
}

function createProject() {
    const name = $(".input-container.search input").val()?.toString() || "nao definido";
    dbProjects.create(name)
    .then(status => console.log(status ? "Deu certo" : "Deu ruim"));
}