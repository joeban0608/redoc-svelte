import schema from '$lib/fetcher/schema';
import type { FetcherRequest, FetcherResponse, FetcherSchema } from '$lib/type';
import { error, type RequestEvent } from '@sveltejs/kit';
import z from 'zod';

export class API {
	static ERROR(code: number, message: string) {
		const body = {
			code,
			message,
			status: 'error'
		};
		throw error(code, body);
	}

	static async HANDLE<T extends keyof FetcherSchema>(
		params: {
			url: T;
			event: RequestEvent;
		},
		handler: (params: { data: FetcherRequest<T> }) => Promise<FetcherResponse<T>>
	): Promise<Response> {
		const { url, event } = params;

		let obj: Record<string, unknown> = {};
		if (event.request.method === 'GET' || event.request.method === 'HEAD') {
			const search = new URLSearchParams(event.url.search);
			for (const [key, value] of search.entries()) {
				obj[key] = value;
			}
		} else {
			const contentType = event.request.headers.get('content-type');
			if (!contentType) throw API.ERROR(400, 'Bad Request');

			if (contentType.includes('application/json')) {
				obj = await event.request.json();
			} else if (
				contentType.includes('application/x-www-form-urlencoded') ||
				contentType.includes('multipart/form-data')
			) {
				const form = await event.request.formData();
				for (const [key, value] of form.entries()) {
					obj[key] = value;
				}
			} else {
				throw API.ERROR(415, 'Unsupported Content Type');
			}
		}

		const { success, data, error } = schema[url].request.safeParse(obj);
		if (!success) {
			console.error('Invalid request data', { url, error });
			throw API.ERROR(400, 'Bad Request');
		}

		try {
			const result = await handler({ data });
			return Response.json(result);
		} catch (error) {
			if (error instanceof Error && error.message === 'No session found') {
				throw API.ERROR(401, 'Unauthorized');
			}

			throw error;
		}
	}

	static cleanShortCode(shortCode: string): string {
		const parts = shortCode.split(':');
		if (parts.length > 1) {
			return parts[1].trim();
		}
		return shortCode.trim();
	}

	static isUUID(idOrShortCode: string): boolean {
		const isUUID = z.string().uuid();
		return isUUID.safeParse(idOrShortCode).success;
	}

	static isShortCode(idOrShortCode: string): boolean {
		return /^[A-Z0-9]{6}$/i.test(idOrShortCode);
	}

	static isSimplePath(str: string): boolean {
		// 規則：
		// 1. 不能包含空格
		// 2. 必須包含至少一個 '.' (作為副檔名的分隔)
		// 3. 不能以 '/' 結尾
		// 4. 可以包含 a-z, 0-9, -, _, /, .
		const pathRegex = /^[a-z0-9\-_/.]+\.[a-z0-9]+$/i;
		return !str.includes(' ') && !str.endsWith('/') && pathRegex.test(str);
	}

	static randomCode(options: { length?: number; prefix?: string; suffix?: string } = {}): string {
		/**
		 * 12 bytes is approximately equal to 16 base64url characters
		 * Every 3 bytes produces 4 base64url characters
		 * So, 12 bytes / 3 bytes * 4 base64url characters = 16 base64url characters
		 */
		const { length = 12, prefix = '', suffix = '' } = options;
		const array = new Uint8Array(length);
		crypto.getRandomValues(array);
		const code = Buffer.from(array).toString('base64url');
		return prefix.toLowerCase() + code + suffix.toLowerCase();
	}
}
