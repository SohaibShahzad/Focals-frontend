import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { Dialog } from "@mui/material";
import { AiFillDelete } from "react-icons/ai";
import CalendlyWidget from "../../components/calendlyWidget";
import { useStateContext } from "../../contexts/ContextProvider";
import styles from "../../styles";
import { parseCookies } from "nookies";
import { stripe } from "../../lib/stripe";
import transformOrders from "../../helper/transformOrders";
import * as jwt from "jsonwebtoken";
const jwt_decode = jwt.decode;

export default function CartCheckoutPage({ session }) {
  const { cart, setCart } = useStateContext();
  const [order, setOrder] = useState([]);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  let ordersArray = [];

  useEffect(() => {
    if (session) {
      console.log("session: ", session);
      ordersArray = transformOrders(session.line_items, session.customer_email);
    }
  }, []);

  const addToCart = (targetServiceId, targetBundle, action) => {
    let tempCart = cart.map((service) => {
      if (service.serviceId === targetServiceId) {
        let serviceCopy = { ...service };
        let targetBundleIndex = serviceCopy.bundles.findIndex(
          (bundle) => bundle.id === targetBundle.id
        );

        if (targetBundleIndex !== -1) {
          if (action === "increase") {
            serviceCopy.bundles[targetBundleIndex].quantity += 1;
          } else if (action === "decrease") {
            serviceCopy.bundles[targetBundleIndex].quantity -= 1;

            if (serviceCopy.bundles[targetBundleIndex].quantity === 0) {
              serviceCopy.bundles.splice(targetBundleIndex, 1);

              if (serviceCopy.bundles.length === 0) {
                return null;
              }
            }
          }
        }

        return serviceCopy;
      } else {
        return service;
      }
    });

    tempCart = tempCart.filter((item) => item !== null);
    setCart(tempCart);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    cart.forEach((service) => {
      service.bundles.forEach((bundle) => {
        totalPrice += bundle.price * bundle.quantity;
      });
    });

    return totalPrice;
  };

  const stripeCheckout = async () => {
    try {
      const res = await axios.post("/api/checkout", order, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const redirectUrl = res.data.url;
      window.location.href = redirectUrl;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`${styles.innerWidth} ${styles.xPaddings} mx-auto text-white font-poppins relative`}
    >
      <div className="gradient-03" />
      <div className="gradient-02" />
      <h1 className="md:text-[64px] text-[50px] font-extrabold text-white relative">
        Cart
      </h1>
      <div className="mb-[30px] h-[2px]  bg-white opacity-20" />
      {cart.length === 0 ? (
        <div className="text-[20px] flex justify-center">
          <div className="flex flex-col gap-3 items-center">
            <span className="text-[22px] font-semibold">No Items</span>
            <Link href="/services">
              <span className="button-animation-reverse hover:scale-100 border-[3px] py-1 sm:p-1 sm:px-2 rounded-md ">
                {" "}
                Add some!
              </span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:space-y-0 md:justify-between gap-5">
          <div className="lg:w-1/3">
            <div className="flex justify-between mb-4 items-center">
              <h2 className="text-[24px] ">Item Detail</h2>
              <button
                onClick={() => setCart([])}
                className="opacity-50 flex gap-1 scale-125 items-center hover:opacity-100 transition transform-all duration-300 rounded-md px-1 hover:bg-orange-600"
              >
                <AiFillDelete />
                <span>Clear cart</span>
              </button>
            </div>
            {cart.map((service) => (
              <div
                key={service.serviceId}
                className="mb-5 border-b-2 border-gray-500 border-rounded-md pb-3 flex flex-col"
              >
                <h1 className="text-[18px] text-center md:text-left mb-2 font-bold z-30">
                  {service.serviceName}
                </h1>
                <div className="z-30 flex flex-col gap-3">
                  {service.bundles.map((bundle) => (
                    <div
                      key={bundle.id}
                      className="glassmorphism-projects rounded-xl py-2 px-2 justify-between h-full"
                    >
                      <div className="flex  justify-between items-center">
                        <div className="flex flex-col justify-center ">
                          <h1 className="text-[18px] font-bold">
                            {bundle.name}
                          </h1>
                          <span className="text-[20px] flex items-center gap-2">
                            <p className="text-[16px] text-gray-300">
                              Sub-Total:
                            </p>{" "}
                            ${bundle.price * bundle.quantity}
                          </span>
                        </div>
                        <div className="flex flex-col justify-center border-l-2 pl-3 border-gray-500 items-center">
                          <button
                            className="text-orange-700 bg-white hover:text-orange-500 rounded-full transition-all duration-200 ease-in-out hover:scale-110  cursor-pointer"
                            onClick={() =>
                              addToCart(service.serviceId, bundle, "increase")
                            }
                          >
                            <span className="text-[20px] font-bold">
                              <FaPlusCircle className="w-6 h-6" />
                            </span>
                          </button>
                          <h1 className="text-[20px] font-bold">
                            {bundle.quantity}
                          </h1>
                          <button
                            className="text-orange-700 bg-white hover:text-orange-500 rounded-full transition-all duration-200 ease-in-out hover:scale-110 cursor-pointer"
                            onClick={() =>
                              addToCart(service.serviceId, bundle, "decrease")
                            }
                          >
                            <span className="text-[20px] font-bold">
                              <FaMinusCircle className="w-6 h-6" />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() => setCalendlyOpen(true)}
              className="text-[18px] sm:p-1 sm:px-2 w-full button-animation-reverse rounded-md hover:scale-100"
            >
              Schedule Meeting
            </button>
            <Dialog open={calendlyOpen} onClose={() => setCalendlyOpen(false)}>
              <CalendlyWidget />
            </Dialog>
          </div>
          <div className="lg:w-1/3">
            <div className="glassmorphism-projects rounded-xl p-2 relative">
              <div className="flex flex-col gap-2 justify-between h-[250px]">
                <span className="flex justify-between items-center">
                  <h1 className="text-[20px]">Total:</h1>
                  <h1 className="text-[24px] font-bold">
                    ${calculateTotalPrice().toLocaleString()}
                  </h1>
                </span>
                <div>
                  <div className="h-[2px] bg-[#666666] mb-2" />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setOrder(cart);
                        stripeCheckout();
                      }}
                      className="button-animation-reverse hover:scale-100 hover:border-[3px] py-1 sm:p-1 sm:px-2 rounded-md"
                    >
                      <h1 className="text-[20px]">Payment</h1>
                    </button>

                    <Link
                      className="button-animation-reverse hover:scale-100 hover:border-[3px] py-1 sm:p-1 sm:px-2 rounded-md "
                      href="/services"
                    >
                      <h1 className="text-[20px] text-center">
                        + Add More Items
                      </h1>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const parameters = context.query;
  let session;
  if (parameters.success) {
    session = await stripe.checkout.sessions.retrieve(parameters.session_id, {
      expand: ["line_items"],
    });
  }
  const cookies = parseCookies(context);
  const token = cookies.token;
  const decoded = jwt.decode(token);
  const propLogin = {
    signup: false,
    signin: true,
  };

  if (!token) {
    return {
      redirect: {
        destination: `/login?prop=${encodeURIComponent(
          JSON.stringify(propLogin)
        )}`,
        permanent: false,
      },
    };
  } else {
    try {
      if (decoded.type !== "user") {
        return {
          redirect: {
            destination: `/login?prop=${encodeURIComponent(
              JSON.stringify(propLogin)
            )}`,
            permanent: false,
          },
        };
      }
    } catch (err) {
      return {
        redirect: {
          destination: `/login?prop=${encodeURIComponent(
            JSON.stringify(propLogin)
          )}`,
          permanent: false,
        },
      };
    }
  }
  return {
    props: {
      session: session ? session : null,
    },
  };
}
