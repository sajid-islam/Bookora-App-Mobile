import {
    View,
    Text,
    Alert,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.style";
import { baseUrl } from "../../constants/api";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/color";
import { Image } from "expo-image";
import { FormattedDate } from "../../lib/utils";
import { useRouter } from "expo-router";
import Loader from "./../../components/Loader";

export default function ProfileScreen() {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [deleteBookId, setDeleteBookId] = useState(null);

    const { user, token } = useAuthStore();
    const router = useRouter();

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

    const renderRatingStars = (rating) => {
        const star = [];
        for (let i = 1; i <= 5; i++) {
            star.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? "star" : "star-outline"}
                    color={i <= rating ? "#f6b400" : COLORS.textSecondary}
                    size={16}
                />
            );
        }
        return star;
    };

    const handleDelete = async (bookId) => {
        try {
            setDeleteBookId(bookId);

            const response = await fetch(`${baseUrl}/book/${bookId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || "Failed to delete book");

            setBooks(books.filter((book) => book._id !== bookId));
            Alert.alert("Success", "Recommendation deleted successfully");
        } catch (error) {
            Alert.alert(
                "Error",
                error.message || "Failed to delete recommendation"
            );
        } finally {
            setDeleteBookId(null);
        }
    };

    const confirmDelete = (bookId) => {
        Alert.alert(
            "Delete Recommendation",
            "Are you sure you want to delete this recommendation?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        handleDelete(bookId);
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.bookItem}>
            <Image source={item.image} style={styles.bookImage} />
            <View style={styles.bookInfo}>
                <Text style={styles.booksTitle}>{item.title}</Text>
                <Text>{renderRatingStars(item.rating)}</Text>
                <Text style={styles.bookCaption}>{item.caption}</Text>
                <Text style={styles.bookDate}>
                    {FormattedDate(item.createdAt)}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item._id)}
            >
                {deleteBookId === item._id ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                    <Ionicons
                        name="trash-outline"
                        size={20}
                        color={COLORS.primary}
                    />
                )}
            </TouchableOpacity>
        </View>
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    if (!user) return null;
    if (loading && !refreshing) return <Loader />;

    return (
        <View style={styles.container}>
            <ProfileHeader />
            <LogoutButton />
            {/* YOUR RECOMMENDATION */}
            <View style={styles.booksHeader}>
                <Text style={styles.booksTitle}>Your Recommendation 📚</Text>
                <Text style={styles.booksCount}>{books.length} books</Text>
            </View>
            <FlatList
                data={books}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.booksList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="book-outline"
                            size={50}
                            color={COLORS.textSecondary}
                        />
                        <Text style={styles.emptyText}>
                            No recommendations yet
                        </Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push("/create")}
                        >
                            <Text style={styles.addButtonText}>
                                Add Your First Book
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}
