import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../api/settings.service";
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

export const SCHOOL_ADMIN_QUERY_KEYS = {
  SCHOOLS_LIST: ["getSchoolsSettingsList"],
  SCHOOL_DETAILS: (slug: string) => ["getSchoolDetails", slug],
  ACADEMIC_YEARS: (schoolId: number) => ["getAcademicYearsList", schoolId],
  FEE_HEADS: (schoolId: number) => ["getFeeHeadsList", schoolId],
};

export function useSchoolsList(enabled: boolean = true) {
  return useQuery({
    queryKey: SCHOOL_ADMIN_QUERY_KEYS.SCHOOLS_LIST,
    queryFn: settingsService.getAllSchools,
    enabled,
  });
}

export function useSchoolDetails(slug: string) {
  return useQuery({
    queryKey: SCHOOL_ADMIN_QUERY_KEYS.SCHOOL_DETAILS(slug),
    queryFn: () => settingsService.getSchoolDetails(slug),
    enabled: !!slug,
  });
}

export function useAcademicYears(schoolId: number) {
  return useQuery({
    queryKey: SCHOOL_ADMIN_QUERY_KEYS.ACADEMIC_YEARS(schoolId),
    queryFn: () => settingsService.getAcademicYears(schoolId),
    enabled: !!schoolId,
  });
}

export function useFeeHeads(schoolId: number) {
  return useQuery({
    queryKey: SCHOOL_ADMIN_QUERY_KEYS.FEE_HEADS(schoolId),
    queryFn: () => settingsService.getFeeHeads(schoolId),
    enabled: !!schoolId,
  });
}

export function useSchoolAdminMutations(options?: {
  schoolId?: number;
  slug?: string;
  onSuccessCallback?: () => void;
}) {
  const queryClient = useQueryClient();
  const { schoolId, slug, onSuccessCallback } = options || {};

  const invalidateSchoolDetails = () => {
    if (slug) {
      queryClient.invalidateQueries({ queryKey: SCHOOL_ADMIN_QUERY_KEYS.SCHOOL_DETAILS(slug) });
    }
    if (onSuccessCallback) {
      onSuccessCallback();
    }
  };

  const updateSchoolStatus = useMutation({
    mutationFn: ({ slug, status }: { slug: string; status: string }) =>
      settingsService.updateSchoolStatus(slug, status),
    onSuccess: (_, variables) => {
      toast.success(`Institute status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: SCHOOL_ADMIN_QUERY_KEYS.SCHOOLS_LIST });
      if (variables.slug === slug) {
        invalidateSchoolDetails();
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update status.");
    },
  });

  const createClass = useMutation({
    mutationFn: (dto: CreateClassDTO) => settingsService.createClass(dto),
    onSuccess: () => {
      toast.success("Class created successfully");
      invalidateSchoolDetails();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create class");
    },
  });

  const updateClass = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateClassDTO }) =>
      settingsService.updateClass(id, payload),
    onSuccess: () => {
      toast.success("Class updated successfully");
      invalidateSchoolDetails();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update class");
    },
  });

  const deleteClass = useMutation({
    mutationFn: (id: number) => settingsService.deleteClass(id),
    onSuccess: () => {
      toast.success("Class deleted successfully");
      invalidateSchoolDetails();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete class");
    },
  });

  const createSection = useMutation({
    mutationFn: (dto: CreateSectionDTO) => settingsService.createSection(dto),
    onSuccess: () => {
      toast.success("Section added successfully");
      invalidateSchoolDetails();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add section");
    },
  });

  const updateSection = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSectionDTO }) =>
      settingsService.updateSection(id, payload),
    onSuccess: () => {
      toast.success("Section updated successfully");
      invalidateSchoolDetails();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update section");
    },
  });

  const deleteSection = useMutation({
    mutationFn: (id: number) => settingsService.deleteSection(id),
    onSuccess: () => {
      toast.success("Section deleted successfully");
      invalidateSchoolDetails();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete section");
    },
  });

  const createFeeHead = useMutation({
    mutationFn: (dto: CreateFeeHeadDTO) => settingsService.createFeeHead(dto),
    onSuccess: () => {
      toast.success("Fee category created successfully");
      if (schoolId) {
        queryClient.invalidateQueries({ queryKey: SCHOOL_ADMIN_QUERY_KEYS.FEE_HEADS(schoolId) });
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create fee head");
    },
  });

  const createFeeStructure = useMutation({
    mutationFn: (dto: CreateFeeStructureDTO) => settingsService.createFeeStructure(dto),
    onSuccess: () => {
      toast.success("Fee structure mapped successfully");
      invalidateSchoolDetails();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create fee structure mapping");
    },
  });

  const updateFeeStructure = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateFeeStructureDTO }) =>
      settingsService.updateFeeStructure(id, payload),
    onSuccess: () => {
      toast.success("Fee structure updated successfully");
      invalidateSchoolDetails();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update fee structure");
    },
  });

  const deleteFeeStructure = useMutation({
    mutationFn: (id: number) => settingsService.deleteFeeStructure(id),
    onSuccess: () => {
      toast.success("Fee structure deleted successfully");
      invalidateSchoolDetails();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete fee structure");
    },
  });

  const createAcademicYear = useMutation({
    mutationFn: (dto: CreateAcademicYearDTO) => settingsService.createAcademicYear(dto),
    onSuccess: () => {
      toast.success("Academic year created successfully");
      if (schoolId) {
        queryClient.invalidateQueries({ queryKey: SCHOOL_ADMIN_QUERY_KEYS.ACADEMIC_YEARS(schoolId) });
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create academic year");
    },
  });

  const updateAcademicYear = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAcademicYearDTO }) =>
      settingsService.updateAcademicYear(id, payload),
    onSuccess: () => {
      toast.success("Academic year updated successfully");
      if (schoolId) {
        queryClient.invalidateQueries({ queryKey: SCHOOL_ADMIN_QUERY_KEYS.ACADEMIC_YEARS(schoolId) });
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update academic year");
    },
  });

  const toggleAcademicYearStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      settingsService.toggleAcademicYearStatus(id, status),
    onSuccess: () => {
      toast.success("Academic year status updated");
      if (schoolId) {
        queryClient.invalidateQueries({ queryKey: SCHOOL_ADMIN_QUERY_KEYS.ACADEMIC_YEARS(schoolId) });
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to toggle status");
    },
  });

  return {
    updateSchoolStatus,
    createClass,
    updateClass,
    deleteClass,
    createSection,
    updateSection,
    deleteSection,
    createFeeHead,
    createFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    createAcademicYear,
    updateAcademicYear,
    toggleAcademicYearStatus,
  };
}
