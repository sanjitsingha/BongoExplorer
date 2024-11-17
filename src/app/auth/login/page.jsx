"use client";
import { React, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { account } from "@/app/appwrite/appwrite.config";
import { useRouter, usePathname } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../../auth/authprovider";
import Link from "next/link";

const page = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    showPassword ? setShowPassword(false) : setShowPassword(true);
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await account.get();
      console.log("User is already logged in.");
    } catch (error) {
      try {
        await login(Email, Password);
        router.push("/");
      } catch (err) {
        setError("Invalid email or password");
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
        <Link href="/auth/register">
          <p className="mt-4 text-center font-bold">Create an account</p>
        </Link>
      </div>
    </div>
  );
};

export default page;
