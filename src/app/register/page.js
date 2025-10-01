import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Register from "@/components/Register";
export default async function RegisterPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/"); // logged in users go home
  }

  return <Register />; // your client component
}
