const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ModelAnswer = sequelize.define(
  "ModelAnswer",
  {
    answer_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "model_answers",
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = ModelAnswer;
