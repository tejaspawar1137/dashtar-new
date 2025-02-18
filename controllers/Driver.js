const Driver = require('../models/Driver');
const mongoose = require("mongoose")
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


const updateDriver = async (req, res, next) => {
   try {
    const {id} = req.params;
    
     if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message: "Invalid driver Id"})
     }
  
  const updateDriver = await Driver.findByIdAndUpdate(id, req.body, {new: true, runValidators: true}); 
  console.log(updateDriver)

  res.status(200).json({
    success: true,
    message: "Driver fetch successfully",
    data: updateDriver
  })
   }catch(error) {
     next(error)
   }
}

const deleteDriver = async (req, res, next) => {
  try {
    const {id} = req.params;
    const deleteDriver = await Driver.findByIdAndDelete(id);
    if(!deleteDriver) {
      return res.status(404).json({message: "Driver not found"})
    };
    res.status(200).json({
      success: true, 
      message: "Driver delete successfully",
      data: deleteDriver
    })
  } catch(error) {
    next(error)
  }
}

const getDriverById = async (req, res, next) => {
  try {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({message: "Invalid driver Id"})
    };
    const driver = await Driver.findById(id);
    if(!driver || Object.keys(driver).length === 0) {
      return res.status(400).json({message:"Driver not found"})
    };
    res.status(200).json({
      success: true,
      message: "Driver fetched successfully!",
      data: driver
    })
  }catch(err) {
    next(err)
  }
}
module.exports = { createDriver, getDrivers, updateDriver, deleteDriver, getDriverById };
