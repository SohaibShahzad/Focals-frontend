import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

let socket;

const AdminRealtimePanel = ({ usersData }) => {
  const [users, setUsers] = useState(usersData);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    socket = io("http://localhost:5000");
    socket.on("chatHistory", (messages) => {
      setChatHistory(messages);
    });
    socket.on("chat", (message) => {
      setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
    });
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    socket.emit("join", { chatType: "user", chatId: user._id, user: "Admin" });
    
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim().length > 0) {
      socket.emit("chat", {
        chatType: "user",
        chatId: selectedUser._id,
        user: "Admin",
        recipientId: selectedUser._id,
        message,
      });
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen gap-2">
      <div className="w-1/4">
        <ul className="h-[calc(100%-75px)] overflow-y-auto glassmorphism-projects rounded-md">
          {users.map((user) => (
            <li key={user.id} className="m-2 border-b-2 border-gray-600">
              <button
                onClick={() => handleSelectUser(user)}
                className={`w-full text-left p-4 hover:bg-orange-500 mb-1 rounded-md font-poppins ${
                  selectedUser && selectedUser._id === user._id
                    ? "bg-orange-400 text-black hover:bg-orange-400"
                    : ""
                }`}
              >
                {user.firstName} {user.lastName}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-grow flex flex-col glassmorphism h-[calc(100%-75px)] rounded-md">
        {selectedUser && (
          <>
            <div className="flex-grow overflow-y-auto">
              {chatHistory.map((message, index) => (
                <div key={index} className="p-2">
                  <div className="bg-gray-200 rounded p-2">
                    {message.message}
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={handleSendMessage}
              className="flex-shrink-0 flex items-center p-2"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow rounded-l p-2 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
                placeholder="Type your message"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminRealtimePanel;
