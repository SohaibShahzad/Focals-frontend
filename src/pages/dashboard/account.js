import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";

const jwt_decode = jwt.decode;

export default function AccountSettings({ user }) {
  const [resetPassword, setResetPassword] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [prevPassword, setPrevPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetForm = () => {
    setPassword("");
    setPrevPassword("");
    // setErrorMessage("");
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (confirmPassword) {
      if (!prevPassword) {
        setErrorMessage("Empty!!");
        return;
      }
      if (prevPassword.length < 6) {
        setErrorMessage("Password must be at least 6 characters long");
        return;
      }
      setErrorMessage("");

      try {
        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("password", prevPassword);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}users/verifyUser`,
          formData
        );

        if (response.status === 200) {
          setErrorMessage("");
          setSuccessMessage(response.data.message);
          setConfirmPassword(false);
        } else {
          console.log(response.data);
        }
      } catch (err) {
        setErrorMessage(err.response.data.message);
      }
    } else {
      if (!password) {
        setErrorMessage("Empty!!");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long");
        return;
      }
      setErrorMessage("");
      try{
        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("password", password);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}users/resetPassword`,
          formData
        );

        if (response.status === 200) {
          setErrorMessage("");
          setSuccessMessage(response.data.message);
          setConfirmPassword(false);
        } else {
          console.log(response.data);
        }
      } catch (err) {
        setErrorMessage(err.response.data.message);
      }
    }
    resetForm();
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      <main className="text-center">
        <h1 className="text-3xl underline font-bold">Account Settings</h1>
      </main>
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-xl font-bold">Email:</h1>
            <input
              type="text"
              className={`border-2 border-gray-400 rounded-md px-2 py-2 ${
                user.username ? "text-gray-400" : ""
              }`}
              value={user.username}
              disabled
            />
          </div>
          {!resetPassword && (
            <div className="flex flex-col">
              <button
                onClick={() => {
                  setErrorMessage("");
                  setResetPassword(true);
                  setConfirmPassword(true);
                }}
                className="text-xl font-bold bg-orange-400 text-white px-7 py-2 rounded-md"
              >
                Change Password
              </button>
            </div>
          )}
        </div>
        {resetPassword && (
          <div className="bg-gray-100 p-4 mt-2 rounded-md">
            <div className="flex justify-between sm:pb-4 items-center">
              <h1 className="text-xl font-bold">Change Password</h1>
              <div
                onClick={() => setResetPassword(false)}
                className="text-white bg-red-600 px-2 py-2 rounded-md cursor-pointer"
              >
                <ImCross />
              </div>
            </div>

            <form>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-col sm:items-center sm:gap-5 mt-3 sm:mt-0">
                  {confirmPassword ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <label htmlFor="prevPassword" className="text-lg">
                        Current Password
                      </label>
                      <input
                        type="text"
                        name="prevPassword"
                        id="prevPassword"
                        placeholder="Current Password"
                        className={`${
                          errorMessage
                            ? "border-red-500 border-4"
                            : " border-2 border-gray-500"
                        } rounded-md p-2`}
                        value={prevPassword}
                        onChange={(e) => {
                          setErrorMessage("");
                          setPrevPassword(e.target.value);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <label htmlFor="password" className="text-lg">
                        New Password
                      </label>
                      <input
                        type="text"
                        name="password"
                        id="password"
                        placeholder="Enter new password"
                        className={`${
                          errorMessage
                            ? "border-red-500 border-4"
                            : " border-2 border-gray-500"
                        } rounded-md p-2`}
                        value={password}
                        onChange={(e) => {
                          setErrorMessage("");
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                  )}
                </div>
                {errorMessage && (
                  <div className="flex justify-center font-bold items-center text-red-600">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="flex justify-center font-bold items-center text-green-600">
                    {successMessage}
                  </div>
                )}
                <button
                  onClick={handleUpdatePassword}
                  className="px-7 py-2 rounded-md bg-green-500 text-white text-[18px]"
                >
                  {confirmPassword ? "Confirm" : "Update"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  const decoded = jwt_decode(token);
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}users/getUserbyId/${decoded.id}`
  );
  const user = response.data;

  return {
    props: {
      user,
    },
  };
}
