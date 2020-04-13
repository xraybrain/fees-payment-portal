const baseModel = require('../models/index');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { sanitize } = require('../src/validator');
const Sequelize = require('sequelize');
const adminPermission = require('./permissions/adminPermission');
const { sendMail } = require('../services/mailer');

exports.saveFaculty = async (req, res, next) => {
  const newFaculty = sanitize(req.body);

  try {
    const facultyExists = await baseModel.Faculty.findOne({
      where: { name: newFaculty.name }
    });

    if (facultyExists) {
      res.status(200);
      return res.json({ error: true, message: 'Faculty name already exists.' });
    }
    // check if faculty is soft deleted
    let faculty = await baseModel.Faculty.findOne({
      where: { name: newFaculty.name },
      paranoid: false
    });

    if (faculty) {
      await faculty.restore();
    } else {
      faculty = await baseModel.Faculty.create(newFaculty);
    }
    res.status(200);
    return res.json({ error: null, message: 'success', faculty });
  } catch (error) {
    console.log(error);
    res.status(500);
    return res.json({
      error: true,
      message: 'server was unable to process request.'
    });
  }
};

exports.getFaculties = async (req, res, next) => {
  let limit = req.query.limit || 10;
  delete req.query.limit;
  let filter = { where: req.query } || {};

  try {
    let faculties = await baseModel.Faculty.findAll(filter);
    faculties = faculties.map((data, i) => {
      data.dataValues.sn = i + 1;
      return data;
    });
    res.status(200);
    res.json({ error: null, faculties });
    // console.log(faculties);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.updateFaculty = async (req, res, next) => {
  let updateData = {
    name: req.body.name
  };
  let id = req.body.id;

  try {
    let result = await baseModel.Faculty.update(updateData, { where: { id } });
    res.status(200);
    res.json({ error: null, message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.deleteFaculty = async (req, res, next) => {
  let id = req.body.id;

  try {
    let result = await baseModel.Faculty.destroy({ where: { id } });

    res.status(200);
    res.json({ error: null, message: 'success', result });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.saveDepartment = async (req, res, next) => {
  let newDepartment = {
    name: req.body.departmentName,
    facultyId: req.body.facultyId
  };

  try {
    let departmentExists = await baseModel.Department.findOne({
      where: { name: newDepartment.name }
    });

    if (departmentExists) {
      res.status(200);
      return res.json({ error: true, message: 'department already exists.' });
    }
    let department = await baseModel.Department.findOne({
      where: { name: newDepartment.name },
      paranoid: false
    });

    if (department) {
      await department.restore();
    } else {
      department = await baseModel.Department.create(newDepartment);
    }

    res.status(200);
    res.json({ error: null, message: 'success', department });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({
      error: true,
      message:
        'server was unable to process request. please try again after some time.'
    });
  }
};

exports.updateDepartment = async (req, res, next) => {
  console.log(req.body);
  try {
    const updateData = {
      name: req.body.departmentName,
      facultyId: req.body.facultyId
    };

    let result = await baseModel.Department.update(updateData, {
      where: { id: req.body.id }
    });
    res.status(200);
    res.json({ error: null, message: result[0] === 1 ? 'updated' : 'failed' });
    console.log(result);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, messgae: 'server was unable to process request.' });
  }
};

exports.getDepartments = async (req, res, next) => {
  try {
    let departments = await baseModel.Department.findAll({
      include: [{ model: baseModel.Faculty, paranoid: false }],
      order: [['name', 'ASC']]
    });
    departments = departments.map((data, i) => {
      data.dataValues.sn = i + 1;
      return data;
    });

    res.status(200);
    res.json({ error: null, message: 'success', departments });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({
      error: true,
      message:
        'server was unable to process request. please try again after some time.'
    });
  }
};

exports.deleteDepartment = async (req, res, next) => {
  let action = {
    id: req.body.id
  };

  try {
    let result = await baseModel.Department.destroy({ where: action });
    console.log(result);
    res.status(200);
    res.json({ error: null, message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request' });
  }
};

exports.getLevelCategories = async (req, res, next) => {
  const { name, id, limit } = req.query;
  const filter = {};

  if (name) {
    filter.name = name;
  }
  if (id) {
    filter.id = id;
  }

  try {
    let levelCategories = await baseModel.LevelCategory.findAll(filter);
    res.status(200);
    res.json({ error: null, message: 'success', levelCategories });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.getLevels = async (req, res, next) => {
  const { id, name, levelcategoryid, limit } = req.query;
  const filter = { where: {} };

  if (id) {
    filter.where.id = id;
  }
  if (name) {
    filter.where.name = name;
  }
  if (levelcategoryid) {
    filter.where.levelCategoryId = levelcategoryid;
  }

  try {
    let levels = await baseModel.Level.findAll(filter);
    res.status(200);
    res.json({ error: null, message: 'success', levels });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.saveFee = async (req, res, next) => {
  const { title, levelCategoryId, levelId, amount } = req.body;
  const newFee = { title };
  const newFeeList = [];
  const feeFilter = { where: { title: newFee.title }, paranoid: false };
  const transaction = await baseModel.sequelize.transaction();

  try {
    let feeExists = await baseModel.Fee.findOne({
      where: { title: newFee.title }
    });

    if (feeExists) {
      res.status(200);
      return res.json({ error: true, message: 'fee already exists.' });
    }

    let fee = await baseModel.Fee.findOne(feeFilter);

    if (fee) {
      fee.restore();
    } else {
      fee = await baseModel.Fee.create(newFee, { transaction });

      //-- format FeeList
      if (
        (Array.isArray(levelCategoryId) && Array.isArray(levelId),
        Array.isArray(amount))
      ) {
        for (let i = 0; i < levelCategoryId.length; i++) {
          newFeeList.push({
            feeId: fee.null,
            levelCategoryId: levelCategoryId[i],
            levelId: levelId[i] || null,
            amount: amount[i]
          });
        }
      } else {
        newFeeList.push({
          feeId: fee.null,
          levelCategoryId: levelCategoryId,
          levelId: levelId || null,
          amount: amount
        });
      }
      //--  end of format fee list

      feeList = await baseModel.FeeList.bulkCreate(newFeeList, { transaction });
    }

    await transaction.commit();
    res.status(200);
    res.json({ error: null, message: 'success', fee });
  } catch (error) {
    console.log(error);

    await transaction.rollback();
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.getFees = async (req, res, next) => {
  let { searchQuery } = req.query;
  const filter = {};
  if (searchQuery) {
    searchQuery = `%${searchQuery}%`;
    filter.where = {
      title: {
        [Sequelize.Op.like]: searchQuery
      }
    };
  }

  try {
    let fees = await baseModel.Fee.findAll({
      ...filter,
      include: [
        {
          model: baseModel.FeeList,
          include: [
            { model: baseModel.LevelCategory },
            { model: baseModel.Level }
          ]
        }
      ],
      order: [['title', 'ASC']]
    });

    fees = fees.map((data, i) => {
      data.dataValues.sn = i + 1;
      data.dataValues.amount = parseFloat(data.amount);
      return data;
    });
    res.status(200);
    res.json({ error: null, message: 'success', fees });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.updateFee = async (req, res, next) => {
  let updateData = sanitize(req.body);
  let id = updateData.id;
  delete updateData.id;

  try {
    let result = await baseModel.Fee.update(updateData, { where: { id } });
    res.status(200);
    res.json({ error: null, message: 'success', result });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.deleteFee = async (req, res, next) => {
  let id = req.body.id;
  try {
    let result = await baseModel.Fee.destroy({ where: { id } });
    res.status(200);
    res.json({ error: null, message: 'success', result });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.saveStudent = async (req, res, next) => {
  const newStudent = sanitize(req.body);

  try {
    const emailExists = await baseModel.Student.findOne({
      where: { emailAddress: newStudent.emailAddress }
    });
    if (emailExists) {
      res.status(200);
      return res.json({
        error: true,
        message: 'Email already exists.',
        target: 'emailAddress'
      });
    }
    const matricNoExists = await baseModel.Student.findOne({
      where: { matricNo: newStudent.matricNo }
    });
    if (matricNoExists) {
      res.status(200);
      return res.json({
        error: true,
        message: 'MatricNo already exists.',
        target: 'matricNo'
      });
    }

    const salt = bcrypt.genSaltSync(12);
    newStudent.password = bcrypt.hashSync(newStudent.password, salt);

    let student = await baseModel.Student.create(newStudent);

    res.status(200);
    return res.json({ error: null, message: 'success.', student });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.saveFeeList = async (req, res, next) => {
  let newFeeList = sanitize(req.body);
  console.log(newFeeList);
  try {
    let feeList = await baseModel.FeeList.create(newFeeList);
    feeList = await baseModel.FeeList.findOne({
      where: { id: feeList.null },
      include: [{ model: baseModel.LevelCategory }, { model: baseModel.Level }]
    });

    res.status(200);
    res.json({ error: null, message: 'success', feeList });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.deleteFeeList = async (req, res, next) => {
  let id = req.body.id;

  try {
    const result = await baseModel.FeeList.destroy({ where: { id } });

    res.status(200);
    res.json({ error: null, message: 'success', result, id });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.getFeeLists = async (req, res, next) => {
  let filter = {
    include: [
      { model: baseModel.Level },
      { model: baseModel.LevelCategory },
      { model: baseModel.Fee }
    ]
  };

  let query = {};
  if (req.query.feeid) {
    query.feeId = req.query.feeid;
  }

  if (req.query.id) {
    query.id = req.query.id;
  }

  if (req.query.levelcategoryid) {
    query.levelCategoryId = req.query.levelcategoryid;
  }

  let filterPayment = false;

  if (req.query.studentid) {
    filterPayment = true;
  }

  filter.where = { ...query };

  try {
    let feeLists = await baseModel.FeeList.findAll(filter);

    if (filterPayment) {
      //-- include fee id to target a particular fee payment
      let payments = await baseModel.Payment.findAll({
        where: { studentId: req.query.studentid }
      });

      feeLists = feeLists.map((feeList, index) => {
        found = false;

        for (const payment of payments) {
          if (payment.feeListId === feeList.id) {
            found = payment;
            break;
          }
        }
        if (found) {
          feeList.dataValues.Payment = found;
        } else {
          feeList.dataValues.Payment = false;
        }

        return feeList;
      });
    }

    feeLists = feeLists.map((feeList, index) => {
      feeList.dataValues.sn = index + 1;
      return feeList;
    });

    res.status(200);
    res.json({
      error: null,
      message: 'success',
      feeLists
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: true, message: 'server was unable to process request.' });
  }
};

exports.updateStudent = async (req, res, next) => {
  let id = req.body.id;
  delete req.body.id;
  let updateData = sanitize(req.body);

  try {
    let result = await baseModel.Student.update(updateData, { where: { id } });
    res.status(200);
    res.json({ error: null, message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const filter = {
      include: [
        { model: baseModel.LevelCategory },
        { model: baseModel.Department }
      ],
      where: {}
    };
    let { searchQuery, status } = req.query;

    if (searchQuery) {
      searchQuery = `%${searchQuery}%`;
      const where = {
        [Sequelize.Op.or]: [
          {
            firstName: { [Sequelize.Op.like]: searchQuery }
          },
          { lastName: { [Sequelize.Op.like]: searchQuery } },
          {
            matricNo: { [Sequelize.Op.like]: searchQuery }
          }
        ]
      };

      filter.where = { ...where };
    }

    if (status) {
      filter.where.status = status;
    }

    // if (req.query.id) {
    //   filter.where = { id: req.query.id };
    // }

    let students = await baseModel.Student.findAll(filter);
    students = students.map((student, index) => {
      student.dataValues.sn = index + 1;
      return student;
    });
    res.status(200);
    res.json({ error: null, message: 'success', students });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.statusMessage(error);
  }
};

exports.changeStudentPassword = async (req, res, next) => {
  let { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(200);
    return res.json({ error: true, message: 'password mismatch' });
  }

  try {
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);
    const updateData = {
      password: hash
    };

    let result = await baseModel.Student.update(updateData, {
      where: { id: req.user.id }
    });

    res.status(200);
    res.json({ error: null, message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

exports.makePayment = async (req, res, next) => {
  let newPayment = sanitize(req.body);
  try {
    let payment = await baseModel.Payment.create(newPayment);
    res.status(200);
    res.json({ status: 'success', paymentId: payment.null });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

exports.getPayments = async (req, res, next) => {
  let { searchQuery, approved } = req.query;
  let filter = {
    where: {},
    order: [['createdAt', 'ASC']],
    include: [
      {
        model: baseModel.Student,
        include: [{ model: baseModel.Department }],
        attributes: [
          'firstName',
          'lastName',
          'middleName',
          'matricNo',
          'emailAddress'
        ]
      },
      {
        model: baseModel.FeeList,
        include: [
          { model: baseModel.Level },
          { model: baseModel.LevelCategory },
          { model: baseModel.Fee }
        ],
        attributes: ['amount']
      }
    ]
  };

  if (searchQuery) {
    searchQuery = `%${searchQuery}%`;
    filter.where.reference = {
      [Sequelize.Op.like]: searchQuery
    };
  }

  if (approved) {
    filter.where.approved = approved;
  }

  if (req.query.id) {
    filter.where.id = req.query.id;
  }

  try {
    let payments = await baseModel.Payment.findAll(filter);

    payments = payments.map((payment, index) => {
      payment.dataValues.sn = index + 1;
      if (payment.createdAt) {
        payment.dataValues.createdAt = moment(payment.createdAt).format('LL');
      }
      return payment;
    });

    res.status(200);
    res.json({ error: null, message: 'success', payments });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

exports.updatePayment = async (req, res, next) => {
  let id = req.body.id;

  delete req.body.id;
  const updateData = sanitize(req.body);
  updateData.adminId = req.user.id;

  try {
    let result = await baseModel.Payment.update(updateData, { where: { id } });
    res.status(200);
    res.json({ error: null, message: 'success', result });
  } catch (error) {
    res.status(500);
    res.statusMessage('server was unable to process request.');
  }
};

exports.getCurrentUser = (req, res, next) => {
  var currentUser = req.user || false;
  res.status(200);
  res.json(currentUser);
};

exports.getStudentDashboardSummary = async (req, res, next) => {
  let { studentid, levelcategoryid } = req.query;
  let cashPaid = (cashUnPaid = totalPaid = totalUnPaid = 0);

  try {
    let Payments = await baseModel.Payment.findAll({
      where: { studentId: studentid }
    });

    totalPaid = Payments.length;

    let FeeLists = await baseModel.FeeList.findAll({
      where: { levelCategoryId: levelcategoryid }
    });

    for (const feeList of FeeLists) {
      let found = false;
      for (const payment of Payments) {
        if (payment.feeListId === feeList.id) {
          found = true;
          cashPaid += parseFloat(feeList.amount);
          break;
        }
      }
      if (!found) {
        cashUnPaid += parseFloat(feeList.amount);
        ++totalUnPaid;
      }
    }

    res.status(200);
    res.json({
      error: null,
      message: 'success',
      cashPaid,
      cashUnPaid,
      totalPaid,
      totalUnPaid
    });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

exports.getAdminDashboardSummary = async (req, res, next) => {
  try {
    let Payments = await baseModel.Payment.findAll({
      include: [{ model: baseModel.FeeList }]
    });

    let FeeLists = await baseModel.FeeList.findAll({});
    let totalStudents = (await baseModel.Student.findAndCountAll({})).count;

    let totalFees = (totalPayments = 0);

    for (const feeList of FeeLists) {
      totalFees += parseFloat(feeList.amount);
    }

    for (const payment of Payments) {
      totalPayments += parseFloat(payment.FeeList.amount);
    }

    res.status(200);
    res.json({
      error: null,
      message: 'success',
      totalPayments,
      totalFees,
      totalStudents
    });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

exports.saveAdmin = async (req, res, next) => {
  delete req.body.confirmPassword;
  const newAdmin = sanitize(req.body);

  console.log(newAdmin);

  try {
    const adminExists = await baseModel.Admin.findOne({
      where: { emailAddress: newAdmin.emailAddress }
    });

    if (adminExists) {
      res.status(200);
      return res.json({ error: true, message: 'email already exists.' });
    }

    const superUserExists = await baseModel.Admin.findOne({
      where: { userRole: 'superuser' }
    });

    if (superUserExists && newAdmin.userRole === 'superuser') {
      res.status(200);
      return res.json({
        error: true,
        message: 'an admin with super user priviledge already exists.'
      });
    }

    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(newAdmin.password, salt);
    newAdmin.password = hash;
    const admin = await baseModel.Admin.create(newAdmin);
    res.status(200);
    res.json({ error: null, message: 'success', admin });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

exports.getAdmins = async (req, res, next) => {
  let { searchQuery } = req.query;
  const filter = { where: {}, order: [['LastName', 'ASC']] };
  try {
    if (searchQuery) {
      searchQuery = `%${searchQuery}%`;
      filter.where = {
        [Sequelize.Op.or]: [
          {
            firstName: { [Sequelize.Op.like]: searchQuery }
          },
          { lastName: { [Sequelize.Op.like]: searchQuery } },
          {
            userRole: { [Sequelize.Op.like]: searchQuery }
          }
        ]
      };
    }

    let admins = await baseModel.Admin.findAll(filter);
    admins = admins.map((adminData, index) => {
      adminData.dataValues.sn = index + 1;
      return adminData;
    });

    res.status(200);
    res.json({ error: null, message: 'success', admins });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

exports.updateAdmin = async (req, res, next) => {
  const updateData = sanitize(req.body);
  const id = updateData.id;
  delete updateData.id;

  try {
    const superUserExists = await baseModel.Admin.findOne({
      where: { userRole: 'superuser' }
    });

    let result = await baseModel.Admin.update(updateData, { where: { id } });
    res.status(200);
    res.json({ error: null, message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

exports.deleteAdmin = async (req, res, next) => {
  const { id } = req.body;
  const currentUser = req.user;
  let canDelete = false;

  if (currentUser) {
    adminPermission[currentUser.userRole].forEach(element => {
      if (element === 'delete') canDelete = true;
    });
  }

  if (canDelete) {
    try {
      let admin = await baseModel.Admin.findByPk(id);

      if (admin.userRole === 'superuser') {
        res.status(200);
        return res.json({
          error: true,
          message: 'Operation not allowed. superuser can not be deleted.'
        });
      }

      let result = await baseModel.Admin.destroy({
        where: { id },
        paranoid: true
      });

      res.status(200);
      res.json({ error: null, message: 'success', result });
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  } else {
    res.status(200);
    return res.json({
      error: true,
      message: "Access denied, you don't have the right to delete."
    });
  }
};

exports.changeAdminPassword = async (req, res, next) => {
  let { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(200);
    return res.json({ error: true, message: 'password mismatch' });
  }

  try {
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);
    const updateData = {
      password: hash
    };

    let result = await baseModel.Admin.update(updateData, {
      where: { id: req.user.id }
    });

    res.status(200);
    res.json({ error: null, message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

exports.sendMail = async (req, res, next) => {
  const mail = `
  <p style="font-weight: bold;">Message By: ${req.body.emailAddress}</p>
  <p style="font-weight: bold;">${req.body.firstName} ${req.body.lastName}</p>
  <p style="font-style: italic;">${req.body.message}</p>
  `;

  try {
    const admin = await baseModel.Admin.findOne({
      where: { userRole: 'superuser' }
    });
    let info = await sendMail({
      subject: 'Message',
      to: admin.emailAddress,
      from: 'myproject2019@aol.com',
      html: mail
    });
    res.status(200);
    res.json({ error: null, message: 'message sent' });
  } catch (error) {
    console.log(error);
    res.status(200);
    res.json({ error: true, message: 'message sending failed.' });
  }
};
