import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "./../constants/api";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,

    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(
                `${baseUrl}/auth/register`,

                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                    }),
                }
            );
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || "Something went wrong");

            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok)
                throw new Error(data.message || "Something went wrong");

            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));

            set({ token: data.token, user: data.user, isLoading: false });

            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { error: error.message, success: false };
        }
    },

    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const userJson = await AsyncStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;
            set({ token, user });
        } catch (error) {
            console.log("Auth check failed", error);
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            set({ token: null, user: null });
        } catch (error) {
            console.log("Logout failed", error);
        }
    },
}));
