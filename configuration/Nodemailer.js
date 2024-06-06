import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "khange221133@gmail.com",
    pass: "ogbq scme kaml zaut",
  },
});

export async function sendEmail(email, subject, text) {
  console.log(email, subject, text, "this is the data");
  try {
    await transporter.sendMail({
      from: "khange221133@gmail", // Sender address
      to: email, // Recipient address
      subject: subject,
      text: text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
