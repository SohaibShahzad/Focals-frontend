import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
import { FaInfoCircle, FaUserCircle } from "react-icons/fa";

const jwt_decode = jwt.decode;
let socket;

export default function LiveChat({ userDetails }) {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}usersChats`);
    socket.emit("join", {
      chatId: userDetails.id,
      sender: userDetails.id,
      receiver: "admin",
    });

    socket.on("chatHistory", (history) => {
      console.log("Chat history: ", history);
      setMessages(history ? history : []);
    });

    socket.on("chat", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    socket.emit("requestChatHistory", { chatId: userDetails.id });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, []); 

  const sendMessage = (e) => {
    e.preventDefault();
    // console.log("User details: ", userDetails);
    const messageData = {
      sender: userDetails.firstName,
      receiver: "admin",
      message,
    };
    if (message) {
      socket.emit("chat", {
        chatDetails: userDetails,
        messageData,
      });
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log("Messages: ", messages);

  return (
    <div className="font-poppins">
      <div
        className="glassmorphism-projects p-2 rounded-md"
        style={{ height: "calc(100vh - 75px)" }}
      >
        <div className="pt-2 pl-3">
          <span className="text-[24px] flex gap-2">
            <img
              src="/Logo.png"
              alt="FutureFocals"
              className="w-9 h-9 rounded-md p-1 bg-black"
            />
            Future Focals
          </span>
          <div className="border-2 rounded-full my-3 opacity-50" />
        </div>
        <div>
          {messages.length === 0 ? (
            <div
              className="flex text-center justify-center items-center"
              style={{ height: "calc(100vh - 205px)" }}
            >
              <FaInfoCircle className="text-5xl text-gray-400" />
              <p className="text-xl">No messages yet</p>
            </div>
          ) : (
            <div
              className="overflow-y-auto"
              style={{ height: "calc(100vh - 205px)" }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-start justify-start my-2 mr-2 ${
                    message.user !== "admin" ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {message.user === "admin" && (
                      <img
                        src="/Logo.png"
                        alt="FutureFocals"
                        className="w-10 h-10 rounded-full bg-black p-2"
                      />
                    )}
                    <div
                      className={`flex items-center justify-center px-2 py-1 rounded-md ${
                        message.user !== "admin"
                          ? "bg-orange-800 text-white rounded-br-none"
                          : "bg-gray-300 text-black rounded-bl-none"
                      }`}
                    >
                      {message.message}
                    </div>
                    {message.user !== "admin" && (
                      <FaUserCircle className="w-9 h-9" />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
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
    </div>
  );
}

export async function getServerSideProps(context) {
  const { token } = parseCookies(context);
  const userDetails = jwt_decode(token);

  return {
    props: {
      userDetails,
    },
  };
}
