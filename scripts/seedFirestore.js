const { db } = require("../database/firebase");
const admin = require("firebase-admin");

async function seedData() {
  try {
    const restaurantRef = db.collection("restaurants").doc("rest1");
    await restaurantRef.set({
      name: "Burger Palace",
      address: "123 Main St, Foodville",
      coordinates: new admin.firestore.GeoPoint(40.7128, -74.006), // Example: NYC
      rating: 4.5,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const dishesRef = restaurantRef.collection("dishes");
    await dishesRef.doc("dish1").set({
      name: "Classic Cheeseburger",
      description: "Juicy beef patty with cheddar cheese",
      price: 9.99,
      category: "Burgers",
    });
    await dishesRef.doc("dish2").set({
      name: "Margherita Pizza",
      description: "Tomato sauce, mozzarella, and basil",
      price: 12.99,
      category: "Pizza",
    });

    const reviewsRef = dishesRef.doc("dish1").collection("reviews");
    await reviewsRef.doc("review1").set({
      userId: "user123",
      rating: 5,
      comment: "Absolutely delicious!",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ Firestore seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding Firestore:", error);
  } finally {
    process.exit();
  }
}
seedData();
