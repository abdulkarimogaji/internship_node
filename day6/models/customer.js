module.exports = (sequelize, DataTypes) => {
  const customer = sequelize.define(
    "customer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      shopify_customer_id: DataTypes.INTEGER,
      shopify_customer_email: DataTypes.STRING,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "customer",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return customer;
};
