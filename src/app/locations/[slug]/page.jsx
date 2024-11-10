"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Client, Databases, Query } from "appwrite";
import { X, ChevronLeft, ChevronRight, Dot } from "lucide-react"; // Using lucide icons
import WeatherModule from "../../openweather/page";

export default function Page({ params }) {
  // const updatedDate = params.$updatedAt;

  const [LocationDetail, setLocationDetail] = useState();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { slug } = React.use(params);
  useEffect(() => {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    const databases = new Databases(client);

    databases
      .listDocuments("671e7595000efb31b37a", "671e75a1001a8d6feb6c", [
        Query.equal("slug", slug),
      ])
      .then((response) => {
        return setLocationDetail(response.documents[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    // Restore scrolling
    document.body.style.overflow = "unset";
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (LocationDetail?.Images?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === LocationDetail.Images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (LocationDetail?.Images?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? LocationDetail.Images.length - 1 : prev - 1
      );
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case "ArrowRight":
          nextImage(e);
          break;
        case "ArrowLeft":
          prevImage(e);
          break;
        case "Escape":
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, LocationDetail?.Images?.length]);

  return (
    <div className="flex items-center justify-center  w-full ">
      {/* <WeatherModule props={LocationDetail} /> */}
      <div className=" h-screen w-[1200px] max-w-[1200px]  mt-20">
        {/* Hero Section */}
        <div className="mb-8">
          <img
            src={LocationDetail?.PreviewImage}
            alt={LocationDetail?.Name}
            className=" w-[1200px] h-[400px] items-center object-cover rounded-lg mb-4"
          />
          <div className="flex justify-between text-black">
            <h1 className="text-3xl font-bold mb-4">{LocationDetail?.Name}</h1>
            <p className="text-sm">
              Last Updated on :{" "}
              {LocationDetail?.$updatedAt &&
                new Date(LocationDetail.$updatedAt).toDateString()}
            </p>
          </div>
          <div className="flex gap-60">
            <div>
              {" "}
              <p className="text-gray-700">{LocationDetail?.Descriptions}</p>
            </div>

            <div>
              <div className="flex items-center ">
                <div className="font-bold">{LocationDetail?.Name} </div>
              </div>
              {/* Report Module */}
              <div className="w-fit rounded-md overflow-hidden h-[100px]  flex">
                {/* Today Weather */}
                <div className="bg-emerald-300 p-2 px-4 flex flex-col items-center w-[150px] justify-center">
                  <div className="w-full text-center text-2xl font-bold">
                    32°
                  </div>
                  <div>Sunny</div>
                </div>
                <div className=" flex flex-col h-full w-[100px]">
                  <div className="bg-blue-700 flex-1 items-center justify-center flex">
                    MAX: 43°
                  </div>
                  <div className="bg-orange-300 flex-1 items-center justify-center flex">
                    MIN: 12°
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {LocationDetail?.Images?.map((imageUrl, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={imageUrl}
                  alt={`${LocationDetail.Name} - Image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
            >
              <X size={24} />
            </button>

            {LocationDetail?.Images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 text-white hover:text-gray-300 z-50"
                >
                  <ChevronLeft size={40} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 text-white hover:text-gray-300 z-50"
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}

            <div
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={LocationDetail?.Images[currentImageIndex]}
                alt={`${LocationDetail?.Name} - Image ${currentImageIndex + 1}`}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
                {currentImageIndex + 1} / {LocationDetail?.Images?.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
