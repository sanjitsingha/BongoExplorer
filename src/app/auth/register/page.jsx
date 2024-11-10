"use client";
import { React, useState } from "react";
import { registerUser } from "../auth";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = await registerUser(email, password, name);
      console.log("User registered:", user);
      // Optionally, redirect to login page
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center">
      <div className="w-[1200px] flex">
        <div className="left flex-[40%] bg-emerald-400"></div>
        <div className="right flex-[60%] pt-[120px] p-6 ">
          <form onSubmit={handleRegister}>
            <h1 className="text-2xl">Create a account</h1>
            <p className="">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem,
              sapiente.
            </p>
            <p>Full Name</p>
            <input
              type="text"
              value={name}
              placeholder="Enter you full name"
              className="bg-gray-200 w-[60%] h-[40px] py-1 px-2 text-lg outline-none rounded-md placeholder:text-sm mt-1"
              onChange={(e) => setName(e.target.value)}
            />
            <p className="mt-3">Email</p>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              className="bg-gray-200 w-[60%] h-[40px] py-1 px-2 text-lg outline-none rounded-md placeholder:text-sm mt-1"
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-3">Email</p>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              className="bg-gray-200 w-[60%] h-[40px] py-1 px-2 text-lg outline-none rounded-md placeholder:text-sm mt-1"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 mt-2 "
              >
                Create Account
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
