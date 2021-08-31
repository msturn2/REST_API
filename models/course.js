const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.User, {
        as: "userInfo", //alias
        foreignKey: {
          fieldName: "userId",
          allowNull: false,
        },
      });
    }
  }
  Course.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter the course's Title"
          },
          notEmpty: {
            msg: "Please enter the course's Title"
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter a course descripton"
          },
          notEmpty: {
            msg: "Please enter a course descripton"
          }
        }
      },
      estimatedTime: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: {
        //   notNull: {
        //     msg: "Please enter the course's estimated time length"
        //   },
        //   notEmpty: {
        //     msg: "Please enter the course's estimated time length"
        //   }
        // }
      },
      materialsNeeded: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: {
        //   notNull: {
        //     msg: "Please list the required course materials that will be needed by the student"
        //   },
        //   notEmpty: {
        //     msg: "Please list the required course materials that will be needed by the student"
        //   }
        // }
      }
    },
    {
      // options
      sequelize,
      modelName: "Course"
    }
  );
  return Course;
};