import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";

import { app } from "./firebase";
import { AuthError, mapAuthError } from "./types/AuthError";
import { updateRoute } from "../utils/updateRoute";
import * as state from "../utils/state"

const fbAuth = getAuth(app);

fbAuth.onAuthStateChanged(user => {
    state.set("currentUser", user);
    updateRoute(user !== null)
});

export function currentUser(): User | null{
    const user = state.get("currentUser");
    if (user) return user as User;
    return null;
}

export async function loginWithEmail(email: string, password: string): Promise<AuthError | undefined>{
    try { await signInWithEmailAndPassword(fbAuth, email, password); }
    catch (error: any) { return mapAuthError(error.code); }
    return undefined;
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthError | undefined>  {
    try {
        const userCredential = await createUserWithEmailAndPassword(fbAuth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
    } catch (error: any) { return mapAuthError(error.code); }
    return undefined;
}

export function logout() {
    fbAuth.signOut();
}