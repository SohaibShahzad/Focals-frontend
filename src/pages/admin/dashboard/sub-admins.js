import CustomDataGrid from "../../../components/customDataGrid";
import { useState, useEffect } from "react";
import DialogActions from "@mui/material/DialogActions";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { IconButton, Dialog } from "@mui/material";
import axios from "axios";

export default function SubAdmins({ subAdmins }) {
  const [subAdminId, setSubAdminId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hint, setHint] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [fixedPermissions, setFixedPermissions] = useState([
    "blogs",
    "services",
    "projects",
    "testimonials",
    "liveChat",
  ]);
  const [selectedSubAdminForUpdate, setSelectedSubAdminForUpdate] =
    useState(null);
  const [addNewForm, setAddNewForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Submit");

  useEffect(() => {
    setSubAdminId(selectedSubAdminForUpdate?.id || "");
    setUsername(selectedSubAdminForUpdate?.subAdminUsername || "");
    setPassword(selectedSubAdminForUpdate?.password || "");
    setHint(selectedSubAdminForUpdate?.hint || "");
    setPermissions([]);
    if (selectedSubAdminForUpdate?.permissions) {
      let selectedPermissions = selectedSubAdminForUpdate.permissions;
      let newPermissions = fixedPermissions.filter((permission) =>
        selectedPermissions.includes(permission)
      );
      setPermissions(newPermissions);
    }
  }, [selectedSubAdminForUpdate]);

  const [rows, setRows] = useState(
    subAdmins.map((subAdmin) => ({
      id: subAdmin._id,
      subAdminUsername: subAdmin.username,
      password: subAdmin.password,
      hint: subAdmin.hint,
      permissions: subAdmin.permissions,
    }))
  );

  const fetchSubAdmins = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}subAdmins/getAllSubAdmins`
      );
      setRows(
        response.data.map((subAdmin) => ({
          id: subAdmin._id,
          subAdminUsername: subAdmin.username,
          password: subAdmin.password,
          hint: subAdmin.hint,
          permissions: subAdmin.permissions,
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
    setPermissions([]);
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
      setSelectedSubAdminForUpdate(null);
    }
    e.preventDefault();
    setAddNewForm(false);
    resetForm();
  };

  const handleFormSubmit = async (e) => {
    if (username === "" || password === "" || hint === "") {
      alert("Please fill all the fields!");
      return;
    }

    setAddNewForm(false);
    e.preventDefault();
    resetForm();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("hint", hint);

    const newPermissions = permissions;
    formData.append("permissions", JSON.stringify(newPermissions));
    console.log(username, password, hint, permissions);
    try {
      let response;
      if (isUpdate) {
        setSelectedSubAdminForUpdate(null);
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}subAdmins/updateSubAdminById/${selectedSubAdminForUpdate.id}`,
          formData
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}subAdmins/addNewSubAdmin`,
          formData
        );
      }
      fetchSubAdmins();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSubAdmin = async (subAdminId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}subAdmins/deleteSubAdmin/${subAdminId}`
      );
      setRows(rows.filter((row) => row.id !== subAdminId));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "subAdminUsername",
      headerName: "Username",
      flex: 1,
      valueGetter: (params) => params.subAdminUsername,
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
          setSelectedSubAdminForUpdate(params);
        };

        const onClickDelete = () => {
          if (
            window.confirm(
              `Are you sure you want to delete sub-admin ${params.subAdminUsername}?`
            )
          ) {
            deleteSubAdmin(params.id);
          }
        };
        return (
          <>
            <IconButton onClick={onClickEdit}>
              <EditRoundedIcon className="text-white hover:text-orange-600 duration-100 hover:scale-125" />
            </IconButton>
            <IconButton onClick={onClickDelete}>
              <DeleteRoundedIcon className="text-white hover:text-orange-600 duration-100 hover:scale-125" />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <div className="font-poppins">
      <div className="mb-2 flex flex-row justify-between">
        <div className="text-3xl">Sub-Admins</div>
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
            <div className="text-2xl font-bold pb-3">Add New Sub-Admin</div>
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
              <label htmlFor="permissions" className="font-bold">
                Permissions
              </label>
              <div className="flex flex-row flex-wrap">
                {fixedPermissions.map((permission, index) => (
                  <div key={index} className="flex flex-row items-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      id={permission}
                      checked={permissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Add the permission to the array if the checkbox is checked
                          setPermissions((prevPermissions) => [
                            ...prevPermissions,
                            permission,
                          ]);
                        } else {
                          // Remove the permission from the array if the checkbox is unchecked
                          setPermissions((prevPermissions) =>
                            prevPermissions.filter(
                              (perm) => perm !== permission
                            )
                          );
                        }
                      }}
                    />
                    <label htmlFor={permission} className="mr-2 ml-1">
                      {permission}
                    </label>
                  </div>
                ))}
              </div>
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
    `${process.env.NEXT_PUBLIC_SERVER_URL}subAdmins/getAllSubAdmins`
  );
  const subAdmins = res.data;
  return {
    props: {
      subAdmins,
    },
  };
}
