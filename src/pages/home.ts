import $ from "jquery";
import "../components/sidebar";
import "../components/searchbar";

import * as auth from "../database/auth";

auth.onUserChange(user => {
    if (!user) return;
    $(document.body).removeClass("dismiss");
})