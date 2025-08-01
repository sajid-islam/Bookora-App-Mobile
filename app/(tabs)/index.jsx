import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
} from "react-native";
import { useState, useEffect } from "react";
import { useAuthStore } from "./../../store/authStore";
import { baseUrl } from "../../constants/api";
import styles from "./../../assets/styles/home.style";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/color";
import { FormattedDate } from "../../lib/utils";
import Loader from "../../components/Loader";

export default function HomeScreen() {
    const { token } = useAuthStore();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

    const fetchBooks = async (pageNum = 1, refresh = false) => {
        if (refresh) setRefreshing(true);
        else if (pageNum === 1) setLoading(true);
        try {
            const response = await fetch(
                `${baseUrl}/book?page=${pageNum}&limit=2`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || "Failed to fetch books");

            const uniqueBooks = [];
            const combined = [...books, ...data.books];
            combined.forEach((book) => {
                if (!uniqueBooks.some((b) => b._id === book._id)) {
                    uniqueBooks.push(book);
                }
            });
            setBooks(uniqueBooks);
            setHasMore(pageNum < data.totalPages);
            setPage(pageNum);
        } catch (error) {
            console.log("Error fetching books", error);
        } finally {
            if (refresh) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const renderRatingStars = (rating) => {
        const star = [];
        for (let i = 1; i <= 5; i++) {
            star.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? "star" : "star-outline"}
                    size={16}
                    style={{ marginRight: 2 }}
                    color={i <= rating ? "#f4b400" : COLORS.textSecondary}
                />
            );
        }
        return star;
    };

    const renderItems = ({ item }) => (
        <View style={styles.bookCard}>
            <View style={styles.bookHeader}>
                <View style={styles.userInfo}>
                    <Image
                        source={{ uri: item.user.profileImg }}
                        style={styles.avatar}
                    />
                    <Text style={styles.username}>{item.user.username}</Text>
                </View>
            </View>
            <View style={styles.bookImageContainer}>
                <Image
                    source={item.image}
                    style={styles.bookImage}
                    contentFit="cover"
                />
            </View>
            <View style={styles.bookDetails}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.ratingContainer}>
                    {renderRatingStars(item.rating)}
                </View>
            </View>
            <Text style={styles.caption}>{item.caption}</Text>
            <Text style={styles.date}>
                Shared on {FormattedDate(item.createdAt)}
            </Text>
        </View>
    );

    const handleLoadMore = async () => {
        if (hasMore && !loading && !refreshing) {
            await fetchBooks(page + 1);
        }
    };

    if (loading) return <Loader />;

    return (
        <View style={styles.container}>
            <FlatList
                data={books}
                renderItem={renderItems}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchBooks(1, true)}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Bookora 💡</Text>
                        <Text style={styles.headerSubtitle}>
                            Discover great reads from the community👇
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    hasMore && books.length > 0 ? (
                        <ActivityIndicator
                            style={styles.footerLoader}
                            size="small"
                            color={COLORS.primary}
                        />
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="book-outline"
                            size={60}
                            color={COLORS.textSecondary}
                        />
                        <Text style={styles.emptyText}>
                            No recommendations yet
                        </Text>
                        <Text style={styles.emptySubtext}>
                            Be the first to share a book!
                        </Text>
                    </View>
                }
            />
        </View>
    );
}
