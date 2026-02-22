//Logo in the left
//Menu in the right
//Profile Icon and Notification on the right
//Signup/Login Icon on the right if not loggedin
//fixed on the top but dissappear when scroll down more than certain height, reappear when scroll up
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../Button";

interface NavbarProps {
  children?: React.ReactNode;
  className?: string;
}
export const Navbar = ({ children, className }: NavbarProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 160) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const baseNavbarClass =
    "fixed top-0 left-0 w-full z-50 h-16 px-4 sm:px-6 lg:px-8 border-b border-ui-border bg-ui-bg/80 backdrop-blur-md transition-transform duration-300 ease-in-out flex items-center justify-between";
  return (
    <nav
      className={twMerge(
        baseNavbarClass,
        isVisible ? "translate-y-0" : "-translate-y-full",
        className,
      )}
    >
      {children}
    </nav>
  );
};

//takes img to render logo
interface NavLogoProps {
  logo?: string;
  name?: string;
}
export const NavLogo = ({ logo, name = "thinking_out_loud" }: NavLogoProps) => {
  return (
    <div className="flex items-center gap-2 shrink-0 cursor-pointer group">
      {logo ? (
        <img src={logo} alt="logo" className="h-8 w-auto" />
      ) : (
        <div className="h-8 w-8 bg-ui-accent rounded-md flex items-center justify-center shrink-0">
          <span className="text-ui-bg text-xs font-bold">
            {name[0].toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};
export const NavGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="hidden md:flex items-center justify-center gap-8 flex-1 px-8">
      {children}
    </div>
  );
};

export const NavItem = ({
  label,
  href = "#",
}: {
  label: string;
  href?: string;
}) => {
  return (
    <a
      href={href}
      className="text-sm font-medium text-ui-secondary hover:text-ui-accent transition-colors"
    >
      {label}
    </a>
  );
};

export const NavActions = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div className="flex items-center justify-end gap-4 shrink-0">
      {isLoggedIn ? (
        <>
          <button className="text-ui-secondary hover:text-ui-primary transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-ui-secondary cursor-pointer" />
        </>
      ) : (
        <>
          <Button size="sm" variant="outline">
            Log in
          </Button>
          <Button size="sm" variant="outline">
            Sign up
          </Button>
        </>
      )}
    </div>
  );
};
