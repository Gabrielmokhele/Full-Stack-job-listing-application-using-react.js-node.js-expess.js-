"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    static associate(models) {
      
      Person.belongsTo(models.User, {
        foreignKey: 'userId', 
        as: 'User', 
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  Person.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      addressLine1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      addressLine2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: { 
        type: DataTypes.UUID,
        references: {
          model: 'users', 
          key: 'id', 
        },
      },
    },
    {
      sequelize,
      tableName: "Person",
      modelName: "Person",
    }
  );
  return Person;
};
