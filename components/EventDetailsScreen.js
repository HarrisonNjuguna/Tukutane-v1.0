import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Animated, Dimensions, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const EventDetails = ({ route, navigation }) => {
    const { event } = route.params;
    const [timeLeft, setTimeLeft] = useState("");
    const [visible, setVisible] = useState(true);
    const animation = new Animated.Value(0);

    useEffect(() => {
        Animated.spring(animation, {
            toValue: 1,
            useNativeDriver: true,
        }).start();

        const countdown = setInterval(() => {
            const eventDate = new Date(event.date).getTime();
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                clearInterval(countdown);
                setTimeLeft("Event has started!");
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${days}d ${hours}h ${minutes}m left!`);
            }
        }, 1000);

        return () => clearInterval(countdown);
    }, [event.date]);

    const handleMapPress = () => {
        const locationUrl = `https://www.google.com/maps/search/?api=1&query=${event.location}`;
        Linking.openURL(locationUrl);
    };

    const handleBookNowPress = () => {
        alert("Booking functionality coming soon!");
    };

    const closePopup = () => {
        Animated.spring(animation, {
            toValue: 0,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
            navigation.navigate('Home');
        });
    };

    const shareOnWhatsApp = () => {
        const message = `Check out this event: ${event.title} - ${event.url}`;
        const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
            alert("Make sure you have WhatsApp installed on your device!");
        });
    };

    const socialMediaLinks = [
        { name: 'Facebook', icon: 'logo-facebook', url: `https://facebook.com/sharer/sharer.php?u=${event.url}` },
        { name: 'Twitter', icon: 'logo-twitter', url: `https://twitter.com/intent/tweet?url=${event.url}` },
        { name: 'WhatsApp', icon: 'logo-whatsapp', action: shareOnWhatsApp }, // Added WhatsApp sharing
        { name: 'Instagram', icon: 'logo-instagram', url: event.instagramUrl },
    ];

    return (
        <Modal transparent visible={visible} animationType="fade">
            <Pressable style={styles.overlay} onPress={closePopup}>
                <Animated.View style={[styles.popup, { opacity: animation }]}>
                    <Image source={{ uri: event.image }} style={styles.eventImage} />
                    <Text style={styles.eventCategory}>{event.category}</Text>
                    <Text style={styles.eventTitle}>{event.title}</Text>

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                            <Ionicons name="calendar-outline" size={20} color="#ff7518" />
                            <Text style={styles.detailText}>{event.date}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="location-outline" size={20} color="#ff7518" />
                            <Text style={styles.detailText}>{event.location}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="time-outline" size={20} color="#ff7518" />
                            <Text style={styles.detailTextSmall}>{timeLeft}</Text>
                        </View>
                    </View>

                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.eventDescription}>{event.description}</Text>

                    <View style={styles.ratingPriceContainer}>
                        <Text style={styles.eventRating}>Rating: {event.rating} ★</Text>
                        <Text style={styles.eventPrice}>Ksh. {event.price}/Person</Text>
                    </View>

                    <View style={styles.socialContainer}>
                        {socialMediaLinks.map((link) => (
                            <TouchableOpacity 
                                key={link.name} 
                                onPress={link.action ? link.action : () => Linking.openURL(link.url)} 
                                style={styles.socialButton}
                            >
                                <Ionicons name={link.icon} size={24} color="#ccc" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
                            <Ionicons name="map-outline" size={20} color="#fff" />
                            <Text style={styles.mapButtonText}>View on Map</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bookButton} onPress={handleBookNowPress}>
                            <Text style={styles.bookButtonText}>Book Now</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.backText}>Back Home</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        width: '90%',
        maxHeight: height * 0.8,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        alignItems: 'center',
    },
    eventImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    eventCategory: {
        fontWeight: 'bold',
        color: '#ff7518',
        fontSize: 20,
        textTransform: 'uppercase',
    },
    eventTitle: {
        fontWeight: 'bold',
        fontSize: 24,
        marginVertical: 5,
        color: '#333',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 5,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: 5,
        color: '#555',
        fontSize: 16,
    },
    detailTextSmall: {
        marginLeft: 5,
        color: '#ff7518',
        fontSize: 14,
        fontWeight: 'bold',
    },
    descriptionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 15,
        marginLeft: 5,
        alignSelf: 'flex-start',
        color: '#333',
    },
    eventDescription: {
        color: '#666',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'left',
    },
    ratingPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    eventRating: {
        color: '#ff7518',
        fontWeight: 'bold',
        fontSize: 16,
    },
    eventPrice: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 20,
    },
    socialButton: {
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff7518',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 9,
        marginBottom: 10,
        flex: 1,
        marginRight: 5,
    },
    bookButton: {
        backgroundColor: '#ff7518',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 9,
        marginBottom: 10,
        flex: 1,
    },
    mapButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    bookButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    backText: {
        color: '#ff7518',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
});

export default EventDetails;
