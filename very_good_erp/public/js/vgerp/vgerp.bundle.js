import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

import App from "./App.vue";
import Dashboard from "./views/Dashboard.vue";
import ChartOfAccounts from "./views/accounting/ChartOfAccounts.vue";
import JournalEntryList from "./views/accounting/JournalEntryList.vue";
import SalesInvoiceList from "./views/accounting/SalesInvoiceList.vue";
import PurchaseInvoiceList from "./views/accounting/PurchaseInvoiceList.vue";
import PaymentList from "./views/accounting/PaymentList.vue";
import SalesOrderList from "./views/selling/SalesOrderList.vue";
import CustomerList from "./views/selling/CustomerList.vue";
import PurchaseOrderList from "./views/buying/PurchaseOrderList.vue";
import PurchaseReceiptList from "./views/buying/PurchaseReceiptList.vue";
import SupplierList from "./views/buying/SupplierList.vue";
import ItemList from "./views/inventory/ItemList.vue";
import DeliveryNoteList from "./views/inventory/DeliveryNoteList.vue";
import StockEntryList from "./views/inventory/StockEntryList.vue";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: "/", redirect: "/dashboard" },
		{ path: "/dashboard", component: Dashboard },
		{ path: "/accounting/chart-of-accounts", component: ChartOfAccounts },
		{ path: "/accounting/journal-entries", component: JournalEntryList },
		{ path: "/accounting/sales-invoices", component: SalesInvoiceList },
		{ path: "/accounting/purchase-invoices", component: PurchaseInvoiceList },
		{ path: "/accounting/payments", component: PaymentList },
		{ path: "/selling/orders", component: SalesOrderList },
		{ path: "/selling/customers", component: CustomerList },
		{ path: "/buying/orders", component: PurchaseOrderList },
		{ path: "/buying/receipts", component: PurchaseReceiptList },
		{ path: "/buying/suppliers", component: SupplierList },
		{ path: "/inventory/items", component: ItemList },
		{ path: "/inventory/delivery-notes", component: DeliveryNoteList },
		{ path: "/inventory/stock-entries", component: StockEntryList },
	],
});

const app = createApp(App);
app.config.globalProperties.frappe = window.frappe;
app.use(router);
app.mount("#app");
