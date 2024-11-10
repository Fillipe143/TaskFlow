import $ from "jquery";
import * as auth from "../database/auth";

auth.onUserChange(user => {
    if (!user) return;
    $(document.body).removeClass("dismiss");
    $("h1").text(`Seja bem vindo ${user.displayName}!`);
    $("input").on("click", () => auth.logout());
})