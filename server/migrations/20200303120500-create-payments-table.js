module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      approved: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      adminId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'admins',
          key: 'id'
        }
      },
      feeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'fees',
          key: 'id'
        }
      },
      feeListId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'feeLists',
          key: 'id'
        }
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('payments');
  }
};
