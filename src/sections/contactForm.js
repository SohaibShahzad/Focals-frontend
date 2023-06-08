import { TypingText, TitleText } from "../components/customText";
import { staggerContainer } from "../helper/motion";
import { motion } from "framer-motion";
import styles from "../styles";
import classes from "../styles/contactSection.module.css";
import { useState } from "react";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import axios from "axios";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
  };

  const handleInputFocus = () => {
    setErrorMessage("");
    setSuccessMessage("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);

    if (!name || !email || !message) {
      setErrorMessage("Please fill all the fields");
      setSuccessMessage("");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}contact/sendEmail`,
        formData
      );
      setSuccessMessage("Sent successfully!!");
      resetForm();
      setErrorMessage("");
      console.log(res);
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Something went wrong");
      console.log(error);
    }
  };

  return (
    <section className={`${styles.paddings} relative z-30`} id="contactForm">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
      >
        <div
          className={` flex-col flex md:gap-28 lg:hap-48 font-tungsten md:flex-row items-center`}
        >
          <div className={`${styles.flexStart}`}>
            <TypingText title="Contact Us" />
          </div>
          <div className={`text-center md:text-left`}>
            <TitleText
              title={
                <>
                  You are just one step away from excellence that You always
                  need let’s have a few words, Tell about your brand and what
                  want to achieve.
                </>
              }
            />
          </div>
        </div>
        <div>
          <form>
            <div className={`${styles.yPaddings} flex flex-col gap-5`}>
              <input
                placeholder="Name"
                type="text"
                value={name}
                className={`${classes.formInputs} sm:w-[30rem]`}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMessage("");
                }}
                onFocus={handleInputFocus}
                />
              <input
                placeholder="Email"
                type="email"
                value={email}
                className={`${classes.formInputs} sm:w-[30rem]`}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage("");
                }}
                onFocus={handleInputFocus}
                />
              <textarea
                placeholder="Write message here..."
                type="text"
                value={message}
                className={`${classes.formInputs} h-[10rem] sm:w-[30rem]`}
                onChange={(e) => {
                    setMessage(e.target.value);
                    setErrorMessage("");
                }}
                onFocus={handleInputFocus}
              />
            </div>
            <div className="flex flex-col gap-7 mt-7 sm:flex-row justify-center sm:mt-10 sm:items-center">
              <button
                onClick={handleSubmit}
                className={`bg-orange-700 hover:bg-orange-800 hover:drop-shadow-[0_5px_5px_rgba(255,167,49,0.25)] text-white rounded-md py-[10px] px-[24px] z-[100] hover:font-bold font-poppins`}
              >
                Send Message
              </button>
              {successMessage && (
                <p className="text-white px-4 py-2 rounded-md bg-green-700 font-poppins">
                  <CheckCircleRoundedIcon /> {successMessage}
                </p>
              )}
              {errorMessage && (
                <p className="text-white px-4 py-2 rounded-md bg-red-700 font-poppins">
                  <ErrorRoundedIcon /> {errorMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
