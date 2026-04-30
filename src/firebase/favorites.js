import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function getUserDoc(authCredential) {
  const docRef = doc(db, "users", authCredential.user.uid);
  return docRef;
}

export async function ensureUserDocument(authCredential) {
  const docRef = getUserDoc(authCredential);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    await setDoc(docRef, { favorites: [] });
  }
}

export function subscribeToFavorites(authCredential, onNext, onError) {
  return onSnapshot(
    getUserDoc(authCredential),
    (snapshot) => {
      const favorites = snapshot.data()?.favorites ?? [];
      onNext(favorites.map((favorite) => Number(favorite)).filter(Number.isFinite));
    },
    onError
  );
}

export function addFavoriteListing(authCredential, listingId) {
  return setDoc(
    getUserDoc(authCredential),
    { favorites: arrayUnion(Number(listingId)) },
    { merge: true }
  );
}

export function removeFavoriteListing(authCredential, listingId) {
  return setDoc(
    getUserDoc(authCredential),
    { favorites: arrayRemove(Number(listingId)) },
    { merge: true }
  );
}
