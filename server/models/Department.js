module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    'Department',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING },
      facultyId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'faculties',
          key: 'id'
        }
      }
    },
    {
      paranoid: true
    }
  );

  Department.associate = models => {
    models.Department.belongsTo(models.Faculty, { foreignKey: 'facultyId' });
  };

  return Department;
};
