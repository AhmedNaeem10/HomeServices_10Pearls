// import { initializeApp } from "firebase/app";
// import {
//     // getAuth,
//     signInWithPopup,
//     signInWithEmailAndPassword,
//     // createUserWithEmailAndPassword,
//     sendPasswordResetEmail,
//     signOut,
// } from "firebase/auth";
// import {
//     getFirestore,
//     query,
//     getDocs,
//     where,
// } from "firebase/firestore";
// const firebaseConfig = {
//     apiKey: "AIzaSyCvacYGL-GBmyFFKLKdINj7JhTvXv5sNMo",
//     authDomain: "home-services-8ec1a.firebaseapp.com",
//     projectId: "home-services-8ec1a",
//     storageBucket: "home-services-8ec1a.appspot.com",
//     messagingSenderId: "795067853101",
//     appId: "1:795067853101:web:b3c3cd461f3ed2a4918ba4"
// };
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const googleProvider = new GoogleAuthProvider();
// const signInWithGoogle = async () => {
//     try {
//         const res = await signInWithPopup(auth, googleProvider);
//         const user = res.user;
//         const q = query(collection(db, "users"), where("uid", "==", user.uid));
//         const docs = await getDocs(q);
//         if (docs.docs.length === 0) {
//             await addDoc(collection(db, "users"), {
//                 uid: user.uid,
//                 name: user.displayName,
//                 authProvider: "google",
//                 email: user.email,
//             });
//         }
//     } catch (err) {
//         console.error(err);
//         alert(err.message);
//     }
// };
// const logInWithEmailAndPassword = async (email, password) => {
//     try {
//         await signInWithEmailAndPassword(auth, email, password);
//     } catch (err) {
//         console.error(err);
//         alert(err.message);
//     }
// };
// const registerWithEmailAndPassword = async (name, email, password) => {
//     try {
//         const res = await createUserWithEmailAndPassword(auth, email, password);
//         const user = res.user;
//         await addDoc(collection(db, "users"), {
//             uid: user.uid,
//             name,
//             authProvider: "local",
//             email,
//         });
//     } catch (err) {
//         console.error(err);
//         alert(err.message);
//     }
// };
// const sendPasswordReset = async (email) => {
//     try {
//         await sendPasswordResetEmail(auth, email);
//         alert("Password reset link sent!");
//     } catch (err) {
//         console.error(err);
//         alert(err.message);
//     }
// };
// const logout = () => {
//     signOut(auth);
// };
// export {
//     auth,
//     db,
//     signInWithGoogle,
//     logInWithEmailAndPassword,
//     registerWithEmailAndPassword,
//     sendPasswordReset,
//     logout,
// };