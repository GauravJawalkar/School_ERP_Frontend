import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import {
    Role,
    PermissionGroup,
    CreateRolePayload,
    UpdateRolePermissionsPayload
} from "../types/rolesPermissions.types";

export const rolesPermissionsService = {
    getAllRoles: async (): Promise<Role[]> => {
        const response = await ApiClient.get(`${BASE_URL}/roles/getAllRoles`);
        return response.data?.data || [];
    },

    getAllPermissions: async (): Promise<PermissionGroup[]> => {
        const response = await ApiClient.get(`${BASE_URL}/roles/getAllPermissions`);
        return response.data?.data || [];
    },

    updateRolePermissions: async (payload: UpdateRolePermissionsPayload) => {
        const response = await ApiClient.put(`${BASE_URL}/roles/updateRolePermissions`, payload);
        return response.data;
    },

    createRole: async (payload: CreateRolePayload) => {
        const response = await ApiClient.post(`${BASE_URL}/roles/createRole`, payload);
        return response.data;
    },

    deleteRole: async (roleId: number) => {
        const response = await ApiClient.delete(`${BASE_URL}/roles/deleteRole`, {
            data: { roleId }
        });
        return response.data;
    }
};
