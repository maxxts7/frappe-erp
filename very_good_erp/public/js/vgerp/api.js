const BASE = "/api/v2";
const csrf = () => window.frappe?.csrf_token || "";

async function req(method, path, params = {}) {
	const url = new URL(BASE + path, location.origin);
	const opts = {
		method,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"X-Frappe-CSRF-Token": csrf(),
			"Accept": "application/json",
		},
	};
	if (method === "GET") {
		Object.entries(params).forEach(([k, v]) =>
			url.searchParams.set(k, typeof v === "object" ? JSON.stringify(v) : v)
		);
	} else {
		opts.body = JSON.stringify(params);
	}
	const r = await fetch(url, opts);
	if (!r.ok) {
		const err = await r.json().catch(() => ({}));
		throw new Error(err.exception || err.message || `HTTP ${r.status}`);
	}
	return r.json();
}

export const getList = (doctype, { fields = ["name"], filters = [], limit = 20, start = 0 } = {}) =>
	req("GET", `/document/${encodeURIComponent(doctype)}`, {
		fields: JSON.stringify(fields),
		filters: JSON.stringify(filters),
		limit,
		start,
	}).then((d) => d.data || d);

export const getCount = (doctype, filters = []) =>
	req("GET", `/doctype/${encodeURIComponent(doctype)}/count`, {
		filters: JSON.stringify(filters),
	}).then((d) => d.data ?? d);
