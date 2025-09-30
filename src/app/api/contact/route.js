import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    // Extract the sender email and question from the request body
    const { email, question } = await req.json();

    if (!email || !question) {
      return new Response(
        JSON.stringify({ success: false, message: "Email and question are required" }),
        { status: 400 }
      );
    }

    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_PASS, // your Gmail App Password
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: email, // the user's email (sender)
      to: "sougataghar47@yahoo.com", // your support email (recipient)
      subject: "New Contact Form Message",
      text: question,
      html: `<p>${question}</p>`,
    });

    console.log("Email sent:", info.messageId);

    return new Response(
      JSON.stringify({ success: true, message: "Question sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to send question" }),
      { status: 500 }
    );
  }
}
