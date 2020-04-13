const {
  saveFaculty,
  updateFaculty,
  deleteFaculty,
  getFaculties,
  saveDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  getLevelCategories,
  getLevels,
  saveFee,
  getFees,
  updateFee,
  deleteFee,
  saveStudent,
  saveFeeList,
  updateStudent,
  deleteFeeList,
  getFeeLists,
  getStudents,
  makePayment,
  getPayments,
  updatePayment,
  getCurrentUser,
  getStudentDashboardSummary,
  getAdminDashboardSummary,
  changeStudentPassword,
  saveAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
  changeAdminPassword,
  sendMail
} = require('../controller/apiController');
const { hasPermission } = require('../src/auth');

module.exports = app => {
  app.post('/api/faculties/save/', hasPermission, saveFaculty);
  app.put('/api/faculties/update/', hasPermission, updateFaculty);
  app.delete('/api/faculties/delete/', hasPermission, deleteFaculty);
  app.get('/api/faculties/', getFaculties);
  app.post('/api/departments/save/', hasPermission, saveDepartment);
  app.get('/api/departments/', getDepartments);
  app.put('/api/departments/update/', hasPermission, updateDepartment);
  app.delete('/api/departments/delete/', hasPermission, deleteDepartment);
  app.get('/api/levelcategories/', getLevelCategories);
  app.get('/api/levels/', getLevels);
  app.post('/api/fees/save/', hasPermission, saveFee);
  app.get('/api/fees/', getFees);
  app.put('/api/fees/update/', hasPermission, updateFee);
  app.delete('/api/fees/delete/', hasPermission, deleteFee);
  app.post('/api/students/save/', saveStudent);
  app.put('/api/students/update/', updateStudent);
  app.get('/api/students/', getStudents);
  app.put('/api/students/changepassword/', changeStudentPassword);
  app.post('/api/feelists/save/', hasPermission, saveFeeList);
  app.delete('/api/feelists/delete', hasPermission, deleteFeeList);
  app.get('/api/feelists/', getFeeLists);
  app.post('/api/makepayment/', makePayment);
  app.get('/api/payments/', getPayments);
  app.put('/api/payments/update/', hasPermission, updatePayment);
  app.get('/api/currentuser/', getCurrentUser);
  app.get('/api/studentdashboardsummary/', getStudentDashboardSummary);
  app.get('/api/admindashboardsummary/', getAdminDashboardSummary);

  app.post('/api/admins/save/', hasPermission, saveAdmin);
  app.get('/api/admins/', getAdmins);
  app.put('/api/admins/update', hasPermission, updateAdmin);
  app.delete('/api/admins/delete', hasPermission, deleteAdmin);
  app.put('/api/admins/changepassword/', changeAdminPassword);

  app.post('/api/sendmail/', sendMail);
};
