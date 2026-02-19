import { PERMISSIONS } from "@/constants/permission.constants";
import { NavGroup } from "@/interfaces/interface";

// Sidebar navigation config.
// Each nav item declares what permission/module is needed.
// The sidebar component filters this list automatically.
export const navConfig: NavGroup[] = [
    {
        groupLabel: "Overview",
        items: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: "LayoutDashboard",
                permission: PERMISSIONS.DASHBOARD.VIEW,
            },
        ],
    },
    {
        groupLabel: "Academics",
        items: [
            {
                label: "Students",
                href: "/students",
                icon: "Users",
                permission: PERMISSIONS.STUDENT.VIEW,
                children: [
                    { label: "All Students", href: "/students", icon: "List", permission: PERMISSIONS.STUDENT.VIEW },
                    { label: "Add Student", href: "/students/new", icon: "UserPlus", permission: PERMISSIONS.STUDENT.CREATE },
                    { label: "Promote", href: "/students/promote", icon: "TrendingUp", permission: PERMISSIONS.STUDENT.PROMOTE },
                    { label: "Bulk Import", href: "/students/import", icon: "Upload", permission: PERMISSIONS.STUDENT.BULK_IMPORT },
                ],
            },
            {
                label: "Classes",
                href: "/classes",
                icon: "BookOpen",
                permission: PERMISSIONS.CLASS.VIEW,
            },
            {
                label: "Subjects",
                href: "/subjects",
                icon: "BookMarked",
                permission: PERMISSIONS.SUBJECT.VIEW,
            },
            {
                label: "Timetable",
                href: "/timetable",
                icon: "Calendar",
                permission: PERMISSIONS.TIMETABLE.VIEW,
            },
            {
                label: "Attendance",
                href: "/attendance",
                icon: "ClipboardCheck",
                permission: PERMISSIONS.ATTENDANCE.VIEW,
            },
            {
                label: "Exams",
                href: "/exams",
                icon: "FileText",
                permission: PERMISSIONS.EXAM.VIEW,
            },
            {
                label: "Marks",
                href: "/marks",
                icon: "BarChart2",
                permission: PERMISSIONS.MARKS.VIEW,
            },
            {
                label: "Homework",
                href: "/homework",
                icon: "PenLine",
                permission: PERMISSIONS.HOMEWORK.VIEW,
            },
        ],
    },
    {
        groupLabel: "Finance",
        items: [
            {
                label: "Fees",
                href: "/fees",
                icon: "IndianRupee",
                module: "fees",
                children: [
                    { label: "Collect Fees", href: "/fees/collect", icon: "HandCoins", permission: PERMISSIONS.FEES.COLLECT },
                    { label: "Fee Structure", href: "/fees/structure", icon: "Layers", permission: PERMISSIONS.FEES.VIEW },
                    { label: "Defaulters", href: "/fees/defaulters", icon: "AlertTriangle", permission: PERMISSIONS.FEES.DEFAULTER_LIST },
                    { label: "Reports", href: "/fees/reports", icon: "FileBarChart", permission: PERMISSIONS.FEES.REPORT },
                ],
            },
        ],
    },
    {
        groupLabel: "HR",
        items: [
            {
                label: "Teachers",
                href: "/teachers",
                icon: "GraduationCap",
                permission: PERMISSIONS.TEACHER.VIEW,
            },
            {
                label: "Staff",
                href: "/staff",
                icon: "Briefcase",
                permission: PERMISSIONS.STAFF.VIEW,
                children: [
                    { label: "All Staff", href: "/staff", icon: "Users", permission: PERMISSIONS.STAFF.VIEW },
                    { label: "Salary", href: "/staff/salary", icon: "Wallet", permission: PERMISSIONS.STAFF.SALARY_VIEW },
                ],
            },
        ],
    },
    {
        groupLabel: "Administration",
        items: [
            {
                label: "Admissions",
                href: "/admissions",
                icon: "ClipboardList",
                permission: PERMISSIONS.ADMISSION.VIEW,
            },
            {
                label: "Library",
                href: "/library",
                icon: "Library",
                module: "library",
            },
            {
                label: "Transport",
                href: "/transport",
                icon: "Bus",
                module: "transport",
            },
            {
                label: "Visitor Log",
                href: "/visitors",
                icon: "UserCheck",
                permission: PERMISSIONS.VISITOR.VIEW,
            },
            {
                label: "Notices",
                href: "/notices",
                icon: "Bell",
                permission: PERMISSIONS.NOTICE.VIEW,
            },
            {
                label: "Messages",
                href: "/messages",
                icon: "MessageSquare",
                permission: PERMISSIONS.MESSAGE.VIEW,
            },
        ],
    },
    {
        groupLabel: "Reports",
        items: [
            {
                label: "Reports",
                href: "/reports",
                icon: "PieChart",
                module: "report",
                children: [
                    { label: "Academic", href: "/reports/academic", icon: "BookOpen", permission: PERMISSIONS.REPORT.ACADEMIC },
                    { label: "Financial", href: "/reports/financial", icon: "TrendingUp", permission: PERMISSIONS.REPORT.FINANCIAL },
                    { label: "Student", href: "/reports/student", icon: "Users", permission: PERMISSIONS.REPORT.STUDENT },
                    { label: "Attendance", href: "/reports/attendance", icon: "Calendar", permission: PERMISSIONS.REPORT.ATTENDANCE },
                    { label: "Custom", href: "/reports/custom", icon: "Sliders", permission: PERMISSIONS.REPORT.CUSTOM },
                ],
            },
            {
                label: "Certificates",
                href: "/certificates",
                icon: "Award",
                permission: PERMISSIONS.CERTIFICATE.VIEW,
            },
            {
                label: "Report Cards",
                href: "/report-cards",
                icon: "ScrollText",
                permission: PERMISSIONS.REPORT_CARD.VIEW,
            },
        ],
    },
    {
        groupLabel: "Settings",
        items: [
            {
                label: "Users",
                href: "/users",
                icon: "UserCog",
                permission: PERMISSIONS.USER.VIEW,
            },
            {
                label: "Roles",
                href: "/roles",
                icon: "ShieldCheck",
                permission: PERMISSIONS.ROLE.VIEW,
            },
            {
                label: "Institute",
                href: "/institute",
                icon: "School",
                permission: PERMISSIONS.INSTITUTE.VIEW,
            },
            {
                label: "Academic Year",
                href: "/academic-year",
                icon: "CalendarDays",
                permission: PERMISSIONS.ACADEMIC_YEAR.VIEW,
            },
        ],
    },
    {
        // Only visible to SUPER_ADMIN
        groupLabel: "SaaS Platform",
        items: [
            {
                label: "All Institutes",
                href: "/saas/institutes",
                icon: "Building2",
                permission: PERMISSIONS.SAAS.INSTITUTE_VIEW_ALL,
            },
            {
                label: "Subscriptions",
                href: "/saas/subscriptions",
                icon: "CreditCard",
                permission: PERMISSIONS.SAAS.SUBSCRIPTION_MANAGE,
            },
            {
                label: "Billing",
                href: "/saas/billing",
                icon: "Receipt",
                permission: PERMISSIONS.SAAS.BILLING_VIEW,
            },
            {
                label: "Platform Settings",
                href: "/saas/settings",
                icon: "Settings2",
                permission: PERMISSIONS.SAAS.SETTINGS,
            },
        ],
    },
]