import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** When true, failed responses do not show a global error toast. */
    silentError?: boolean;
  }
}
