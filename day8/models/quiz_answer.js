module.exports = (sequelize, DataTypes) => {
  const quiz_answer = sequelize.define(
    "quiz_answer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quiz_id: DataTypes.INTEGER,
      answer: DataTypes.STRING,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "quiz_answer",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  quiz_answer.associate = (db) => {
    quiz_answer.belongsTo(db.quiz);
  };

  return quiz_answer;
};
