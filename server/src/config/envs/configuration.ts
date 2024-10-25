export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT!, 10) || 4000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT!, 10) || 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dbName: process.env.DATABASE_DB_NAME,
    dbSync: process.env.DATABASE_SYNC || false,
  },
  auth: {
    accessJwtTokenSecret: process.env.ACCESS_JWT_TOKEN_SECRET,
    accessJwtTokenExpiry: process.env.ACCESS_JWT_TOKEN_EXPIRY || 60 * 15, // 15 mins
    refreshJwtTokenSecret: process.env.REFRESH_JWT_TOKEN_SECRET,
    refreshJwtTokenExpiry:
      process.env.REFRESH_JWT_TOKEN_EXPIRY || 60 * 60 * 24 * 7, // 7 days
  },
  payment: {
    razorPayKeyId: process.env.RAZORPAY_KEY_ID,
    razorPaySecretKey: process.env.RAZORPAY_KEY_SECRET,
  },
});
