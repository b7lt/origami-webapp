import { auth } from "./Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail, signOut } from "firebase/auth";
import { createUserProfile, updateUserLastLogin } from "./Database";
  
export async function registerUser(email, password, setUser)
{
    return createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log(`User ${user.email} signed up successfully`);

            await createUserProfile(user.uid, user.email);

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
        .then(async (userCredential) => {
            // Logged in
            const user = userCredential.user;
            console.log(`User ${user.email} logged in successfully`);

            await updateUserLastLogin(user.uid);

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

export async function isEmailInUse(email) {
    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        return methods.length > 0;
    } catch (error) {
        console.error("Error checking email:", error);
        return [];
    }
}