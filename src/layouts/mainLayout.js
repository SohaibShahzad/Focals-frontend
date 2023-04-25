import NavBar from "../sections/navbar";
import Footer from "../sections/footer";

const MainLayout = ({ children }) => {
  return (
    <div className="bg-black overflow-hidden">
    {/* // <div> */}
      <NavBar />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;