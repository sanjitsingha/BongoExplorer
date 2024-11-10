"use client";
import { React, useState, useEffect } from "react";
import { Client, Databases, Query } from "appwrite";
import CardContainerSkeleton from "./CardSkeleton";
import Card from "./Card";
import { Filter, X } from "lucide-react";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

// Define your categories - you can move this to a config file
const CATEGORIES = [
  "Hills",
  "River",
  "Picnic Spot",
  "Off Beat",
  "Waterfall"
];

const CardContainer = () => {
  const [place, setPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [NumberofDocuments, setNumberofDocuments] = useState("");
  const [FilterDiv, setFilterDiv] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        let queries = [Query.orderDesc("$createdAt"),
          Query.equal("Active", true)

        ];
        
        // Add category filter if categories are selected
        if (selectedCategories.length > 0) {
          queries.push(Query.search("Categories", selectedCategories.join(" ")));
        }

        const response = await databases.listDocuments(
          "671e7595000efb31b37a",
          "671e75a1001a8d6feb6c",
          queries
        );
        setPlace(response.documents);
        setNumberofDocuments(response.total);
      } catch (error) {
        console.error("Failed to fetch places:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [selectedCategories]); // Add selectedCategories as dependency

  if (isLoading) {
    return <CardContainerSkeleton />;
  }

  const filteredPlaces = place.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Search Bar */}
      <div className="flex items-center justify-center">
        <div className="bg-[#C6CCB2] border-2 rounded-lg w-[90%] h-[50px] flex overflow-hidden mt-4 mb-10">
          <input
            type="text"
            placeholder="Enter your keywords(Locations name)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full outline-none border-none bg-transparent px-4 py-2 text-[#093824] placeholder:text-[#093824]"
          />
        </div>
      </div>

      {/* Category Filters */}
      {FilterDiv && (
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
                onClick={clearFilters}
                className="flex items-center gap-1 py-2 px-4 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <X size={16} /> Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {error && <div className="text-red-500 text-center mb-4">The server are bussy</div>}

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[#093824] text-lg font-bold">Newly Discovered</h1>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFilterDiv(!FilterDiv)} 
            className="flex items-center gap-1 text-[#093824] hover:opacity-80 transition-all"
          >
            <Filter color="#093824" size={20} />
            Filter {selectedCategories.length > 0 && `(${selectedCategories.length})`} |
          </button>
          <p className="text-[#093824]">
            {filteredPlaces.length} Locations Found
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-clip p-3 md:p-0">
        {filteredPlaces.map((place) => (
          <Card key={place.slug} place={place} />
        ))}
      </div>
    </div>
  );
};

export default CardContainer;