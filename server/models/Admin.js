module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    emailAddress: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    userRole: { type: DataTypes.STRING, defaultValue: 'MODERATOR' },
    deletedAt: { type: DataTypes.DATE, defaultValue: null }
  });

  return Admin;
};
