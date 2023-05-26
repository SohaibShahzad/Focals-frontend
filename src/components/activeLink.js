import Link from "next/link";
import { useRouter } from "next/router";

function ActiveLink({ href, styles, children, ...props }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  const activeStyles = isActive ? "flex items-center gap-5 pl-4 py-3 bg-[#f3993f] rounded-lg text-black text-lg m-2" : styles;

  return (
    <Link href={href} {...props} className={activeStyles}>
      {children}
    </Link>
  );
}

export default ActiveLink;
