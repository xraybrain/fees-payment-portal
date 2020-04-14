/**
 * used to create and manage components
 */
var Loading = (function() {
  function show(target) {
    Component.create({}, '#loading-template', target, 'a');
  }
  function hide(target) {
    $(target + ' .loading').remove();
  }
  return {
    show: show,
    hide: hide
  };
})();

var Component = (function() {
  var data = {};

  data.create = function(data, source, target, mode) {
    mode = mode === 'a' ? mode : 'n';

    var template = $(source).html();
    var html = Mustache.to_html(template, data);

    if (mode === 'n') {
      $(target).html(html);
    } else {
      $(target).append(html);
    }
  };

  data.destroy = function(target) {
    $(target).remove();
  };

  return data;
})();

function print(event) {
  event.preventDefault();

  var win = window.open(
    '',
    '_blank',
    'left=0, top=0, titlebar=0, width=500, height=500',
    true
  );
  var body = $('#printable').html();
  var title = '<head><title>Payment System</title></head>';
  body = title + body;
  win.document.write(body);
  win.print();
}

function makePayment(customer, charge) {
  var handler = PaystackPop.setup({
    key: 'pk_test_c3cd2b6a8c267691e93f3b29ab8c015061618895', //put your public key here
    email: customer.emailAddress, //put your customer's email here
    amount: parseFloat(charge.amount) * 100, //amount the customer is supposed to pay
    metadata: {
      custom_fields: [
        {
          display_name: 'Mobile Number',
          variable_name: 'mobile_number',
          value: '+2348012345678' //customer's mobile number
        }
      ]
    },
    callback: function(response) {
      //after the transaction have been completed
      //make post call  to the server with to verify payment
      //using transaction reference as post data
      console.log(response);
      var data = { reference: response.reference };

      $.each($('#payment-form').serializeArray(), function(_, field) {
        data[field.name] = field.value;
      });

      $.post('/api/makepayment/', data, function(data) {
        if (data.status == 'success') {
          console.log(data);
          //successful transaction
          alert('Transaction was successful');
          window.location = '/student/receipt/' + data.paymentId;
        }
        //transaction failed
        else alert(response);
      });
    },
    onClose: function() {
      //when the user close the payment modal
      alert('Transaction cancelled');
    }
  });
  handler.openIframe(); //open the paystack's payment modal
}

function showDialog(options) {
  options = options || {};
  var title = options.title || 'untitled';
  var message = options.message || 'no message';
  var icon = options.icon || 'fas fa-info-circle fa-3x text-info';
  var okButtonEvent =
    options.ok ||
    function() {
      $('#dialog-box').modal('hide');
    };
  var cancelButtonEvent =
    options.cancel ||
    function() {
      $('#dialog-box').modal('hide');
    };
  var okButton = $('#dialog-ok-btn');
  var cancelButton = $('#dialog-cancel-btn');
  $('#dialog-icon').removeAttr('class');

  $('#dialog-message').html(message);
  $('#dialog-title').html(title);
  $('#dialog-icon').addClass(icon);

  okButton.unbind('click');
  cancelButton.unbind('click');

  okButton.on('click', okButtonEvent);
  cancelButton.on('click', cancelButtonEvent);

  $('#dialog-box').modal({ show: true, backdrop: 'static' });
}

var APIRequest = (function() {
  var data = Object.create(null);

  data.fetch = function(options) {
    var url = options.url;
    var callback = options.success;

    $.get({
      url: url,
      success: callback,
      error: function(error) {
        console.log(error);
      }
    }).fail(function(data) {
      console.log('failed');
      showDialog({
        title: 'Server Error',
        message: 'Server was unable to process request.',
        icon: 'fas fa-3x fa-exclamation-triangle text-danger'
      });
    });
  };

  data.submit = function(options) {
    var _this = options.context;
    var url = options.url;
    var success = options.success;
    var error =
      options.error ||
      function(error) {
        console.log(error);
      };

    $(_this).ajaxSubmit({ url: url, success: success, error: error });
  };

  return data;
})();

var Validator = (function() {
  var data = {};

  data.isRealName = function(val) {
    return /^([a-zA-Z]){3,}$/.test(val);
  };

  data.isRealEmail = function(val) {
    return /^(\w)+@(\w)+\.(\w){2,}$/.test(val);
  };

  data.isStrongPassword = function(val) {
    return /^(?=.*[a-z])(?=.*\d)[\S]{6,10}$/.test(val);
  };

  data.isRealMatricNo = function(val) {
    return /\d{4}\/(nd|hnd)\/\w{3,5}\/\d{5,}/.test(val.toLowerCase());
  };

  data.isMatch = function() {
    var val1 = $('#password').val();
    var val2 = $('#confirmPassword').val();

    return val1 === val2;
  };

  data.hasValue = function(val) {
    return val !== '';
  };

  return data;
})();

