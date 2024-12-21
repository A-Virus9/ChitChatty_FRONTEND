import styles from "../styles/chatbox.module.css";
import { useState, useEffect, useRef } from "react";
import Picker from "emoji-picker-react";
import { api } from "../App";
import { useSelector } from "react-redux";
import { socket } from "../pages/home";

async function handleUserChange(currentChat, setMessages) {
  const res = await api.get(`/chats/getMessages?username=${currentChat}`, {
    withCredentials: true,
  });
  setMessages(res.data.messages);
  console.log(res);
}

function Message({ data }) {
  return (
    <div
      className={`${styles.message} ${
        data.type === "send" ? styles.send : styles.receive
      }`}
    >
      <span className={styles.messageText}>{data.message}</span>
      <span className={styles.time}>3:45PM</span>
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

function handleSend(messageValue, setMessagevalue, setMessages, currentChat) {
  const data = {
    messageValue,
    receiver: currentChat,
  };
  socket.emit("message", data);
  setMessages((messages) => [
    ...messages,
    { message: messageValue, type: "send" },
  ]);
  setMessagevalue("");
}

function handleIncomingMessages(setMessages, currentChat) {
  socket.on("transport_message", (message) => {
    if (message.sender === currentChat) {
      setMessages((messages) => [
        ...messages,
        { message: message.message, type: "receive" },
      ]);
    }
  });
}

function ChatBox() {
  const [messageValue, setMessageValue] = useState("");
  const [messages, setMessages] = useState([]);
  const currentChat = useSelector(
    (store) => store.currentChat.currentChatUsername
  );
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      handleUserChange(currentChat, setMessages);
    } else {
      isMounted.current = true;
    }
  }, [currentChat]);

  useEffect(() => {
    handleIncomingMessages(setMessages, currentChat);
  }, [currentChat]);

  return (
    <div className={styles.chatbox}>
      {currentChat ? (
        <>
          <div className={styles.topBar}></div>
          <div className={styles.chatArea}>
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
                    currentChat
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
