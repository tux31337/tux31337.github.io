"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

export default function Header() {
  const pathname = usePathname();

  const navItem = [
    {
      href: "/",
      name: "Home",
      id: "home",
      isActivate: pathname === "home" ? true : false,
    },
    {
      href: "/posts",
      name: "Blog",
      id: "posts",
      isActivate: pathname === "/posts" ? true : false,
    },
    {
      href: "/projects",
      name: "Projects",
      id: "projects",
      isActivate: pathname === "/projects" ? true : false,
    },
    {
      href: "/resume",
      name: "Resume",
      id: "resume",
      isActivate: pathname === "/resume" ? true : false,
    },
  ];

  const linkClassName = "relative text-blog-light-gray-100 font-medium";
  const activateLinkClassName =
    "after:content-[''] after:block after:w-full after:h-[2px] after:bg-blog-primary-blue after:absolute after:-bottom-[2.5px]";

  return (
    <header className="px-5 sticky top-0 z-10 bg-red flex items-center justify-between mt-[55px]">
      <div className="flex items-center gap-3">
        <Image src="/logo/logo.png" alt="logo" width={32} height={32} />
        <h1 className="font-extrabold text-xl">Tux31337</h1>
      </div>
      <nav className="flex gap-8">
        {navItem.map((item) => {
          const isActivate = item.href === pathname;

          return (
            <Link
              href={item.href}
              className={cn([
                linkClassName,
                isActivate && activateLinkClassName,
              ])}
              key={item.id}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      <ul>
        <li>item들</li>
      </ul>
    </header>
  );
}
