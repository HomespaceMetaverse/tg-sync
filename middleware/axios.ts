import axiosOriginal, { AxiosError } from 'axios';
import { Instance as Logger } from './logger';
import qs from 'qs';

/** --- AXIOS INSTANCE --- */

const formatParams = (params: Record<string, unknown>): string =>
  qs.stringify(params, { indices: false, arrayFormat: 'repeat' });

export const axios = axiosOriginal.create({
  paramsSerializer: formatParams,
});

axios.interceptors.request.use(
  config => config,
  (err: AxiosError) => {
    Logger.error(`AXIOS Interceptor: Error returned: ${err}`);
    return Promise.reject(err);
  }
);

export type ResponseError = AxiosError<{ message: string }>;