var modules = (function(apiRequest) {
  var data = {};

  data.getFaculties = function(query, callback) {
    query = query || '';
    apiRequest.fetch({ url: '/api/faculties/?' + query, success: callback });
  };

  data.getDepartments = function(query, callback) {
    query = query || '';
    apiRequest.fetch({ url: '/api/departments/?' + query, success: callback });
  };

  data.getLevelCategories = function(query, callback) {
    query = query || '';
    apiRequest.fetch({
      url: '/api/levelcategories/?' + query,
      success: callback
    });
  };

  data.getLevels = function(query, callback) {
    query = query || '';
    apiRequest.fetch({ url: '/api/levels/?' + query, success: callback });
  };

  data.getFees = function(query, callback) {
    query = query || '';
    apiRequest.fetch({ url: '/api/fees/?' + query, success: callback });
  };

  data.getFeeLists = function(query, callback) {
    query = query || '';
    apiRequest.fetch({ url: '/api/feelists/?' + query, success: callback });
  };

  data.getStudents = function(query, callback) {
    query = query || '';
    apiRequest.fetch({ url: '/api/students/' + query, success: callback });
  };

  data.getPayments = function(query, callback) {
    query = query || '';
    apiRequest.fetch({ url: '/api/payments/?' + query, success: callback });
  };

  data.getCurrentUser = function(query, callback) {
    query = query || '';
    apiRequest.fetch({ url: '/api/currentuser/?' + query, success: callback });
  };

  data.getStudentDashboardSummary = function(query, callback) {
    query = query || '';
    apiRequest.fetch({
      url: '/api/studentdashboardsummary/?' + query,
      success: callback
    });
  };

  data.getAdminDashboardSummary = function(query, callback) {
    query = query || '';
    apiRequest.fetch({
      url: '/api/admindashboardsummary/?' + query,
      success: callback
    });
  };

  data.getAdmins = function(query, callback) {
    query = query || '';
    apiRequest.fetch({ url: '/api/admins/' + query, success: callback });
  };

  return data;
})(APIRequest);

