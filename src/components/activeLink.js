import { useRouter } from "next/router";

function ActiveLink({ href, styles, children, onClick, ...props }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  const activeStyles = isActive ? "flex items-center gap-5 pl-4 py-3 bg-[#f3993f] rounded-lg text-black text-lg m-2" : styles;

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a href={href} {...props} className={activeStyles} onClick={handleClick}>
      {children}
    </a>
  );
}

export default ActiveLink;
