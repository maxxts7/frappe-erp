<script setup>
import { ref, onMounted } from "vue";
import { getCount } from "../api.js";

const kpis = ref([
	{ label: "Sales Invoices", doctype: "Sales Invoice", value: null, color: "#D4961A", icon: "📄", route: "#/accounting/sales-invoices" },
	{ label: "Sales Orders", doctype: "Sales Order", value: null, color: "#1D4ED8", icon: "🛒", route: "#/selling/orders" },
	{ label: "Stock Items", doctype: "Item", value: null, color: "#15803D", icon: "📦", route: "#/inventory/items" },
	{ label: "Purchase Invoices", doctype: "Purchase Invoice", value: null, color: "#7C3AED", icon: "🧾", route: "#/accounting/purchase-invoices" },
	{ label: "Customers", doctype: "Customer", value: null, color: "#0891B2", icon: "👤", route: "#/selling/customers" },
	{ label: "Suppliers", doctype: "Supplier", value: null, color: "#B45309", icon: "🏭", route: "#/buying/suppliers" },
	{ label: "Purchase Orders", doctype: "Purchase Order", value: null, color: "#DC2626", icon: "📋", route: "#/buying/orders" },
	{ label: "Stock Entries", doctype: "Stock Entry", value: null, color: "#059669", icon: "🔄", route: "#/inventory/stock-entries" },
]);

onMounted(async () => {
	await Promise.all(
		kpis.value.map(async (kpi) => {
			try {
				kpi.value = await getCount(kpi.doctype);
			} catch {
				kpi.value = "—";
			}
		})
	);
});
</script>

<template>
	<div class="p-8">
		<div style="margin-bottom:2rem;">
			<h1 style="font-family:'DM Serif Display',Georgia,serif;font-size:28px;color:#1A1714;
			           letter-spacing:-.02em;margin:0 0 4px;">
				Dashboard
			</h1>
			<p style="font-size:13px;color:#9C9086;margin:0;">Overview of your business</p>
		</div>

		<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:900px;">
			<a
				v-for="kpi in kpis"
				:key="kpi.doctype"
				:href="kpi.route"
				style="display:block;background:#fff;border-radius:10px;padding:20px;
				       border:1px solid #E5E0D6;box-shadow:0 2px 8px rgba(26,20,10,.06);
				       cursor:pointer;transition:box-shadow .15s,transform .15s;text-decoration:none;"
				onmouseover="this.style.boxShadow='0 6px 20px rgba(26,20,10,.12)';this.style.transform='translateY(-1px)'"
				onmouseout="this.style.boxShadow='0 2px 8px rgba(26,20,10,.06)';this.style.transform=''"
			>
				<div style="font-size:20px;margin-bottom:8px;">{{ kpi.icon }}</div>
				<div style="font-family:'DM Mono',monospace;font-size:28px;font-weight:600;
				            letter-spacing:-.03em;line-height:1;" :style="{ color: kpi.color }">
					{{ kpi.value === null ? "…" : kpi.value }}
				</div>
				<div style="font-size:11.5px;color:#9C9086;margin-top:6px;font-weight:500;">
					{{ kpi.label }}
				</div>
			</a>
		</div>
	</div>
</template>
