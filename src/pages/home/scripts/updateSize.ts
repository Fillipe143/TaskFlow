const projectsUList = document.getElementById("projects-list") as HTMLUListElement;

function udpateProjectsListSize() {
    const width = projectsUList.offsetWidth;
    projectsUList.classList.remove("grid-6", "grid-5", "grid-4", "grid-3", "grid-2", "grid-1");

    if (width > 1250) projectsUList.classList.add('grid-6');
    else if (width > 1000) projectsUList.classList.add('grid-5');
    else if (width > 850) projectsUList.classList.add('grid-4');
    else if (width > 600) projectsUList.classList.add('grid-3');
    else if (width > 400) projectsUList.classList.add('grid-2');
    else projectsUList.classList.add('grid-1');
}

setInterval(udpateProjectsListSize, 100);