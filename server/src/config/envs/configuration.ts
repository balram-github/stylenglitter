export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT!, 10) || 4000,
  app: {
    frontendUrl: process.env.FRONTEND_URL,
  },
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
    emailVerificationSecret: process.env.EMAIL_VERIFICATION_SECRET,
    emailVerificationExpiry:
      process.env.EMAIL_VERIFICATION_EXPIRY || 24 * 60 * 60, // 24 hours
    passwordResetSecret: process.env.PASSWORD_RESET_SECRET,
    passwordResetExpiry: process.env.PASSWORD_RESET_EXPIRY || 60 * 30, // 30 mins,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
  },
  payment: {
    razorPayKeyId: process.env.RAZORPAY_KEY_ID,
    razorPaySecretKey: process.env.RAZORPAY_KEY_SECRET,
    razorPayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    ses: {
      host: process.env.AWS_SES_HOST,
      port: process.env.AWS_SES_PORT,
      fromEmail: process.env.FROM_EMAIL,
    },
  },
});
