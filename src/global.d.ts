declare namespace NodeJS {
  export interface ProcessEnv {
    REDISHOST: string;
    REDISNAME: string;
    REDISPASS: string;
    REDISPORT: string;
    REDISROLE: 'master' | 'slave';
    JWT_REFRESH_SECRET: string;
    JWT_SECRET: string;
    JWT_SOCKET_SECRET: string;
    DISCORD_APP_ID: string;
    DISCORD_APP_SECRET: string;
    DISCORD_CALLBACK_URL: string;
    MONGO_TLS_SERT_KEYFILE_PATH: string;
    MONGO_CLUSTER_IP: string;
    REDIRECT_URL: string;
    SESSION_SAULT: string;
    EXPRESS_PRIVATE_KEY_PATH: string;
    EXPRESS_SERT_PATH: string;
    DEPLOYMENT_TOKEN: string;
    UE_CALLBACK_URL: string;
  }
}
