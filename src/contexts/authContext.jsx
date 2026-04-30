import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { ensureUserDocument } from "../firebase/favorites";
import { AuthContext } from "./authContextStore";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        ensureUserDocument({ user }).catch((err) => {
          console.error("Could not create user document:", err);
        });

        setCurrentUser(user);

        const isEmail = user.providerData.some(
          (provider) => provider.providerId === "password"
        );
        setIsEmailUser(isEmail);

        const isGoogle = user.providerData.some(
          (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
        );
        setIsGoogleUser(isGoogle);

        setUserLoggedIn(true);
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
        setIsEmailUser(false);
        setIsGoogleUser(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
