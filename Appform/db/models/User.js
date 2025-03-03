"use strict";
const { Model } = require("sequelize");
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({Person}) {      
      User.hasOne(Person, {
        foreignKey: 'userId', 
        as: 'person', 
      });
    }
    static associate({Experiences}) {
      User.hasOne(Experiences, {
        foreignKey: 'userId', 
        as: 'experiences', 
      });
    }
    static associate({Educations}) {
      User.hasOne(Educations, {
        foreignKey: 'userId', 
        as: 'educations', 
      });
    }
    static associate({MyFiles}) {
      User.hasOne(MyFiles, {
        foreignKey: 'userId', 
        as: 'myfiles', 
      });
    }
    static associate(models) {
      const { JobsApplied, jobs } = models;
      User.belongsToMany(jobs, {
        through: JobsApplied,
        foreignKey: 'userId', 
        as: 'jobsApplied', 
      });
    }
  }
  

  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50],
        },
      },
      userType: {
        type: DataTypes.STRING,
        allowNull: false,       
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [6, 100],
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },


    }, 
    

  );

  User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };



  return User;
};





