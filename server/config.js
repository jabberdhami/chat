const config = {
    PORT: 3000,
    SECRET_KEY: 'your-secret-key',
};

module.exports = config;
module.exports = {
    PORT: process.env.PORT || 3000
};
