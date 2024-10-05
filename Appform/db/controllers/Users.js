const { User } = require('../models');
const { Experiences, Educations } = require("../models");
const { MyFiles } = require('../models');
const { Person } = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const JWT_SECRET = '12345iusdfhbdaisofhario';
const REFRESH_TOKEN_SECRET = 'sdligyahgwoasd8uh';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    REFRESH_TOKEN_SECRET, 
    { expiresIn: '7d' } 
  );
};


exports.registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }


    const newUser = await User.create({
      userName,
      email,
      password,
    });


    const token = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'Strict', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { 
        userId: newUser.id, 
        userName: newUser.userName, 
        email: newUser.email,
        token,

      },
    });
  } catch (error) {
    console.error('Error creating user:', error.message);
    return res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const userId = user.id;
    const isStep1Completed = await Person.findOne({ where: { userId } });
    const hasExperience = await Experiences.findOne({ where: { userId } });
    const hasEducation = await Educations.findOne({ where: { userId } });
    const isStep2Completed = hasExperience && hasEducation;
    const hasFiles = await MyFiles.findOne({ where: { userId } });
    const isStep3Completed = hasFiles;


    let stepComplete = ""

    if (!isStep1Completed) {
      stepComplete = "/step-1"
    } else if (!isStep2Completed) {
           stepComplete = "/step-2"
          
    } else if (!isStep3Completed) {
           stepComplete = "/step-3"
    }

    
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        userId: user.id,
        userName: user.userName,
        email: user.email,
        stepComplete,
        token,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error.message);
    return res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};



exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        console.error('Invalid refresh token:', err.message); 
        return res.status(403).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      const existingUser = await User.findOne({ where: { id: user.id } });
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const newToken = generateToken(existingUser);
      const newRefreshToken = generateRefreshToken(existingUser);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          token: newToken
        },
      });
    });
  } catch (error) {
    console.error('Error refreshing token:', error.message);
    return res.status(500).json({
      success: false,
      message: "Error refreshing token",
      error: error.message,
    });
  }
};

exports.getUserData = async (req, res) => {
  
  try {
    const { userId } = req.params;
    console.log('User ID:', userId);

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    const person = await Person.findOne({ where: { userId } });
    const experiences = await Experiences.findAll({ where: { userId } });
    const educations = await Educations.findAll({ where: { userId } });
    const files = await MyFiles.findAll({ where: { userId } });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          userName: user.userName,
          email: user.email,
          password: user.password
        },
        person,
        experiences,
        educations,
        files,
      },
    });
  } catch (error) {
    console.error('Error fetching registration data:', error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching registration data",
      error: error.message,
    });
  }
};


exports.updateUserData = async (req, res) => {
  try {
    const id = req.params.userId;
    const { userName, email, currentPassword, newPassword } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await User.update(
        { userName, email, password: hashedPassword },
        { where: { id } }
      );
    } else {
      await User.update(
        { userName, email },
        { where: { id } }
      );
    }

    const updatedUser = await User.findOne({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "User data updated successfully",
      data: {
        id: updatedUser.id,
        userName: updatedUser.userName,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error('Error updating user data:', error.message);
    return res.status(500).json({
      success: false,
      message: "Error updating user data",
      error: error.message,
    });
  }
};


