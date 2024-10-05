const { Person } = require("../models");
const { User } = require("../models");

exports.getAllPersons = async (req, res) => {
  try {
    let personData = await Person.findAll();

    return res.status(200).json({
      success: true,
      data: personData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

exports.createPerson = async (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    dateOfBirth,
    email,
    phone,
    addressLine1,
    addressLine2,
    city,
    province,
    country,
  } = req.body;
  try {
    const person = await Person.create({
      userId,
      firstName,
      lastName,
      dateOfBirth,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      province,
      country,
    });
    return res.status(200).json({
      success: true,
      message: "person created successfully",
      data: person,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error finding person",
      error,
    });
  }
};

exports.updatePersonData = async (req, res) => {
  try {
    const id = req.params.userId;
    console.log("User ID:", id);

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      userId,
      firstName,
      lastName,
      dateOfBirth,
      phone,
      addressLine1,
      addressLine2,
      city,
      province,
      country,
    } = req.body;

    const person = await Person.findOne({ where: { userId: id } });
    if (!person) {
      return res.status(404).json({
        success: false,
        message: "Person data not found",
      });
    }

    await person.update({
      userId,
      firstName,
      lastName,
      dateOfBirth,
      phone,
      addressLine1,
      addressLine2,
      city,
      province,
      country,
    });

    const updatedPersonData = await Person.findOne({ where: { userId: id } });

    return res.status(200).json({
      success: true,
      message: "Person updated successfully",
      data: updatedPersonData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating person",
      error: error.message,
    });
  }
};
