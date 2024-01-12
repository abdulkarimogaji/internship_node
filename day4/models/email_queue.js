module.exports = (sequelize, DataTypes) => {
  const email_queue = sequelize.define(
    "email_queue",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      status: DataTypes.TINYINT,
      created_at: DataTypes.DATEONLY,
      sent_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "email_queue",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return email_queue;
};
