import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdOutlineSearchOff,
  MdOutlineSearch,
} from "react-icons/md";
import io from "socket.io-client";
import { RiChat1Line } from "react-icons/ri";
import DialogActions from "@mui/material/DialogActions";
import { Dialog } from "@mui/material";
import { FiEdit2 } from "react-icons/fi";
import { IoMdArrowRoundBack } from "react-icons/io";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { FaInfoCircle } from "react-icons/fa";

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
      console.log("Message in Admin", message, displayName);
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
      socket.emit("requestChatHistory", { chatId });
    }

    return () => {
      if (socket) {
        socket.off("chat", messageHandler);
        // socket.emit("leave", { chatId, user: "Admin" });
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
    <div className="pt-4 flex flex-col max-h-[45vh] bg-[#0d0d0d] bg-opacity-40 p-5 rounded-b-md">
      <div className="overflow-y-auto mb-4 flex-grow">
        {messages.length === 0 ? (
          <div className="flex items-center gap-2 opacity-70 justify-center">
            <FaInfoCircle className="w-7 h-7" />
            <span className="text-[20px]">No Messages</span>
          </div>
        ) : (
          messages.map((message, i) => (
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
          ))
        )}
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
          className="w-1/5 xs:w-[6%] md:w-[5%] lg:w-[4%] xl:w-[3%] 2xl:w-[2%] hover:text-orange-500 items-center justify-center flex"
        >
          <SendRoundedIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

const formatDateToYYYYMMDD = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};

function EditProjectForm({ project, onDone }) {
  const [status, setStatus] = useState(project.status);
  const [projectName, setProjectName] = useState(project.projectName);
  const [startDate, setStartDate] = useState(
    formatDateToYYYYMMDD(project.startDate)
  );
  const [endDate, setEndDate] = useState(formatDateToYYYYMMDD(project.endDate));
  const [progress, setProgress] = useState(project.progress);
  const [price, setPrice] = useState(project.price);
  const [meetingStatus, setMeetingStatus] = useState(project.meetingStatus);
  const inputStyling =
    "border-2 border-orange-600 rounded-md px-2 py-1 focus:outline-none focus:border-orange-500";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}projects/updateProject/${project.userId}/${project._id}`,
        {
          status,
          //   projectName,
          startDate,
          endDate,
          progress,
          //   price,
          //   meetingStatus,
        }
      );
      onDone();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={true} onClose={onDone}>
      <form
        onSubmit={handleSubmit}
        className="bg-[#333333] text-white font-poppins p-2 flex flex-col gap-2"
      >
        <h1 className="text-center text-[20px] font-bold">Update Details</h1>
        {/* <label>
          Project Name:
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent border-2 border-gray-200 rounded-md px-2 focus:outline-none focus:border-orange-500"
          />
        </label> */}
        <label className="flex flex-col">
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`${inputStyling} bg-transparent`}
          />
        </label>
        <label className="flex flex-col">
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`${inputStyling} bg-transparent`}
          />
        </label>
        <label className="flex flex-col">
          Status:
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${inputStyling} bg-[#333333]`}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Revision">Revision</option>
            <option value="Awaiting Approval">Awaiting Approval</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
        <label className="flex flex-col">
          Progress:
          <input
            type="number"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            className={`${inputStyling} bg-transparent`}
          />
        </label>
        {/* <label className="flex flex-col">
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          className={`${inputStyling} bg-transparent`}
          />
        </label>
        <label className="flex flex-col">
          Meeting Status:
          <select
            value={meetingStatus}
            onChange={(e) => setMeetingStatus(e.target.value)}
            className={`${inputStyling} bg-[#333333]`}
          >
            <option value="Not scheduled">Not scheduled</option>
            <option value="Scheduled">Scheduled</option>
          </select>
        </label> */}
        <input
          type="submit"
          value="Submit"
          className="bg-orange-600 mt-2 py-1 hover:bg-orange-500 cursor-pointer rounded-md"
        />
      </form>
    </Dialog>
  );
}

