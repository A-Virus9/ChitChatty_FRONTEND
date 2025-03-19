import { useEffect, useState } from "react";
import styles from "../styles/chatlist.module.css";

import { api, socket } from "../App";
import { useDispatch, useSelector } from "react-redux";

async function handleInitialChats(setChats) {
  try {
    const res = await api.get("/chats/getChats", { withCredentials: true });
    const { chatList } = res.data;
    chatList.map((data) => {
      setChats((state) => [...state, { name: data.user, lastChat: "temp", status: data.status }]);
    });
  } catch (err) {
    console.log("No chats");
  }
}

function toggleOnlineStatus(setChats) {
  socket.on("status_change", (data) => {
    setChats((state) => {
      const newState = [...state];
      const index = newState.findIndex((e) => e.name === data.user);
      newState[index].status = data.status;
      return newState;
    });
  });
}

async function handleNewUser(newUser, setNewUser, setChats) {
  const data = { newUser };
  try {
    const res = await api.post("/chats/add", data, {
      withCredentials: true,
    });
    if (res.data.status === "added" || res.data.status === "already present") {
      const {status} = (await api.post("/users/isonline", data, {withCredentials: true})).data.status;
      setChats((state) => [...state, { name: newUser, lastChat: "temp", status }]);
      const socketData = {
        receiver: newUser
      }
      socket.emit("instantAdd", socketData)
      setNewUser("");
    }
  } catch (err) {
    console.log(err);
  }
}

function Chat({ data }) {
  const dispatch = useDispatch();
  const currentChat = useSelector(
    (store) => store.currentChat.currentChatUsername
  );
  return (
    <div
      onClick={() =>
        dispatch({ type: "currentChat/updateCurrentChat", payload: data.name })
      }
      className={`${styles.chats} ${
        currentChat === data.name ? styles.current : 1
      }`}
    >
      <div className={styles.dp}>
        <img src="./img/60111.jpg" alt="dp" className={styles.dpImg} />
      </div>
      <div className={styles.data}>
        <div className={styles.left}>
          <span className={styles.name}>{data.name}</span>
          <span className={styles.lastChat}>{data.lastChat}</span>
        </div>
        <span className={styles.time}>3:45Pm</span>
      </div>
      {data.status==="online" && <div className={styles.online}></div>}
    </div>
  );
}

function ChatList() {
  const [newUser, setNewUser] = useState("");
  const [chats, setChats] = useState([]);
  useEffect(() => {
    handleInitialChats(setChats);
  }, []);

  useEffect(() => {
    toggleOnlineStatus(setChats);
  }, [])

  return (
    <div className={styles.chatlist}>
      <div className={styles.add_user}>
        <input
          type="text"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          placeholder="Add people via username..."
          className={styles.add_user_input}
        />
        <button
          onClick={() => handleNewUser(newUser, setNewUser, setChats)}
          className={styles.add_user_button}
        >
          Add
        </button>
      </div>
      <div className={styles.chat_list_box}>
        {chats.map((e, i) => (
          <Chat data={e} key={i} />
        ))}
      </div>
    </div>
  );
}

export default ChatList;
