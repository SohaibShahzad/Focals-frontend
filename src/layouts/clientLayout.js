import NavBar from "../sections/navbar";
import Footer from "../sections/footer";

const ClientLayout = ({ children }) => {
  return (
    <div className="bg-black overflow-hidden">
    {/* // <div> */}
      <NavBar />
      {children}
      <Footer />
    </div>
  );
};

export default ClientLayout;