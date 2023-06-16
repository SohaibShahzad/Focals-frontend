import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative text-center flex flex-col font-poppins items-center justify-center h-screen text-white">
      <div className="gradient-03" />
      <div className="gradient-02" />
      <h1 className="text-[100px] font-bold">404</h1>
      <h2 className="text-2xl px-5">
        The page you are looking for doesn't exist or has been removed.
      </h2>
      <h2 className="text-2xl px-5">Please return to homepage.</h2>
        <Link href="/" className="bg-orange-700 hover:bg-orange-500 rounded-lg z-30 mt-5 px-6 py-2 text-2xl font-bold">
            Go to homepage
        </Link>
    </div>
  );
}
