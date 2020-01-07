export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER || null,
    password: process.env.MAIL_PASS || null,
  },
  default: {
    from: process.env.MAIL_FROM,
  },
};
