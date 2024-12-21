import styles from "../styles/home.module.css";

import Navbar from "../components/navbar";
import ChatList from "../components/chatlist";
import ChatBox from "../components/chatbox";
import { io } from "socket.io-client";
import { useEffect } from "react";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://chitchatty-backend.onrender.com"

export const socket = io.connect(BACKEND_URL, {
  withCredentials: true,
});

function Home() {
  useEffect(() => {
    socket.emit("start", "start");
  }, []);
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
