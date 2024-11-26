import { getAuth, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential, sendPasswordResetEmail } from "firebase/auth";

import { app } from "./firebase";
import * as userModel from "./models/userModel";
import { mapAuthError } from "../utils/mapAuthError";
import { updateRoute } from "../utils/updateRoute";

const fbAuth = getAuth(app);
let enableRouteUpdate = true;
let onUserLoggedCallback: ((user: User) => void) | null;

fbAuth.onAuthStateChanged(user => {
    const isLogged = user !== null;
    if (enableRouteUpdate) updateRoute(isLogged);
    if (isLogged && onUserLoggedCallback) onUserLoggedCallback(user);
});

export function getCurrentUser(): User | null {
    return fbAuth.currentUser;
}

export function onUserLogged(callback: (user: User) => void) {
    onUserLoggedCallback = callback;
}

export async function loginWithEmail(email: string, password: string): Promise<string | null> {
    try { await signInWithEmailAndPassword(fbAuth, email, password); }
    catch (error) { return mapAuthError(error); }
    return null;
}

export async function registerWithEmail(name: string, email: string, password: string): Promise<string | null> {
    try {
        enableRouteUpdate = false;
        await createUserWithEmailAndPassword(fbAuth, email, password);
        await userModel.create(name);
        enableRouteUpdate = true;
        updateRoute(fbAuth.currentUser !== null);
    } catch (error) { return mapAuthError(error); }
    return null;
}

export async function resetPassword(email: string): Promise<boolean> {
    try {
        await sendPasswordResetEmail(fbAuth, email);
        return true;
    } catch (_) { return false; }
}

export async function logout() {
    await fbAuth.signOut();
}

export async function deleteAccount() {
    await fbAuth.currentUser?.delete();
}