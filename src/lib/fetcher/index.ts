import { env } from '$env/dynamic/public';
import type { LoadEvent } from '@sveltejs/kit';
import Builder from './builder';
import type { FetcherMode, FetcherRequest, FetcherResult, FetcherSchema } from '$lib/type';

export default async function fetcher<
	T extends keyof FetcherSchema,
	M extends FetcherMode = 'json'
>(params: {
	event?: LoadEvent;
	url: T;
	request: FetcherRequest<T>;
	type?: 'json' | 'form';
	mode?: M;
	nonceToken?: string;
}): Promise<FetcherResult<T, M>> {
	try {
		const { event, url, request, type = 'json', mode = 'json', nonceToken } = params;
		const [method, endpoint] = url.split(' ');
		const target = `${env.PUBLIC_ORIGIN}${endpoint}`;

		const headers = Builder.headers();
		if (nonceToken) {
			headers.set('X-Nonce-Token', nonceToken);
		}

		let urlSearchParams: URLSearchParams | null = null;
		let body: BodyInit | null | undefined;

		if (method === 'GET' || method === 'HEAD') {
			urlSearchParams = Builder.urlSearchParams({
				entries: Object.entries(request || []).filter(([, v]) => v !== undefined)
			});
		} else {
			urlSearchParams = new URLSearchParams();
			if (type === 'form') {
				body = Builder.formData({ entries: Object.entries(request || {}) });
			} else if (type === 'json') {
				headers.set('Content-Type', 'application/json');
				body = JSON.stringify(request);
			}
		}

		const search = urlSearchParams.toString();
		const input: string | URL | globalThis.Request = search ? `${target}?${search}` : target;
		const init: RequestInit = { method, headers, body };

		const response = event ? await event.fetch(input, init) : await fetch(input, init);

		const contentType = response.headers.get('Content-Type') || '';
		if (contentType.includes('text/html')) {
			const html = await response.text();
			console.error('fetcher received HTML response', { html, params });
		}

		if (mode === 'raw') {
			return response as FetcherResult<T, M>;
		} else {
			const json = await response.json();
			if (response.ok) {
				return {
					status: 'success',
					code: response.status,
					data: json
				} as FetcherResult<T, M>;
			} else {
				return {
					status: 'error',
					code: response.status,
					message: json.message || response.statusText
				} as FetcherResult<T, M>;
			}
		}
	} catch (error) {
		console.error('fetcher error', { error, params });
		throw error;
	}
}
