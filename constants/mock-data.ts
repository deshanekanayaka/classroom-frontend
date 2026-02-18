// Mock data for Teachers and Subjects
// Subjects: id (number), name (string), code (uppercase, shortened from name)
// Teachers: id (number), name (string)

// Helper: derive a short uppercase code from a subject name
const codeFromName = (name: string): string => {
  const stopWords = new Set(["and", "of", "the", "to", "for", "in", "on", "a", "an"]);
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    // Single word -> first 4 letters (common convention like MATH, PHYS)
    return words[0].slice(0, 4).toUpperCase();
  }

  // Multi-word -> acronym from non-stop words (e.g., Computer Science -> CS)
  const significant = words.filter(w => !stopWords.has(w.toLowerCase()));
  const base = (significant.length ? significant : words)
    .map(w => w[0])
    .join("")
    .toUpperCase();

  // Keep it reasonably short (max 6 chars)
  return base.slice(0, 6);
};

export const mockSubjects = [
  { id: 1, name: "Mathematics", code: codeFromName("Mathematics") },
  { id: 2, name: "English", code: codeFromName("English") },
  { id: 3, name: "Physics", code: codeFromName("Physics") },
  { id: 4, name: "Chemistry", code: codeFromName("Chemistry") },
  { id: 5, name: "Biology", code: codeFromName("Biology") },
  { id: 6, name: "Computer Science", code: codeFromName("Computer Science") },
  { id: 7, name: "History", code: codeFromName("History") },
  { id: 8, name: "Geography", code: codeFromName("Geography") },
  { id: 9, name: "Business Studies", code: codeFromName("Business Studies") },
  { id: 10, name: "Physical Education", code: codeFromName("Physical Education") },
];

export const mockTeachers = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Carol Davis" },
  { id: 4, name: "David Lee" },
  { id: 5, name: "Eva Martinez" },
  { id: 6, name: "Frank Nguyen" },
  { id: 7, name: "Grace Kim" },
  { id: 8, name: "Henry Thompson" },
  { id: 9, name: "Isabella Rossi" },
  { id: 10, name: "Jack Wilson" },
];
