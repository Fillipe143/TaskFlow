import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";

import { app } from "./firebase";
import { AuthError, mapAuthError } from "./types/AuthError";
import { updateRoute } from "../utils/updateRoute";

const fbAuth = getAuth(app);

fbAuth.onAuthStateChanged(user => {
    console.log(user)
    updateRoute(user !== null)
});

export function getCurrentUser(): User | null {
    return fbAuth.currentUser;
}

export function onUserChange(callback: (user: User | null) => void) {
    fbAuth.onAuthStateChanged(_ => callback(fbAuth.currentUser));
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