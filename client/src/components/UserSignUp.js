import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase";
import { reauthenticateWithCredential } from "firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";
import "./UserSignup.css";
// import { getAuth,  onAuthStateChanged } from "firebase/auth";

// const [user, loading, error] = useAuthState(auth);

function UserSignup() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [name, setName] = useState("");
  const initialValues = { username: "", email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [autho, setAutho] = useState(
    false || window.localStorage.getItem("auth") === "true"
  );
  const [token, setToken] = useState("");
  // const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const notInitialRender = useRef(false);
  var getToken = false;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (values) => {
    const errors = {};
    const emailFormat = new RegExp(
      "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
    );
    const passwordFormat = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    if (!values.username) {
      errors.username = "Username is required!";
    } else if (values.username.length < 6) {
      errors.username = "Username must be at least 6 characters";
    } else if (values.username.length > 15) {
      errors.username = "Username cannot exceed 15 characters";
    } else {
      axios.post(`http://localhost:19720/getUsernames`).then((res) => {
        console.log(res.data.message);
        var results = res.data.message;
        Object.values(results).forEach((val) => {
          if (values.username === val.USERNAME) {
            errors.username = "Username already exists!";
            alert("Username already exists!");
            console.log("Username already exists");
          }
        });
      });
    }

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!emailFormat.test(values.email)) {
      errors.email = "This is not a valid email format!";
    } else {
      axios.post(`http://localhost:19720/getEmails`).then((res) => {
        console.log(res.data.message);
        var results = res.data.message;
        Object.values(results).forEach((val) => {
          if (values.email === val.EMAIL) {
            console.log("Email is already in use!");
            alert("Email is already in use!");
            errors.email = "Email is already in use!";
          }
        });
      });
    }

    if (!values.password) {
      errors.password = "Password is required!";
    } else if (!passwordFormat.test(values.password)) {
      errors.password =
        "Password must have at least 1 uppercase letter, 1 special character, 1 number and should be at least 8 characters long. ";
    }
    return errors;
  };

  // after clicking register
  const signup = async () => {
    setFormErrors(validate(formValues));
    console.log(formValues);
  };

  function handleFirebase() {
    if (Object.keys(formErrors).length === 0) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(formValues.email, formValues.password)
        .then((userCredential) => {
          // Signed in to the created account
          var user = userCredential.user;
          console.log("User created on firebase");
          console.log(user);

          // reauthenticate into account with the same credentials
          var credential = firebase.auth.EmailAuthProvider.credential(
            formValues.email,
            formValues.password
          );
          user
            .reauthenticateWithCredential(credential)
            .then(() => {
              // User re-authenticated.
              console.log("User reauthenticated");
            })
            .catch((error) => {
              // An error occurred
              console.log("Error reauthenticating");
              console.log(error);
            });

          // set email on which email has to be sent
          user
            .updateEmail(formValues.email)
            .then(() => {
              // Update successful
              console.log("Email set to ", formValues.email);
            })
            .catch((error) => {
              // An error occurred
              console.log(error);
              console.log("Couldn't update email to ", formValues.email);
            });

          // send email verification
          firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(() => {
              console.log(user);
              console.log("Verification email sent!");
              // Email verification sent!
              // ...
            });
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ..
          console.log(error);
        });
    }
  }

  // const user = firebase.auth().currentUser;
  // const emailVerified = user.emailVerified;
  // useEffect(() => {

  //   if (emailVerified == false) {
  //     console.log("Verify your email")
  //   }
  //   else{
  //     console.log("Email verified!")
  //     navigate('/');
  //   }
  // }, [emailVerified])

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userCred) => {
      if (userCred) {
        setAutho(true);
        console.log(userCred);
        window.localStorage.setItem("auth", "true");
        userCred.getIdToken().then((token) => {
          getToken = true;
          setToken(token);
          console.log("Token: ", token);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (notInitialRender.current) {
      const checkErrors = async () => {
        if (Object.keys(formErrors).length === 0) {
          let response = await axios.post(
            "http://localhost:19720/userRegister",
            {
              username: formValues.username,
              email: formValues.email,
              password: formValues.password,
            },
            { headers: { Authorization: "Bearer " + token, role: "user" } }
          );
          if (response.data.status == 200) {
            alert("User registered successfully!");
            handleFirebase();
            navigate("/");
          } else {
            alert(response.data.message);
            alert("Couldn't register user!");
          }
        }
      };
      checkErrors();
    } else notInitialRender.current = true;
    console.log(formErrors);
  }, [formErrors]);

  // useEffect(() => {
  //   axios.post(`http://localhost:19720/getUsernames`)
  //     .then(res => {
  //       // console.log(res.data.message);
  //       var results = res.data.message;
  //       Object.values(results).forEach(val => {
  //         console.log(val);
  //         if (formValues.username === val.USERNAME && formValues.username!= ""){
  //           console.log(formValues.username, " is equal to ", val.USERNAME);
  //           formErrors.username = "Username already exists!";
  //           alert("Username already exists!")
  //           console.log("Username already exists");
  //         }

  //       }
  //       );
  //     })
  // }, [formValues.username]);

  // useEffect(() => {
  //   axios.post(`http://localhost:19720/getEmails`)
  //     .then(res => {
  //       // console.log(res.data.message);
  //       var results = res.data.message;
  //       Object.values(results).forEach(val => {
  //         console.log(val);
  //         if (formValues.email === val.EMAIL && formValues.email!= ""){
  //           console.log(formValues.email, " is equal to ", val.EMAIL);
  //           formErrors.email = "Email already in use!";
  //           msg = "Email already in use!";
  //           console.log("Email already in use");
  //         }

  //       }
  //       );
  //     })
  // }, [formValues.email]);

  // useEffect(() => {
  //   if (loading) return;
  //   if (user) navigate("/dashboard", { replace: true });
  // }, [user, loading]);
  return (
    <div className="register">
      <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          name="username"
          value={formValues.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <div className="showError">
          <p>{formErrors.username}</p>
        </div>
        <input
          type="text"
          className="register__textBox"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="E-mail Address"
        />
        <div className="showError">
          <p>{formErrors.email}</p>
        </div>
        <input
          type="password"
          className="register__textBox"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <div className="showError">
          <p>{formErrors.password}</p>
        </div>
        {/* <button className="register__btn" onClick={register}> */}
        <button className="register__btn" onClick={signup}>
          Register
        </button>
        <button
          className="register__btn register__google"
          onClick={signInWithGoogle}
        >
          Register with Google
        </button>
        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}
export default UserSignup;