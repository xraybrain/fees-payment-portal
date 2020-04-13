module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Levels', [
      {
        name: 'ND1',
        levelCategoryId: 'nd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'ND2',
        levelCategoryId: 'nd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'HND1',
        levelCategoryId: 'hnd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'HND2',
        levelCategoryId: 'hnd',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Levels', null, {});
  }
};
