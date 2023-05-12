import { TypingText, TitleText } from "../components/customText";
import { staggerContainer } from "../helper/motion";
import { motion } from "framer-motion";
import styles from "../styles";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "../components/button";

const ServicesSection = () => {
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}services/getAllServices`
      );
      setServicesData(res.data);
    }
    fetchData();
  }, []);

  return (
    <section className={`${styles.paddings} relative z-30`} id="blogs">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto`}
      >
        <div
          className={` flex-col flex md:gap-28 lg:gap-48 font-tungsten md:flex-row items-center`}
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
        <div className="items-center flex flex-col z-40">
          <div className={`${styles.yPaddings} text-white`}>
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8  ">
              {servicesData.map((service) => (
                <div
                  key={service._id}
                  className="p-5 glassmorphism rounded-md flex gap-5 flex-col justify-between h-full"
                >
                  <div className="">
                    <div className="flex justify-center my-3">
                      <img
                        src={service.thumbnail}
                        alt={service.title}
                        className="w-[auto] h-[75px]"
                      />
                    </div>
                    <h3 className="text-center font-bold text-[24px] border-b-2 border-gray-600 pb-1 ">
                      {service.title}
                    </h3>

                    <p
                      className="pt-2 px-2 md:pt-1 text-[18px] pb-2 text-center flex justify-center"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                  </div>

                  <Link
                    href={`/services/${service._id}`}
                    className="text-center bg-orange-900 font-bold rounded-md py-2 z-40 md:px-5"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
