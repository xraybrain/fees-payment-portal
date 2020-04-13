module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    reference: { type: DataTypes.STRING },
    approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    adminId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Admins',
        key: 'id'
      }
    },
    feeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'fees',
        key: 'id'
      }
    },
    feeListId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'feeLists',
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'students',
        key: 'id'
      }
    }
  });

  Payment.associate = models => {
    models.Payment.belongsTo(models.Fee, { foreignKey: 'feeId' });
    models.Payment.belongsTo(models.FeeList, { foreignKey: 'feeListId' });
    models.Payment.belongsTo(models.Student, { foreignKey: 'studentId' });
    models.Payment.belongsTo(models.Admin, { foreignKey: 'adminId' });
  };

  return Payment;
};
