import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { MdTune } from "react-icons/md";
import styles from "../../styles";

export default function ServicesPage({ services }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterToggle, setFilterToggle] = useState(false);

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div
      className={`${styles.innerWidth} ${styles.xPaddings} mx-auto text-white font-poppins`}
    >
      <div className="flex justify-between items-center">
        <h1 className="md:text-[64px] text-[50px] font-extrabold light-text ">
          Our Services
        </h1>
        <div
          className="object-contain cursor-pointer"
          onClick={() => setFilterToggle((prev) => !prev)}
        >
          <MdTune style={{ color: "white", fontSize: "2rem" }} />
        </div>
      </div>
      <div className="mb-[50px] h-[2px]  bg-white opacity-20" />
      {filterToggle ? (
        <div className="flex flex-row gap-9 flex-wrap md:flex-nowrap">
          <div className="mb-5">
            <label htmlFor="title-filter" className="light-text mr-3">
              Filter by Name:
            </label>
            <input
              placeholder="Enter Name"
              type="text"
              className="text-gray-700 px-5 py-1.5 rounded-md placeholder:text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
        {filteredServices.map((service) => (
          <div
            key={service._id}
            className="p-5 glassmorphism-projects rounded-xl mb-5 flex gap-5 flex-col justify-between h-full"
          >
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center my-3">
                <img
                  src={service.thumbnail}
                  alt={service.title}
                  className="w-[auto] h-[75px]"
                />
              </div>
              <h3 className="text-center font-bold text-[24px] border-b-2 border-gray-600 pb-1 ">
                {service.title}
              </h3>
              <p
                className="mt-2 items-center text-center md:pt-1 text-[18px] "
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </div>
            <Link
              href={`/services/${service._id}`}
              className="text-center bg-orange-900 font-bold rounded-md py-2 md:px-5"
            >
              Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}services/getAllServices`
  );
  const services = res.data;
  return {
    props: {
      services,
    },
  };
}
