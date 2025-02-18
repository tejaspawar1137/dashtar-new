const jwt = require("jsonwebtoken");
const bcryptjs = require('bcryptjs');
const { validationResult } = require("express-validator");
const Rider = require("../models/Rider");
const Driver = require("../models/Driver");
const RideRequest = require('../models/RideRequest');
const { errorHandler } = require("../utils/error"); // Import the error handler

const signUp = async (req, res, next) => {
  const { role, fullName, email, password, contactNumber, ...otherDetails } = req.body;
  console.log("API hit")
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errorHandler(400, "Validation failed");
    error.details = errors.array(); // Attach validation errors to the error object
    return next(error);
  }

  try {
    // Check if the user already exists
    const existingUser = await (role === "driver" ? Driver : Rider).findOne({ email });
    if (existingUser) {
      const error = errorHandler(400, "Email is already in use.");
      return next(error);
    }

    // Create a new user based on role
    // const hashedPassword = await bcrypt.hash(password, +process.env.PASS_SALT_ROUND);
    const userModel = role === "driver" ? Driver : Rider;

    const user = await userModel.create({
      fullName,
      email,
      password,
      contactNumber,
      ...otherDetails
    });
    console.log("User>>>>\n", user);
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, role: user.role, email: user.email }
    });

  } catch (err) {
    console.log(err);
    const error = errorHandler(500, "Internal server error");
    error.details = err.message;
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password, role } = req.body;

  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errorHandler(400, "Validation failed");
    error.details = errors.array(); // Attach validation errors to the error object
    return next(error);
  }

  try {
    // Find the user by email and role
    const userModel = role === "driver" ? Driver : Rider;
    console.log("email:", email);
    console.log("password:", password);
    const user = await userModel.findOne({ email });
    if (!user) {
      const error = errorHandler(404, "User not found.");
      return next(error);
    }


    console.log(user, ".....user")

    // Compare passwords
    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword)
      return next(errorHandler(401, "Wrong credentials!"));

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ENCRYPTION_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, role: user.role, email: user.email, isDocComplete: user.isDocComplete }
    });
  } catch (err) {
    const error = errorHandler(500, "Internal server error");
    console.log(err.message)
    error.details = err.message;
    return next(error);
  }
};

const getDriverDetails = async (req, res, next) => {
  const driverId = req.query.driverId;
  try {
    const driverDetails = await Driver.findOne({ _id: driverId });
    if (!driverDetails) {
      const error = errorHandler(404, "Driver not found.");
      return next(error);
    }
    console.log(driverDetails);
    return res.status(200).json({ success: true, error: false, name: driverDetails.fullName, phone: driverDetails.contactNumber, vehicleNumber: driverDetails.vehicleDetails.numberPlate });
  } catch (err) {
    console.log("error: ", err)
    const error = errorHandler(500, "Internal server error");
    error.details = err.message;
    return next(error);
  }
}

const updateDetails = async (req, res, next) => {
  const { userId, updates, role } = req.body;

  // Validate inputs
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = errorHandler(400, "Validation failed");
  //   error.details = errors.array();
  //   return next(error);
  // }

  try {
    // Determine the user model based on role
    const userModel = role === "driver" ? Driver : Rider;

    // Use findOneAndUpdate to update the user
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId }, // Find the user by ID
      { $set: updates }, // Apply the updates
      { new: true, runValidators: true } // Return the updated document
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      const error = errorHandler(404, "User not found.");
      return next(error);
    }
    console.log("up", updatedUser);
    return res.status(200).json({
      message: "User details updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Error updating user details:", err);
    const error = errorHandler(500, "Internal server error");
    error.details = err.message;
    return next(error);
  }
};


const getDashboardDetails = async (req, res, next) => {
  try {
    // Taxi Live Location (driver's current GPS coordinates)
    const liveLocations = await Driver.find({}, 'name location'); 

    // Finished Trips
    const finishedTrips = await RideRequest.countDocuments({ status: 'completed' });

    // New Users (e.g., added in the last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newUsers = await Rider.find({ createdAt: { $gte: oneDayAgo } });

    // Total Earnings (from completed trips)
    const earningsAggregate = await RideRequest.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalEarnings: { $sum: '$amount' } } }
    ]);
    const totalEarnings = earningsAggregate[0]?.totalEarnings || 0;

    // Cancelled Trips
    const cancelledTrips = await RideRequest.countDocuments({ status: 'cancelled' });

    // Total Revenue (from all revenue records)
    const revenueAggregate = await RideRequest.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalEarnings: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAggregate[0]?.totalEarnings || 0;

    // Ongoing Trips
    const ongoingTrips = await RideRequest.countDocuments({ status: 'ongoing' });

    // Salary Status (example aggregation by driver status)
    const salaryStatus = await Driver.aggregate([
      {
        $project: {
          _id: 0,
          userId: "$_id", // Include the userId from the _id field
          name: "$fullName",
          transactionId: { $ifNull: ["$transactionId", "$_id"] }, // Use transactionId if available, else fallback to _id
          amount: "$salary",
          status: "$status"
        }
      }
    ]);

    // Driver's Details (all drivers info)
    const driverDetails = await Driver.find({}, '_id fullName transactionId status salary vehicleDetails');

    // Respond with all aggregated data
    res.json({
      liveLocations,
      finishedTrips,
      newUsers,
      totalEarnings,
      cancelledTrips,
      totalRevenue,
      ongoingTrips,
      salaryStatus,
      driverDetails
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving dashboard data' });
  }
};



const getRiders = async (req, res, next) => {
 
    try {
        const riders = await Rider.find();
        res.status(200).json(riders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }



}

const getDrivers = async (req, res, next) => {
  // Fetch Drivers

    try {
        const drivers = await Driver.find();
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

module.exports = { signUp, login, getDriverDetails, updateDetails, getDashboardDetails, getRiders, getDrivers };
