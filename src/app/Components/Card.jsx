import Link from "next/link";
import { useState } from "react";

const Card = ({ place }) => {
  const [metadesc, setmetadesc] = useState("");

  const getTrimmedDescription = (description) => {
    if (!description) return "";
    return description.length > 100
      ? description.slice(0, 100) + "..."
      : description;
  };

  const trimmedDescription = getTrimmedDescription(place?.Descriptions);

  return (
    <div className=" h-fit bg-[#D6FFD2] hover:scale-105 transition-all">
      <img
        className=" h-[150px] lg:h-[200px] w-full object-cover  object-center"
        src={place.PreviewImage}
        alt=""
      />
      <div className="">
        <div className="flex justify-between items-center mt-2">
          <div className="text-md lg:text-lg px-1 md:px-2">{place.Name}</div>
          <div className="text-xs px-2">Mountain</div>
        </div>
        <p name="description" className="text-sm opacity-70 px-2">
          {trimmedDescription}
        </p>
        <div className="mt-2">
          <Link
            className="bg-[#093824] w-full h-[40px]  flex justify-center items-center text-white"
            type="button"
            href={`/locations/${place.slug}`}
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
