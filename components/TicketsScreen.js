import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';

const ticketsData = [
  { id: '1', title: 'Live Music Night', date: '2024-11-01', location: 'Nairobi', price: 1000, available: true },
  { id: '2', title: 'Tech Expo 2024', date: '2024-11-05', location: 'Mombasa', price: 1500, available: false },
  { id: '3', title: 'Football Match', date: '2024-11-10', location: 'Nairobi', price: 2000, available: true },
];

const TicketsScreen = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [groupSize, setGroupSize] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handleTicketPurchase = (event) => {
    if (event.available) {
      setSelectedEvent(event);
      setShowModal(true);
    } else {
      alert('This event is sold out! You can join the waitlist.');
    }
  };

  const handleGroupBooking = () => {
    alert(`Purchasing ${groupSize} tickets for ${selectedEvent.title}`);
    setShowModal(false);
    setGroupSize(1); // Reset group size
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.ticketCard, !item.available && styles.soldOut]}
      onPress={() => handleTicketPurchase(item)}
      disabled={!item.available}
    >
      <View style={styles.ticketInfo}>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <Text style={styles.ticketDate}>{item.date}</Text>
        <Text style={styles.ticketLocation}>{item.location}</Text>
        <Text style={styles.ticketPrice}>Ksh. {item.price}</Text>
        {!item.available && <Text style={styles.soldOutText}>Sold Out</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={ticketsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {/* Modal for Ticket Purchase */}
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Booking for {selectedEvent?.title}</Text>
          <Text style={styles.modalText}>Select Group Size:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(groupSize)}
            onChangeText={(text) => setGroupSize(Math.max(1, parseInt(text)))}
          />
          <TouchableOpacity style={styles.bookButton} onPress={handleGroupBooking}>
            <Text style={styles.bookButtonText}>Book Tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowModal(false)}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  ticketCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ticketInfo: {
    flexDirection: 'column',
  },
  soldOut: {
    opacity: 0.6,
  },
  soldOutText: {
    color: '#ff3d00',
    fontWeight: 'bold',
    marginTop: 5,
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketDate: {
    color: '#555',
    marginTop: 5,
  },
  ticketLocation: {
    color: '#777',
    marginTop: 5,
  },
  ticketPrice: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  bookButton: {
    backgroundColor: '#ff7518',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#dcdcdc',
    width: '80%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default TicketsScreen;
