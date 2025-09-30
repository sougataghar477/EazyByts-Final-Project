import db from "@/utils/db";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });

    const collection = db.collection("users");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ id, message: "User deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error("Error deleting user:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
