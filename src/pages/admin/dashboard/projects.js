import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState, useEffect, useRef } from "react";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdOutlineSearchOff,
  MdOutlineSearch,
} from "react-icons/md";
import io from "socket.io-client";
import { TbSend } from "react-icons/tb";
import { RiChat1Line } from "react-icons/ri";

let socket;

function AdminChat({ chatId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  const scrollToBottom = () => {
    messagesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const messageHandler = ({ user, message }) => {
      const displayName = user === "Admin" ? "You" : user;
      setMessages((oldMessages) => [
        ...oldMessages,
        { user: displayName, message },
      ]);
    };

    if (socket) {
      socket.on("chatHistory", (history) => {
        setMessages(
          history.map(({ user, message }) => ({
            user: user === "Admin" ? "You" : user,
            message,
          }))
        );
      });
      socket.on("chat", messageHandler);
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
      socket.emit("chat", { chatId, user: "Admin", message });
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

export default function Projects({ projects }) {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedProject, setExpandedProject] = useState(null);
  const [searchValueOngoing, setSearchValueOngoing] = useState("");
  const [searchValueCompleted, setSearchValueCompleted] = useState("");
  const [searchByOngoing, setSearchByOngoing] = useState("project");
  const [searchByCompleted, setSearchByCompleted] = useState("project");
  const [isSearchOpenOngoing, setIsSearchOpenOngoing] = useState(false);
  const [isSearchOpenCompleted, setIsSearchOpenCompleted] = useState(false);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);

  useEffect(() => {
    const ongoing = [];
    const completed = [];

    projects.forEach((userProject) => {
      userProject.ongoingProjects.forEach((project) => {
        ongoing.push({
          ...project,
          email: userProject.email,
        });
      });
      userProject.projectHistory.forEach((project) => {
        completed.push({
          ...project,
          email: userProject.email,
        });
      });
    });

    setOngoingProjects(ongoing);
    setCompletedProjects(completed);
  }, [projects]);

  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`);

    socket.on("connect", () => {
      console.log("connected to the server");
    });

    return () => {
      console.log("disconnecting from the server");
      socket.disconnect();
    };
  }, []);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleExpand = (project) => {
    if (expandedProject === project._id) {
      setExpandedProject(null);
      socket.emit("leave", { chatId: expandedProject });
    } else {
      setExpandedProject(project._id);
      socket.emit("join", {
        chatId: project._id,
        user: "Admin",
      });
    }
  };

  const filteredOngoingProjects = ongoingProjects.filter(
    (project) =>
      searchValueOngoing.trim().length < 2 ||
      (searchByOngoing === "project" &&
        project.projectName
          ?.toLowerCase()
          .includes(searchValueOngoing.trim().toLowerCase())) ||
      (searchByOngoing === "email" &&
        project.email
          ?.toLowerCase()
          .includes(searchValueOngoing.trim().toLowerCase()))
  );

  const filteredCompletedProjects = completedProjects.filter(
    (project) =>
      searchValueCompleted.trim().length < 2 ||
      (searchByCompleted === "project" &&
        project.projectName
          ?.toLowerCase()
          .includes(searchValueCompleted.trim().toLowerCase())) ||
      (searchByCompleted === "email" &&
        project.email
          ?.toLowerCase()
          .includes(searchValueCompleted.trim().toLowerCase()))
  );

  return (
    <div className="flex flex-col font-poppins">
      <main className="mb-2 flex flex-col md:flex-row justify-between">
        <h1 className="text-3xl">Projects</h1>
      </main>
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
        <TabPanel
          style={{ maxHeight: "calc(100vh - 200px)", height: 500 }}
          className="h-auto overflow-auto "
        >
          <div className="mr-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold underline text-[18px]">In Progress:</h3>
              <button
                className="bg-orange-700 text-white rounded-full p-1"
                onClick={() =>
                  setIsSearchOpenOngoing((prevState) => !prevState)
                }
              >
                {isSearchOpenOngoing ? (
                  <MdOutlineSearchOff className="w-5 h-5" />
                ) : (
                  <MdOutlineSearch className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="border-b-2 mx-auto rounded-md border-gray-500 my-3 w-[90%]" />
            {isSearchOpenOngoing && (
              <div className="flex md:justify-end justify-center mb-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    className="bg-[#333333] p-2 border-2 rounded-md border-orange-700"
                    type="text"
                    placeholder="Search..."
                    value={searchValueOngoing}
                    onChange={(e) => setSearchValueOngoing(e.target.value)}
                  />
                  <div className="flex flex-col">
                    <select
                      onChange={(e) => setSearchByOngoing(e.target.value)}
                      className="bg-[#333333] p-2 border-2 rounded-md border-orange-700"
                    >
                      <option
                        value="project"
                        className="text-black text-[15px]  max-w-[150px]"
                      >
                        By Project Name
                      </option>
                      <option
                        value="email"
                        className="text-black  text-[15px]  max-w-[150px]"
                      >
                        By Email
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          {filteredOngoingProjects.map((project) => (
            // Map each project to a component that displays the project info
            <div
              key={project._id}
              className="text-white bg-[#313132] rounded-md p-5 mb-3 mr-3 md:px-7"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] xs:text-[20px]">
                  {project.projectName}
                </h2>
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
                <div>
                  <button
                    className="p-1 rounded-full bg-orange-500"
                    onClick={() => {}}
                  >
                    <RiChat1Line className="w-7 h-7" />
                  </button>
                  <AdminChat chatId={project._id} />
                </div>
              )}
            </div>
          ))}
        </TabPanel>
        <TabPanel
        // style={{ maxHeight: "calc(100vh - 200px)", height: 500 }}
        // className="h-auto overflow-auto"
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-bold underline text-[18px]">History:</h3>
              <button
                className="bg-orange-700 text-white rounded-full p-1"
                onClick={() =>
                  setIsSearchOpenCompleted((prevState) => !prevState)
                }
              >
                {isSearchOpenOngoing ? (
                  <MdOutlineSearchOff className="w-5 h-5" />
                ) : (
                  <MdOutlineSearch className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="border-b-2 mx-auto rounded-md border-gray-500 my-3 w-[90%]" />

            {isSearchOpenCompleted && (
              <div className="flex md:justify-end justify-center mb-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    className="bg-[#333333] p-2 border-2 rounded-md border-orange-700"
                    placeholder="Search..."
                    value={searchValueCompleted}
                    onChange={(e) => setSearchValueCompleted(e.target.value)}
                  />
                  <select
                    onChange={(e) => setSearchByCompleted(e.target.value)}
                    className="bg-[#333333] p-2 border-2 rounded-md border-orange-700"
                  >
                    <option value="project">By Project Name</option>
                    <option value="email">By Email</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          {filteredCompletedProjects.map((project) => (
            // Map each project to a component that displays the project info
            <div key={project._id}>{/* Project info goes here */}</div>
          ))}
        </TabPanel>
      </Tabs>
    </div>
  );
}

export async function getServerSideProps() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}projects/getAllProjects`
  );
  const projects = response.data;

  console.log(projects);

  return {
    props: {
      projects,
    },
  };
}
