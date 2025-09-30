"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname,useRouter } from "next/navigation";
import { toast } from "react-toastify";
export default function EventCard({ event, setEvents }) {
  const {data:session} =  useSession();
  const path = usePathname();
  const router = useRouter();
  console.log(path)
  const handleDelete = () => {
    fetch(process.env.NEXT_PUBLIC_URL + "/api/events/delete?" + event._id, {
      method: "DELETE", // important
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setEvents((prev) => prev.filter((a) => a._id !== event._id));
          toast.success("Deleted event successfully")
        }
      })
      .catch((err) => toast.error("Delete failed"));
  };

  return (
    <div 
    className="flex flex-col justify-between p-4 shadow rounded-lg h-full cursor-pointer" 
    onClick={()=> path==="/events"?router.push('/events/'+event._id):null}>
      <p className="font-black mb-4">{event.title}</p>
      {(session?.user?.role==="admin" && path ==="/admin/events") && <div className="flex gap-4">
<Link
  href={`/admin/events/${event._id}`}
  className="inline-block bg-orange-500 w-40 py-2 text-white rounded-md text-center"
>
  Edit
</Link>


        <button
          onClick={handleDelete}
          className="bg-red-500 w-40 py-2 text-white rounded-md"
        >
          Delete
        </button>
      </div>}
    </div>
  );
}
