import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between flex-wrap py-2 px-4 border-b-2 border-accentDarkSecondary  sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <nav className="w-full md:w-auto mx-auto text-center flex flex-wrap items-center justify-between md:justify-center gap-4 md:gap-x-24 font-bold uppercase py-2">
        <Link href={"/"} className="text-2xl sm:text-3xl md:text-4xl text-light dark:text-light">
          Sanity CMS
          <span className="text-2xl sm:text-3xl md:text-4xl ml-3  text-primary">
             Blog Application
          </span>
        </Link>
        <div className="flex w-full md:w-auto justify-center md:justify-end gap-4 mt-2 md:mt-0">
          {/* Uncomment and add more links as needed */}
          {/* <Link href={"/blogs"} className="bg-accentDarkSecondary px-4 py-1 rounded-lg text-dark">Blogs</Link> */}
        </div>
      </nav>
      <ThemeToggle />
    </header>
  );
}
