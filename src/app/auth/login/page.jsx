"use client";
import { React, useState } from "react";
import { loginUser } from "../auth";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { account } from "@/app/appwrite/appwrite.config";
import { useRouter, usePathname } from "next/navigation";

const page = () => {
  const router = useRouter();
  const notify = () => toast("Account created successfully!");

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    showPassword ? setShowPassword(false) : setShowPassword(true);
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      await account.get();
      console.log("User is already logged in.");
    } catch (error) {
      try {
        const user = await account.createEmailPasswordSession(Email, Password);
        notify();
        router.push("/");
        // Optionally, redirect to login page
      } catch (err) {
        setError(err.message);
      }
    }
  };
  return (
    <div className=" h-screen flex justify-center items-center w-[100vw]">
      <div className="w-[350px]">
        <form onSubmit={loginUser} className="">
          <h1 className="text-xl font-bold">Login to Bongo Explore</h1>

          <p className="mt-10">Email</p>
          <input
            type="email"
            value={Email}
            className="bg-gray-200 w-full  h-[50px] py-1 px-2 text-lg outline-none   mt-4"
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="mt-10">Password</p>
          <div className="bg-gray-200 w-full h-[50px] py-1 px-2 text-lg outline-none  flex items-center justify-between  mt-4">
            <input
              type={showPassword ? "text" : "password"}
              value={Password}
              className="w-full h-full outline-none bg-transparent"
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <Eye
                className="cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <EyeOff
                className="cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-500 w-full text-white h-[50px] p-2 mt-8 "
            >
              Login
            </button>
            {Error && <p style={{ color: "red" }}>{Error}</p>}
          </div>
        </form>
        <p className="mt-4 text-center">Forgot your password?</p>
      </div>
    </div>
  );
};

export default page;
