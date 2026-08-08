import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesPermissionsService } from "../api/rolesPermissions.service";
import { ROLES_PERMISSIONS_QUERY_KEYS } from "../constants/rolesPermissions.constants";
import { CreateRolePayload, UpdateRolePermissionsPayload } from "../types/rolesPermissions.types";
import toast from "react-hot-toast";

export function useRolesList() {
    return useQuery({
        queryKey: [ROLES_PERMISSIONS_QUERY_KEYS.ROLES_LIST],
        queryFn: rolesPermissionsService.getAllRoles,
        refetchOnWindowFocus: false,
    });
}

export function usePermissionsList() {
    return useQuery({
        queryKey: [ROLES_PERMISSIONS_QUERY_KEYS.PERMISSIONS_LIST],
        queryFn: rolesPermissionsService.getAllPermissions,
        refetchOnWindowFocus: false,
    });
}

export function useRolesPermissionsMutations() {
    const queryClient = useQueryClient();

    const updatePermissionsMutation = useMutation({
        mutationFn: (payload: UpdateRolePermissionsPayload) =>
            rolesPermissionsService.updateRolePermissions(payload),
        onSuccess: () => {
            toast.success("Role configurations saved to database!");
            queryClient.invalidateQueries({ queryKey: [ROLES_PERMISSIONS_QUERY_KEYS.ROLES_LIST] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to sync role permissions.");
        }
    });

    const createRoleMutation = useMutation({
        mutationFn: (payload: CreateRolePayload) =>
            rolesPermissionsService.createRole(payload),
        onSuccess: () => {
            toast.success("Role created successfully in database!");
            queryClient.invalidateQueries({ queryKey: [ROLES_PERMISSIONS_QUERY_KEYS.ROLES_LIST] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create security role.");
        }
    });

    const deleteRoleMutation = useMutation({
        mutationFn: (roleId: number) =>
            rolesPermissionsService.deleteRole(roleId),
        onSuccess: () => {
            toast.success("Role deleted successfully!");
            queryClient.invalidateQueries({ queryKey: [ROLES_PERMISSIONS_QUERY_KEYS.ROLES_LIST] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete role.");
        }
    });

    return {
        updatePermissionsMutation,
        createRoleMutation,
        deleteRoleMutation
    };
}
