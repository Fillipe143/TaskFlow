import { collection, doc, DocumentData, DocumentReference, MemoryEagerGarbageCollector, setDoc, Timestamp } from "firebase/firestore";

import * as auth from "../auth";
import { db } from "../firestore";

export enum MemberRole { VIEWER, EDITOR, ADMIN, OWNER };

export type Member = {
    userId: string,
    role: MemberRole,
};

export type Project = {
    id: string,
    name: string,
    description: string,
    crew: Array<Member>,
    createdAt: Date,
};

function uniqueID(): string {
    return doc(collection(db, "projects")).id;
}

function getRef(id: string): DocumentReference<DocumentData, DocumentData> {
    return doc(db, "projects", id);
}

export async function create(name: string, description: string): Promise<boolean> {
    try {
        const user = auth.getCurrentUser();
        if (!user) return false;

        const member: Member = { userId: user.uid, role: MemberRole.OWNER };
        const projectDoc = { id: uniqueID(), name, description, crew: [member], createdAt: Timestamp.now() };
        await setDoc(getRef(projectDoc.id), projectDoc);

        return true;
    } catch (_) { return false; }
}