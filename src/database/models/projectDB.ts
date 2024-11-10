import { addDoc, collection, CollectionReference, doc, DocumentData, DocumentReference, getDoc, getDocs, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";

import { db } from "../firestore";
import * as auth from "../auth";

export type Project = {
    id: string,
    name: string,
    createdAt: Date,
    authorsId: Array<string>,
    content: string
};

function getRef(): CollectionReference {
    return collection(db, "projects");
}

export async function get(id: string): Promise<Project | null> {
    try {
        const projectRef = doc(db, "projects", id);
        const snapshot = await getDoc(projectRef);

        if (!snapshot.exists()) return null
        const data = snapshot.data();

        return {
            ...data,
            id,
            createdAt: data.createdAt.toDate()
        } as Project;
    } catch (_) {return null}
}

export async function getAll(): Promise<Array<Project>> {
    const user = auth.getCurrentUser();
    const projects = query(getRef(), where("authorsId", "array-contains", user?.uid));
    const snapshot = await getDocs(projects);

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt.toDate()
        } as Project
    });
}

export async function create(name: string): Promise<boolean> {
    try {
        const user = auth.getCurrentUser();
        const project = { name, createdAt: Timestamp.now(), authorsId: [user?.uid], content: "" };

        await addDoc(getRef(), project);
        return true;
    } catch (error: any) { return false; }
}

export async function update(id: string, values: any): Promise<boolean> {
    const projectRef = doc(db, "projects", id);
    try {
        await updateDoc(projectRef, values);
        return true;
    } catch (_) { return false; }
}