import { https } from 'firebase-functions';
import { initializeApp, firestore } from 'firebase-admin';

initializeApp();

export const createEvent = https.onCall(async (data, context) => {
    const { image, title, category, date, location, description, rating, price } = data;

    // Validate the required fields
    if (!image || !title || !category || !date || !location || !description || !rating || !price) {
        return { success: false, error: "All fields are required." };
    }

    const eventData = {
        image,
        title,
        category,
        date: firestore.Timestamp.fromDate(new Date(date)), // Make sure date is a valid Date object
        location,
        description,
        rating,
        price,
    };

    try {
        // Create the event in Firestore
        const eventRef = await firestore().collection("events").add(eventData);
        return { success: true, eventId: eventRef.id };
    } catch (error) {
        console.error("Error creating event:", error);
        return { success: false, error: error.message };
    }
});
