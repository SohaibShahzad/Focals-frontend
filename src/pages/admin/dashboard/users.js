import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { IconButton } from "@mui/material";
import axios from "axios";

export default function Users({ users }) {
  const [rows, setRows] = useState(
    users.map((user) => ({
      id: user._id,
      userUsername: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
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

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      valueGetter: (params) => params.row.firstName + " " + params.row.lastName,
    },
    {
      field: "userUsername",
      headerName: "Email",
      flex: 1,
      valueGetter: (params) => params.row.userUsername,
    },
    {
      field: "options",
      headerName: "Options",
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const onClickDelete = () => {
          if (
            window.confirm(
              `Are you sure you want to delete user ${
                params.row.firstName + " " + params.row.lastName
              }?`
            )
          ) {
            deleteUser(params.row.id);
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

  return (
    <>
      <div className="md:mt-10 mt-24 mb-2 flex flex-row justify-between">
        <div className="text-3xl">Users</div>
      </div>
      <div
        style={{ maxWidth: "100%" }}
        className="h-auto w-full bg-white shadow-lg "
      >
        <DataGrid rows={rows} columns={columns} autoHeight />
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
