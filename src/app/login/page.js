import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Login from "@/components/Login";
export default async function RegisterPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/"); // logged in users go home
  }

  return <Login />; // your client component
}
