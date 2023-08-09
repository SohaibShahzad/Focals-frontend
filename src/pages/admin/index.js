import styles from "../../styles";
import { useState } from "react";
import classes from "../../styles/contactSection.module.css";
import axios from "axios";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "next/router";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import HourglassFullRoundedIcon from "@mui/icons-material/HourglassFullRounded";
import { setCookie } from "nookies";

export default function AdminLogin() {
  const router = useRouter();
  const { setAuthenticated } = useAuth();

  const [username, setUsername] = useState("");
  const [passsword, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    message: "",
    icon: null,
    styling: "",
  });

  const resetForm = () => {
    setUsername("");
    setPassword("");
  };

  const handleLogin = async (e, setAuthenticated) => {
    e.preventDefault();
    if (!username || !passsword) {
      setErrorMessage({
        message: "Please fill all the fields",
        icon: <ErrorRoundedIcon />,
        styling: "bg-yellow-300 text-yellow-700",
      });
      setLoginError(true);
      return;
    }
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", passsword);

    setErrorMessage({
      message: "Authenticating...",
      icon: <HourglassFullRoundedIcon />,
      styling: "bg-blue-300 text-blue-700",
    });
    setLoginError(true);

    if (selectedRole === "admin") {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admins/verifyAdmin`,
          formData
        );
        if (response.status === 200) {
          setCookie(null, "token", response.data.token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
          setAuthenticated(true);
          router.push("/admin/dashboard");
        } else {
          setErrorMessage({
            message: "Invalid Admin Credentials",
            icon: <CancelRoundedIcon />,
            styling: "bg-red-400 text-red-700",
          });
          setLoginError(true);
        }
        setLoginError(false);
      } catch (error) {
        setErrorMessage({
          message: "Invalid Admin Credentials",
          icon: <CancelRoundedIcon />,
          styling: "bg-red-400 text-red-700",
        });
        setLoginError(true);
      }
    } else {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}subAdmins/verifySubAdmin`,
          formData
        );
        if (response.status === 200) {
          setCookie(null, "token", response.data.token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
          setAuthenticated(true);
          router.push("/subadmin/dashboard");
        } else {
          setErrorMessage({
            message: "Invalid SubAdmin Credentials",
            icon: <CancelRoundedIcon />,
            styling: "bg-red-400 text-red-700",
          });
          setLoginError(true);
        }
        setLoginError(false);
      } catch (error) {
        console.log("here");
        setErrorMessage({
          message: "Invalid SubAdmin Credentials",
          icon: <CancelRoundedIcon />,
          styling: "bg-red-400 text-red-700",
        });
        setLoginError(true);
      }
    }
  };

  return (
    <div className="relative font-poppins">
      <div className="gradient-03" />
      <div className="gradient-02" />
      <div
        className={`${styles.paddings} text-white font-poppins z-30 relative`}
      >
        <div className="">
          <div className="text-center py-10 xs:mx-10 md:mx-0 lg:mx-20">
            <div className="pb-8">
              <div
                className={`lg:text-[45px] md:text-[35px] text-[40px] font-bold font-tungsten`}
              >
                "Greetings Admin!"
              </div>
              <p className={``}>Please Enter Your Credentials</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4 items-center">
                <input
                  type="username"
                  name="username"
                  value={username}
                  onChange={(e) => {
                    setLoginError(false);
                    setUsername(e.target.value);
                  }}
                  autoComplete="off"
                  placeholder="Enter Username"
                  className={`${classes.formInputs}`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={passsword}
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
                </div>
                <div className="flex flex-row gap-3 justify-between">
                  <div className="flex gap-1 items-center">
                    <input
                      type="radio"
                      id="adminRole"
                      name="role"
                      value="admin"
                      checked={selectedRole === "admin"}
                      onChange={() => setSelectedRole("admin")}
                      className="cursor-pointer rounded-md h-4 w-4"
                    />
                    <label
                      htmlFor="adminRole"
                      className="text-xs select-none cursor-pointer"
                    >
                      Admin
                    </label>
                  </div>
                  <div className="flex gap-1 items-center">
                    <input
                      type="radio"
                      id="subadminRole"
                      name="role"
                      value="subadmin"
                      checked={selectedRole === "subadmin"}
                      onChange={() => setSelectedRole("subadmin")}
                      className="cursor-pointer rounded-md h-4 w-4"
                    />
                    <label
                      htmlFor="subadminRole"
                      className="text-xs select-none cursor-pointer"
                    >
                      Sub-Admin
                    </label>
                  </div>
                </div>

                <button
                  className="bg-orange-700 py-[8px] px-[24px] rounded-md mt-4 hover:bg-orange-900 hover:font-bold"
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
          </div>
        </div>
      </div>
    </div>
  );
}
