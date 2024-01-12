module.exports = (sequelize, DataTypes) => {
  const email = sequelize.define(
    "email",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      subject: DataTypes.STRING,
      body: DataTypes.TEXT,
      status: DataTypes.TINYINT,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "email",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return email;
};
