"use client";

import { motion } from "framer-motion";
import { socials } from "../routes/footerLinks";
import styles from "../styles";
import { IconButton, Dialog, DialogContent } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { footerVariants } from "../helper/motion";
import { useEffect, useState } from "react";
import axios from "axios";

const Footer = () => {
  const [contentDialog, setContentDialog] = useState(false);
  const [contentParagraph, setContentParagraph] = useState("");
  const [contentHeading, setContentHeading] = useState("");
  const [completeContent, setCompleteContent] = useState([]);

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}termsPolicy/getAllContent`
        );
        setCompleteContent(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchContent();
  }, []);

  const extractData = (contentName) => {
    const content = completeContent.find(
      (data) => data.contentName === contentName
    );
    setContentParagraph(content.contentPara);
    setContentHeading(content.contentName);
    setContentDialog(true);
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="show"
      className={`${styles.paddings} py-8 relative font-poppins`}
    >
      <div className="footer-gradient" />
      <div className={`${styles.innerWidth} mx-auto flex flex-col gap-8`}>
        <div className="flex flex-col">
          <div className="mb-[50px] h-[2px]  bg-white opacity-10" />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-white">
              <h4 className="font-extrabold text-[24px]">Future Focals</h4>
              <div className="flex flex-row text-[12px] gap-4 underline text-secondary-white">
                <button onClick={() => extractData("Privacy Policy")}>
                  Privacy Policy
                </button>
                <button onClick={() => extractData("Terms and Conditions")}>
                  Terms & Conditions
                </button>

                <Dialog
                  open={contentDialog}
                  onClose={() => setContentDialog(false)}
                >
                  <div className="bg-black">
                    <div className="p-4 font-poppins glassmorphism-sidebar overflow-x-hidden text-white">
                      <h4 className="font-extrabold text-[24px] text-center">
                        {contentHeading}
                      </h4>

                      <p
                        className="text-justify"
                        dangerouslySetInnerHTML={{ __html: contentParagraph }}
                      />
                  <DialogActions>
                    <button
                      onClick={() => setContentDialog(false)}
                      className="bg-orange-700 font-bold px-4 py-2 rounded-md"
                    >
                      Close
                    </button>
                  </DialogActions>
                    </div>
                  </div>
                </Dialog>
              </div>
            </div>
            <p className="font-normal text-[14px] text-white opacity-50">
              Copyright © 2023 FutureFocals. All rights reserved
            </p>
            <div className="flex gap-4">
              {socials.map((social, index) => (
                <img
                  key={index}
                  src={social.url}
                  alt={social.name}
                  className="w-[24px] h-[24px] object-contain cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
