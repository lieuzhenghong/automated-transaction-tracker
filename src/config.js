var exports = module.exports = {};


exports.TWILIO_ACCOUNT_SID = 'AC69cddba1cb0e2b3761daee88bf150157';
exports.TWILIO_AUTH_TOKEN = '0d681f6d2eca9a7ed9343c972a9eac5c';
exports.TWILIO_TEST_NO = '14439917746'; 
exports.secret = 'testing'; //Used to sign a JSON Web Token
exports.token_expiry_time = '14 days'; // Token expiry time
exports.port = process.env.PORT || 3001;
exports.database = process.env.MONGODB_URI || 'mongodb://localhost:27017/transactions_db';