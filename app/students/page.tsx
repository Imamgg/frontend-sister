"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Student } from "@/lib/types";
import Link from "next/link";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/api/students");
      setStudents(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteStudent = async (nim: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus mahasiswa ini?")) return;

    try {
      await api.delete(`/api/students/${nim}`);
      setStudents(students.filter((s) => s.nim !== nim));
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menghapus mahasiswa");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Mahasiswa</h1>
        <Link
          href="/students/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Tambah Mahasiswa
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan NIM, Nama, atau Jurusan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-900"
        />
      </div>

      <div className="bg-white shadow-md rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                NIM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Jurusan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Angkatan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.nim} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.nim}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.major}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.angkatan}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Link
                    href={`/students/${student.nim}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Detail
                  </Link>
                  <Link
                    href={`/students/${student.nim}/edit`}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteStudent(student.nim)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data mahasiswa
          </div>
        )}
      </div>
    </div>
  );
}
