"use client";
import { React, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, User, Settings, LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../auth/authprovider";

const Dropdown = ({ isOpen, setIsOpen, children, trigger }) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer"
      >
        {trigger}
      </div>

      {/* Dropdown */}
      <div
        className={`absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-in-out transform ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-[-10px] pointer-events-none"
        }`}
      >
        <div className="py-1">{children}</div>
      </div>
    </div>
  );
};

// Dropdown item component
const DropdownItem = ({ icon: Icon, label, onClick, className = "" }) => (
  <div
    className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${className}`}
    onClick={onClick}
  >
    {Icon && <Icon className="w-4 h-4 mr-3" />}
    {label}
  </div>
);

const Navbar = () => {
  const { user, logout, isLoading } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="relative max-w-[1200px] mx-auto">
        <div className="flex flex-col justify-center items-center w-full fixed border-b z-40 border-white bg-white bg-opacity-20 top-0 left-0 backdrop-blur-md">
          <div className="flex justify-between items-center md:w-[1200px] w-[90%] max-w-[1200px] pt-4 pb-4">
            <div className="text-xl font-bold">
              <Link href="/">BE</Link>
            </div>
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-[1200px] mx-auto">
      <div className="flex flex-col justify-center items-center w-full fixed border-b z-40 border-white bg-white bg-opacity-20 top-0 left-0 backdrop-blur-md">
        <div className="flex justify-between items-center md:w-[1200px] w-[90%] max-w-[1200px] pt-4 pb-4">
          <div className="text-xl font-bold">
            <Link href="/">BE</Link>
          </div>

          {user ? (
            <Dropdown
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              trigger={
                <>
                  <p className="font-semibold">Hi, {user.name}</p>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </>
              }
            >
              <Link href="/profile">
                <DropdownItem icon={User} label="Profile" />
              </Link>

              <Link href="/settings">
                <DropdownItem icon={Settings} label="Settings" />
              </Link>

              <div className="h-[1px] bg-gray-200 my-1" />

              <DropdownItem
                icon={LogOut}
                label="Logout"
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-50"
              />
            </Dropdown>
          ) : (
            <div className="bg-[#093824] text-white py-1 px-3 rounded-sm">
              <Link href={"/auth/login"}>Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
