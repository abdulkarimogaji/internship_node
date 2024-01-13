module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define(
    "transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      shipping_dock_id: DataTypes.INTEGER,
      amount: DataTypes.DOUBLE,
      discount: DataTypes.DOUBLE,
      tax: DataTypes.DOUBLE,
      total: DataTypes.DOUBLE,
      notes: DataTypes.STRING,
      status: DataTypes.TINYINT,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "transaction",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return transaction;
};
