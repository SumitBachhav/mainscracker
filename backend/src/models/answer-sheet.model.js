const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AnswerSheet = sequelize.define(
  "AnswerSheet",
  {
    sheet_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    evaluator_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    original_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    evaluated_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("uploaded", "evaluated"),
      allowNull: false,
      defaultValue: "uploaded",
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    evaluated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "answer_sheets",
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = AnswerSheet;
