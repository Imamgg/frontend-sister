"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            SIAKAD
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded">
              Dashboard
            </Link>
            <Link
              href="/students"
              className="hover:bg-blue-700 px-3 py-2 rounded"
            >
              Mahasiswa
            </Link>
            <Link
              href="/courses"
              className="hover:bg-blue-700 px-3 py-2 rounded"
            >
              Mata Kuliah
            </Link>
            <Link
              href="/enrollments"
              className="hover:bg-blue-700 px-3 py-2 rounded"
            >
              Enrollment
            </Link>
            <Link
              href="/grades"
              className="hover:bg-blue-700 px-3 py-2 rounded"
            >
              Nilai
            </Link>

            <div className="border-l border-blue-500 h-8 mx-2"></div>

            <div className="flex items-center space-x-3">
              <span className="text-sm">{user.fullName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
