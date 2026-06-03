import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.grade.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@school.com",
      password: hashedPassword,
    },
  });
  console.log(`✅ Created admin user: ${admin.email}`);

  // Create students
  const studentsData = [
    {
      studentNumber: "STU-001",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@student.edu",
    },
    {
      studentNumber: "STU-002",
      firstName: "Bob",
      lastName: "Smith",
      email: "bob.smith@student.edu",
    },
    {
      studentNumber: "STU-003",
      firstName: "Charlie",
      lastName: "Brown",
      email: "charlie.brown@student.edu",
    },
    {
      studentNumber: "STU-004",
      firstName: "Diana",
      lastName: "Prince",
      email: "diana.prince@student.edu",
    },
    {
      studentNumber: "STU-005",
      firstName: "Edward",
      lastName: "Norton",
      email: "edward.norton@student.edu",
    },
    {
      studentNumber: "STU-006",
      firstName: "Fiona",
      lastName: "Apple",
      email: "fiona.apple@student.edu",
    },
    {
      studentNumber: "STU-007",
      firstName: "George",
      lastName: "Lucas",
      email: "george.lucas@student.edu",
    },
    {
      studentNumber: "STU-008",
      firstName: "Hannah",
      lastName: "Montana",
      email: "hannah.montana@student.edu",
    },
    {
      studentNumber: "STU-009",
      firstName: "Ivan",
      lastName: "Drago",
      email: "ivan.drago@student.edu",
    },
    {
      studentNumber: "STU-010",
      firstName: "Julia",
      lastName: "Roberts",
      email: "julia.roberts@student.edu",
    },
  ];

  const students = await Promise.all(
    studentsData.map((data) => prisma.student.create({ data })),
  );
  console.log(`✅ Created ${students.length} students`);

  // Create teachers
  const teachersData = [
    {
      employeeNumber: "EMP-001",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@school.com",
    },
    {
      employeeNumber: "EMP-002",
      firstName: "Jane",
      lastName: "Wilson",
      email: "jane.wilson@school.com",
    },
    {
      employeeNumber: "EMP-003",
      firstName: "Robert",
      lastName: "Garcia",
      email: "robert.garcia@school.com",
    },
    {
      employeeNumber: "EMP-004",
      firstName: "Maria",
      lastName: "Santos",
      email: "maria.santos@school.com",
    },
    {
      employeeNumber: "EMP-005",
      firstName: "David",
      lastName: "Kim",
      email: "david.kim@school.com",
    },
  ];

  const teachers = await Promise.all(
    teachersData.map((data) => prisma.teacher.create({ data })),
  );
  console.log(`✅ Created ${teachers.length} teachers`);

  // Create courses
  const coursesData = [
    {
      code: "CS101",
      title: "Introduction to Computer Science",
      description: "Fundamentals of CS",
      teacherId: teachers[0].id,
    },
    {
      code: "CS201",
      title: "Data Structures",
      description: "Arrays, linked lists, trees, graphs",
      teacherId: teachers[0].id,
    },
    {
      code: "MATH101",
      title: "Calculus I",
      description: "Limits, derivatives, integrals",
      teacherId: teachers[1].id,
    },
    {
      code: "MATH201",
      title: "Linear Algebra",
      description: "Vectors, matrices, transformations",
      teacherId: teachers[1].id,
    },
    {
      code: "ENG101",
      title: "English Composition",
      description: "Academic writing fundamentals",
      teacherId: teachers[2].id,
    },
    {
      code: "PHY101",
      title: "Physics I",
      description: "Mechanics and thermodynamics",
      teacherId: teachers[3].id,
    },
    {
      code: "PHY201",
      title: "Physics II",
      description: "Electromagnetism and optics",
      teacherId: teachers[3].id,
    },
    {
      code: "CHEM101",
      title: "General Chemistry",
      description: "Atomic structure, bonding, reactions",
      teacherId: teachers[4].id,
    },
    {
      code: "BIO101",
      title: "Introduction to Biology",
      description: "Cell biology and genetics",
      teacherId: teachers[4].id,
    },
    {
      code: "CS301",
      title: "Database Systems",
      description: "SQL, normalization, query optimization",
      teacherId: teachers[0].id,
    },
  ];

  const courses = await Promise.all(
    coursesData.map((data) => prisma.course.create({ data })),
  );
  console.log(`✅ Created ${courses.length} courses`);

  // Create enrollments
  const enrollmentsData = [
    { studentId: students[0].id, courseId: courses[0].id },
    { studentId: students[0].id, courseId: courses[2].id },
    { studentId: students[0].id, courseId: courses[4].id },
    { studentId: students[1].id, courseId: courses[0].id },
    { studentId: students[1].id, courseId: courses[1].id },
    { studentId: students[2].id, courseId: courses[2].id },
    { studentId: students[2].id, courseId: courses[5].id },
    { studentId: students[3].id, courseId: courses[0].id },
    { studentId: students[3].id, courseId: courses[3].id },
    { studentId: students[3].id, courseId: courses[7].id },
    { studentId: students[4].id, courseId: courses[1].id },
    { studentId: students[4].id, courseId: courses[4].id },
    { studentId: students[5].id, courseId: courses[5].id },
    { studentId: students[5].id, courseId: courses[6].id },
    { studentId: students[6].id, courseId: courses[7].id },
    { studentId: students[6].id, courseId: courses[8].id },
    { studentId: students[7].id, courseId: courses[0].id },
    { studentId: students[7].id, courseId: courses[9].id },
    { studentId: students[8].id, courseId: courses[2].id },
    { studentId: students[9].id, courseId: courses[9].id },
  ];

  const enrollments = await Promise.all(
    enrollmentsData.map((data) => prisma.enrollment.create({ data })),
  );
  console.log(`✅ Created ${enrollments.length} enrollments`);

  // Create grades for some enrollments
  const gradesData = [
    {
      enrollmentId: enrollments[0].id,
      grade: 92.5,
      remarks: "Excellent performance",
    },
    { enrollmentId: enrollments[1].id, grade: 88.0, remarks: "Good work" },
    { enrollmentId: enrollments[3].id, grade: 75.0, remarks: "Satisfactory" },
    { enrollmentId: enrollments[4].id, grade: 95.0, remarks: "Outstanding" },
    { enrollmentId: enrollments[5].id, grade: 82.0, remarks: "Very good" },
    { enrollmentId: enrollments[7].id, grade: 90.0, remarks: "Great effort" },
    {
      enrollmentId: enrollments[10].id,
      grade: 68.0,
      remarks: "Needs improvement",
    },
    {
      enrollmentId: enrollments[12].id,
      grade: 85.5,
      remarks: "Good understanding",
    },
    { enrollmentId: enrollments[14].id, grade: 91.0, remarks: "Well done" },
    {
      enrollmentId: enrollments[16].id,
      grade: 78.0,
      remarks: "Fair performance",
    },
  ];

  const grades = await Promise.all(
    gradesData.map((data) => prisma.grade.create({ data })),
  );
  console.log(`✅ Created ${grades.length} grades`);

  console.log("\n🎉 Seeding complete!");
  console.log("📧 Admin login: admin@school.com / admin123");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
