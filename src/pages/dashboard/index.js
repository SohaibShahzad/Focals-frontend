import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
import axios from "axios";

const jwt_decode = jwt.decode;

const UserPanel = ({user}) => {
  return (
    <div className="flex flex-col justify-center py-2 font-poppins">
      <main className="text-center">
        <h1 className="text-3xl font-bold">Welcome, {user.firstName} {user.lastName}!</h1>
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt_decode(token);
    console.log(decoded);
    if (decoded.type !== "user") {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}users/getUserbyId/${decoded.id}`
    );
    const user = response.data;

    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: { user },
    };
  } catch (err) {
    console.log("Error decoding JWT: ", err);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

export default UserPanel;
