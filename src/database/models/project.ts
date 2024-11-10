import { addDoc, collection, CollectionReference, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";

import { db } from "../firestore";
import * as auth from "../auth";


export type Project = {
    name: string,
    createdAt: Date,
    authorsId: Array<string>,
};

function getRef(): CollectionReference {
    return collection(db, "projects");
}

export async function getAll(): Promise<Array<Project>> {
    const user = auth.getCurrentUser();
    const projects = query(getRef(), where("authorsId", "array-contains", user?.uid));
    const snapshot = await getDocs(projects);

    return snapshot.docs.map(doc => {
        return {
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate()
        } as Project
    });
}

export async function create(name: string): Promise<boolean> {
    try {
        const user = auth.getCurrentUser();
        const project = { name, createdAt: Timestamp.now(), authorsId: [user?.uid] };

        await addDoc(getRef(), project);
        return true;
    } catch (error: any) { return false; }
}
