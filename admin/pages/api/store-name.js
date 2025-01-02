import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  // Get session
  // const session = await getSession({ req });
  // console.log("Session object:", session);
  // console.log(session?.user?.email);

  // if (!session) {
  //   console.log("No session or email found");
  //   return res.status(401).json({ error: "Not authenticated" });
  // }

  // Authorization Logic
  // const userEmail = session.user.email;
  const userEmail = "yashrajoria@gmail.com";

  if (!userEmail) {
    return res.status(401).json({ error: "No email found in session" });
  }

  // Handle different request methods
  if (req.method === "GET") {
    // Get the store information
    const store = await db.collection("users").findOne({ email: userEmail });

    return res.status(200).json({ storeName: store ? store.storeName : null });
  }

  if (req.method === "POST") {
    // Extract the store name from the request body
    const { storeName } = req.body;

    if (!storeName) {
      return res.status(400).json({ error: "Store name is required" });
    }

    // Update or create the user's store name based on the email
    await db.collection("users").updateOne(
      { email: userEmail }, // Use email for matching
      { $set: { storeName: storeName } }, // Update the store name
      { upsert: true } // Create if not exists
    );

    return res.status(200).json({ success: true });
  }

  // Method Not Allowed
  res.status(405).end();
}
