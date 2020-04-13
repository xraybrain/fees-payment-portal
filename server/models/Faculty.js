module.exports = (sequelize, DataTypes) => {
  const Faculty = sequelize.define(
    'Faculty',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING }
    },
    {
      paranoid: true
    }
  );

  return Faculty;
};
