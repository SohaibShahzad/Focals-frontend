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
  const inputStyle =
    "border-[3px] border-[#5f2300] rounded-md p-2 mb-5 z-10 bg-transparent focus:outline-none focus:border-[#ff7e34]";

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
      setSuccessMessage("Message sent successfully!! We will contact you soon");
      setErrorMessage("");
      resetForm();
      console.log(res);
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Something went wrong. Please try again later");
      console.log(error);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="text-white m-10 font-poppins relative">
      <div className="gradient-03" />
      <div className="gradient-02" />
      <h1 className="text-[40px] text-center font-bold">Tell Us Your Idea</h1>
      <p className="text-center">Describe your need and we will contact you</p>
      <div>
        <form className="m-1 mt-10 md:mx-[6em] lg:mx-[10em] lg:my-[3em] xl:mx-[30em]">
          <div className="flex flex-col gap-5">
            <div className="md:flex md:flex-row gap-5">
              <div className="flex flex-col w-full md:w-1/2 gap-2">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setSuccessMessage("");
                    setErrorMessage("");
                    setName(e.target.value);
                  }}
                  className={inputStyle}
                  autoComplete="off"
                  placeholder="Enter your name"
                />
              </div>
              <div className="flex flex-col w-full md:w-1/2 gap-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setSuccessMessage("");
                    setErrorMessage("");
                    setEmail(e.target.value);
                  }}
                  className={inputStyle}
                  autoComplete="off"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="message">Tell us Your Requirements</label>
              <textarea
                type="message"
                id="message"
                value={message}
                onChange={(e) => {
                  setSuccessMessage("");
                  setErrorMessage("");
                  setMessage(e.target.value);
                }}
                placeholder="Enter the Requirements"
                autoComplete="off"
                className={inputStyle}
              />
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
              <p className="text-white px-4 py-2 rounded-md bg-green-700">
                <CheckCircleRoundedIcon /> {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="text-white px-4 py-2 rounded-md bg-red-700">
                <ErrorRoundedIcon /> {errorMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
