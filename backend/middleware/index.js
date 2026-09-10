const { protect, authorize } = require('./authMiddleware');
const errorHandler = require('./errorHandler');

module.exports = { protect, authorize, errorHandler };
