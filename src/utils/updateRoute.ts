export function updateRoute(isLogged: boolean) {
    const pathname = window.location.pathname;

    if (pathname === "/login" || pathname === "/register") {
        if (isLogged) window.location.href = "/";
    } else if (!isLogged) window.location.href = "/login";
}