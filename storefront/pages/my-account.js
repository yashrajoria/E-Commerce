import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { mongooseConnect } from "@/lib/mongoose";
import { StoreUsers } from "@/models/StoreUsers";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MyAccount({ user }) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    address_line_1: "",
    address_line_2: "",
    city: "",
    postal_code: "",
    state: "",
    country: "",
  });
  const [prev_address, setPrevAddress] = useState({
    address_line_1: "",
    address_line_2: "",
    city: "",
    postal_code: "",
    state: "",
    country: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    setPrevAddress({
      address_line_1: user?.address?.address_line_1,
      address_line_2: user?.address?.address_line_2,
      city: user?.address?.city,
      postal_code: user?.address?.postal_code,
      state: user?.address?.state,
      country: user?.address?.country,
    });
  }, [user]);

  const validateEmail = (email) => {
    // Basic email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const updateProfileData = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (email && !validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    if (name || email || password) {
      setLoading(true);
      const response = await fetch("/api/update-user-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_name: name,
          new_email: email,
          new_password: password,
          user_id: session?.user?.user_id,
        }),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setSuccess("Profile updated successfully.");
        setError("");
        // Optionally clear the input fields
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "An error occurred.");
        setSuccess("");
      }
    }
  };
  const updateAddress = async (address) => {
    setLoading(true);

    const fields = [
      { name: "Address Line 1", value: address.address_line_1 },
      { name: "Address Line 2", value: address.address_line_2 },
      { name: "City", value: address.city },
      { name: "Postal Code", value: address.postal_code },
      { name: "State", value: address.state },
      { name: "Country", value: address.country },
    ];

    const emptyFields = fields
      .filter((field) => field.value.trim() === "")
      .map((field) => field.name);

    if (emptyFields.length > 0) {
      toast({
        title: "Failed!!❌",
        description: `Please fill in the following address field(s): ${emptyFields.join(
          ", "
        )}`,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/update-user-data", {
        address,
        user_id: session?.user?.user_id,
      });

      // Handle success response
      if (response.status === 200) {
        toast({
          title: "Success! ✅",
          description: "Your address has been updated successfully.",

          style: {
            backgroundColor: "#4CAF50",
            color: "#FFFFFF",
            padding: "16px",
            borderRadius: "8px",
            fontSize: "16px",
          },
        });
      } else if (response.status === 422) {
        toast({
          title: "Failed!!❌",
          description: "Please check your address and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        title: "Failed!!❌",
        description: "Failed to update address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 md:p-8 bg-orange-600 text-white shadow-lg rounded-lg flex-grow mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">
          My Account Details
        </h1>
        {session ? (
          <div>
            <p className="text-lg mb-4 md:mb-6 text-center">
              Welcome, {session.user.name}
            </p>
            <div className="mt-6">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Existing Profile Data
              </h2>
              <div className="flex flex-row gap-4">
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  placeholder="Change Name"
                  value={user?.full_name}
                  disabled
                />
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  placeholder="Change Email"
                  value={user?.email}
                  disabled
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Edit Profile
              </h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {success && <p className="text-green-500 mb-4">{success}</p>}
              <Input
                className="mb-4 text-gray-900 rounded-md w-full"
                placeholder="Change Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                className="mb-4 text-gray-900 rounded-md w-full"
                placeholder="Enter your new email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex flex-row gap-4">
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button
                onClick={updateProfileData}
                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-md transition duration-200"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile Data"}
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start mt-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                  Previous Address
                </h2>
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  placeholder="Address Line 1"
                  value={prev_address.address_line_1}
                  disabled
                />
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  placeholder="Address Line 2"
                  value={prev_address.address_line_2}
                  disabled
                />
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  type="text"
                  placeholder="City"
                  value={prev_address.city}
                  disabled
                />
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  type="text"
                  placeholder="Postal Code"
                  value={prev_address.postal_code}
                  disabled
                />
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  type="text"
                  placeholder="State"
                  value={prev_address.state}
                  disabled
                />
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  type="text"
                  placeholder="Country"
                  value={prev_address.country}
                  disabled
                />
              </div>

              <div className="w-full md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                  New Address
                </h2>
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  placeholder="Address Line 1"
                  value={address.address_line_1}
                  onChange={(e) =>
                    setAddress({ ...address, address_line_1: e.target.value })
                  }
                />
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  placeholder="Address Line 2"
                  value={address.address_line_2}
                  onChange={(e) =>
                    setAddress({ ...address, address_line_2: e.target.value })
                  }
                />
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  type="text"
                  placeholder="Postal Code"
                  value={address.postal_code}
                  onChange={(e) =>
                    setAddress({ ...address, postal_code: e.target.value })
                  }
                />
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
                <Input
                  className="mb-4 text-gray-900 rounded-md w-full"
                  type="text"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              onClick={() => updateAddress(address)}
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-md transition duration-200 mt-6"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Address"}
            </Button>
          </div>
        ) : (
          <p className="text-lg text-center">You are not signed in.</p>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const session = await getSession(context);
  const user_id = session?.user?.user_id;

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/", // Redirect to sign-in page if not authenticated
        permanent: false,
      },
    };
  }

  try {
    const user = await StoreUsers.findOne({ user_id });
    console.log({ user });

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      props: {
        user: [],
      },
    };
  }
}
