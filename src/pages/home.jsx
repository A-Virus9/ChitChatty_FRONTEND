import styles from "../styles/home.module.css";

import Navbar from "../components/navbar";
import ChatList from "../components/chatlist";
import ChatBox from "../components/chatbox";
import { useEffect } from "react";
import {socket} from "../App";

function Home() {
  useEffect(() => {
    socket.connect();
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
