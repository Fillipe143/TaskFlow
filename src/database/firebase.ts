import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDEapTjR0Q3BlBLmiqu2r_RderOkqtLP7g",
    authDomain: "taskflow-web.firebaseapp.com",
    projectId: "taskflow-web",
    storageBucket: "taskflow-web.firebasestorage.app",
    messagingSenderId: "309605667171",
    appId: "1:309605667171:web:233863fa90cbbf8fd34356",
    measurementId: "G-NJCESQ0MBF"
};

export const app = initializeApp(firebaseConfig);