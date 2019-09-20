const env = {
  environment: process.env.NODE_ENV,
  port: 3000,
  hosts: {
    ideas: `http://${process.env.IDEAS_SERVICE_HOST}` || 'http://ideas:3000',
  },
  api: {
    ideas: {
      root: `/${process.env.IDEAS_API_ROOT}` || '/ideas',
    },
  },
};

export default env;
