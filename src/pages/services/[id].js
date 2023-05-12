import axios from "axios";
import styles from "../../styles";
import Link from "next/link";
import { useState, useRef } from "react";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

export default function SingleService({ serviceData }) {
  const [activeTab, setActiveTab] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const openFullScreen = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };

  const handleTabChange = (index) => {
    console.log(index);
    setActiveTab(index);
  };

  const changeImageIndex = (newIndex) => {
    if (newIndex < 0) {
      newIndex = serviceData.images.length - 1;
    } else if (newIndex >= serviceData.images.length) {
      newIndex = 0;
    }
    setActiveImageIndex(newIndex);
  };

  return (
    <div className={`${styles.paddings} text-white relative z-[10]`}>
      <div className="gradient-02 z-[-1]" />

      <div className="md:text-[64px] text-[50px] font-extrabold ">
        {serviceData.title}
      </div>

      <div className="mb-[10px] h-[2px] bg-white opacity-20" />
      <p className="text-[15px] mb-[10px] md:text-[25px] md:font-normal py-5"  dangerouslySetInnerHTML={{ __html: serviceData.description }}/>

      {fullScreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center cursor-zoom-out"
          onClick={closeFullScreen}
        >
          <img
            src={fullScreenImage}
            alt="Fullscreen Image"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5 items-center">
        <div className="glassmorphism text-center lg:col-span-2 rounded-md">
          <div className="relative w-[100%] h-[400px] mx-auto overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              {serviceData.images.map(
                (imageUrl, index) =>
                  index === activeImageIndex && (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Image ${index}`}
                      onClick={() => openFullScreen(imageUrl)}
                      className="rounded-md w-full h-full object-contain cursor-zoom-in"
                    />
                  )
              )}
            </div>
            <button
              onClick={() => changeImageIndex(activeImageIndex - 1)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-600 p-2 font-bold text-white rounded-md"
            >
              &lt;
            </button>
            <button
              onClick={() => changeImageIndex(activeImageIndex + 1)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-orange-600 p-2 font-bold text-white rounded-md"
            >
              &gt;
            </button>
          </div>
        </div>
        <div>
          <Tabs index={activeTab} onSelect={handleTabChange}>
            <TabList className="flex gap-3 justify-center mb-3 cursor-pointer">
              {serviceData.packages.map((bundle) => (
                <Tab
                  key={bundle._id}
                  selectedClassName="bg-orange-700 font-bold"
                  className="border-2 rounded-md p-2"
                >
                  {bundle.name}
                </Tab>
              ))}
            </TabList>
            {serviceData.packages.map((bundle) => (
              <TabPanel key={bundle._id}>
                <div className="glassmorphism rounded-md p-5 mb-8 md:px-7 w-full">
                  <div className="flex justify-between pb-2 items-center">
                    <h2 className="text-center font-bold text-[16px]">
                      {bundle.name}
                    </h2>
                    <div className=" text-[20px] font-bold">
                      ${bundle.price}
                    </div>
                  </div>
                  <div className="mb-[10px] h-[2px] rounded-md bg-white opacity-50" />

                  <div className="pt-2 text-[16px]">{bundle.description}</div>
                  <div className="font-bold pt-2 text-gray-400">Features:</div>
                  <ul>
                    {bundle.features.map((feature) => (
                      <li key={feature} className="">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-orange-700 rounded-md py-1 mt-5 items-center text-center">
                    Continue <ArrowRightAltRoundedIcon />
                  </div>
                </div>
              </TabPanel>
            ))}
          </Tabs>
        </div>
      </div>
      <div className="flex justify-around mt-5">
        <Link href="/contact-us">
          <div className="cursor-pointer bg-orange-700 py-2 px-5 rounded-md font-bold">
            Let's Discuss
          </div>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}services/getServiceDataAndImages/${id}`
  );
  const serviceData = res.data;
  console.log(serviceData);
  return {
    props: {
      serviceData,
    },
  };
}
