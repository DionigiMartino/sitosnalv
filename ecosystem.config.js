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
        EMAIL_HOST: "smtps.aruba.it",
        EMAIL_PORT: 465,
        EMAIL_USER: "socioassistenziale@snalv.it",
        EMAIL_PASSWORD: "anaste18",
        EMAIL_FROM: "noreply@snalv.it",
        EMAIL_TO: "socioassistenziale@snalv.it",
      },
    },
  ],
};
