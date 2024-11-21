import "../../components/resizable/script";
import { mdToHtml } from "../../lib/markdown_viewer";

const textarea = document.getElementsByTagName("textarea")[0] as HTMLTextAreaElement;
const mdContainer = document.getElementById("md-container") as HTMLDivElement;

textarea.addEventListener("input", _ => mdContainer.innerHTML = mdToHtml(textarea.value));
