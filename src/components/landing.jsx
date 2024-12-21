import { api } from "../App";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const handleLanding = async (navigate) => {
  const token = Cookies.get("jwt");
  !token ? navigate("login") : 1;
  try {
    const res = await api.post(
      "/users/checker",
      {},
      {
        withCredentials: true
      }
    );
    console.log(res.data);
    res.data.status === "user absent"
      ? navigate("signup")
      : res.data.status === "password changed"
      ? navigate("login")
      : res.data.status === "success"
      ? navigate("home")
      : 1;
  } catch (err) {
    console.error(err);
  }
};

function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    handleLanding(navigate);
  }, [navigate]);
  return <div>Loading</div>;
}

export default Landing;
