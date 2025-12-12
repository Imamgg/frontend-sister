"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Grade } from "@/lib/types";
import Link from "next/link";

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await api.get("/api/grades");
      setGrades(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat data nilai");
    } finally {
      setLoading(false);
    }
  };

  const finalizeGrade = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin memfinalisasi nilai ini?")) return;

    try {
      await api.post(`/api/grades/${id}/finalize`);
      fetchGrades(); // Refresh data
      alert("Nilai berhasil difinalisasi!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal memfinalisasi nilai");
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
        <h1 className="text-3xl font-bold text-gray-800">Data Nilai</h1>
        <Link
          href="/grades/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Input Nilai
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                NIM
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Mata Kuliah
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Quiz
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Tugas
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                UTS
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                UAS
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Akhir
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Huruf
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {grades.map((grade) => (
              <tr key={grade.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{grade.nim}</td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {grade.course?.courseCode}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {grade.quizScore || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {grade.assignmentScore || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {grade.midtermScore || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {grade.finalScore || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 font-semibold">
                  {grade.finalGrade?.toFixed(2) || "-"}
                </td>
                <td className="px-4 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded font-semibold ${
                      grade.letterGrade === "A"
                        ? "bg-green-100 text-green-800"
                        : grade.letterGrade === "B"
                        ? "bg-blue-100 text-blue-800"
                        : grade.letterGrade === "C"
                        ? "bg-yellow-100 text-yellow-800"
                        : grade.letterGrade === "D"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {grade.letterGrade || "-"}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      grade.status === "final"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {grade.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm space-x-2">
                  {grade.status === "draft" && (
                    <>
                      <Link
                        href={`/grades/${grade.id}/edit`}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => finalizeGrade(grade.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Finalisasi
                      </button>
                    </>
                  )}
                  {grade.status === "final" && (
                    <span className="text-gray-400">Locked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {grades.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data nilai
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link
          href="/grades/transcript"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-block"
        >
          Lihat Transkrip Nilai
        </Link>
      </div>
    </div>
  );
}
