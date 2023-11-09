import styles from "../../styles";
import { useEffect, useState } from "react";
import classes from "../../styles/contactSection.module.css";
import axios from "axios";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "next/router";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import HourglassFullRoundedIcon from "@mui/icons-material/HourglassFullRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { setCookie, parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
import { signIn, useSession } from "next-auth/react";

const jwt_decode = jwt.decode;

export default function LoginRegister() {
  const router = useRouter();
  const obj = JSON.parse(router.query.prop);
  const { authenticated, setAuthenticated } = useAuth();
  const {  data, status,session  } = useSession();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signup, setSignup] = useState(obj.signup || false);
  const [login, setLogin] = useState(obj.signin && true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpVerify, setOtpVerify] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    message: "",
    icon: null,
    styling: "",
  });

  const resetForm = () => {
    setFname("");
    setLname("");
    setUsername("");
    setPassword("");
  };

  const signInGoogle = async (e) => {
    const response = await signIn("google");

  };

  useEffect(() => {
    console.log(status,'status')
    if (status === 'authenticated') {
      const userData = {
        username: data.token.email,
      };
      auth();
     
    async function auth(){
      if(userData)
      {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}users/saveGoogleUser`,
          userData
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
          setAuthenticated(true);
          router.push("/");
        }
  
      }
        
      }
      
     
      // console.log(data.token.token.token.tooken)
      // console.log(data.token.token.token.authUser)
     
    }
    // if (session) {
    //   setAuthenticated(true);
    //   // router.push("/");
    // }
  }, [data]);


  // const handleOTPinput = (e, index) => {
  //   const { value, nativeEvent } = e;
  
  //   // Update OTP when typing
  //   if (nativeEvent.inputType !== "deleteContentBackward") {
  //     setOtp((prev) => {
  //       const newOtp = [...prev];
  //       newOtp[index] = value;
  //       return newOtp;
  //     });
  
  //     // Move focus forward
  //     if (value && e.target.nextSibling) {
  //       e.target.nextSibling.focus();
  //     }
  //   } else {
  //     // Handle backspace
  //     setOtp((prev) => {
  //       const newOtp = [...prev];
  //       newOtp[index] = ''; // Clear current field
  
  //       // If not the first field, clear previous field and move focus back
  //       if (index > 0) {
  //         newOtp[index - 1] = '';
  //         setTimeout(() => e.target.previousSibling.focus(), 0);
  //       }
  
  //       return newOtp;
  //     });
  //   }
  // };
  

  const handleOTPinput = (e, index) => {
    const value = e.target.value;

    // Update the OTP state
    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });

    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }

    // If input is not empty and the next input field exists, move focus to the next input field
    if (
      e.target.nextSibling &&
      value &&
      typeof e.target.nextSibling.focus === "function"
    ) {
      e.target.nextSibling.focus();
    }

    // If input is empty and the backspace key is pressed, move focus to the previous input field
    if (
      e.nativeEvent.inputType === "deleteContentBackward" &&
      e.target.previousSibling &&
      typeof e.target.previousSibling.focus === "function"
    ) {
      e.target.previousSibling.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasteData.length === 6) {
      setOtp(pasteData);
    }
  };

  const clearOTP = () => {
    setOtp(Array(6).fill(''));
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailPattern.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fname || !lname || !username || !password) {
      setErrorMessage({
        message: "Please fill all the fields",
        icon: <ErrorRoundedIcon />,
        styling: "bg-yellow-300 text-yellow-700",
      });
      setLoginError(true);
      return;
    }

    if (!isEmailValid(username)) {
      setErrorMessage({
        message: "Please enter a valid email",
        icon: <CancelRoundedIcon />,
        styling: "bg-red-400 text-red-700",
      });
      setLoginError(true);
      return;
    }

    if (password.length < 6) {
      setErrorMessage({
        message: "Password should be atleast 6 characters long",
        icon: <CancelRoundedIcon />,
        styling: "bg-red-400 text-red-700",
      });
      setLoginError(true);
      return;
    }

    const formData = new FormData();
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("username", username);
    formData.append("password", password);

    setErrorMessage({
      message: "Requesting...",
      icon: <HourglassFullRoundedIcon />,
      styling: "bg-blue-300 text-blue-700",
    });
    setLoginError(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}users/otpEmail`,
        formData
      );
      setErrorMessage({
        message: "OTP Sent Successfully",
        icon: <CheckCircleRoundedIcon />,
        styling: "bg-green-300 text-green-700",
      });
      setLoginError(true);
      setSignup(false);
      setOtpVerify(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Specific message for email already in use
        resetForm();
        setSignup((prev) => !prev);
        setLogin((prev) => !prev);
        setForgotPassword(false);
        setErrorMessage({
          message: error.response.data.message,
          icon: <CancelRoundedIcon />,
          styling: "bg-orange-400 text-orange-700",
        });
      } else {
        // Generic error message for other types of errors
        setErrorMessage({
          message: "Error in sending OTP",
          icon: <CancelRoundedIcon />,
          styling: "bg-red-400 text-red-700",
        });
      }
      setLoginError(true);
    }
  };

  const handleOTPverification = async (e) => {
    e.preventDefault();
    const userOTP = otp.join("");
    if (userOTP.length !== 6) {
      setErrorMessage({
        message: "Please enter complete code",
        icon: <CancelRoundedIcon />,
        styling: "bg-red-400 text-red-700",
      });
      setLoginError(true);
      return;
    }

    const formData = new FormData();

    if (resetPassword) {
      formData.append("username", username);
      formData.append("otp", userOTP);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}users/verifyOTPforReset`,
          formData
        );
        if (response.status === 200) {
          setErrorMessage({
            message: "OTP Verified Successfully",
            icon: <CheckCircleRoundedIcon />,
            styling: "bg-green-300 text-green-700",
          });
          setLoginError(true);
          setOtpVerify(false);
          console.log("OTP verified successfully");
        }
      } catch (error) {
        console.log(error);
        setErrorMessage({
          message: "Error in OTP Verification",
          icon: <CancelRoundedIcon />,
          styling: "bg-red-400 text-red-700",
        });
        setLoginError(true);
        console.log("OTP verification failed");
      }
    } else {
      formData.append("username", username);
      formData.append("otp", userOTP);
      formData.append("password", password);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}users/verifyOTPandRegister`,
          formData
        );
        if (response.status === 200) {
          setErrorMessage({
            message: "Registered Successfully",
            icon: <CheckCircleRoundedIcon />,
            styling: "bg-green-300 text-green-700",
          });
          setLoginError(true);
          setOtpVerify(false);
          setLogin(true);
          resetForm();
        }
      } catch (error) {
        console.log(error);
        setErrorMessage({
          message: "Error in registering",
          icon: <CancelRoundedIcon />,
          styling: "bg-red-400 text-red-700",
        });
        setLoginError(true);
      }
    }
  };

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    if (!username) {
      setErrorMessage({
        message: "Please enter your email",
        icon: <ErrorRoundedIcon />,
        styling: "bg-yellow-300 text-yellow-700",
      });
      setLoginError(true);
      return;
    }
    if (!isEmailValid(username)) {
      setErrorMessage({
        message: "Please enter a valid email",
        icon: <CancelRoundedIcon />,
        styling: "bg-red-400 text-red-700",
      });
      setLoginError(true);
      return;
    }
    const formData = new FormData();
    formData.append("username", username);

    setErrorMessage({
      message: "Verifying Email and Sending OTP...",
      icon: <HourglassFullRoundedIcon />,
      styling: "bg-blue-300 text-blue-700",
    });
    setLoginError(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}users/resetPasswordRequest`,
        formData
      );
      if (response.status === 200) {
        setErrorMessage({
          message: "OTP Sent Successfully",
          icon: <CheckCircleRoundedIcon />,
          styling: "bg-green-300 text-green-700",
        });
        setLoginError(true);
        setResetPassword(true);
        setOtpVerify(true);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage({
        message: "Error in sending OTP",
        icon: <CancelRoundedIcon />,
        styling: "bg-red-400 text-red-700",
      });
      setLoginError(true);
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();

    if (!password) {
      setErrorMessage({
        message: "Please enter a password",
        icon: <ErrorRoundedIcon />,
        styling: "bg-yellow-300 text-yellow-700",
      });
      setLoginError(true);
      return;
    }

    if (password.length < 6) {
      setErrorMessage({
        message: "Password should be atleast 6 characters long",
        icon: <CancelRoundedIcon />,
        styling: "bg-red-400 text-red-700",
      });
      setLoginError(true);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    setErrorMessage({
      message: "Resetting Password...",
      icon: <HourglassFullRoundedIcon />,
      styling: "bg-blue-300 text-blue-700",
    });
    setLoginError(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}users/resetPassword`,
        formData
      );
      if (response.status === 200) {
        setErrorMessage({
          message: "Password Reset Successfully",
          icon: <CheckCircleRoundedIcon />,
          styling: "bg-green-300 text-green-700",
        });
        setLoginError(true);
        setResetPassword(false);
        setForgotPassword(false);
        setOtpVerify(false);
        setLogin(true);
        setSignup(false);
        resetForm();
      }
    } catch (error) {
      setErrorMessage({
        message: "Error in resetting password",
        icon: <CancelRoundedIcon />,
        styling: "bg-red-400 text-red-700",
      });
      setLoginError(true);
    }
  };

  const handleLogin = async (e, setAuthenticated) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage({
        message: "Please fill all the fields",
        icon: <ErrorRoundedIcon />,
        styling: "bg-yellow-300 text-yellow-700",
      });
      setLoginError(true);
      return;
    }
    if (!isEmailValid(username)) {
      setErrorMessage({
        message: "Please enter a valid email",
        icon: <CancelRoundedIcon />,
        styling: "bg-red-400 text-red-700",
      });
      setLoginError(true);
      return;
    }
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    setErrorMessage({
      message: "Authenticating...",
      icon: <HourglassFullRoundedIcon />,
      styling: "bg-blue-300 text-blue-700",
    });
    setLoginError(true);

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
        setAuthenticated(true);
        router.push("/");
      } else {
        setErrorMessage({
          message: "Invalid Credentials",
          icon: <CancelRoundedIcon />,
          styling: "bg-red-400 text-red-700",
        });
        setLoginError(true);
      }
      setLoginError(false);
    } catch (error) {
      setErrorMessage({
        message: "Invalid Credentials",
        icon: <CancelRoundedIcon />,
        styling: "bg-red-400 text-red-700",
      });
      setLoginError(true);
    }
  };

  return (
    <div className="relative font-poppins">
      <div className="gradient-03" />
      <div className="gradient-02" />
      <div
        className={`${styles.paddings} text-white font-poppins z-30 relative`}
      >
        <div className="grid grid-cols-1">
          <div className="text-center py-10 xs:mx-10 md:mx-0 lg:w-[400px] lg:mx-auto">
            <div className="pb-8">
              <div
                className={`lg:text-[45px] md:text-[35px] text-[40px] font-bold font-tungsten`}
              >
                {forgotPassword
                  ? "Verification for Password Reset"
                  : signup
                  ? "Greetings!"
                  : "Welcome Back!"}
              </div>
              <p className={``}>Please Enter Your Details Below</p>
            </div>
            {login && !forgotPassword && (
              <form
                onSubmit={(e) => {
                  handleLogin(e, setAuthenticated);
                }}
              >
                <div className="flex flex-col gap-4">
                  <input
                    type="username"
                    name="username"
                    value={username}
                    onChange={(e) => {
                      setLoginError(false);
                      setUsername(e.target.value);
                    }}
                    autoComplete="off"
                    placeholder="Enter Email"
                    className={`${classes.formInputs}`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setLoginError(false);
                      setPassword(e.target.value);
                    }}
                    placeholder="Enter Password"
                    className={`${classes.formInputs}`}
                  />
                  <div className="flex flex-row justify-between">
                    <div
                      className="items-center flex gap-1"
                      onClick={() => setShowPassword(!showPassword)}
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setLogin(false);
                        setSignup(true);
                        setOtpVerify(false);
                        resetForm();
                        setForgotPassword(true);
                        setResetPassword(false);
                        setLoginError(false);
                      }}
                      className="underline text-xs z-30"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <button
                    className="button-animation-reverse hover:scale-100 py-[8px] px-[24px] w-full rounded-md mt-4"
                    onClick={(e) => {
                      handleLogin(e, setAuthenticated);
                    }}
                  >
                    Login
                  </button>
                  {loginError && (
                    <div
                      className={`flex items-center gap-3 rounded-md px-[24px] py-[8px] justify-center text-[20px] font-bold ${errorMessage.styling}`}
                    >
                      {errorMessage.icon} {errorMessage.message}
                    </div>
                  )}
                </div>
              </form>
            )}
            {forgotPassword && !resetPassword && (
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex flex-col gap-2">
                    <label>Email</label>
                    <input
                      type="username"
                      name="username"
                      value={username}
                      onChange={(e) => {
                        setLoginError(false);
                        setUsername(e.target.value);
                      }}
                      autoComplete="off"
                      placeholder="Enter Email"
                      className={`${classes.formInputs}`}
                    />
                  </div>
                  <button
                    className="bg-orange-700 py-[8px] px-[24px] w-full rounded-md mt-4 hover:bg-orange-900 hover:font-bold"
                    onClick={handlePasswordResetRequest}
                  >
                    Send OTP
                  </button>
                  {loginError && (
                    <div
                      className={`flex items-center gap-3 rounded-md px-[24px] py-[8px] justify-center text-[20px] font-bold ${errorMessage.styling}`}
                    >
                      {errorMessage.icon} {errorMessage.message}
                    </div>
                  )}
                </div>
              </form>
            )}
            {resetPassword && !otpVerify && (
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex flex-col gap-1">
                    <label>Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setLoginError(false);
                        setPassword(e.target.value);
                      }}
                      placeholder="Enter Password"
                      className={`${classes.formInputs}`}
                    />
                  </div>
                  <div
                    className="items-center flex gap-1"
                    onClick={() => setShowPassword(!showPassword)}
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

                  <button
                    className="bg-orange-700 py-[8px] px-[24px] w-full rounded-md mt-4 hover:bg-orange-900 hover:font-bold"
                    onClick={handleNewPassword}
                  >
                    Reset Password
                  </button>
                  {loginError && (
                    <div
                      className={`flex items-center gap-3 rounded-md px-[24px] py-[8px] justify-center text-[20px] font-bold ${errorMessage.styling}`}
                    >
                      {errorMessage.icon} {errorMessage.message}
                    </div>
                  )}
                </div>
              </form>
            )}
            {signup && !forgotPassword && (
              <form>
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex flex-col gap-1">
                    <label>Name</label>
                    <input
                      type="name"
                      name="fname"
                      value={fname}
                      onChange={(e) => {
                        setLoginError(false);
                        setFname(e.target.value);
                      }}
                      autoComplete="off"
                      placeholder="Enter First Name"
                      className={`${classes.formInputs}`}
                    />
                    <input
                      type="name"
                      name="lname"
                      value={lname}
                      onChange={(e) => {
                        setLoginError(false);
                        setLname(e.target.value);
                      }}
                      autoComplete="off"
                      placeholder="Enter Last Name"
                      className={`${classes.formInputs}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Email</label>
                    <input
                      type="username"
                      name="username"
                      value={username}
                      onChange={(e) => {
                        setLoginError(false);
                        setUsername(e.target.value);
                      }}
                      autoComplete="off"
                      placeholder="Enter Email"
                      className={`${classes.formInputs}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setLoginError(false);
                        setPassword(e.target.value);
                      }}
                      placeholder="Enter Password"
                      className={`${classes.formInputs}`}
                    />
                  </div>
                  <div
                    className="items-center flex gap-1"
                    onClick={() => setShowPassword(!showPassword)}
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
                  <button
                    className="bg-orange-700 py-[8px] px-[24px] w-full rounded-md mt-4 hover:bg-orange-900 hover:font-bold"
                    onClick={handleRegister}
                  >
                    Register
                  </button>
                  {loginError && (
                    <div
                      className={`flex items-center gap-3 rounded-md px-[24px] py-[8px] justify-center text-[20px] font-bold ${errorMessage.styling}`}
                    >
                      {errorMessage.icon} {errorMessage.message}
                    </div>
                  )}
                </div>
              </form>
            )}
            {otpVerify && (
              <form>
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex flex-col gap-1">
                    <label>Please Enter the 6-Digit code</label>
                    <label className="text-sm text-gray-400">
                      6-digit code was sent to the your email
                    </label>
                    <div className="space-x-1">
                      {otp.map((value, index) => (
                        <input
                          type="tel"
                          key={index}
                          value={value}
                          maxLength="1"
                          className="w-9 h-9 lg:w-10 lg:h-10 bg-transparent text-center border-2 border-orange-600 rounded-md text-2xl font-bold"
                          onPaste={(e) => handlePaste(e, index)}
                          onChange={(e) => {
                            setLoginError(false);
                            handleOTPinput(e, index);
                          }}
                          autoComplete="off"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleOTPverification}
                    className="bg-orange-700 py-[8px] px-[24px] w-full rounded-md mt-4 hover:bg-orange-900 hover:font-bold"
                  >
                    Verify
                  </button>
                  {loginError && (
                    <div
                      className={`flex items-center gap-3 rounded-md px-[24px] py-[8px] justify-center text-[20px] font-bold ${errorMessage.styling}`}
                    >
                      {errorMessage.icon} {errorMessage.message}
                    </div>
                  )}
                </div>
              </form>
            )}
            {!otpVerify && (
              <>
                <div className="flex text-gray-400 flex-row font-bold py-5 justify-evenly items-center gap-5">
                  <hr className="w-full border-gray-500 border-t-2" /> OR{" "}
                  <hr className="w-full border-gray-500 border-t-2" />
                </div>
                <div className="space-y-4">
                  <button
                    onClick={(e) => signInGoogle(e)}
                    className="button-animation-reverse-red hover:scale-100 py-[8px] w-full rounded-md flex items-center justify-center gap-4"
                  >
                    <img src="/gmailLogin.png" className="h-5 w-6" />
                    Continue with Google
                  </button>
                </div>
                <div className="mt-5">
                  <span className="text-gray-400">
                    {signup
                      ? "Already have an account?"
                      : "Don't have an account?"}
                  </span>{" "}
                  <button
                    className="underline"
                    onClick={() => {
                      setLoginError(false);
                      resetForm();
                      setSignup((prev) => !prev);
                      setLogin((prev) => !prev);
                      setForgotPassword(false);
                    }}
                  >
                    {signup ? "Sign in" : "Sign up"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  if (token) {
    try {
      const decoded = jwt_decode(token);
      if (decoded.type === "user") {
        return {
          redirect: {
            destination: "/dashboard",
            permanent: false,
          },
        };
      }
    } catch (error) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }
  return {
    props: {},
  };
}
