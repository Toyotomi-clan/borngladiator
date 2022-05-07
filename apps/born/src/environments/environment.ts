// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  production: false,
  Ory: "/.ory",
  userSessionStaleTime: 300000, // 5m
  defaultStaleTime: 60000, // 1 minute
  deathClockServer: "http://localhost:5165",
  defaultRetryRate: 1,
  seqLogServer: "http://localhost:5341",
  seqApiKey: "VkD2wnKcHFCfsjzHuzsX"
};
