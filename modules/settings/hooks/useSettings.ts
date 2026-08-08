import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../api/settings.service";
import { SETTINGS_QUERY_KEYS } from "../constants/settings.constants";
import {
    CreateClassDTO,
    UpdateClassDTO,
    CreateSectionDTO,
    UpdateSectionDTO,
    CreateFeeHeadDTO,
    CreateFeeStructureDTO,
    UpdateFeeStructureDTO,
    CreateAcademicYearDTO,
    UpdateAcademicYearDTO
} from "../types/settings.types";
import toast from "react-hot-toast";

export function useSchoolsList() {
    return useQuery({
        queryKey: [SETTINGS_QUERY_KEYS.ALL_SCHOOLS],
        queryFn: settingsService.getAllSchools,
        refetchOnWindowFocus: false,
    });
}

export function useSchoolDetails(slug: string) {
    return useQuery({
        queryKey: [SETTINGS_QUERY_KEYS.SCHOOL_DETAILS, slug],
        queryFn: () => settingsService.getSchoolDetails(slug),
        enabled: Boolean(slug),
        refetchOnWindowFocus: false,
    });
}

export function useAcademicYears(schoolId: number) {
    return useQuery({
        queryKey: [SETTINGS_QUERY_KEYS.ACADEMIC_YEARS, schoolId],
        queryFn: () => settingsService.getAcademicYears(schoolId),
        enabled: Boolean(schoolId),
        refetchOnWindowFocus: false,
    });
}

export function useFeeHeads(schoolId: number) {
    return useQuery({
        queryKey: [SETTINGS_QUERY_KEYS.FEE_HEADS, schoolId],
        queryFn: () => settingsService.getFeeHeads(schoolId),
        enabled: Boolean(schoolId),
        refetchOnWindowFocus: false,
    });
}

export function useSchoolUsers(instituteId?: number) {
    return useQuery({
        queryKey: [SETTINGS_QUERY_KEYS.SCHOOL_USERS, instituteId],
        queryFn: () => settingsService.getSchoolUsers(instituteId),
        refetchOnWindowFocus: false,
    });
}

export function useSettingsMutations() {
    const queryClient = useQueryClient();

    const invalidateSchoolDetails = (slug?: string) => {
        if (slug) {
            queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEYS.SCHOOL_DETAILS, slug] });
        } else {
            queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEYS.SCHOOL_DETAILS] });
        }
    };

    const createClassMutation = useMutation({
        mutationFn: (dto: CreateClassDTO) => settingsService.createClass(dto),
        onSuccess: () => {
            toast.success("Class created successfully!");
            invalidateSchoolDetails();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create class.");
        }
    });

    const updateClassMutation = useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateClassDTO }) =>
            settingsService.updateClass(id, dto),
        onSuccess: () => {
            toast.success("Class updated successfully!");
            invalidateSchoolDetails();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update class.");
        }
    });

    const deleteClassMutation = useMutation({
        mutationFn: (id: number) => settingsService.deleteClass(id),
        onSuccess: () => {
            toast.success("Class deleted successfully!");
            invalidateSchoolDetails();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete class.");
        }
    });

    const createSectionMutation = useMutation({
        mutationFn: (dto: CreateSectionDTO) => settingsService.createSection(dto),
        onSuccess: () => {
            toast.success("Section added successfully!");
            invalidateSchoolDetails();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create section.");
        }
    });

    const updateSectionMutation = useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateSectionDTO }) =>
            settingsService.updateSection(id, dto),
        onSuccess: () => {
            toast.success("Section updated successfully!");
            invalidateSchoolDetails();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update section.");
        }
    });

    const deleteSectionMutation = useMutation({
        mutationFn: (id: number) => settingsService.deleteSection(id),
        onSuccess: () => {
            toast.success("Section deleted successfully!");
            invalidateSchoolDetails();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete section.");
        }
    });

    const createFeeHeadMutation = useMutation({
        mutationFn: (dto: CreateFeeHeadDTO) => settingsService.createFeeHead(dto),
        onSuccess: () => {
            toast.success("Fee category created successfully!");
            queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEYS.FEE_HEADS] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create fee category.");
        }
    });

    const createFeeStructureMutation = useMutation({
        mutationFn: (dto: CreateFeeStructureDTO) => settingsService.createFeeStructure(dto),
        onSuccess: () => {
            toast.success("Fee structure mapped successfully!");
            invalidateSchoolDetails();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to map fee structure.");
        }
    });

    const updateFeeStructureMutation = useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateFeeStructureDTO }) =>
            settingsService.updateFeeStructure(id, dto),
        onSuccess: () => {
            toast.success("Fee structure updated successfully!");
            invalidateSchoolDetails();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update fee structure.");
        }
    });

    const deleteFeeStructureMutation = useMutation({
        mutationFn: (id: number) => settingsService.deleteFeeStructure(id),
        onSuccess: () => {
            toast.success("Fee structure mapping removed!");
            invalidateSchoolDetails();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete fee structure.");
        }
    });

    const createAcademicYearMutation = useMutation({
        mutationFn: (dto: CreateAcademicYearDTO) => settingsService.createAcademicYear(dto),
        onSuccess: () => {
            toast.success("Academic Year created successfully!");
            queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEYS.ACADEMIC_YEARS] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create academic year.");
        }
    });

    const updateAcademicYearMutation = useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateAcademicYearDTO }) =>
            settingsService.updateAcademicYear(id, dto),
        onSuccess: () => {
            toast.success("Academic Year updated successfully!");
            queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEYS.ACADEMIC_YEARS] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update academic year.");
        }
    });

    const toggleAcademicYearStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            settingsService.toggleAcademicYearStatus(id, status),
        onSuccess: () => {
            toast.success("Academic Year status updated!");
            queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEYS.ACADEMIC_YEARS] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update academic year status.");
        }
    });

    return {
        createClassMutation,
        updateClassMutation,
        deleteClassMutation,
        createSectionMutation,
        updateSectionMutation,
        deleteSectionMutation,
        createFeeHeadMutation,
        createFeeStructureMutation,
        updateFeeStructureMutation,
        deleteFeeStructureMutation,
        createAcademicYearMutation,
        updateAcademicYearMutation,
        toggleAcademicYearStatusMutation,
    };
}
