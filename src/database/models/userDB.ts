import { doc, DocumentData, DocumentReference, setDoc, Timestamp } from "firebase/firestore";

import { db } from "../firestore";
import * as auth from "../auth";

export type User = {
    id: string,
    name: string,
    email: string,
    photoUrl: string,
    createdAt: Date
};

function getRef(id: string): DocumentReference<DocumentData, DocumentData> {
    return doc(db, "users", id);
}

export async function create(name: string): Promise<boolean> {
    try {
        const user = auth.getCurrentUser();
        if (!user) return false;

        const userObj = { id: user.uid , name, email: user.email, photoUrl: "", createdAt: Timestamp.now() };
        await setDoc(getRef(user.uid), userObj);

        return true;
    } catch (error: any) { return false; }
}