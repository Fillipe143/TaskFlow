import { addDoc, collection, doc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";

import * as auth from "../auth";
import { db } from "../firestore";

export type Notice = {
    id: string,
    receiverId: string,
    senderId: string,
    projectId: string,
    message: string,
    sentAt: Date,
    viewed: boolean,
};

function uniqueID(): string {
    return doc(collection(db, "notices")).id;
}

export async function send(to: string, projectId: string, message: string): Promise<boolean> {
    try {
        const user = auth.getCurrentUser();
        if (!user) return false;

        const notice = { 
            id: uniqueID(),
            receiverId: user.uid,
            senderId: to,
            projectId,
            message,
            sentAt: Timestamp.now(),
            viewed: false,
        };

        await setDoc(doc(db, "notices", notice.id), notice);
        return true;
    } catch (_) { return false; }
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