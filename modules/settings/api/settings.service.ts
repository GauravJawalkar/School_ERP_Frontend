import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import {
    SchoolSummary,
    SchoolDetails,
    AcademicYear,
    FeeHead,
    CreateClassDTO,
    UpdateClassDTO,
    CreateSectionDTO,
    UpdateSectionDTO,
    CreateFeeHeadDTO,
    CreateFeeStructureDTO,
    UpdateFeeStructureDTO,
    CreateAcademicYearDTO,
    UpdateAcademicYearDTO,
    SchoolUser
} from "../types/settings.types";

export const settingsService = {
    // School Directory & Institute Management
    getAllSchools: async (): Promise<SchoolSummary[]> => {
        const res = await ApiClient.get(`${BASE_URL}/institute/allSchools`);
        return res.data?.data || [];
    },

    getSchoolDetails: async (slug: string): Promise<SchoolDetails> => {
        const res = await ApiClient.get(`${BASE_URL}/institute/${slug}`);
        return res.data?.data;
    },

    updateSchoolStatus: async (slug: string, status: string): Promise<any> => {
        const res = await ApiClient.patch(`${BASE_URL}/institute/${slug}/status`, { status });
        return res.data;
    },

    // Academic Years
    getAcademicYears: async (schoolId: number): Promise<AcademicYear[]> => {
        const res = await ApiClient.get(`${BASE_URL}/admin/academicYears?instituteId=${schoolId}`);
        return res.data?.data || [];
    },

    createAcademicYear: async (dto: CreateAcademicYearDTO): Promise<AcademicYear> => {
        const res = await ApiClient.post(`${BASE_URL}/admin/academicYears`, dto);
        return res.data?.data || res.data;
    },

    updateAcademicYear: async (id: number, dto: UpdateAcademicYearDTO): Promise<AcademicYear> => {
        const res = await ApiClient.patch(`${BASE_URL}/admin/academicYears/${id}`, dto);
        return res.data?.data || res.data;
    },

    toggleAcademicYearStatus: async (id: number, status: string): Promise<void> => {
        await ApiClient.patch(`${BASE_URL}/admin/academicYears/${id}/status`, { status });
    },

    // Classes & Sections
    createClass: async (dto: CreateClassDTO): Promise<any> => {
        const res = await ApiClient.post(`${BASE_URL}/institute/createClass`, dto);
        return res.data;
    },

    updateClass: async (id: number, dto: UpdateClassDTO): Promise<any> => {
        const res = await ApiClient.patch(`${BASE_URL}/institute/class/${id}`, dto);
        return res.data;
    },

    deleteClass: async (id: number): Promise<void> => {
        await ApiClient.delete(`${BASE_URL}/institute/class/${id}`);
    },

    createSection: async (dto: CreateSectionDTO): Promise<any> => {
        const res = await ApiClient.post(`${BASE_URL}/institute/createSection`, dto);
        return res.data;
    },

    updateSection: async (id: number, dto: UpdateSectionDTO): Promise<any> => {
        const res = await ApiClient.patch(`${BASE_URL}/institute/section/${id}`, dto);
        return res.data;
    },

    deleteSection: async (id: number): Promise<void> => {
        await ApiClient.delete(`${BASE_URL}/institute/section/${id}`);
    },

    // Fee Structures & Categories
    getFeeHeads: async (schoolId: number): Promise<FeeHead[]> => {
        const res = await ApiClient.get(`${BASE_URL}/finance/feeHeads?instituteId=${schoolId}`);
        return res.data?.data || [];
    },

    createFeeHead: async (dto: CreateFeeHeadDTO): Promise<any> => {
        const res = await ApiClient.post(`${BASE_URL}/finance/createFeeHead`, dto);
        return res.data;
    },

    createFeeStructure: async (dto: CreateFeeStructureDTO): Promise<any> => {
        const res = await ApiClient.post(`${BASE_URL}/finance/createFeeStructure`, dto);
        return res.data;
    },

    updateFeeStructure: async (id: number, dto: UpdateFeeStructureDTO): Promise<any> => {
        const res = await ApiClient.patch(`${BASE_URL}/finance/feeStructure/${id}`, dto);
        return res.data;
    },

    deleteFeeStructure: async (id: number): Promise<void> => {
        await ApiClient.delete(`${BASE_URL}/finance/feeStructure/${id}`);
    },

    // User Credentials Directory
    getSchoolUsers: async (instituteId?: number): Promise<SchoolUser[]> => {
        let url = `${BASE_URL}/admin/directory`;
        if (instituteId) {
            url += `?instituteId=${instituteId}`;
        }
        const res = await ApiClient.get(url);
        return res.data?.data || [];
    },

    createStaff: async (payload: any): Promise<any> => {
        const res = await ApiClient.post(`${BASE_URL}/admin/createStaff`, payload);
        return res.data;
    },

    updateUserStatus: async (payload: { userId: string; isActive: boolean }): Promise<any> => {
        const res = await ApiClient.patch(`${BASE_URL}/institute/updateUserStatus`, payload);
        return res.data;
    }
};
