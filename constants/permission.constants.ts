export const PERMISSIONS = {
    //  Student 
    STUDENT: {
        VIEW: "student.view",
        CREATE: "student.create",
        UPDATE: "student.update",
        DELETE: "student.delete",
        PROMOTE: "student.promote",
        TRANSFER: "student.transfer",
        BULK_IMPORT: "student.bulk_import",
        EXPORT: "student.export",
    },

    //  Attendance
    ATTENDANCE: {
        VIEW: "attendance.view",
        MARK: "attendance.mark",
        EDIT: "attendance.edit",
        DELETE: "attendance.delete",
        REPORT: "attendance.report",
    },

    //  Marks 
    MARKS: {
        VIEW: "marks.view",
        ENTRY: "marks.entry",
        EDIT: "marks.edit",
        DELETE: "marks.delete",
        PUBLISH: "marks.publish",
        REPORT: "marks.report",
    },

    //  Fees
    FEES: {
        VIEW: "fees.view",
        CREATE: "fees.create",
        UPDATE: "fees.update",
        COLLECT: "fees.collect",
        REFUND: "fees.refund",
        WAIVER: "fees.waiver",
        RECEIPT: "fees.receipt",
        DEFAULTER_LIST: "fees.defaulter_list",
        REPORT: "fees.report",
    },

    //  Library
    LIBRARY: {
        VIEW: "library.view",
        BOOK_ADD: "library.book.add",
        BOOK_UPDATE: "library.book.update",
        BOOK_DELETE: "library.book.delete",
        BOOK_ISSUE: "library.book.issue",
        BOOK_RETURN: "library.book.return",
        FINE: "library.fine",
        REPORT: "library.report",
    },

    //  Transport 
    TRANSPORT: {
        VIEW: "transport.view",
        ROUTE_CREATE: "transport.route.create",
        ROUTE_UPDATE: "transport.route.update",
        ROUTE_DELETE: "transport.route.delete",
        STUDENT_ASSIGN: "transport.student.assign",
        DRIVER_MANAGE: "transport.driver.manage",
        VEHICLE_MANAGE: "transport.vehicle.manage",
        REPORT: "transport.report",
    },

    //  Admission 
    ADMISSION: {
        VIEW: "admission.view",
        CREATE: "admission.create",
        UPDATE: "admission.update",
        APPROVE: "admission.approve",
        DELETE: "admission.delete",
    },

    //  Visitor
    VISITOR: {
        VIEW: "visitor.view",
        LOG: "visitor.log",
        DELETE: "visitor.delete",
    },

    //  Teacher
    TEACHER: {
        VIEW: "teacher.view",
        CREATE: "teacher.create",
        UPDATE: "teacher.update",
        DELETE: "teacher.delete",
    },

    //  Staff 
    STAFF: {
        VIEW: "staff.view",
        CREATE: "staff.create",
        UPDATE: "staff.update",
        DELETE: "staff.delete",
        SALARY_VIEW: "staff.salary.view",
        SALARY_PROCESS: "staff.salary.process",
    },

    //  Class 
    CLASS: {
        VIEW: "class.view",
        CREATE: "class.create",
        UPDATE: "class.update",
        DELETE: "class.delete",
    },

    //  Subject
    SUBJECT: {
        VIEW: "subject.view",
        CREATE: "subject.create",
        UPDATE: "subject.update",
        DELETE: "subject.delete",
    },

    //  Timetable 
    TIMETABLE: {
        VIEW: "timetable.view",
        CREATE: "timetable.create",
        UPDATE: "timetable.update",
    },

    //  Academic Year
    ACADEMIC_YEAR: {
        VIEW: "academic_year.view",
        CREATE: "academic_year.create",
        UPDATE: "academic_year.update",
        DELETE: "academic_year.delete",
    },

    //  Exam
    EXAM: {
        VIEW: "exam.view",
        CREATE: "exam.create",
        UPDATE: "exam.update",
        DELETE: "exam.delete",
    },

    //  Notice 
    NOTICE: {
        VIEW: "notice.view",
        CREATE: "notice.create",
        UPDATE: "notice.update",
        DELETE: "notice.delete",
    },

    //  Message
    MESSAGE: {
        SEND: "message.send",
        VIEW: "message.view",
    },

    //  Homework 
    HOMEWORK: {
        VIEW: "homework.view",
        CREATE: "homework.create",
        UPDATE: "homework.update",
        DELETE: "homework.delete",
    },

    //  Certificate 
    CERTIFICATE: {
        VIEW: "certificate.view",
        GENERATE: "certificate.generate",
    },

    //  Report Card 
    REPORT_CARD: {
        VIEW: "report_card.view",
        GENERATE: "report_card.generate",
    },

    //  Role Management 
    ROLE: {
        VIEW: "role.view",
        CREATE: "role.create",
        UPDATE: "role.update",
        DELETE: "role.delete",
    },

    //  User Management 
    USER: {
        VIEW: "user.view",
        CREATE: "user.create",
        UPDATE: "user.update",
        DELETE: "user.delete",
        ASSIGN_ROLE: "user.assign_role",
    },

    //  Institute 
    INSTITUTE: {
        VIEW: "institute.view",
        UPDATE: "institute.update",
        SETTINGS: "institute.settings",
    },

    //  Reports
    REPORT: {
        ACADEMIC: "report.academic",
        FINANCIAL: "report.financial",
        STUDENT: "report.student",
        ATTENDANCE: "report.attendance",
        CUSTOM: "report.custom",
    },

    //  Dashboard 
    DASHBOARD: {
        VIEW: "dashboard.view",
        ADMIN: "dashboard.admin",
    },

    //  SaaS (Platform-level, SUPER_ADMIN only) 
    SAAS: {
        INSTITUTE_CREATE: "saas.institute.create",
        INSTITUTE_DELETE: "saas.institute.delete",
        INSTITUTE_VIEW_ALL: "saas.institute.view_all",
        SUBSCRIPTION_MANAGE: "saas.subscription.manage",
        BILLING_VIEW: "saas.billing.view",
        SETTINGS: "saas.settings",
    },
} as const;

// Roles constant

export const ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    SCHOOL_ADMIN: "SCHOOL_ADMIN",
    PRINCIPAL: "PRINCIPAL",
    VICE_PRINCIPAL: "VICE_PRINCIPAL",
    HOD: "HOD",
    TEACHER: "TEACHER",
    ACCOUNTANT: "ACCOUNTANT",
    LIBRARIAN: "LIBRARIAN",
    RECEPTIONIST: "RECEPTIONIST",
    STUDENT: "STUDENT",
    PARENT: "PARENT",
} as const;