const { db } = require("../firebase");

class Dish {
  constructor() {
    this.db = db;
  }

  // Get dish collection reference for a restaurant
  getDishCollection(restaurantId) {
    return this.db
      .collection("restaurants")
      .doc(restaurantId)
      .collection("dishes");
  }

  // Create a new dish for a restaurant
  async create(restaurantId, dishData) {
    try {
      const dishCollection = this.getDishCollection(restaurantId);
      const docRef = await dishCollection.add({
        ...dishData,
        name: dishData.name.toLowerCase(), // Store name in lowercase for better searching
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id: docRef.id, ...dishData };
    } catch (error) {
      throw new Error(`Error creating dish: ${error.message}`);
    }
  }

  // Get dish by ID from a specific restaurant
  async getById(restaurantId, dishId) {
    try {
      const dishCollection = this.getDishCollection(restaurantId);
      const doc = await dishCollection.doc(dishId).get();

      if (!doc.exists) {
        return null;
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error getting dish: ${error.message}`);
    }
  }

  // Get all dishes from a restaurant
  async getAllByRestaurant(restaurantId, limit = 50) {
    try {
      const dishCollection = this.getDishCollection(restaurantId);
      const snapshot = await dishCollection.orderBy("name").limit(limit).get();

      const dishes = [];
      snapshot.forEach((doc) => {
        dishes.push({ id: doc.id, ...doc.data() });
      });

      return dishes;
    } catch (error) {
      throw new Error(`Error getting dishes: ${error.message}`);
    }
  }

  // Search dishes by name in a specific restaurant
  async searchInRestaurant(restaurantId, dishName) {
    try {
      const dishCollection = this.getDishCollection(restaurantId);
      const searchName = dishName.toLowerCase();

      const snapshot = await dishCollection
        .where("name", ">=", searchName)
        .where("name", "<=", searchName + "\uf8ff")
        .get();

      const dishes = [];
      snapshot.forEach((doc) => {
        dishes.push({ id: doc.id, ...doc.data() });
      });

      return dishes;
    } catch (error) {
      throw new Error(`Error searching dishes: ${error.message}`);
    }
  }

  // Search dishes by category in a restaurant
  async searchByCategory(restaurantId, category) {
    try {
      const dishCollection = this.getDishCollection(restaurantId);
      const snapshot = await dishCollection
        .where("category", "==", category.toLowerCase())
        .get();

      const dishes = [];
      snapshot.forEach((doc) => {
        dishes.push({ id: doc.id, ...doc.data() });
      });

      return dishes;
    } catch (error) {
      throw new Error(`Error searching dishes by category: ${error.message}`);
    }
  }

  // Update dish
  async update(restaurantId, dishId, updateData) {
    try {
      const dishCollection = this.getDishCollection(restaurantId);

      if (updateData.name) {
        updateData.name = updateData.name.toLowerCase();
      }

      await dishCollection.doc(dishId).update({
        ...updateData,
        updatedAt: new Date(),
      });

      return await this.getById(restaurantId, dishId);
    } catch (error) {
      throw new Error(`Error updating dish: ${error.message}`);
    }
  }

  // Delete dish
  async delete(restaurantId, dishId) {
    try {
      const dishCollection = this.getDishCollection(restaurantId);
      await dishCollection.doc(dishId).delete();
      return { message: "Dish deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting dish: ${error.message}`);
    }
  }

  // Global search for dishes across all restaurants
  async globalSearch(dishName) {
    try {
      const searchName = dishName.toLowerCase();
      const results = [];

      const restaurantsSnapshot = await this.db.collection("restaurants").get();

      for (const restaurantDoc of restaurantsSnapshot.docs) {
        const dishesSnapshot = await restaurantDoc.ref
          .collection("dishes")
          .where("name", ">=", searchName)
          .where("name", "<=", searchName + "\uf8ff")
          .get();

        if (!dishesSnapshot.empty) {
          const dishes = [];
          dishesSnapshot.forEach((dishDoc) => {
            dishes.push({ id: dishDoc.id, ...dishDoc.data() });
          });

          results.push({
            restaurant: {
              id: restaurantDoc.id,
              ...restaurantDoc.data(),
            },
            dishes: dishes,
          });
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Error searching dishes globally: ${error.message}`);
    }
  }
}

module.exports = Dish;
