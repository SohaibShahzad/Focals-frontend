import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import styles from "../../styles";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

export default function ServicesPage({ services }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterToggle, setFilterToggle] = useState(false);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const categories = [
      "All",
      ...new Set(services.map((service) => service.category)),
    ];
    setUniqueCategories(categories);
  }, [services]);

  const handleTabChange = (index) => {
    setActiveTab(index);
    setSelectedCategory(uniqueCategories[index]);
  };

  const displayedServices = services
    .filter((service) =>
      !selectedCategory || selectedCategory === "All"
        ? true
        : service.category === selectedCategory
    )
    .filter((service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div
      className={`${styles.innerWidth} ${styles.xPaddings} mx-auto text-white font-poppins`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] sm:text-[34px] md:text-[50px] font-extrabold light-text ">
          Our Services
        </h1>
        <div
          className="object-contain cursor-pointer"
          onClick={() => setFilterToggle((prev) => !prev)}
        >
          <FiSearch style={{ color: "white", fontSize: "2rem" }} />
        </div>
      </div>
      <div className="mb-[20px] h-[2px]  bg-white opacity-20" />

      {filterToggle && (
        <div className="flex flex-row gap-9 flex-wrap md:flex-nowrap justify-end">
          <div className="flex flex-col mb-5">
            <label htmlFor="title-filter" className="light-text text-right">
              Search by Name:
            </label>
            <input
              placeholder="Enter Name"
              type="text"
              className="bg-[#333333] p-2 border-2 w-[250px] rounded-md border-orange-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      <Tabs selectedIndex={activeTab} onSelect={handleTabChange}>
        <TabList className="flex flex-row justify-center gap-5 mt-10 cursor-pointer">
          {uniqueCategories.map((category, index) => (
            <Tab
              key={index}
              selectedClassName="bg-orange-700 font-bold"
              className="border-2 rounded-md p-2 text-white mb-10"
            >
              {category}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {displayedServices.map((service) => (
          <Link href={`/services/${service._id}`} key={service._id}>
            <div className="p-4 glassmorphism-projects hover:bg-orange-800  rounded-xl justify-between h-full overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="flex flex-col justify-center items-center ">
                <div className="flex justify-center my-3 ">
                  <img
                    src={service.thumbnail}
                    alt={service.title}
                    className="w-[auto] h-[75px] transform transition-all duration-300 hover:scale-110"
                  />
                </div>
                <h3 className="text-center font-bold text-[24px] border-b-2 border-gray-600 pb-1 ">
                  {service.title}
                </h3>
                <p
                  className="mt-2 items-center text-center md:pt-1 text-[18px]"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}services/getAllServices`
  );
  const services = res.data;
  return {
    props: {
      services,
    },
  };
}
