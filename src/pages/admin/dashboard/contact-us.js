import CustomDataGrid from "../../../components/customDataGrid";
import { useState, useEffect } from "react";
import DialogActions from "@mui/material/DialogActions";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { IconButton, Dialog } from "@mui/material";
import axios from "axios";

export default function AdminContactUs({ contacts }) {
  const [contactId, setContactId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedContactForUpdate, setSelectedContactForUpdate] =
    useState(null);
  const [addNewForm, setAddNewForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Submit");

  useEffect(() => {
    setContactId(selectedContactForUpdate?.id || "");
    setName(selectedContactForUpdate?.contactName || "");
    setPassword(selectedContactForUpdate?.password || "");
    setEmail(selectedContactForUpdate?.email || "");
  }, [selectedContactForUpdate]);

  const [rows, setRows] = useState(
    contacts.map((contact) => ({
      id: contact._id,
      contactName: contact.name,
      password: contact.password,
      email: contact.email,
    }))
  );

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}contact/getContactData`
      );
      setRows(
        response.data.map((contact) => ({
          id: contact._id,
          contactName: contact.name,
          password: contact.password,
          email: contact.email,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setName("");
    setPassword("");
    setEmail("");
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
      setSelectedContactForUpdate(null);
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
    formData.append("name", name);
    formData.append("password", password);
    formData.append("email", email);

    try {
      let response;
      if (isUpdate) {
        setSelectedContactForUpdate(null);
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}contact/updateContactData/${selectedContactForUpdate.id}`,
          formData
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}contact/addContactData`,
          formData
        );
      }
      fetchContacts();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteContact = async (contactId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}contact/deleteContactData/${contactId}`
      );
      setRows(rows.filter((row) => row.id !== contactId));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "contactName",
      headerName: "Name",
      flex: 1,
      valueGetter: (params) => params.contactName,
    },
    {
      field: "password",
      headerName: "Password",
      flex: 1,
      valueGetter: (params) => params.password,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      valueGetter: (params) => params.email,
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
          setSelectedContactForUpdate(params);
        };

        const onClickDelete = () => {
          if (
            window.confirm(
              `Are you sure you want to delete Contact Details ${params.contactName}?`
            )
          ) {
            deleteContact(params.id);
          }
        };
        return (
          <div className="flex-items-center">
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
        <div className="text-3xl">Contact Details</div>
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
        <Dialog
          open={addNewForm}
          onClose={handleAddFormClose}
          className="z-50 font-poppins"
        >
          <div className="p-4">
            <div className="text-2xl font-bold pb-3">Add New Detail</div>
            <form>
              <label htmlFor="name" className="font-bold">
                Name
              </label>
              <input
                type="text"
                className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                id="name"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="password" className="font-bold">
                Password
              </label>
              <input
                type="text"
                className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="email" className="font-bold">
                Email
              </label>
              <input
                type="text"
                className="w-full border-[2px] border-gray-300 rounded-md px-4 mb-3 py-2"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
    `${process.env.NEXT_PUBLIC_SERVER_URL}contact/getContactData`
  );
  const contacts = res.data;
  return {
    props: {
      contacts,
    },
  };
}
