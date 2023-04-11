import axios from "axios";
import { useState } from "react";
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetForm();
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
        "https://enigmatic-badlands-35417.herokuapp.com/contact/sendEmail",
        formData
      );
      setSuccessMessage("Message sent successfully!! We will contact you soon");
      setErrorMessage("");
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
    <div className="text-white m-10">
      <h1 className="text-[40px] font-bold">Tell Us Your Idea</h1>
      <p>Describe your need and we will contact you</p>
      <div>
        <form className="m-1 mt-10 md:mx-[6em] lg:mx-[10em] lg:my-[5em]">
          <div className="flex flex-col gap-5">
            <div className="md:flex md:flex-row gap-5">
              <div className="flex flex-col w-full md:w-1/2 gap-2">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-gray-500 rounded-md p-2 mb-5 text-black"
                  placeholder="Enter your name"
                />
              </div>
              <div className="flex flex-col w-full md:w-1/2 gap-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-gray-500 rounded-md p-2 mb-5 text-black"
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
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter the Requirements"
                className="border-2 border-gray-500 rounded-md p-2 text-black"
              />
            </div>
          </div>
          <div className="flex flex-col gap-7 mt-7 sm:flex-row sm:justify-between sm:mt-10 sm:items-center">
            <button
              className="px-8 py-3 bg-orange-800 font-bold rounded-md"
              onClick={handleSubmit}
            >
              Submit
            </button>

              {successMessage && (
                <p className="text-white px-4 py-2 rounded-md bg-green-700"><CheckCircleRoundedIcon/> {successMessage}</p>
              )}
              {errorMessage && (
                <p className="text-white px-4 py-2 rounded-md bg-red-700"><ErrorRoundedIcon/> {errorMessage}</p>
              )}
 
          </div>
        </form>
      </div>
    </div>
  );
}
