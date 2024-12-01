import { collection, deleteDoc, doc, DocumentData, DocumentReference, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";

import * as auth from "../auth";
import { db } from "../firestore";

export type Project = {
    id: string,
    name: string,
    description: string,
    content: string,
    crew: string[],
    createdAt: Date,
};

function uniqueID(): string {
    return doc(collection(db, "projects")).id;
}

function getRef(id: string): DocumentReference<DocumentData, DocumentData> {
    return doc(db, "projects", id);
}

export async function get(id: string): Promise<Project | null> {
    try {
        const snapshot = await getDoc(getRef(id));

        if (!snapshot.exists()) return null;
        const data = snapshot.data();

        return {
            ...data,
            id,
            createdAt: data.createdAt.toDate()
        } as Project;
    } catch (_) { return null; }
}

export async function getAll(): Promise<Array<Project>> {
    try {
        const id = auth.getCurrentUser()?.uid;
        if (!id) return [];

        const projectsQuery = query(collection(db, "projects"), where("crew", "array-contains", id));
        const snapshot = await getDocs(projectsQuery);

        return snapshot.docs.map(doc => {
             const data = doc.data();
             return {
                ...data,
                id: doc.id,
                createdAt: data.createdAt.toDate()
             } as Project;
        });
    } catch (_) { return [] };
}

export async function create(project: Project): Promise<boolean> {
    try {
        const projectDoc = {
            id: uniqueID(),
            name: project.name,
            description: project.description,
            crew: project.crew,
            createdAt: Timestamp.now(),
            content: ""
        };

        await setDoc(getRef(projectDoc.id), projectDoc);

        return true;
    } catch (_) { return false; }
}

export async function remove(id: string): Promise<boolean> {
    try {
        await deleteDoc(getRef(id));
        return true;
    } catch (_) { return false; }
}

export async function update(id: string, values: any): Promise<boolean> {
    try {
        await updateDoc(getRef(id), values);
        return true;
    } catch (_) { return false; }
}

export function createProjectFactory(name: string, description: string, userId: string): Project {
    return {
        id: '',
        name,
        description,
        content: "",
        crew: [userId],
        createdAt: new Date()
    };
}