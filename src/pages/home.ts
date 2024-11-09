import $ from "jquery";
import * as auth from "../database/auth";

const user = auth.currentUser();
if (user) $("h1").text(`Seja bem vindo ${user.displayName}!`);
$("input").on("click", () => auth.logout());