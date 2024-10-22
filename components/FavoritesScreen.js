import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categoriesData = ["All", "Music", "Tech", "Sports", "Fashion", "Fitness", "Art"];

const FavoritesScreen = ({ navigation, route }) => {
    const [favoriteEvents, setFavoriteEvents] = useState([]);

    // Update favorites when navigating from the home screen
    useEffect(() => {
        if (route.params?.newEvent) {
            setFavoriteEvents((prevFavorites) => [...prevFavorites, route.params.newEvent]);
        }
    }, [route.params?.newEvent]);

    const filteredFavorites = favoriteEvents; // Display all favorites for now

    const renderCategoryButton = (category) => {
        const isSelected = category === "All";
        return (
            <TouchableOpacity
                key={category}
                style={[styles.categoryButton, isSelected && styles.selectedCategory]}
                onPress={() => console.log(`Selected category: ${category}`)}
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
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {filteredFavorites.map(event => renderFavoriteCard(event))}
            </ScrollView>
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
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
        backgroundColor: '#ff7518',
        borderRadius: 30,
        marginRight: 10,
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
        paddingBottom: 20,
    },
});

export default FavoritesScreen;
