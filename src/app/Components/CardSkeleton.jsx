import React from "react";

const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    {/* Image skeleton */}
    <div className="aspect-video bg-gray-200" />
    {/* Content skeleton */}
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

const CardContainerSkeleton = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Search Bar Skeleton */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-200 rounded-lg w-[90%] h-[50px] mb-10 mt-4 animate-pulse" />
      </div>
      <div className="h-12  flex items-center justify-center gap-4">
        <div className="bg-gray-200 py-1 h-8 px-4 rounded-xl  animate-pulse "/>
        <div className="bg-gray-200 py-1 h-8 px-4 rounded-xl  animate-pulse "/>
        <div className="bg-gray-200 py-1 h-8 px-4 rounded-xl  animate-pulse "/>
        <div className="bg-gray-200 py-1 h-8 px-4 rounded-xl  animate-pulse "/>
      </div>

      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-5 px-3 md:px-0">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
      </div>

      

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-clip p-3 md:p-0">
        {[...Array(8)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default CardContainerSkeleton;
