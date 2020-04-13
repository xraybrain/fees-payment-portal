module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('feeLists', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false
      },
      feeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Fees',
          key: 'id'
        }
      },
      levelId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Levels',
          key: 'id'
        }
      },
      levelCategoryId: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'LevelCategories',
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
    return queryInterface.dropTable('feeLists');
  }
};
