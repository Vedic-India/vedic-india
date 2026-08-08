"use client";

import {
    createContext,
    useContext,
    useMemo,
    useEffect,
} from "react";

import { useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "@/services/auth.service";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { queryKeys } from "@/constants/queryKeys";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading,
    } = useCurrentUser();

    const login = async () => {
        await queryClient.invalidateQueries({
            queryKey: queryKeys.currentUser,
        });
    };

    const updateUser = (updatedUser) => {
        queryClient.setQueryData(
            queryKeys.currentUser,
            updatedUser
        );
    };

    const logout = async () => {
        try {
            await logoutUser();
        } finally {

            queryClient.clear();
        }
    };

    const value = useMemo(
        () => ({
            user,

            isAuthenticated: !!user,

            isLoading,

            login,

            logout,

            updateUser,
        }),
        [user, isLoading]
    );

    useEffect(() => {
    const handleAuthLogout = () => {
        queryClient.clear();
    };

    window.addEventListener("auth:logout", handleAuthLogout);

    return () => {
        window.removeEventListener("auth:logout", handleAuthLogout);
    };
    }, [queryClient]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};