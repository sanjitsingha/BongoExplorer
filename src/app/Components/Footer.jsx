'use client'

import {React, useState} from "react";
import Link from 'next/link'
import {Twitter} from 'lucide-react'
import { Client, Databases, ID } from "appwrite";

const Footer = () => {
  const [email, setemail] = useState('')
  const [message, setMessage] = useState('')
    // appwrite config (Craeating document of email)

    const handleSubmit = async(e)=>{
      e.preventDefault();

      try {
        const client = new Client()
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
  
      const databases = new Databases(client);
  
      await databases
        .createDocument("671e7595000efb31b37a", "672708b00037ecc545aa",
          ID.unique(),
          {email: email}
        );
        setMessage('Thank you for subscribing!');
        setemail(''); // Clear the input field after successful submission

        
      } catch (error) {
        setMessage('Failed to subscribe. Please try again later.');
      }

    };
  return (



    <div className="w-full h-fit flex flex-col items-center justify-center mt-[100px] lg:mt-[200px] bg-[#093824]">
      <div className="lg:w-[1200px] max-w-[1200px] py-10  flex">
        <div className="w-[0%] md:w-[30%] flex  items-center"> 
          
          <div className="hidden md:block lg:block">
            <div className="text-3xl">BE</div>
            {/* <div>EST:2024</div> */}
          </div>

          
        </div>
        <div className=" w-[100%] md:w-[70%]">
          <div className="menu grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 text-white ">

            <Link href='/'>Home</Link>
            <Link href='/'>About Us</Link>
            <Link href='/'>Contact Us</Link>
            <Link href='/'>Support</Link>
           
          </div>
          {/* newsletter */}
          <div className="mt-5 text-white">
              <p>Subscribe to our NewLetter</p>
              <div className="mt-3">
                <form onSubmit={handleSubmit}>
                  
              <input 
              type="email" 
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
              className="md:w-[40%] w-[60%] bg-[#C6CCB2] outline-none p-2 text-[#093824]"/>

              <button type="submit" className="bg-[#0938] p-2 px-6">Submit</button>
                </form>
                {message && <p>{message}</p>}
              </div>
          </div>
          {/* Social Media Links */}
        <div className="w-fit mt-3 rounded-[4px] text-white h-8 border-b-2 border-white cursor-pointer flex  gap-6 pl-5 pr-5 items-center"> <div>Follow us on  </div> <Link href="/" > <Twitter />  </Link></div>
        </div>
      </div>

      <div className="bg-[#0938] w-full py-3 flex items-center justify-center text-white">

       <div className="w-[1200px] max-w-[1200px] text-center">
        <p>
        © 2024 Bongo Explorer. All Rights Reserved.
        </p>
       </div>
      </div>
    </div>
  );
};

export default Footer;
