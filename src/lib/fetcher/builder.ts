export default class Builder {
	static headers() {
		return new Headers();
	}

	static urlSearchParams(params: { entries: [string, unknown][] }) {
		const search = new URLSearchParams();
		for (const [key, value] of params.entries) {
			search.append(key, String(value));
		}
		return search;
	}

	static formData(params: { entries: [string, unknown][] }) {
		const form = new FormData();
		for (const [key, value] of params.entries) {
			if (value instanceof File) {
				form.append(key, value);
			} else if (value != null) {
				const isObject = typeof value === 'object';
				form.append(key, isObject ? JSON.stringify(value) : String(value));
			}
		}
		return form;
	}
}
