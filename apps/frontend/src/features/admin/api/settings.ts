// API hooks for admin settings
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { BusinessSettings, SettingsUpdate } from "../types/settings";

export const settingsQueryKeys = {
    all: ["admin", "settings"] as const,
};

// Fetch settings
async function fetchSettings(): Promise<BusinessSettings> {
    const { data } = await apiClient.get("/admin/settings");
    return data;
}

export function useAdminSettings() {
    return useQuery({
        queryKey: settingsQueryKeys.all,
        queryFn: fetchSettings,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// Update settings
async function updateSettings(data: SettingsUpdate): Promise<BusinessSettings> {
    const { data: result } = await apiClient.put("/admin/settings", data);
    return result;
}

export function useUpdateSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
        },
    });
}

// Reset settings
async function resetSettings(): Promise<BusinessSettings> {
    const { data } = await apiClient.post("/admin/settings/reset");
    return data;
}

export function useResetSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: resetSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
        },
    });
}
