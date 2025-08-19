import React, { useState, useEffect } from "react";
import {FiX} from "react-icons/fi"

// Ensure you have your Unsplash access key set in the .env file
// Example: YOUR_UNSPLASH_ACCESS_KEY="your_access_key_here"
// Make sure to restart your development server after adding the .env file

const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;


if (!import.meta.env.VITE_UNSPLASH_ACCESS_KEY) {
  console.error("YOUR_UNSPLASH_ACCESS_KEY is not set in .env file");
} // Ensure the access key is set



export default function ImageGallery() {

  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("nature"); // default search
  const [selectedImage, setSelectedImage] = useState(null);



  useEffect(() => {
    if (!accessKey) {
      console.error("Unsplash access key is not defined. Please check your .env file.");
      return;
    }
    // Fetch images from Unsplash API based on the search query
    fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=20&client_id=${accessKey}`)
      .then((res) => res.json())
      .then((data) => setImages(data.results))
      .catch((err) => console.error(err));
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const input = e.target.search.value;
    setQuery(input);
  };

  return (
    <div className="p-4">
      {/* 🔎 Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex justify-center">
        <input
          type="text"
          name="search"
          placeholder="Search images..."
          className="border p-2 rounded-l-md w-64 focus:outline-none border-blue-400"
        />
        <button type="submit" className="bg-blue-500 ring-2 cursor-pointer font-bold  text-white px-4 rounded-r-md">
          Search
        </button>
      </form>

      {/* 🖼️ Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id}
           className="relative group cursor-pointer"
            onClick={() => setSelectedImage(img)}
            >
            <img
              src={img.urls.small}
              alt={img.alt_description}
              className="w-full h-64 object-cover rounded-md shadow-md"
            />
            {/* ⬇️ Download Button */}
            <a
              href={`${img.links.download}?force=true`}
              target="_blank"
              rel="noopener noreferrer"
               onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 rounded-md text-sm opacity-80 group-hover:opacity-100 transition"
            >
              Download
            </a>
          </div>
        ))}
        <div>
          {images.length === 0 && (
            <p className="text-center text-gray-500">No images found. Try a different search.</p>
          )}
        </div>
        <div className="w-full text-center">
          <button
            onClick={() => setQuery("nature")} // Reset to default search
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 cursor-pointer hover:bg-blue-600 transition"  
          >
            Load Nature Images
          </button>
        </div>
        <div className="w-full text-center">

          <div>
            <p className="text-center text-gray-500 mt-4">
              Search results for: <span className="font-bold">{query}</span>
            </p>
          </div>
          <button>
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-4 block text-center"
            >
              Powered by Unsplash
            </a>
          </button>
        </div>
      </div>




      {/* 📌 Modal */}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-lg p-12 max-w-3xl w-[90] h-[90] relative"
            onClick={(e) => e.stopPropagation()} // prevent closing on content click
          >
            {/* Close Button */}
            <FiX
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl cursor-pointer"
              onClick={() => setSelectedImage(null)}
            />


            {/* Large Image */}
            <img
              src={selectedImage.urls.regular}
              alt={selectedImage.alt_description}
              className="w-full max-h-[80vh] object-contain rounded-md"
            />

            {/* Photographer Info */}
            <div className="mt-4 text-sm text-gray-700">
              Photo by{" "}
              <a
                href={selectedImage.user.links.html}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {selectedImage.user.name}
              </a>{" "}
              on Unsplash
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ Image Thumbnails */}
      {/* <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img) => (
          <div
            key={img.id} className="cursor-pointer" onClick={() => setSelectedImage(img)}>

            <img
              src={img.urls.thumb}
              alt={img.alt_description}
              className="w-full h-24 object-cover rounded-md shadow-sm hover:shadow-lg transition"
            />
          </div>
        ))}
      </div> */}

    </div >
  );
}

