import frappe
from urllib.parse import urlencode

no_cache = 1


def get_context(context):
	if frappe.session.user == "Guest":
		frappe.local.flags.redirect_location = f"/login?{urlencode({'redirect-to': '/vgerp'})}"
		raise frappe.Redirect

	context.no_header = 1
	context.no_footer = 1
	context.title = "Very Good ERP"
