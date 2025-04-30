import { useEffect, useState } from "react";
import styles from "../styles/chatlist.module.css";

import { api, socket } from "../App";
import { useDispatch, useSelector } from "react-redux";
import store from "../store";

async function handleInitialChats(setChats, dispatch) {
  try {
    const res = await api.get("/chats/getChats", { withCredentials: true });
    const { chatList } = res.data;

    const formattedChats = chatList.map((data) => ({
      name: data.user,
      lastChat: "temp",
      status: data.status,
      unread: data.unread,
    }));

    const storeChats = chatList.reduce((acc, data) => {
      acc[data.user] = data.unread;
      return acc;
    }, {});

    dispatch({ type: "chatList/setInitialUnread", payload: storeChats });

    console.log("Formatted Chats:", formattedChats);

    setChats(formattedChats);
  } catch (err) {
    console.log("Error fetching chats:", err);
  }
}

function toggleOnlineStatus(setChats) {
  socket.on("status_change", (data) => {
    setChats((state) => {
      const newState = state.map((chat) => (chat.name === data.user ? { ...chat, status: data.status } : chat));
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
      const { status } = (
        await api.post("/users/isonline", data, { withCredentials: true })
      ).data.status;
      setChats((state) => [
        ...state,
        { name: newUser, lastChat: "temp", status },
      ]);
      socket.emit("instantAdd", { receiver: newUser });
      setNewUser("");
    }
  } catch (err) {
    console.log(err);
  }
}

// async function handleNewUser(newUser, setNewUser, setChats) {
//   try {
//     const { data } = await api.post("/chats/add", { newUser }, { withCredentials: true });
//     if (["added", "already present"].includes(data.status)) {
//       const { status } = (await api.post("/users/isonline", { newUser }, { withCredentials: true })).data.status;
//       setChats((prev) => [...prev, { name: newUser, lastChat: "temp", status }]);
//       socket.emit("instantAdd", { receiver: newUser });
//       setNewUser("");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

function Chat({ data, dispatch, setChats }) {
  const currentChat = useSelector(
    (store) => store.chatList.currentChatUsername
  );
  const unreads = useSelector((store) => store.chatList.unread);
  useEffect(() => {
    setChats((state) => {
      const newState = [...state];
      const index = newState.findIndex((e) => e.name === data.name);
      if (index !== -1) {
        newState[index].unread = unreads[data.name] || 0;
      }
      return newState;
    });
  }, [unreads]);
  return (
    <div
      onClick={() => {
        dispatch({ type: "chatList/updateCurrentChat", payload: data.name })
        setChats((state) => {
          const newState = state.map((chat) => chat.name === data.name? {...chat, unread: 0} : chat);
          return newState
        })
        socket.emit("update_unread", { to_update: data.name, type: "reset" });
      }}
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
        <div className={styles.right}>
          {data.unread ? (
            <div className={styles.unRead}>{data.unread}</div>
          ) : (
            ""
          )}
          <span className={styles.time}>3:45Pm</span>
        </div>
      </div>
      {data.status === "online" && <div className={styles.online}></div>}
    </div>
  );
}

function ChatList() {
  const [newUser, setNewUser] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    handleInitialChats(setChats, dispatch);
  }, []);

  useEffect(() => {
    toggleOnlineStatus(setChats);
  }, []);

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
          <Chat data={e} key={i} dispatch={dispatch} setChats={setChats} />
        ))}
      </div>
    </div>
  );
}

export default ChatList;
