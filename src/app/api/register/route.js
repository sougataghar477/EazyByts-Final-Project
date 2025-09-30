import db from "@/utils/db";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    // select collection (assuming db is already connected to the right database)
    const collection = db.collection("users");

    // insert document
    const result = await collection.insertOne({...body,role:"user"});

    return Response.json(
      { success: true, insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting user:", error);
    return Response.json(
      { success: false, message: "Failed to register user" },
      { status: 500 }
    );
  }
}
