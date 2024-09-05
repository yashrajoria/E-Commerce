import clientPromise from "@/lib/mongodb";

export async function getAdminEmails() {
  try {
    const client = await clientPromise;
    const db = client.db(); // Specify the database name if needed: client.db('your-database-name');
    const usersCollection = db.collection("users");

    const admins = await usersCollection
      .find({}, { projection: { _id: 0, email: 1 } }) // Explicitly include/exclude fields
      .toArray();
    return admins.map((admin) => admin.email);
  } catch (error) {
    console.error("Failed to get admin emails:", error);
    throw new Error("Could not retrieve admin emails.");
  }
}

// Assuming this function gets admin IDs from the database
export async function getAdminIds() {
  const client = await clientPromise;
  const db = client.db();
  const admins = await db.collection("users").find({}).toArray(); // Adjust the collection name if needed

  return admins.map((admin) => admin.storeId); // Return only the admin IDs
}
