import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="px-5 sticky top-0 z-10 bg-red flex items-center justify-between mt-[55px]">
      <div className="flex items-center gap-3">
        <Image src="/logo/logo.png" alt="logo" width={32} height={32} />
        <h1 className="font-extrabold text-xl">Tux31337</h1>
      </div>
      <nav className="flex gap-8">
        <Link href="/" className="text-blog-light-gray-100 font-medium">
          Home
        </Link>
        <Link
          href="/posts"
          className="relative text-center text-black font-medium after:content-[''] after:block after:w-full after:h-[2px] after:bg-blog-primary-blue after:absolute after:-bottom-[2.5px]"
        >
          Blog
        </Link>
        <Link href="/projects" className="text-blog-light-gray-100 font-medium">
          Projects
        </Link>
        <Link href="/resume" className="text-blog-light-gray-100 font-medium">
          Resume
        </Link>
      </nav>
      <ul>
        <li>item들</li>
      </ul>
    </header>
  );
}
