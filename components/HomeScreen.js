import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    ScrollView,
    Modal,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import { db } from '../firebase/firebase';
import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';

const categories = ['All', 'Music', 'Tech', 'Sports', 'Community', 'Religious'];

export default function HomeScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userName, setUserName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [newEvent, setNewEvent] = useState({
        name: '',
        organizer: '',
        price: '',
        category: '',
        description: '',
        location: '',
        imageUrl: '',
    });
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [ticketCount, setTicketCount] = useState(1);

    // Dummy data
    const dummyEvents = [
        {
            id: '1',
            name: 'Tech Conference 2024',
            organizer: 'Tech Community',
            price: '2000',
            category: 'Tech',
            description: 'Join us for a day of learning about the latest in tech.',
            location: 'City Center',
            date: '2024-11-15',
            imageUrl: 'https://example.com/tech-conference.jpg',
        },
        {
            id: '2',
            name: 'Music Fest',
            organizer: 'Music Lovers',
            price: '1500',
            category: 'Music',
            description: 'Enjoy live music from top artists.',
            location: 'Open Air Arena',
            date: '2024-10-20',
            imageUrl: 'https://example.com/music-fest.jpg',
        },
        {
            id: '3',
            name: 'Community Clean Up',
            organizer: 'Local Volunteers',
            price: 'Free',
            category: 'Community',
            description: 'Join us to keep our community clean.',
            location: 'Local Park',
            date: '2024-10-12',
            imageUrl: 'https://example.com/community-clean-up.jpg',
        },
        {
            id: '4',
            name: 'Football Tournament',
            organizer: 'Sports Club',
            price: '500',
            category: 'Sports',
            description: 'Participate in our annual football tournament.',
            location: 'Main Stadium',
            date: '2024-10-25',
            imageUrl: 'https://example.com/football-tournament.jpg',
        },
        {
            id: '5',
            name: 'Religious Gathering',
            organizer: 'Faith Leaders',
            price: 'Free',
            category: 'Religious',
            description: 'A gathering for spiritual growth and community.',
            location: 'Community Hall',
            date: '2024-10-30',
            imageUrl: 'https://example.com/religious-gathering.jpg',
        },
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
    
            if (user) {
                const userDoc = await getDocs(collection(db, 'users'));
                const userData = userDoc.docs.find(doc => doc.id === user.uid);
                if (userData) {
                    setUserName(userData.data().username);
                }
            }
        };
    
        const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEvents(eventsData);
            setFilteredEvents(eventsData);
            setLoading(false);
        });
    
        // If no events fetched from Firestore, set dummy data
        if (events.length === 0) {
            setEvents(dummyEvents);
            setFilteredEvents(dummyEvents);
            setLoading(false);
        }
    
        fetchUserData();
    
        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);
    

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
    
            if (user) {
                const userDoc = await getDocs(collection(db, 'users'));
                const userData = userDoc.docs.find(doc => doc.id === user.uid);
                if (userData) {
                    setUserName(userData.data().username);
                }
            }
        };
    
        const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEvents(eventsData);
            setFilteredEvents(eventsData);
            setLoading(false);
        });
    
        // If no events fetched from Firestore, set dummy data
        if (events.length === 0) {
            setEvents(dummyEvents);
            setFilteredEvents(dummyEvents);
            setLoading(false);
        }
    
        fetchUserData();
    
        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);
    

    const handleCategoryPress = (category) => {
        setActiveCategory(category);
        if (category === 'All') {
            setFilteredEvents(events);
        } else {
            setFilteredEvents(events.filter(event => event.category === category));
        }
    };

    const handleCreateEventSubmit = async () => {
        await addDoc(collection(db, 'events'), { ...newEvent });
        setNewEvent({
            name: '',
            organizer: '',
            price: '',
            category: '',
            description: '',
            location: '',
            imageUrl: '',
        });
        setModalVisible(false); // Close the modal after submission
    };
    

    const openCreateEventModal = () => {
        setModalVisible(true);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setNewEvent({ ...newEvent, imageUrl: result.assets[0].uri });
        }
    };

    const handleEventPress = (event) => {
        setSelectedEvent(event);
        setTicketCount(1); // Reset ticket count when opening event
    };

    const handleFavoriteToggle = (eventId) => {
        setFavorites(prevFavorites => {
            if (prevFavorites.includes(eventId)) {
                return prevFavorites.filter(id => id !== eventId);
            }
            return [...prevFavorites, eventId];
        });
    };

    const handleShare = async (event) => {
        await Clipboard.setStringAsync(`Check out this event: ${event.name}\nLocation: ${event.location}\nPrice: Ksh. ${event.price}`);
        alert('Event details copied to clipboard!');
    };

    const handleBuyTickets = () => {
        alert(`You've purchased ${ticketCount} ticket(s) for ${selectedEvent.name}!`);
        setSelectedEvent(null);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingText}>Discover. Socialize. Repeat</Text>
            </View>
        );
    }

    const upcomingEvents = filteredEvents.filter(event => new Date(event.date) > new Date());
    const nearbyEvents = filteredEvents.filter(event => event.location === 'Your Location'); // Modify condition as necessary

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Hi {userName || 'User'}, Welcome.</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                    <Ionicons name="notifications-outline" size={30} color="#FFD700" />
                </TouchableOpacity>
            </View>

            <TextInput
                placeholder="Search for events..."
                style={styles.searchBar}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <View style={styles.scrollContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                    {categories.map(category => (
                        <TouchableOpacity
                            key={category}
                            style={[styles.categoryButton, activeCategory === category && styles.activeCategoryButton]}
                            onPress={() => handleCategoryPress(category)}
                        >
                            <Text style={[styles.categoryButtonText, activeCategory === category && styles.activeCategoryButtonText]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Upcoming Events Section */}
                <View style={styles.section}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Upcoming Events</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {upcomingEvents.filter(event => 
                            event.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map(event => (
                            <TouchableOpacity key={event.id} onPress={() => handleEventPress(event)}>
                                <View style={styles.eventCard}>
                                    {event.imageUrl && (
                                        <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
                                    )}
                                    <View style={styles.eventDetails}>
                                        <Text style={styles.eventName}>{event.name}</Text>
                                        <Text style={styles.eventCategory}>{event.category}</Text>
                                        <Text style={styles.eventDate}>{new Date(event.date).toDateString()}</Text>
                                        <Text style={styles.eventPrice}>Ksh. {event.price}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Nearby Events Section */}
                <View style={styles.section}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Nearby Events</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {nearbyEvents.filter(event => 
                            event.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map(event => (
                            <TouchableOpacity key={event.id} onPress={() => handleEventPress(event)}>
                                <View style={styles.eventCard}>
                                    {event.imageUrl && (
                                        <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
                                    )}
                                    <View style={styles.eventDetails}>
                                        <Text style={styles.eventName}>{event.name}</Text>
                                        <Text style={styles.eventCategory}>{event.category}</Text>
                                        <Text style={styles.eventDate}>{new Date(event.date).toDateString()}</Text>
                                        <Text style={styles.eventPrice}>Ksh. {event.price}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                
                <FlatList
                    data={filteredEvents.filter(event =>
                        event.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleEventPress(item)}>
                            <View style={styles.eventCard}>
                                {item.imageUrl && (
                                    <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
                                )}
                                <View style={styles.eventDetails}>
                                    <Text style={styles.eventName}>{item.name}</Text>
                                    <Text style={styles.eventCategory}>{item.category}</Text>
                                    <Text style={styles.eventDate}>{new Date(item.date).toDateString()}</Text>
                                    <Text style={styles.eventPrice}>Ksh. {item.price}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />

            </View>
 
            {/* Create Event Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create Event</Text>
                        <ScrollView>
                            {/* Input fields for new event creation */}
                            {/* ... other input fields remain unchanged ... */}
                            <TouchableOpacity style={styles.submitButton} onPress={handleCreateEventSubmit}>
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}    

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingTop: 40, // Ensure welcome message doesn't overlap the notification bar
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
        elevation: 2,
    },
    welcomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    searchBar: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 20,
        margin: 20,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingBottom: 100, // Adjust for floating button
    },
    categoryContainer: {
        paddingVertical: 10,
        paddingLeft: 20,
        marginTop: 20,
    },
    section: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    seeAll: {
        color: '#FFD700',
    },    
    readMoreButton: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#ff7518', // Distinct color for the button
        borderRadius: 5,
        alignItems: 'center',
    },
    readMoreText: {
        color: '#fff', // Text color for readability
        fontWeight: 'bold',
    },
    categoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#797979',
        marginRight: 10,
    },
    activeCategoryButton: {
        backgroundColor: '#ff7518',
    },
    categoryButtonText: {
        fontSize: 16,
        color: '#f6f6f6',
    },
    activeCategoryButtonText: {
        color: '#fff',
    },
    eventCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10, // Reduced padding
        margin: 8,   // Reduced margin
        elevation: 2, // Slightly reduced elevation for a flatter look
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1, // Slightly reduced shadow opacity
        shadowRadius: 1,
    },
    eventImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    eventDetails: {
        marginBottom: 10,
    },
    popupImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ff5733',
    },    
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    eventCategory: {
        fontSize: 14,
        color: '#777',
    },
    eventDate: {
        fontSize: 14,
        color: '#777',
    },
    eventPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    favoriteButton: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    eventActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#ff7518',
        borderRadius: 30,
        padding: 15,
        elevation: 5,
        zIndex: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#242424',
    },
    popupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupContent: {
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 10,
        padding: 20,
    },
    popupTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    popupDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    popupLocation: {
        fontSize: 16,
        marginBottom: 10,
    },
    popupPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ticketCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    counterButton: {
        fontSize: 24,
        padding: 10,
        backgroundColor: '#ff7518',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    ticketCount: {
        fontSize: 20,
        padding: 10,
    },
    popupButton: {
        backgroundColor: '#ff7518',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    popupButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closePopupButton: {
        backgroundColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    closePopupButtonText: {
        color: '#333',
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    imagePickerButton: {
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    imagePickerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    popupImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    selectedImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
    },
    submitButton: {
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 10,
    },
    closeButtonText: {
        color: '#111',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
