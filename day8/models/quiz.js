module.exports = (sequelize, DataTypes) => {
  const quiz = sequelize.define(
    "quiz",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question: DataTypes.STRING,
      type: DataTypes.STRING,
      correct_answer: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "quiz",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  quiz.associate = (db) => {
    quiz.hasMany(db.quiz_answer, { foreignKey: "quiz_id" });
  };

  return quiz;
};
