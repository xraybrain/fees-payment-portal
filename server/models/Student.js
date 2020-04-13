module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    firstName: { type: DataTypes.STRING },
    middleName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    emailAddress: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: false },
    matricNo: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'departments',
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
  });

  Student.associate = models => {
    models.Student.belongsTo(models.Department, { foreignKey: 'departmentId' });
    models.Student.belongsTo(models.LevelCategory, {
      foreignKey: 'levelCategoryId'
    });
  };

  return Student;
};
