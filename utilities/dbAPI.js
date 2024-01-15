// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines the APIFeatures class, which provides utility methods
// for filtering, sorting, limiting fields, and paginating query results. The class is
// designed to be used with Mongoose queries in a MongoDB-based application.

class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query object
    this.queryString = queryString; // Query parameters from the request
  }

  // Method to apply filtering to the query based on query parameters
  filter() {
    // Create a shallow copy of the query parameters
    const queryObj = { ...this.queryString };
    // Define fields to be excluded from the filter
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // Remove excluded fields from the query object
    excludedFields.forEach(el => delete queryObj[el]);
    // Convert the query object to a JSON string
    let queryStr = JSON.stringify(queryObj);
    // Replace comparison operators with MongoDB-compatible operators
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // Apply the filter to the query
    this.query = this.query.find(JSON.parse(queryStr));

    return this; // Return the instance to allow method chaining
  }

  // Method to apply sorting to the query based on query parameters
  sort() {
    if (this.queryString.sort) {
      // Convert comma-separated fields to space-separated fields
      const sortBy = this.queryString.sort.split(',').join(' ');
      // Apply sorting to the query
      this.query = this.query.sort(sortBy);
    } else {
      // Apply default sorting by creation date (descending)
      this.query = this.query.sort('-createdAt');
    }

    return this; // Return the instance to allow method chaining
  }

  // Method to limit the fields returned in the query results
  limitFields() {
    if (this.queryString.fields) {
      // Convert comma-separated fields to space-separated fields
      const fields = this.queryString.fields.split(',').join(' ');
      // Select only the specified fields
      this.query = this.query.select(fields);
    } else {
      // Exclude the "__v" field by default
      this.query = this.query.select('-__v');
    }

    return this; // Return the instance to allow method chaining
  }

  // Method to apply pagination to the query based on query parameters
  paginate() {
    // Convert page and limit parameters to numbers (default to 1 and 100)
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Apply pagination to the query
    this.query = this.query.skip(skip).limit(limit);

    return this; // Return the instance to allow method chaining
  }
}

// Export the APIFeatures class to be used in other parts of the application
module.exports = APIFeatures;
