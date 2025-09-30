"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserCard from "@/components/UserCard";
import { toast } from "react-toastify";
import Link from "next/link";
export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [indexOfEditedUser, setIndexOfEditedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  //  Redirect if not logged in or not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else if (session.user.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  //   Fetch users
  useEffect(() => {
    if (!session || session.user.role !== "admin") return;

    async function fetchUsers() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/users", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [session]);

  //  Open modal with selected user data
  const openEditModal = (index) => {
    setIndexOfEditedUser(index);
    setFormData({
      email: users[index].email || "",
      password: users[index].password || "",
    });
    setIsModalOpen(true);
  };

  //   Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //   Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (indexOfEditedUser === null) return;

    const userId = users[indexOfEditedUser]._id;

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/users/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, ...formData }),
      });

      const updatedUser = await res.json();

      // update local list
      const updatedUsers = [...users];
      updatedUsers[indexOfEditedUser] = updatedUser;
      setUsers(updatedUsers);

      setIsModalOpen(false);
      toast.success("User updated successfully");
    } catch (err) {
      toast.error("Error updating user");
    }
  };

  // Delete user locally
  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user._id !== id));
  };

  if (status === "loading" || loading) return <p>Loading users...</p>;

  return (
    <>
      <h1 className="text-4xl mb-4 font-black">
        <Link href={"/"}>Admin</Link>
        <>{" > Users" }</>
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {users.map((user, index) => (
          <UserCard
            key={index}
            user={user}
            index={index}
            setIsModalOpen={() => openEditModal(index)}
            setIndexOfEditedUser={setIndexOfEditedUser}
            onDelete={handleDeleteUser}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <dialog
          open
          className="p-4 rounded-lg shadow-lg w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Edit User</h2>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}
