const { db } = require("../firebase");

class Restaurant {
  constructor() {
    this.collection = db.collection("restaurants");
  }

  // Create a new restaurant
  async create(restaurantData) {
    try {
      const docRef = await this.collection.add({
        ...restaurantData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id: docRef.id, ...restaurantData };
    } catch (error) {
      throw new Error(`Error creating restaurant: ${error.message}`);
    }
  }

  // Get restaurant by ID
  async getById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error getting restaurant: ${error.message}`);
    }
  }

  // Get all restaurants
  async getAll(limit = 50, offset = 0) {
    try {
      let query = this.collection.orderBy("name").limit(limit);

      if (offset > 0) {
        const lastDoc = await this.collection
          .orderBy("name")
          .limit(offset)
          .get();
        if (!lastDoc.empty) {
          const lastVisible = lastDoc.docs[lastDoc.docs.length - 1];
          query = query.startAfter(lastVisible);
        }
      }

      const snapshot = await query.get();
      const restaurants = [];

      snapshot.forEach((doc) => {
        restaurants.push({ id: doc.id, ...doc.data() });
      });

      return restaurants;
    } catch (error) {
      throw new Error(`Error getting restaurants: ${error.message}`);
    }
  }

  // Search restaurants by name
  async searchByName(name) {
    try {
      const snapshot = await this.collection
        .where("name", ">=", name)
        .where("name", "<=", name + "\uf8ff")
        .get();

      const restaurants = [];
      snapshot.forEach((doc) => {
        restaurants.push({ id: doc.id, ...doc.data() });
      });

      return restaurants;
    } catch (error) {
      throw new Error(`Error searching restaurants: ${error.message}`);
    }
  }

  // Update restaurant
  async update(id, updateData) {
    try {
      await this.collection.doc(id).update({
        ...updateData,
        updatedAt: new Date(),
      });
      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error updating restaurant: ${error.message}`);
    }
  }

  // Delete restaurant
  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      return { message: "Restaurant deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting restaurant: ${error.message}`);
    }
  }

  // Search restaurants by dish name
  async searchByDish(dishName) {
    try {
      const restaurants = [];
      const restaurantsSnapshot = await this.collection.get();

      for (const restaurantDoc of restaurantsSnapshot.docs) {
        const dishesSnapshot = await restaurantDoc.ref
          .collection("dishes")
          .where("name", ">=", dishName.toLowerCase())
          .where("name", "<=", dishName.toLowerCase() + "\uf8ff")
          .get();

        if (!dishesSnapshot.empty) {
          const dishes = [];
          dishesSnapshot.forEach((dishDoc) => {
            dishes.push({ id: dishDoc.id, ...dishDoc.data() });
          });

          restaurants.push({
            id: restaurantDoc.id,
            ...restaurantDoc.data(),
            matchingDishes: dishes,
          });
        }
      }

      return restaurants;
    } catch (error) {
      throw new Error(`Error searching restaurants by dish: ${error.message}`);
    }
  }
}

module.exports = Restaurant;
