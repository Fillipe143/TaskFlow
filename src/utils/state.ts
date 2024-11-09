window.addEventListener("beforeunload", () => window.localStorage.clear());

export function set(name: string, value: Object | null) {
    if (value) window.localStorage.setItem(name, JSON.stringify(value));
    else window.localStorage.removeItem(name);
}

export function get(name: string): Object {
    return JSON.parse(window.localStorage.getItem(name) || "{}");
}