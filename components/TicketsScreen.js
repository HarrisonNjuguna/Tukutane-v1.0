import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package for icons

const TicketsScreen = () => {
  const navigation = useNavigation();
  const [activeSection, setActiveSection] = useState('Upcoming');

  const sections = ['Upcoming', 'Completed', 'Cancelled'];
  const events = [
    {
      id: 1,
      category: 'Music',
      title: 'Rock Festival 2024',
      location: 'Nairobi, Kenya',
      price: 'Ksh. 2500 / per person',
      image: 'https://images.unsplash.com/photo-1629675434088-a8736076b708?q=80&w=1460&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 2,
      category: 'Art',
      title: 'Art Expo 2024',
      location: 'Mombasa, Kenya',
      price: 'Ksh. 1000 / per person',
      image: 'https://plus.unsplash.com/premium_photo-1706548911781-dd3ad17a8fa6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket</Text>

        {/* Sections */}
        <View style={styles.sectionsContainer}>
          {sections.map(section => (
            <TouchableOpacity
              key={section}
              onPress={() => setActiveSection(section)}
              style={[styles.sectionItem, activeSection === section && styles.activeSection]}
            >
              <Text style={[styles.sectionText, activeSection === section && styles.activeSectionText]}>
                {section}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Line below categories */}
      <View style={styles.headerLine} />

      {/* Event cards */}
      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {events.map(event => (
          <View key={event.id} style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <View style={styles.eventInfo}>
              <Text style={styles.category}>{event.category}</Text>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={14} color="#ff7518" />
                <Text style={styles.location}>{event.location}</Text>
              </View>
              <Text style={styles.price}>
                {event.price.split('/')[0]} <Text style={styles.perPerson}>/Person</Text>
              </Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.buttonCancel}>
                <Text style={styles.buttonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonETicket}>
                <Text style={styles.buttonText}>E-Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginTop: 40,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 15,
    backgroundColor: '#ff7518',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  sectionsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-around',
  },
  sectionItem: {
    marginHorizontal: 15,
    paddingBottom: 5,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  activeSection: {
    borderBottomWidth: 2,
    borderBottomColor: '#ff7518',
  },
  activeSectionText: {
    color: '#ff7518',
  },
  headerLine: {
    marginTop: 10,
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
  },
  cardsContainer: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
    padding: 15,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  eventInfo: {
    marginBottom: 15,
  },
  category: {
    fontSize: 14,
    backgroundColor: '#f5f5f5',
    color: '#ff7518',
    padding: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#777',
    marginLeft: 5,
  },
  price: {
    fontSize: 16,
    color: '#ff7518',
    fontWeight: 'bold',
  },
  perPerson: {
    color: '#bfc1c2',
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonCancel: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancelText: {
    color: '#ff7518',
    fontWeight: 'bold',
  },
  buttonETicket: {
    backgroundColor: '#ff7518',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default TicketsScreen;
