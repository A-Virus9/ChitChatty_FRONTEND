import styles from "../styles/landing.module.css";
import Field from "../components/field";

import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../App";

async function handleSignup(username, email, password, confirmPassword, setErr) {
  const data = {
    username,
    email,
    password,
    passwordConfirm: confirmPassword,
  };
  if (!username || !email || !password || !confirmPassword) {
    setErr("Please enter all details !");
  } else if (password.length < 8) {
    setErr("The password should be at least 8 characters long !");
  } else if (confirmPassword !== password)
    setErr("The confirmed password should be same as the password !");
  else {
    try {
      const res = await api.post("/users/signup", data, {
        withCredentials: true,
      });
      if (res.data.status === "success") console.log(res.data.status);
    } catch (err) {
      console.log(err.response.data);
      if (err.response.data.message.endsWith("Email malformed"))
        setErr("Email format is not correct!");
      else if (err.response.data.message === "Dublicate entry")
        setErr("This username already exists");
      else if (
        err.response.data.message.endsWith("Username cannot have blank spaces")
      )
        setErr("Username cannot have blank spaces");
      else if (err.response.data.message) setErr(err.response.data.message);
    }
  }
}

function SignUp() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <>
      <div className={styles.landing}>
        <h3 className={styles.landingText}>Sign Up</h3>
        <Field
          label={"Username"}
          type={"text"}
          onFieldChange={(value) => setUserName(value)}
        />
        <Field
          label={"Email"}
          type={"email"}
          onFieldChange={(value) => setEmail(value)}
        />
        <Field
          label={"Password"}
          type={"password"}
          onFieldChange={(value) => setPassword(value)}
        />
        <Field
          label={"Confirm Password"}
          type={"password"}
          onFieldChange={(value) => setConfirmPassword(value)}
          margin={"MB2"}
        />
        <div className={styles.errText}>{err}</div>
        <input
          type="button"
          value="Sign Up"
          className={styles.submit}
          onClick={() =>
            handleSignup(username, email, password, confirmPassword, setErr)
          }
        />
        <div className={styles.alt_text}>
          Already have an account?{" "}
          <Link to="/login" className={styles.alt_link}>
            Login
          </Link>
        </div>
      </div>
    </>
  );
}

export default SignUp;
