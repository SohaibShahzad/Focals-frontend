import axios from "axios";
import styles from "../../styles";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SingleService({ serviceData }) {
  return (
    <div className={`${styles.paddings} text-white`}>
      <div className="md:text-[64px] text-[50px] font-extrabold ">
        {serviceData.title}
      </div>

      <div className="mb-[10px] h-[2px]  bg-white opacity-20" />
      <div className="text-[20px] font-bold mb-[10px] md:text-[40px] md:font-normal">
        {serviceData.description}
      </div>
      <div className="md:flex flex-row gap-10 justify-evenly">
        {serviceData.packages.map((bundle) => (
          <div
            key={bundle._id}
            className="glassmorphism rounded-xl p-5 mb-8 md:px-7 w-full"
          >
            <h2 className="text-center border-b-2 border-gray-500 pb-2 font-bold text-[20px]">
              {bundle.name}
            </h2>
            <div className="pt-2 text-[18px]">{bundle.description}</div>
            <div className="font-bold pt-2 text-gray-400">Features:</div>
            <ul>
              {bundle.features.map((feature) => (
                <li key={feature} className="">
                  • {feature}
                </li>
              ))}
            </ul>
            <div className="fixed bottom-0 right-0 mr-3 mb-3">
              <div className="bg-orange-900 rounded-md px-6 py-1">
                ${bundle.price}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-around">
        <Link href="/contact-us">
          <div className="cursor-pointer bg-orange-900 py-2 px-5 rounded-xl font-bold">
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
    `https://enigmatic-badlands-35417.herokuapp.com/services/getServiceById/${id}`
  );
  const serviceData = res.data;
  return {
    props: {
      serviceData,
    },
  };
}
