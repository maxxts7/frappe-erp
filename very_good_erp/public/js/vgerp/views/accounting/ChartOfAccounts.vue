<script setup>
import { ref, onMounted, computed } from "vue";
import { getList } from "../../api.js";

const accounts = ref([]);
const loading = ref(true);
const error = ref(null);
const search = ref("");
const activeRoot = ref("All");

const ROOT_TYPES = ["All", "Asset", "Liability", "Equity", "Income", "Expense"];

const ROOT_COLORS = {
	Asset:     { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
	Liability: { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
	Equity:    { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
	Income:    { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
	Expense:   { bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" },
};

onMounted(async () => {
	try {
		accounts.value = await getList("Account", {
			fields: ["name", "account_name", "account_type", "root_type", "parent_account", "is_group", "disabled"],
			filters: [["is_group", "!=", 1]],
			limit: 500,
		});
	} catch (e) {
		error.value = e.message;
	} finally {
		loading.value = false;
	}
});

const grouped = computed(() => {
	let list = accounts.value;
	if (search.value) {
		const q = search.value.toLowerCase();
		list = list.filter(a => a.account_name?.toLowerCase().includes(q) || a.name?.toLowerCase().includes(q));
	}
	if (activeRoot.value !== "All") {
		list = list.filter(a => a.root_type === activeRoot.value);
	}
	const groups = {};
	for (const a of list) {
		const rt = a.root_type || "Other";
		if (!groups[rt]) groups[rt] = [];
		groups[rt].push(a);
	}
	return groups;
});

function openDoc(name) { window.open(`/app/account/${encodeURIComponent(name)}`, "_blank"); }
function createNew() { window.open("/app/account/new-account-1", "_blank"); }
</script>

<template>
	<div class="p-8">
		<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
			<div>
				<h1 style="font-family:'DM Serif Display',Georgia,serif;font-size:24px;color:#1A1714;letter-spacing:-.02em;margin:0 0 3px;">Chart of Accounts</h1>
				<p style="font-size:12.5px;color:#9C9086;margin:0;">Accounting &rsaquo; Chart of Accounts</p>
			</div>
			<button @click="createNew"
				style="background:#D4961A;color:#1A0F00;border:none;border-radius:6px;padding:8px 18px;font-size:13px;font-weight:600;cursor:pointer;">
				+ New Account
			</button>
		</div>

		<!-- Filters -->
		<div style="display:flex;gap:10px;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;">
			<input v-model="search" placeholder="Search accounts…"
				style="width:220px;padding:7px 12px;border:1px solid #D4CCBE;border-radius:6px;background:#fff;font-size:13px;color:#1A1714;outline:none;" />
			<div style="display:flex;gap:4px;">
				<button v-for="rt in ROOT_TYPES" :key="rt" @click="activeRoot = rt"
					style="padding:5px 12px;border-radius:20px;font-size:11.5px;font-weight:500;cursor:pointer;border:1px solid transparent;transition:all .1s;font-family:'DM Mono',monospace;"
					:style="activeRoot === rt
						? { background: rt === 'All' ? '#1A1714' : (ROOT_COLORS[rt]||{}).bg, color: rt === 'All' ? '#F5DFA0' : (ROOT_COLORS[rt]||{}).color, borderColor: rt === 'All' ? '#1A1714' : (ROOT_COLORS[rt]||{}).border }
						: { background: '#fff', color: '#6B6459', borderColor: '#D4CCBE' }">
					{{ rt }}
				</button>
			</div>
		</div>

		<div v-if="loading" style="text-align:center;padding:40px;color:#9C9086;font-size:13px;">Loading accounts…</div>
		<div v-else-if="error" style="text-align:center;padding:24px;color:#B91C1C;font-size:13px;">{{ error }}</div>
		<div v-else>
			<div v-for="(accs, rootType) in grouped" :key="rootType" style="margin-bottom:20px;">
				<!-- Root type header -->
				<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
					<span style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;padding:3px 10px;border-radius:20px;"
						:style="{ background: (ROOT_COLORS[rootType]||{bg:'#F5F5F5'}).bg, color: (ROOT_COLORS[rootType]||{color:'#6B7280'}).color }">
						{{ rootType }}
					</span>
					<span style="font-size:11.5px;color:#9C9086;font-family:'DM Mono',monospace;">{{ accs.length }} accounts</span>
				</div>

				<!-- Accounts table -->
				<div style="background:#fff;border-radius:10px;border:1px solid #E5E0D6;box-shadow:0 2px 8px rgba(26,20,10,.06);overflow:hidden;margin-bottom:4px;">
					<table style="width:100%;border-collapse:collapse;">
						<thead>
							<tr style="background:#F7F4EF;border-bottom:1px solid #E5E0D6;">
								<th style="padding:8px 16px;text-align:left;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#6B6459;font-weight:500;">Account Name</th>
								<th style="padding:8px 16px;text-align:left;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#6B6459;font-weight:500;">Account Code</th>
								<th style="padding:8px 16px;text-align:left;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#6B6459;font-weight:500;">Type</th>
								<th style="padding:8px 16px;text-align:left;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#6B6459;font-weight:500;">Parent</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="acc in accs" :key="acc.name" @click="openDoc(acc.name)"
								style="border-bottom:1px solid #F0EDE6;cursor:pointer;transition:background .1s;"
								onmouseover="this.style.background='#FDFBF7'" onmouseout="this.style.background=''">
								<td style="padding:8px 16px;color:#1A1714;font-size:13px;font-weight:500;">{{ acc.account_name }}</td>
								<td style="padding:8px 16px;color:#6B6459;font-size:12px;font-family:'DM Mono',monospace;">{{ acc.name.split(" - ")[0] }}</td>
								<td style="padding:8px 16px;color:#6B6459;font-size:12.5px;">{{ acc.account_type || "—" }}</td>
								<td style="padding:8px 16px;color:#9C9086;font-size:12px;">{{ acc.parent_account?.split(" - ")[0] || "—" }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div v-if="!Object.keys(grouped).length" style="text-align:center;padding:40px;color:#9C9086;font-size:13px;">
				No accounts found
			</div>
		</div>
	</div>
</template>
