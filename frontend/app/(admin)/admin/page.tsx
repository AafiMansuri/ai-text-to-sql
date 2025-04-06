"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface User {
  uid: string
  email: string
  first_name: string
  last_name: string
  role: string
  created_at: string
  updated_at: string
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`)
      if (!res.ok) throw new Error("Failed to fetch users")

      const data = await res.json()
      setUsers(data)
      console.log(data)
    } catch (err:any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (user_uid: string, newRole: string) => {

    try {
      const user = users.find((user) => user.uid === user_uid);
      if (!user) return;

      const updatedUserData = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: newRole,
        updated_at: new Date().toISOString(),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user_uid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user role");
    }

    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.uid === user_uid ? { ...u, role: newRole } : u))
    );
    
    console.log("User role updated successfully");

    } catch (error) {
      console.error("Error updating user role:", error);
    }
  }

  const handleDeleteUser = async (user_uid: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user_uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.uid !== user_uid));

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        
        <Button onClick={fetchUsers} disabled={loading} variant="outline">  
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid}>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {/* Convert to Admin Button */}
                  {user.role === "User" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Make Admin</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to make <b>{user.first_name}</b> an Admin? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRoleChange(user.uid, "Admin")}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {/* Delete Button */}
                  {user.role !== "Admin" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-red-600 text-white">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteUser(user.uid )}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}

export default Admin
