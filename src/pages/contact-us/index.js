import axios from "axios";
import { useState } from "react";
import styles from "../../styles";

import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const inputStyle =
    "border-[3px] border-[#5f2300] rounded-md p-2 z-10 bg-transparent focus:outline-none focus:border-[#ff7e34]";

  const validateEmail = (email) => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);

    // Validate Fields
    let error = false;

    if (!name) {
      setNameError("Please enter your name");
      error = true;
    } else {
      setNameError("");
    }

    if (!email) {
      setEmailError("Please enter your email");
      error = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      error = true;
    } else {
      setEmailError("");
    }

    if (!message) {
      setMessageError("Please enter your message");
      error = true;
    } else {
      setMessageError("");
    }

    if (error) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}contact/sendEmail`,
        formData
      );
      setSuccessMessage("Message sent successfully!! We will contact you soon");
      setErrorMessage("");
      resetForm();
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Something went wrong. Please try again later");
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    setNameError("");
    setEmailError("");
    setMessageError("");
  };

  return (
    <div
      className={`${styles.innerWidth} ${styles.xPaddings} mx-auto text-white font-poppins relative pt-10 xl:h-screen xl:flex xl:flex-col xl:justify-center `}
    >
      <div className="gradient-03" />
      <div className="gradient-02" />
      <h1 className="text-[40px] text-center font-bold">Tell Us Your Idea</h1>
      <p className="text-center">Describe your need and we will contact you</p>
      <div>
        <form className="my-10 md:mx-24 lg:mx-48">
          <div className="flex flex-col gap-5">
            <div className="md:flex md:flex-row gap-5">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setNameError("");
                    setName(e.target.value);
                  }}
                  className={inputStyle}
                  autoComplete="off"
                  placeholder="Enter your name"
                />
                <div className="flex mb-2 z-30">
                  {nameError && (
                    <div className="text-white px-4 py-2 rounded-md bg-red-700">
                      <ErrorRoundedIcon /> {nameError}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full md:w-1/2 gap-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmailError("");
                    setEmail(e.target.value);
                  }}
                  className={inputStyle}
                  autoComplete="off"
                  placeholder="Enter your email"
                />
                <div className="flex z-30 mb-2">
                  {emailError && (
                    <div className="text-white px-4 py-2 rounded-md bg-red-700">
                      <ErrorRoundedIcon /> {emailError}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="message">Tell us Your Requirements</label>
              <textarea
                type="message"
                id="message"
                height="300px"
                value={message}
                onChange={(e) => {
                  setMessageError("");
                  setMessage(e.target.value);
                }}
                placeholder="Enter the Requirements"
                autoComplete="off"
                className={`${inputStyle} h-[200px]`}
              />
              <div className="flex mb-2 z-30">
                {messageError && (
                  <div className="text-white px-4 py-2 rounded-md bg-red-700">
                    <ErrorRoundedIcon /> {messageError}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-7 mt-7 sm:flex-row sm:justify-between sm:mt-10 sm:items-center">
            <button
              className="px-8 py-3 bg-orange-800 font-bold rounded-md z-10"
              onClick={handleSubmit}
            >
              Submit
            </button>

            {successMessage && (
              <p className="text-white px-4 py-2 rounded-md bg-green-700 z-30">
                <CheckCircleRoundedIcon /> {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="text-white px-4 py-2 rounded-md bg-red-700 z-30">
                <ErrorRoundedIcon /> {errorMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
