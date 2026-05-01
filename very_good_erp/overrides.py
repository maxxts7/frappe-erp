import frappe
from frappe.desk.desktop import get_workspace_sidebar_items as _original


ALLOWED_MODULES = {"Accounts", "Buying", "Selling", "Stock"}


@frappe.whitelist()
def get_workspace_sidebar_items():
	result = _original()
	result["pages"] = [
		p for p in result.get("pages", [])
		if p.get("module") in ALLOWED_MODULES
	]
	return result
