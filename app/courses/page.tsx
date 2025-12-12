"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Course } from "@/lib/types";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/courses");
      setCourses(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat data mata kuliah");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-gray-800">Mata Kuliah</h1>
        <Link
          href="/courses/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Tambah Mata Kuliah
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
          placeholder="Cari berdasarkan Kode atau Nama Mata Kuliah..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-900"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {course.courseCode}
                </h3>
                <p className="text-gray-600">{course.courseName}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                {course.credits} SKS
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>Semester: {course.semester}</p>
              <p>Dosen: {course.lecturerName}</p>
              <div className="flex items-center justify-between">
                <span>Kapasitas:</span>
                <span
                  className={
                    course.currentEnrollment >= course.maxCapacity
                      ? "text-red-600 font-semibold"
                      : "text-green-600"
                  }
                >
                  {course.currentEnrollment} / {course.maxCapacity}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
              <Link
                href={`/courses/${course.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Detail
              </Link>
              <Link
                href={`/enrollments/create?courseId=${course.id}`}
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
              >
                Enroll
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada data mata kuliah
        </div>
      )}
    </div>
  );
}
