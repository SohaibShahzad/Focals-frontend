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
        "https://enigmatic-badlands-35417.herokuapp.com/services/getAllServices"
      );
      setServicesData(res.data);
    }
    fetchData();
  }, []);

  return (
    <section className={`${styles.paddings}`} id="blogs">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
      >
        <TypingText title="| Services" textStyles="text-center" />
        <TitleText
          title={<>Our Expertise, Your Success</>}
          textStyles="text-center pb-[50px]"
        />
        <div className="text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 m-4 ">
            {servicesData.map((service) => (
              <div
                key={service._id}
                className="p-5 glassmorphism rounded-xl mb-5 flex gap-5 flex-col justify-between h-full"
              >
                <div className="">
                  <h3 className="text-center font-bold text-[24px] border-b-2 border-gray-600 pb-1 ">
                    {service.title}
                  </h3>

                  <p className="pt-2 md:pt-1 text-[18px] pb-2">
                    {service.description}
                  </p>
                </div>

                <Link
                  href={`/webApp/services/${service._id}`}
                  className="text-center bg-orange-900 font-bold rounded-md py-2 md:px-5"
                >
                  Details
                </Link>
              </div>
            ))}
          </div>

        </div>
          <Button
            title="Explore Further >"
            styling="bg-[#621000] mt-[50px] hover:bg-orange-800 hover:drop-shadow-[0_5px_5px_rgba(255,167,49,0.25)] text-white hover:font-bold"
            link="/webApp/services"
          />
      </motion.div>
    </section>
  );
};

export default ServicesSection;
