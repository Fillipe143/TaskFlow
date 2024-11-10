import $ from "jquery";
import "../components/sidebar";
import "../components/searchbar";

import * as auth from "../database/auth";

auth.onUserChange(user => {
    if (!user) return;
    if (user.displayName) $("#username").text(user.displayName);
    if (user.photoURL) $("#userphoto").attr("src", user.photoURL);

    $(document.body).removeClass("dismiss");
    $("#exit").on("click", _ => auth.logout());
})