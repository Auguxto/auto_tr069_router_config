declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ROUTER_PORT: number;
      DEFAULT_ROUTER_PASSWORD: string;
      ACS_URL: string;
      ACS_INFORM_INTERVAL: number;
      ACS_USER?: string;
      ACS_PASSWORD?: string;
      AUTH_CONNECTION_REQUEST: string;
      AUTH_CONNECTION_REQUEST_USER: string;
      AUTH_CONNECTION_REQUEST_PASSWORD: string;
    }
  }
}

export {};
