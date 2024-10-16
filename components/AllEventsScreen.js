import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Share, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AllEventsScreen = ({ route, navigation }) => {
    const { title, events } = route.params;
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEvents, setFilteredEvents] = useState(events);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setFilteredEvents(events);
            setLoading(false);
        };
        fetchData();
    }, [events]);

    useEffect(() => {
        const results = events.filter(event => 
            event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredEvents(results);
    }, [searchQuery, events]);

    const handleRefresh = () => {
        setRefreshing(true);
        // Simulate fetching new data or refreshing events
        setTimeout(() => {
            setRefreshing(false);
            // Optionally update filteredEvents here
        }, 1000);
    };

    const shareEvent = async (event) => {
        try {
            await Share.share({
                message: `Check out this event: ${event.title}\nLocation: ${event.location}\nPrice: Ksh. ${event.price}/Person`,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const renderEventCard = (event) => (
        <TouchableOpacity 
            style={styles.eventCard} 
            onPress={() => navigation.navigate('EventDetails', { event })} // Pass the event object
        >
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventCategory}>{event.category}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
                <Text style={styles.eventRating}>Rating: {event.rating} ★</Text>
                <Text style={styles.eventPrice}>Ksh. {event.price}/Person</Text>
                <TouchableOpacity style={styles.shareButton} onPress={() => shareEvent(event)}>
                    <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff7518" />
            </View>
        );
    }

    return (
        <View style={isDarkMode ? styles.darkContainer : styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
                    <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={isDarkMode ? '#fff' : '#000'} />
                </TouchableOpacity>
            </View>
            <TextInput
                style={isDarkMode ? styles.darkSearchInput : styles.searchInput}
                placeholder="Search Events..."
                placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={filteredEvents}
                renderItem={({ item }) => renderEventCard(item)}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.eventsList}
                showsVerticalScrollIndicator={false}
                onRefresh={handleRefresh}
                refreshing={refreshing}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaeaea',
        paddingTop: 60,
        padding: 20,
        justifyContent: 'flex-start',
    },
    darkContainer: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 60,
        padding: 20,
        justifyContent: 'flex-start',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eaeaea',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#ff7518',
        borderRadius: 10,
        padding: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 15,
        flex: 1,
    },
    searchInput: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
        elevation: 2,
    },
    darkSearchInput: {
        height: 50,
        borderColor: '#444',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#333',
        color: '#fff',
        elevation: 2,
    },
    eventCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    eventImage: {
        width: '100%',
        height: 150,
        borderRadius: 15,
        marginBottom: 10,
    },
    eventInfo: {
        padding: 10,
    },
    eventTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    eventCategory: {
        fontSize: 12, // Smaller font size for category
        color: '#ff7518',
        marginBottom: 5,
    },
    eventDate: {
        color: '#333',
        marginBottom: 5,
    },
    eventLocation: {
        color: '#555',
        marginBottom: 5,
    },
    eventDescription: {
        color: '#666',
        marginBottom: 5,
        lineHeight: 18,
    },
    eventRating: {
        color: '#ff7518',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    eventPrice: {
        color: '#333',
        fontWeight: 'bold',
    },
    shareButton: {
        marginTop: 10,
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    shareButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    eventsList: {
        paddingBottom: 20,
    },
});

export default AllEventsScreen;
