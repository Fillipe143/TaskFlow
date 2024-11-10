import $ from "jquery";
import "../components/sidebar";
import * as auth from "../database/auth";

auth.onUserChange(user => {
    if (!user) return;
    $(document.body).removeClass("dismiss");
})