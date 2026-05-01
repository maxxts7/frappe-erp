<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const sidebarOpen = ref(true);

const nav = [
	{
		label: "Accounting",
		items: [
			{ label: "Chart of Accounts", to: "/accounting/chart-of-accounts" },
			{ label: "Journal Entries", to: "/accounting/journal-entries" },
			{ label: "Sales Invoices", to: "/accounting/sales-invoices" },
			{ label: "Purchase Invoices", to: "/accounting/purchase-invoices" },
			{ label: "Payments", to: "/accounting/payments" },
		],
	},
	{
		label: "Selling",
		items: [
			{ label: "Sales Orders", to: "/selling/orders" },
			{ label: "Customers", to: "/selling/customers" },
		],
	},
	{
		label: "Buying",
		items: [
			{ label: "Purchase Orders", to: "/buying/orders" },
			{ label: "Purchase Receipts", to: "/buying/receipts" },
			{ label: "Suppliers", to: "/buying/suppliers" },
		],
	},
	{
		label: "Inventory",
		items: [
			{ label: "Items", to: "/inventory/items" },
			{ label: "Delivery Notes", to: "/inventory/delivery-notes" },
			{ label: "Stock Entries", to: "/inventory/stock-entries" },
		],
	},
];
</script>

<template>
	<div style="display:flex;height:100vh;overflow:hidden;font-family:'DM Sans',system-ui,sans-serif;">

		<!-- Sidebar -->
		<aside :style="sidebarOpen ? 'width:216px;' : 'width:0;overflow:hidden;'"
			style="flex-shrink:0;display:flex;flex-direction:column;transition:width .2s ease;
			       background:#0E1117;border-right:1px solid #191D27;">

			<!-- Logo bar -->
			<div style="display:flex;align-items:center;justify-content:space-between;
			            padding:16px 16px 14px;border-bottom:1px solid #191D27;">
				<router-link to="/dashboard"
					style="font-family:'DM Serif Display',Georgia,serif;font-size:15px;
					       color:#F5DFA0;letter-spacing:-.01em;text-decoration:none;line-height:1.2;">
					Very Good<br><span style="font-size:13px;opacity:.7;">ERP</span>
				</router-link>
			</div>

			<!-- Nav -->
			<nav style="flex:1;overflow-y:auto;padding:8px 0;">
				<router-link to="/dashboard"
					style="display:flex;align-items:center;margin:0 8px;padding:7px 10px;
					       border-radius:6px;font-size:13px;text-decoration:none;
					       border-left:2px solid transparent;transition:all .1s;"
					:style="route.path === '/dashboard'
						? 'background:rgba(212,150,26,.1);color:#F5DFA0;border-left-color:#D4961A;'
						: 'color:#8A93AD;'">
					Dashboard
				</router-link>

				<template v-for="section in nav" :key="section.label">
					<div style="padding:14px 18px 4px;font-family:'DM Mono',monospace;font-size:9px;
					            letter-spacing:.16em;text-transform:uppercase;color:#384060;">
						{{ section.label }}
					</div>
					<router-link
						v-for="item in section.items"
						:key="item.to"
						:to="item.to"
						style="display:flex;align-items:center;margin:1px 8px;padding:6px 10px;
						       border-radius:6px;font-size:13px;text-decoration:none;
						       border-left:2px solid transparent;transition:all .1s;"
						:style="route.path === item.to
							? 'background:rgba(212,150,26,.08);color:#F5DFA0;border-left-color:#D4961A;'
							: 'color:#8A93AD;'">
						{{ item.label }}
					</router-link>
				</template>
			</nav>

			<!-- User footer -->
			<div style="padding:12px 16px;border-top:1px solid #191D27;font-size:12px;color:#384060;">
				<a href="/app" target="_blank"
					style="color:#5A6480;text-decoration:none;font-size:11.5px;">
					↗ Frappe Desk
				</a>
			</div>
		</aside>

		<!-- Content -->
		<div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">

			<!-- Top bar -->
			<div style="height:44px;flex-shrink:0;display:flex;align-items:center;padding:0 16px;
			            background:#F0EDE6;border-bottom:1px solid #DDD8CE;gap:10px;">
				<button @click="sidebarOpen = !sidebarOpen"
					style="background:none;border:none;cursor:pointer;color:#6B6459;font-size:16px;padding:4px;line-height:1;">
					☰
				</button>
				<span style="font-size:13px;color:#9C9086;">
					{{ route.path.split("/").filter(Boolean).map(s => s.replace(/-/g," ")).join(" › ") || "Dashboard" }}
				</span>
			</div>

			<!-- Router view -->
			<main style="flex:1;overflow-y:auto;background:#F0EDE6;">
				<router-view />
			</main>
		</div>
	</div>
</template>
