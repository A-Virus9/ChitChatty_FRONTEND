import styles from "../styles/home.module.css";

import Navbar from "../components/navbar";
import ChatList from "../components/chatlist";
import ChatBox from "../components/chatbox";
import { useState, useEffect } from "react";
import { socket } from "../App";

import { useNavigate } from "react-router-dom";

import { api } from "../App";

const checkJWT = async (navigate, setIsAuthenticated) => {
  try {
    const res = await api.post(
      "/users/checker",
      {},
      { withCredentials: true }
    );

    if (res.data.status !== "success") {
      navigate("/login");
      return;
    }

    socket.connect();
    socket.emit("start", "start");
    setIsAuthenticated(true);
  } catch (err) {
    console.error(err);
    navigate("/login");
  }
};

function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    checkJWT(navigate, setIsAuthenticated);
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className={styles.home}>
        <ChatList />
        <ChatBox />
      </div>
    </>
  );
}

export default Home;
