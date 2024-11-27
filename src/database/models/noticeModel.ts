import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore";

import * as auth from "../auth";
import { db } from "../firestore";

export type Notice = {
    receiverId: string,
    senderId: string,
    projectId: string,
    message: string,
    sentAt: Date
};

export async function send(to: string, projectId: string, message: string): Promise<boolean> {
    try {
        const user = auth.getCurrentUser();
        if (!user) return false;

        const notice = { receiverId: user.uid, senderId: to, projectId, message, sentAt: Timestamp.now() }
        await addDoc(collection(db, "notices"), notice);
        return true;
    } catch (_) { return false; }
}

export async function getAll(): Promise<Array<Notice>> {
    try {
        const user = auth.getCurrentUser();
        if (!user) return [];

        const noticesQuery = query(collection(db, "notices"), where("receiverId", "==", user.uid ));
        const snapshot = await getDocs(noticesQuery);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                sentAt: data.createdAt.toDate()
            } as Notice;
        });
    } catch (_) { return []; }
}