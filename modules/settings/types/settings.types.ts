export interface SchoolSummary {
    id: number;
    schoolName: string;
    slug: string;
    logoUrl?: string;
    medium?: string;
    affiliationNumber?: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_APPROVAL" | string;
    address?: string;
    city?: string;
    state?: string;
    totalStudents?: number;
    totalStaff?: number;
    createdAt?: string;
}

export interface ContactInfo {
    emails?: {
        primary?: string;
        secondary?: string;
    };
    main_phone?: string;
    alternate_phone?: string;
    website?: string;
    address_details?: {
        city?: string;
        state?: string;
        pincode?: string;
        landmark?: string;
    };
    office_hours?: {
        monday_to_friday?: string;
        saturday?: string;
    };
}

export interface AdditionalInfo {
    establishedYear?: string | number;
    founderName?: string;
    missionStatement?: string;
    visionStatement?: string;
    coreValues?: string[];
    tags?: string[];
    boardsAffiliated?: string[];
    notableAlumni?: string[];
}

export interface CampusSection {
    id: number;
    name: string;
    capacity: number | null;
    roomNumber: string | null;
    classTeacherId: number | null;
}

export interface CampusClass {
    id: number;
    className: string;
    capacity: number | null;
    orderIndex: number | null;
    academicYearId: number;
    academicYearName?: string;
    sections?: CampusSection[];
}

export interface FeeStructure {
    id: number;
    classId: number;
    feeHeadId: number;
    feeHeadName: string | null;
    feeType: string | null;
    amount: string;
    frequency: string;
    isCompulsory: boolean;
    dueDay: number | null;
}

export interface FeeHead {
    id: number;
    feeName: string;
    feeType: string;
    description?: string;
    taxPercentage?: string;
}

export interface AcademicYear {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: "ACTIVE" | "INACTIVE" | "UPCOMING" | "ARCHIVED" | string;
    isActive?: boolean;
    isCurrent?: boolean;
    description?: string;
}

export interface AcademicYearTableProps {
    years: AcademicYear[];
    isSuperAdmin: boolean;
    onToggleActive: (id: number, isActive: boolean) => void;
    updatingId: number | null;
}

export interface StaffMember {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    designation?: string;
    department?: string | null;
    joiningDate?: string | null;
    role?: string;
    avatarUrl?: string;
}

export interface SchoolDetails extends SchoolSummary {
    address?: string;
    contactInfo?: ContactInfo;
    additionalInfo?: AdditionalInfo;
    classes?: CampusClass[];
    feeStructures?: FeeStructure[];
    staff?: StaffMember[];
}

export interface SchoolUser {
    id: number;
    userId: string | null;
    firstName: string;
    lastName: string;
    employeeCode: string;
    designation: string;
    email?: string;
    phone?: string;
    roleName: string;
    isActive: boolean;
}

export type SystemUser = SchoolUser;

// DTOs
export interface CreateClassDTO {
    className: string;
    academicYearId: number;
    capacity: number | null;
    instituteId?: number;
}

export interface UpdateClassDTO {
    className?: string;
    academicYearId?: number;
    capacity?: number | null;
}

export interface CreateSectionDTO {
    name: string;
    classId: number;
    capacity: number | null;
    roomNumber: string;
    classTeacherId: number | null;
}

export interface UpdateSectionDTO {
    name?: string;
    capacity?: number | null;
    roomNumber?: string;
    classTeacherId?: number | null;
}

export interface CreateFeeHeadDTO {
    feeName: string;
    feeType: string;
    description: string;
    taxPercentage?: string;
    instituteId?: number;
}

export interface CreateFeeStructureDTO {
    academicYearId: number;
    classId: number;
    feeHeadId: number;
    amount: string | number;
    frequency: string;
    isCompulsory: boolean;
    dueDay: number;
    instituteId?: number;
}

export interface UpdateFeeStructureDTO {
    amount?: string | number;
    frequency?: string;
    isCompulsory?: boolean;
    dueDay?: number;
}

export interface CreateAcademicYearDTO {
    name: string;
    startDate: string;
    endDate: string;
    status?: string;
    isCurrent?: boolean;
    instituteId?: number;
}

export interface UpdateAcademicYearDTO {
    name?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    isCurrent?: boolean;
}
