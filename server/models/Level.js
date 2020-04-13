module.exports = (sequelize, DataTypes) => {
  const Level = sequelize.define('Level', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING },
    levelCategoryId: {
      type: DataTypes.STRING,
      references: {
        model: 'levelCategories',
        key: 'id'
      }
    }
  });

  Level.associate = models => {
    models.Level.belongsTo(models.LevelCategory, {
      foreignKey: 'levelCategoryId'
    });
  };
  return Level;
};
