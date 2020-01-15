module.exports = {
  env: (process.env.NODE_ENV || "development").trim(),
  host: "localhost",
  secret: process.env.PISE_SECRET || "default",
  google_key: process.env.PISE_GOOGLE_KEY,
  backend_port: process.env.PISE_BACKEND_PORT
};