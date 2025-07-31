const { sequelize } = require("../config/db");
const AnswerSheet = require("./answer-sheet.model");
const ModelAnswer = require("./model-answer.model");
const User = require("./user.model");

// A student can upload many answer sheets
User.hasMany(AnswerSheet, {
  foreignKey: "student_id",
  as: "uploadedSheets",
});

// A sheet is uploaded by a student (User with role 'student')
AnswerSheet.belongsTo(User, {
  foreignKey: "student_id",
  as: "student",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// An evaluator can evaluate many answer sheets
User.hasMany(AnswerSheet, {
  foreignKey: "evaluator_id",
  as: "evaluatedSheets",
});

// A sheet is evaluated by an evaluator (User with role 'evaluator')
AnswerSheet.belongsTo(User, {
  foreignKey: "evaluator_id",
  as: "evaluator",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

module.exports = { User, AnswerSheet, ModelAnswer, sequelize };
