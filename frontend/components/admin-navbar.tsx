import Link from "next/link"
import { Button } from "@/components/ui/button"
import ThemeToggle from "./theme-toggle"

const AdminNavbar = () => {
  return (
    <header className="border-b sticky top-0 z-10 bg-background">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Side - Title */}
        <h1 className="text-xl font-bold tracking-tight">Velora</h1>

        {/* Center - Navigation */}
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link href="/chat">
                <Button variant="ghost">Chat</Button>
              </Link>
            </li>
            <li>
              <Link href="/admin">
                <Button variant="ghost">Manage Users</Button>
              </Link>
            </li>
            <li>
              <Link href="/admin/create-user">
                <Button variant="ghost">Create User</Button>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Side - Theme Toggle & Logout */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline">Logout</Button>
        </div>
      </div>
    </header>
  )
}

export default AdminNavbar