const ProjectsPanel = ({ projectsData }) => {
  const [projects, setProjects] = useState(projectsData);
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
  const [editingProject, setEditingProject] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [clientDetails, setClientDetails] = useState(false);

  const fetchingProjects = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}projects/getAllProjects`
      );
      setProjects(res.data);
      console.log("Here in fetching");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchingProjects();
  }, []);

  useEffect(() => {
    const ongoing = [];
    const completed = [];

    projects.forEach((userProject) => {
      userProject.ongoingProjects.forEach((project) => {
        ongoing.push({
          ...project,
          email: userProject.email,
          userId: userProject.user,
          userName: userProject.userName,
        });
      });
      userProject.projectHistory.forEach((project) => {
        completed.push({
          ...project,
          email: userProject.email,
          userId: userProject.user,
          userName: userProject.userName,
        });
      });
    });

    setOngoingProjects(ongoing);
    setCompletedProjects(completed);
  }, [projects]);

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

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleEdit = (project) => {
    fetchingProjects();
    if (editingProject && editingProject._id === project._id) {
      setEditingProject(null);
    } else {
      setEditingProject(project);
    }
  };

  const onDone = () => {
    setEditingProject(null);
  };

  const handleExpand = (project) => {
    if (expandedProject === project._id) {
      setExpandedProject(null);
      socket.emit("leave", { chatId: expandedProject });
      setShowChat(false); // Close chat when project is collapsed
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

  const calculateRemainingTime = (startDate, endDate) => {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    let start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    let end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    // If the start date is in the future
    if (start > currentDate) {
      const diffTimeStart = Math.abs(start - currentDate);
      const diffDaysStart = Math.ceil(diffTimeStart / (1000 * 60 * 60 * 24));
      return `To commence after ${diffDaysStart} days`;
    }

    // If the start date is in the past and the end date is in the future
    if (end > currentDate) {
      const diffTimeEnd = Math.abs(end - currentDate);
      const diffDaysEnd = Math.ceil(diffTimeEnd / (1000 * 60 * 60 * 24));
      return `${diffDaysEnd} days remaining`;
    }

    // If the project ends today
    if (end.getTime() === currentDate.getTime()) {
      return `Project ends today`;
    }

    // If the project has already ended
    return `The project has already ended`;
  };

  const calculateTotalTime = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays} days`;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
        <TabPanel>
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
                        className="text-[15px]  max-w-[150px]"
                      >
                        By Project Name
                      </option>
                      <option
                        value="email"
                        className=" text-[15px]  max-w-[150px]"
                      >
                        By Email
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            style={{ maxHeight: "calc(100vh - 230px)" }}
            className="overflow-y-auto rounded-md"
          >
            {filteredOngoingProjects.map((project) => (
              // Map each project to a component that displays the project info
              <div
                key={project._id}
                className="text-white glassmorphism-projects rounded-md p-5 mb-3 mr-3 md:px-7"
              >
                <div className="hidden md:flex items-center justify-between">
                  <h2 className="text-[18px] xs:text-[20px]">
                    {project.projectName}
                  </h2>
                  <div className="flex flex-col items-center opacity-50 ">
                    <span>{project.userName}</span>
                    <span className="text-xs">{project.email}</span>
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
                <div className="md:hidden flex flex-col gap-2 items-center">
                  <h2 className="text-[18px] xs:text-[20px] text-center">
                    {project.projectName}
                  </h2>
                  <div className="opacity-50 flex flex-col items-center">
                    <span>{project.userName}</span>
                    <span className="text-xs">{project.email}</span>
                  </div>
                  {expandedProject === project._id ? (
                    <span
                      onClick={() => handleExpand(project)}
                      className="flex items-center bg-orange-600 rounded-md px-2 py-1"
                    >
                      Close
                      <MdKeyboardArrowRight className="h-6 w-6" />
                    </span>
                  ) : (
                    <span
                      onClick={() => handleExpand(project)}
                      className="flex items-center bg-orange-600 rounded-md px-2 py-1"
                    >
                      Expand
                      <MdKeyboardArrowDown className="h-6 w-6" />
                    </span>
                  )}
                </div>
                {expandedProject === project._id && (
                  <div>
                    <div className="border-[1px] rounded-full opacity-20 my-5" />
                    <div className="hidden xs:flex xs:flex-col xs:gap-5">
                      {!showChat && (
                        <div className="bg-black rounded-md p-5 bg-opacity-40">
                          <div className="flex items-start justify-between">
                            <h2 className="text-[18px] font-semibold text-[#dddddd]">
                              Project Details:
                            </h2>
                            <span
                              onClick={() => handleEdit(project)}
                              className="flex items-center gap-2 text-[16px] rounded-md px-2 py-1 button-animation-reverse cursor-pointer"
                            >
                              Edit
                              <FiEdit2 />
                            </span>
                          </div>

                          <div className="flex gap-5 mt-4">
                            <div className="w-[50%] glassmorphism-projects pb-3 rounded-md overflow-hidden text-center justify-between gap-1">
                              <h1 className="bg-orange-600 text-[22px] underline">
                                Timeline
                              </h1>
                              <div className="grid sm:grid-cols-2 gap-y-5 mt-3">
                                <div>
                                  <h1 className="text-md text-[#CCCCCC] px-3">
                                    Start-Date
                                  </h1>
                                  <p className="text-xl font-bold px-3 text-center">
                                    {project.startDate === null
                                      ? "TBD"
                                      : formatDate(project.startDate)}
                                  </p>
                                </div>
                                <div>
                                  <h1 className="text-md text-[#CCCCCC] px-3">
                                    Dead-Line
                                  </h1>
                                  <p className="text-xl font-bold px-3 text-center">
                                    {project.endDate === null
                                      ? "TBD"
                                      : formatDate(project.endDate)}
                                  </p>
                                </div>
                                <div>
                                  <h1 className="text-md text-[#CCCCCC] px-3">
                                    Total Time
                                  </h1>
                                  <p className="text-xl font-bold px-3 text-center">
                                    {project.endDate === project.startDate
                                      ? "1 day"
                                      : calculateTotalTime(
                                          project.startDate,
                                          project.endDate
                                        )}
                                  </p>
                                </div>
                                <div>
                                  <h1 className="text-md text-[#CCCCCC] px-3">
                                    Remaining Time
                                  </h1>
                                  <p className="text-xl font-bold px-3 text-center">
                                    {project.endDate === null
                                      ? "TBD"
                                      : calculateRemainingTime(
                                          project.startDate,
                                          project.endDate
                                        )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="w-[50%] glassmorphism-projects pb-3 rounded-md overflow-hidden text-center justify-between gap-1">
                              <h1 className="bg-orange-600 text-[22px] underline">
                                Summary
                              </h1>
                              <div className="grid sm:grid-cols-2 gap-y-5 mt-3">
                                <div>
                                  <h1 className="text-md text-[#CCCCCC] px-3">
                                    Progress
                                  </h1>
                                  <p className="text-xl font-bold px-3 text-center">
                                    {project.progress}%
                                  </p>
                                </div>
                                <div>
                                  <h1 className="text-md text-[#CCCCCC] px-3">
                                    Status
                                  </h1>
                                  <p className="text-xl font-bold px-3 text-center">
                                    {project.status}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {editingProject && editingProject._id === project._id && (
                        <EditProjectForm
                          project={editingProject}
                          onDone={() => handleEdit(project)}
                        />
                      )}
                    </div>
                    {!showChat && (
                      <div className="xs:hidden bg-black rounded-md p-2 bg-opacity-40">
                        <div className="flex items-center justify-between">
                          <h2 className="text-[16px] text-[#dddddd]">
                            Details:
                          </h2>
                          <span
                            onClick={() => handleEdit(project)}
                            className="flex items-center gap-1 text-[16px] rounded-md px-1 button-animation-reverse cursor-pointer"
                          >
                            <FiEdit2 />
                          </span>
                        </div>
                        <div className="space-y-5 mt-4">
                          <div className="glassmorphism-projects pb-3 rounded-sm overflow-hidden text-center justify-between gap-1">
                            <h1 className="bg-orange-600 text-[22px] underline">
                              Timeline
                            </h1>
                            <div className="flex flex-col gap-3 mt-3">
                              <div>
                                <h1 className="text-md text-[#CCCCCC] px-3">
                                  Start-Date
                                </h1>
                                <p className="text-md font-bold px-3 text-center">
                                  {project.startDate === null
                                    ? "TBD"
                                    : formatDate(project.startDate)}
                                </p>
                              </div>
                              <div>
                                <h1 className="text-md text-[#CCCCCC] px-3">
                                  Dead-Line
                                </h1>
                                <p className="text-md font-bold px-3 text-center">
                                  {project.endDate === null
                                    ? "TBD"
                                    : formatDate(project.endDate)}
                                </p>
                              </div>
                              <div>
                                <h1 className="text-md text-[#CCCCCC] px-3">
                                  Total Time
                                </h1>
                                <p className="text-md font-bold px-3 text-center">
                                  {project.endDate === project.startDate
                                    ? "1 day"
                                    : calculateTotalTime(
                                        project.startDate,
                                        project.endDate
                                      )}
                                </p>
                              </div>
                              <div>
                                <h1 className="text-md text-[#CCCCCC] px-3">
                                  Remaining Time
                                </h1>
                                <p className="text-md font-bold px-3 text-center">
                                  {project.endDate === null
                                    ? "TBD"
                                    : calculateRemainingTime(
                                        project.startDate,
                                        project.endDate
                                      )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="glassmorphism-projects pb-3 rounded-sm overflow-hidden text-center justify-between gap-1">
                            <h1 className="bg-orange-600 text-[22px] underline">
                              Summary
                            </h1>
                            <div className="flex flex-col gap-3 mt-3">
                              <div>
                                <h1 className="text-md text-[#CCCCCC] px-3">
                                  Progress
                                </h1>
                                <p className="text-md font-bold px-3 text-center">
                                  {project.progress}%
                                </p>
                              </div>
                              <div>
                                <h1 className="text-md text-[#CCCCCC] px-3">
                                  Status
                                </h1>
                                <p className="text-md font-bold px-3 text-center">
                                  {project.status}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>{" "}
                      </div>
                    )}

                    {/* {editingProject && editingProject._id === project._id && (
                      <EditProjectForm
                        project={editingProject}
                        onDone={() => handleEdit(project)}
                      />
                    )} */}

                    {!showChat && (
                      <div className="flex justify-end mt-3">
                        <button
                          className="px-1 xs:py-1 xs:px-2 rounded-md flex items-center button-animation-reverse gap-1 xs:gap-2"
                          onClick={() => {
                            if (chatId === project._id && showChat) {
                              setShowChat(false);
                            } else {
                              setChatId(project._id);
                              setShowChat(true);
                            }
                          }}
                        >
                          Chat
                          <RiChat1Line className="xs:w-7 xs:h-7 w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {showChat && (
                      <div className="bg-[#0d0d0d] bg-opacity-40 p-5 rounded-t-md">
                        <button
                          className="px-1 xs:py-1 xs:px-2 rounded-md items-center button-animation-reverse gap-1 xs:gap-2"
                          onClick={() => {
                            if (chatId === project._id && showChat) {
                              setShowChat(false);
                            } else {
                              setChatId(project._id);
                              setShowChat(true);
                            }
                          }}
                        >
                          <IoMdArrowRoundBack className="w-5 h-5" />
                          Close
                        </button>
                      </div>
                    )}
                    {showChat && chatId === project._id && (
                      <AdminChat chatId={chatId} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="flex flex-col mr-3">
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
          <div
            style={{ maxHeight: "calc(100vh - 230px)" }}
            className="overflow-y-auto"
          >
            {filteredCompletedProjects.map((project) => (
              // Map each project to a component that displays the project info
              <div
                key={project._id}
                className="text-white glassmorphism-projects rounded-md p-5 mb-3 mr-3 md:px-7"
              >
                <div className="hidden md:flex items-center justify-between">
                  <h2 className="text-[18px] xs:text-[20px]">
                    {project.projectName}
                  </h2>
                  <div className="flex flex-col items-center opacity-50">
                    <span>{project.userName}</span>
                    <span className="text-xs">{project.email}</span>
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
                <div className="md:hidden flex flex-col gap-2 items-center">
                  <h2 className="text-[18px] xs:text-[20px] text-center">
                    {project.projectName}
                  </h2>
                  <div className="opacity-50 flex flex-col items-center">
                    <span>{project.userName}</span>
                    <span className="text-xs">{project.email}</span>
                  </div>
                  {expandedProject === project._id ? (
                    <span
                      onClick={() => handleExpand(project)}
                      className="flex items-center bg-orange-600 rounded-md px-2 py-1"
                    >
                      Close
                      <MdKeyboardArrowRight className="h-6 w-6" />
                    </span>
                  ) : (
                    <span
                      onClick={() => handleExpand(project)}
                      className="flex items-center bg-orange-600 rounded-md px-2 py-1"
                    >
                      Expand
                      <MdKeyboardArrowDown className="h-6 w-6" />
                    </span>
                  )}
                </div>
                {expandedProject === project._id && (
                  <div>
                    <div className="border-[1px] rounded-full opacity-20 my-5" />
                    <div className="hidden xs:flex xs:flex-col xs:gap-5">
                      <div className="bg-black rounded-md p-5 bg-opacity-40">
                        <div className="flex items-start justify-between">
                          <h2 className="text-[18px] font-semibold text-[#dddddd]">
                            Project Details:
                          </h2>
                          <span
                            onClick={() => handleEdit(project)}
                            className="flex items-center gap-2 text-[16px] rounded-md px-2 py-1 button-animation-reverse cursor-pointer"
                          >
                            Edit
                            <FiEdit2 />
                          </span>
                        </div>

                        <div className="flex gap-5 mt-4">
                          <div className="w-[50%] glassmorphism-projects pb-3 rounded-md overflow-hidden text-center justify-between gap-1">
                            <h1 className="bg-orange-600 text-[22px] underline">
                              Timeline
                            </h1>
                            <div className="grid sm:grid-cols-2 gap-y-5 mt-3">
                              <div>
                                <h1 className="text-md text-[#CCCCCC] px-3">
                                  Start-Date
                                </h1>
                                <p className="text-xl font-bold px-3 text-center">
                                  {project.startDate === null
                                    ? "TBD"
                                    : formatDate(project.startDate)}
                                </p>
                              </div>
                              <div>
                                <h1 className="text-md text-[#CCCCCC] px-3">
                                  Dead-Line
                                </h1>
                                <p className="text-xl font-bold px-3 text-center">
                                  {project.endDate === null
                                    ? "TBD"
                                    : formatDate(project.endDate)}
                                </p>
                              </div>
                              <div>
                                <h1 className="text-md text-[#CCCCCC] px-3">
                                  Total Time
                                </h1>
                                <p className="text-xl font-bold px-3 text-center">
                                  {project.endDate === project.startDate
                                    ? "1 day"
                                    : calculateTotalTime(
                                        project.startDate,
                                        project.endDate
                                      )}
                                </p>
                              </div>
                              <div>
                                <h1 className="text-md text-[#CCCCCC] px-3">
                                  Remaining Time
                                </h1>
                                <p className="text-xl font-bold px-3 text-center">
                                  {project.endDate === null
                                    ? "TBD"
                                    : calculateRemainingTime(
                                        project.startDate,
                                        project.endDate
                                      )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="w-[50%] glassmorphism-projects pb-3 rounded-md overflow-hidden text-center justify-between gap-1">
                            <h1 className="bg-orange-600 text-[22px] underline">
                              Summary
                            </h1>
                            <div className="grid sm:grid-cols-2 gap-y-5 mt-3">
                              <div>
                                <h1 className="text-md text-[#CCCCCC] px-3">
                                  Progress
                                </h1>
                                <p className="text-xl font-bold px-3 text-center">
                                  {project.progress}%
                                </p>
                              </div>
                              <div>
                                <h1 className="text-md text-[#CCCCCC] px-3">
                                  Status
                                </h1>
                                <p className="text-xl font-bold px-3 text-center">
                                  {project.status}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {editingProject && editingProject._id === project._id && (
                        <EditProjectForm
                          project={editingProject}
                          onDone={() => handleEdit(project)}
                        />
                      )}
                    </div>
                    <div className="xs:hidden bg-black rounded-md p-2 bg-opacity-40">
                      <div className="flex items-center justify-between">
                        <h2 className="text-[16px] text-[#dddddd]">Details:</h2>
                        <span
                          onClick={() => handleEdit(project)}
                          className="flex items-center gap-1 text-[16px] rounded-md px-1 button-animation-reverse cursor-pointer"
                        >
                          <FiEdit2 />
                        </span>
                      </div>
                      <div className="space-y-5 mt-4">
                        <div className="glassmorphism-projects pb-3 rounded-sm overflow-hidden text-center justify-between gap-1">
                          <h1 className="bg-orange-600 text-[22px] underline">
                            Timeline
                          </h1>
                          <div className="flex flex-col gap-3 mt-3">
                            <div>
                              <h1 className="text-md text-[#CCCCCC] px-3">
                                Start-Date
                              </h1>
                              <p className="text-md font-bold px-3 text-center">
                                {project.startDate === null
                                  ? "TBD"
                                  : formatDate(project.startDate)}
                              </p>
                            </div>
                            <div>
                              <h1 className="text-md text-[#CCCCCC] px-3">
                                Dead-Line
                              </h1>
                              <p className="text-md font-bold px-3 text-center">
                                {project.endDate === null
                                  ? "TBD"
                                  : formatDate(project.endDate)}
                              </p>
                            </div>
                            <div>
                              <h1 className="text-md text-[#CCCCCC] px-3">
                                Total Time
                              </h1>
                              <p className="text-md font-bold px-3 text-center">
                                {project.endDate === project.startDate
                                  ? "1 day"
                                  : calculateTotalTime(
                                      project.startDate,
                                      project.endDate
                                    )}
                              </p>
                            </div>
                            <div>
                              <h1 className="text-md text-[#CCCCCC] px-3">
                                Remaining Time
                              </h1>
                              <p className="text-md font-bold px-3 text-center">
                                {project.endDate === null
                                  ? "TBD"
                                  : calculateRemainingTime(
                                      project.startDate,
                                      project.endDate
                                    )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="glassmorphism-projects pb-3 rounded-sm overflow-hidden text-center justify-between gap-1">
                          <h1 className="bg-orange-600 text-[22px] underline">
                            Summary
                          </h1>
                          <div className="flex flex-col gap-3 mt-3">
                            <div>
                              <h1 className="text-md text-[#CCCCCC] px-3">
                                Progress
                              </h1>
                              <p className="text-md font-bold px-3 text-center">
                                {project.progress}%
                              </p>
                            </div>
                            <div>
                              <h1 className="text-md text-[#CCCCCC] px-3">
                                Status
                              </h1>
                              <p className="text-md font-bold px-3 text-center">
                                {project.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ProjectsPanel;
