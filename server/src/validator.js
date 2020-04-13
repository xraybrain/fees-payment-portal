const _ = require('lodash');

exports.sanitize = data => {
  const sanitized = {};
  for ([key, value] of Object.entries(data)) {
    if (value) {
      sanitized[key] = _.escape(value)
        .toLowerCase()
        .trim();
    }
  }

  return sanitized;
};
