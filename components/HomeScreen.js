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
                <Text style={styles.loadingText}>Loading Events...</Text>
            </View>
        );
    }

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

            <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                                <TouchableOpacity style={styles.favoriteButton} onPress={() => handleFavoriteToggle(item.id)}>
                                    <Ionicons name={favorites.includes(item.id) ? "heart" : "heart-outline"} size={20} color="#333" />
                                </TouchableOpacity>
                                <View style={styles.eventActions}>
                                    <TouchableOpacity onPress={() => handleShare(item)}>
                                        <Ionicons name="share-outline" size={20} color="#333" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.floatingButton} onPress={openCreateEventModal}>
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Event Popup */}
            {selectedEvent && (
                <Modal
                    visible={!!selectedEvent}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setSelectedEvent(null)}
                >
                    <View style={styles.popupContainer}>
                        <View style={styles.popupContent}>
                            <Text style={styles.popupTitle}>{selectedEvent.name}</Text>
                            {selectedEvent.imageUrl && (
                                <Image source={{ uri: selectedEvent.imageUrl }} style={styles.popupImage} />
                            )}
                            <Text style={styles.popupDescription}>{selectedEvent.description}</Text>
                            <Text style={styles.popupLocation}>Location: {selectedEvent.location}</Text>
                            <Text style={styles.popupPrice}>Ksh. {selectedEvent.price}</Text>
                            <View style={styles.ticketCounter}>
                                <TouchableOpacity onPress={() => setTicketCount(Math.max(1, ticketCount - 1))}>
                                    <Text style={styles.counterButton}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.ticketCount}>{ticketCount}</Text>
                                <TouchableOpacity onPress={() => setTicketCount(ticketCount + 1)}>
                                    <Text style={styles.counterButton}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.popupButton} onPress={handleBuyTickets}>
                                <Text style={styles.popupButtonText}>Buy Tickets</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closePopupButton} onPress={() => setSelectedEvent(null)}>
                                <Text style={styles.closePopupButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

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
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Event Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter the name of the event"
                    value={newEvent.name}
                    onChangeText={(text) => setNewEvent({ ...newEvent, name: text })}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Organizer</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter the organizer's name"
                    value={newEvent.organizer}
                    onChangeText={(text) => setNewEvent({ ...newEvent, organizer: text })}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Price (Ksh)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter the ticket price"
                    value={newEvent.price}
                    onChangeText={(text) => setNewEvent({ ...newEvent, price: text })}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Category</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter event category (e.g., Music)"
                    value={newEvent.category}
                    onChangeText={(text) => setNewEvent({ ...newEvent, category: text })}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Provide a brief description of the event"
                    value={newEvent.description}
                    onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter the event location"
                    value={newEvent.location}
                    onChangeText={(text) => setNewEvent({ ...newEvent, location: text })}
                />
            </View>

            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                <Text style={styles.imagePickerText}>Pick an Image (tap here)</Text>
            </TouchableOpacity>

            {newEvent.imageUrl ? (
                <Image source={{ uri: newEvent.imageUrl }} style={styles.selectedImage} />
            ) : null}

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