$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
  // event listener for navbar-toggler button click event
  $('.navbar-toggler').on('click', function(event) {
    $(this).toggleClass('change');
  });
  // event listener for student register form
  $('#register-form').on('submit', function(event) {
    event.preventDefault();
    var canSubmit = true;

    function validate(target, message, callback) {
      var element = $(target);
      var val;

      if (element.is('select')) {
        val = $(target + ' option:selected').val();
      } else {
        val = element.val();
      }

      var isValid = Validator[callback](val);
      if (!isValid) {
        $(target).addClass('error-field');
        $(target + 'Error').text(message);
      } else {
        $(target).removeClass('error-field');
        $(target + 'Error').text('');
      }

      return isValid;
    }

    var fields = [
      [
        '#firstName',
        'First Name field must not contain digits or be empty',
        'isRealName'
      ],
      [
        '#middleName',
        'Middle Name field must not contain digits or be empty',
        'isRealName'
      ],
      [
        '#lastName',
        'Last Name field must not contain digits or be empty',
        'isRealName'
      ],
      ['#department', 'Please select your department', 'hasValue'],
      ['#level', 'Please select your academic level', 'hasValue'],
      ['#matricNo', 'Matric number must not be empty', 'isRealMatricNo'],
      ['#emailAddress', 'Invalid Email Address', 'isRealEmail'],
      [
        '#password',
        '*password must be at least 6 digits long * must contain a number * must contain an alphabet.',
        'isStrongPassword'
      ],
      ['#confirmPassword', 'password mismatch.', 'isMatch']
    ];

    for (var i = 0; i < fields.length; i++) {
      canSubmit = validate(fields[i][0], fields[i][1], fields[i][2]);

      if (!canSubmit) break;
    }

    if (canSubmit) {
      console.log('ok');
      saveStudent(event, this);
    }
  });

  function saveStudent(e, _this) {
    e.preventDefault();

    APIRequest.submit({
      url: '/api/students/save/',
      context: _this,
      success: saveStudentRes
    });
  }

  function saveStudentRes(data) {
    $('#emailAddressError').text('');
    $('#matricNoError').text('');
    if (data.error === null) {
      var ele = $('#sign-up-msg');
      ele.removeClass('hidden');

      ele.html('<i class="fas fa-check-circle mr-2"></i>' + data.message);
      setTimeout(function() {
        window.location = '/signin/';
      });
    } else {
      $('#' + data.target + 'Error').text(data.message);
    }
  }

  function saveFaculty(e) {
    e.preventDefault();
    if ($('#faculty-name').val() !== '') {
      $('#faculty-name').attr('readonly', 'true');
      APIRequest.submit({
        url: '/api/faculties/save/',
        context: this,
        success: saveFacultyRes
      });
    }
  }
  function saveFacultyRes(data) {
    console.log(data);
    var ele = $('#faculty-msg');
    ele.html('');
    ele.removeClass('text-success');
    ele.removeClass('text-danger');

    if (data.error === null) {
      ele.addClass('text-success');
      ele.html('<i class="fas fa-check-circle mr-2"></i>success');
      setTimeout(function() {
        window.location = '/admin/departments';
      }, 200);
    } else {
      console.log('here');
      ele.addClass('text-danger');
      ele.html('<i class="fas fa-exclamation-circle mr-2"></i>' + data.message);
    }
    $('#faculty-name').removeAttr('readonly');
  }
  //-- register event
  $('#new-faculty-form').on('click', saveFaculty);

  function saveDepartment(e) {
    e.preventDefault();
    var canSubmit = true;

    $.each($('#new-department-form').serializeArray(), function(_, field) {
      $('#' + field.name + 'Error').text(' ');
      if (field.value === '') {
        $('#' + field.name + 'Error').text('Field must not be empty.');
        canSubmit = false;
      }
    });

    if (canSubmit) {
      $(this).attr('disabled', 'true');
      APIRequest.submit({
        url: '/api/departments/save/',
        context: this,
        success: saveDepartmentRes
      });
    }
  }

  function saveDepartmentRes(data) {
    // console.log(data);
    var ele = $('#department-msg');
    ele.removeClass('text-danger text-success');
    ele.html('');

    if (data.error) {
      ele.addClass('text-danger');
      ele.html('<i class="fas fa-exclamation-circle mr-2"></i>' + data.message);
    } else {
      ele.addClass('text-success');
      ele.html('<i class="fas fa-info-circle mr-2"></i>' + data.message);

      setTimeout(function() {
        window.location = '/admin/departments/';
      }, 200);
    }
  }
  $('#new-department-form').on('submit', saveDepartment);

  function updateDepartment(e) {
    e.preventDefault();
    var canUpdate = true;

    $.each($(this).serializeArray(), function(_, field) {
      $('#' + field.name + 'Error').text(' ');
      if (field.value === '') {
        $('#' + field.name + 'Error').text('Field must not be empty.');
        canUpdate = false;
      }
    });

    if (canUpdate) {
      $(this).attr('disabled', 'true');
      APIRequest.submit({
        url: '/api/departments/update/?_method=PUT',
        context: this,
        success: updateDepartmentRes
      });
    }
  }

  function updateDepartmentRes(data) {
    console.log(data);
    var ele = $('.department-update-msg');
    ele.removeClass('text-success');
    ele.removeClass('text-danger');

    if (data.error === null) {
      ele.addClass('text-success');
      ele.html('<i class="fas fa-info-circle mr-2"></i>' + data.message);
      setTimeout(function() {
        window.location = '/admin/departments/';
      }, 800);
    } else {
      ele.addClass('text-danger');
      ele.html('<i class="fas fa-exclamation-circle mr-2"></i>' + data.message);
    }
  }
  $(document).on('submit', '.update-department-form', updateDepartment);

  if ($('#admin-department-page').length > 0) {
    modules.getDepartments('name=john', function(data) {
      // console.log(data);
      Component.create(data, '#departments-template', '#departments-pane');

      modules.getFaculties('limit=10', function(data) {
        // console.log(data);
        Component.create(data, '#faculties-template', '#faculties-pane');
        Component.create(
          data,
          '#faculties-department-template',
          '.faculties-department-pane',
          'a'
        );
      });
    });
  }

  function updateFaculty(e) {
    e.preventDefault();

    var canUpdate = true;

    $.each($(this).serializeArray(), function(_, field) {
      $('#' + field.name + 'Error').text(' ');
      if (field.value === '') {
        canUpdate = false;
      }
    });

    if (canUpdate) {
      $(this).attr('disabled', 'true');
      APIRequest.submit({
        url: '/api/faculties/update/?_method=PUT',
        context: this,
        success: updateFacultyRes
      });
    }
  }

  function updateFacultyRes(data) {
    if (data.error === null) {
      setTimeout(function() {
        window.location = '/admin/departments/';
      }, 200);
    } else {
      $('#faculty-update-msg').html(data.message);
    }
  }
  $(document).on('submit', '.update-faculty-form', updateFaculty);

  // display the confirm department deletion dialog. and register events
  $(document).on('click', '.delete-department', function(e) {
    showDialog({
      title: 'Confirm Deletion',
      message: 'Do you want to delete department?',
      ok: function() {
        var id = $(e.target).attr('data-id');
        console.log(id);
        $.post('/api/departments/delete/?_method=DELETE', { id: id }, function(
          data
        ) {
          console.log(data);
          $('#dialog-box').modal('hide');
          setTimeout(function() {
            window.location = '/admin/departments/';
          }, 200);
        });
      }
    });
  });

  // display the confirm faculty deletion dialog. and register events
  $(document).on('click', '.delete-faculty', function(e) {
    showDialog({
      title: 'Confirm Deletion',
      message: 'Do you want to delete faculty?',
      ok: function() {
        var id = $(e.target).attr('data-id');

        $.post('/api/faculties/delete/?_method=DELETE', { id: id }, function(
          data
        ) {
          console.log(data);
          $('#dialog-box').modal('hide');
          setTimeout(function() {
            window.location = '/admin/departments/';
          }, 200);
        }).fail(function() {
          showDialog({
            title: 'Operation failed',
            message: 'Server was unable to process request',
            icon: 'fas fa-exclamation-triangle fa-3x text-danger'
          });
        });
      }
    });
  });

  function saveFee(e) {
    e.preventDefault();
    var canSubmit = true;

    $.each($(this).serializeArray(), function(_, field) {
      // console.log(field);
      $('#' + field.name + 'Error').text('');
      if (field.name !== 'levelId' && field.value === '') {
        $('#' + field.name + 'Error').text('field must not be empty');
        canSubmit = false;
      }
    });

    if (canSubmit) {
      console.log('submit..');
      APIRequest.submit({
        url: '/api/fees/save/',
        context: this,
        success: saveFeeRes
      });
    }
  }

  function saveFeeRes(data) {
    var ele = $('#new-fee-msg');
    ele.removeClass('hidden alert-danger');

    if (data.error) {
      ele.addClass('alert-danger');
      ele.text(data.message);
      return;
    }

    ele.addClass('alert-success');
    ele.text(data.message);
    setTimeout(function() {
      window.location = '/admin/fees/';
    }, 200);
  }
  $('#new-fee-form').on('submit', saveFee);

  function FeeListComponent(data) {
    var state = { data: data, id: 1 };

    return function(e) {
      $('#add-fee-list-' + (state.id - 1)).attr('disabled', 'true');
      $('#delete-fee-list-' + (state.id - 1)).removeAttr('disabled');
      console.log(state);
      var container = $(this).attr('data-id');
      Component.create(state, '#fee-list-template', '#fee-list-pane-0', 'a');
      ++state.id;
    };
  }

  function saveFeeList(e) {
    e.preventDefault();
    var canSubmit = true;
    $.each($(this).serializeArray(), function(_, field) {
      $('#' + field.name + 'Error').text('');
      if (field.value === '' && field.name !== 'levelId') {
        $('#' + field.name + 'Error').text(field.name + ' must not be empty.');
        canSubmit = false;
      }
    });

    if (canSubmit) {
      APIRequest.submit({
        url: '/api/feelists/save/',
        context: this,
        success: saveFeeListRes
      });
    }
  }
  function saveFeeListRes(data) {
    console.log(data);

    if (data.error === null) {
      Component.create(
        data,
        '#fee-list-table-template',
        '#fee-list-pane-table-' + data.feeList.feeId,
        'a'
      );
    }
  }
  $(document).on('submit', '.fee-list-form', saveFeeList);

  function updateFee(e) {
    e.preventDefault();
    var canUpdate = true;

    $.each($(this).serializeArray(), function(_, field) {
      // console.log(field);
      $('#' + field.name + 'Error').text('');
      if (field.name !== 'levelId' && field.value === '') {
        $('#' + field.name + 'Error').text('field must not be empty');
        canUpdate = false;
      }
    });

    if (canUpdate) {
      APIRequest.submit({
        url: '/api/fees/update/?_method=PUT',
        context: this,
        success: updateFeeRes
      });
    }
  }

  function updateFeeRes(data) {
    console.log(data);
    if (data.error === null) {
      setTimeout(function() {
        window.location = '/admin/fees/';
      }, 200);
    }
  }
  $(document).on('submit', '.edit-fee-form', updateFee);

  if ($('#fees-page').length > 0) {
    modules.getFees(null, function(data) {
      console.log(data);
      Component.create(data, '#fees-template', '#fees-pane');

      modules.getLevelCategories(null, function(data) {
        console.log(data);
        Component.create(
          data,
          '#level-category-option-template',
          '.level-category-pane',
          'a'
        );
        feeListComponent = FeeListComponent(data);
        feeListComponent(new Event('click'));
        $(document).on('click', '.add-fee-list', feeListComponent);
        $(document).on('click', '.delete-fee-list-btn', function(event) {
          event.preventDefault();
          event.stopPropagation();

          var id = $(this).attr('data-fee-list-id');
          console.log($('#fee-list-' + id));
          $('#fee-list-' + id).remove();
        });
      });
    });
  }

  $(document).on('change', '.level-category-pane', function(e) {
    e.preventDefault();
    var levelEle = $(this).attr('data-level-target');

    var levelCategoryId = $(this).serializeArray()[0].value;
    if (levelCategoryId) {
      modules.getLevels('?levelcategoryid=' + levelCategoryId, function(data) {
        // console.log(data);
        if (data.levels.length > 0) {
          Component.create(data, '#level-option-template', levelEle);
        } else {
          $(levelEle).html('<option value="">General Level</option>');
        }
      });
    }
  });

  // display the confirm faculty deletion dialog. and register events
  $(document).on('click', '.delete-fee-list', function(e) {
    showDialog({
      title: 'Confirm Deletion',
      message: 'Do you want to delete fee list?',
      ok: function() {
        var id = $(e.target).attr('data-id');

        $.post('/api/feelists/delete/?_method=DELETE', { id: id }, function(
          data
        ) {
          console.log(data);
          $('#dialog-box').modal('hide');
          setTimeout(function() {
            window.location = '/admin/fees/';
          }, 200);
        }).fail(function() {
          showDialog({
            title: 'Operation failed',
            message: 'Server was unable to process request',
            icon: 'fas fa-exclamation-triangle fa-3x text-danger'
          });
        });
      }
    });
  });

  // display the confirm faculty deletion dialog. and register events
  $(document).on('click', '.delete-fee', function(e) {
    showDialog({
      title: 'Confirm Deletion',
      message: 'Do you want to delete fee?',
      ok: function() {
        var id = $(e.target).attr('data-id');

        $.post('/api/fees/delete/?_method=DELETE', { id: id }, function(data) {
          console.log(data);
          $('#dialog-box').modal('hide');
          setTimeout(function() {
            window.location = '/admin/fees/';
          }, 200);
        }).fail(function() {
          showDialog({
            title: 'Operation failed',
            message: 'Server was unable to process request',
            icon: 'fas fa-exclamation-triangle fa-3x text-danger'
          });
        });
      }
    });
  });

  if ($('#sign-up-page').length > 0) {
    modules.getDepartments(null, function(data) {
      Component.create(data, '#department-option-template', '#department', 'a');
      modules.getLevelCategories(null, function(data) {
        Component.create(data, '#level-option-template', '#level', 'a');
      });
    });
  }

  function signIn(url, redirectUrl) {
    return function(event) {
      event.preventDefault();
      var ele = $('#signin-msg');
      ele.removeClass('alert-success');
      ele.removeClass('alert-danger');
      ele.removeClass('hidden');
      ele.html(
        '<div class="progress mb-1"><div class="progress-bar bg-success progress-bar-striped progress-bar-animated" style="width:100%">authenticating</div></div>'
      );

      APIRequest.submit({
        url: url,
        context: this,
        success: function(data) {
          if (data.error === null) {
            setTimeout(function() {
              window.location = redirectUrl;
            }, 100);
            ele.addClass('alert-success');
            ele.html('<i class="fas fa-info-circle mr-1"></i>' + data.message);
          } else {
            ele.addClass('alert-danger');
            ele.html(
              '<i class="fas fa-exclamation-triangle mr-1"></i>' + data.message
            );
          }
        }
      });
    };
  }

  $('#student-sign-in-form').on(
    'submit',
    signIn('/student/signin/', '/student/')
  );
  $('#admin-sign-in-form').on('submit', signIn('/admin/signin/', '/admin/'));

  if ($('#student-fee-page').length > 0) {
    modules.getFees(window.location.search.substring(1), function(data) {
      console.log(data);
      Component.create(data, '#fees-table-template', '#fees-pane');
    });

    modules.getCurrentUser(null, function(currentUser) {
      // var userId = currentUser ? currentUser.id : '';
      if (currentUser) {
        $('#fees-pane').on('click', '.view-fee-list-btn', function(e) {
          var feeId = $(this).attr('data-fee-id');

          Component.create(
            {},
            '#fee-lists-loading-template',
            '#fee-lists-pane'
          );

          modules.getFeeLists(
            'feeid=' +
              feeId +
              '&studentid=' +
              currentUser.id +
              '&levelcategoryid=' +
              currentUser.levelCategoryId,
            function(data) {
              console.log(data);
              Component.create(data, '#fee-lists-template', '#fee-lists-pane');
            }
          );
        });
      }
    });
  }

  if ($('#make-payment-page').length > 0) {
    var id = $('#make-payment-page').attr('data-id');
    Loading.show('#body');

    modules.getFeeLists('id=' + id, function(data) {
      console.log(data);
      var studentId = $('#make-payment-page').attr('data-student-id');
      if (studentId) {
        modules.getCurrentUser(null, function(studentData) {
          console.log(studentData);

          Component.create(
            { feeLists: data.feeLists, student: studentData},
            '#payment-detail-template',
            '#payment-detail-pane'
          );

          Loading.hide('#body');

          $('#make-payment-btn').on('click', function(e) {
            makePayment(studentData, data.feeLists[0]);
          });
        });
      }
    });
  }

  if ($('#receipt-page').length > 0) {
    var id = $('#receipt-page').attr('data-id');

    modules.getPayments('id=' + id, function(data) {
      console.log(data);
      Component.create(data, '#receipt-template', '#receipt-pane', 'a');
    });
  }

  if ($('#student-receipts-page').length > 0) {
    modules.getCurrentUser(null, function(currentUser) {
      if (currentUser) {
        modules.getPayments(
          'studentId=' +
            currentUser.id +
            '&' +
            window.location.search.substring(1),
          function(data) {
            console.log(data);
            Component.create(data, '#receipts-template', '#receipts-pane');
          }
        );
      }
    });
  }

  if ($('#student-dashbaord').length > 0) {
    modules.getCurrentUser(null, function(currentUser) {
      if (currentUser) {
        modules.getStudentDashboardSummary(
          'studentid=' +
            currentUser.id +
            '&levelcategoryid=' +
            currentUser.levelCategoryId,
          function(summary) {
            if (summary) {
              $('#cash-paid').text(summary.cashPaid);
              $('#cash-unpaid').text(summary.cashUnPaid);
              $('#total-paid').text(summary.totalPaid);
              $('#total-unpaid').text(summary.totalUnPaid);
            }
          }
        );

        modules.getFeeLists(
          'studentid=' +
            currentUser.id +
            '&levelcategoryid=' +
            currentUser.levelCategoryId,
          function(data) {
            Component.create(
              data,
              '#unpaid-fees-template',
              '#unpaid-fees-pane'
            );
          }
        );
      }
    });
  }

  if ($('#admin-students-page').length > 0) {
    modules.getStudents(
      '?status=1&' + window.location.search.substring(1),
      function(data) {
        Component.create(data, '#students-template', '#students-pane');
      }
    );
  }

  if ($('#admin-payments-page').length > 0) {
    modules.getPayments(
      'approved=1&' + window.location.search.substring(1),
      function(data) {
        Component.create(data, '#payments-template', '#payments-pane');
      }
    );
  }

  if ($('#admin-dashboard').length > 0) {
    modules.getPayments('approved=0', function(paymentData) {
      modules.getStudents('?status=0', function(studentData) {
        Component.create(
          studentData,
          '#new-students-template',
          '#new-students-pane'
        );
      });
      Component.create(
        paymentData,
        '#new-payments-template',
        '#new-payments-pane'
      );
      modules.getAdminDashboardSummary(null, function(data) {
        $('#total-payments').text(data.totalPayments);
        $('#total-fees').text(data.totalFees);
        $('#total-students').text(data.totalStudents);
      });
    });

    $(document).on('click', '.approve-student-btn', function(event) {
      event.preventDefault();

      var id = $(this).attr('data-id');
      $.post(
        '/api/students/update/?_method=PUT',
        { status: 1, id: id },
        function(data) {
          console.log(data);
          if (data.error === null) {
            setTimeout(function() {
              window.location = '/admin/';
            }, 100);
          }
        }
      );
    });

    $(document).on('click', '.confirm-payment-btn', function(event) {
      event.preventDefault();

      var id = $(this).attr('data-id');
      $.post(
        '/api/payments/update/?_method=PUT',
        { approved: 1, id: id },
        function(data) {
          console.log(data);
          if (data.error === null) {
            setTimeout(function() {
              window.location = '/admin/';
            }, 100);
          }
        }
      );
    });
  }

  if ($('#student-profile-page').length > 0) {
    modules.getCurrentUser(null, function(student) {
      if (student) {
        $('#full-name').html(student.firstName + ' ' + student.lastName);
        $('#matric-no').html(student.matricNo);

        Component.create(
          { student: student },
          '#student-data-template',
          '#student-data-pane'
        );

        Component.create(
          { student: student },
          '#edit-profile-template',
          '#edit-profile-pane'
        );
      }
    });

    $(document).on('submit', '#edit-student-form', function(event) {
      event.preventDefault();
      event.stopPropagation();
      console.log(this);
      var canSubmit = true;

      $.each($(this).serializeArray(), function(_, field) {
        $('#' + field.name + 'Error').text('');

        if (field.value === '') {
          $('#' + field.name + 'Error').text(
            field.name + ' field must not be empty.'
          );
          canSubmit = false;
        }
      });

      if (canSubmit) {
        APIRequest.submit({
          url: '/api/students/update/?_method=PUT',
          context: this,
          success: function(data) {
            console.log(data);
            $('#edit-msg').removeClass('hidden');
            $('#edit-msg').text(data.message);
            setTimeout(function() {
              window.location = '/student/profile/';
            }, 100);
          }
        });
      }
    });

    $('#change-password-form').on('submit', function(e) {
      e.preventDefault();
      var canSubmit = true;
      $('#confirmPasswordError').text('');

      $.each($(this).serializeArray(), function(_, field) {
        $('#' + field.name + 'Error').text('');

        if (field.value === '') {
          $('#' + field.name + 'Error').text(
            field.name + ' must not be empty.'
          );
          canSubmit = false;
        }
      });

      var password = $('#password', this).val();
      var confirmPassword = $('#confirmPassword', this).val();

      if (password !== confirmPassword) {
        canSubmit = false;
        $('#confirmPasswordError').text('password mismatch');
      }

      if (canSubmit) {
        APIRequest.submit({
          url: '/api/students/changepassword/?_method=PUT',
          context: this,
          success: function(data) {
            console.log(data);
            var msgBox = $('#change-password-msg');
            msgBox.removeClass('hidden');
            if (data.error === null) {
              msgBox.addClass('alert-success');
              setTimeout(function() {
                window.location = '/signout/';
              }, 100);
            } else {
              msgBox.addClass('alert-danger');
            }
            msgBox.text(data.message);
          }
        });
      }
    });
  }

  (function(validator) {
    function validateInput(validateBy, errorMessage) {
      return function(event) {
        var context = $(this);
        var name = context.attr('name');
        errorMessage = errorMessage || name + ' field must not be empty';
        var timeout = setTimeout(function() {
          if (!validator[validateBy](context.val())) {
            $('#' + name + 'Error').html(errorMessage);
          } else {
            clearTimeout(timeout);
            $('#' + name + 'Error').html('');
            $('input[name="' + name + '"]').css('border', '1px solid gray');
          }
        }, 200);
      };
    }

    $('#first-name').on(
      'keyup',
      validateInput(
        'isRealName',
        'first name field must be at least 3 characters long'
      )
    );
    $('#last-name').on(
      'keyup',
      validateInput(
        'isRealName',
        'last name field must be at least 3 characters long'
      )
    );
    $('#email-address').on(
      'keyup',
      validateInput('isRealEmail', 'please enter a valid email address')
    );
    $('#password').on(
      'keyup',
      validateInput(
        'isStrongPassword',
        'Note:<br> Must contain alpabets <br>Must contain digits <br>Must be at least 6 characters or more'
      )
    );

    $('#confirmPassword').on(
      'keyup',
      validateInput('isMatch', 'password mismatch')
    );
  })(Validator);

  function saveAdmin(redirectUrl) {
    return function(e) {
      e.preventDefault();

      var canSubmit = true;
      var valid = Validator;
      var validateBy = {
        firstName: 'isRealName',
        lastName: 'isRealName',
        emailAddress: 'isRealEmail',
        password: 'isStrongPassword',
        confirmPassword: 'isMatch'
      };

      $.each($(this).serializeArray(), function(_, field) {
        var name = field.name,
          value = field.value;
        if (validateBy[name]) {
          if (!valid[validateBy[name]](value)) {
            canSubmit = false;
            $('input[name="' + name + '"]').css('border', '2px solid red');
          }
        }
      });

      if (canSubmit) {
        APIRequest.submit({
          url: '/api/admins/save/',
          context: this,
          success: function(data) {
            console.log(data);
            var msgBox = $('#new-admin-msg');
            msgBox.removeClass('hidden');
            msgBox.removeClass('alert-success');
            msgBox.removeClass('alert-danger');

            if (data.error === null) {
              msgBox.addClass('alert-success');
              setTimeout(function() {
                window.location = redirectUrl;
              }, 100);
            } else {
              msgBox.addClass('alert-danger');
            }
            msgBox.html(
              '<i class="fas fa-info-circle fa-2x mr-2"></i>' + data.message
            );
          }
        });
      } else {
        showDialog({
          title: 'Operation Failed',
          message:
            'Some fields have incorrect data please fill them out with correct data as specified.',
          icon: 'fas fa-exclamation-triangle fa-3x text-danger'
        });
      }
    };
  }

  $('#new-admin-form').on('submit', saveAdmin('/admin/signin/'));
  $('#create-admin-form').on('submit', saveAdmin('/admin/admins/'));

  if ($('#admins-page').length > 0) {
    modules.getAdmins(window.location.search, function(adminData) {
      Component.create(adminData, '#admins-template', '#admins-pane');
    });

    $('#admins-pane').on('click', '.delete-admin-btn', function(e) {
      var id = $(this).attr('data-id');
      showDialog({
        title: 'Confirm',
        message: 'Do you want to delete this admin?',
        ok: function(e) {
          $.post('/api/admins/delete/?_method=DELETE', { id: id }, function(
            data
          ) {
            console.log(data);
            var action = function(event) {
              $('#dialog-box').modal('hide');
              setTimeout(function() {
                window.location = '/admin/admins/';
              });
            };

            var okBtn = (cancelBtn = function(event) {
                $('#dialog-box').modal('hide');
              }),
              message,
              title;

            if (data.error === null) {
              okBtn = action;
              cancelBtn = action;
              message = 'Admin has been deleted successfully.';
              title = 'Operation Success';
            } else {
              title = 'Operation Failed';
              message = data.message;
            }
            setTimeout(function() {
              showDialog({
                title: title,
                message: message,
                ok: okBtn,
                cancel: cancelBtn
              });
            }, 200);
          });
          // setTimeout(function() {
          //   $('#dialog-box').modal('hide');
          // }, 200);
        }
      });
    });
  }

  if ($('#digital-clock').length > 0) {
    var DigitalClock = (function() {
      function padZero(value) {
        return value < 10 ? '0' + value : '' + value;
      }

      function getTime() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        return { hours: hours, minutes: minutes, seconds: seconds };
      }

      function formatTime(timeObj) {
        var hours = timeObj.hours;

        if (hours > 12) {
          hours -= 12;
        }
        return (
          padZero(hours) +
          ':' +
          padZero(timeObj.minutes) +
          ':' +
          padZero(timeObj.seconds)
        );
      }

      return {
        setCurrentTime: function() {
          setInterval(function() {
            $('#digital-clock').text(formatTime(getTime()));
          }, 1000);
        }
      };
    })();

    DigitalClock.setCurrentTime();
  }

  if ($('#admin-profile-page').length > 0) {
    modules.getCurrentUser(null, function(adminData) {
      if (adminData) {
        $('#full-name').html(adminData.firstName + ' ' + adminData.lastName);
        $('#user-role').html(adminData.userRole);

        Component.create(
          { admin: adminData },
          '#admin-data-template',
          '#admin-data-pane'
        );

        Component.create(
          { admin: adminData },
          '#edit-profile-template',
          '#edit-profile-pane'
        );
      }
    });

    $(document).on('submit', '#edit-admin-form', function(event) {
      event.preventDefault();
      var canSubmit = true;

      $.each($(this).serializeArray(), function(_, field) {
        $('#' + field.name + 'Error').text('');

        if (field.value === '') {
          $('#' + field.name + 'Error').text(
            field.name + ' field must not be empty.'
          );
          canSubmit = false;
        }
      });

      if (canSubmit) {
        APIRequest.submit({
          url: '/api/admins/update/?_method=PUT',
          context: this,
          success: function(data) {
            console.log(data);
            $('#edit-msg').removeClass('hidden');
            $('#edit-msg').text(data.message);
            setTimeout(function() {
              window.location = '/admin/profile/';
            }, 100);
          }
        });
      }
    });

    $('#change-password-form').on('submit', function(e) {
      e.preventDefault();
      var canSubmit = true;
      $('#confirmPasswordError').text('');

      $.each($(this).serializeArray(), function(_, field) {
        $('#' + field.name + 'Error').text('');

        if (field.value === '') {
          $('#' + field.name + 'Error').text(
            field.name + ' must not be empty.'
          );
          canSubmit = false;
        }
      });

      var password = $('#password', this).val();
      var confirmPassword = $('#confirmPassword', this).val();

      if (password !== confirmPassword) {
        canSubmit = false;
        $('#confirmPasswordError').text('password mismatch');
      }

      if (canSubmit) {
        APIRequest.submit({
          url: '/api/admins/changepassword/?_method=PUT',
          context: this,
          success: function(data) {
            console.log(data);
            var msgBox = $('#change-password-msg');
            msgBox.removeClass('hidden');
            if (data.error === null) {
              msgBox.addClass('alert-success');
              setTimeout(function() {
                window.location = '/admin/signout/';
              }, 100);
            } else {
              msgBox.addClass('alert-danger');
            }
            msgBox.text(data.message);
          }
        });
      }
    });
  }

  $('#close-flash-box').on('click', function(event) {
    event.preventDefault();
    $('#flash-box').remove();
  });

  $('#contact-us-form').on('submit', function(event) {
    event.preventDefault();
    var canSubmit = true;
    // setTimeout(function() {
    //   Loading.hide('#contact-us');
    // }, 1000);

    $.each($(this).serializeArray(), function(_, field) {
      var name = field.name,
        value = field.value;
      $(':input[name="' + name + '"]').css('border', '2px solid #888');

      if (value === '') {
        $(':input[name="' + name + '"]').css('border', '2px solid red');
        canSubmit = false;
      }
    });

    if (canSubmit) {
      Loading.show('#contact-us');
      APIRequest.submit({
        url: '/api/sendmail/',
        context: this,
        success: function(data) {
          var msgBox = $('#contact-msg');
          msgBox.removeClass('hidden');
          msgBox.removeClass('alert-danger');
          msgBox.removeClass('alert-success');

          Loading.hide('#contact-us');
          if (data.error === null) {
            $.each($('#contact-us-form').serializeArray(), function(_, field) {
              var name = field.name;
              $(':input[name="' + name + '"]').val('');
            });
            msgBox.addClass('alert-success');
          } else {
            msgBox.addClass('alert-danger');
          }
          msgBox.text(data.message);
        }
      });
    }
  });

  $('#print-btn').on('click', print);

  AOS.init();
});
