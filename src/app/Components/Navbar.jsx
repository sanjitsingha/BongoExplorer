"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

import { ChevronDown } from "lucide-react";

const Navbar = () => {
  return (
    <>
      <div className="relative max-w-[1200px] mx-auto">
        <div className="flex  flex-col justify-center items-center w-full fixed border-b z-40 border-white  bg-white bg-opacity-20 top-0 left-0 backdrop-blur-md transition duration-300 ease-in-out">
          <div className="flex justify-between items-center w-[1200px] max-w-[1200px] pt-4 pb-4 ">
            <div className="text-xl font-bold">
              <Link href="/">BE</Link>
            </div>

            <div className="flex items-center gap-2 cursor-pointer">
              <p className="font-semibold">Hii,</p>
              <ChevronDown />
            </div>

            <div className="bg-[#093824] text-white py-1 px-3 rounded-sm">
              <Link href={"/auth/login"}>Login</Link>
            </div>
          </div>
        </div>

        <div className=" bg-white w-[300px] hidden z-50 fixed top-[60px] shadow-md right-[180px] p-3">
          <div className="flex flex-col gap-2">
            <div>Profile</div>
            <div>Profile</div>
            <div>Profile</div>
            <div className="w-full bg-black text-white text-center py-2 cursor-pointer">
              <button>Log out</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
