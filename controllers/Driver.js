const Driver = require('../models/Driver');

// Controller to create a new driver
const createDriver = async (req, res, next) => {
  try {
    // Create a new instance of Driver using the request body
    const driver = new Driver(req.body);
    
    // Save the driver document to the database
    const savedDriver = await driver.save();
    
    // Send a success response with the newly created driver
    res.status(201).json({
      success: true,
      message: "Driver created successfully",
      data: savedDriver,
    });
  } catch (error) {
    // Forward errors to the error-handling middleware
    next(error);
  }
};

// Controller to get all drivers
const getDrivers = async (req, res, next) => {
  try {
    // Retrieve all driver documents from the database
    const drivers = await Driver.find();
    
    // Send a response with the retrieved drivers
    res.status(200).json({
      success: true,
      message: "Drivers retrieved successfully",
      data: drivers,
    });
  } catch (error) {
    // Forward errors to the error-handling middleware
    next(error);
  }
};

module.exports = { createDriver, getDrivers };
