import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useState } from "react";
// import { Loader } from "@/components/ui/loader";
import { Alert } from "@/components/ui/alert";

export default function Settings() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    storeName: "",
  });
  const [isEditingStoreName, setIsEditingStoreName] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    // Fetch user data from the API
    axios.get("/api/users").then((response) => {
      setUserData(response.data[0]); // Assuming the first user from the array
      setNewStoreName(response.data[0]?.storeName || "");
    });
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      // Hide the alert after 5 seconds
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 5000);

      // Cleanup timeout if the component unmounts before the timer finishes
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleStoreNameChange = (e) => {
    setNewStoreName(e.target.value);
  };

  const handleUpdateStoreName = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/store-name", { storeName: newStoreName });
      setUserData((prevData) => ({ ...prevData, storeName: newStoreName }));
      setUpdateSuccess(true);
    } catch (error) {
      console.error("Error updating store name:", error);
      setUpdateSuccess(false);
    } finally {
      setIsLoading(false);
      setIsEditingStoreName(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          User Information
        </h1>
        <div className="flex justify-center mb-6">
          <img
            src={userData.image}
            className="rounded-full object-cover"
            alt="User Image"
            style={{ width: 120, height: 120 }}
          />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <Input
                type="text"
                name="name"
                value={userData.name}
                readOnly
                id="name"
                onChange={handleChange}
                autoComplete="given-name"
                className="mt-1 block w-full bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                type="text"
                name="email"
                value={userData.email}
                id="email"
                readOnly
                onChange={handleChange}
                autoComplete="email"
                className="mt-1 block w-full bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="storeName"
                className="block text-sm font-medium text-gray-700"
              >
                Store Name
              </label>
              <Input
                type="text"
                name="storeName"
                value={isEditingStoreName ? newStoreName : userData.storeName}
                id="storeName"
                onChange={
                  isEditingStoreName ? handleStoreNameChange : handleChange
                }
                autoComplete="organization"
                className="mt-1 block w-full"
                readOnly={!isEditingStoreName}
              />
            </div>
          </div>

          <div className="flex justify-center mt-4">
            {isLoading ? (
              <div className="flex items-center space-x-2 text-gray-700">
                <span className="text-lg">Loading...</span>
                <span>Updating...</span>
              </div>
            ) : (
              <>
                {updateSuccess && (
                  <Alert type="success" className="w-full mb-4">
                    Store name updated successfully!
                  </Alert>
                )}
                <Button
                  className="bg-blue-600 text-white rounded-md"
                  type="button"
                  onClick={
                    isEditingStoreName
                      ? handleUpdateStoreName
                      : () => setIsEditingStoreName(true)
                  }
                  variant={isEditingStoreName ? "primary" : "success"}
                >
                  {isEditingStoreName ? "Update Store Name" : "Edit Store Name"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
