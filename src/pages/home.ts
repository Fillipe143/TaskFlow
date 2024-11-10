import $ from "jquery";
import * as auth from "../database/auth";

auth.onUserChange(user => {
    if (!user) return;
    $(".loader").addClass("dismiss");
    $("h1").text(`Seja bem vindo ${user.displayName}!`);
    $("input").on("click", () => auth.logout());
})