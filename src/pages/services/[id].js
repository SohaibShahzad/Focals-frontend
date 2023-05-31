import axios from "axios";
import styles from "../../styles";
import Link from "next/link";
import { useStateContext } from "../../contexts/ContextProvider";
import { useState, useEffect } from "react";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CalendlyWidget from "../../components/calendlyWidget";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import classes from "../../styles/contactSection.module.css";
import { IoMdCloseCircle } from "react-icons/io";

export default function SingleService({ serviceData }) {
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { cart, setCart } = useStateContext();

  useEffect(() => {
    const cartFromStorage = localStorage.getItem("cart");
    if (cartFromStorage) {
      setCart(JSON.parse(cartFromStorage));
    }
  }, []);

  const addToCart = (bundle, action) => {
    let newCart = [];
    const existingCartItem = cart.find(
      (item) => item.serviceId === serviceData._id
    );
  
    if (existingCartItem) {
      newCart = cart.map((item) =>
        item.serviceId === serviceData._id
          ? {
              ...existingCartItem,
              bundles: existingCartItem.bundles.some((b) => b.id === bundle._id)
                ? existingCartItem.bundles.map((b) =>
                    b.id === bundle._id
                      ? {
                          ...b,
                          quantity:
                            action === "increase"
                              ? b.quantity + 1
                              : b.quantity > 0
                              ? b.quantity - 1
                              : 0,
                        }
                      : b
                  )
                : [
                    ...existingCartItem.bundles,
                    {
                      id: bundle._id,
                      name: bundle.name,
                      price: bundle.price,
                      quantity: 1,
                    },
                  ],
            }
          : item
      );
      newCart = newCart.map((item) => ({
        ...item,
        bundles: item.bundles.filter((b) => b.quantity > 0),
      }));
      newCart = newCart.filter((item) => item.bundles.length !== 0);
    } else if (action === "increase") {
      newCart = [
        ...cart,
        {
          serviceId: serviceData._id,
          serviceName: serviceData.title,
          bundleId: bundle._id,
          bundles: [
            {
              id: bundle._id,
              name: bundle.name,
              price: bundle.price,
              quantity: 1,
            },
          ],
        },
      ];
    }
  
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormOpen(false);
    setWidgetOpen(true);
  };

  const openFullScreen = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const changeImageIndex = (newIndex) => {
    if (newIndex < 0) {
      newIndex = serviceData.images.length - 1;
    } else if (newIndex >= serviceData.images.length) {
      newIndex = 0;
    }
    setActiveImageIndex(newIndex);
  };

  return (
    <div
      className={`${styles.innerWidth} ${styles.xPaddings} mx-auto text-white relative z-[10] font-poppins`}
    >
      <div className="gradient-02 z-[-1]" />

      <div className="md:text-[64px] text-[50px] font-extrabold ">
        {serviceData.title}
      </div>

      <div className="mb-[10px] h-[2px] bg-white opacity-20" />
      <p
        className="text-[15px] mb-[10px] md:text-[25px] md:font-normal py-5"
        dangerouslySetInnerHTML={{ __html: serviceData.description }}
      />

      {fullScreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center cursor-zoom-out"
          onClick={closeFullScreen}
        >
          <img
            src={fullScreenImage}
            alt="Fullscreen Image"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5 items-center">
        <div className="glassmorphism text-center lg:col-span-2 rounded-md">
          <div className="relative w-full">
            <div style={{ paddingBottom: "56.25%" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              {serviceData.images.map(
                (imageUrl, index) =>
                  index === activeImageIndex && (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Image ${index}`}
                      onClick={() => openFullScreen(imageUrl)}
                      className="rounded-md w-full h-full object-contain cursor-zoom-in"
                    />
                  )
              )}
            </div>
            <button
              onClick={() => changeImageIndex(activeImageIndex - 1)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-600 p-2 font-bold text-white rounded-md"
            >
              &lt;
            </button>
            <button
              onClick={() => changeImageIndex(activeImageIndex + 1)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-orange-600 p-2 font-bold text-white rounded-md"
            >
              &gt;
            </button>
          </div>
        </div>
        <div>
          <Tabs index={activeTab} onSelect={handleTabChange}>
            <TabList className="flex gap-3 justify-center mb-3 cursor-pointer">
              {serviceData.packages.map((bundle) => (
                <Tab
                  key={bundle._id}
                  selectedClassName="bg-orange-700 font-bold"
                  className="border-2 rounded-md p-2"
                >
                  {bundle.name}
                </Tab>
              ))}
            </TabList>
            {serviceData.packages.map((bundle) => (
              <TabPanel key={bundle._id}>
                <div className="glassmorphism-projects rounded-md p-5 mb-8 md:px-7 w-full">
                  <div className="flex justify-between pb-2 items-center">
                    <h2 className="text-center font-bold text-[16px]">
                      {bundle.name}
                    </h2>
                    <div className=" text-[20px] font-bold">
                      ${bundle.price}
                    </div>
                  </div>
                  <div className="mb-[10px] h-[2px] rounded-md bg-white opacity-50" />

                  <div className="pt-2 text-[16px]">{bundle.description}</div>
                  <div className="font-bold pt-2 text-gray-400">Features:</div>
                  <ul>
                    {bundle.features.map((feature) => (
                      <li key={feature} className="">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                  <div>
                    {/* <div
                      onClick={() => setFormOpen(true)}
                      className="2xl:w-1/2 bg-orange-700 rounded-md py-1 items-center text-center cursor-pointer"
                    >
                      Continue <ArrowRightAltRoundedIcon />
                    </div> */}
                    <div className="my-[10px] h-[2px] rounded-md bg-white opacity-50" />
                    {cart.find(
                      (item) =>
                        item.serviceId === serviceData._id &&
                        item.bundles.some((b) => b.id === bundle._id)
                    ) ? (
                      <div className="flex items-center justify-between ">
                        <div className="text-[22px]">Quantity: </div>
                        <div className="flex gap-3 justify-center items-center">
                          <span
                            className="text-orange-700 bg-white hover:text-orange-500 rounded-full  cursor-pointer"
                            onClick={() => addToCart(bundle, "decrease")}
                          >
                            <FaMinusCircle className="w-7 h-7" />
                          </span>
                          <span className="text-[26px]">
                            {
                              cart
                                .find(
                                  (item) => item.serviceId === serviceData._id
                                )
                                .bundles.find((b) => b.id === bundle._id)
                                .quantity
                            }
                          </span>
                          <span
                            className="text-orange-700 bg-white hover:text-orange-500 rounded-full  cursor-pointer"
                            onClick={() => addToCart(bundle, "increase")}
                          >
                            <FaPlusCircle className="w-7 h-7" />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="bg-orange-700 hover:bg-orange-500 hover:font-bold mt-1 rounded-md py-1 items-center text-center cursor-pointer text-[20px]"
                        onClick={() => addToCart(bundle, "increase")}
                      >
                        Add to Cart <AddShoppingCartRoundedIcon />
                      </div>
                    )}
                  </div>
                  <Dialog open={formOpen} onClose={() => setFormOpen(false)}>
                    <div className="bg-black">
                      <div className="glassmorphism p-4 font-poppins text-white">
                        <form>
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                              <label htmlFor="email">Email</label>
                              <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={` ${classes.formInputs} border-2 rounded-md text-[16px]`}
                              />
                            </div>
                          </div>
                        </form>
                        <DialogActions>
                          <button
                            onClick={handleFormSubmit}
                            className="bg-orange-700 rounded-md py-2 px-4 mt-5 items-center text-center cursor-pointer"
                          >
                            Continue
                          </button>
                          <button
                            onClick={() => {
                              setFormOpen(false);
                              setEmail("");
                            }}
                            className="absolute right-1 top-0 mt-2 mr-2 text-red-600 font-bold"
                          >
                            <IoMdCloseCircle size={25} />
                          </button>
                        </DialogActions>
                      </div>
                    </div>
                  </Dialog>
                  <Dialog
                    open={widgetOpen}
                    onClose={() => setWidgetOpen(false)}
                    className="fixed z-10 inset-0 overflow-y-auto"
                  >
                    <CalendlyWidget
                      bundle={bundle}
                      serviceData={serviceData}
                      email={email}
                    />
                  </Dialog>
                </div>
              </TabPanel>
            ))}
          </Tabs>
        </div>
      </div>
      <div className="flex justify-around mt-5">
        <Link href="/contact-us">
          <div className="cursor-pointer bg-orange-700 py-2 px-5 rounded-md font-bold">
            Let's Discuss
          </div>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}services/getServiceDataAndImages/${id}`
  );
  const serviceData = res.data;
  console.log(serviceData);
  return {
    props: {
      serviceData,
    },
  };
}
