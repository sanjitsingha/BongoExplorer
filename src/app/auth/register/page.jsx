"use client";
import { React, useState } from "react";
import { registerUser } from "../auth";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const router = useRouter();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [Error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const notify = () => toast("Account created successfully!");

  const togglePasswordVisibility = () => {
    showPassword ? setShowPassword(false) : setShowPassword(true);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = await registerUser(Email, Password, Name);
      console.log("User registered:", user);
      notify();
      router.push("/auth/login");

      // Optionally, redirect to login page
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className=" h-screen flex justify-center items-center w-[100vw]">
      <div className="w-[350px]">
        <form onSubmit={handleRegister} className="">
          <h1 className="text-xl font-bold">Sign up to Bongo Explore</h1>
          <p className="mt-10">Name</p>
          <input
            type="text"
            value={Name}
            className="bg-gray-200  w-full h-[50px] py-1 px-2 text-lg outline-none   mt-4"
            onChange={(e) => setName(e.target.value)}
          />
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
              Create Account
            </button>
            <ToastContainer />
            {Error && <p style={{ color: "red" }}>{Error}</p>}
          </div>
        </form>
        <p className="mt-10 text-center">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
