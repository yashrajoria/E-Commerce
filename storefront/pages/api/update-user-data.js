import bcrypt from "bcrypt";
import { mongooseConnect } from "@/lib/mongoose";
import { StoreUsers } from "@/models/StoreUsers";

async function handler(req, res) {
  console.log(req.body);

  try {
    await mongooseConnect();
    const { new_email, new_password, new_name, user_id, address } = req.body;

    // Validate input
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Check if user exists by user_id
    const user = await StoreUsers.findOne({ user_id });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    let errors = [];
    let updateFields = {};

    // Handle new password
    if (new_password && new_password.trim() !== "") {
      const isMatch = await bcrypt.compare(new_password, user.password);

      if (isMatch) {
        errors.push("The new password must be different from the current one.");
      } else {
        const hashedPassword = await bcrypt.hash(new_password, 10);
        updateFields.password = hashedPassword;
      }
    }

    // Handle new email
    if (new_email && new_email.trim() !== "") {
      if (new_email === user.email) {
        errors.push(
          "The new email address must be different from the current one."
        );
      } else {
        updateFields.email = new_email;
      }
    }

    // Handle new name
    if (new_name && new_name.trim() !== "") {
      if (new_name === user.full_name) {
        errors.push("The new name must be different from the current one.");
      } else {
        updateFields.full_name = new_name;
      }
    }

    // Handle new address
    if (address && typeof address === "object") {
      const currentAddress = user.address || {};

      const normalizedAddress = {
        address_line_1: currentAddress.address_line_1 || "",
        address_line_2: currentAddress.address_line_2 || "",
        city: currentAddress.city || "",
        postal_code: currentAddress.postal_code || "",
        state: currentAddress.state || "",
        country: currentAddress.country || "",
      };

      if (
        address.address_line_1 !== normalizedAddress.address_line_1 ||
        address.address_line_2 !== normalizedAddress.address_line_2 ||
        address.city !== normalizedAddress.city ||
        address.postal_code !== normalizedAddress.postal_code ||
        address.state !== normalizedAddress.state ||
        address.country !== normalizedAddress.country
      ) {
        updateFields.address = address;
      } else {
        errors.push("The new address must be different from the current one.");
      }
    }

    // Return errors if any
    if (errors.length > 0) {
      return res.status(422).json({ errors });
    }

    console.log(updateFields);

    // Update user if there are fields to update
    if (Object.keys(updateFields).length > 0) {
      const updateResult = await StoreUsers.updateOne(
        { user_id },
        { $set: updateFields }
      );
      console.log("Update Result:", updateResult);

      if (updateResult.matchedCount === 0) {
        return res
          .status(404)
          .json({ error: "No matching user found to update." });
      } else if (updateResult.modifiedCount === 0) {
        return res.status(200).json({
          message:
            "No changes were made. The fields might be the same or not provided.",
        });
      } else {
        return res.status(200).json({ message: "User updated successfully." });
      }
    } else {
      return res.status(200).json({ message: "No fields were updated." });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
}

export default handler;
