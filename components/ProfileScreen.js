import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal,
    TextInput,
    Alert,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase/firebase'; // Ensure you import your Firebase config
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function ProfileScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('Your Phone Number');
    const [email, setEmail] = useState('your.email@example.com');

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUsername(data.username);
                    setPhoneNumber(data.phoneNumber || 'Your Phone Number');
                    setEmail(data.email || 'your.email@example.com');
                }
            }
        };

        fetchUserData();
    }, []);

    const handleUsernameChange = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            await updateDoc(doc(db, 'users', user.uid), { username });
            Alert.alert("Success", "Username updated!");
            setModalVisible(false);
        }
    };

    const handleInviteFriends = () => {
        // Logic to generate and share the invite link
        Alert.alert("Invite Friends", "Link to share: http://example.com/invite");
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Profile Picture */}
                <TouchableOpacity style={styles.profilePictureContainer}>
                    <Image
                        source={{ uri: 'https://example.com/profile-picture.jpg' }} // Placeholder URL
                        style={styles.profilePicture}
                    />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Your Profile</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.section}>
                    <Ionicons name="person-outline" size={24} color="#ff7518" />
                    <Text style={styles.sectionText}>{username}</Text>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                {/* Edit Profile Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TextInput
                                placeholder="Username"
                                value={username}
                                onChangeText={setUsername}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity style={styles.modalButton} onPress={handleUsernameChange}>
                                    <Text style={styles.modalButtonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Payment Methods Section */}
                <TouchableOpacity style={styles.section} onPress={() => alert('Open Payment Methods')}>
                    <Ionicons name="card-outline" size={24} color="#ff7518" />
                    <Text style={styles.sectionText}>Payment Methods</Text>
                    <Text style={styles.editText}>Select</Text>
                </TouchableOpacity>

                {/* Settings Section */}
                <TouchableOpacity style={styles.section} onPress={() => alert('Open Settings')}>
                    <Ionicons name="settings-outline" size={24} color="#ff7518" />
                    <Text style={styles.sectionText}>Settings</Text>
                    <Text style={styles.editText}>Manage</Text>
                </TouchableOpacity>

                {/* Help Center Section */}
                <TouchableOpacity style={styles.section} onPress={() => alert('Open Help Center')}>
                    <Ionicons name="help-circle-outline" size={24} color="#ff7518" />
                    <Text style={styles.sectionText}>Help Center</Text>
                    <Text style={styles.editText}>Contact</Text>
                </TouchableOpacity>

                {/* Privacy Policy Section */}
                <TouchableOpacity style={styles.section} onPress={() => setPrivacyModalVisible(true)}>
                    <Ionicons name="document-text-outline" size={24} color="#ff7518" />
                    <Text style={styles.sectionText}>Privacy Policy</Text>
                    <Text style={styles.editText}>View</Text>
                </TouchableOpacity>

                {/* Invite Friends Button */}
                <TouchableOpacity style={styles.inviteButton} onPress={handleInviteFriends}>
                    <Text style={styles.inviteButtonText}>Invite Friends</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Privacy Policy Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={privacyModalVisible}
                onRequestClose={() => setPrivacyModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.pdfTitle}>Privacy Policy</Text>
                        <ScrollView style={styles.pdfScroll}>
                            <Text style={styles.pdfText}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                Sed do eiusmod tempor incididunt ut labore et dolore magna 
                                aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                                ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                Duis aute irure dolor in reprehenderit in voluptate velit 
                                esse cillum dolore eu fugiat nulla pariatur. Excepteur 
                                sint occaecat cupidatat non proident, sunt in culpa qui 
                                officia deserunt mollit anim id est laborum.
                                {'\n\n'}
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                Sed do eiusmod tempor incididunt ut labore et dolore magna 
                                aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                                ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            </Text>
                        </ScrollView>
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={() => setPrivacyModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    backButton: {
        padding: 10,
        backgroundColor: '#ff7518',
        borderRadius: 50,
        alignSelf: 'flex-start',
    },
    scrollContainer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    profilePictureContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3, // 3D effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    sectionText: {
        fontSize: 18,
        flex: 1,
        marginLeft: 10,
    },
    editText: {
        color: '#ff7518',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        elevation: 10, // For Android shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
    },
    inviteButton: {
        backgroundColor: '#ff7518',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
    },
    inviteButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    pdfTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    pdfScroll: {
        maxHeight: 300,
        marginBottom: 20,
    },
    pdfText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
    },
    closeButton: {
        backgroundColor: '#ff7518',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

