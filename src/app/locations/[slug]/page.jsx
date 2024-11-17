"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Client, Databases, Query } from "appwrite";
import { useContext } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { AuthContext } from "@/app/auth/authprovider";
import client from "@/app/appwrite/appwrite.config";

export default function Page({ params }) {
  const [LocationDetail, setLocationDetail] = useState();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useContext(AuthContext);
  console.log(user);

  const { slug } = React.use(params);

  // const checkBookMark = async () => {
  //   const databases = new Databases(client);
  //   if (isBookmarked) {
  //     const bookmark = await databases.listDocuments(
  //       "671e7595000efb31b37a",
  //       "671e75a1001a8d6feb6c",
  //       [
  //         Query.equal("userId", user.$id),
  //         Query.equal("placeId", LocationDetail.$id),
  //       ]
  //     );
  //     if (bookmark.documents.length > 0) {
  //       await databases.deleteDocument(
  //         "671e7595000efb31b37a",
  //         "671e75a1001a8d6feb6c",
  //         bookmark.documents[0].$id
  //       );
  //       setIsBookmarked(false);
  //     }
  //   } else {
  //     // Add bookmark
  //     await databases.createDocument(
  //       "671e7595000efb31b37a",
  //       "671e75a1001a8d6feb6c",
  //       "unique()",
  //       {
  //         userId: user.$id,
  //         placeId: LocationDetail.$id,
  //       }
  //     );
  //     setIsBookmarked(true);
  //   }
  // };

  useEffect(() => {
    const checkInitialBookmarkStatus = async () => {
      if (!user || !LocationDetail) return;

      const databases = new Databases(client);
      try {
        const bookmark = await databases.listDocuments(
          "671e7595000efb31b37a",
          "673a40d50002cde3b6b9",
          [
            Query.equal("userId", user.$id),
            Query.equal("locationId", LocationDetail.$id),
          ]
        );
        setIsBookmarked(bookmark.documents.length > 0);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    checkInitialBookmarkStatus();
  }, [user, LocationDetail]);

  const handleBookmark = async () => {
    if (!user) {
      alert("Please log in to bookmark locations");
      return;
    }

    const databases = new Databases(client);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const bookmark = await databases.listDocuments(
          "671e7595000efb31b37a",
          "673a40d50002cde3b6b9",
          [
            Query.equal("userId", user.$id),
            Query.equal("locationId", LocationDetail.$id),
          ]
        );

        if (bookmark.documents.length > 0) {
          await databases.deleteDocument(
            "671e7595000efb31b37a",
            "673a40d50002cde3b6b9",
            bookmark.documents[0].$id
          );
          setIsBookmarked(false);
        }
      } else {
        // Add bookmark
        await databases.createDocument(
          "671e7595000efb31b37a",
          "673a40d50002cde3b6b9",
          "unique()",
          {
            userId: user.$id,
            locationId: LocationDetail.$id,
            locationName: LocationDetail.Name,
            createdAt: new Date().toISOString(),
          }
        );
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error managing bookmark:", error);
      alert("Error managing bookmark. Please try again.");
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.log("Error fetching weather data:", error);
    }
  };

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
        const location = response.documents[0];
        setLocationDetail(location);
        if (location?.Latitude && location?.Longitude) {
          fetchWeatherData(location.Latitude, location.Longitude);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  }, [slug]);

  console.log(LocationDetail);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
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
    <div className="flex items-center justify-center w-full min-h-screen px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1200px] mt-16 md:mt-20">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] mb-4">
            <div className="absolute py-2 flex justify-center items-center px-3 rounded-tl-lg right-0 bottom-0  bg-white ">
              {isBookmarked ? (
                <BookmarkCheck
                  color="green"
                  fill="green"
                  className="cursor-pointer"
                  onClick={handleBookmark}
                />
              ) : (
                <Bookmark className="cursor-pointer" onClick={handleBookmark} />
              )}
            </div>
            <img
              src={LocationDetail?.PreviewImage}
              alt={LocationDetail?.Name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Title and Date Section */}
          <div className="flex flex-col md:flex-row md:justify-between text-black mb-4 gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              {LocationDetail?.Name}
            </h1>
            <p className="text-sm">
              Last Updated on:{" "}
              {LocationDetail?.$updatedAt &&
                new Date(LocationDetail.$updatedAt).toDateString()}
            </p>
          </div>

          {/* Description and Weather Section */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <div className="flex-1">
              <p className="text-gray-700">{LocationDetail?.Descriptions}</p>
            </div>

            <div className="w-full lg:w-auto">
              <div className="flex items-center mb-2">
                <div className="font-bold">{LocationDetail?.Name}</div>
              </div>
              {/* Weather Module */}
              {weatherData ? (
                <div className="w-full lg:w-[250px] rounded-md overflow-hidden h-[100px] flex">
                  <div className="bg-emerald-300 p-2 px-4 flex flex-col items-center flex-1 lg:w-[150px] justify-center">
                    <div className="w-full text-center text-2xl font-bold">
                      {Math.round(weatherData.main.temp)}°
                    </div>
                    <div>{weatherData.weather[0].description}</div>
                  </div>
                  <div className="flex flex-col h-full w-[100px]">
                    <div className="bg-blue-700 flex-1 items-center justify-center flex text-white">
                      MAX: {Math.round(weatherData.main.temp_max)}°
                    </div>
                    <div className="bg-orange-300 flex-1 items-center justify-center flex">
                      MIN: {Math.round(weatherData.main.temp_min)}°
                    </div>
                  </div>
                </div>
              ) : (
                <p>Weather is Loading</p>
              )}
            </div>
          </div>
        </div>

        {/* Image Galleryy */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {LocationDetail?.Images?.map((imageUrl, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={imageUrl}
                  alt={`${LocationDetail?.Name} - Image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
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
                  className="absolute left-2 md:left-4 text-white hover:text-gray-300 z-50"
                >
                  <ChevronLeft size={32} className="md:w-10 md:h-10" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 md:right-4 text-white hover:text-gray-300 z-50"
                >
                  <ChevronRight size={32} className="md:w-10 md:h-10" />
                </button>
              </>
            )}

            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={LocationDetail?.Images[currentImageIndex]}
                alt={`${LocationDetail?.Name} - Image ${currentImageIndex + 1}`}
                className="max-h-[85vh] max-w-full object-contain"
              />

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {LocationDetail?.Images?.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
