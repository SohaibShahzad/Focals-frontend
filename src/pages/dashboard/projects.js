import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import ProgressBar from "../../components/progressBar";

const jwt_decode = jwt.decode;

export default function UserProjects({ userProjects }) {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedProject, setExpandedProject] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleExpand = (project) => {
    if (expandedProject === project._id) {
      setExpandedProject(null);
      // setExpanded(false);
    } else {
      setExpandedProject(project._id);
      // setExpanded(true);
    }
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
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
            <TabPanel
              style={{ maxHeight: "calc(100vh - 200px)", height: 500 }}
              className="h-auto overflow-auto"
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
                        {project.startDate === null ? "TBD" : project.startDate}
                        - {project.endDate === null ? "TBD" : project.endDate}
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
                        <div className="flex justify-center gap-3 md:gap-20">
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
                  <div className="" />
                </div>
              ))}
            </TabPanel>
            <TabPanel>
              <div>{userProjects.user}</div>
            </TabPanel>
          </Tabs>
        </div>
      ) : (
        <div>No Projects Yet</div>
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
  console.log(userProjects);

  return {
    props: {
      userProjects,
    },
  };
}
