import db from "@/utils/db";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, email, password } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    const collection = db.collection("users");

    // Prepare the update object
    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password; // only update if provided

    // Update user
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" } // return the updated document
    );
    console.log(result)
    if (!result) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({...result}), { status: 200 });
  } catch (err) {
    console.error("Error updating user:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
