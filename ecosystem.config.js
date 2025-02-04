module.exports = {
  apps: [
    {
      name: "snalv",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        NEXTAUTH_URL: "http://localhost:3000",
        NEXTAUTH_SECRET: "57jseAh9H2EKVtcwMIMTvCwjoVhbMOp1WblP3tysTfJUHLWbwA",
      },
    },
  ],
};
