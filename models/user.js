const { Model } = require('sequelize');
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Course, {
        as: "userInfo", //alias
        foreignKey: {
          fieldName: "userId",
          allowNull: false,
        },
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter the user's First Name"
          },
          notEmpty: {
            msg: "Please enter the user's First Name"
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter the user's Last Name"
          },
          notEmpty: {
            msg: "Please enter the user's Last Name"
          }
        }
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "The email you entered already exists"
        },
        validate: {
          notNull: {
            msg: "An email is required"
          },
          isEmail: {
            msg: "Please provide a valid email address"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue("password", hashedPassword);
        },
        validate: {
          notNull: {
            msg: "A password is required"
          },
          notEmpty: {
            msg: "Please provide a password"
          },
          // len: {
          //   args: [8,20],
          //   msg: "The password must be between 8 - 20 characters in length"
          // }
        }
      }
    },
    {
      // options
      sequelize,
      modelName: "User"
    }
  );
  return User;
};