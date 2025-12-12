"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Transcript } from "@/lib/types";

export default function TranscriptPage() {
  const [nim, setNim] = useState("");
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTranscript = async () => {
    if (!nim) {
      setError("NIM harus diisi");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/api/grades/student/${nim}/transcript`);
      setTranscript(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat transkrip");
      setTranscript(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Transkrip Nilai</h1>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              placeholder="Masukkan NIM Mahasiswa"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-900"
            />
          </div>
          <button
            onClick={fetchTranscript}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:bg-blue-300"
          >
            {loading ? "Loading..." : "Cari"}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>

      {transcript && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {transcript.studentName}
            </h2>
            <p className="text-gray-600">NIM: {transcript.nim}</p>
            <p className="text-gray-600">Jurusan: {transcript.major}</p>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">IPK</p>
              <p className="text-2xl font-bold text-blue-600">
                {transcript.cumulativeGPA?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total SKS</p>
              <p className="text-2xl font-bold text-green-600">
                {transcript.totalCredits}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-gray-600">Mata Kuliah</p>
              <p className="text-2xl font-bold text-purple-600">
                {transcript.grades.length}
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Riwayat Nilai
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Kode
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Mata Kuliah
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    SKS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Semester
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Nilai
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Huruf
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Bobot
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transcript.grades.map((grade) => (
                  <tr key={grade.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {grade.course?.courseCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {grade.course?.courseName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {grade.course?.credits}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {grade.semester} {grade.academicYear}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                      {grade.finalGrade?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">
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
                        {grade.letterGrade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {grade.gpa?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
