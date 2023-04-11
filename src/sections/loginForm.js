import { Dialog } from "@mui/material";
import { useState, useEffect } from "react";
import DialogActions from "@mui/material/DialogActions";
import axios from "axios";
import { useRouter } from "next/router";

const LoginRegisterForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill all the fields")
      return;
    }
     const formData = new FormData();
     formData.append("username", username);
     formData.append("password", password);

     try{
        const response = await axios.post("https://enigmatic-badlands-35417.herokuapp.com/admins/verifyAdmin", formData);
        localStorage.setItem("authenticated", "true");
        router.push("/dashboards");
        console.log(response.data);
     } catch(error){
        console.log(error);
        alert("Invalid username or password");
      }

  };

  return (
    <Dialog open={true}>
      <div className="p-4">
        <div className="text-2xl font-bold pb-3">Login Form</div>
        <form>
          <label htmlFor="username" className="font-bold">
            Username
          </label>
          <input
            type="username"
            className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
            id="username"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password" className="font-bold">
            Password
          </label>
          <input
            type="password"
            className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
      </div>
      <DialogActions>
        <button
          className="py-2 px-4 rounded-md bg-green-400"
          onClick={handleFormSubmit}
        >
          Login
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginRegisterForm;
