import $ from "jquery";
import { SidebarResizeObservable } from './components/resizable/SidebarResizeObservable';;

let isResizing = false;
const minWidth = 200;
const sidebar = $(".sidebar");

document.addEventListener('DOMContentLoaded', () => {
    const sidebarElement = document.getElementById('sidebar');

    if (!sidebarElement) {
        console.error('Elemento da sidebar não encontrado.');
        return;
    }

    const sidebarObserver = new SidebarResizeObservable(sidebarElement);

    sidebarObserver.addObserver((dimensions: DOMRectReadOnly) => {
        console.log('Sidebar alterada:', dimensions);
        handleSidebarResize(dimensions);
    });

    function handleSidebarResize(dimensions: DOMRectReadOnly): void {
        const { width, height } = dimensions;
        console.log(`Largura: ${width}px, Altura: ${height}px`);
    }
});

$(".resize-handle").on("mousedown", e => {
    e.preventDefault();
    isResizing = true;

    const startX = e.clientX;
    const startWidth = sidebar.outerWidth() || 0;

    $(document).on("mousemove", e => {
        if (isResizing) {
            const dx = e.clientX - startX;
            const maxWidth = ($(window).outerWidth() || 0)/ 2;
            const width = Math.max(Math.min(startWidth + dx, maxWidth), minWidth);
            sidebar.css("width", width);
        }
    });

    $(document).on("mouseup", _ => {
        isResizing = false;
        $(document).off("mousemove");
        $(document).off("mouseup");
    });
});