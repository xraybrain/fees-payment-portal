module.exports = (sequelize, DataTypes) => {
  const Fees = sequelize.define(
    'Fee',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      title: { type: DataTypes.STRING }

      // levelCategoryId: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: 'levelCategories',
      //     key: 'id'
      //   }
      // }
    },
    {
      paranoid: true
    }
  );

  Fees.associate = models => {
    models.Fee.hasMany(models.FeeList, { foreignKey: 'feeId' });
    // models.Fee.belongsTo(models.LevelCategory, {
    //   foreignKey: 'levelCategoryId'
    // });
  };
  return Fees;
};
