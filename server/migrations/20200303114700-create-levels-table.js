module.exports = {
  up: (queryInterface, Sequelize) =>  {
    return queryInterface.createTable('levels',{
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    levelCategoryId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "LevelCategories",
        key: "id"
      }
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    }
    });
  },
  down: (queryInterface, Sequelize)=>{
    return queryInterface.dropTable('levels');
  }
}