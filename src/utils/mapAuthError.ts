import { FirebaseError } from "firebase/app";
import authErrorMessages from "../assets/data/authErrors.json";

export function mapAuthError(error: any) {
    if (error instanceof FirebaseError) return (authErrorMessages as { [key: string]: string })[error.code] || authErrorMessages["default"];
    return authErrorMessages["default"];
}