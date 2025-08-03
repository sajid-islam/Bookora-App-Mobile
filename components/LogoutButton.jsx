import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/color";
import styles from "../assets/styles/create.style";
import { useAuthStore } from "../store/authStore";

export default function LogoutButton() {
    const { logout } = useAuthStore();

    const confirmLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", onPress: () => logout(), style: "destructive" },
        ]);
    };
    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={confirmLogout}>
                <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
