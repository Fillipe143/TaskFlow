import { collection, doc, DocumentData, DocumentReference, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

import * as auth from "../auth";
import { db } from "../firestore";

export type User = {
    id: string,
    name: string,
    email: string,
    picture: string
};

function getRef(id: string): DocumentReference<DocumentData, DocumentData> {
    return doc(db, "users", id);
}

export async function getByEmail(email: string): Promise<User | null> {
    try {
        const userQuery = query(collection(db, "users"), where("email", "==", email));
        const snapshot = await getDocs(userQuery);

        return snapshot.docs[0].data() as User;
    } catch (_) { return null; }
}

export async function get(id: string | undefined = undefined): Promise<User | null> {
    try {
        if (!id) id = auth.getCurrentUser()?.uid;
        if (!id) return null;

        const snapshot = await getDoc(getRef(id));
        if (!snapshot.exists()) return null;
        const data = snapshot.data();
    
        return { ...data } as User;
    } catch (_) { return null };
}

export async function create(name: string): Promise<boolean> {
    try {
        const user = auth.getCurrentUser();
        if (!user) return false;

        const userDoc: User = { id: user.uid, name, email: user.email || "", picture: "" };
        await setDoc(getRef(user.uid), userDoc);

        return true;
    } catch (_) { return false; }
}

export async function update(name: string | undefined = undefined, picture: string | undefined = undefined ): Promise<boolean> {
    try {
        if (!name && !picture) return true;

        const user = auth.getCurrentUser();
        if (!user) return false;
    
        const updateFields: Partial<User> = {};
        if (name !== undefined) updateFields.name = name;
        if (picture !== undefined) updateFields.picture = picture;

        await setDoc(getRef(user.uid), updateFields, { merge: true })
        return true;
    } catch (_) { return false; }
}