import { gql } from '@apollo/client';

// ==================
// Auth
// ==================

export const SIGNUP = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;

// ==================
// Dashboard
// ==================

export const DASHBOARD_STATS = gql`
  query DashboardStats {
    dashboardStats {
      totalStudents
      totalTeachers
      totalCourses
      totalEnrollments
      totalGrades
      recentStudents {
        id
        studentNumber
        firstName
        lastName
        email
        createdAt
      }
      recentEnrollments {
        id
        enrolledAt
        student {
          id
          firstName
          lastName
        }
        course {
          id
          code
          title
        }
      }
    }
  }
`;

// ==================
// Students
// ==================

export const GET_STUDENTS = gql`
  query GetStudents($search: String, $page: Int, $limit: Int) {
    students(search: $search, page: $page, limit: $limit) {
      data {
        id
        studentNumber
        firstName
        lastName
        email
        createdAt
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_STUDENT = gql`
  query GetStudent($id: ID!) {
    student(id: $id) {
      id
      studentNumber
      firstName
      lastName
      email
      createdAt
      updatedAt
      enrollments {
        id
        enrolledAt
        course {
          id
          code
          title
          teacher {
            id
            firstName
            lastName
          }
        }
        grade {
          id
          grade
          remarks
        }
      }
    }
  }
`;

export const CREATE_STUDENT = gql`
  mutation CreateStudent($input: CreateStudentInput!) {
    createStudent(input: $input) {
      id
      studentNumber
      firstName
      lastName
      email
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: ID!, $input: UpdateStudentInput!) {
    updateStudent(id: $id, input: $input) {
      id
      studentNumber
      firstName
      lastName
      email
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id) {
      id
    }
  }
`;

// ==================
// Teachers
// ==================

export const GET_TEACHERS = gql`
  query GetTeachers($search: String, $page: Int, $limit: Int) {
    teachers(search: $search, page: $page, limit: $limit) {
      data {
        id
        employeeNumber
        firstName
        lastName
        email
        createdAt
        courses {
          id
          code
          title
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_TEACHER = gql`
  query GetTeacher($id: ID!) {
    teacher(id: $id) {
      id
      employeeNumber
      firstName
      lastName
      email
      createdAt
      updatedAt
      courses {
        id
        code
        title
        enrollments {
          id
          student {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
`;

export const CREATE_TEACHER = gql`
  mutation CreateTeacher($input: CreateTeacherInput!) {
    createTeacher(input: $input) {
      id
      employeeNumber
      firstName
      lastName
      email
    }
  }
`;

export const UPDATE_TEACHER = gql`
  mutation UpdateTeacher($id: ID!, $input: UpdateTeacherInput!) {
    updateTeacher(id: $id, input: $input) {
      id
      employeeNumber
      firstName
      lastName
      email
    }
  }
`;

export const DELETE_TEACHER = gql`
  mutation DeleteTeacher($id: ID!) {
    deleteTeacher(id: $id) {
      id
    }
  }
`;

// ==================
// Courses
// ==================

export const GET_COURSES = gql`
  query GetCourses($search: String, $page: Int, $limit: Int) {
    courses(search: $search, page: $page, limit: $limit) {
      data {
        id
        code
        title
        description
        teacherId
        createdAt
        teacher {
          id
          firstName
          lastName
        }
        enrollments {
          id
          student {
            id
            firstName
            lastName
          }
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_COURSE = gql`
  query GetCourse($id: ID!) {
    course(id: $id) {
      id
      code
      title
      description
      teacherId
      createdAt
      updatedAt
      teacher {
        id
        firstName
        lastName
        email
      }
      enrollments {
        id
        enrolledAt
        student {
          id
          studentNumber
          firstName
          lastName
          email
        }
        grade {
          id
          grade
          remarks
        }
      }
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      code
      title
      description
      teacherId
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      id
      code
      title
      description
      teacherId
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      id
    }
  }
`;

// ==================
// Enrollments
// ==================

export const GET_ENROLLMENTS = gql`
  query GetEnrollments($search: String, $page: Int, $limit: Int) {
    enrollments(search: $search, page: $page, limit: $limit) {
      data {
        id
        enrolledAt
        student {
          id
          studentNumber
          firstName
          lastName
        }
        course {
          id
          code
          title
          teacher {
            id
            firstName
            lastName
          }
        }
        grade {
          id
          grade
          remarks
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_ENROLLMENT = gql`
  query GetEnrollment($id: ID!) {
    enrollment(id: $id) {
      id
      enrolledAt
      student {
        id
        studentNumber
        firstName
        lastName
        email
      }
      course {
        id
        code
        title
        teacher {
          id
          firstName
          lastName
        }
      }
      grade {
        id
        grade
        remarks
      }
    }
  }
`;

export const CREATE_ENROLLMENT = gql`
  mutation CreateEnrollment($input: CreateEnrollmentInput!) {
    createEnrollment(input: $input) {
      id
      student {
        id
        firstName
        lastName
      }
      course {
        id
        code
        title
      }
    }
  }
`;

export const DELETE_ENROLLMENT = gql`
  mutation DeleteEnrollment($id: ID!) {
    deleteEnrollment(id: $id) {
      id
    }
  }
`;

// ==================
// Grades
// ==================

export const GET_GRADES = gql`
  query GetGrades($search: String, $courseId: String, $studentId: String, $page: Int, $limit: Int) {
    grades(search: $search, courseId: $courseId, studentId: $studentId, page: $page, limit: $limit) {
      data {
        id
        grade
        remarks
        createdAt
        enrollment {
          id
          student {
            id
            studentNumber
            firstName
            lastName
          }
          course {
            id
            code
            title
          }
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_GRADE = gql`
  query GetGrade($id: ID!) {
    grade(id: $id) {
      id
      grade
      remarks
      createdAt
      enrollment {
        id
        student {
          id
          firstName
          lastName
        }
        course {
          id
          code
          title
        }
      }
    }
  }
`;

export const CREATE_GRADE = gql`
  mutation CreateGrade($input: CreateGradeInput!) {
    createGrade(input: $input) {
      id
      grade
      remarks
    }
  }
`;

export const UPDATE_GRADE = gql`
  mutation UpdateGrade($id: ID!, $input: UpdateGradeInput!) {
    updateGrade(id: $id, input: $input) {
      id
      grade
      remarks
    }
  }
`;

export const DELETE_GRADE = gql`
  mutation DeleteGrade($id: ID!) {
    deleteGrade(id: $id) {
      id
    }
  }
`;

// ==================
// Helpers (for dropdowns)
// ==================

export const GET_ALL_STUDENTS_SIMPLE = gql`
  query GetAllStudentsSimple {
    students(limit: 100) {
      data {
        id
        studentNumber
        firstName
        lastName
      }
    }
  }
`;

export const GET_ALL_TEACHERS_SIMPLE = gql`
  query GetAllTeachersSimple {
    teachers(limit: 100) {
      data {
        id
        employeeNumber
        firstName
        lastName
      }
    }
  }
`;

export const GET_ALL_COURSES_SIMPLE = gql`
  query GetAllCoursesSimple {
    courses(limit: 100) {
      data {
        id
        code
        title
      }
    }
  }
`;

export const GET_ENROLLMENTS_WITHOUT_GRADE = gql`
  query GetEnrollmentsWithoutGrade {
    enrollments(limit: 100) {
      data {
        id
        student {
          id
          firstName
          lastName
        }
        course {
          id
          code
          title
        }
        grade {
          id
        }
      }
    }
  }
`;
