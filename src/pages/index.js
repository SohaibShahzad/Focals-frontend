import Hero from "../sections/hero";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Explore from "../sections/explore";
import BlogSection from "../sections/blog-section";
import ServicesSection from "../sections/services-section";
import ContactSection from "../sections/contactForm";
import TestimonialSection from "../sections/testimonial-section";
import { setCookie, parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";

const jwt_decode = jwt.decode;

export default function WebApp() {
  const [popup, setPopup] = useState(false);
  const { authenticated, setAuthenticated } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const props = {
    signup: true,
    signin: false,
  };

  // useEffect(() => {
  //   const cookies = parseCookies();
  //   const token = cookies.token;
  //   if (!token) {
  //     setTimeout(() => setPopup(true), 5000);
  //   }
  // }, []);

  const validateEmail = (email) => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    // Validate Fields
    let error = false;

    if (!username) {
      setEmailError("Please enter email");
      error = true;
    } else if (!validateEmail(username)) {
      setEmailError("Invalid email");
      error = true;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Please enter password");
      error = true;
    } else {
      setPasswordError("");
    }

    if (error) {
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}users/verifyUser`,
        formData
      );

      if (response.status === 200) {
        setCookie(null, "token", response.data.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        setCookie(null, "user", JSON.stringify(response.data.user), {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        console.log(response.data.user);
        setPopup(false);
        setAuthenticated(true);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {popup && (
        <Dialog
          open={popup}
          onClose={() => setPopup(false)}
          className="navbar-sm-animation"
        >
          <div className="bg-[#222222] text-white font-poppins px-2 md:px-5 py-3 flex flex-col gap-4 px-4">
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-bold text-center">
                Welcome to Future Focals!
              </h1>
              <p className="text-md md:text-lg">Here Vision Meets Reality</p>
            </div>
            <form className="font-poppins px-1" onSubmit={handleLogin}>
              <div className="flex flex-col w-full">
                <label>Email</label>
                <input
                  type="email"
                  className="w-full bg-transparent border-[2px] border-orange-700 focus:border-orange-400 outline-none rounded-md px-4 py-2"
                  placeholder="Enter Email"
                  value={username}
                  onChange={(e) => {
                    setEmailError("");
                    setUsername(e.target.value);
                  }}
                />
                <div className="flex mb-2 z-30">
                  {emailError && <p className="text-red-500">{emailError}</p>}
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-transparent border-[2px] border-orange-700 focus:border-orange-400 outline-none rounded-md px-4 py-2"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => {
                    setPasswordError("");
                    setPassword(e.target.value);
                  }}
                />

                <div
                  className="items-center flex gap-1 justify-end mt-2"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <input
                    type="checkbox"
                    className="cursor-pointer rounded-md h-4 w-4"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  <label className="text-xs select-none cursor-pointer">
                    Show Password
                  </label>
                </div>
                <div className="flex mb-2 z-30">
                  {passwordError && (
                    <p className="text-red-500">{passwordError}</p>
                  )}
                </div>
              </div>
              <button
                className="bg-orange-700 button-animation-reverse hover:scale-100 py-1 rounded-md mt-3 w-full"
                onClick={handleLogin}
              >
                Login
              </button>
            </form>

            <div className="text-center">
              <p>Don't have an account?</p>
              <Link
                href={`/login?prop=${encodeURIComponent(
                  JSON.stringify(props)
                )}`}
                className="text-center text-orange-500 hover:text-orange-700"
              >
                Register
              </Link>
            </div>
            <DialogActions>
              <button
                className="button-animation-reverse-red hover:scale-100 px-4 rounded-md "
                onClick={() => setPopup(false)}
              >
                Do it later{" "}
              </button>
            </DialogActions>
          </div>
        </Dialog>
      )}
      <div className="relative">
        <div className="gradient-03 z-[0]" />
        <Hero />
        <div className="gradient-02 z-[0]" />
      </div>
      <div className="relative">
        <ServicesSection />
        <div className="gradient-02 z-[0]" />
        <Explore />
      </div>
      <div className="relative">
        <BlogSection />
        <div className="gradient-03 z-[0]" />
        <TestimonialSection />
      </div>
      <div>
        <ContactSection />
      </div>
    </>
  );
}
