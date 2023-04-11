import Link from "next/link";
import { useRouter } from "next/router";

function ActiveLink({ href, styles, children, ...props }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  const activeStyles = isActive ? "flex items-center gap-5 pl-4 pt-3 pb-2.5 bg-orange-400 rounded-lg text-white text-md m-2" : styles;

  return (
    <Link href={href} {...props} className={activeStyles}>
      {children}
    </Link>
  );
}

export default ActiveLink;
