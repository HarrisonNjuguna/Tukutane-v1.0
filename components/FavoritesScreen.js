import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categoriesData = ["All", "Music", "Tech", "Sports", "Fashion", "Fitness", "Art"];

const FavoritesScreen = ({ navigation, route }) => {
    const [favoriteEvents, setFavoriteEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Load favorites from AsyncStorage
    useEffect(() => {
        const loadFavorites = async () => {
            const savedFavorites = await AsyncStorage.getItem('favorites');
            if (savedFavorites) {
                setFavoriteEvents(JSON.parse(savedFavorites));
            }
        };
        loadFavorites();
    }, []);

    // Update favorites when navigating from the home screen
    useEffect(() => {
        if (route.params?.newEvent) {
            setFavoriteEvents((prevFavorites) => {
                const updatedFavorites = [...prevFavorites, route.params.newEvent];
                AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Save to AsyncStorage
                return updatedFavorites;
            });
        }
    }, [route.params?.newEvent]);

    // Filter favorites based on selected category
    const filteredFavorites = selectedCategory === "All"
        ? favoriteEvents
        : favoriteEvents.filter(event => event.category === selectedCategory);

    const renderCategoryButton = (category) => {
        const isSelected = category === selectedCategory;
        return (
            <TouchableOpacity
                key={category}
                style={[styles.categoryButton, isSelected && styles.selectedCategory]}
                onPress={() => setSelectedCategory(category)}
            >
                <Text style={[styles.categoryButtonText, isSelected && styles.selectedCategoryText]}>
                    {category}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={16} color="#fff" style={styles.checkIcon} />}
            </TouchableOpacity>
        );
    };

    const renderFavoriteCard = (event) => (
        <TouchableOpacity 
            style={styles.favoriteCard} 
            onPress={() => navigation.navigate('EventDetails', { event })} 
        >
            <Text style={styles.favoriteTitle}>{event.title}</Text>
            <Text style={styles.favoriteCategory}>{event.category}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Favorites</Text>
            </View>

            {/* Categories Section */}
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
                data={categoriesData}
                horizontal
                renderItem={({ item }) => renderCategoryButton(item)}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.categoriesList}
                showsHorizontalScrollIndicator={false}
            />

            {/* Favorites List */}
            <FlatList
                contentContainerStyle={styles.scrollContainer}
                data={filteredFavorites}
                renderItem={({ item }) => renderFavoriteCard(item)}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.noFavoritesText}>No favorite events found.</Text>
                }
             />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 60,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    categoriesList: {
        marginBottom: 20,
    },
    categoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        height: 50,
        marginHorizontal: 5,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    selectedCategory: {
        backgroundColor: '#ff7518',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    categoryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    selectedCategoryText: {
        color: '#fff',
    },
    checkIcon: {
        marginLeft: 10,
    },
    favoriteCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    favoriteTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#333',
    },
    favoriteCategory: {
        fontSize: 14,
        color: '#ff7518',
        marginTop: 4,
    },
    scrollContainer: {
        paddingBottom: 500,
        padding: 1,
    },
    noFavoritesText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default FavoritesScreen;
