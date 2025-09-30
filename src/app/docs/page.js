import Link from "next/link";

export default function Docs(){
    return <>
    <div className="shadow p-4 rounded-lg mb-4">
        <p className="text-2xl">How to edit a booking?</p>
        <p>Simply go to <Link className="underline" href={"/events/booked"}>booked events</Link> and click on a booked event card.A modal form would open and then edit in the form and press on 
         <code className="bg-gray-200 mx-2">Edit</code>button</p>
    </div>
    <div className="shadow p-4 rounded-lg mb-4">
        <p className="text-2xl">How to delete a booking?</p>
        <p>Simply go to <Link className="underline" href={"/events/booked"}>booked events</Link> and click on a booked event card.A modal form would open and then edit in the form and press on 
         <code className="bg-gray-200 mx-2">Delete</code>button</p>
    </div>

    </>
}