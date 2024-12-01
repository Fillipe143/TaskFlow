import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";

import * as auth from "../auth";
import { db } from "../firestore";
import * as userModel from "./userModel";
import * as projectModel from "./projectModel";

export type Notice = {
    id: string,
    receiverId: string,
    senderId: string,
    projectId: string,
    message: string,
    sentAt: Date,
    viewed: boolean,
    rejected: boolean,
    accepted: boolean,
};

function uniqueID(): string {
    return doc(collection(db, "notices")).id;
}

export async function send(email: string, projectId: string, message: string): Promise<boolean> {
    try {
        const user = await userModel.getByEmail(email);
        if (!user) return false;

        const status = await projectModel.update(projectId, { guests: arrayUnion(user.id) });
        if (!status) return false;

        return await create(user.id,  projectId, message);
    } catch (_) { return false; }
}

export async function create(to: string, projectId: string, message: string): Promise<boolean> {
    try {
        const user = auth.getCurrentUser();
        if (!user) return false;

        const notice = { 
            id: uniqueID(),
            receiverId: to,
            senderId: user.uid,
            projectId,
            message,
            sentAt: Timestamp.now(),
            viewed: false,
            rejected: false,
            accepted: false
        };

        await setDoc(doc(db, "notices", notice.id), notice);
        return true;
    } catch (e) { return false; }
}

export async function getAll(): Promise<Array<Notice>> {
    try {
        const user = auth.getCurrentUser();
        if (!user) return [];

        const noticesQuery = query(collection(db, "notices"), where("receiverId", "==", user.uid));

        const snapshot = await getDocs(noticesQuery);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                sentAt: data.createdAt.toDate()
            } as Notice;
        });
    } catch (_) { return []; }
}

export async function viewAll(): Promise<boolean> {
    try {
        const user = auth.getCurrentUser();
        if (!user) return false;

       const noticesQuery = query(
            collection(db, "notices"),
            where("receiverId", "==", user.uid),
            where("viewed", "==", false),
        );
        const snapshot = await getDocs(noticesQuery);

        snapshot.forEach(async docSnapshot => {
            const docRef = doc(db, "notices", docSnapshot.id);
            await updateDoc(docRef, { viewed: true });
        });

        return true;
    } catch (_) { return false; }
}

export async function reject(id: string): Promise<boolean> {
    try {
        const docRef = doc(db, "notices", id);
        await updateDoc(docRef, { reject: true });
        return true;
    } catch (_) { return false; }
}

export async function accept(id: string): Promise<boolean> {
    try {
        const docRef = doc(db, "notices", id);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) return false;
        const notice = snapshot.data() as Notice;

        if (!await projectModel.update(notice.projectId, { crew: arrayUnion(notice.receiverId) })) return false;
        await updateDoc(docRef, { accepted: true });
        return true;
    } catch(_) { return false; }
}