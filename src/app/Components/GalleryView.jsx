"use client";
import { React, useState, useEffect } from "react";
import { Client, Databases, Query } from "appwrite";


const GalleryView = ({details}) => {
  const [Images, setImages] = useState([]);

  useEffect(() => {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    const databases = new Databases(client);

    databases
      .getDocument("671e7595000efb31b37a", "671e75a1001a8d6feb6c", 
        [
            Query.equal('Name', 'Mirik')
        ]
    )

      .then((response) => {
        // setImages(response.documents[0].Images);
        console.log(response)
      })
      .catch((error) => {
        console.log(error);
      });
    // console.log(Images);
  }, []);

  return <div>GalleryView</div>; 
  
  

};

export default GalleryView;
