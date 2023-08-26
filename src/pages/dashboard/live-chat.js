import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
import { FaInfoCircle } from "react-icons/fa";

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
  }, []);

  useEffect(() => {
    const messageHandler = ({ chatId, messages }) => {
      const message = {
        sender: messages.sender,
        receiver: messages.receiver,
        message: messages.message,
      };
      setMessages((prev) => [...prev, message]);
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
      socket.emit("requestChatHistory", { chatId: userDetails.id });
    }

    scrollToBottom();

    return () => {
      socket.off("chat", messageHandler);
    };
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const messageData = {
      sender: userDetails.id,
      receiver: "admin",
      message,
    };
    if (message) {
      socket.emit("chat", {
        chatId: userDetails.id,
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
    <div className="font-poppins">
      <main className="text-center">
        <h1 className="text-3xl underline font-bold">Live Chat</h1>
      </main>
      <div>
        <div>
          {messages.length === 0 ? (
            <div className="flex text-center justify-center items-center"
                style={{ height: "calc(100vh - 150px)" }}
            >
              <FaInfoCircle className="text-5xl text-gray-400" />
              <p className="text-xl">No messages yet</p>
            </div>
          ) : (
            <div
              className="overflow-y-auto"
              style={{ height: "calc(100vh - 150px)" }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-start justify-start my-2 mr-2 ${
                    message.sender !== "admin" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center px-2 py-1 rounded-md ${
                      message.sender !== "admin"
                        ? "bg-orange-800 text-white rounded-br-none"
                        : "bg-gray-300 text-black rounded-bl-none"
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
