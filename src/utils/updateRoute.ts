export function updateRoute(isLogged: boolean) {
    const pathname = window.location.pathname;
    if (!isLogged && pathname !== "/login" && pathname !== "/register") {
        window.location.href = "/login";
    } else if (isLogged && (pathname === "/login" || pathname === "/register")) {
        window.location.href = "/";
    }
}