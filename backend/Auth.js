import { auth } from "./Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail, signOut } from "firebase/auth";
  
export async function registerUser(email, password, setUser)
{
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log(`User ${user.email} signed up successfully`);
            setUser(user);
            return user;
        })
        .catch((error) => {
            console.error(`Error ${error.code}: ${error.message}`);
            throw error;
        });
}

export async function signInUser(email, password, setUser)
{
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log(`User ${user.email} logged up successfully`);
            setUser(user);
            return user;
        })
        .catch((error) => {
            console.error(`Error ${error.errorCode}: ${error.errorMessage}`);
            throw error;
        });
}

export async function signOutUser(setUser)
{
    signOut(auth).then(() => {
        console.log("Signed out successfully");
        setUser(null);
    })
    .catch((error) => {
        console.error("Sign out failed");
    })
}