import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import axios from "axios";

export default function Settings() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
  });

  useEffect(() => {
    // Fetch user data from the API
    axios.get("/api/users").then((response) => {
      setUserData(response.data[0]); // Assuming the first user from the array
      console.log(response.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Layout>
      <form>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h1 className="text-blue-900 text-xl font-bold mb-2 text-center">
              User Information
            </h1>
            <div className="flex justify-center">
              <img
                src={userData.image}
                className="rounded-full object-cover"
              ></img>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    readOnly
                    id="name"
                    onChange={handleChange}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    value={userData.email}
                    id="name"
                    readOnly
                    onChange={handleChange}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
}
