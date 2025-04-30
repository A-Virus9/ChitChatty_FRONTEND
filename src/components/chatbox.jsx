import styles from "../styles/chatbox.module.css";
import { useState, useEffect, useRef, useCallback } from "react";
import Picker from "emoji-picker-react";
import { api, socket } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { throttle } from 'lodash';

function scrollDown(containerRef, type) {
  setTimeout(() => {
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: type,
    });
  }, 0);
}

function formatDateToAmPm(date) {
  const newDate = new Date(date);

  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  const amPmHours = hours % 12 || hours;
  const amPm = hours >= 12 ? "PM" : "AM";

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${amPmHours}:${formattedMinutes} ${amPm}`;
}

async function handleUserChange(currentChat, setMessages) {
  const res = await api.get(`/chats/getMessages?username=${currentChat}`, {
    withCredentials: true,
  });
  setMessages(res.data.chats.messages);
}

function Message({ data }) {
  return (
    <div
      className={`${styles.message} ${
        data.type === "send" ? styles.send : styles.receive
      }`}
    >
      <span className={styles.messageText}>{data.message}</span>
      <span className={styles.time}>{formatDateToAmPm(data.time)}</span>
    </div>
  );
}

function EmojiInputButton({ setMessageValue }) {
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <div className={styles.emoji_container}>
      <img
        src={!pickerVisible ? "./svg/emoji.svg" : "./svg/cross.svg"}
        alt="emoji"
        className={styles.emoji_button}
        onClick={() => setPickerVisible(!pickerVisible)}
      />
      {pickerVisible && (
        <Picker
          onEmojiClick={(e) => setMessageValue((val) => val + e.emoji)}
          theme="dark"
        />
      )}
    </div>
  );
}

// function handleSend(messageValue, setMessagevalue, setMessages, currentChat) {
//   if (messageValue.trim() === "") return;
//   const data = {
//     message: messageValue.trim(),
//     receiver: currentChat,
//     time: Date.now(),
//   };
//   socket.emit("message", data);
//   setMessages((messages) => [
//     ...messages,
//     { message: messageValue.trim(), type: "send", time: Date.now() },
//   ]);
//   setMessagevalue("");
// }

// const throttledClick = useCallback(throttle((messageValue, setMessagevalue, setMessages, currentChat) => {
//   if (messageValue.trim() === "") return;
//     const data = {
//       message: messageValue.trim(),
//       receiver: currentChat,
//       time: Date.now(),
//     };
//     socket.emit("message", data);
//     setMessages((messages) => [
//       ...messages,
//       { message: messageValue.trim(), type: "send", time: Date.now() },
//     ]);
//     setMessagevalue("");
// }, 500), []);

// const handleSend = (messageValue, setMessagevalue, setMessages, currentChat) => {
//   throttledClick(messageValue, setMessagevalue, setMessages, currentChat);
// };

function ChatBox() {
  const containerRef = useRef(null);
  const [messageValue, setMessageValue] = useState("");
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const currentChat = useSelector(
    (store) => store.chatList.currentChatUsername
  );
  const isMounted = useRef(false);

  const throttledClick = useCallback(
    throttle((messageValue, setMessageValue, setMessages, currentChat) => {
      if (messageValue.trim() === "") return;
      const data = {
        message: messageValue.trim(),
        receiver: currentChat,
        time: Date.now(),
      };
      socket.emit("message", data);
      setMessages((messages) => [
        ...messages,
        { message: messageValue.trim(), type: "send", time: Date.now() },
      ]);
      setMessageValue("");
    }, 250),
    []
  );

  const handleSend = (messageValue, setMessageValue, setMessages, currentChat) => {
    throttledClick(messageValue, setMessageValue, setMessages, currentChat);
  };

  useEffect(() => {
    scrollDown(containerRef, "smooth");
  }, [messages]);

  useEffect(() => {
    if (isMounted.current) {
      handleUserChange(currentChat, setMessages);
    } else {
      isMounted.current = true;
    }
  }, [currentChat]);

  useEffect(() => {
    const handleMessage = (message) => {
      if (message.sender === currentChat) {
        setMessages((messages) => [
          ...messages,
          { message: message.message, type: "receive", time: message.time },
        ]);
      } else {
        dispatch({ type: "chatList/updateUnread", payload: message.sender });
        socket.emit("update_unread", {to_update: message.sender, type: "increment"});
      }
    };

    socket.on("transport_message", handleMessage);

    return () => {
      socket.off("transport_message", handleMessage);
    };
  }, [currentChat]);

  return (
    <div className={styles.chatbox}>
      {currentChat ? (
        <>
          <div className={styles.topBar}></div>
          <div className={styles.chatArea} ref={containerRef}>
            {messages.map((data, i) => (
              <Message data={data} key={i + 1} />
            ))}
          </div>
          <div className={styles.typeArea}>
            <input
              type="text"
              placeholder="Type a message..."
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend(
                    messageValue,
                    setMessageValue,
                    setMessages,
                    currentChat,
                    containerRef
                  );
                }
              }}
              className={styles.message_input}
            />
            <EmojiInputButton setMessageValue={setMessageValue} />
            <img
              src="./svg/send.svg"
              alt="Send"
              onClick={() =>
                handleSend(
                  messageValue,
                  setMessageValue,
                  setMessages,
                  currentChat
                )
              }
              className={styles.send_button}
            />
          </div>
        </>
      ) : (
        <div className={styles.no_user_selected}>
          Select a chat to view messages...
        </div>
      )}
    </div>
  );
}

export default ChatBox;
