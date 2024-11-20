//import "../../database/auth";
import "../../components/resizable/script";
import "../../components/dialog/script";
import { Dialog } from "../../components/dialog/script";

const createProjectDialog = Dialog.FromId("create-project");
const noticeListDialog = Dialog.FromId("notice-list");
const projectsUList = document.getElementById("projects-list") as HTMLUListElement;

function ajustar() {
    const width = projectsUList.offsetWidth;
    console.log(width)
    projectsUList.classList.remove("grid-6", "grid-5", "grid-4", "grid-3", "grid-2", "grid-1");

    if (width > 1500) projectsUList.classList.add('grid-6');
    else if (width > 1250) projectsUList.classList.add('grid-5');
    else if (width > 1000) projectsUList.classList.add('grid-4');
    else if (width > 850) projectsUList.classList.add('grid-3');
    else if (width > 600) projectsUList.classList.add('grid-2');
    else projectsUList.classList.add('grid-1');
}

setInterval(ajustar, 100);
