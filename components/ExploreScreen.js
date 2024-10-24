import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const ExploreScreen = () => {
  const events = [
    {
      id: 1,
      title: "Art Exhibition",
      category: "Art",
      date: "2024-10-30",
      location: "Gallery X",
      coordinates: { latitude: -1.2921, longitude: 36.8219 },
      image: "https://via.placeholder.com/220",
      description: "A wonderful art exhibition featuring local artists.",
      rating: 4.5,
      price: 500,
    },
    {
      id: 2,
      title: "Music Concert",
      category: "Music",
      date: "2024-11-05",
      location: "Stadium Y",
      coordinates: { latitude: -1.2955, longitude: 36.8231 },
      image: "https://via.placeholder.com/220",
      description: "Join us for an unforgettable night of music.",
      rating: 4.8,
      price: 1000,
    },
    {
      id: 3,
      title: "Food Festival",
      category: "Food",
      date: "2024-11-10",
      location: "Park Z",
      coordinates: { latitude: -1.2929, longitude: 36.8181 },
      image: "https://via.placeholder.com/220",
      description: "Taste delicious dishes from various cuisines.",
      rating: 4.7,
      price: 300,
    },
  ];

  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [mapRegion, setMapRegion] = useState({
    latitude: -1.286389,
    longitude: 36.817223,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  useEffect(() => {
    const filtered = searchQuery
      ? events.filter(event =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : events;

    setFilteredEvents(filtered);
  }, [searchQuery]); // Only depend on searchQuery

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = () => {
    alert('Filter button pressed! Implement filter options here.');
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={mapRegion}>
        {filteredEvents.map(event => (
          <Marker
            key={event.id}
            coordinate={event.coordinates}
            title={event.title}
            description={event.date}
            onPress={() => handleEventSelect(event)}
          />
        ))}
      </MapView>

      <FlatList
        data={filteredEvents}
        horizontal
        style={styles.eventCardsContainer}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => handleEventSelect(item)}
          >
            <Image source={{ uri: item.image }} style={styles.eventImage} />
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventCategory}>{item.category}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
            <Text style={styles.eventLocation}>{item.location}</Text>
            <Text style={styles.eventRating}>Rating: {item.rating} ★</Text>
            <Text style={styles.eventPrice}>Ksh. {item.price}/Person</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for events..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Ionicons name="filter" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {selectedEvent && (
        <Modal
          transparent={true}
          visible={showEventDetails}
          animationType="slide"
          onRequestClose={() => setShowEventDetails(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedEvent.image }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
              <Text style={styles.modalDate}>{selectedEvent.date}</Text>
              <Text style={styles.modalDescription}>{selectedEvent.description}</Text>
              <Text style={styles.modalLocation}>Location: {selectedEvent.location}</Text>
              <View style={styles.priceRatingContainer}>
                <Text style={styles.modalRating}>Rating: {selectedEvent.rating} ★</Text>
                <Text style={styles.modalPrice}>Ksh. {selectedEvent.price}/Person</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buyTicketsButton}
                  onPress={() => alert(`Buying tickets for ${selectedEvent.title}`)}
                >
                  <Text style={styles.buyTicketsText}>Buy Tickets</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowEventDetails(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.socialContainer}>
                <Text style={styles.socialText}>Share on:</Text>
                <View style={styles.socialIcons}>
                  <TouchableOpacity>
                    <Ionicons name="logo-facebook" size={20} color="#3b5998" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="logo-instagram" size={20} color="#C13584" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  eventCardsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    paddingHorizontal: 20,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 20,
    padding: 15,
    width: 220,
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
  eventRating: {
    color: '#ff7518',
    fontWeight: 'bold',
  },
  eventPrice: {
    color: '#333',
    fontWeight: 'bold',
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    elevation: 5,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: '#ff7518',
    borderRadius: 20,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDate: {
    marginBottom: 10,
  },
  modalDescription: {
    marginBottom: 10,
  },
  modalLocation: {
    marginBottom: 10,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  modalRating: {
    color: '#ff7518',
    fontWeight: 'bold',
  },
  modalPrice: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buyTicketsButton: {
    backgroundColor: '#ff7518',
    borderRadius: 20,
    padding: 10,
    flex: 1,
    marginRight: 5,
  },
  buyTicketsText: {
    textAlign: 'center',
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    flex: 1,
    marginLeft: 5,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  socialContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  socialText: {
    marginBottom: 5,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default ExploreScreen;
