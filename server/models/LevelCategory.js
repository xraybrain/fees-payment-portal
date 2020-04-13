module.exports = (sequelize, DataTypes) => {
  const LevelCategory = sequelize.define('LevelCategory', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING }
  });

  return LevelCategory;
};
