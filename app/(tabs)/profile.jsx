import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.style";
import { baseUrl } from "../../constants/api";

export default function ProfileScreen() {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { user, token } = useAuthStore();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/book/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || "Failed to fetch user books");

            setBooks(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            Alert.alert(
                "Error",
                "Failed to load profile data. Pull down to refresh."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!user) return null;

    return (
        <View style={styles.container}>
            <ProfileHeader />
            <LogoutButton />
            {/* YOUR RECOMMENDATION */}
            <View style={styles.booksHeader}>
                <Text style={styles.booksTitle}>Your Recommendation 📚</Text>
                <Text style={styles.booksCount}>{books.length} books</Text>
            </View>
        </View>
    );
}
