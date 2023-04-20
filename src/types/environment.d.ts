declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ROUTER_PORT: number;
      DEFAULT_ROUTER_PASSWORD: string;
    }
  }
}

export {};
