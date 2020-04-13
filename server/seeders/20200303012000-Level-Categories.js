module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('LevelCategories', [
      {
        id: 'nd',
        name: 'ND',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'hnd',
        name: 'HND',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('LevelCategories', null, {});
  }
};
