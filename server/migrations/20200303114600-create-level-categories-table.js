module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LevelCategories', {
      id: {
        type: Sequelize.STRING(3),
        autoIncrement: false,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(3),
        allowNull: false
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
    return queryInterface.dropTable('LevelCategories');
  }
};
