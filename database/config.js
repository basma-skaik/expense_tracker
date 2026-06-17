require('dotenv').config();

// نحدد البيئة الحالية، وإذا لم تكن محددة نعتبر أنها development تلقائياً
const environment = process.env.NODE_ENV || 'development';

const dbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
};

// هنا نقوم بتصدير كائن يحتوي على البيئة الحالية فقط ديناميكياً
// هنا معتاها زي كدا:
// module.exports = {
//   development: dbConfig,
//   production: dbConfig,
// };
module.exports = {
  [environment]: dbConfig,
};
