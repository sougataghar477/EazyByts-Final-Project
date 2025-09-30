import { ToastContainer, toast } from 'react-toastify';
export default function UserCard({ user, setIsModalOpen, setIndexOfEditedUser, index, onDelete }) {
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${user.email}?`)) return;

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user._id }),
      });

      if (!res.ok) {toast.error("Failed to delete user");throw new Error("Failed to delete user")};

      const deletedUser = await res.json();
      toast.success("Deleted user:", deletedUser);

      // Call the parent handler to remove from frontend
      onDelete(user._id);
    } catch (err) {
      toast.error("Error deleting user:", err);
       
    }
  };

  return (
    <div className="shadow p-4 rounded-lg">
      <p><b>ID:</b> {user?._id}</p>
      <p><b>Email:</b> {user?.email}</p>
      <p><b>Password:</b> {user?.password}</p>
      <div className="flex gap-4">
        <button
          onClick={() => { setIsModalOpen(true); setIndexOfEditedUser(index); }}
          className={"bg-green-500 text-white px-4 py-1 rounded border " + (user?.role === "admin" ? "pointer-events-none" : "")}
        >
          Edit
        </button>   
        <button
          onClick={handleDelete}
          className={"bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 " + (user?.role === "admin" ? "pointer-events-none" : "")}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
