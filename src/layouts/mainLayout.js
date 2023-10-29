import NavBar from "../sections/navbar";
import Footer from "../sections/footer";
import useTawkTo from "../hooks/useTawkTo";

const MainLayout = ({ children }) => {
  const tawkToKey = "648bf151cc26a871b022df57"; // Replace with your actual Tawk.to key
  useTawkTo(tawkToKey);
  return (
    <div className="bg-black overflow-hidden min-h-screen ">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
