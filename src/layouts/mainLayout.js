import NavBar from "../sections/navbar";
import Footer from "../sections/footer";
import useTawkTo from "../hooks/useTawkTo";

const MainLayout = ({ children }) => {
  useTawkTo();
  return (
    <div className="bg-black overflow-hidden min-h-screen ">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
