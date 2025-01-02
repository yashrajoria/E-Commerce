import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const SearchResults = () => {
  const router = useRouter();
  const { q } = router.query;
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (q) {
      const fetchSearchResults = async () => {
        try {
          const searchResult = await axios.get(
            `/api/search?q=${encodeURIComponent(q)}`
          );
          setSearchResults(searchResult.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchSearchResults();
    }
  }, [q]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Search Results for "<span className="text-blue-500">{q}</span>"
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {searchResults.length}{" "}
          {searchResults.length === 1 ? "Result" : "Results"} found
        </p>

        {searchResults.length > 0 ? (
          <ProductsGrid products={searchResults} />
        ) : (
          <p className="text-center text-red-500">No products found.</p>
        )}
      </div>
    </>
  );
};

export default SearchResults;
