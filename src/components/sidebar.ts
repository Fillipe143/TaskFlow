import $ from "jquery";

let isResizing = false;
const minWidth = 200;
const sidebar = $(".sidebar");

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