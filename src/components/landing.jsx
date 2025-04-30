import { api } from "../App";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const handleLanding = async (navigate) => {
  try {
    const res = await api.post(
      "/users/checker",
      {},
      {
        withCredentials: true
      }
    );
    res.data.status === "user absent"
      ? navigate("signup")
      : res.data.status === "password changed"
      ? navigate("login")
      : res.data.status === "success"
      ? navigate("home")
      : 1;
  } catch (err) {
    navigate("login");
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
