"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Enrollment } from "@/lib/types";

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get("/api/enrollments");
      setEnrollments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat data enrollment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan enrollment ini?")) return;

    try {
      await api.delete(`/api/enrollments/${id}`);
      setEnrollments(enrollments.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal membatalkan enrollment");
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Data Enrollment</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                NIM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Mata Kuliah
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Semester
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Tahun
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {enrollment.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {enrollment.nim}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {enrollment.course?.courseCode} -{" "}
                  {enrollment.course?.courseName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {enrollment.semester}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {enrollment.academicYear}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      enrollment.status === "active"
                        ? "bg-green-100 text-green-800"
                        : enrollment.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {enrollment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDelete(enrollment.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Batalkan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {enrollments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data enrollment
          </div>
        )}
      </div>
    </div>
  );
}
