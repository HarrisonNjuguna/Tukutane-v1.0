import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Animated
} from 'react-native';
import { height, width } from 'react-native-dimension';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

const ticketsData = [
  { id: '1', title: 'Live Music Night', date: '2024-11-01', location: 'Nairobi', price: 1000, ticketNumber: 'TICKET-001', available: true },
  { id: '2', title: 'Tech Expo 2024', date: '2024-11-05', location: 'Mombasa', price: 1500, ticketNumber: 'TICKET-002', available: false },
  { id: '3', title: 'Football Match', date: '2024-11-10', location: 'Nairobi', price: 2000, ticketNumber: 'TICKET-003', available: true },
];

const ticketCategories = [
  { label: 'Early Bird', value: 'earlyBird', price: 800, icon: 'ticket' },
  { label: 'Regular', value: 'regular', price: 1000, icon: 'ticket' },
  { label: 'Group', value: 'group', price: 900, icon: 'users' },
  { label: 'VIP', value: 'vip', price: 2000, icon: 'star' },
  { label: 'VVIP', value: 'vvip', price: 3000, icon: 'star' },
];

const TicketsScreen = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(ticketCategories[0]?.value); // Initialize with the first category
  const [groupSize, setGroupSize] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(true);

  const handleTicketPurchase = (event) => {
    if (event.available) {
      setSelectedEvent(event);
      setShowModal(true);
    } else {
      alert('This event is sold out! You can join the waitlist.');
    }
  };

  const handleGroupBooking = () => {
    if (selectedEvent) {
      const totalPrice = groupSize * selectedCategory.price;
      alert(`Purchasing ${groupSize} tickets for ${selectedEvent.title}. Total Price: Ksh ${totalPrice}/-`);
      setShowModal(false);
      setGroupSize(1);
      setSelectedCategory(ticketCategories[0]);
    }
  };

  const handleGroupSizeChange = (value) => {
    setGroupSize((prevSize) => {
      const newSize = prevSize + value;
      return newSize > 0 ? newSize : 1; // Ensure group size is at least 1
    });
  };

  const animatedValue = new Animated.Value(1);

  const animateCategory = () => {
    Animated.sequence([
      Animated.timing(animatedValue, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const filteredTickets = ticketsData.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesAvailability = filterAvailable ? ticket.available : !ticket.available;
    return matchesSearch && matchesAvailability;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.ticketCard, !item.available && styles.soldOut]}
      onPress={() => handleTicketPurchase(item)}
      disabled={!item.available}
    >
      <View style={styles.cardContainer}>
        <View style={styles.cardInner}>
          <View style={styles.cardHeader}>
            <Text style={styles.ticketTitle}>{item.title}</Text>
            <View style={styles.validUntilContainer}>
              <Text style={styles.validText}>Valid Till</Text>
              <Text style={styles.validDate}>{moment(item.date).format('dddd, MMMM Do YYYY')}</Text>
            </View>
          </View>
          <View style={styles.separatorContainer}>
            <View style={styles.separatorDot} />
            <Text style={styles.separatorLine}>- - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
            <View style={styles.separatorDot} />
          </View>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.applicableText}>APPLICABLE ON</Text>
              <Text style={styles.applicableDate}>{moment(item.date).format('MMMM Do YYYY')}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.ticketPrice}>Ksh: {item.price}/-</Text>
            </View>
          </View>
          <View style={styles.ticketInfoContainer}>
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={item.ticketNumber}
                size={50}
                backgroundColor="transparent"
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tickets</Text>
      
      {/* Search Bar and Filter Button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tickets..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setFilterAvailable(prev => !prev)}
        >
          <Text style={styles.filterButtonText}>{filterAvailable ? 'Show Sold Out' : 'Show Available'}</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredTickets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {/* Modal for Ticket Purchase */}
       {/* Modal for Ticket Purchase */}
       <Modal
      visible={showModal}
      animationType="fade"
      transparent
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Booking for {selectedEvent?.title}</Text>
          
          <Text style={styles.modalText}>Select Ticket Type:</Text>
          <View style={styles.categoryContainer}>
            {ticketCategories.map((category) => {
              const isSelected = selectedCategory.value === category.value;
              return (
                <Animated.View
                  key={category.value}
                  style={[
                    styles.categoryButton,
                    isSelected && styles.selectedCategory,
                    { transform: [{ scale: isSelected ? animatedValue : 1 }] },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCategory(category);
                      animateCategory();
                    }}
                    style={styles.innerCategoryButton}
                  >
                    <Icon name={category.icon} size={16} color="#fff" />
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          <Text style={styles.modalText}>Select Group Size:</Text>
          <View style={styles.groupSizeContainer}>
            <TouchableOpacity onPress={() => handleGroupSizeChange(-1)} style={styles.adjustButton}>
              <Text style={styles.adjustButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(groupSize)}
              editable={false} // Make the input non-editable
            />
            <TouchableOpacity onPress={() => handleGroupSizeChange(1)} style={styles.adjustButton}>
              <Text style={styles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.totalPriceText}>
            Total Price: Ksh {selectedEvent ? groupSize * selectedCategory.price : 0}/-
          </Text>

          <TouchableOpacity style={styles.bookButton} onPress={handleGroupBooking}>
            <Text style={styles.bookButtonText}>Book Tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  filterButton: {
    backgroundColor: '#ff7518',
    padding: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ticketCard: {
    borderRadius: width(4),
    marginBottom: 10,
    elevation: 5,
  },
  cardContainer: {
    alignSelf: 'center',
    height: height(27),
    width: width(90),
    borderRadius: width(4),
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  cardInner: {
    padding: 5,
  },
  cardHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  ticketTitle: {
    fontWeight: 'bold',
    padding: 5,
    color: '#ff7518'
  },
  validUntilContainer: {
    alignSelf: 'flex-end',
    marginTop: height(7),
    padding: 5,
  },
  validText: {
    textAlign: 'right',
  },
  validDate: {
    textAlign: 'right',
  },
  separatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  separatorDot: {
    height: height(8),
    width: width(18),
    borderRadius: width(10),
    backgroundColor: '#f2f2f2',
  },
  separatorLine: {
    color: '#ff7518',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  applicableText: {
    textAlign: 'left',
  },
  applicableDate: {
    textAlign: 'left',
  },
  priceContainer: {
    alignSelf: 'flex-end',
  },
  ticketPrice: {
    fontWeight: 'bold',
    textAlign: 'right',
  },
  ticketInfoContainer: {
    marginTop: 5,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  soldOut: {
    opacity: 0.6,
  },
  soldOutText: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    fontSize: 40,
    color: '#ff7518',
    textAlign: 'center',
    opacity: 0.3,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    width: '30%',
    justifyContent: 'center',
    elevation: 3,
  },
  selectedCategory: {
    backgroundColor: '#ff7518',
    elevation: 5,
  },
  innerCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    color: '#fff',
    marginLeft: 3,
    fontSize: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  groupSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
  },
  adjustButton: {
    backgroundColor: '#ff7518',
    borderRadius: 5,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff7518',
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#ff7518',
    padding: 15,
    borderRadius: 8,
    width: '100%',
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
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default TicketsScreen;
