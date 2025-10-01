import nodemailer from "nodemailer";
import db from "@/utils/db";
export async function GET(request) {
    const collection = await db.collection("users");
    let emailsofUsers = await collection.find().toArray(); //get all users
    emailsofUsers =[...emailsofUsers].filter(user => user.role==="user").map(user => user.email); //get all emails of users with role user
    console.log(emailsofUsers)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER, // your Gmail address
          pass: process.env.GMAIL_PASS, // your Gmail App Password
        },
      });
  
      // Send the email
      emailsofUsers.forEach(async (email) =>{
          const info = await transporter.sendMail({
            from: "hello@gmail.com", // (sender or support mail)
            to: email, //  (user email or recipient)
            subject: "Upcoming events coming soon",
            text: "Upcoming events coming soon",
            html: `<p>${"Upcoming events coming soon"}</p>`,
          });  
      })
  return Response.json(emailsofUsers);
}