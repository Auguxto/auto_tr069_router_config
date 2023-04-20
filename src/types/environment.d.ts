declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ROUTER_PORT: number;
      DEFAULT_ROUTER_PASSWORD: string;
      ACS_URL: string;
      ACS_INFORM_INTERVAL: number;
      ACS_USER?: string;
      ACS_PASSWORD?: string;
    }
  }
}

export {};
