const { db } = require("../firebase");

class Review {
  constructor() {
    this.db = db;
  }

  // Get review collection reference for a specific dish
  getReviewCollection(restaurantId, dishId) {
    return this.db
      .collection("restaurants")
      .doc(restaurantId)
      .collection("dishes")
      .doc(dishId)
      .collection("reviews");
  }

  // Create a new review for a dish
  async create(restaurantId, dishId, reviewData) {
    try {
      const reviewCollection = this.getReviewCollection(restaurantId, dishId);
      const docRef = await reviewCollection.add({
        ...reviewData,
        timestamp: new Date(),
        createdAt: new Date(),
      });
      return { id: docRef.id, ...reviewData, timestamp: new Date() };
    } catch (error) {
      throw new Error(`Error creating review: ${error.message}`);
    }
  }

  // Get review by ID
  async getById(restaurantId, dishId, reviewId) {
    try {
      const reviewCollection = this.getReviewCollection(restaurantId, dishId);
      const doc = await reviewCollection.doc(reviewId).get();

      if (!doc.exists) {
        return null;
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error getting review: ${error.message}`);
    }
  }

  // Get all reviews for a dish
  async getAllByDish(
    restaurantId,
    dishId,
    limit = 50,
    orderBy = "timestamp",
    order = "desc"
  ) {
    try {
      const reviewCollection = this.getReviewCollection(restaurantId, dishId);
      const snapshot = await reviewCollection
        .orderBy(orderBy, order)
        .limit(limit)
        .get();

      const reviews = [];
      snapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });

      return reviews;
    } catch (error) {
      throw new Error(`Error getting reviews: ${error.message}`);
    }
  }

  // Get reviews by user ID
  async getByUserId(restaurantId, dishId, userId) {
    try {
      const reviewCollection = this.getReviewCollection(restaurantId, dishId);
      const snapshot = await reviewCollection
        .where("userId", "==", userId)
        .orderBy("timestamp", "desc")
        .get();

      const reviews = [];
      snapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });

      return reviews;
    } catch (error) {
      throw new Error(`Error getting user reviews: ${error.message}`);
    }
  }

  // Get reviews by rating
  async getByRating(restaurantId, dishId, rating, limit = 50) {
    try {
      const reviewCollection = this.getReviewCollection(restaurantId, dishId);
      const snapshot = await reviewCollection
        .where("rating", "==", rating)
        .orderBy("timestamp", "desc")
        .limit(limit)
        .get();

      const reviews = [];
      snapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });

      return reviews;
    } catch (error) {
      throw new Error(`Error getting reviews by rating: ${error.message}`);
    }
  }

  // Update review
  async update(restaurantId, dishId, reviewId, updateData) {
    try {
      const reviewCollection = this.getReviewCollection(restaurantId, dishId);
      await reviewCollection.doc(reviewId).update({
        ...updateData,
        updatedAt: new Date(),
      });

      return await this.getById(restaurantId, dishId, reviewId);
    } catch (error) {
      throw new Error(`Error updating review: ${error.message}`);
    }
  }

  // Delete review
  async delete(restaurantId, dishId, reviewId) {
    try {
      const reviewCollection = this.getReviewCollection(restaurantId, dishId);
      await reviewCollection.doc(reviewId).delete();
      return { message: "Review deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting review: ${error.message}`);
    }
  }

  // Get average rating for a dish
  async getAverageRating(restaurantId, dishId) {
    try {
      const reviewCollection = this.getReviewCollection(restaurantId, dishId);
      const snapshot = await reviewCollection.get();

      if (snapshot.empty) {
        return { averageRating: 0, totalReviews: 0 };
      }

      let totalRating = 0;
      let count = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalRating += data.rating;
        count++;
      });

      return {
        averageRating: Math.round((totalRating / count) * 10) / 10, // Round to 1 decimal
        totalReviews: count,
      };
    } catch (error) {
      throw new Error(`Error calculating average rating: ${error.message}`);
    }
  }

  // Get rating distribution for a dish
  async getRatingDistribution(restaurantId, dishId) {
    try {
      const reviewCollection = this.getReviewCollection(restaurantId, dishId);
      const snapshot = await reviewCollection.get();

      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (distribution.hasOwnProperty(data.rating)) {
          distribution[data.rating]++;
        }
      });

      return distribution;
    } catch (error) {
      throw new Error(`Error getting rating distribution: ${error.message}`);
    }
  }
}

module.exports = Review;
