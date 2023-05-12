import { useState } from "react";
import axios from "axios";
import CustomDataGrid from "../../../components/customDataGrid";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { IconButton, Dialog } from "@mui/material";

export default function Users({ users }) {
  const columns = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    {
      field: "options",
      headerName: "Options",
      renderCell: (params) => {
        const onClickDelete = () => {
          if (
            window.confirm(
              `Are you sure you want to delete user ${params.firstName} ${params.lastName}?`
            )
          ) {
            deleteUser(params.id);
          }
        };
        return (
          <>
            <IconButton onClick={onClickDelete}>
              <DeleteRoundedIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const [rows, setRows] = useState(
    users.map((user) => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.username,
    }))
  );

  const deleteUser = async (userId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}users/deleteUser/${userId}`
      );
      setRows(rows.filter((row) => row.id !== userId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="mb-2 flex flex-row justify-between">
        <div className="text-3xl">Users</div>
      </div>
      <div
        style={{ maxHeight: "calc(100vh - 200px)", height: 500 }}
        className="h-auto overflow-auto w-full bg-white"
      >
        <CustomDataGrid data={rows} columns={columns} autoHeight />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}users/getAllUsers`
  );
  const users = res.data;
  return {
    props: {
      users,
    },
  };
}
