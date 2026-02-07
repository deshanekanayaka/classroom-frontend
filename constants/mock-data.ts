import type { Subject } from "../types";

// Centralized mock data for Subjects used across the app
export const mockSubjects: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    description:
      "Foundational concepts of computing, algorithms, data, and problem-solving using a high-level language.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: "MATH201",
    name: "Linear Algebra",
    department: "Mathematics",
    description:
      "Vectors, matrices, linear transformations, eigenvalues/eigenvectors, and applications to data and graphics.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    code: "BIO150",
    name: "General Biology",
    department: "Biology",
    description:
      "Core principles of cellular biology, genetics, evolution, and ecology with laboratory demonstrations.",
    createdAt: new Date().toISOString(),
  },
];
