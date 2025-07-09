import { z } from 'zod';
import type schema from './fetcher/schema';

export type Result<T> =
	| {
			status: 'error';
			code: number;
			message: string;
	  }
	| {
			status: 'success';
			code: number;
			data: T;
	  };

export type ResultError = Extract<Result<unknown>, { status: 'error' }>;
export type ResultSuccess<T> = Extract<Result<T>, { status: 'success' }>;

export type FetcherSchema = typeof schema;
export type FetcherRequest<T extends keyof FetcherSchema> = z.infer<FetcherSchema[T]['request']>;
export type FetcherResponse<T extends keyof FetcherSchema> = z.infer<FetcherSchema[T]['response']>;
export type FetcherMode = 'json' | 'raw';
export type FetcherResult<T extends keyof FetcherSchema, M extends FetcherMode> = M extends 'json'
	? Result<FetcherResponse<T>>
	: Response;
