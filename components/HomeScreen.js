import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as Location from 'expo-location';
import { getFirestore, collection, query, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { firebase } from '../firebase/firebase'; // assuming you have your Firebase config here

const categoriesData = ["All", "Music", "Tech", "Sports", "Fashion", "Fitness", "Art"];

const HomeScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({ category: '', date: '', priceRange: [0, 2500] });
    const [location, setLocation] = useState('Getting location...');
    const [events, setEvents] = useState([]);
    const [userInterests, setUserInterests] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null); // State for error message

    const db = getFirestore(firebase);

    useLayoutEffect(() => {
        navigation.setOptions({
            gestureEnabled: false, // Disable swipe back gesture
        });
    }, [navigation]);

    // Get user's location
    useEffect(() => {
        const fetchLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocation('Permission to access location was denied');
                return;
            }
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

    // Fetch User Interests from Firebase (or from wherever they are stored)
    useEffect(() => {
        const fetchUserInterests = async () => {
            try {
                const userRef = doc(db, 'users', 'userId');  // Use the actual user ID
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setUserInterests(userDoc.data().interests || []);
                } else {
                    setErrorMessage('There was an issue saving your interests, please try again.');
                }
            } catch (error) {
                console.error('Error fetching user interests:', error);
                setErrorMessage('There was an issue saving your interests, please try again.');
            }
        };

        fetchUserInterests();
    }, []);

    // Fetch Events from Firestore
    useEffect(() => {
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, orderBy('date'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const eventsList = [];
            querySnapshot.forEach((doc) => {
                eventsList.push({ id: doc.id, ...doc.data() });
            });
            setEvents(eventsList);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    // Function to filter events based on search query
    const filterEvents = () => {
        return events.filter(event => {
            const titleMatch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
            const categoryMatch = selectedCategory === 'All' || event.category === selectedCategory;
            return titleMatch && categoryMatch;
        });
    };

    // Filter Events based on User Interests
    const filterEventsByInterest = () => {
        if (userInterests.length === 0) return filterEvents(); // No filters applied if no interests are selected
        return filterEvents().filter(event => userInterests.includes(event.category));
    };

    // Format Date
    const formatDate = (timestamp) => {
        if (!timestamp) return 'No date available';
        const date = new Date(timestamp.seconds * 1000); 
        return date.toLocaleDateString();
    };

    // Render Event Card
    const renderEventCard = (event) => {
        const formattedDate = formatDate(event.date);
        const price = event.price ? `Ksh. ${event.price}/Person` : 'Price not available';
        const rating = event.rating ? `Rating: ${event.rating} ★` : 'No rating available';
        const imageUri = event.image || 'https://placekitten.com/200/200'; // Default image if not provided

        return (
            <TouchableOpacity 
                style={styles.eventCard} 
                onPress={() => navigation.navigate('EventDetails', { event })} 
            >
                <Image source={{ uri: imageUri }} style={styles.eventImage} />
                <Text style={styles.eventTitle}>{event.title || 'Event title not available'}</Text>
                <Text style={styles.eventCategory}>{event.category || 'Category not available'}</Text>
                <Text style={styles.eventDate}>{formattedDate}</Text>
                <Text style={styles.eventLocation}>{event.location || 'Location not available'}</Text>
                <Text style={styles.eventDescription}>{event.description || 'Description not available'}</Text>
                <Text style={styles.eventRating}>{rating}</Text>
                <Text style={styles.eventPrice}>{price}</Text>
                <TouchableOpacity 
                    style={styles.rsvpButton}
                    onPress={() => handleRSVP(event)} 
                >
                    <Text style={styles.rsvpButtonText}>RSVP</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

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

            {/* Error message */}
            {errorMessage && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                </View>
            )}

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

            {/* Categories (Scrollable Row) */}
            <View style={styles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categoriesData.map((category) => (
                        <TouchableOpacity 
                            key={category} 
                            style={[
                                styles.categoryButton, 
                                selectedCategory === category && styles.selectedCategoryButton
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text style={styles.categoryButtonText}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>


            {/* Events */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>For You</Text>
                    <View style={styles.sectionContent}>
                        {filterEventsByInterest().length === 0 ? (
                            // Message when no events match interests
                            <View style={styles.noEventsMessageContainer}>
                                <Text style={styles.noEventsMessage}>No events matching your interests.</Text>
                            </View>
                        ) : (
                            // FlatList with events if available
                            <FlatList
                                data={filterEventsByInterest()}
                                horizontal
                                renderItem={({ item }) => renderEventCard(item)}
                                keyExtractor={(item) => item.id.toString()}
                                showsHorizontalScrollIndicator={false}
                            />
                        )}
            
                        {/* See All button */}
                        <TouchableOpacity onPress={() => navigation.navigate('Category', { category: 'For You' })}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Upcoming Events</Text>
                    <View style={styles.seeAllContainer}>
                        <FlatList
                            data={events}
                            horizontal
                            renderItem={({ item }) => renderEventCard(item)}
                            keyExtractor={(item) => item.id.toString()}
                            showsHorizontalScrollIndicator={false}
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('Category', { category: 'Upcoming Events' })}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nearby Events</Text>
                    <View style={styles.seeAllContainer}>
                        <FlatList
                            data={events}
                            horizontal
                            renderItem={({ item }) => renderEventCard(item)}
                            keyExtractor={(item) => item.id.toString()}
                            showsHorizontalScrollIndicator={false}
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('Category', { category: 'Nearby Events' })}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    },categoriesContainer: {
        flexDirection: 'row',  // Ensure buttons are laid out in a row
        paddingHorizontal: 10, // Padding around the container
        marginVertical: 10,   // Spacing between the container and other content
        justifyContent: 'flex-start', // Align the buttons to the start of the container
    },
    
    categoryButton: {
        paddingVertical: 12, 
        paddingHorizontal: 20, 
        marginRight: 12, 
        borderRadius: 25, 
        backgroundColor: '#c0c0c0', 
        justifyContent: 'center', // Center content inside button
        alignItems: 'center', // Ensure the text is aligned properly
    },
    sectionContent: {
        flex: 1,
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        paddingHorizontal: 10,  // Add padding if needed
    },
    noEventsMessageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,  // Add space from top if needed
    },
    
    noEventsMessage: {
        fontSize: 16,  // Adjust text size
        color: '#c0c0c0',  // Gray color for the message
        textAlign: 'center',  // Center align the text
        fontWeight: 'bold',  // Optional, to make the message stand out
    },
    categoryButtonText: {
        fontSize: 14, // Adjust text size to make it fit properly
        fontWeight: 'bold', // Bold text for better visibility
        color: '#fff', // Dark color for text
    },
    
    selectedCategoryButton: {
        backgroundColor: '#ff7518', // Color for the selected category
        color: '#fff', // White text color for selected category
    },
    
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    errorContainer: {
        padding: 10,
        backgroundColor: '#ffeb3b',
        marginBottom: 20,
    },
    errorMessage: {
        color: '#d32f2f',
        fontWeight: 'bold',
    },
    seeAllContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seeAllText: {
        color: '#ff7518',
        fontSize: 14,
        fontWeight: 'bold',
    },
    scrollContainer: {
        paddingBottom: 50,
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
    emptyEventCard: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    emptyEventText: {
        color: '#999',
        fontSize: 16,
    },
});

export default HomeScreen;
