import $ from "jquery";

$(".input-container.search").toArray().forEach(searchbar => {
    const inputField = $(searchbar).find("input");

    $(searchbar).find(".close-icon").on("click", _ => {
        inputField.val("");
    });
});