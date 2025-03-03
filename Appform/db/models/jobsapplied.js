'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobsApplied extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      JobsApplied.belongsTo(models.jobs, {
        foreignKey: 'jobId',
        as: 'applicants'
      });
    }
  }
  JobsApplied.init({
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'users', 
        key: 'id'
      },
      allowNull: false
    },
    jobId: {
      type: DataTypes.UUID,
      references: {
        model: 'jobs', 
        key: 'id'
      },
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'JobsApplied',
    tableName: 'JobsApplied'
  });

  return JobsApplied;
};