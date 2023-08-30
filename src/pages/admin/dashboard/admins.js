import CustomDataGrid from "../../../components/customDataGrid";
import { useState, useEffect } from "react";
import DialogActions from "@mui/material/DialogActions";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { IconButton, Dialog } from "@mui/material";
import axios from "axios";

export default function Admins({ admins }) {
  const [adminId, setAdminId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hint, setHint] = useState("");
  const [selectedAdminForUpdate, setSelectedAdminForUpdate] = useState(null);
  const [addNewForm, setAddNewForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Submit");

  useEffect(() => {
    setAdminId(selectedAdminForUpdate?.id || "");
    setUsername(selectedAdminForUpdate?.adminUsername || "");
    setPassword(selectedAdminForUpdate?.password || "");
    setHint(selectedAdminForUpdate?.hint || "");
  }, [selectedAdminForUpdate]);

  const [rows, setRows] = useState(
    admins.map((admin) => ({
      id: admin._id,
      adminUsername: admin.username,
      password: admin.password,
      hint: admin.hint,
    }))
  );

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admins/getAllAdmins`
      );
      setRows(
        response.data.map((admin) => ({
          id: admin._id,
          adminUsername: admin.username,
          password: admin.password,
          hint: admin.hint,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setHint("");
  };

  const handleAddFormOpen = (e) => {
    e.preventDefault();
    resetForm();
    setIsUpdate(false);
    setButtonLabel("Submit");
    setAddNewForm(true);
  };

  const handleAddFormClose = (e) => {
    if (isUpdate) {
      setSelectedAdminForUpdate(null);
    }
    e.preventDefault();
    setAddNewForm(false);
    resetForm();
  };

  const handleFormSubmit = async (e) => {
    setAddNewForm(false);
    e.preventDefault();
    resetForm();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("hint", hint);

    try {
      let response;
      if (isUpdate) {
        setSelectedAdminForUpdate(null);
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admins/updateAdminById/${selectedAdminForUpdate.id}`,
          formData
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admins/addNewAdmin`,
          formData
        );
      }
      fetchAdmins();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAdmin = async (adminId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admins/deleteAdmin/${adminId}`
      );
      setRows(rows.filter((row) => row.id !== adminId));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "adminUsername",
      headerName: "Username",
      flex: 1,
      valueGetter: (params) => params.adminUsername,
    },
    {
      field: "hint",
      headerName: "Hint",
      flex: 1,
      valueGetter: (params) => params.hint,
    },
    {
      field: "options",
      headerName: "Options",
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const onClickEdit = () => {
          setIsUpdate(true);
          setButtonLabel("Update");
          setAddNewForm(true);
          setSelectedAdminForUpdate(params);
        };

        const onClickDelete = () => {
          if (
            window.confirm(
              `Are you sure you want to delete admin ${params.adminUsername}?`
            )
          ) {
            deleteAdmin(params.id);
          }
        };
        return (
          <div className="flex items-center">
            <IconButton onClick={onClickEdit}>
              <EditRoundedIcon className="text-white hover:text-orange-600 duration-100 hover:scale-125" />
            </IconButton>
            <IconButton onClick={onClickDelete}>
              <DeleteRoundedIcon className="text-white hover:text-orange-600 duration-100 hover:scale-125" />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className="font-poppins">
      <div className="mb-2 flex flex-row justify-between">
        <div className="text-3xl">Admins</div>
        <button
          className="py-1 px-2 xs:py-2 xs:px-4 button-animation-reverse hover:scale-100 rounded-md"
          onClick={handleAddFormOpen}
        >
          <span className="hidden xs:flex">+ Add New</span>
          <span className="xs:hidden flex">+ Add</span>
        </button>
      </div>
      <div
        style={{ maxHeight: "calc(100vh - 200px)", height: 500 }}
        className="h-auto overflow-auto w-full"
      >
        <CustomDataGrid data={rows} columns={columns} autoHeight />
      </div>
      <div>
        <Dialog open={addNewForm} onClose={handleAddFormClose}>
          <div className="p-4 font-poppins">
            <div className="text-2xl font-bold pb-3">Add New Admin</div>
            <form>
              <label htmlFor="username" className="font-bold">
                UserName
              </label>
              <input
                type="text"
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
                placeholder={
                  isUpdate
                    ? "ReType Current Password or Enter New Password"
                    : "Enter Password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="hint" className="font-bold">
                Hint
              </label>
              <input
                type="text"
                className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                id="hint"
                placeholder="Enter Hint"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
              />
            </form>
          </div>
          <DialogActions>
            <button
              className="py-2 px-4 rounded-md button-animation-reverse-green-soft hover:text-black hover:scale-100 font-poppins"
              onClick={handleFormSubmit}
            >
              {buttonLabel}
            </button>
            <button
              className="py-2 px-4 rounded-md button-animation-reverse-red-soft hover:text-black hover:scale-100 font-poppins"
              onClick={handleAddFormClose}
            >
              Close
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}admins/getAllAdmins`
  );
  const admins = res.data;
  return {
    props: {
      admins,
    },
  };
}
