import { useState, useEffect, useRef } from "react";
import { Dialog } from "@mui/material";
import axios from "axios";
import io from "socket.io-client";
import { TbSend } from "react-icons/tb";
import { FaInfoCircle } from "react-icons/fa";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { BsArrowLeft } from "react-icons/bs";

let socket;

function ChatModule({ user }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messageHandler = ({ chatId, messages }) => {
      const message = {
        sender: messages.sender,
        receiver: messages.receiver,
        message: messages.message,
      };
      setMessages((oldMessages) => [...oldMessages, message]);
    };
    if (socket) {
      socket.on("chatHistory", (history) => {
        if (history === null) {
          setMessages([]);
          return;
        }
        setMessages(
          history.messages.map((message) => {
            return {
              sender: message.sender,
              receiver: message.receiver,
              message: message.message,
            };
          })
        );
      });
      socket.on("chat", messageHandler);
      socket.emit("requestChatHistory", { chatId: user._id });
    }

    scrollToBottom();

    return () => {
      socket.off("chat", messageHandler);
    };
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const messageData = {
      sender: "admin",
      receiver: user._id,
      message,
    };
    if (message) {
      socket.emit("chat", {
        chatId: user._id,
        messageData,
      });
      setMessage("");
      setMessages((prev) => [...prev, messageData]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative h-full">
      <div className="overflow-y-auto mb-4 flex-grow">
        {messages.length === 0 ? (
          <div
            className="flex items-center justify-center"
            style={{ height: "calc(100vh - 245px)" }}
          >
            <FaInfoCircle className="text-5xl text-gray-400" />
          </div>
        ) : (
          <div
            className="overflow-y-auto"
            style={{ height: "calc(100vh - 245px)" }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col items-start justify-start my-2 ${
                  message.sender === "admin" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`flex items-center justify-center px-2 py-1 rounded-md ${
                    message.sender === "admin"
                      ? "bg-[#f3993f] text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {message.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <form onSubmit={sendMessage} className="w-full flex gap-2 justify-center">
        <input
          type="text"
          placeholder="Type your message ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-4/5  xs:w-[94%] md:w-[95%] lg:w-[96%] xl:w-[97%] 2xl:w-[98%] border-2 border-gray-200 bg-transparent rounded-md px-2 py-1 focus:outline-none focus:border-orange-500"
        />

        <button
          type="submit"
          className="w-1/5 xs:w-[6%] md:w-[5%] lg:w-[4%] xl:w-[3%] 2xl:w-[2%] text-white hover:text-orange-500 items-center justify-center flex"
        >
          <SendRoundedIcon />
        </button>
      </form>
    </div>
  );
}

const AdminRealtime = ({ usersData }) => {
  const [users, setUsers] = useState(usersData);
  const [activeUser, setActiveUser] = useState(null);
  const [showUsersList, setShowUsersList] = useState(true);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const joinChatRoom = (user) => {
    setShowUsersList(false);
    if (activeUser === user) return;
    setActiveUser(user);
    socket.emit("join", {
      chatId: user._id,
      sender: "admin",
      receiver: user._id,
    });
  };

  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}usersChats`);
    socket.on("connect", () => {
      console.log("Connected in UsersChat");
    });
  }, []);

  return (
    <div className="font-poppins">
      <main className="mb-2 flex flex-col md:flex-row justify-between">
        <h1 className="text-3xl">Realtime Chat</h1>
      </main>

      {/* //! Desktop View */}
      <div
        className="sm:flex gap-3 hidden"
        style={{ maxHeight: "calc(100vh - 117px)" }}
      >
        <div className="h-auto overflow-auto w-[25%] glassmorphism-projects rounded-md">
          {users.map((user, index) => (
            <div
              key={user._id}
              className="flex-col justify-between items-center"
            >
              <div
                onClick={() => {
                  joinChatRoom(user);
                }}
                className={`flex-col items-center hover:bg-[#d8730e] pl-2 py-3 mx-3 cursor-pointer rounded-md my-2 ${
                  activeUser === null
                    ? null
                    : activeUser._id === user._id
                    ? "bg-[#f3993f]"
                    : "hover:bg-[#d8730e]"
                }`}
              >
                <div
                  className={`text-[15px] ${
                    activeUser === null
                      ? null
                      : user._id === activeUser._id &&
                        "text-black font-semibold"
                  }`}
                >
                  {capitalizeFirstLetter(user.firstName)}{" "}
                  {capitalizeFirstLetter(user.lastName)}{" "}
                </div>
                <div
                  className={`text-[12px] overflow-hidden ${
                    activeUser === null
                      ? null
                      : user._id === activeUser._id
                      ? "text-black font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  {user.username}
                </div>
              </div>
              <div
                className={
                  index < users.length - 1 &&
                  `border-[1px] rounded-full mx-3 border-[#666666]`
                }
              />
            </div>
          ))}
        </div>
        {activeUser === null ? (
          <div className="w-[75%] glassmorphism rounded-md p-3 flex flex-col justify-center items-center">
            <FaInfoCircle className="text-5xl text-gray-400" />
            <p className="text-gray-400 text-2xl">
              Select a user to start chat
            </p>
          </div>
        ) : (
          <div className="w-[75%] glassmorphism-projects rounded-md p-3">
            <header className="flex items-center justify-between">
              <h3 className="text-lg flex items-center gap-2">
                {capitalizeFirstLetter(activeUser.firstName)}
                {"  "}
                {capitalizeFirstLetter(activeUser.lastName)}
              </h3>
            </header>
            <div className="border-[1px] opacity-50 rounded-full my-2" />
            <section className="flex-col">
              <div>
                <ChatModule user={activeUser} />
              </div>
            </section>
          </div>
        )}
      </div>

      {/* //! Mobile View */}
      <div
        className="flex sm:hidden"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {showUsersList && (
          <div className="h-auto overflow-auto w-[100%] glassmorphism-projects rounded-md">
            {users.map((user, index) => (
              <div
                key={user._id}
                className="flex-col justify-between items-center"
              >
                <div
                  onClick={() => {
                    joinChatRoom(user);
                  }}
                  className={`flex-col items-center hover:bg-[#d8730e] pl-2 py-3 mx-1 cursor-pointer rounded-md my-2`}
                >
                  <div className={`text-[15px]`}>
                    {capitalizeFirstLetter(user.firstName)}{" "}
                    {capitalizeFirstLetter(user.lastName)}{" "}
                  </div>
                  <div className={`text-[12px] overflow-hidden `}>
                    {user.username}
                  </div>
                </div>
                <div
                  className={
                    index < users.length - 1 &&
                    `border-[1px] rounded-full mx-3 border-[#666666]`
                  }
                />
              </div>
            ))}
          </div>
        )}
        {!showUsersList && (
          <div className="w-[100%] glassmorphism-projects rounded-md p-3">
            <header className="flex items-center justify-between">
              <h3 className="text-lg flex items-center gap-2">
                <BsArrowLeft onClick={() => setShowUsersList(true)} />
                {capitalizeFirstLetter(activeUser.firstName)}
                {"  "}
                {capitalizeFirstLetter(activeUser.lastName)}
              </h3>
            </header>
            <div className="border-[1px] opacity-50 rounded-full my-2" />
            <section className="flex-col">
              <div>
                <ChatModule user={activeUser} />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRealtime;
