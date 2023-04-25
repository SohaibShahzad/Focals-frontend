import { staggerContainer } from "../helper/motion";
import { motion } from "framer-motion";
import styles from "../styles";
import { TypingText, TitleText } from "../components/customText";
import { VideoCarousel } from "../components/videoCarousel";
import { Button } from "../components/button";

const Explore = () => (


    <section className={`${styles.paddings} relative z-30`} id="explore">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
      >
        <div className={`font-tungsten`}>
          <TypingText title="Explore" />
        </div>
                {/* <TitleText
          title={<>A Collection of Our Finest Projects</>}
          textStyles="text-center pb-[50px]"
        /> */}
        <div className={`${styles.yPaddings} text-center`}>
          
            <VideoCarousel/>
        </div>
          <Button
            title="Explore Further >"
            styling="bg-orange-700 font-poppins hover:bg-orange-800 hover:drop-shadow-[0_5px_5px_rgba(255,167,49,0.25)] text-white hover:font-bold"
            link="/portfolio"
          />
      </motion.div>

    </section>
  );


export default Explore;