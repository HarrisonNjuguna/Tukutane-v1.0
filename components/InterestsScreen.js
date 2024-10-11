import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icons for gender and navigation
import { useNavigation } from '@react-navigation/native';

const InterestsScreen = () => {
  const navigation = useNavigation();
  const [selectedGender, setSelectedGender] = useState(null);

  // Function to handle gender selection
  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Title and instructions */}
        <Text style={styles.screenTitle}>Tell Us About Yourself!</Text>
        <Text style={styles.screenSubtitle}>To enhance your Experience, please share your gender.</Text>
      </View>

      {/* Gender selection */}
      <View style={styles.genderSelection}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'male' && styles.selectedGender,
          ]}
          onPress={() => handleGenderSelect('male')}
        >
          <Ionicons name="male" size={60} color={selectedGender === 'male' ? '#fff' : '#ff7518'} />
          <Text style={[styles.genderText, { color: selectedGender === 'male' ? '#fff' : '#ff7518' }]}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'female' && styles.selectedGender,
          ]}
          onPress={() => handleGenderSelect('female')}
        >
          <Ionicons name="female" size={60} color={selectedGender === 'female' ? '#fff' : '#ff7518'} />
          <Text style={[styles.genderText, { color: selectedGender === 'female' ? '#fff' : '#ff7518' }]}>Female</Text>
        </TouchableOpacity>
      </View>

      {/* Next button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('Location')} 
        disabled={!selectedGender} // Disable button if gender is not selected
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 50,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#ff7518',
    padding: 10,
    borderRadius: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    color: '#333',
    textAlign: 'center',
  },
  screenSubtitle: {
    fontSize: 18,
    color: '#acacac',
    marginTop: 20,
    textAlign: 'center',
  },
  genderSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
  },
  genderButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff7518',
    borderRadius: 10,
    padding: 20,
    width: '40%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  selectedGender: {
    backgroundColor: '#ff7518',
  },
  genderText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#ff7518',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InterestsScreen;
