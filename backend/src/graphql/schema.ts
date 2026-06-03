import gql from 'graphql-tag';

export const typeDefs = gql`
  # ==================
  # Types
  # ==================

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Student {
    id: ID!
    studentNumber: String!
    firstName: String!
    lastName: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    enrollments: [Enrollment!]!
  }

  type Teacher {
    id: ID!
    employeeNumber: String!
    firstName: String!
    lastName: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    courses: [Course!]!
  }

  type Course {
    id: ID!
    code: String!
    title: String!
    description: String
    teacherId: String!
    createdAt: String!
    updatedAt: String!
    teacher: Teacher!
    enrollments: [Enrollment!]!
  }

  type Enrollment {
    id: ID!
    studentId: String!
    courseId: String!
    enrolledAt: String!
    student: Student!
    course: Course!
    grade: Grade
  }

  type Grade {
    id: ID!
    enrollmentId: String!
    grade: Float!
    remarks: String
    createdAt: String!
    enrollment: Enrollment!
  }

  # ==================
  # Paginated Types
  # ==================

  type PaginatedStudents {
    data: [Student!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type PaginatedTeachers {
    data: [Teacher!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type PaginatedCourses {
    data: [Course!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type PaginatedEnrollments {
    data: [Enrollment!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type PaginatedGrades {
    data: [Grade!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  # ==================
  # Dashboard
  # ==================

  type DashboardStats {
    totalStudents: Int!
    totalTeachers: Int!
    totalCourses: Int!
    totalEnrollments: Int!
    totalGrades: Int!
    recentStudents: [Student!]!
    recentEnrollments: [Enrollment!]!
  }

  # ==================
  # Inputs
  # ==================

  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateStudentInput {
    studentNumber: String!
    firstName: String!
    lastName: String!
    email: String!
  }

  input UpdateStudentInput {
    studentNumber: String
    firstName: String
    lastName: String
    email: String
  }

  input CreateTeacherInput {
    employeeNumber: String!
    firstName: String!
    lastName: String!
    email: String!
  }

  input UpdateTeacherInput {
    employeeNumber: String
    firstName: String
    lastName: String
    email: String
  }

  input CreateCourseInput {
    code: String!
    title: String!
    description: String
    teacherId: String!
  }

  input UpdateCourseInput {
    code: String
    title: String
    description: String
    teacherId: String
  }

  input CreateEnrollmentInput {
    studentId: String!
    courseId: String!
  }

  input CreateGradeInput {
    enrollmentId: String!
    grade: Float!
    remarks: String
  }

  input UpdateGradeInput {
    grade: Float
    remarks: String
  }

  # ==================
  # Queries
  # ==================

  type Query {
    # Auth
    me: User!

    # Students
    students(search: String, page: Int, limit: Int): PaginatedStudents!
    student(id: ID!): Student!

    # Teachers
    teachers(search: String, page: Int, limit: Int): PaginatedTeachers!
    teacher(id: ID!): Teacher!

    # Courses
    courses(search: String, page: Int, limit: Int): PaginatedCourses!
    course(id: ID!): Course!

    # Enrollments
    enrollments(search: String, page: Int, limit: Int): PaginatedEnrollments!
    enrollment(id: ID!): Enrollment!

    # Grades
    grades(search: String, courseId: String, studentId: String, page: Int, limit: Int): PaginatedGrades!
    grade(id: ID!): Grade!

    # Dashboard
    dashboardStats: DashboardStats!
  }

  # ==================
  # Mutations
  # ==================

  type Mutation {
    # Auth
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    # Students
    createStudent(input: CreateStudentInput!): Student!
    updateStudent(id: ID!, input: UpdateStudentInput!): Student!
    deleteStudent(id: ID!): Student!

    # Teachers
    createTeacher(input: CreateTeacherInput!): Teacher!
    updateTeacher(id: ID!, input: UpdateTeacherInput!): Teacher!
    deleteTeacher(id: ID!): Teacher!

    # Courses
    createCourse(input: CreateCourseInput!): Course!
    updateCourse(id: ID!, input: UpdateCourseInput!): Course!
    deleteCourse(id: ID!): Course!

    # Enrollments
    createEnrollment(input: CreateEnrollmentInput!): Enrollment!
    deleteEnrollment(id: ID!): Enrollment!

    # Grades
    createGrade(input: CreateGradeInput!): Grade!
    updateGrade(id: ID!, input: UpdateGradeInput!): Grade!
    deleteGrade(id: ID!): Grade!
  }
`;
