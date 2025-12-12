export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: "admin" | "student" | "lecturer";
}

export interface Student {
  nim: string;
  name: string;
  email: string;
  major: string;
  angkatan: number;
  photo?: string;
  documents?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  credits: number;
  semester: number;
  maxCapacity: number;
  currentEnrollment: number;
  lecturerId: string;
  lecturerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: number;
  nim: string;
  courseId: number;
  semester: string;
  academicYear: string;
  status: "active" | "completed" | "dropped";
  enrolledAt: string;
  course?: Course;
  student?: Student;
}

export interface Grade {
  id: number;
  nim: string;
  courseId: number;
  semester: string;
  academicYear: string;
  quizScore?: number;
  assignmentScore?: number;
  midtermScore?: number;
  finalScore?: number;
  finalGrade?: number;
  letterGrade?: string;
  gpa?: number;
  status: "draft" | "final";
  createdAt: string;
  updatedAt: string;
  course?: Course;
  student?: Student;
}

export interface Transcript {
  nim: string;
  studentName: string;
  major: string;
  grades: Grade[];
  semesterGPA: number;
  cumulativeGPA: number;
  totalCredits: number;
}
