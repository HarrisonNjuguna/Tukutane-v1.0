import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import { useLayoutEffect } from 'react';
import axios from 'axios'; // Make sure to import axios

const categoriesData = [ "All", "Music", "Tech", "Sports", "Fashion", "Fitness", "Art"];
const eventsData = [
    { id: 1, image: 'image-url', category: 'Music', date: '2024-11-01', location: 'Nairobi', price: 1000, description: 'Join us for a night of live music!', rating: 4.5, title: 'Live Music Night' },
    { id: 2, image: 'image-url', category: 'Tech', date: '2024-11-05', location: 'Mombasa', price: 1500, description: 'Explore the latest in technology.', rating: 4.0, title: 'Tech Expo 2024' },
    { id: 3, image: 'image-url', category: 'Sports', date: '2024-11-10', location: 'Nairobi', price: 2000, description: 'Catch the big game live!', rating: 5.0, title: 'Football Match' },
    { id: 4, image: 'image-url', category: 'Fashion', date: '2024-11-15', location: 'Mombasa', price: 1200, description: 'Fashion show featuring top designers.', rating: 4.8, title: 'Fashion Week' },
    { id: 5, image: 'image-url', category: 'Art', date: '2024-11-20', location: 'Nairobi', price: 800, description: 'Art exhibition showcasing local artists.', rating: 4.7, title: 'Local Artists Exhibition' },
    { id: 6, image: 'image-url', category: 'Fitness', date: '2024-11-25', location: 'Mombasa', price: 500, description: 'Join our outdoor fitness bootcamp!', rating: 4.6, title: 'Outdoor Bootcamp' },
];

const HomeScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({ category: '', date: '', priceRange: [0, 2500] });
    const [location, setLocation] = useState('Getting location...');
    const [favorites, setFavorites] = useState([]); // State to hold favorite events

    useLayoutEffect(() => {
        navigation.setOptions({
            gestureEnabled: false, // Disable swipe back gesture
        });
    }, [navigation]);

    useEffect(() => {
        const fetchLocation = async () => {
            // Request location permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocation('Permission to access location was denied');
                return;
            }

            // Get the current location
            let currentLocation = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = currentLocation.coords;
            reverseGeocode(latitude, longitude);
        };

        fetchLocation();
    }, []);

    const reverseGeocode = async (latitude, longitude) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            if (response.data && response.data.address) {
                const { city, town } = response.data.address;
                const locationName = city || town || 'Location not found';
                setLocation(locationName);
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            setLocation('Unable to fetch location');
        }
    };
    
    const handleCategoryPress = (category) => {
        setSelectedCategory(category);
    };

    const applyFilters = () => {
        setFilterModalVisible(false);
    };

    const resetFilters = () => {
        setSelectedFilters({ category: '', date: '', priceRange: [0, 2500] });
    };

    const filteredEvents = eventsData.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedFilters.category ? event.category === selectedFilters.category : true) &&
        (event.price >= selectedFilters.priceRange[0] && event.price <= selectedFilters.priceRange[1])
    );

    const renderCategoryButton = (category) => {
        const isActive = selectedCategory === category;
        return (
            <TouchableOpacity
                key={category}
                style={[styles.categoryButton, isActive ? styles.activeCategory : styles.inactiveCategory]}
                onPress={() => handleCategoryPress(category)}
            >
                <Text style={styles.categoryButtonText}>{category}</Text>
                {isActive && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon} />}
            </TouchableOpacity>
        );
    };

    const handleRSVP = (event) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.some(fav => fav.id === event.id)) {
                return prevFavorites; // If already a favorite, don't add again
            }
            return [...prevFavorites, event]; // Add to favorites
        });
    };
    
    const navigateToFavorites = () => {
        navigation.navigate('Favorites', { favorites }); // Pass favorites when navigating
    };

    const navigateToExplore = () => {
        navigation.navigate('ExploreScreen', { events: eventsData });
    };

    const renderEventCard = (event) => (
        <TouchableOpacity 
            style={styles.eventCard} 
            onPress={() => navigation.navigate('EventDetails', { event })} 
        >
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventCategory}>{event.category}</Text>
            <Text style={styles.eventDate}>{event.date}</Text>
            <Text style={styles.eventLocation}>{event.location}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
            <Text style={styles.eventRating}>Rating: {event.rating} ★</Text>
            <Text style={styles.eventPrice}>Ksh. {event.price}/Person</Text>
            <TouchableOpacity 
                style={styles.rsvpButton}
                onPress={() => handleRSVP(event)} // Call handleRSVP on button press
            >
                <Text style={styles.rsvpButtonText}>RSVP</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.locationButton}>
                    <Ionicons name="location" size={24} color="#fff" />
                    <Text style={styles.locationText}>{location}</Text> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons name="notifications-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Search and Filter */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Events, Organizer"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                    <Ionicons name="filter" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Filter Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filter Events</Text>
                        
                        <Text style={styles.title}>Select Category:</Text>
                        {categoriesData.map(category => (
                            <TouchableOpacity key={category} onPress={() => setSelectedFilters({ ...selectedFilters, category })}>
                                <Text style={selectedFilters.category === category ? styles.selectedFilter : styles.filterText}>{category}</Text>
                            </TouchableOpacity>
                        ))}

                        <Text style={styles.title}>Select Price Range:</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={10000}
                            value={selectedFilters.priceRange[0]}
                            onValueChange={(value) => setSelectedFilters({ ...selectedFilters, priceRange: [value, selectedFilters.priceRange[1]] })}
                            step={100}
                        />
                        <Text style={styles.sliderValue}>Min: Ksh. {selectedFilters.priceRange[0]}</Text>

                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={10000}
                            value={selectedFilters.priceRange[1]}
                            onValueChange={(value) => setSelectedFilters({ ...selectedFilters, priceRange: [selectedFilters.priceRange[0], value] })}
                            step={100}
                        />
                        <Text style={styles.sliderValue}>Max: Ksh. {selectedFilters.priceRange[1]}</Text>

                        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                            <Text style={styles.resetButtonText}>Reset Filters</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Scrollable Sections */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Categories Section */}
                <View style={styles.categoriesHeader}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <TouchableOpacity onPress={navigateToExplore}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={categoriesData}
                    horizontal
                    renderItem={({ item }) => renderCategoryButton(item)}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.categoriesList}
                    showsHorizontalScrollIndicator={false}
                />

                {/* For You Section */}
                <View style={styles.eventsSectionHeader}>
                    <Text style={styles.sectionTitle}>For You</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AllEvents', { title: 'For You', events: filteredEvents })}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={filteredEvents}
                    horizontal
                    renderItem={({ item }) => renderEventCard(item)}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.eventsList}
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 20 }}
                />

                {/* Upcoming Events Section */}
                <View style={styles.eventsSectionHeader}>
                    <Text style={styles.sectionTitle}>Upcoming Events</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AllEvents', { title: 'Upcoming Events', events: eventsData })}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={eventsData}
                    horizontal
                    renderItem={({ item }) => renderEventCard(item)}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.eventsList}
                    showsHorizontalScrollIndicator={false}
                />

                {/* Nearby Events Section */}
                <View style={styles.eventsSectionHeader}>
                    <Text style={styles.sectionTitle}>Nearby Events</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AllEvents', { title: 'Nearby Events', events: eventsData })}>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={eventsData}
                    horizontal
                    renderItem={({ item }) => renderEventCard(item)}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.eventsList}
                    showsHorizontalScrollIndicator={false}
                />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 20,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 10,
    },
    locationText: {
        color: '#fff',
        marginLeft: 10,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 15,
        fontWeight: 'medium',
    },
    notificationButton: {
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingHorizontal: 20,
        marginRight: 10,
        height: 50,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'flex-start',
        elevation: 5,
    },
    slider: {
        width: '100%',
        marginVertical: 10,
    },
    sliderValue: {
        fontSize: 12,
        color: '#333',
    },
    resetButton: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'stretch',
        alignItems: 'center',
        marginTop: 10,
    },
    resetButtonText: {
        color: '#111',
        fontWeight: 'bold',
    },
    filterButton: {
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 30,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'flex-start',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    applyButton: {
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'stretch',
        alignItems: 'center',
        marginTop: 20,
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeButton: {
        color: '#ff7518',
        marginTop: 10,
    },
    selectedFilter: {
        fontWeight: 'bold',
        color: '#ff7518',
        marginVertical: 5,
    },
    filterText: {
        marginVertical: 5,
    },
    categoriesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    seeAllText: {
        color: '#ff7518',
        fontSize: 14,
        fontWeight: 'bold',
    },
    categoriesList: {
        marginBottom: 20,
    },categoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        height: 50,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, // Add shadow
    },
    activeCategory: {
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
    inactiveCategory: {
        backgroundColor: '#e0e0e0',
    },
    categoryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    checkIcon: {
        marginLeft: 10,
    },
    categoryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    eventsSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    eventsList: {
        marginBottom: 20,
    },
    eventCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginRight: 20,
        padding: 15,
        width: 220,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    eventImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        marginBottom: 10,
    },
    eventTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    eventCategory: {
        fontSize: 12,
        color: '#ff7518',
    },
    eventDate: {
        color: '#333',
    },
    eventLocation: {
        color: '#555',
    },
    eventDescription: {
        color: '#666',
        marginVertical: 5,
    },
    eventRating: {
        color: '#ff7518',
        fontWeight: 'bold',
    },
    eventPrice: {
        color: '#333',
        fontWeight: 'bold',
    },
    rsvpButton: {
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    rsvpButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
});

export default HomeScreen;
