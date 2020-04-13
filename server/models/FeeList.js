module.exports = (sequelize, DataTypes) => {
  const FeeList = sequelize.define(
    'FeeList',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      amount: { type: DataTypes.DECIMAL(8, 2) },
      feeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'fees',
          key: 'id'
        }
      },
      levelId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'levels',
          key: 'id'
        }
      },
      levelCategoryId: {
        type: DataTypes.STRING,
        references: {
          model: 'levelCategories',
          key: 'id'
        }
      }
    },
    {
      paranoid: true
    }
  );

  FeeList.associate = models => {
    models.FeeList.belongsTo(models.Level, { foreignKey: 'levelId' });
    models.FeeList.belongsTo(models.LevelCategory, {
      foreignKey: 'levelCategoryId'
    });
    models.FeeList.belongsTo(models.Fee, {
      foreignKey: 'feeId'
    });
    models.FeeList.hasMany(models.Payment, {
      foreignKey: 'feeListId'
    });
  };
  return FeeList;
};
