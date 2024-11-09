import $  from "jquery";

const form = $("#todo-form");
const input = $("#input");
const list = $("#tasks");

form.on("submit", e => {
    e.preventDefault();

    const value = (input.val() as string).trim();
    if (value === "") return;

    const task = $("<li>").text(value);
    list.append(task);
    input.val("");
});