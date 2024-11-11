"use client";
import { React, useState, useEffect, useMemo } from "react";
import { Client, Databases, Query } from "appwrite";
import CardContainerSkeleton from "./CardSkeleton";
import Card from "./Card";
import { Filter, X } from "lucide-react";

const APPWRITE_CONFIG = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: "671e7595000efb31b37a",
  collectionId: "671e75a1001a8d6feb6c",
};

const CATEGORIES = ["Hills", "River", "Picnic Spot", "Off Beat", "Waterfall"];

const ITEMS_PER_PAGE = {
  MOBILE: 4,
  DESKTOP: 8,
};

const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

const databases = new Databases(client);

const CardContainer = () => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE.DESKTOP);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setVisibleItems(mobile ? ITEMS_PER_PAGE.MOBILE : ITEMS_PER_PAGE.DESKTOP);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true);
        const queries = [
          Query.orderDesc("$createdAt"),
          Query.equal("Active", true),
          ...(selectedCategories.length > 0
            ? [Query.search("Categories", selectedCategories.join(" "))]
            : []),
        ];

        const response = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collectionId,
          queries
        );

        setPlaces(response.documents);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch places:", error);
        setError("Unable to load locations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [selectedCategories]);

  const filteredPlaces = useMemo(() => {
    if (!searchTerm) return places;

    return places.filter((item) =>
      item.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [places, searchTerm]);

  const visiblePlaces = useMemo(() => {
    return filteredPlaces.slice(0, visibleItems);
  }, [filteredPlaces, visibleItems]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLoadMore = () => {
    setVisibleItems(
      (prev) =>
        prev + (isMobile ? ITEMS_PER_PAGE.MOBILE : ITEMS_PER_PAGE.DESKTOP)
    );
  };

  if (isLoading) {
    return <CardContainerSkeleton />;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Search Bar */}
      <div className="flex items-center justify-center">
        <div className="bg-[#C6CCB2] border-2 rounded-lg w-[90%] h-[50px] flex overflow-hidden mt-4 mb-10">
          <input
            type="text"
            placeholder="Enter your keywords (Location name)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full outline-none border-none bg-transparent px-4 py-2 text-[#093824] placeholder:text-[#093824]"
          />
        </div>
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`py-2 px-6 rounded-xl transition-all duration-200 ${
                  selectedCategories.includes(category)
                    ? "bg-[#093824] text-white"
                    : "bg-[#C6CCB2] text-[#093824] hover:bg-[#093824] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="flex items-center gap-1 py-2 px-4 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <X size={16} /> Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center mb-4 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[#093824] text-lg font-bold">Newly Discovered</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-[#093824] hover:opacity-80 transition-all"
          >
            <Filter color="#093824" size={20} />
            Filter{" "}
            {selectedCategories.length > 0 &&
              `(${selectedCategories.length})`}{" "}
            |
          </button>
          <p className="text-[#093824]">
            {filteredPlaces.length} Locations Found
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-clip p-3 md:p-0">
        {visiblePlaces.map((place) => (
          <Card key={place.slug} place={place} />
        ))}
      </div>

      {/* Discover More Button */}
      {visibleItems < filteredPlaces.length && (
        <div className="flex justify-center mt-8 mb-12">
          <button
            onClick={handleLoadMore}
            className="bg-[#093824] text-white px-8 py-3 rounded-xl hover:opacity-90 transition-all"
          >
            Discover More
          </button>
        </div>
      )}
    </div>
  );
};

export default CardContainer;
