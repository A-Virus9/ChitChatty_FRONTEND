import styles from "../styles/landing.module.css";
import style from "../styles/field.module.css";
import Field from "../components/field";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../App";

async function handleLogin(username, password, setErr, navigate) {
  const data = {
    username,
    password,
  };
  if (username && password) {
    try {
      const res = await api.post("/users/login", data, {withCredentials: true});
      console.log(res.data.status)
      if (res.data.status === "success") {
        navigate("../home")
      }
      console.log(res.headers)
    } catch (err) {
      if (err.response.data.message === "Incorrect username or password") {
        setErr(err.response.data.message+" !");
      }
      console.log(err);
    }
  } else {
    setErr("Please enter all details!");
  }
}

function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate()
  return (
    <>
      <div className={styles.landing}>
        <h3 className={styles.landingText}>Login</h3>
        <Field
          label={"Username"}
          type={"text"}
          onFieldChange={(value) => setUserName(value)}
        />
        <Field
          label={"Password"}
          type={"password"}
          onFieldChange={(value) => setPassword(value)}
          margin={"MB1.5"}
        />
        <div className={styles.errText}>{err}</div>
        <input
          type="button"
          value="Login"
          className={styles.submit}
          onClick={() => handleLogin(username, password, setErr, navigate)}
        />
        <div className={styles.alt_text}>
          Don&apos;t have a account?{" "}
          <Link to="/signup" className={styles.alt_link}>
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;
