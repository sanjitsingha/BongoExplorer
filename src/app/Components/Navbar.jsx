import React from "react";
import Link from "next/link";
import PrimaryButton from './primary_button'
import LoginPage from "../pages/Login";

const Navbar = () => {
  return (
    <div className="flex justify-center items-center w-full fixed border-b z-40 border-white  bg-white bg-opacity-20 top-0 left-0 backdrop-blur-md transition duration-300 ease-in-out">
      <div className="flex justify-between items-center w-[1200px] max-w-[1200px] pt-4 pb-4 ">
        <div className="text-xl font-bold">
          <Link
          href="/">
          BE
          </Link>
        </div>
        <div className="justify-around items-center align-middle gap-10 flex">
          {/* <Link href="aboutus">About Us</Link>
          <Link href="">Privacy Policy</Link>
          <Link href="aboutus">Future Plan</Link> */}
        </div>
        <div>
          {/* <PrimaryButton href='../pages/Register.jsx' props="Login"/> */}
          <Link
          href={LoginPage}
          >
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
