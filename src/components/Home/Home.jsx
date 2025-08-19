
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi"

// Ensure you have your Unsplash access key set in the .env file
// Example: YOUR_UNSPLASH_ACCESS_KEY="your_access_key_here"
// Make sure to restart your development server after adding the .env file


export default function Home() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [query, setQuery] = useState("nature");
  const [page, setPage] = useState(1); // 🔹 current page
  const [loading, setLoading] = useState(false);
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // Vite (CRA => process.env.REACT_APP_UNSPLASH_ACCESS_KEY)


  // Fetch images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=12&client_id=${accessKey}`
      );
      const data = await res.json();

      // Append new images if loading more
      if (page === 1) {
        setImages(data.results);
      } else {
        setImages((prev) => [...prev, ...data.results]);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Initial & on search/page change
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const input = e.target.search.value.trim();
    if (input) {
      setQuery(input);
      setPage(1); // reset page when new search
    }
  };

  return (
    <div className="p-4">
      {/* 🔎 Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex justify-center">
        <input
          type="text"
          name="search"
          placeholder="Search images..."
          className="border p-2 rounded-l-md w-64"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded-r-md"
        >
          Search
        </button>
      </form>

      {/* 🖼️ Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group cursor-pointer"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img.urls.small}
              alt={img.alt_description}
              className="w-full h-64 object-cover rounded-md shadow-md"
            />
            <a
              href={`${img.links.download}?force=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 rounded-md text-sm opacity-80 group-hover:opacity-100 transition"
            >
              Download
            </a>
          </div>
        ))}
      </div>

      {/* 🔽 Load More */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More"}
        </button>

      </div>
        <div className="w-full text-center">
          {/* Display search results */}

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

    </div>
  );
}

































