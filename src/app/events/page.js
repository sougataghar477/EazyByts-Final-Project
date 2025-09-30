import EventCard from "@/components/EventCard";
import FilterDropdown from "@/components/FilterDropdown";

export default async function Events({ searchParams }) {
  // Fetch filtered events from API
let key,value;
if(searchParams && Object?.entries(await searchParams).length>0){
  const [a,b] = Object?.entries(await searchParams)?.[0];
  key = a;
  value = b;
}  

const res = await fetch(
  `${process.env.NEXT_PUBLIC_URL}/api/events?${key}=${value}`,
  { cache: "no-store" } // always get fresh data
);
  const data = await res.json();
  const events = data?.events || [];

  console.log("Fetched events:", data);

  return (
    <>
    <h1 className="font-black text-4xl mb-4">Events</h1>
      <FilterDropdown />
      <div className="grid md:grid-cols-4 gap-4">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event._id} event={event} />)
        ) : (
          <p className="col-span-4 text-center text-gray-500">No events found.</p>
        )}
      </div>
    </>
  );
}
