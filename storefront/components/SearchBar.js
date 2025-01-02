import { Input } from "./ui/input";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Search } from "lucide-react";

const SearchBar = () => {
  const router = useRouter();
  const [searchItem, setSearchItem] = useState("");

  const handleSearch = async () => {
    // if (searchItem.trim() === "") {
    //   console.log("Search input is empty");
    //   return;
    // }

    // try {
    //   const searchResult = await axios.get(
    //     `/api/search?q=${encodeURIComponent(searchItem)}`
    //   );
    //   console.log(searchResult.data);
    // } catch (err) {
    //   console.error(err);
    // }
    router.push(`/search?q=${searchItem}`);
  };

  return (
    <div className="flex relative  items-center space-x-2">
      <Input
        type="search"
        placeholder="Search"
        onChange={(e) => setSearchItem(e.target.value)}
      />
      <Search
        className="text-red-500  absolute right-3"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
