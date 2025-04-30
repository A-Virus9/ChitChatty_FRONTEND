import styles from "../styles/home.module.css";

import Navbar from "../components/navbar";
import ChatList from "../components/chatlist";
import ChatBox from "../components/chatbox";
import { useState, useEffect } from "react";
import { socket } from "../App";

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { api } from "../App";

const checkJWT = async () => {
  const token = Cookies.get("jwt");
  console.log(token)
  // if (!token) {
  //   navigate("/login");
  //   return;
  // }
  try {
    
    socket.connect();
    socket.emit("start", "start");
    // setIsAuthenticated(true);
  } catch (err) {
    console.error(err);
  }
};

function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    checkJWT();
  }, []);

  // if(isAuthenticated === null) 
  //   return <div>Loading...</div>;

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
