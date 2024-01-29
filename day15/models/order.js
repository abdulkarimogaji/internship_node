module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: DataTypes.STRING,
      total: DataTypes.DOUBLE,
      stripe_id: DataTypes.STRING,
      status: DataTypes.TINYINT,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "order",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return order;
};
