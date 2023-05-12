import { useState } from "react";
import axios from "axios";
import CustomDataGrid from "../../../components/customDataGrid";

export default function Users({ users }) {
  const columns = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    {
      field: "options",
      headerName: "Options",
      renderCell: (row) => (
        <>
          <button onClick={() => deleteUser(row.id)}>Delete</button>
        </>
      ),
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
      <div className="md:mt-10 mt-24 mb-2 flex flex-row justify-between">
        <div className="text-3xl">Users</div>
      </div>
      <div className="flex items-center flex-col justify-around">
        <CustomDataGrid columns={columns} data={rows} />
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
