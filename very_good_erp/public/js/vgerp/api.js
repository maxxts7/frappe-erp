const csrf = () => window.frappe?.csrf_token || "";

async function req(method, path, params = {}) {
	const url = new URL("/api/resource" + path, location.origin);
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
	req("GET", `/${encodeURIComponent(doctype)}`, {
		fields: JSON.stringify(fields),
		filters: JSON.stringify(filters),
		limit_page_length: limit,
		limit_start: start,
	}).then((d) => d.data || d);

export const getCount = (doctype, filters = []) => {
	const url = new URL("/api/method/frappe.client.get_count", location.origin);
	url.searchParams.set("doctype", doctype);
	url.searchParams.set("filters", JSON.stringify(filters));
	return fetch(url, {
		credentials: "include",
		headers: { "X-Frappe-CSRF-Token": csrf() },
	})
		.then((r) => r.json())
		.then((d) => d.message ?? 0);
};
