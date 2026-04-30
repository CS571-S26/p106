import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { ensureUserDocument } from "./favorites";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const authCredential = await createUserWithEmailAndPassword(auth, email, password);
  await ensureUserDocument(authCredential);
  return authCredential;
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  const authCredential = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDocument(authCredential);
  return authCredential;
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const authCredential = await signInWithPopup(auth, provider);
  await ensureUserDocument(authCredential);
  return authCredential;
};

export const doSignOut = () => {
  return signOut(auth);
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: window.location.origin,
  });
};
