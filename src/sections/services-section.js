import { TypingText, TitleText } from "../components/customText";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { staggerContainer } from "../helper/motion";
import { motion } from "framer-motion";
import styles from "../styles";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const ServicesSection = () => {
  const [servicesData, setServicesData] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}services/getServicesWithThumbs`
      );
      const serviceData = res.data;
      setServicesData(serviceData);
      setUniqueCategories(
        [
          "All",
          ...new Set(serviceData.map((service) => service.category)),
        ].sort()
      );
    }
    fetchData();
  }, []);

  const handleTabChange = (index) => {
    setActiveTab(index);
    if (uniqueCategories[index] === "All") {
      setSelectedCategory(null); // Setting it to null to show all services
    } else {
      setSelectedCategory(uniqueCategories[index]);
    }
  };

  useEffect(() => {
    if (selectedCategory === null) {
      setServicesToDisplay(servicesData);
    } else {
      const filteredServices = servicesData.filter(
        (service) => service.category === selectedCategory
      );
      setServicesToDisplay(filteredServices);
    }
  }, [selectedCategory, servicesData]);

  const [servicesToDisplay, setServicesToDisplay] = useState(servicesData);

  return (
    <section className={`${styles.paddings} relative z-30`} id="blogs">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto font-poppins`}
      >
        <div
          className={`flex-col flex md:gap-28 lg:gap-48 font-tungsten md:flex-row items-center`}
        >
          <div className={`${styles.flexStart}`}>
            <TypingText title="Services" />
          </div>
          <div className={`text-center md:text-left`}>
            <TitleText
              title={
                <>
                  We specialize in crafting visually stunning videos that
                  captivate audiences and elevate brands. Let us help you tell
                  your story like never before.
                </>
              }
            />
          </div>
        </div>
        <Tabs selectedIndex={activeTab} onSelect={handleTabChange}>
          <TabList className="flex flex-row justify-center gap-5 mt-10 cursor-pointer">
            {uniqueCategories.map((category, index) => (
              <Tab
                key={index}
                selectedClassName="bg-orange-700 font-bold"
                className="border-2 rounded-md p-2 text-white"
              >
                {category}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <div className="items-center flex flex-col z-40">
          <div className={`${styles.yPaddings} text-white`}>
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesToDisplay.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service._id}`}
                  className="p-4 glassmorphism-projects hover:bg-orange-800  rounded-xl justify-between h-full overflow-hidden transform transition-all duration-300 hover:scale-105"
                >
                  <div>
                    <div className="flex justify-center my-3">
                      <img
                        src={service.thumbnail}
                        alt={service.title}
                        loading="lazy"
                        className="w-[auto] h-[75px] transform transition-all duration-300 hover:scale-110"
                      />
                    </div>
                    <h3 className="text-center font-bold text-[24px] border-b-2 border-gray-600 pb-1 ">
                      {service.title}
                    </h3>
                    <div className="flex flex-col justify-around items-center">
                      <p
                        className="pt-2 px-2 md:pt-1 text-[18px] pb-2 text-center"
                        dangerouslySetInnerHTML={{
                          __html: service.description,
                        }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
