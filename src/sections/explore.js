import { staggerContainer } from "../helper/motion";
import { motion } from "framer-motion";
import styles from "../styles";
import { TypingText, TitleText } from "../components/customText";
import { VideoCarousel } from "../components/videoCarousel";
import { Button } from "../components/button";

const Explore = ({ portfolio }) => (


    <section className={`${styles.paddings}`} id="explore">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
      >
        <TypingText title="| Explore" textStyles="text-center" />
        <TitleText
          title={<>A Collection of Our Finest Projects</>}
          textStyles="text-center pb-[50px]"
        />
        <div className="text-center">
            <VideoCarousel/>
          <Button
            title="Explore Further >"
            styling="bg-[#621000] mt-[50px] hover:bg-orange-800 hover:drop-shadow-[0_5px_5px_rgba(255,167,49,0.25)] text-white hover:font-bold"
            link="/webApp/portfolio"
          />
        </div>
      </motion.div>
    </section>
  );


export default Explore;