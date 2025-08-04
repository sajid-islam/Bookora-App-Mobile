import { View, Text } from "react-native";
import React from "react";
import styles from "../assets/styles/profile.style";
import { Image } from "expo-image";
import { useAuthStore } from "../store/authStore";
import { FormattedDate } from "./../lib/utils";

export default function ProfileHeader() {
    const { user } = useAuthStore();

    return (
        <View style={styles.profileHeader}>
            <Image
                source={{ uri: user.profileImg }}
                style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.memberSince}>
                    Joined {FormattedDate(user.createdAt)}
                </Text>
            </View>
        </View>
    );
}
