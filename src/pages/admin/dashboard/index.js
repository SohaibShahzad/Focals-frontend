import axios from "axios";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
const jwt_decode = jwt.decode;

export default function AdminDashboarding({admin}) {
  return (
    <div className="flex flex-col font-poppins justify-center py-2">
      <main className="text-center">
        <h1 className="text-3xl font-bold">Welcome, {admin.username}!</h1>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt_decode(token);
    console.log(decoded);
    if (decoded.type !== "admin") {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}admins/getAdminbyId/${decoded.id}`
    );
    const admin = response.data;

    if (!admin) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: { admin },
    };
  } catch (err) {
    console.log("Error decoding JWT: ", err);
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
}
