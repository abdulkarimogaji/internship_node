module.exports = (sequelize, DataTypes) => {
  const shipping_dock = sequelize.define(
    "shipping_dock",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      status: DataTypes.TINYINT,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "shipping_dock",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return shipping_dock;
};
