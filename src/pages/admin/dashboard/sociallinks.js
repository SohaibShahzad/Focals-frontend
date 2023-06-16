import axios from "axios";
import SocialLinksPanel from "../../../sections/adminPanelSections/adminSocials";

export default function AdminSocialLinks({ socialLinks }) {
    return <SocialLinksPanel socialLinks={socialLinks} />;
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}socials/getAllSocialLinks`
  );
  const socialLinks = res.data;
  return {
    props: {
      socialLinks,
    },
  };
}
