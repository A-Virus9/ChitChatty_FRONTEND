import styles from "../styles/home.module.css";

import Navbar from "../components/navbar";
import ChatList from "../components/chatlist";
import ChatBox from "../components/chatbox";
import { io } from "socket.io-client";
import { useEffect } from "react";

export const socket = io.connect("https://chitchatty-backend.onrender.com", {
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
