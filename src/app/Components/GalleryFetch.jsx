"use client";
import React from "react";
import Card from "./Card";
import { Client, Databases, Query } from "appwrite";
import { useState, useEffect } from "react";

const GalleryFetch = ({slug}) => {
  const [gallery, setGallery] = useState([]);
  const [images, setImages] = useState({});

  useEffect(() => {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    const databases = new Databases(client);

    databases.listDocuments("671e7595000efb31b37a", "671e75a1001a8d6feb6c",
        [
            Query.equal('slug', slug)
           ]
    )
      .then((response) => {
        setGallery(response.documents);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  setImages(gallery[0].Images)
//   setImages(gallery[0])
  


  return (
    <div>

    </div>
  );
};

export default GalleryFetch;
