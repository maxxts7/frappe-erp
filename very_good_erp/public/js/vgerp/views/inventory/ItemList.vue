<script setup>
import { ref, onMounted, watch } from "vue";
import { getList } from "../../api.js";

const rows = ref([]);
const loading = ref(true);
const error = ref(null);
const search = ref("");
const page = ref(0);
const PAGE_SIZE = 20;

async function load() {
	loading.value = true;
	error.value = null;
	try {
		const filters = search.value ? [["item_name", "like", `%${search.value}%`]] : [];
		rows.value = await getList("Item", {
			fields: ["name", "item_name", "item_group", "stock_uom", "is_stock_item", "disabled"],
			filters,
			limit: PAGE_SIZE,
			start: page.value * PAGE_SIZE,
		});
	} catch (e) {
		error.value = e.message;
	} finally {
		loading.value = false;
	}
}

let searchTimer;
watch(search, () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { page.value = 0; load(); }, 300); });

function openDoc(name) { window.open(`/app/item/${name}`, "_blank"); }
function createNew() { window.open("/app/item/new-item-1", "_blank"); }

onMounted(load);
</script>

<template>
	<div class="p-8">
		<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
			<div>
				<h1 style="font-family:'DM Serif Display',Georgia,serif;font-size:24px;color:#1A1714;letter-spacing:-.02em;margin:0 0 3px;">Items</h1>
				<p style="font-size:12.5px;color:#9C9086;margin:0;">Inventory &rsaquo; Items</p>
			</div>
			<button @click="createNew"
				style="background:#D4961A;color:#1A0F00;border:none;border-radius:6px;padding:8px 18px;font-size:13px;font-weight:600;cursor:pointer;">
				+ New Item
			</button>
		</div>

		<input v-model="search" placeholder="Search items…"
			style="width:260px;padding:7px 12px;border:1px solid #D4CCBE;border-radius:6px;background:#fff;font-size:13px;color:#1A1714;margin-bottom:1rem;outline:none;" />

		<div style="background:#fff;border-radius:10px;border:1px solid #E5E0D6;box-shadow:0 2px 8px rgba(26,20,10,.07);overflow:hidden;">
			<table style="width:100%;border-collapse:collapse;">
				<thead>
					<tr style="background:#F7F4EF;border-bottom:1px solid #E5E0D6;">
						<th v-for="h in ['Code','Name','Group','UOM','Stock Item','Status']" :key="h"
							style="padding:10px 16px;text-align:left;font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:#6B6459;font-weight:500;">{{ h }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="loading"><td colspan="6" style="padding:32px;text-align:center;color:#9C9086;font-size:13px;">Loading…</td></tr>
					<tr v-else-if="error"><td colspan="6" style="padding:24px;text-align:center;color:#B91C1C;font-size:13px;">{{ error }}</td></tr>
					<tr v-else-if="!rows.length"><td colspan="6" style="padding:32px;text-align:center;color:#9C9086;font-size:13px;">No items found</td></tr>
					<tr v-else v-for="row in rows" :key="row.name" @click="openDoc(row.name)"
						style="border-bottom:1px solid #F0EDE6;cursor:pointer;transition:background .1s;"
						onmouseover="this.style.background='#FDFBF7'" onmouseout="this.style.background=''">
						<td style="padding:10px 16px;font-weight:600;color:#1A1714;font-size:13px;font-family:'DM Mono',monospace;">{{ row.name }}</td>
						<td style="padding:10px 16px;color:#3D3530;font-size:13px;">{{ row.item_name }}</td>
						<td style="padding:10px 16px;color:#6B6459;font-size:13px;">{{ row.item_group }}</td>
						<td style="padding:10px 16px;color:#6B6459;font-size:13px;font-family:'DM Mono',monospace;">{{ row.stock_uom }}</td>
						<td style="padding:10px 16px;">
							<span style="font-family:'DM Mono',monospace;font-size:10.5px;font-weight:500;letter-spacing:.03em;border-radius:20px;padding:3px 9px;"
								:style="row.is_stock_item ? { background:'#EFF6FF', color:'#1D4ED8' } : { background:'#F5F5F5', color:'#6B7280' }">
								{{ row.is_stock_item ? "Yes" : "No" }}
							</span>
						</td>
						<td style="padding:10px 16px;">
							<span style="font-family:'DM Mono',monospace;font-size:10.5px;font-weight:500;letter-spacing:.03em;border-radius:20px;padding:3px 9px;"
								:style="row.disabled ? { background:'#F5F5F5', color:'#9B6B6B' } : { background:'#F0FDF4', color:'#15803D' }">
								{{ row.disabled ? "Disabled" : "Active" }}
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div style="display:flex;gap:8px;margin-top:12px;align-items:center;">
			<button @click="page > 0 && (page--, load())" :disabled="page === 0"
				style="padding:5px 14px;border:1px solid #D4CCBE;border-radius:5px;background:#fff;font-size:12px;cursor:pointer;color:#3D3530;">← Previous</button>
			<span style="font-size:12px;color:#9C9086;font-family:'DM Mono',monospace;">Page {{ page + 1 }}</span>
			<button @click="rows.length === PAGE_SIZE && (page++, load())" :disabled="rows.length < PAGE_SIZE"
				style="padding:5px 14px;border:1px solid #D4CCBE;border-radius:5px;background:#fff;font-size:12px;cursor:pointer;color:#3D3530;">Next →</button>
		</div>
	</div>
</template>
