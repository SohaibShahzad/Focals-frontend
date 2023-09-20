import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { TbSend } from "react-icons/tb";
import ProgressBar from "../../components/progressBar";
import { FaInfoCircle } from "react-icons/fa";
import { RiChat1Line } from "react-icons/ri";
import Link from "next/link";

const jwt_decode = jwt.decode;
let socket;

function ProjectChat({ chatId, userData }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  const scrollToBottom = () => {
    messagesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const messageHandler = ({ user, message }) => {
      const displayName = user === "Admin" ? "Admin" : "You";
      console.log("Message in user", message, displayName);
      setMessages((oldMessages) => [
        ...oldMessages,
        { user: displayName, message },
      ]);
    };

    if (socket) {
      socket.on("chatHistory", (history) => {
        setMessages(
          history.map(({ user, message }) => ({
            user: user === "Admin" ? "Admin" : "You",
            message,
          }))
        );
      });
      socket.on("chat", messageHandler);
      socket.emit("requestChatHistory", { chatId });
    }

    return () => {
      if (socket) {
        socket.off("chat", messageHandler);
      }
    };
  }, []);

  useEffect(scrollToBottom, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("chat", { chatId, user: userData.firstName, message });
      setMessage("");
    }
  };

  return (
    <div className="pt-4 flex flex-col max-h-[45vh]">
      <div className="overflow-y-auto mb-4 flex-grow">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`my-2 ${
              message.user === "You" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-2 py-1 rounded-lg break-all ${
                message.user === "You"
                  ? "bg-orange-800 text-white rounded-br-none"
                  : "bg-gray-300 text-black rounded-bl-none"
              }`}
            >
              {message.message}
            </div>
          </div>
        ))}
        <div ref={messagesRef} />
      </div>
      <form onSubmit={sendMessage} className="w-full flex gap-2 justify-center">
        <input
          value={message}
          className="w-4/5  xs:w-[94%] md:w-[95%] lg:w-[96%] xl:w-[97%] 2xl:w-[98%] border-2 border-gray-200 bg-transparent rounded-md px-2 focus:outline-none focus:border-orange-500"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="w-1/5 xs:w-[6%] md:w-[5%] lg:w-[4%] xl:w-[3%] 2xl:w-[2%] bg-orange-500 text-white rounded-full items-center justify-center flex"
        >
          <TbSend className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default function UserProjects({ userProjects, userData }) {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedProject, setExpandedProject] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}projectChats`);

    socket.on("connect", () => {
      console.log("connected to the server");
    });

    return () => {
      console.log("disconnecting from the server");
      socket.disconnect();
    };
  }, []);

  const handleExpand = (project) => {
    if (expandedProject === project._id) {
      setExpandedProject(null);
      socket.emit("leave", { chatId: expandedProject });
      setShowChat(false);
    } else {
      setExpandedProject(project._id);
      socket.emit("join", {
        chatId: project._id,
        user: userProjects.user,
      });
    }
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="font-poppins flex flex-col gap-4">
      <main className="text-center">
        <h1 className="text-3xl underline font-bold">Projects</h1>
      </main>
      {userProjects ? (
        <div>
          <Tabs selectedIndex={activeTab} onSelect={handleTabChange}>
            <TabList className="flex gap-3 justify-center mb-4 cursor-pointer">
              <Tab
                selectedClassName="bg-orange-500 font-bold"
                className="border-2 rounded-md p-2"
              >
                OnGoing
              </Tab>
              <Tab
                selectedClassName="bg-orange-500 font-bold"
                className="border-2 rounded-md p-2"
              >
                Completed
              </Tab>
            </TabList>
            <TabPanel>
              <div
                style={{ maxHeight: "calc(100vh - 185px)"}}
                className="overflow-y-auto rounded-b-md"
              >
                {userProjects.ongoingProjects.map((project) => (
                  <div
                    key={project._id}
                    className="glassmorphism-projects rounded-md p-5 mb-3 md:px-7"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-3">
                        <h2 className="text-[18px] xs:text-[20px]">
                          {project.projectName}
                        </h2>
                        <p className="text-[14px] xs:text-[16px] text-gray-300">
                          Date:
                          {project.startDate === null
                            ? "TBD"
                            : formatDate(project.startDate)}
                          -{" "}
                          {project.endDate === null
                            ? "TBD"
                            : formatDate(project.endDate)}
                        </p>
                      </div>
                      {expandedProject === project._id ? (
                        <MdKeyboardArrowDown
                          className="w-8 h-8 cursor-pointer hover:bg-orange-500 rounded-full"
                          onClick={() => {
                            setShowChat(false);
                            handleExpand(project);
                          }}
                        />
                      ) : (
                        <MdKeyboardArrowRight
                          className="w-8 h-8 cursor-pointer hover:bg-orange-500 rounded-full"
                          onClick={() => {
                            setShowChat(false);
                            handleExpand(project);
                          }}
                        />
                      )}
                    </div>
                    {expandedProject === project._id && (
                      <>
                        <div className="h-1 my-3 bg-gray-500 rounded-md" />
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            Progress:
                            <div className="flex flex-col w-1/2 sm:w-1/3 items-center">
                              {project.progress}%
                              <ProgressBar progress={project.progress} />
                            </div>
                          </div>
                          <div className="flex flex-col xs:flex-row justify-center gap-3 md:gap-20">
                            <div className="text-center p-2 border-4 border-orange-700 rounded-md">
                              Meeting
                              <p>{project.meetingStatus}</p>
                            </div>
                            <div className="text-center p-2 border-4 border-orange-700 rounded-md">
                              Status
                              <p>{project.status}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          className="p-1 rounded-full bg-orange-500"
                          onClick={() => {
                            if (chatId === project._id && showChat) {
                              setShowChat(false);
                            } else {
                              setShowChat(true);
                              setChatId(project._id);
                            }
                          }}
                        >
                          <RiChat1Line className="w-7 h-7" />
                        </button>
                        {showChat && chatId === project._id && (
                          <ProjectChat
                            chatId={project._id}
                            userData={userData}
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </TabPanel>
            <TabPanel>
              <div
                style={{ maxHeight: "calc(100vh - 200px)", height: 450 }}
                className="overflow-y-auto"
              >
                {userProjects.projectHistory.map((project) => (
                  <div
                    key={project._id}
                    className="glassmorphism-projects rounded-md p-5 mb-3 md:px-7"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-3">
                        <h2 className="text-[18px] xs:text-[20px]">
                          {project.projectName}
                        </h2>
                        <p className="text-[14px] xs:text-[16px] text-gray-300">
                          Date:
                          {project.startDate === null
                            ? "TBD"
                            : formatDate(project.startDate)}
                          -{" "}
                          {project.endDate === null
                            ? "TBD"
                            : formatDate(project.endDate)}
                        </p>
                      </div>
                      {expandedProject === project._id ? (
                        <MdKeyboardArrowDown
                          className="w-8 h-8 cursor-pointer hover:bg-orange-500 rounded-full"
                          onClick={() => handleExpand(project)}
                        />
                      ) : (
                        <MdKeyboardArrowRight
                          className="w-8 h-8 cursor-pointer hover:bg-orange-500 rounded-full"
                          onClick={() => handleExpand(project)}
                        />
                      )}
                    </div>
                    {expandedProject === project._id && (
                      <>
                        <div className="h-1 my-3 bg-gray-500 rounded-md" />
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            Progress:
                            <div className="flex flex-col w-1/2 sm:w-1/3 items-center">
                              {project.progress}%
                              <ProgressBar progress={project.progress} />
                            </div>
                          </div>
                          <div className="flex flex-col xs:flex-row justify-center gap-3 md:gap-20">
                            <div className="text-center p-2 border-4 border-orange-700 rounded-md">
                              Meeting
                              <p>{project.meetingStatus}</p>
                            </div>
                            <div className="text-center p-2 border-4 border-orange-700 rounded-md">
                              Status
                              <p>{project.status}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </TabPanel>
          </Tabs>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-5 justify-center">
          <span className="flex justify-center gap-3 opacity-50 items-center">
            <FaInfoCircle className="w-10 h-10" />
            <span className="text-[20px] font-bold">No Projects Yet</span>
          </span>
          <div className="flex justify-center">
            <Link
              href="/services"
              className="text-[22px] button-animation-reverse text-center rounded-md py-2 px-6"
            >
              Let's Shop!
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  const decoded = jwt_decode(token);
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}projects/getProjectsByUser/${decoded.id}`
  );
  const userProjects = response.data;

  const responseUser = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}users/getUserbyId/${decoded.id}`
  );

  const userData = responseUser.data;

  return {
    props: {
      userProjects,
      userData,
    },
  };
}
