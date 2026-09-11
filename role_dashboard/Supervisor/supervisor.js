/* =========================================================
   STOREKEEPER.JS
   ZIMDRA DMS
========================================================= */

(function () {

    "use strict";


    /* =========================================================
       STORAGE
    ========================================================= */

    const STORAGE_KEY = "zimdra_storekeeper_v7";

    let state = null;

    let counterCart = [];

    let mrnLines = [];

    let quotationCart = [];

    let partyCart = [];

    let transferLines = [];

    let transferMyBranch = "Thimphu";

    let currentQuotationViewId = null;

    let selectedCashSaleId = null;

    let selectedPaymentMethod = "Cash";

    let inventoryExpanded = false;

    let quotationExpanded = false;

    let toastTimer = null;

    /* Add Parts modal - searchable part picker */

    let addPartFiltered = [];

    let addPartActiveIndex = -1;

    /* Branch Transfer - Request Part searchable picker */

    let transferPartFiltered = [];

    let transferPartActiveIndex = -1;

    /* Cash Counter - Bank / Cheque payment fields */

    const BANK_OPTIONS = [
        "BOB", "BNB", "PNB", "BDBL", "T-BANK", "DK"
    ];

    let paymentBankName = BANK_OPTIONS[0];

    let paymentJournalNo = "";

    let paymentRemarks = "";

    let paymentChequeNo = "";

    let paymentChequeDate = "";

    let paymentChequeBank = BANK_OPTIONS[0];

    let paymentChequeRemarks = "";


    /* =========================================================
       HELPERS
    ========================================================= */

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function money(value) {

        const number = Math.round(Number(value) || 0);

        return `Nu. ${number.toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;

    }


    function bankOptionsHtml(selected) {

        return BANK_OPTIONS.map(function (bank) {

            return `<option value="${bank}" ${
                selected === bank ? "selected" : ""
            }>${bank}</option>`;

        }).join("");

    }


    function today() {

        const date = new Date();

        const year = date.getFullYear();

        const month = String(date.getMonth() + 1).padStart(2, "0");

        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    function formatDate(value) {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    }


    function uid(prefix) {

        return `${prefix}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;

    }


    function showToast(message, type = "success") {

        const toast = document.getElementById("toast");

        if (!toast) {
            return;
        }

        clearTimeout(toastTimer);

        toast.textContent = message;

        toast.className = `toast show ${type}`;

        toastTimer = setTimeout(function () {

            toast.className = "toast";

        }, 2800);

    }


    function saveState() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );

    }


    /* =========================================================
       DUMMY DATA
    ========================================================= */

    function createDummyState() {

        const inventory = [

            {
                id: "PRD-001",
                partNo: "FLT-001",
                name: "Toyota Oil Filter",
                description: "Toyota genuine oil filter",
                category: "Filters",
                serialNumber: "",
                model: "Toyota",
                salePrice: 420,
                costPrice: 300,
                tax: 7,
                unit: "pcs",
                stock: 18,
                reorderLevel: 5,
                location: "Thimphu",
                image: "",
                details: "Common Toyota service replacement part."
            },

            {
                id: "PRD-002",
                partNo: "FLT-002",
                name: "Toyota Air Filter",
                description: "Toyota genuine engine air filter",
                category: "Filters",
                serialNumber: "",
                model: "Toyota",
                salePrice: 950,
                costPrice: 700,
                tax: 7,
                unit: "pcs",
                stock: 7,
                reorderLevel: 5,
                location: "Thimphu",
                image: "",
                details: "Engine air filter for Toyota vehicles."
            },

            {
                id: "PRD-003",
                partNo: "BRK-001",
                name: "Front Brake Pad Set",
                description: "Front axle brake pad set",
                category: "Brake System",
                serialNumber: "",
                model: "Toyota",
                salePrice: 2800,
                costPrice: 2200,
                tax: 7,
                unit: "set",
                stock: 4,
                reorderLevel: 6,
                location: "Phuntsholing",
                image: "",
                details: "Front brake pad set for workshop repairs."
            },

            {
                id: "PRD-004",
                partNo: "LUB-001",
                name: "Toyota Engine Oil 5W-30",
                description: "Toyota genuine engine oil 5W-30",
                category: "Lubricants",
                serialNumber: "",
                model: "Toyota",
                salePrice: 1650,
                costPrice: 1350,
                tax: 7,
                unit: "litre",
                stock: 30,
                reorderLevel: 10,
                location: "Thimphu",
                image: "",
                details: "Fully synthetic engine oil."
            },

            {
                id: "PRD-005",
                partNo: "ELC-001",
                name: "12V Battery",
                description: "12V automotive battery",
                category: "Electrical",
                serialNumber: "",
                model: "Universal",
                salePrice: 8200,
                costPrice: 7000,
                tax: 7,
                unit: "pcs",
                stock: 3,
                reorderLevel: 4,
                location: "Phuntsholing",
                image: "",
                details: "12V automotive starting battery."
            },

            {
                id: "PRD-006",
                partNo: "FLT-003",
                name: "Cabin Air Filter",
                description: "Cabin air filter",
                category: "Filters",
                serialNumber: "",
                model: "Toyota",
                salePrice: 780,
                costPrice: 590,
                tax: 7,
                unit: "pcs",
                stock: 12,
                reorderLevel: 5,
                location: "Thimphu",
                image: "",
                details: "Cabin air filtration element."
            },

            {
                id: "PRD-007",
                partNo: "BRK-002",
                name: "Rear Brake Shoe Set",
                description: "Rear brake shoe set",
                category: "Brake System",
                serialNumber: "",
                model: "Toyota",
                salePrice: 2450,
                costPrice: 1950,
                tax: 7,
                unit: "set",
                stock: 9,
                reorderLevel: 5,
                location: "Phuntsholing",
                image: "",
                details: "Rear brake shoe set."
            }

        ];


        const jobs = [

            {
                id: "JC-2026-001",

                customer: "Karma Dorji",

                vehicle: "Toyota Hilux",

                registration: "BP-1-A1234",

                mechanic: "Pema Tshering",

                supervisor: "Sonam Wangchuk",

                jobType: "General Service",

                status: "Open",

                createdDate: "2026-09-08",

                requisitionNo: "",

                requisitionDate: "",

                warranty: "No",

                bCov: "No",

                requestedParts: []

            },


            {
                id: "JC-2026-002",

                customer: "Tashi Wangmo",

                vehicle: "Toyota Fortuner",

                registration: "BP-2-B7788",

                mechanic: "Dorji Wangchuk",

                supervisor: "Kezang Norbu",

                jobType: "Brake Service",

                status: "Open",

                createdDate: "2026-09-08",

                requisitionNo: "",

                requisitionDate: "",

                warranty: "No",

                bCov: "No",

                requestedParts: []

            },


            {
                id: "JC-2026-003",

                customer: "Dorji Tshering",

                vehicle: "Toyota Prado",

                registration: "BP-3-C3322",

                mechanic: "Pema Tshering",

                supervisor: "Sonam Wangchuk",

                jobType: "Periodic Maintenance",

                status: "Open",

                createdDate: "2026-09-09",

                requisitionNo: "",

                requisitionDate: "",

                warranty: "No",

                bCov: "No",

                requestedParts: []

            }

        ];


        const pendingSales = [

            {
                id: "CS-2026-001",

                customerName: "Sonam Trading",

                customerPhone: "17654321",

                date: today(),

                status: "Pending Payment",

                items: [

                    {
                        productId: "PRD-001",
                        partNo: "FLT-001",
                        name: "Toyota Oil Filter",
                        qty: 2,
                        price: 420,
                        tax: 7
                    },

                    {
                        productId: "PRD-004",
                        partNo: "LUB-001",
                        name: "Toyota Engine Oil 5W-30",
                        qty: 1,
                        price: 1650,
                        tax: 7
                    }

                ]

            }

        ];


        const transactions = [

            {
                id: "TRX-2026-0001",
                reference: "INV-2026-0001",
                date: "2026-09-08",
                customer: "Tashi Motors",
                type: "Counter Sale",
                amount: 2996,
                status: "Completed"
            }

        ];


        return {

            jobs,

            inventory,

            sales: [],

            pendingSales,

            transactions,

            categories: [

                "Filters",
                "Brake System",
                "Lubricants",
                "Electrical",
                "Service Parts",
                "Accessories"

            ],

            units: [

                "pcs",
                "set",
                "litre",
                "box",
                "pair"

            ],

            groupPrices: [],

            materialReceipts: [
                {
                    id: "MRN-SEED-0002",
                    mrnNo: "MRN-0002",
                    receiptType: "Cash",
                    refNo: "",
                    downloadMail: "No",
                    date: "2026-09-05",
                    vendorCode: "TM",
                    vendorName: "Tashi Motors Parts, Phuntsholing",
                    rateType: "Cost",
                    invoiceNo: "CASH-2209",
                    invoiceDate: "2026-09-05",
                    taxOnFp: "No",
                    vatSrvTaxOnHand: "No",
                    formNo: "",
                    lines: [
                        {
                            id: "MRN-LINE-SEED-1",
                            partNo: "BRK-001",
                            description: "Front axle brake pad set",
                            category: "Brake System",
                            unit: "set",
                            gst: 7,
                            qtyInvoiced: 6,
                            qtyReceived: 6,
                            qtyRejected: 0,
                            rate: 2200,
                            freightRate: 20,
                            rlRate: 2800,
                            discComm: 0,
                            stockBin: "Phuntsholing"
                        },
                        {
                            id: "MRN-LINE-SEED-2",
                            partNo: "ELC-001",
                            description: "12V automotive battery",
                            category: "Electrical",
                            unit: "pcs",
                            gst: 7,
                            qtyInvoiced: 3,
                            qtyReceived: 3,
                            qtyRejected: 0,
                            rate: 7000,
                            freightRate: 50,
                            rlRate: 8200,
                            discComm: 0,
                            stockBin: "Phuntsholing"
                        }
                    ],
                    totals: {
                        assessable: 34470,
                        discount: 0,
                        gst: 2412.9,
                        handling: 0,
                        vorSurcharge: 0,
                        serviceTax: 0,
                        eCess: 0,
                        excise: 0,
                        taxSurcharge: 0,
                        netTotal: 36882.9
                    }
                },
                {
                    id: "MRN-SEED-0001",
                    mrnNo: "MRN-0001",
                    receiptType: "Invoice",
                    refNo: "",
                    downloadMail: "No",
                    date: "2026-09-01",
                    vendorCode: "BW",
                    vendorName: "Babesa W/Shop, Thimphu",
                    rateType: "Purchase",
                    invoiceNo: "INV-VND-1042",
                    invoiceDate: "2026-08-30",
                    taxOnFp: "No",
                    vatSrvTaxOnHand: "No",
                    formNo: "",
                    lines: [
                        {
                            id: "MRN-LINE-SEED-3",
                            partNo: "FLT-001",
                            description: "Toyota genuine oil filter",
                            category: "Filters",
                            unit: "pcs",
                            gst: 7,
                            qtyInvoiced: 20,
                            qtyReceived: 20,
                            qtyRejected: 0,
                            rate: 300,
                            freightRate: 5,
                            rlRate: 420,
                            discComm: 0,
                            stockBin: "Thimphu"
                        },
                        {
                            id: "MRN-LINE-SEED-4",
                            partNo: "LUB-001",
                            description: "Toyota genuine engine oil 5W-30",
                            category: "Lubricants",
                            unit: "litre",
                            gst: 7,
                            qtyInvoiced: 15,
                            qtyReceived: 15,
                            qtyRejected: 0,
                            rate: 1350,
                            freightRate: 10,
                            rlRate: 1650,
                            discComm: 0,
                            stockBin: "Thimphu"
                        }
                    ],
                    totals: {
                        assessable: 26500,
                        discount: 0,
                        gst: 1855,
                        handling: 0,
                        vorSurcharge: 0,
                        serviceTax: 0,
                        eCess: 0,
                        excise: 0,
                        taxSurcharge: 0,
                        netTotal: 28355
                    }
                }
            ],

            quotations: [],

            branchTransfers: [],

            sequences: {

                sale: 2,
                invoice: 2,
                mrn: 3,
                transaction: 2,
                product: 8,
                requisition: 1,
                gatePass: 1,
                partySale: 1,
                quotation: 1,
                transfer: 1

            },

            lastInvoice: null

        };

    }


    /* =========================================================
       NORMALIZE STATE
    ========================================================= */

    function normalizeState(data) {

        const dummy = createDummyState();

        const normalized = {

            ...dummy,

            ...(data || {})

        };

        normalized.jobs = Array.isArray(data?.jobs)
            ? data.jobs
            : dummy.jobs;

        normalized.inventory = Array.isArray(data?.inventory)
            ? data.inventory
            : dummy.inventory;

        normalized.pendingSales = Array.isArray(data?.pendingSales)
            ? data.pendingSales
            : dummy.pendingSales;

        normalized.transactions = Array.isArray(data?.transactions)
            ? data.transactions
            : dummy.transactions;

        normalized.categories = Array.isArray(data?.categories)
            ? data.categories
            : dummy.categories;

        normalized.units = Array.isArray(data?.units)
            ? data.units
            : dummy.units;

        normalized.groupPrices = Array.isArray(data?.groupPrices)
            ? data.groupPrices
            : [];

        normalized.materialReceipts = Array.isArray(data?.materialReceipts)
            ? data.materialReceipts
            : [];

        normalized.quotations = Array.isArray(data?.quotations)
            ? data.quotations
            : [];

        normalized.branchTransfers = Array.isArray(data?.branchTransfers)
            ? data.branchTransfers
            : [];

        normalized.sequences = {

            ...dummy.sequences,

            ...(data?.sequences || {})

        };

        return normalized;

    }


    /* =========================================================
       LOAD STATE
    ========================================================= */

    function loadState() {

        try {

            const raw = localStorage.getItem(STORAGE_KEY);

            if (raw) {

                state = normalizeState(
                    JSON.parse(raw)
                );

            } else {

                state = createDummyState();

                saveState();

            }

        } catch (error) {

            console.error(error);

            state = createDummyState();

            saveState();

        }

    }


    /* =========================================================
       NAVIGATION
    ========================================================= */

    const tabTitles = {

        dashboard: "Storekeeper Dashboard",

        workshop: "Workshop Parts",

        "material-receipt": "Material Receipt",

        inventory: "Inventory",

        counter: "Counter Sale",

        quotation: "Quotation",

        party: "Party Sale",

        transfer: "Branch Transfer",

        cash: "Cash Counter",

        transactions: "Transactions"

    };


    function showTab(
        tabName,
        collapseInventory = true,
        collapseQuotation = true
    ) {

        document
            .querySelectorAll(".page-section")
            .forEach(function (section) {

                section.classList.remove("active");

            });


        const target = document.getElementById(
            `${tabName}Tab`
        );

        if (target) {

            target.classList.add("active");

        }


        document
            .querySelectorAll(".nav-item")
            .forEach(function (button) {

                button.classList.remove("active");

            });


        const navButton = document.querySelector(
            `.nav-item[data-tab="${tabName}"]`
        );

        if (navButton) {

            navButton.classList.add("active");

        }


        const title = document.getElementById(
            "pageTitle"
        );

        if (title) {

            title.textContent =
                tabTitles[tabName] ||
                "Storekeeper";

        }


        if (
            collapseInventory &&
            tabName !== "inventory"
        ) {

            inventoryExpanded = false;

            document
                .getElementById("inventoryNavGroup")
                ?.classList.remove("open");

        }


        if (
            collapseQuotation &&
            tabName !== "quotation"
        ) {

            quotationExpanded = false;

            document
                .getElementById("quotationNavGroup")
                ?.classList.remove("open");

        }


        if (tabName === "dashboard") {

            renderDashboard();

        }

        if (tabName === "workshop") {

            renderWorkshopDefault();

        }

        if (tabName === "inventory") {

            renderInventory();

        }

        if (tabName === "material-receipt") {

            initializeMrn();

            renderMrnHistory();

        }

        if (tabName === "counter") {

            renderCounterSearch();

            renderCounterCart();

        }

        if (tabName === "quotation") {

            renderQuotationSearch();

            renderQuotationCart();

            renderQuotationHistory();

        }

        if (tabName === "party") {

            renderPartySearch();

            renderPartyCart();

        }

        if (tabName === "transfer") {

            renderTransferForm();

            renderTransferHistory();

        }

        if (tabName === "cash") {

            renderPendingSales();

            renderPaymentPanel();

        }

        if (tabName === "transactions") {

            renderTransactions();

        }

    }


    function toggleInventoryNav() {

        inventoryExpanded = !inventoryExpanded;

        document
            .getElementById("inventoryNavGroup")
            ?.classList.toggle(
                "open",
                inventoryExpanded
            );

    }


    function toggleQuotationNav() {

        quotationExpanded = !quotationExpanded;

        document
            .getElementById("quotationNavGroup")
            ?.classList.toggle(
                "open",
                quotationExpanded
            );

    }



    /* =========================================================
       FIND JOB
    ========================================================= */

    function findJobById(id) {

        const search = String(id || "")
            .trim()
            .toLowerCase();

        if (!search) {

            return null;

        }

        return state.jobs.find(function (job) {

            return job.id.toLowerCase() === search;

        }) || null;

    }


    function findProduct(partNo) {

        return state.inventory.find(function (product) {

            return product.partNo.toLowerCase() ===
                String(partNo).toLowerCase();

        });

    }


    /* =========================================================
       WORKSHOP
    ========================================================= */

    function renderWorkshopDefault() {

        const input = document.getElementById(
            "jobCardSearch"
        );

        const result = document.getElementById(
            "workshopResult"
        );

        if (!input || !result) {
            return;
        }


        /*
         * Automatically show the first dummy Job Card.
         * This lets the Storekeeper immediately see how
         * the parts issue workflow works.
         */

        if (!input.value) {

            input.value = "JC-2026-001";

        }


        const job = findJobById(input.value);

        if (job) {

            renderJobResult(
                job,
                result
            );

        }

    }


    function renderJobResult(job, container) {

        if (!container) {
            return;
        }


        const requestedPartsSection = document.getElementById(
            "requestedPartsSection"
        );


        if (!job) {

            container.innerHTML = `

                <div class="panel">

                    <div class="empty-state large">

                        <div class="empty-icon">
                            ⚠️
                        </div>

                        <strong>
                            Job Card Not Found
                        </strong>

                        <span>
                            Please check the Job Card ID.
                        </span>

                    </div>

                </div>

            `;

            if (requestedPartsSection) {

                requestedPartsSection.style.display = "none";

            }

            return;

        }


        const allIssued =
            job.requestedParts.length > 0 &&
            job.requestedParts.every(function (line) {

                return Number(line.issuedQty) >=
                    Number(line.requestedQty);

            });


        const someIssued =
            job.requestedParts.some(function (line) {

                return Number(line.issuedQty) > 0;

            });


        let statusClass = "orange";

        if (allIssued) {

            statusClass = "green";

        } else if (someIssued) {

            statusClass = "blue";

        }


        container.innerHTML = `

            <div class="job-result">

                <div class="job-result-header">

                    <div class="job-result-title">

                        <div>

                            <div class="kicker">
                                JOB CARD
                            </div>

                            <h3>
                                ${escapeHtml(job.id)}
                            </h3>

                            <div class="job-result-subtitle">
                                Job Card fetched successfully
                            </div>

                        </div>

                        <span class="badge ${statusClass}">
                            ${escapeHtml(
                                job.requestedParts.length === 0
                                    ? job.status
                                    : allIssued
                                        ? "Parts Issued"
                                        : someIssued
                                            ? "Partially Issued"
                                            : job.status
                            )}
                        </span>

                    </div>

                </div>


                <div class="job-result-grid">

                    <div class="job-info">

                        <span>
                            Customer
                        </span>

                        <strong>
                            ${escapeHtml(job.customer)}
                        </strong>

                    </div>


                    <div class="job-info">

                        <span>
                            Vehicle
                        </span>

                        <strong>
                            ${escapeHtml(job.vehicle)}
                        </strong>

                    </div>


                    <div class="job-info">

                        <span>
                            Registration No.
                        </span>

                        <strong>
                            ${escapeHtml(job.registration)}
                        </strong>

                    </div>


                    <div class="job-info">

                        <span>
                            Mechanic
                        </span>

                        <strong>
                            ${escapeHtml(job.mechanic)}
                        </strong>

                    </div>


                    <div class="job-info">

                        <span>
                            Supervisor
                        </span>

                        <strong>
                            ${escapeHtml(job.supervisor)}
                        </strong>

                    </div>


                    <div class="job-info">

                        <span>
                            Job Type / Model
                        </span>

                        <strong>
                            ${escapeHtml(job.jobType)}
                        </strong>

                    </div>


                    <div class="job-info">

                        <span>
                            Created
                        </span>

                        <strong>
                            ${formatDate(job.createdDate)}
                        </strong>

                    </div>


                    <div class="job-info">

                        <span>
                            Requisition No.
                        </span>

                        <strong>
                            ${escapeHtml(job.requisitionNo || "Not raised")}
                        </strong>

                    </div>


                    <div class="job-info">

                        <span>
                            Requisition Date
                        </span>

                        <strong>
                            ${
                                job.requisitionDate
                                    ? formatDate(job.requisitionDate)
                                    : "-"
                            }
                        </strong>

                    </div>


                    <div class="job-info">

                        <span>
                            Warranty
                        </span>

                        <strong>
                            ${escapeHtml(job.warranty || "No")}
                        </strong>

                    </div>


                    <div class="job-info">

                        <span>
                            B.Cov.
                        </span>

                        <strong>
                            ${escapeHtml(job.bCov || "No")}
                        </strong>

                    </div>


                    <div class="job-info">

                        <span>
                            Parts
                        </span>

                        <strong>
                            ${job.requestedParts.length}
                            requested
                        </strong>

                    </div>

                </div>


                <div class="job-result-actions">

                    ${
                        job.requestedParts.length > 0 && !allIssued
                            ? `
                                <button
                                    type="button"
                                    class="btn success"
                                    data-issue-all="${escapeHtml(
                                        job.id
                                    )}">
                                    Issue All Available Parts
                                </button>
                              `
                            : job.requestedParts.length > 0
                                ? `
                                    <span class="badge green">
                                        All Requested Parts Issued
                                    </span>
                                  `
                                : ""
                    }

                </div>

            </div>

        `;


        /*
         * The Requested Parts table lives outside workshopResult
         * (see requestedPartsSection in the HTML) so the Add Parts
         * button and its listeners are never destroyed by the
         * innerHTML replacement above. Show it now that a job
         * card has been fetched, and render its rows.
         */

        if (requestedPartsSection) {

            requestedPartsSection.style.display = "";

            requestedPartsSection.dataset.jobId = job.id;

        }


        renderRequestedPartsTable(job);

    }


    function renderRequestedPartsTable(job) {

        const tbody = document.getElementById(
            "requestedPartsBody"
        );

        if (!tbody) {
            return;
        }


        if (!job || !job.requestedParts.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="empty-table">

                        No parts requested yet. Use
                        "+ Add Parts" to raise a requisition
                        line for this job card.

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML =
            job.requestedParts
                .map(function (line) {

                    const product =
                        findProduct(line.partNo);

                    const requested =
                        Number(line.requestedQty) || 0;

                    const issued =
                        Number(line.issuedQty) || 0;

                    const remaining =
                        Math.max(
                            requested - issued,
                            0
                        );

                    const available =
                        product
                            ? Number(product.stock) || 0
                            : 0;

                    let stockClass = "stock-good";

                    if (available <= 0) {

                        stockClass = "stock-out";

                    } else if (
                        product &&
                        available <= Number(product.reorderLevel)
                    ) {

                        stockClass = "stock-low";

                    }


                    return `

                        <tr>

                            <td>
                                <strong>
                                    ${escapeHtml(line.partNo)}
                                </strong>

                                <div class="table-muted">
                                    ${
                                        line.nb === "Yes"
                                            ? '<span class="badge gray">NB</span>'
                                            : ""
                                    }
                                    ${
                                        line.ew === "Yes"
                                            ? '<span class="badge blue">EW</span>'
                                            : ""
                                    }
                                </div>
                            </td>

                            <td>

                                ${
                                    escapeHtml(
                                        product?.name ||
                                        line.description ||
                                        "Unknown Product"
                                    )
                                }

                                <div class="table-muted">
                                    ${
                                        escapeHtml(
                                            product?.description ||
                                            line.description ||
                                            "-"
                                        )
                                    }
                                </div>

                            </td>

                            <td>
                                ${requested}
                            </td>

                            <td>
                                <strong class="${stockClass}">
                                    ${available}
                                </strong>
                            </td>

                            <td>

                                ${
                                    remaining <= 0
                                        ? `
                                            <span class="badge green">
                                                Issued
                                            </span>
                                          `
                                        : issued > 0
                                            ? `
                                                <span class="badge blue">
                                                    Partially Issued
                                                </span>
                                              `
                                            : `
                                                <span class="badge orange">
                                                    Requested
                                                </span>
                                              `
                                }

                            </td>

                            <td>

                                ${
                                    remaining > 0
                                        ? `
                                            <input
                                                class="issue-qty"
                                                type="number"
                                                min="0"
                                                max="${Math.min(
                                                    remaining,
                                                    available
                                                )}"
                                                step="1"
                                                value="${Math.min(
                                                    remaining,
                                                    available
                                                )}"
                                                data-issue-qty="${escapeHtml(
                                                    line.partNo
                                                )}">
                                          `
                                        : `
                                            <span class="badge green">
                                                Complete
                                            </span>
                                          `
                                }

                            </td>

                            <td>

                                ${
                                    remaining > 0
                                        ? `
                                            <button
                                                type="button"
                                                class="btn primary issue-button"
                                                data-issue-part="${escapeHtml(
                                                    line.partNo
                                                )}"
                                                data-job-id="${escapeHtml(
                                                    job.id
                                                )}">
                                                Issue
                                            </button>
                                          `
                                        : `
                                            <span class="badge green">
                                                Issued
                                            </span>
                                          `
                                }

                            </td>

                        </tr>

                    `;

                })
                .join("");

    }


    /* =========================================================
       ADD PARTS (REQUISITION SLIP ENTRY)
    ========================================================= */

    function openAddPartsForm(jobId) {

        const job = findJobById(jobId);

        if (!job) {

            showToast(
                "Fetch a Job Card before adding parts.",
                "error"
            );

            return;

        }


        populateProductDropdowns();


        document.getElementById(
            "addPartJobId"
        ).value = job.id;


        document.getElementById(
            "addPartJobLabel"
        ).textContent =
            `${job.id} · ${job.customer} · ${job.vehicle}`;


        if (!job.requisitionNo) {

            document.getElementById(
                "addPartRequisitionNo"
            ).value =
                `REQ-${String(
                    state.sequences.requisition
                ).padStart(4, "0")}`;

        } else {

            document.getElementById(
                "addPartRequisitionNo"
            ).value = job.requisitionNo;

        }


        document.getElementById(
            "addPartRequisitionDate"
        ).value =
            job.requisitionDate || today();


        document.getElementById(
            "addPartWarranty"
        ).value = job.warranty || "No";


        document.getElementById(
            "addPartBCov"
        ).value = job.bCov || "No";


        document.getElementById(
            "addPartPartSelect"
        ).value = "";

        document.getElementById(
            "addPartPartSearch"
        ).value = "";

        closeAddPartSuggestions();

        document.getElementById(
            "addPartQty"
        ).value = "1";

        document.getElementById(
            "addPartRate"
        ).value = "";

        document.getElementById(
            "addPartCurrentStock"
        ).value = "";

        document.getElementById(
            "addPartNb"
        ).value = "No";

        document.getElementById(
            "addPartEw"
        ).value = "No";

        document.getElementById(
            "addPartError"
        ).textContent = "";


        openModal("addPartsModal");

    }


    /* ---------------------------------------------------------
       SEARCHABLE PART PICKER (ADD PARTS MODAL)

       The Part No. field is a combobox: the Storekeeper types
       any part of a part number / product name / model /
       category and picks from the filtered list. The confirmed
       part number is stored in the hidden #addPartPartSelect
       field so saveAddPartLine() reads it exactly as before.
    --------------------------------------------------------- */

    function renderAddPartSuggestions(query) {

        const box =
            document.getElementById(
                "addPartPartResults"
            );

        if (!box) {
            return;
        }

        const search =
            String(query || "")
                .trim()
                .toLowerCase();

        addPartFiltered =
            state.inventory
                .filter(function (product) {

                    if (!search) {
                        return true;
                    }

                    return [

                        product.partNo,
                        product.name,
                        product.model,
                        product.category

                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(search);

                })
                .slice(0, 50);

        addPartActiveIndex =
            addPartFiltered.length ? 0 : -1;

        if (!addPartFiltered.length) {

            box.innerHTML = `

                <div class="part-search-empty">
                    No matching part found.
                </div>

            `;

        } else {

            box.innerHTML =
                addPartFiltered.map(function (product, index) {

                    return `

                        <div
                            class="part-search-option ${
                                index === addPartActiveIndex
                                    ? "active"
                                    : ""
                            }"
                            data-add-part-option="${escapeHtml(
                                product.partNo
                            )}">

                            <strong>
                                ${escapeHtml(product.partNo)}
                                -
                                ${escapeHtml(product.name)}
                            </strong>

                            <span>
                                ${escapeHtml(product.category)}
                                ·
                                Stock: ${product.stock} ${escapeHtml(product.unit)}
                                ·
                                ${escapeHtml(product.location)}
                            </span>

                        </div>

                    `;

                }).join("");

        }

        box.classList.add("open");

    }


    function closeAddPartSuggestions() {

        document
            .getElementById(
                "addPartPartResults"
            )
            ?.classList.remove("open");

        addPartActiveIndex = -1;

    }


    function moveAddPartActive(delta) {

        const box =
            document.getElementById(
                "addPartPartResults"
            );

        if (!box || !addPartFiltered.length) {
            return;
        }

        addPartActiveIndex =
            (
                addPartActiveIndex +
                delta +
                addPartFiltered.length
            ) % addPartFiltered.length;

        const options =
            box.querySelectorAll(
                "[data-add-part-option]"
            );

        options.forEach(function (option, index) {

            option.classList.toggle(
                "active",
                index === addPartActiveIndex
            );

        });

        options[addPartActiveIndex]
            ?.scrollIntoView({
                block: "nearest"
            });

    }


    function selectAddPart(partNo) {

        const product = findProduct(partNo);

        if (!product) {
            return;
        }

        document.getElementById(
            "addPartPartSelect"
        ).value = product.partNo;

        document.getElementById(
            "addPartPartSearch"
        ).value =
            `${product.partNo} - ${product.name}`;

        closeAddPartSuggestions();

        fillAddPartFromSelect(product.partNo);

    }


    function fillAddPartFromSelect(partNo) {

        const product = findProduct(partNo);

        if (!product) {
            return;
        }

        document.getElementById(
            "addPartRate"
        ).value = product.salePrice;

        document.getElementById(
            "addPartCurrentStock"
        ).value =
            `${product.stock} ${product.unit} available (Bin: ${product.location})`;

    }


    function saveAddPartLine(event) {

        event.preventDefault();


        const error = document.getElementById(
            "addPartError"
        );

        error.textContent = "";


        const jobId = document.getElementById(
            "addPartJobId"
        ).value;

        const job = findJobById(jobId);

        if (!job) {

            error.textContent =
                "Job Card could not be found.";

            return;

        }


        const partNo = document.getElementById(
            "addPartPartSelect"
        ).value;

        const qty =
            Number(
                document.getElementById(
                    "addPartQty"
                ).value
            ) || 0;

        const rate =
            Number(
                document.getElementById(
                    "addPartRate"
                ).value
            ) || 0;

        const nb = document.getElementById(
            "addPartNb"
        ).value;

        const ew = document.getElementById(
            "addPartEw"
        ).value;

        const warranty = document.getElementById(
            "addPartWarranty"
        ).value;

        const bCov = document.getElementById(
            "addPartBCov"
        ).value;

        const requisitionDate = document.getElementById(
            "addPartRequisitionDate"
        ).value || today();


        if (!partNo) {

            error.textContent =
                "Search and select a part to add to the requisition.";

            return;

        }

        if (qty <= 0) {

            error.textContent =
                "Enter a valid requested quantity.";

            return;

        }


        const product = findProduct(partNo);


        const existingLine = job.requestedParts.find(
            function (line) {

                return line.partNo === partNo;

            }
        );

        if (existingLine) {

            existingLine.requestedQty =
                Number(existingLine.requestedQty) + qty;

        } else {

            job.requestedParts.push({

                partNo,

                description:
                    product?.description ||
                    product?.name ||
                    "",

                requestedQty: qty,

                issuedQty: 0,

                returnedQty: 0,

                rate,

                nb,

                ew,

                status: "Requested"

            });

        }


        if (!job.requisitionNo) {

            job.requisitionNo =
                `REQ-${String(
                    state.sequences.requisition++
                ).padStart(4, "0")}`;

        }

        job.requisitionDate = requisitionDate;

        job.warranty = warranty;

        job.bCov = bCov;

        job.status = "Parts Requested";


        saveState();

        renderDashboard();

        renderJobResult(
            job,
            document.getElementById("workshopResult")
        );


        closeModal("addPartsModal");


        showToast(
            `${partNo} added to ${job.requisitionNo}.`
        );

    }


    function issueJobPart(
        jobId,
        partNo,
        quantity
    ) {

        const job = findJobById(jobId);

        if (!job) {

            showToast(
                "Job Card could not be found.",
                "error"
            );

            return;

        }


        const line =
            job.requestedParts.find(function (item) {

                return item.partNo === partNo;

            });


        if (!line) {

            showToast(
                "Requested part was not found.",
                "error"
            );

            return;

        }


        const product =
            findProduct(partNo);


        if (!product) {

            showToast(
                `Part ${partNo} is not available in inventory.`,
                "error"
            );

            return;

        }


        const requested =
            Number(line.requestedQty) || 0;

        const issued =
            Number(line.issuedQty) || 0;

        const remaining =
            Math.max(
                requested - issued,
                0
            );

        const entered =
            Number(quantity) || 0;


        if (remaining <= 0) {

            showToast(
                "This part has already been fully issued.",
                "error"
            );

            return;

        }


        if (entered <= 0) {

            showToast(
                "Enter a valid issue quantity.",
                "error"
            );

            return;

        }


        if (product.stock < entered) {

            showToast(
                `Insufficient stock. Available: ${product.stock}.`,
                "error"
            );

            return;

        }


        if (entered > remaining) {

            showToast(
                `Only ${remaining} unit(s) remain to be issued.`,
                "error"
            );

            return;

        }


        product.stock -= entered;

        line.issuedQty += entered;

        if (
            line.issuedQty >=
            line.requestedQty
        ) {

            line.status = "Issued";

        } else {

            line.status = "Partially Issued";

        }


        updateJobStatus(job);

        saveState();

        renderDashboard();

        renderInventory();

        renderJobResult(
            job,
            document.getElementById("workshopResult")
        );


        showToast(
            `${entered} ${partNo} issued against ${jobId}.`,
            "success"
        );

    }


    function issueAllParts(jobId) {

        const job = findJobById(jobId);

        if (!job) {
            return;
        }


        let issuedCount = 0;

        let skippedCount = 0;


        job.requestedParts.forEach(function (line) {

            const product =
                findProduct(line.partNo);

            if (!product) {

                skippedCount++;

                return;

            }


            const remaining =
                Math.max(
                    Number(line.requestedQty) -
                    Number(line.issuedQty),
                    0
                );


            if (remaining <= 0) {
                return;
            }


            const issueQty =
                Math.min(
                    remaining,
                    Number(product.stock) || 0
                );


            if (issueQty <= 0) {

                skippedCount++;

                return;

            }


            product.stock -= issueQty;

            line.issuedQty += issueQty;

            line.status =
                line.issuedQty >= line.requestedQty
                    ? "Issued"
                    : "Partially Issued";

            issuedCount += issueQty;

        });


        updateJobStatus(job);

        saveState();

        renderDashboard();

        renderInventory();

        renderJobResult(
            job,
            document.getElementById("workshopResult")
        );


        if (issuedCount > 0) {

            showToast(
                `${issuedCount} part(s) issued successfully.`,
                "success"
            );

        }


        if (skippedCount > 0) {

            setTimeout(function () {

                showToast(
                    `${skippedCount} item(s) could not be fully issued because of stock availability.`,
                    "error"
                );

            }, 300);

        }

    }


    function updateJobStatus(job) {

        const total =
            job.requestedParts.length;

        const issued =
            job.requestedParts.filter(function (line) {

                return Number(line.issuedQty) >=
                    Number(line.requestedQty);

            }).length;


        const anyIssued =
            job.requestedParts.some(function (line) {

                return Number(line.issuedQty) > 0;

            });


        if (total === 0) {

            job.status = "Open";

        } else if (issued === total) {

            job.status = "Parts Issued";

        } else if (anyIssued) {

            job.status = "Partially Issued";

        } else {

            job.status = "Parts Requested";

        }

    }


    /* =========================================================
       DASHBOARD
    ========================================================= */

    function renderDashboard() {

        const totalProducts =
            state.inventory.length;


        const lowStock =
            state.inventory.filter(function (product) {

                return Number(product.stock) <=
                    Number(product.reorderLevel);

            });


        const pendingJobs =
            state.jobs.filter(function (job) {

                return job.status !== "Parts Issued";

            });


        const pendingCash =
            state.pendingSales.reduce(function (sum, sale) {

                return sum + calculateSaleTotals(sale).grandTotal;

            }, 0);


        document.getElementById(
            "statProducts"
        ).textContent = totalProducts;


        document.getElementById(
            "statLowStock"
        ).textContent = lowStock.length;


        document.getElementById(
            "statPendingJobs"
        ).textContent = pendingJobs.length;


        document.getElementById(
            "statPendingCash"
        ).textContent = money(pendingCash);


        renderDashboardWorkshopList();

        renderDashboardLowStockList();

        renderDashboardCharts();

    }


    function renderDashboardWorkshopList() {

        const container =
            document.getElementById(
                "dashboardWorkshopList"
            );


        if (!container) {
            return;
        }


        const jobs =
            state.jobs.filter(function (job) {

                return job.status !== "Parts Issued";

            });


        if (!jobs.length) {

            container.innerHTML = `

                <div class="empty-state">
                    No pending workshop requests.
                </div>

            `;

            return;

        }


        container.innerHTML =
            jobs.map(function (job) {

                const requested =
                    job.requestedParts.reduce(
                        function (sum, line) {

                            return sum +
                                Number(line.requestedQty);

                        },
                        0
                    );


                const issued =
                    job.requestedParts.reduce(
                        function (sum, line) {

                            return sum +
                                Number(line.issuedQty);

                        },
                        0
                    );


                return `

                    <div
                        class="dashboard-item dashboard-clickable"
                        data-dashboard-job="${escapeHtml(
                            job.id
                        )}">

                        <div class="dashboard-item-main">

                            <strong>
                                ${escapeHtml(job.id)}
                            </strong>

                            <span>
                                ${escapeHtml(job.customer)}
                                ·
                                ${escapeHtml(job.vehicle)}
                            </span>

                        </div>

                        <div>

                            <div class="dashboard-item-value">
                                ${issued}/${requested}
                            </div>

                            <span class="badge orange">
                                ${escapeHtml(job.status)}
                            </span>

                        </div>

                    </div>

                `;

            }).join("");

    }


    function renderDashboardLowStockList() {

        const container =
            document.getElementById(
                "dashboardLowStockList"
            );


        if (!container) {
            return;
        }


        const lowStock =
            state.inventory
                .filter(function (product) {

                    return Number(product.stock) <=
                        Number(product.reorderLevel);

                })
                .sort(function (a, b) {

                    return a.stock - b.stock;

                });


        if (!lowStock.length) {

            container.innerHTML = `

                <div class="empty-state">
                    All inventory levels are healthy.
                </div>

            `;

            return;

        }


        container.innerHTML =
            lowStock.map(function (product) {

                const out =
                    Number(product.stock) <= 0;


                return `

                    <div class="dashboard-item">

                        <div class="dashboard-item-main">

                            <strong>
                                ${escapeHtml(product.name)}
                            </strong>

                            <span>
                                ${escapeHtml(product.partNo)}
                                ·
                                ${escapeHtml(product.location)}
                            </span>

                        </div>

                        <div>

                            <div class="dashboard-item-value ${
                                out
                                    ? "stock-out"
                                    : "stock-low"
                            }">

                                ${product.stock}
                                ${escapeHtml(product.unit)}

                            </div>

                            <span class="badge ${
                                out
                                    ? "red"
                                    : "orange"
                            }">

                                ${
                                    out
                                        ? "Out of Stock"
                                        : "Low Stock"
                                }

                            </span>

                        </div>

                    </div>

                `;

            }).join("");

    }


    function renderBarRows(container, rows, colorClass) {

        if (!container) {
            return;
        }

        if (!rows.length) {

            container.innerHTML = `

                <div class="empty-state">
                    No data yet.
                </div>

            `;

            return;

        }

        const max =
            Math.max.apply(
                null,
                rows.map(function (row) {

                    return Number(row.value) || 0;

                })
            ) || 1;

        container.innerHTML =
            rows.map(function (row) {

                const pct =
                    Math.max(
                        4,
                        Math.round(
                            (Number(row.value) / max) * 100
                        )
                    );

                return `

                    <div class="chart-row">

                        <div
                            class="chart-row-label"
                            title="${escapeHtml(row.label)}">
                            ${escapeHtml(row.label)}
                        </div>

                        <div class="chart-row-track">

                            <div
                                class="chart-row-fill ${colorClass || ""}"
                                style="width: ${pct}%;">
                            </div>

                        </div>

                        <div class="chart-row-value">
                            ${row.value}
                        </div>

                    </div>

                `;

            }).join("");

    }


    function renderDashboardCharts() {

        const stockContainer =
            document.getElementById(
                "chartInventoryStock"
            );

        if (stockContainer) {

            const stockRows =
                [...state.inventory]
                    .sort(function (a, b) {

                        return Number(b.stock) - Number(a.stock);

                    })
                    .slice(0, 8)
                    .map(function (product) {

                        return {

                            label:
                                `${product.name} (${product.partNo})`,

                            value: Number(product.stock) || 0

                        };

                    });

            renderBarRows(
                stockContainer,
                stockRows,
                "blue"
            );

        }


        /*
         * Aggregate quantity sold per part number across every
         * completed sale (Counter and Party), regardless of which
         * inventory row it currently maps to.
         */

        const soldByPart = {};

        state.sales.forEach(function (sale) {

            (sale.items || []).forEach(function (item) {

                const key = item.partNo;

                soldByPart[key] =
                    (soldByPart[key] || 0) +
                    (Number(item.qty) || 0);

            });

        });


        const inventorySoldRanking =
            state.inventory.map(function (product) {

                return {

                    label:
                        `${product.name} (${product.partNo})`,

                    value: soldByPart[product.partNo] || 0

                };

            });


        const topSoldContainer =
            document.getElementById(
                "chartTopSold"
            );

        if (topSoldContainer) {

            const topSold =
                [...inventorySoldRanking]
                    .filter(function (row) {

                        return row.value > 0;

                    })
                    .sort(function (a, b) {

                        return b.value - a.value;

                    })
                    .slice(0, 5);

            topSoldContainer.innerHTML = `
                <div class="kicker" style="margin-bottom: 8px;">
                    MOST SOLD
                </div>
            ` + (
                topSold.length
                    ? ""
                    : '<div class="empty-state">No sales recorded yet.</div>'
            );

            if (topSold.length) {

                const rowsHost = document.createElement("div");

                topSoldContainer.appendChild(rowsHost);

                renderBarRows(
                    rowsHost,
                    topSold,
                    "green"
                );

            }

        }


        const leastSoldContainer =
            document.getElementById(
                "chartLeastSold"
            );

        if (leastSoldContainer) {

            const leastSold =
                [...inventorySoldRanking]
                    .sort(function (a, b) {

                        return a.value - b.value;

                    })
                    .slice(0, 5);

            leastSoldContainer.innerHTML = `
                <div class="kicker" style="margin-bottom: 8px;">
                    LEAST SOLD
                </div>
            `;

            const rowsHost = document.createElement("div");

            leastSoldContainer.appendChild(rowsHost);

            renderBarRows(
                rowsHost,
                leastSold,
                "orange"
            );

        }

    }


    /* =========================================================
       INVENTORY
    ========================================================= */

    function renderInventory() {

        const tbody =
            document.getElementById(
                "inventoryTableBody"
            );


        if (!tbody) {
            return;
        }


        const search =
            (
                document.getElementById(
                    "inventorySearch"
                )?.value || ""
            )
                .trim()
                .toLowerCase();


        const location =
            document.getElementById(
                "inventoryLocationFilter"
            )?.value || "";


        const stockFilter =
            document.getElementById(
                "inventoryStockFilter"
            )?.value || "";


        let products =
            [...state.inventory];


        if (search) {

            products =
                products.filter(function (product) {

                    return [

                        product.partNo,
                        product.name,
                        product.model,
                        product.category,
                        product.description

                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(search);

                });

        }


        if (location) {

            products =
                products.filter(function (product) {

                    return product.location === location;

                });

        }


        if (stockFilter === "low") {

            products =
                products.filter(function (product) {

                    return Number(product.stock) <=
                        Number(product.reorderLevel);

                });

        }


        if (stockFilter === "out") {

            products =
                products.filter(function (product) {

                    return Number(product.stock) <= 0;

                });

        }


        if (stockFilter === "available") {

            products =
                products.filter(function (product) {

                    return Number(product.stock) > 0;

                });

        }


        const count =
            document.getElementById(
                "inventoryCount"
            );


        if (count) {

            count.textContent =
                products.length;

        }


        if (!products.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="9"
                        class="empty-table">

                        No products found.

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML =
            products.map(function (product) {

                let stockClass =
                    "stock-good";

                if (Number(product.stock) <= 0) {

                    stockClass = "stock-out";

                } else if (
                    Number(product.stock) <=
                    Number(product.reorderLevel)
                ) {

                    stockClass = "stock-low";

                }


                return `

                    <tr>

                        <td>

                            <strong>
                                ${escapeHtml(product.name)}
                            </strong>

                            <div class="table-muted">
                                ${escapeHtml(
                                    product.model || "-"
                                )}
                            </div>

                        </td>


                        <td>
                            ${escapeHtml(product.partNo)}
                        </td>


                        <td>
                            ${escapeHtml(product.category)}
                        </td>


                        <td>
                            ${escapeHtml(product.location)}
                        </td>


                        <td>

                            <strong class="stock-number ${stockClass}">
                                ${product.stock}
                            </strong>

                            ${escapeHtml(product.unit)}

                        </td>


                        <td>
                            ${product.reorderLevel}
                        </td>


                        <td>
                            ${money(product.salePrice)}
                        </td>


                        <td>
                            ${product.tax}%
                        </td>


                        <td>

                            <div class="action-buttons">

                                <button
                                    type="button"
                                    class="action-btn edit"
                                    data-edit-product="${escapeHtml(
                                        product.id
                                    )}">
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    class="action-btn delete"
                                    data-delete-product="${escapeHtml(
                                        product.id
                                    )}">
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }).join("");

    }


    function populateProductDropdowns() {

        const categorySelect =
            document.getElementById(
                "productCategory"
            );


        const mrnCategory =
            document.getElementById(
                "mrnCategory"
            );


        const unitSelect =
            document.getElementById(
                "productUnit"
            );


        const mrnUnit =
            document.getElementById(
                "mrnUnit"
            );


        if (categorySelect) {

            categorySelect.innerHTML =
                state.categories.map(function (category) {

                    return `

                        <option value="${escapeHtml(category)}">
                            ${escapeHtml(category)}
                        </option>

                    `;

                }).join("");

        }


        if (mrnCategory) {

            mrnCategory.innerHTML =
                state.categories.map(function (category) {

                    return `

                        <option value="${escapeHtml(category)}">
                            ${escapeHtml(category)}
                        </option>

                    `;

                }).join("");

        }


        if (unitSelect) {

            unitSelect.innerHTML =
                state.units.map(function (unit) {

                    return `

                        <option value="${escapeHtml(unit)}">
                            ${escapeHtml(unit)}
                        </option>

                    `;

                }).join("");

        }


        if (mrnUnit) {

            mrnUnit.innerHTML =
                state.units.map(function (unit) {

                    return `

                        <option value="${escapeHtml(unit)}">
                            ${escapeHtml(unit)}
                        </option>

                    `;

                }).join("");

        }


        const productSelect =
            document.getElementById(
                "mrnProductSelect"
            );


        if (productSelect) {

            productSelect.innerHTML = `

                <option value="">
                    Select product
                </option>

                ${
                    state.inventory.map(function (product) {

                        return `

                            <option
                                value="${escapeHtml(product.partNo)}">

                                ${escapeHtml(product.partNo)}
                                -
                                ${escapeHtml(product.name)}

                            </option>

                        `;

                    }).join("")
                }

            `;

        }


        /*
         * The Add Parts modal now uses a searchable combobox
         * (#addPartPartSearch) that filters state.inventory
         * live, so there is no option list to pre-populate.
         */

    }


    /* =========================================================
       PRODUCT MODAL
    ========================================================= */

    function openModal(id) {

        document
            .getElementById(id)
            ?.classList.add("open");

        /*
         * The Material Receipt form opens as a modal over the
         * Material Receipt tab. While it's open, hide the MRN
         * History panel underneath so it doesn't show alongside
         * the form (instead of just being dimmed by the backdrop).
         */

        if (id === "mrnFormModal") {

            const historyPanel =
                document.getElementById(
                    "mrnHistoryPanel"
                );

            if (historyPanel) {

                historyPanel.style.display = "none";

            }

        }

    }


    function closeModal(id) {

        document
            .getElementById(id)
            ?.classList.remove("open");

        if (id === "mrnFormModal") {

            const historyPanel =
                document.getElementById(
                    "mrnHistoryPanel"
                );

            if (historyPanel) {

                historyPanel.style.display = "";

            }

        }

    }


    function resetProductForm() {

        const form =
            document.getElementById(
                "addProductForm"
            );


        if (form) {

            form.reset();

        }


        document.getElementById(
            "editingProductId"
        ).value = "";


        document.getElementById(
            "productModalTitle"
        ).textContent = "Add Product";


        document.getElementById(
            "addProductError"
        ).textContent = "";


        document.getElementById(
            "productOpeningStock"
        ).value = "0";


        document.getElementById(
            "productReorderLevel"
        ).value = "5";


        document.getElementById(
            "productTax"
        ).value = "7";


        document.getElementById(
            "locationThimphu"
        ).checked = true;


        const preview =
            document.getElementById(
                "productImagePreview"
            );


        preview.src = "";

        preview.classList.remove(
            "visible"
        );

    }


    function openAddProductModal(productId = null) {

        resetProductForm();

        populateProductDropdowns();


        if (productId) {

            const product =
                state.inventory.find(function (item) {

                    return item.id === productId;

                });


            if (!product) {
                return;
            }


            document.getElementById(
                "editingProductId"
            ).value = product.id;


            document.getElementById(
                "productModalTitle"
            ).textContent =
                "Edit Product";


            document.getElementById(
                "productPartNo"
            ).value =
                product.partNo || "";


            document.getElementById(
                "productName"
            ).value =
                product.name || "";


            document.getElementById(
                "productCategory"
            ).value =
                product.category || state.categories[0];


            document.getElementById(
                "productSerialNumber"
            ).value =
                product.serialNumber || "";


            document.getElementById(
                "productModel"
            ).value =
                product.model || "";


            document.getElementById(
                "productUnit"
            ).value =
                product.unit || state.units[0];


            document.getElementById(
                "productCostPrice"
            ).value =
                product.costPrice || 0;


            document.getElementById(
                "productSalePrice"
            ).value =
                product.salePrice || 0;


            document.getElementById(
                "productTax"
            ).value =
                product.tax ?? 7;


            document.getElementById(
                "productOpeningStock"
            ).value =
                product.stock || 0;


            document.getElementById(
                "productReorderLevel"
            ).value =
                product.reorderLevel || 0;


            document.getElementById(
                "productDetails"
            ).value =
                product.details || "";


            if (
                product.location ===
                "Phuntsholing"
            ) {

                document.getElementById(
                    "locationPhuntsholing"
                ).checked = true;

            } else {

                document.getElementById(
                    "locationThimphu"
                ).checked = true;

            }


            if (product.image) {

                const preview =
                    document.getElementById(
                        "productImagePreview"
                    );

                preview.src =
                    product.image;

                preview.classList.add(
                    "visible"
                );

            }

        }


        openModal(
            "addProductModal"
        );

    }


    function saveProduct(event) {

        event.preventDefault();


        const error =
            document.getElementById(
                "addProductError"
            );


        error.textContent = "";


        const editingId =
            document.getElementById(
                "editingProductId"
            ).value;


        const partNo =
            document.getElementById(
                "productPartNo"
            ).value.trim();


        const name =
            document.getElementById(
                "productName"
            ).value.trim();


        const category =
            document.getElementById(
                "productCategory"
            ).value;


        const serialNumber =
            document.getElementById(
                "productSerialNumber"
            ).value.trim();


        const model =
            document.getElementById(
                "productModel"
            ).value.trim();


        const unit =
            document.getElementById(
                "productUnit"
            ).value;


        const costPrice =
            Number(
                document.getElementById(
                    "productCostPrice"
                ).value
            ) || 0;


        const salePrice =
            Number(
                document.getElementById(
                    "productSalePrice"
                ).value
            ) || 0;


        const tax =
            Number(
                document.getElementById(
                    "productTax"
                ).value
            ) || 0;


        const openingStock =
            Number(
                document.getElementById(
                    "productOpeningStock"
                ).value
            ) || 0;


        const reorderLevel =
            Number(
                document.getElementById(
                    "productReorderLevel"
                ).value
            ) || 0;


        const location =
            document.querySelector(
                'input[name="productLocation"]:checked'
            )?.value ||
            "Thimphu";


        const details =
            document.getElementById(
                "productDetails"
            ).value.trim();


        if (!partNo || !name) {

            error.textContent =
                "Part number and product name are required.";

            return;

        }


        const duplicate =
            state.inventory.find(function (product) {

                return (
                    product.partNo.toLowerCase() ===
                    partNo.toLowerCase() &&
                    product.id !== editingId
                );

            });


        if (duplicate) {

            error.textContent =
                "A product with this part number already exists.";

            return;

        }


        const imageInput =
            document.getElementById(
                "productImage"
            );


        function finishSave(image) {

            if (editingId) {

                const product =
                    state.inventory.find(function (item) {

                        return item.id === editingId;

                    });


                if (!product) {
                    return;
                }


                product.partNo = partNo;
                product.name = name;
                product.description = details || name;
                product.category = category;
                product.serialNumber = serialNumber;
                product.model = model;
                product.unit = unit;
                product.costPrice = costPrice;
                product.salePrice = salePrice;
                product.tax = tax;
                product.stock = openingStock;
                product.reorderLevel = reorderLevel;
                product.location = location;
                product.details = details;

                if (image) {

                    product.image = image;

                }

                showToast(
                    "Product updated successfully."
                );

            } else {

                state.inventory.push({

                    id: `PRD-${String(
                        state.sequences.product++
                    ).padStart(3, "0")}`,

                    partNo,

                    name,

                    description: details || name,

                    category,

                    serialNumber,

                    model,

                    salePrice,

                    costPrice,

                    tax,

                    unit,

                    stock: openingStock,

                    reorderLevel,

                    location,

                    image: image || "",

                    details

                });


                showToast(
                    "Product added successfully."
                );

            }


            saveState();

            populateProductDropdowns();

            renderInventory();

            renderDashboard();

            closeModal(
                "addProductModal"
            );

        }


        if (
            imageInput.files &&
            imageInput.files[0]
        ) {

            const reader =
                new FileReader();


            reader.onload = function () {

                finishSave(
                    reader.result
                );

            };


            reader.readAsDataURL(
                imageInput.files[0]
            );

        } else {

            finishSave("");

        }

    }


    /* =========================================================
       INVENTORY MANAGEMENT
    ========================================================= */

    function openInventoryManager(action) {

        const title =
            document.getElementById(
                "inventoryManagerTitle"
            );


        const content =
            document.getElementById(
                "inventoryManagerContent"
            );


        if (!title || !content) {
            return;
        }


        if (action === "add-category") {

            title.textContent =
                "Add Category";


            content.innerHTML = `

                <div class="management-section">

                    <h4>
                        Create Product Category
                    </h4>

                    <div class="manager-row">

                        <input
                            id="managerCategoryInput"
                            placeholder="Example: Engine Parts">

                        <button
                            type="button"
                            class="btn primary"
                            id="managerAddCategoryBtn">
                            Add
                        </button>

                    </div>

                </div>

            `;

        }


        else if (
            action === "manage-category"
        ) {

            title.textContent =
                "Manage Categories";


            content.innerHTML = `

                <div class="management-section">

                    <h4>
                        Product Categories
                    </h4>

                    <div class="manager-list">

                        ${
                            state.categories.map(
                                function (category) {

                                    return `

                                        <div class="manager-list-item">

                                            <span>
                                                ${escapeHtml(category)}
                                            </span>

                                            <button
                                                type="button"
                                                class="action-btn delete"
                                                data-manager-delete-category="${escapeHtml(
                                                    category
                                                )}">
                                                Remove
                                            </button>

                                        </div>

                                    `;

                                }
                            ).join("")
                        }

                    </div>

                </div>

            `;

        }


        else if (
            action === "manage-product"
        ) {

            title.textContent =
                "Manage Products";


            content.innerHTML = `

                <div class="management-section">

                    <h4>
                        Product List
                    </h4>

                    <div class="manager-list">

                        ${
                            state.inventory.map(
                                function (product) {

                                    return `

                                        <div class="manager-list-item">

                                            <span>
                                                ${escapeHtml(
                                                    product.partNo
                                                )}
                                                -
                                                ${escapeHtml(
                                                    product.name
                                                )}
                                            </span>

                                            <button
                                                type="button"
                                                class="action-btn edit"
                                                data-manager-edit-product="${escapeHtml(
                                                    product.id
                                                )}">
                                                Edit
                                            </button>

                                        </div>

                                    `;

                                }
                            ).join("")
                        }

                    </div>

                </div>

            `;

        }


        else if (
            action === "group-pricing"
        ) {

            title.textContent =
                "Group Pricing";


            content.innerHTML = `

                <div class="management-section">

                    <h4>
                        Group Pricing
                    </h4>

                    <p class="management-note">
                        Configure customer or workshop
                        group-specific pricing here.
                    </p>

                    <div class="manager-row">

                        <input
                            id="groupPriceName"
                            placeholder="Group name">

                        <input
                            id="groupPriceDiscount"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Discount %">

                        <button
                            type="button"
                            class="btn primary"
                            id="addGroupPriceBtn">
                            Add
                        </button>

                    </div>

                    <div class="manager-list">

                        ${
                            state.groupPrices.map(
                                function (item, index) {

                                    return `

                                        <div class="manager-list-item">

                                            <span>
                                                ${escapeHtml(
                                                    item.name
                                                )}
                                                -
                                                ${item.discount}%
                                            </span>

                                            <button
                                                type="button"
                                                class="action-btn delete"
                                                data-delete-group-price="${index}">
                                                Remove
                                            </button>

                                        </div>

                                    `;

                                }
                            ).join("")
                        }

                    </div>

                </div>

            `;

        }


        else if (action === "units") {

            title.textContent =
                "Units";


            content.innerHTML = `

                <div class="management-section">

                    <h4>
                        Inventory Units
                    </h4>

                    <div class="manager-row">

                        <input
                            id="managerUnitInput"
                            placeholder="Example: carton">

                        <button
                            type="button"
                            class="btn primary"
                            id="managerAddUnitBtn">
                            Add
                        </button>

                    </div>


                    <div class="manager-list">

                        ${
                            state.units.map(
                                function (unit) {

                                    return `

                                        <div class="manager-list-item">

                                            <span>
                                                ${escapeHtml(unit)}
                                            </span>

                                            <button
                                                type="button"
                                                class="action-btn delete"
                                                data-manager-delete-unit="${escapeHtml(
                                                    unit
                                                )}">
                                                Remove
                                            </button>

                                        </div>

                                    `;

                                }
                            ).join("")
                        }

                    </div>

                </div>

            `;

        }


        else if (
            action === "group-price-list"
        ) {

            title.textContent =
                "Group Price List";


            content.innerHTML = `

                <div class="management-section">

                    <h4>
                        Group Price List
                    </h4>

                    <div class="manager-list">

                        ${
                            state.groupPrices.length
                                ? state.groupPrices.map(
                                    function (item) {

                                        return `

                                            <div class="manager-list-item">

                                                <span>
                                                    ${escapeHtml(
                                                        item.name
                                                    )}
                                                </span>

                                                <strong>
                                                    ${item.discount}%
                                                </strong>

                                            </div>

                                        `;

                                    }
                                ).join("")
                                : `
                                    <div class="empty-state">
                                        No group pricing rules configured.
                                    </div>
                                  `
                        }

                    </div>

                </div>

            `;

        }


        openModal(
            "inventoryManagerModal"
        );

    }


    /* =========================================================
       MATERIAL RECEIPT
    ========================================================= */

    function initializeMrn() {

        populateProductDropdowns();

        const no =
            `MRN-${String(
                state.sequences.mrn
            ).padStart(4, "0")}`;


        const noInput =
            document.getElementById(
                "mrnNoDisplay"
            );


        if (noInput && !noInput.value) {

            noInput.value = no;

        }


        const dateInput =
            document.getElementById(
                "mrnDate"
            );


        if (dateInput && !dateInput.value) {

            dateInput.value = today();

        }


        renderMrnLines();

        calculateMrn();

    }


    function fillMrnProduct(partNo) {

        const product =
            findProduct(partNo);


        if (!product) {
            return;
        }


        document.getElementById(
            "mrnPartNo"
        ).value = product.partNo;


        document.getElementById(
            "mrnDescription"
        ).value =
            product.description ||
            product.name;


        document.getElementById(
            "mrnCategory"
        ).value =
            product.category;


        document.getElementById(
            "mrnUnit"
        ).value =
            product.unit;


        document.getElementById(
            "mrnGst"
        ).value =
            product.tax;


        document.getElementById(
            "mrnRate"
        ).value =
            product.costPrice;


        const rlRateField = document.getElementById(
            "mrnRlRate"
        );

        if (rlRateField) {

            rlRateField.value =
                product.salePrice;

        }


        const stockField = document.getElementById(
            "mrnCurrentStock"
        );

        if (stockField) {

            stockField.value =
                `${product.stock} ${product.unit}`;

        }


        const binField = document.getElementById(
            "mrnStockBin"
        );

        if (binField) {

            binField.value =
                product.location;

        }

    }


    function addMrnLine() {

        const partNo =
            document.getElementById(
                "mrnPartNo"
            ).value.trim();


        const description =
            document.getElementById(
                "mrnDescription"
            ).value.trim();


        const category =
            document.getElementById(
                "mrnCategory"
            ).value;


        const unit =
            document.getElementById(
                "mrnUnit"
            ).value;


        const gst =
            Number(
                document.getElementById(
                    "mrnGst"
                ).value
            ) || 0;


        const qty =
            Number(
                document.getElementById(
                    "mrnQtyReceived"
                ).value
            ) || 0;


        const qtyInvoiced =
            Number(
                document.getElementById(
                    "mrnQtyInvoiced"
                ).value
            ) || qty;


        const rejected =
            Number(
                document.getElementById(
                    "mrnQtyRejected"
                ).value
            ) || 0;


        const rate =
            Number(
                document.getElementById(
                    "mrnRate"
                ).value
            ) || 0;


        const freightRate =
            Number(
                document.getElementById(
                    "mrnFreightRate"
                ).value
            ) || 0;


        const rlRate =
            Number(
                document.getElementById(
                    "mrnRlRate"
                )?.value
            ) || 0;


        const discComm =
            Number(
                document.getElementById(
                    "mrnDiscComm"
                )?.value
            ) || 0;


        const stockBin =
            document.getElementById(
                "mrnStockBin"
            )?.value.trim() || "";


        if (!partNo) {

            showToast(
                "Select or enter a part number.",
                "error"
            );

            return;

        }


        if (qty <= 0) {

            showToast(
                "Enter a valid received quantity.",
                "error"
            );

            return;

        }

        mrnLines.push({

            id: uid("MRN-LINE"),

            partNo,

            description,

            category,

            unit,

            gst,

            qtyInvoiced,

            qtyReceived: qty,

            qtyRejected: rejected,

            rate,

            freightRate,

            rlRate,

            discComm,

            stockBin

        });


        renderMrnLines();

        calculateMrn();


        document.getElementById(
            "mrnPartNo"
        ).value = "";


        document.getElementById(
            "mrnDescription"
        ).value = "";


        document.getElementById(
            "mrnQtyInvoiced"
        ).value = "1";


        document.getElementById(
            "mrnQtyReceived"
        ).value = "1";


        document.getElementById(
            "mrnQtyRejected"
        ).value = "0";


        document.getElementById(
            "mrnRate"
        ).value = "";


        document.getElementById(
            "mrnFreightRate"
        ).value = "0";


        if (document.getElementById("mrnRlRate")) {

            document.getElementById(
                "mrnRlRate"
            ).value = "";

        }


        if (document.getElementById("mrnDiscComm")) {

            document.getElementById(
                "mrnDiscComm"
            ).value = "0";

        }


        if (document.getElementById("mrnCurrentStock")) {

            document.getElementById(
                "mrnCurrentStock"
            ).value = "";

        }


        if (document.getElementById("mrnStockBin")) {

            document.getElementById(
                "mrnStockBin"
            ).value = "";

        }


        document.getElementById(
            "mrnProductSelect"
        ).value = "";

    }


    function renderMrnLines() {

        const tbody =
            document.getElementById(
                "mrnLinesBody"
            );


        if (!tbody) {
            return;
        }


        if (!mrnLines.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        class="empty-table">

                        No items added.

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML =
            mrnLines.map(function (line) {

                const base =
                    line.qtyReceived *
                    line.rate;


                const freight =
                    line.qtyReceived *
                    line.freightRate;


                const discComm =
                    (base + freight) *
                    ((line.discComm || 0) / 100);


                const assessable =
                    base + freight - discComm;


                const gstAmount =
                    assessable *
                    (line.gst / 100);


                const total =
                    assessable + gstAmount;


                return `

                    <tr>

                        <td>
                            ${escapeHtml(line.partNo)}
                        </td>

                        <td>
                            ${escapeHtml(line.description)}
                        </td>

                        <td>
                            ${line.qtyInvoiced} / ${line.qtyReceived} / ${line.qtyRejected}
                        </td>

                        <td>
                            ${money(line.rate)}
                        </td>

                        <td>
                            ${money(freight)}
                        </td>

                        <td>
                            ${money(gstAmount)}
                        </td>

                        <td>
                            ${money(total)}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="action-btn delete"
                                data-remove-mrn-line="${escapeHtml(
                                    line.id
                                )}">
                                Remove
                            </button>

                        </td>

                    </tr>

                `;

            }).join("");

    }


    function calculateMrn() {

        const baseTotal =
            mrnLines.reduce(
                function (sum, line) {

                    return sum +
                        (
                            line.qtyReceived *
                            line.rate
                        );

                },
                0
            );


        const freightTotal =
            mrnLines.reduce(
                function (sum, line) {

                    return sum +
                        (
                            line.qtyReceived *
                            line.freightRate
                        );

                },
                0
            );


        const itemDiscComm =
            mrnLines.reduce(
                function (sum, line) {

                    const base =
                        (line.qtyReceived * line.rate) +
                        (line.qtyReceived * line.freightRate);

                    return sum +
                        (
                            base *
                            ((line.discComm || 0) / 100)
                        );

                },
                0
            );


        const assessable =
            baseTotal +
            freightTotal -
            itemDiscComm;


        let current =
            assessable;


        let discountTotal =
            itemDiscComm;


        const discounts = [

            "mrnDiscountA",
            "mrnDiscountB",
            "mrnDiscountC",
            "mrnCashDiscount"

        ];


        discounts.forEach(function (id) {

            const percent =
                Number(
                    document.getElementById(
                        id
                    )?.value
                ) || 0;


            const discount =
                current *
                Math.min(
                    Math.max(percent, 0),
                    100
                ) /
                100;


            discountTotal += discount;

            current -= discount;

        });


        const gst =
            mrnLines.reduce(
                function (sum, line) {

                    const base =
                        line.qtyReceived *
                        (
                            line.rate +
                            line.freightRate
                        );


                    return sum +
                        (
                            base *
                            (line.gst / 100)
                        );

                },
                0
            );


        const handling =
            Number(
                document.getElementById(
                    "mrnHandlingCharge"
                )?.value
            ) || 0;


        const vorSurcharge =
            Number(
                document.getElementById(
                    "mrnVorSurcharge"
                )?.value
            ) || 0;


        const serviceTaxPercent =
            Number(
                document.getElementById(
                    "mrnServiceTax"
                )?.value
            ) || 0;


        const eCessPercent =
            Number(
                document.getElementById(
                    "mrnECess"
                )?.value
            ) || 0;


        const excisePercent =
            Number(
                document.getElementById(
                    "mrnExcise"
                )?.value
            ) || 0;


        const taxSurchargePercent =
            Number(
                document.getElementById(
                    "mrnTaxSurcharge"
                )?.value
            ) || 0;


        const serviceTax =
            current *
            (serviceTaxPercent / 100);


        const eCess =
            current *
            (eCessPercent / 100);


        const excise =
            current *
            (excisePercent / 100);


        const taxSurcharge =
            current *
            (taxSurchargePercent / 100);


        const netTotal =
            current +
            gst +
            handling +
            vorSurcharge +
            serviceTax +
            eCess +
            excise +
            taxSurcharge;


        document.getElementById(
            "mrnAssessableValue"
        ).textContent =
            money(assessable);


        document.getElementById(
            "mrnDiscountAmount"
        ).textContent =
            money(discountTotal);


        document.getElementById(
            "mrnGstAmount"
        ).textContent =
            money(gst);


        document.getElementById(
            "mrnHandlingDisplay"
        ).textContent =
            money(handling);


        document.getElementById(
            "mrnNetTotal"
        ).textContent =
            money(netTotal);


        const itemsField = document.getElementById(
            "mrnTotalItems"
        );

        if (itemsField) {

            itemsField.textContent =
                mrnLines.length;

        }


        const qtyField = document.getElementById(
            "mrnTotalQty"
        );

        if (qtyField) {

            qtyField.textContent =
                mrnLines.reduce(
                    function (sum, line) {

                        return sum +
                            Number(line.qtyReceived);

                    },
                    0
                );

        }


        return {

            assessable,

            discount:
                discountTotal,

            gst,

            handling,

            vorSurcharge,

            serviceTax,

            eCess,

            excise,

            taxSurcharge,

            netTotal

        };

    }


    function saveMrn(event) {

        event.preventDefault();


        if (!mrnLines.length) {

            showToast(
                "Add at least one item to the MRN.",
                "error"
            );

            return;

        }


        const totals =
            calculateMrn();


        mrnLines.forEach(function (line) {

            const product =
                findProduct(line.partNo);


            if (product) {

                product.stock =
                    Number(product.stock) +
                    Number(line.qtyReceived);

            } else {

                state.inventory.push({

                    id: `PRD-${String(
                        state.sequences.product++
                    ).padStart(3, "0")}`,

                    partNo: line.partNo,

                    name: line.description,

                    description: line.description,

                    category: line.category,

                    serialNumber: "",

                    model: "",

                    salePrice: line.rate,

                    costPrice: line.rate,

                    tax: line.gst,

                    unit: line.unit,

                    stock: line.qtyReceived,

                    reorderLevel: 5,

                    location: line.stockBin || "Thimphu",

                    image: "",

                    details: "Created through Material Receipt."

                });

            }

        });


        const mrnNumber =
            `MRN-${String(
                state.sequences.mrn++
            ).padStart(4, "0")}`;


        const receipt = {

            id: uid("MRN"),

            mrnNo: mrnNumber,

            receiptType:
                document.getElementById(
                    "mrnReceiptType"
                )?.value || "Invoice",

            refNo:
                document.getElementById(
                    "mrnRefNo"
                )?.value.trim() || "",

            downloadMail:
                document.getElementById(
                    "mrnDownloadMail"
                )?.value || "No",

            date:
                document.getElementById(
                    "mrnDate"
                ).value || today(),

            vendorCode:
                document.getElementById(
                    "mrnVendorCode"
                ).value.trim(),

            vendorName:
                document.getElementById(
                    "mrnVendorName"
                ).value.trim(),

            rateType:
                document.getElementById(
                    "mrnRateType"
                ).value,

            invoiceNo:
                document.getElementById(
                    "mrnInvoiceNo"
                ).value.trim(),

            invoiceDate:
                document.getElementById(
                    "mrnInvoiceDate"
                ).value,

            taxOnFp:
                document.getElementById(
                    "mrnTaxOnFp"
                ).value,

            vatSrvTaxOnHand:
                document.getElementById(
                    "mrnVatSrvTax"
                )?.value || "No",

            formNo:
                document.getElementById(
                    "mrnFormNo"
                )?.value.trim() || "",

            lines: JSON.parse(
                JSON.stringify(mrnLines)
            ),

            totals

        };


        state.materialReceipts.unshift(
            receipt
        );


        saveState();

        renderInventory();

        renderDashboard();

        renderMrnHistory();


        showMrnModal(receipt);


        mrnLines = [];

        document.getElementById(
            "mrnForm"
        ).reset();


        document.getElementById(
            "mrnDate"
        ).value = today();


        document.getElementById(
            "mrnNoDisplay"
        ).value =
            `MRN-${String(
                state.sequences.mrn
            ).padStart(4, "0")}`;


        renderMrnLines();

        calculateMrn();


        closeModal("mrnFormModal");


        showToast(
            `${mrnNumber} saved successfully.`
        );

    }


    function clearMrn() {

        mrnLines = [];

        document.getElementById(
            "mrnForm"
        )?.reset();


        document.getElementById(
            "mrnDate"
        ).value =
            today();


        document.getElementById(
            "mrnNoDisplay"
        ).value =
            `MRN-${String(
                state.sequences.mrn
            ).padStart(4, "0")}`;


        renderMrnLines();

        calculateMrn();

    }


    function renderMrnHistory() {

        const tbody =
            document.getElementById(
                "mrnHistoryBody"
            );


        if (!tbody) {
            return;
        }


        const search =
            (
                document.getElementById(
                    "mrnHistorySearch"
                )?.value || ""
            )
                .toLowerCase()
                .trim();


        const receipts =
            state.materialReceipts.filter(
                function (receipt) {

                    if (!search) {
                        return true;
                    }

                    return [

                        receipt.mrnNo,
                        receipt.vendorName,
                        receipt.vendorCode,
                        receipt.invoiceNo

                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(search);

                }
            );


        if (!receipts.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="empty-table">

                        No material receipts found.

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML =
            receipts.map(function (receipt) {

                return `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHtml(receipt.mrnNo)}
                            </strong>
                        </td>

                        <td>
                            ${formatDate(receipt.date)}
                        </td>

                        <td>
                            ${escapeHtml(
                                receipt.vendorName || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                receipt.invoiceNo || "-"
                            )}
                        </td>

                        <td>
                            ${receipt.lines.length}
                        </td>

                        <td>
                            ${money(
                                receipt.totals.netTotal
                            )}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="action-btn edit"
                                data-view-mrn="${escapeHtml(
                                    receipt.id
                                )}">
                                View
                            </button>

                        </td>

                    </tr>

                `;

            }).join("");

    }


    function showMrnModal(receipt) {

        const content =
            document.getElementById(
                "mrnContent"
            );


        content.innerHTML = `

            <div class="invoice-sheet">

                <div class="invoice-top">

                    <div class="invoice-company">

                        <strong>
                            ZIMDRA
                        </strong>

                        <span>
                            Dealer Management System
                        </span>

                        <span>
                            Material Receipt Note
                        </span>

                    </div>


                    <div class="invoice-meta">

                        <strong>
                            ${escapeHtml(
                                receipt.mrnNo
                            )}
                        </strong>

                        <span>
                            ${formatDate(
                                receipt.date
                            )}
                        </span>

                        <span>
                            R/T: ${escapeHtml(receipt.receiptType || "Invoice")}
                            ${
                                receipt.refNo
                                    ? ` · Ref: ${escapeHtml(receipt.refNo)}`
                                    : ""
                            }
                        </span>

                    </div>

                </div>


                <div class="invoice-customer">

                    <div class="invoice-info">

                        <span>
                            Vendor
                        </span>

                        <strong>
                            ${escapeHtml(
                                receipt.vendorName || "-"
                            )}
                            (${escapeHtml(receipt.vendorCode || "-")})
                        </strong>

                    </div>


                    <div class="invoice-info">

                        <span>
                            Invoice
                        </span>

                        <strong>
                            ${escapeHtml(
                                receipt.invoiceNo || "-"
                            )}
                            ${
                                receipt.invoiceDate
                                    ? ` (${formatDate(receipt.invoiceDate)})`
                                    : ""
                            }
                        </strong>

                    </div>


                    <div class="invoice-info">

                        <span>
                            Form No.
                        </span>

                        <strong>
                            ${escapeHtml(receipt.formNo || "-")}
                        </strong>

                    </div>


                    <div class="invoice-info">

                        <span>
                            Tax on F.P. / Vat-SrvTax on Hand
                        </span>

                        <strong>
                            ${escapeHtml(receipt.taxOnFp || "No")}
                            /
                            ${escapeHtml(receipt.vatSrvTaxOnHand || "No")}
                        </strong>

                    </div>

                </div>


                <div class="table-wrapper">

                    <table>

                        <thead>

                            <tr>
                                <th>Part No.</th>
                                <th>Description</th>
                                <th>Qty Inv/Rec/Rej</th>
                                <th>Rate</th>
                                <th>Rl. Rate</th>
                                <th>Total</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${
                                receipt.lines.map(
                                    function (line) {

                                        return `

                                            <tr>

                                                <td>
                                                    ${escapeHtml(
                                                        line.partNo
                                                    )}
                                                </td>

                                                <td>
                                                    ${escapeHtml(
                                                        line.description
                                                    )}
                                                </td>

                                                <td>
                                                    ${line.qtyInvoiced} / ${line.qtyReceived} / ${line.qtyRejected}
                                                </td>

                                                <td>
                                                    ${money(
                                                        line.rate
                                                    )}
                                                </td>

                                                <td>
                                                    ${money(
                                                        line.rlRate || 0
                                                    )}
                                                </td>

                                                <td>
                                                    ${money(
                                                        line.qtyReceived *
                                                        line.rate
                                                    )}
                                                </td>

                                            </tr>

                                        `;

                                    }
                                ).join("")
                            }

                        </tbody>

                    </table>

                </div>


                <div class="invoice-total totals-box">

                    <div>

                        <span>
                            Assessable Value
                        </span>

                        <strong>
                            ${money(
                                receipt.totals.assessable
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Discount
                        </span>

                        <strong>
                            ${money(
                                receipt.totals.discount
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            GST
                        </span>

                        <strong>
                            ${money(
                                receipt.totals.gst
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            VOR Surcharge / Svc Tax / E-Cess / Excise / Tax Surcharge
                        </span>

                        <strong>
                            ${money(
                                (receipt.totals.vorSurcharge || 0) +
                                (receipt.totals.serviceTax || 0) +
                                (receipt.totals.eCess || 0) +
                                (receipt.totals.excise || 0) +
                                (receipt.totals.taxSurcharge || 0)
                            )}
                        </strong>

                    </div>


                    <div class="grand-total">

                        <span>
                            Net Total
                        </span>

                        <strong>
                            ${money(
                                receipt.totals.netTotal
                            )}
                        </strong>

                    </div>

                </div>

            </div>

        `;


        openModal(
            "mrnModal"
        );

    }


    /* =========================================================
       COUNTER SALE / PARTY SALE
    ========================================================= */

    function isPartySale() {

        return (
            document.getElementById(
                "counterSaleType"
            )?.value === "Party"
        );

    }


    function amountInWords(value) {

        const ones = [
            "", "One", "Two", "Three", "Four", "Five",
            "Six", "Seven", "Eight", "Nine", "Ten",
            "Eleven", "Twelve", "Thirteen", "Fourteen",
            "Fifteen", "Sixteen", "Seventeen", "Eighteen",
            "Nineteen"
        ];

        const tens = [
            "", "", "Twenty", "Thirty", "Forty", "Fifty",
            "Sixty", "Seventy", "Eighty", "Ninety"
        ];

        function twoDigits(number) {

            if (number < 20) {

                return ones[number];

            }

            return (
                tens[Math.floor(number / 10)] +
                (
                    number % 10
                        ? " " + ones[number % 10]
                        : ""
                )
            ).trim();

        }

        function threeDigits(number) {

            if (number >= 100) {

                return (
                    ones[Math.floor(number / 100)] +
                    " Hundred" +
                    (
                        number % 100
                            ? " " + twoDigits(number % 100)
                            : ""
                    )
                );

            }

            return twoDigits(number);

        }

        let rupees = Math.floor(Number(value) || 0);

        const chetrum = Math.round(
            ((Number(value) || 0) - rupees) * 100
        );

        if (rupees === 0) {

            return "Zero Ngultrum Only";

        }

        const crore = Math.floor(rupees / 10000000);

        rupees %= 10000000;

        const lakh = Math.floor(rupees / 100000);

        rupees %= 100000;

        const thousand = Math.floor(rupees / 1000);

        rupees %= 1000;

        const hundred = rupees;

        let words = "";

        if (crore) {

            words += threeDigits(crore) + " Crore ";

        }

        if (lakh) {

            words += threeDigits(lakh) + " Lakh ";

        }

        if (thousand) {

            words += threeDigits(thousand) + " Thousand ";

        }

        if (hundred) {

            words += threeDigits(hundred) + " ";

        }

        words = words.trim() + " Ngultrum";

        if (chetrum) {

            words += " and " + twoDigits(chetrum) + " Chetrum";

        }

        return words + " Only";

    }


    function calculateSaleTotals(sale) {

        if (!sale) {

            return {

                subtotal: 0,
                gst: 0,
                discount: 0,
                grandTotal: 0

            };

        }


        const subtotal =
            sale.items.reduce(
                function (sum, item) {

                    return sum +
                        (
                            Number(item.qty) *
                            Number(item.price)
                        );

                },
                0
            );


        const discount =
            Math.min(
                Math.max(
                    Number(sale.discount) || 0,
                    0
                ),
                subtotal
            );


        const taxable =
            subtotal -
            discount;


        const gst =
            sale.items.reduce(
                function (sum, item) {

                    const lineSubtotal =
                        Number(item.qty) *
                        Number(item.price);


                    const proportion =
                        subtotal > 0
                            ? lineSubtotal / subtotal
                            : 0;


                    const allocatedDiscount =
                        discount *
                        proportion;


                    const taxableLine =
                        lineSubtotal -
                        allocatedDiscount;


                    return sum +
                        taxableLine *
                        (
                            Number(item.tax) /
                            100
                        );

                },
                0
            );


        const handling =
            Number(sale.handlingCharge) || 0;

        const surcharge =
            Number(sale.surcharge) || 0;

        const cashDiscount =
            Number(sale.cashDiscount) || 0;


        return {

            subtotal,

            gst,

            discount,

            handling,

            surcharge,

            cashDiscount,

            grandTotal:
                taxable +
                gst +
                handling +
                surcharge -
                cashDiscount

        };

    }


    function calculateCurrentCart() {

        const sale = {

            items: counterCart,

            discount:
                Number(
                    document.getElementById(
                        "counterDiscount"
                    )?.value
                ) || 0,

            handlingCharge:
                Number(
                    document.getElementById(
                        "counterHandlingCharge"
                    )?.value
                ) || 0,

            surcharge:
                Number(
                    document.getElementById(
                        "counterSurcharge"
                    )?.value
                ) || 0,

            cashDiscount:
                isPartySale()
                    ? Number(
                        document.getElementById(
                            "counterCashDiscount"
                        )?.value
                    ) || 0
                    : 0

        };


        return calculateSaleTotals(
            sale
        );

    }


    function renderCounterSearch() {

        const container =
            document.getElementById(
                "counterSearchResults"
            );


        if (!container) {
            return;
        }


        const search =
            (
                document.getElementById(
                    "counterSearch"
                )?.value || ""
            )
                .trim()
                .toLowerCase();


        if (!search) {

            container.innerHTML = `

                <div class="empty-state">
                    Search for a product to add it to the sale.
                </div>

            `;

            return;

        }


        const products =
            state.inventory.filter(
                function (product) {

                    return [

                        product.partNo,
                        product.name,
                        product.model

                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(search);

                }
            );


        if (!products.length) {

            container.innerHTML = `

                <div class="empty-state">
                    No products found.
                </div>

            `;

            return;

        }


        container.innerHTML =
            products.map(function (product) {

                return `

                    <div class="search-result-item">

                        <div class="search-result-info">

                            <strong>
                                ${escapeHtml(product.name)}
                            </strong>

                            <span>
                                ${escapeHtml(product.partNo)}
                                ·
                                ${escapeHtml(product.category)}
                                ·
                                Stock: ${product.stock}
                                ·
                                ${money(product.salePrice)}
                            </span>

                        </div>


                        <div class="search-result-action">

                            <button
                                type="button"
                                class="btn primary"
                                data-add-counter="${escapeHtml(
                                    product.id
                                )}"
                                ${
                                    product.stock <= 0
                                        ? "disabled"
                                        : ""
                                }>
                                Add
                            </button>

                        </div>

                    </div>

                `;

            }).join("");

    }


    function addToCounter(productId) {

        const product =
            state.inventory.find(function (item) {

                return item.id === productId;

            });


        if (!product) {
            return;
        }


        if (Number(product.stock) <= 0) {

            showToast(
                "This product is out of stock.",
                "error"
            );

            return;

        }


        const existing =
            counterCart.find(function (item) {

                return item.productId === product.id;

            });


        if (existing) {

            if (
                existing.qty >=
                product.stock
            ) {

                showToast(
                    "Cannot add more than available stock.",
                    "error"
                );

                return;

            }

            existing.qty++;

        } else {

            counterCart.push({

                productId: product.id,

                partNo: product.partNo,

                name: product.name,

                category: product.category,

                qty: 1,

                price: product.salePrice,

                tax: product.tax

            });

        }


        renderCounterCart();

    }


    function renderCounterCart() {

        const tbody =
            document.getElementById(
                "counterCartBody"
            );


        if (!tbody) {
            return;
        }


        const saleNumber =
            document.getElementById(
                "counterSaleNumber"
            );


        if (saleNumber) {

            const party = isPartySale();

            const nextNo =
                party
                    ? `CSIA-2026-${String(
                        state.sequences.partySale
                    ).padStart(4, "0")}`
                    : `CSCA-2026-${String(
                        state.sequences.sale
                    ).padStart(3, "0")}`;

            if (!saleNumber.textContent.includes("CSIA-") &&
                !saleNumber.textContent.includes("CSCA-")) {

                saleNumber.textContent = nextNo;

            }

        }


        const partyFields = document.getElementById(
            "partySaleFields"
        );

        if (partyFields) {

            partyFields.style.display =
                isPartySale() ? "" : "none";

        }


        if (!counterCart.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="empty-table">

                        Cart is empty.

                    </td>

                </tr>

            `;

        } else {

            tbody.innerHTML =
                counterCart.map(function (item) {

                    const total =
                        Number(item.qty) *
                        Number(item.price);


                    return `

                        <tr>

                            <td>

                                <strong>
                                    ${escapeHtml(item.name)}
                                </strong>

                                <div class="table-muted">
                                    ${escapeHtml(item.partNo)}
                                    ·
                                    ${escapeHtml(item.category || "-")}
                                </div>

                            </td>

                            <td>

                                <input
                                    class="issue-qty"
                                    type="number"
                                    min="1"
                                    value="${item.qty}"
                                    data-counter-qty="${escapeHtml(
                                        item.productId
                                    )}">

                            </td>

                            <td>
                                ${money(item.price)}
                            </td>

                            <td>
                                ${money(total)}
                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="action-btn delete"
                                    data-remove-counter="${escapeHtml(
                                        item.productId
                                    )}">
                                    Remove
                                </button>

                            </td>

                        </tr>

                    `;

                }).join("");

        }


        const totals =
            calculateCurrentCart();


        document.getElementById(
            "counterSubtotal"
        ).textContent =
            money(totals.subtotal);


        document.getElementById(
            "counterGST"
        ).textContent =
            money(totals.gst);


        document.getElementById(
            "counterDiscountTotal"
        ).textContent =
            money(totals.discount);


        document.getElementById(
            "counterGrandTotal"
        ).textContent =
            money(totals.grandTotal);


        const wordsField = document.getElementById(
            "counterAmountWords"
        );

        if (wordsField) {

            wordsField.value =
                amountInWords(totals.grandTotal);

        }

    }


    function clearCounterSale() {

        counterCart = [];

        document.getElementById(
            "counterCustomerName"
        ).value = "";


        document.getElementById(
            "counterCustomerPhone"
        ).value = "";


        document.getElementById(
            "counterDiscount"
        ).value = "0";


        [
            "counterVehicleNo",
            "counterModel",
            "counterCstNo",
            "counterTpnNo",
            "counterCustomerAddress"
        ].forEach(function (id) {

            const field = document.getElementById(id);

            if (field) {

                field.value = "";

            }

        });


        document.getElementById(
            "counterSaleNumber"
        ).textContent =
            "Counter Sale";


        renderCounterCart();

    }


    function sendSaleToCash() {

        if (!counterCart.length) {

            showToast(
                "Add at least one item to the sale.",
                "error"
            );

            return;

        }


        const party = isPartySale();


        const sale = {

            id:
                party
                    ? `CSIA-2026-${String(
                        state.sequences.partySale++
                    ).padStart(4, "0")}`
                    : `CSCA-2026-${String(
                        state.sequences.sale++
                    ).padStart(3, "0")}`,

            saleType:
                party ? "Party" : "Counter",

            customerName:
                document.getElementById(
                    "counterCustomerName"
                ).value.trim() ||
                "Walk-in Customer",

            customerPhone:
                document.getElementById(
                    "counterCustomerPhone"
                ).value.trim(),

            vehicleNo:
                document.getElementById(
                    "counterVehicleNo"
                )?.value.trim() || "",

            model:
                document.getElementById(
                    "counterModel"
                )?.value.trim() || "",

            cstNo:
                document.getElementById(
                    "counterCstNo"
                )?.value.trim() || "",

            code:
                document.getElementById(
                    "counterCode"
                )?.value || "Cash",

            billType:
                document.getElementById(
                    "counterType"
                )?.value || "Others",

            tpnNo:
                party
                    ? document.getElementById(
                        "counterTpnNo"
                    )?.value.trim() || ""
                    : "",

            customerAddress:
                party
                    ? document.getElementById(
                        "counterCustomerAddress"
                    )?.value.trim() || ""
                    : "",

            date: today(),

            discount:
                Number(
                    document.getElementById(
                        "counterDiscount"
                    ).value
                ) || 0,

            handlingCharge:
                Number(
                    document.getElementById(
                        "counterHandlingCharge"
                    )?.value
                ) || 0,

            surcharge:
                Number(
                    document.getElementById(
                        "counterSurcharge"
                    )?.value
                ) || 0,

            cashDiscount:
                party
                    ? Number(
                        document.getElementById(
                            "counterCashDiscount"
                        )?.value
                    ) || 0
                    : 0,

            status:
                "Pending Payment",

            items:
                JSON.parse(
                    JSON.stringify(counterCart)
                )

        };


        state.pendingSales.push(
            sale
        );


        saveState();

        clearCounterSale();

        renderPendingSales();

        renderDashboard();


        showToast(
            `${sale.id} sent to Cash Counter.`
        );

    }


    /* =========================================================
       QUOTATION
    ========================================================= */

    function calculateCurrentQuotation() {

        const quote = {

            items: quotationCart,

            discount:
                Number(
                    document.getElementById(
                        "quotationDiscount"
                    )?.value
                ) || 0,

            handlingCharge:
                Number(
                    document.getElementById(
                        "quotationHandlingCharge"
                    )?.value
                ) || 0

        };


        return calculateSaleTotals(
            quote
        );

    }


    function renderQuotationSearch() {

        const container =
            document.getElementById(
                "quotationSearchResults"
            );


        if (!container) {
            return;
        }


        const search =
            (
                document.getElementById(
                    "quotationSearch"
                )?.value || ""
            )
                .trim()
                .toLowerCase();


        if (!search) {

            container.innerHTML = `

                <div class="empty-state">
                    Search for a product to add it to the quotation.
                </div>

            `;

            return;

        }


        const products =
            state.inventory.filter(
                function (product) {

                    return [

                        product.partNo,
                        product.name,
                        product.model

                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(search);

                }
            );


        if (!products.length) {

            container.innerHTML = `

                <div class="empty-state">
                    No products found.
                </div>

            `;

            return;

        }


        container.innerHTML =
            products.map(function (product) {

                return `

                    <div class="search-result-item">

                        <div class="search-result-info">

                            <strong>
                                ${escapeHtml(product.name)}
                            </strong>

                            <span>
                                ${escapeHtml(product.partNo)}
                                ·
                                ${escapeHtml(product.category)}
                                ·
                                Stock: ${product.stock}
                                ·
                                ${money(product.salePrice)}
                            </span>

                        </div>


                        <div class="search-result-action">

                            <button
                                type="button"
                                class="btn primary"
                                data-add-quotation="${escapeHtml(
                                    product.id
                                )}">
                                Add
                            </button>

                        </div>

                    </div>

                `;

            }).join("");

    }


    function addToQuotation(productId) {

        /*
         * Quotations are non-binding estimates and do not
         * affect stock, so unlike Counter Sale there is no
         * stock check here - any product can be quoted even
         * if currently out of stock.
         */

        const product =
            state.inventory.find(function (item) {

                return item.id === productId;

            });


        if (!product) {
            return;
        }


        const existing =
            quotationCart.find(function (item) {

                return item.productId === product.id;

            });


        if (existing) {

            existing.qty++;

        } else {

            quotationCart.push({

                productId: product.id,

                partNo: product.partNo,

                name: product.name,

                category: product.category,

                qty: 1,

                price: product.salePrice,

                tax: product.tax

            });

        }


        renderQuotationCart();

    }


    function renderQuotationCart() {

        const tbody =
            document.getElementById(
                "quotationCartBody"
            );


        if (!tbody) {
            return;
        }


        const numberField =
            document.getElementById(
                "quotationNumber"
            );


        if (
            numberField &&
            !numberField.textContent.includes("QUO-")
        ) {

            numberField.textContent =
                `QUO-2026-${String(
                    state.sequences.quotation
                ).padStart(4, "0")}`;

        }


        if (!quotationCart.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="empty-table">

                        No items added.

                    </td>

                </tr>

            `;

        } else {

            tbody.innerHTML =
                quotationCart.map(function (item) {

                    const total =
                        Number(item.qty) *
                        Number(item.price);


                    return `

                        <tr>

                            <td>

                                <strong>
                                    ${escapeHtml(item.name)}
                                </strong>

                                <div class="table-muted">
                                    ${escapeHtml(item.partNo)}
                                    ·
                                    ${escapeHtml(item.category || "-")}
                                </div>

                            </td>

                            <td>

                                <input
                                    class="issue-qty"
                                    type="number"
                                    min="1"
                                    value="${item.qty}"
                                    data-quotation-qty="${escapeHtml(
                                        item.productId
                                    )}">

                            </td>

                            <td>
                                ${money(item.price)}
                            </td>

                            <td>
                                ${money(total)}
                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="action-btn delete"
                                    data-remove-quotation="${escapeHtml(
                                        item.productId
                                    )}">
                                    Remove
                                </button>

                            </td>

                        </tr>

                    `;

                }).join("");

        }


        const totals =
            calculateCurrentQuotation();


        document.getElementById(
            "quotationSubtotal"
        ).textContent =
            money(totals.subtotal);


        document.getElementById(
            "quotationGST"
        ).textContent =
            money(totals.gst);


        document.getElementById(
            "quotationDiscountTotal"
        ).textContent =
            money(totals.discount);


        document.getElementById(
            "quotationGrandTotal"
        ).textContent =
            money(totals.grandTotal);

    }


    function clearQuotation() {

        quotationCart = [];

        document.getElementById(
            "quotationCustomerName"
        ).value = "";


        document.getElementById(
            "quotationCustomerPhone"
        ).value = "";


        document.getElementById(
            "quotationVehicleNo"
        ).value = "";


        document.getElementById(
            "quotationValidUntil"
        ).value = "";


        document.getElementById(
            "quotationDiscount"
        ).value = "0";


        document.getElementById(
            "quotationHandlingCharge"
        ).value = "0";


        document.getElementById(
            "quotationNumber"
        ).textContent =
            "Quotation";


        renderQuotationCart();

    }


    function saveQuotation() {

        if (!quotationCart.length) {

            showToast(
                "Add at least one item to the quotation.",
                "error"
            );

            return;

        }


        const totals =
            calculateCurrentQuotation();


        const quotationNo =
            `QUO-2026-${String(
                state.sequences.quotation++
            ).padStart(4, "0")}`;


        const quotation = {

            id: uid("QUO"),

            quotationNo,

            date: today(),

            customerName:
                document.getElementById(
                    "quotationCustomerName"
                ).value.trim() ||
                "Walk-in Customer",

            customerPhone:
                document.getElementById(
                    "quotationCustomerPhone"
                ).value.trim(),

            vehicleNo:
                document.getElementById(
                    "quotationVehicleNo"
                ).value.trim(),

            validUntil:
                document.getElementById(
                    "quotationValidUntil"
                ).value,

            discount:
                Number(
                    document.getElementById(
                        "quotationDiscount"
                    ).value
                ) || 0,

            handlingCharge:
                Number(
                    document.getElementById(
                        "quotationHandlingCharge"
                    ).value
                ) || 0,

            items:
                JSON.parse(
                    JSON.stringify(quotationCart)
                ),

            totals,

            status: "Open"

        };


        state.quotations.unshift(
            quotation
        );


        saveState();

        clearQuotation();

        renderQuotationHistory();

        renderDashboard();


        showToast(
            `${quotationNo} saved successfully.`
        );

    }


    function renderQuotationHistory() {

        const tbody =
            document.getElementById(
                "quotationHistoryBody"
            );


        if (!tbody) {
            return;
        }


        const search =
            (
                document.getElementById(
                    "quotationHistorySearch"
                )?.value || ""
            )
                .toLowerCase()
                .trim();


        const quotations =
            state.quotations.filter(
                function (quotation) {

                    if (!search) {
                        return true;
                    }

                    return [

                        quotation.quotationNo,
                        quotation.customerName,
                        quotation.customerPhone,
                        quotation.vehicleNo

                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(search);

                }
            );


        if (!quotations.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        class="empty-table">

                        No quotations found.

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML =
            quotations.map(function (quotation) {

                return `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHtml(quotation.quotationNo)}
                            </strong>
                        </td>

                        <td>
                            ${formatDate(quotation.date)}
                        </td>

                        <td>
                            ${escapeHtml(
                                quotation.customerName || "-"
                            )}
                        </td>

                        <td>
                            ${
                                quotation.validUntil
                                    ? formatDate(quotation.validUntil)
                                    : "-"
                            }
                        </td>

                        <td>
                            ${quotation.items.length}
                        </td>

                        <td>
                            ${money(
                                quotation.totals.grandTotal
                            )}
                        </td>

                        <td>

                            <span class="badge ${
                                quotation.status === "Converted"
                                    ? "green"
                                    : "gray"
                            }">
                                ${escapeHtml(quotation.status)}
                            </span>

                        </td>

                        <td>

                            <div class="action-buttons">

                                <button
                                    type="button"
                                    class="action-btn edit"
                                    data-view-quotation="${escapeHtml(
                                        quotation.id
                                    )}">
                                    View
                                </button>

                                <button
                                    type="button"
                                    class="action-btn delete"
                                    data-delete-quotation="${escapeHtml(
                                        quotation.id
                                    )}">
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }).join("");

    }


    function viewQuotation(id) {

        const quotation =
            state.quotations.find(function (item) {

                return item.id === id;

            });


        if (!quotation) {
            return;
        }


        currentQuotationViewId = id;


        const content =
            document.getElementById(
                "quotationContent"
            );


        content.innerHTML = `

            <div class="invoice-sheet">

                <div class="invoice-top">

                    <div class="invoice-company">

                        <strong>
                            ZIMDRA
                        </strong>

                        <span>
                            Dealer Management System
                        </span>

                        <span>
                            Quotation (Non-Binding Estimate)
                        </span>

                    </div>


                    <div class="invoice-meta">

                        <strong>
                            ${escapeHtml(quotation.quotationNo)}
                        </strong>

                        <span>
                            ${formatDate(quotation.date)}
                        </span>

                        <span>
                            Valid Until:
                            ${
                                quotation.validUntil
                                    ? formatDate(quotation.validUntil)
                                    : "-"
                            }
                        </span>

                    </div>

                </div>


                <div class="invoice-customer">

                    <div class="invoice-info">

                        <span>
                            Customer
                        </span>

                        <strong>
                            ${escapeHtml(quotation.customerName)}
                        </strong>

                    </div>


                    <div class="invoice-info">

                        <span>
                            Phone / Vehicle No.
                        </span>

                        <strong>
                            ${escapeHtml(quotation.customerPhone || "-")}
                            /
                            ${escapeHtml(quotation.vehicleNo || "-")}
                        </strong>

                    </div>

                </div>


                <div class="table-wrapper">

                    <table>

                        <thead>

                            <tr>
                                <th>Part No.</th>
                                <th>Category</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Total</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${
                                quotation.items.map(
                                    function (item) {

                                        return `

                                            <tr>

                                                <td>
                                                    ${escapeHtml(item.partNo)}
                                                </td>

                                                <td>
                                                    ${escapeHtml(item.category || "-")}
                                                </td>

                                                <td>
                                                    ${escapeHtml(item.name)}
                                                </td>

                                                <td>
                                                    ${item.qty}
                                                </td>

                                                <td>
                                                    ${money(item.price)}
                                                </td>

                                                <td>
                                                    ${money(item.qty * item.price)}
                                                </td>

                                            </tr>

                                        `;

                                    }
                                ).join("")
                            }

                        </tbody>

                    </table>

                </div>


                <div class="invoice-total totals-box">

                    <div>

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ${money(quotation.totals.subtotal)}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Discount
                        </span>

                        <strong>
                            ${money(quotation.totals.discount)}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Handling Charge
                        </span>

                        <strong>
                            ${money(quotation.totals.handling || 0)}
                        </strong>

                    </div>


                    <div>

                        <span>
                            GST
                        </span>

                        <strong>
                            ${money(quotation.totals.gst)}
                        </strong>

                    </div>


                    <div class="grand-total">

                        <span>
                            Estimated Total
                        </span>

                        <strong>
                            ${money(quotation.totals.grandTotal)}
                        </strong>

                    </div>

                </div>


                <p class="field-help">
                    This is a non-binding price quotation and does
                    not reserve stock. Prices may change at the time
                    of sale.
                </p>

            </div>

        `;


        openModal(
            "quotationModal"
        );

    }


    function deleteQuotation(id) {

        const quotation =
            state.quotations.find(function (item) {

                return item.id === id;

            });


        if (!quotation) {
            return;
        }


        if (
            !confirm(
                `Delete quotation ${quotation.quotationNo}?`
            )
        ) {

            return;

        }


        state.quotations =
            state.quotations.filter(
                function (item) {

                    return item.id !== id;

                }
            );


        saveState();

        renderQuotationHistory();


        showToast(
            "Quotation deleted."
        );

    }


    function convertQuotationToCounterSale() {

        const quotation =
            state.quotations.find(function (item) {

                return item.id ===
                    currentQuotationViewId;

            });


        if (!quotation) {
            return;
        }


        /*
         * Converting copies the quoted lines into the Counter
         * Sale cart so the Storekeeper can check current stock,
         * adjust quantities and complete the sale. It does not
         * touch inventory by itself - Counter Sale / Cash Counter
         * still perform the real stock deduction on payment.
         */

        counterCart =
            quotation.items.map(function (item) {

                const product =
                    state.inventory.find(function (p) {

                        return p.id === item.productId;

                    });


                return {

                    productId: item.productId,

                    partNo: item.partNo,

                    name: item.name,

                    category: item.category,

                    qty:
                        product
                            ? Math.min(
                                item.qty,
                                Math.max(Number(product.stock), 0) || item.qty
                            )
                            : item.qty,

                    price: item.price,

                    tax: item.tax

                };

            });


        quotation.status = "Converted";

        saveState();


        closeModal("quotationModal");


        showTab("counter");


        document.getElementById(
            "counterCustomerName"
        ).value =
            quotation.customerName || "";


        document.getElementById(
            "counterCustomerPhone"
        ).value =
            quotation.customerPhone || "";


        const vehicleField =
            document.getElementById(
                "counterVehicleNo"
            );

        if (vehicleField) {

            vehicleField.value =
                quotation.vehicleNo || "";

        }


        document.getElementById(
            "counterDiscount"
        ).value =
            quotation.discount || 0;


        renderCounterCart();

        renderQuotationHistory();


        showToast(
            `${quotation.quotationNo} sent to Counter Sale.`
        );

    }


    /* =========================================================
       PARTY SALE (CREDIT / TRADER ACCOUNT)
    ========================================================= */

    function calculateCurrentParty() {

        const sale = {

            items: partyCart,

            discount:
                Number(
                    document.getElementById(
                        "partyDiscount"
                    )?.value
                ) || 0,

            handlingCharge:
                Number(
                    document.getElementById(
                        "partyHandlingCharge"
                    )?.value
                ) || 0,

            surcharge:
                Number(
                    document.getElementById(
                        "partySurcharge"
                    )?.value
                ) || 0,

            cashDiscount:
                Number(
                    document.getElementById(
                        "partyCashDiscount"
                    )?.value
                ) || 0

        };

        return calculateSaleTotals(sale);

    }


    function renderPartySearch() {

        const container =
            document.getElementById(
                "partySearchResults"
            );

        if (!container) {
            return;
        }

        const search =
            (
                document.getElementById(
                    "partySearch"
                )?.value || ""
            )
                .trim()
                .toLowerCase();

        if (!search) {

            container.innerHTML = `

                <div class="empty-state">
                    Search for a product to add it to the party sale.
                </div>

            `;

            return;

        }

        const products =
            state.inventory.filter(function (product) {

                return [

                    product.partNo,
                    product.name,
                    product.model

                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(search);

            });

        if (!products.length) {

            container.innerHTML = `

                <div class="empty-state">
                    No products found.
                </div>

            `;

            return;

        }

        container.innerHTML =
            products.map(function (product) {

                return `

                    <div class="search-result-item">

                        <div class="search-result-info">

                            <strong>
                                ${escapeHtml(product.name)}
                            </strong>

                            <span>
                                ${escapeHtml(product.partNo)}
                                ·
                                ${escapeHtml(product.category)}
                                ·
                                Stock: ${product.stock}
                                ·
                                ${money(product.salePrice)}
                            </span>

                        </div>

                        <div class="search-result-action">

                            <button
                                type="button"
                                class="btn primary"
                                data-add-party="${escapeHtml(product.id)}"
                                ${
                                    product.stock <= 0
                                        ? "disabled"
                                        : ""
                                }>
                                Add
                            </button>

                        </div>

                    </div>

                `;

            }).join("");

    }


    function addToParty(productId) {

        const product =
            state.inventory.find(function (item) {

                return item.id === productId;

            });

        if (!product) {
            return;
        }

        if (Number(product.stock) <= 0) {

            showToast(
                "This product is out of stock.",
                "error"
            );

            return;

        }

        const existing =
            partyCart.find(function (item) {

                return item.productId === product.id;

            });

        if (existing) {

            if (existing.qty >= product.stock) {

                showToast(
                    "Cannot add more than available stock.",
                    "error"
                );

                return;

            }

            existing.qty++;

        } else {

            partyCart.push({

                productId: product.id,

                partNo: product.partNo,

                name: product.name,

                category: product.category,

                qty: 1,

                price: product.salePrice,

                tax: product.tax

            });

        }

        renderPartyCart();

    }


    function renderPartyCart() {

        const tbody =
            document.getElementById(
                "partyCartBody"
            );

        if (!tbody) {
            return;
        }

        const saleNumber =
            document.getElementById(
                "partySaleNumber"
            );

        if (
            saleNumber &&
            !saleNumber.textContent.includes("CSIA-")
        ) {

            saleNumber.textContent =
                `CSIA-2026-${String(
                    state.sequences.partySale
                ).padStart(4, "0")}`;

        }

        if (!partyCart.length) {

            tbody.innerHTML = `

                <tr>
                    <td colspan="5" class="empty-table">
                        Cart is empty.
                    </td>
                </tr>

            `;

        } else {

            tbody.innerHTML =
                partyCart.map(function (item) {

                    const total =
                        Number(item.qty) *
                        Number(item.price);

                    return `

                        <tr>

                            <td>

                                <strong>
                                    ${escapeHtml(item.name)}
                                </strong>

                                <div class="table-muted">
                                    ${escapeHtml(item.partNo)}
                                    ·
                                    ${escapeHtml(item.category || "-")}
                                </div>

                            </td>

                            <td>

                                <input
                                    class="issue-qty"
                                    type="number"
                                    min="1"
                                    value="${item.qty}"
                                    data-party-qty="${escapeHtml(
                                        item.productId
                                    )}">

                            </td>

                            <td>
                                ${money(item.price)}
                            </td>

                            <td>
                                ${money(total)}
                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="action-btn delete"
                                    data-remove-party="${escapeHtml(
                                        item.productId
                                    )}">
                                    Remove
                                </button>

                            </td>

                        </tr>

                    `;

                }).join("");

        }

        const totals = calculateCurrentParty();

        document.getElementById(
            "partySubtotal"
        ).textContent = money(totals.subtotal);

        document.getElementById(
            "partyGST"
        ).textContent = money(totals.gst);

        document.getElementById(
            "partyDiscountTotal"
        ).textContent = money(totals.discount);

        document.getElementById(
            "partyGrandTotal"
        ).textContent = money(totals.grandTotal);

    }


    function clearPartySale() {

        partyCart = [];

        [
            "partyCustomerName",
            "partyCustomerPhone",
            "partyTpnNo",
            "partyCstNo",
            "partyCustomerAddress"
        ].forEach(function (id) {

            const field = document.getElementById(id);

            if (field) {

                field.value = "";

            }

        });

        [
            "partyDiscount",
            "partyCashDiscount",
            "partyHandlingCharge",
            "partySurcharge"
        ].forEach(function (id) {

            const field = document.getElementById(id);

            if (field) {

                field.value = "0";

            }

        });

        document.getElementById(
            "partySaleNumber"
        ).textContent = "Party Sale";

        renderPartyCart();

    }


    function sendPartySaleToCash() {

        if (!partyCart.length) {

            showToast(
                "Add at least one item to the party sale.",
                "error"
            );

            return;

        }

        const sale = {

            id:
                `CSIA-2026-${String(
                    state.sequences.partySale++
                ).padStart(4, "0")}`,

            saleType: "Party",

            customerName:
                document.getElementById(
                    "partyCustomerName"
                ).value.trim() ||
                "Trader Account",

            customerPhone:
                document.getElementById(
                    "partyCustomerPhone"
                ).value.trim(),

            vehicleNo: "",

            model: "",

            cstNo:
                document.getElementById(
                    "partyCstNo"
                ).value.trim(),

            code: "Credit",

            billType: "Trader",

            tpnNo:
                document.getElementById(
                    "partyTpnNo"
                ).value.trim(),

            customerAddress:
                document.getElementById(
                    "partyCustomerAddress"
                ).value.trim(),

            date: today(),

            discount:
                Number(
                    document.getElementById(
                        "partyDiscount"
                    ).value
                ) || 0,

            handlingCharge:
                Number(
                    document.getElementById(
                        "partyHandlingCharge"
                    ).value
                ) || 0,

            surcharge:
                Number(
                    document.getElementById(
                        "partySurcharge"
                    ).value
                ) || 0,

            cashDiscount:
                Number(
                    document.getElementById(
                        "partyCashDiscount"
                    ).value
                ) || 0,

            status: "Pending Payment",

            items:
                JSON.parse(
                    JSON.stringify(partyCart)
                )

        };

        state.pendingSales.push(sale);

        saveState();

        clearPartySale();

        renderPendingSales();

        renderDashboard();

        showToast(
            `${sale.id} sent to Cash Counter.`
        );

    }


    /* =========================================================
       CASH COUNTER
    ========================================================= */

    function renderPendingSales() {

        const container =
            document.getElementById(
                "pendingSalesList"
            );


        if (!container) {
            return;
        }


        if (!state.pendingSales.length) {

            container.innerHTML = `

                <div class="empty-state large">
                    No pending sales.
                </div>

            `;

            return;

        }


        container.innerHTML =
            state.pendingSales.map(function (sale) {

                const totals =
                    calculateSaleTotals(
                        sale
                    );


                return `

                    <div
                        class="pending-sale ${
                            selectedCashSaleId === sale.id
                                ? "selected"
                                : ""
                        }"
                        data-select-sale="${escapeHtml(
                            sale.id
                        )}">

                        <div class="pending-sale-title">

                            <strong>
                                ${escapeHtml(sale.id)}
                            </strong>

                            <span class="badge blue">
                                ${
                                    sale.saleType === "Party"
                                        ? "Party (Credit)"
                                        : "Pending"
                                }
                            </span>

                        </div>


                        <div class="pending-sale-meta">

                            <span>
                                ${escapeHtml(
                                    sale.customerName
                                )}
                            </span>

                            <strong>
                                ${money(
                                    totals.grandTotal
                                )}
                            </strong>

                        </div>

                    </div>

                `;

            }).join("");

    }


    function renderPaymentPanel() {

        const container =
            document.getElementById(
                "paymentPanel"
            );


        const title =
            document.getElementById(
                "cashSaleTitle"
            );


        if (!container || !title) {
            return;
        }


        const sale =
            state.pendingSales.find(function (item) {

                return item.id ===
                    selectedCashSaleId;

            });


        if (!sale) {

            title.textContent =
                "Select a Sale";


            container.innerHTML = `

                <div class="empty-state large">

                    <div class="empty-icon">
                        ৳
                    </div>

                    <strong>
                        Select a pending sale
                    </strong>

                    <span>
                        Choose a sale from the queue to complete payment.
                    </span>

                </div>

            `;

            return;

        }


        title.textContent =
            sale.id;


        const totals =
            calculateSaleTotals(
                sale
            );


        container.innerHTML = `

            <div class="payment-content">

                <div class="payment-summary">

                    <div class="payment-stat">

                        <span>
                            Customer
                        </span>

                        <strong>
                            ${escapeHtml(
                                sale.customerName
                            )}
                        </strong>

                    </div>


                    <div class="payment-stat">

                        <span>
                            Grand Total
                        </span>

                        <strong>
                            ${money(
                                totals.grandTotal
                            )}
                        </strong>

                    </div>


                    <div class="payment-stat">

                        <span>
                            Items
                        </span>

                        <strong>
                            ${sale.items.length}
                        </strong>

                    </div>

                </div>


                <div class="kicker">
                    PAYMENT METHOD
                </div>


                <div class="payment-methods">

                    ${[
                        "Cash",
                        "Bank",
                        "Cheque"
                    ].map(function (method) {

                        return `

                            <button
                                type="button"
                                class="payment-method ${
                                    selectedPaymentMethod === method
                                        ? "active"
                                        : ""
                                }"
                                data-payment-method="${method}">
                                ${method}
                            </button>

                        `;

                    }).join("")}

                </div>


                ${
                    selectedPaymentMethod === "Bank"
                        ? `
                            <div class="form-grid form-grid-4">

                                <div>
                                    <label>Bank</label>
                                    <select id="paymentBankName">${bankOptionsHtml(paymentBankName)}</select>
                                </div>

                                <div>
                                    <label>Journal No.</label>
                                    <input
                                        id="paymentJournalNo"
                                        type="text"
                                        placeholder="Bank journal / txn no."
                                        value="${escapeHtml(paymentJournalNo)}">
                                </div>

                                <div>
                                    <label>Remarks</label>
                                    <input
                                        id="paymentRemarks"
                                        type="text"
                                        placeholder="Optional"
                                        value="${escapeHtml(paymentRemarks)}">
                                </div>

                            </div>
                          `
                        : ""
                }

                ${
                    selectedPaymentMethod === "Cheque"
                        ? `
                            <div class="form-grid form-grid-4">

                                <div>
                                    <label>Cheque No.</label>
                                    <input
                                        id="paymentChequeNo"
                                        type="text"
                                        placeholder="Example: 0456789"
                                        value="${escapeHtml(paymentChequeNo)}">
                                </div>

                                <div>
                                    <label>Cheque Date</label>
                                    <input
                                        id="paymentChequeDate"
                                        type="date"
                                        value="${escapeHtml(paymentChequeDate)}">
                                </div>

                                <div>
                                    <label>Bank</label>
                                    <select id="paymentChequeBank">${bankOptionsHtml(paymentChequeBank)}</select>
                                </div>

                                <div>
                                    <label>Remarks</label>
                                    <input
                                        id="paymentChequeRemarks"
                                        type="text"
                                        placeholder="Optional"
                                        value="${escapeHtml(paymentChequeRemarks)}">
                                </div>

                            </div>
                          `
                        : ""
                }


                <div class="form-grid">

                    <div>

                        <label>
                            Amount Received
                        </label>

                        <input
                            id="cashAmountReceived"
                            type="number"
                            min="0"
                            step="0.01"
                            value="${totals.grandTotal}">

                    </div>


                    <div>

                        <label>
                            Change
                        </label>

                        <input
                            id="cashChange"
                            type="text"
                            readonly
                            value="${money(0)}">

                    </div>

                </div>


                <div class="change-box">

                    <span>
                        Amount Due
                    </span>

                    <strong>
                        ${money(
                            totals.grandTotal
                        )}
                    </strong>

                </div>


                <div class="panel-footer">

                    <button
                        type="button"
                        class="btn success"
                        id="completePaymentBtn">
                        Complete Payment
                    </button>

                </div>

            </div>

        `;


        updateCashChange();

    }


    function updateCashChange() {

        const sale =
            state.pendingSales.find(function (item) {

                return item.id ===
                    selectedCashSaleId;

            });


        if (!sale) {
            return;
        }


        const totals =
            calculateSaleTotals(
                sale
            );


        const received =
            Number(
                document.getElementById(
                    "cashAmountReceived"
                )?.value
            ) || 0;


        const change =
            Math.max(
                received -
                totals.grandTotal,
                0
            );


        const field =
            document.getElementById(
                "cashChange"
            );


        if (field) {

            field.value =
                money(change);

        }

    }


    function completePayment() {

        const sale =
            state.pendingSales.find(function (item) {

                return item.id ===
                    selectedCashSaleId;

            });


        if (!sale) {

            showToast(
                "Please select a sale.",
                "error"
            );

            return;

        }


        const totals =
            calculateSaleTotals(
                sale
            );


        const received =
            Number(
                document.getElementById(
                    "cashAmountReceived"
                ).value
            ) || 0;


        if (
            received <
            totals.grandTotal
        ) {

            showToast(
                "Amount received is less than the invoice total.",
                "error"
            );

            return;

        }


        if (
            selectedPaymentMethod === "Bank" &&
            !paymentJournalNo.trim()
        ) {

            showToast(
                "Enter the bank journal number.",
                "error"
            );

            return;

        }


        if (
            selectedPaymentMethod === "Cheque" &&
            !paymentChequeNo.trim()
        ) {

            showToast(
                "Enter the cheque number.",
                "error"
            );

            return;

        }


        const paymentDetails =
            selectedPaymentMethod === "Bank"
                ? {
                    bankName: paymentBankName,
                    journalNo: paymentJournalNo.trim(),
                    remarks: paymentRemarks.trim()
                }
                : selectedPaymentMethod === "Cheque"
                    ? {
                        chequeNo: paymentChequeNo.trim(),
                        chequeDate: paymentChequeDate,
                        chequeBank: paymentChequeBank,
                        remarks: paymentChequeRemarks.trim()
                    }
                    : {};


        for (const item of sale.items) {

            const product =
                state.inventory.find(
                    function (product) {

                        return product.id ===
                            item.productId;

                    }
                );


            if (!product) {

                showToast(
                    `${item.partNo} is missing from inventory.`,
                    "error"
                );

                return;

            }


            if (
                Number(product.stock) <
                Number(item.qty)
            ) {

                showToast(
                    `Insufficient stock for ${item.partNo}.`,
                    "error"
                );

                return;

            }

        }


        sale.items.forEach(function (item) {

            const product =
                state.inventory.find(
                    function (product) {

                        return product.id ===
                            item.productId;

                    }
                );


            product.stock -=
                Number(item.qty);

        });


        const invoiceNo =
            sale.saleType === "Party"
                ? sale.id
                : `INV-2026-${String(
                    state.sequences.invoice++
                ).padStart(4, "0")}`;


        const transactionNo =
            `TRX-2026-${String(
                state.sequences.transaction++
            ).padStart(4, "0")}`;


        const gatePassNo =
            `GP-2026-${String(
                state.sequences.gatePass++
            ).padStart(4, "0")}`;


        const transaction = {

            id: transactionNo,

            reference: invoiceNo,

            date: today(),

            customer:
                sale.customerName,

            type:
                sale.saleType === "Party"
                    ? "Party Sale"
                    : "Counter Sale",

            amount:
                totals.grandTotal,

            status: "Completed"

        };


        state.transactions.unshift(
            transaction
        );


        state.pendingSales =
            state.pendingSales.filter(
                function (item) {

                    return item.id !==
                        sale.id;

                }
            );


        state.sales.push({

            ...sale,

            invoiceNo,

            transactionNo,

            gatePassNo,

            paymentMethod:
                selectedPaymentMethod,

            paymentDetails,

            amountReceived:
                received,

            change:
                received -
                totals.grandTotal,

            status:
                "Paid"

        });


        const invoice = {

            invoiceNo,

            transactionNo,

            gatePassNo,

            saleType: sale.saleType || "Counter",

            date: today(),

            customer:
                sale.customerName,

            phone:
                sale.customerPhone,

            vehicleNo: sale.vehicleNo || "",

            model: sale.model || "",

            cstNo: sale.cstNo || "",

            tpnNo: sale.tpnNo || "",

            customerAddress: sale.customerAddress || "",

            items:
                JSON.parse(
                    JSON.stringify(
                        sale.items
                    )
                ),

            totals,

            paymentMethod:
                selectedPaymentMethod,

            paymentDetails,

            amountReceived:
                received,

            change:
                received -
                totals.grandTotal

        };


        state.lastInvoice =
            invoice;


        saveState();


        selectedCashSaleId =
            null;

        selectedPaymentMethod = "Cash";

        paymentJournalNo = "";

        paymentRemarks = "";

        paymentChequeNo = "";

        paymentChequeDate = "";

        paymentChequeRemarks = "";


        renderPendingSales();

        renderPaymentPanel();

        renderInventory();

        renderDashboard();

        renderTransactions();


        showInvoice(
            invoice
        );


        showToast(
            `${invoiceNo} generated successfully.`
        );

    }


    /* =========================================================
       INVOICE
    ========================================================= */

    function showInvoice(invoice) {

        const content =
            document.getElementById(
                "invoiceContent"
            );


        content.innerHTML = `

            <div class="invoice-sheet">

                <div class="invoice-top">

                    <div class="invoice-company">

                        <strong>
                            ZIMDRA
                        </strong>

                        <span>
                            Dealer Management System
                        </span>

                        <span>
                            ${
                                invoice.saleType === "Party"
                                    ? "Party Sale Tax Invoice"
                                    : "Counter Sale Tax Invoice"
                            }
                        </span>

                    </div>


                    <div class="invoice-meta">

                        <strong>
                            ${escapeHtml(
                                invoice.invoiceNo
                            )}
                        </strong>

                        <span>
                            ${formatDate(
                                invoice.date
                            )}
                        </span>

                        <span>
                            ${escapeHtml(invoice.paymentMethod)}
                        </span>

                    </div>

                </div>


                <div class="invoice-customer">

                    <div class="invoice-info">

                        <span>
                            Customer
                            ${
                                invoice.saleType === "Party"
                                    ? "(Trader)"
                                    : "(Others)"
                            }
                        </span>

                        <strong>
                            ${escapeHtml(
                                invoice.customer
                            )}
                        </strong>

                    </div>


                    <div class="invoice-info">

                        <span>
                            Phone
                        </span>

                        <strong>
                            ${escapeHtml(
                                invoice.phone || "-"
                            )}
                        </strong>

                    </div>


                    <div class="invoice-info">

                        <span>
                            Vehicle No. / Model
                        </span>

                        <strong>
                            ${escapeHtml(invoice.vehicleNo || "-")}
                            /
                            ${escapeHtml(invoice.model || "-")}
                        </strong>

                    </div>


                    <div class="invoice-info">

                        <span>
                            C.S.T. No.
                        </span>

                        <strong>
                            ${escapeHtml(invoice.cstNo || "-")}
                        </strong>

                    </div>

                    ${
                        invoice.paymentMethod === "Bank" && invoice.paymentDetails
                            ? `
                                <div class="invoice-info">
                                    <span>Bank / Journal No.</span>
                                    <strong>
                                        ${escapeHtml(invoice.paymentDetails.bankName || "-")}
                                        /
                                        ${escapeHtml(invoice.paymentDetails.journalNo || "-")}
                                    </strong>
                                </div>
                              `
                            : ""
                    }

                    ${
                        invoice.paymentMethod === "Cheque" && invoice.paymentDetails
                            ? `
                                <div class="invoice-info">
                                    <span>Cheque No. / Bank</span>
                                    <strong>
                                        ${escapeHtml(invoice.paymentDetails.chequeNo || "-")}
                                        /
                                        ${escapeHtml(invoice.paymentDetails.chequeBank || "-")}
                                    </strong>
                                </div>
                                <div class="invoice-info">
                                    <span>Cheque Date</span>
                                    <strong>
                                        ${
                                            invoice.paymentDetails.chequeDate
                                                ? formatDate(invoice.paymentDetails.chequeDate)
                                                : "-"
                                        }
                                    </strong>
                                </div>
                              `
                            : ""
                    }

                    ${
                        invoice.saleType === "Party"
                            ? `

                                <div class="invoice-info">

                                    <span>
                                        TPN No.
                                    </span>

                                    <strong>
                                        ${escapeHtml(invoice.tpnNo || "-")}
                                    </strong>

                                </div>


                                <div class="invoice-info">

                                    <span>
                                        Address
                                    </span>

                                    <strong>
                                        ${escapeHtml(invoice.customerAddress || "-")}
                                    </strong>

                                </div>

                              `
                            : ""
                    }

                </div>


                <div class="table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Part No.
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Product
                                </th>

                                <th>
                                    Qty
                                </th>

                                <th>
                                    Rate
                                </th>

                                <th>
                                    Tax %
                                </th>

                                <th>
                                    Total
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                                invoice.items.map(
                                    function (item) {

                                        return `

                                            <tr>

                                                <td>
                                                    ${escapeHtml(
                                                        item.partNo
                                                    )}
                                                </td>

                                                <td>
                                                    ${escapeHtml(
                                                        item.category || "-"
                                                    )}
                                                </td>

                                                <td>
                                                    ${escapeHtml(
                                                        item.name
                                                    )}
                                                </td>

                                                <td>
                                                    ${item.qty}
                                                </td>

                                                <td>
                                                    ${money(
                                                        item.price
                                                    )}
                                                </td>

                                                <td>
                                                    ${item.tax}%
                                                </td>

                                                <td>
                                                    ${money(
                                                        item.qty *
                                                        item.price
                                                    )}
                                                </td>

                                            </tr>

                                        `;

                                    }
                                ).join("")
                            }

                        </tbody>

                    </table>

                </div>


                <div class="invoice-total totals-box">

                    <div>

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ${money(
                                invoice.totals.subtotal
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Discount
                        </span>

                        <strong>
                            ${money(
                                invoice.totals.discount
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Handling Charge
                        </span>

                        <strong>
                            ${money(
                                invoice.totals.handling || 0
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Surcharge
                        </span>

                        <strong>
                            ${money(
                                invoice.totals.surcharge || 0
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            GST 5%
                        </span>

                        <strong>
                            ${money(
                                invoice.totals.gst
                            )}
                        </strong>

                    </div>

                    ${
                        invoice.saleType === "Party"
                            ? `
                                <div>

                                    <span>
                                        Cash Discount
                                    </span>

                                    <strong>
                                        ${money(invoice.totals.cashDiscount || 0)}
                                    </strong>

                                </div>
                              `
                            : ""
                    }


                    <div class="grand-total">

                        <span>
                            Please Pay This Amount
                        </span>

                        <strong>
                            ${money(
                                invoice.totals.grandTotal
                            )}
                        </strong>

                    </div>

                </div>


                <p class="field-help">
                    Amount in Words:
                    <strong>
                        ${escapeHtml(amountInWords(invoice.totals.grandTotal))}
                    </strong>
                </p>


                <p class="field-help">
                    Disclaimer: Spare parts can't be taken back.
                </p>


                <div class="job-parts-heading">

                    <div>

                        <div class="kicker">
                            GATE PASS
                        </div>

                        <h4>
                            ${escapeHtml(invoice.gatePassNo || "-")}
                        </h4>

                        <span>
                            Parts received in good condition.
                        </span>

                    </div>

                </div>


                <div class="invoice-customer">

                    <div class="invoice-info">

                        <span>
                            Customer Name / Vehicle No.
                        </span>

                        <strong>
                            ${escapeHtml(invoice.customer)}
                            /
                            ${escapeHtml(invoice.vehicleNo || "-")}
                        </strong>

                    </div>


                    <div class="invoice-info">

                        <span>
                            Total No. of Items / Qty
                        </span>

                        <strong>
                            ${invoice.items.length}
                            /
                            ${
                                invoice.items.reduce(
                                    function (sum, item) {

                                        return sum + Number(item.qty);

                                    },
                                    0
                                )
                            }
                        </strong>

                    </div>

                </div>

            </div>

        `;


        openModal(
            "invoiceModal"
        );

    }


    /* =========================================================
       TRANSACTIONS
    ========================================================= */

    function renderTransactions() {

        const tbody =
            document.getElementById(
                "transactionsTableBody"
            );


        if (!tbody) {
            return;
        }


        const search =
            (
                document.getElementById(
                    "transactionSearch"
                )?.value || ""
            )
                .trim()
                .toLowerCase();


        const transactions =
            state.transactions.filter(
                function (transaction) {

                    if (!search) {
                        return true;
                    }

                    return [

                        transaction.id,
                        transaction.reference,
                        transaction.customer,
                        transaction.type

                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(search);

                }
            );


        if (!transactions.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="empty-table">

                        No transactions found.

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML =
            transactions.map(function (transaction) {

                return `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    transaction.id
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(
                                transaction.reference
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                transaction.date
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                transaction.customer
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                transaction.type
                            )}
                        </td>

                        <td>
                            ${money(
                                transaction.amount
                            )}
                        </td>

                        <td>

                            <span class="badge green">
                                ${escapeHtml(
                                    transaction.status
                                )}
                            </span>

                        </td>

                    </tr>

                `;

            }).join("");

    }


    /* =========================================================
       BRANCH TRANSFER (INTER-BRANCH REQUISITION / MTN)
    ========================================================= */

    function otherBranch(branch) {

        return branch === "Thimphu"
            ? "Phuntsholing"
            : "Thimphu";

    }


    function renderTransferForm() {

        const branchSelect =
            document.getElementById(
                "transferMyBranch"
            );

        if (branchSelect && !branchSelect.value) {

            branchSelect.value = transferMyBranch;

        } else if (branchSelect) {

            transferMyBranch = branchSelect.value;

        }

        const supplyField =
            document.getElementById(
                "transferSupplyingBranch"
            );

        if (supplyField) {

            supplyField.value =
                otherBranch(transferMyBranch);

        }

        const noField =
            document.getElementById(
                "transferNoDisplay"
            );

        if (noField && !noField.value) {

            noField.value =
                `TRF-${String(
                    state.sequences.transfer
                ).padStart(4, "0")}`;

        }

        const dateField =
            document.getElementById(
                "transferDate"
            );

        if (dateField && !dateField.value) {

            dateField.value = today();

        }

        resetTransferPartPicker();

        renderTransferLinesTable();

    }


    /* ---------------------------------------------------------
       SEARCHABLE PART PICKER (BRANCH TRANSFER - REQUEST PART)

       Mirrors the Add Parts modal combobox: the Storekeeper types
       any part of a part number / product name / model / category
       and picks from parts currently at the supplying branch. The
       confirmed part number is stored in the hidden
       #transferPartSelect field so addTransferLine() reads it
       exactly as before.
    --------------------------------------------------------- */

    function transferAvailableParts() {

        const supplying =
            otherBranch(transferMyBranch);

        return state.inventory.filter(function (product) {

            return product.location === supplying;

        });

    }


    function resetTransferPartPicker() {

        const searchInput =
            document.getElementById(
                "transferPartSearch"
            );

        const selectField =
            document.getElementById(
                "transferPartSelect"
            );

        if (searchInput) {

            searchInput.value = "";

        }

        if (selectField) {

            selectField.value = "";

        }

        closeTransferPartSuggestions();

    }


    function renderTransferPartSuggestions(query) {

        const box =
            document.getElementById(
                "transferPartResults"
            );

        if (!box) {
            return;
        }

        const search =
            String(query || "")
                .trim()
                .toLowerCase();

        const supplying =
            otherBranch(transferMyBranch);

        transferPartFiltered =
            transferAvailableParts()
                .filter(function (product) {

                    if (!search) {
                        return true;
                    }

                    return [

                        product.partNo,
                        product.name,
                        product.model,
                        product.category

                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(search);

                })
                .slice(0, 50);

        transferPartActiveIndex =
            transferPartFiltered.length ? 0 : -1;

        if (!transferPartFiltered.length) {

            box.innerHTML = `

                <div class="part-search-empty">
                    No matching part at ${escapeHtml(supplying)}.
                </div>

            `;

        } else {

            box.innerHTML =
                transferPartFiltered.map(function (product, index) {

                    return `

                        <div
                            class="part-search-option ${
                                index === transferPartActiveIndex
                                    ? "active"
                                    : ""
                            }"
                            data-transfer-part-option="${escapeHtml(
                                product.partNo
                            )}">

                            <strong>
                                ${escapeHtml(product.partNo)}
                                -
                                ${escapeHtml(product.name)}
                            </strong>

                            <span>
                                ${escapeHtml(product.category)}
                                ·
                                Stock: ${product.stock} ${escapeHtml(product.unit)}
                                ·
                                ${escapeHtml(product.location)}
                            </span>

                        </div>

                    `;

                }).join("");

        }

        box.classList.add("open");

    }


    function closeTransferPartSuggestions() {

        document
            .getElementById(
                "transferPartResults"
            )
            ?.classList.remove("open");

        transferPartActiveIndex = -1;

    }


    function moveTransferPartActive(delta) {

        const box =
            document.getElementById(
                "transferPartResults"
            );

        if (!box || !transferPartFiltered.length) {
            return;
        }

        transferPartActiveIndex =
            (
                transferPartActiveIndex +
                delta +
                transferPartFiltered.length
            ) % transferPartFiltered.length;

        const options =
            box.querySelectorAll(
                "[data-transfer-part-option]"
            );

        options.forEach(function (option, index) {

            option.classList.toggle(
                "active",
                index === transferPartActiveIndex
            );

        });

        options[transferPartActiveIndex]
            ?.scrollIntoView({
                block: "nearest"
            });

    }


    function selectTransferPart(partNo) {

        const product = findProduct(partNo);

        if (!product) {
            return;
        }

        document.getElementById(
            "transferPartSelect"
        ).value = product.partNo;

        document.getElementById(
            "transferPartSearch"
        ).value =
            `${product.partNo} - ${product.name}`;

        closeTransferPartSuggestions();

        fillTransferAvailableStock(product.partNo);

    }


    function fillTransferAvailableStock(partNo) {

        const field =
            document.getElementById(
                "transferAvailableStock"
            );

        if (!field) {
            return;
        }

        const product = findProduct(partNo);

        field.value =
            product
                ? `${product.stock} ${product.unit} at ${product.location}`
                : "";

    }


    function addTransferLine() {

        const partNo =
            document.getElementById(
                "transferPartSelect"
            ).value;

        const qty =
            Number(
                document.getElementById(
                    "transferQty"
                ).value
            ) || 0;

        const description =
            document.getElementById(
                "transferDescription"
            ).value.trim();

        if (!partNo) {

            showToast(
                "Select a part available at the supplying branch.",
                "error"
            );

            return;

        }

        if (qty <= 0) {

            showToast(
                "Enter a valid quantity.",
                "error"
            );

            return;

        }

        const product = findProduct(partNo);

        if (product && qty > Number(product.stock)) {

            showToast(
                `Only ${product.stock} unit(s) available at ${product.location}.`,
                "error"
            );

            return;

        }

        transferLines.push({

            id: uid("TRF-LINE"),

            partNo,

            description:
                description ||
                product?.description ||
                product?.name ||
                "",

            qty

        });

        renderTransferLinesTable();

        document.getElementById(
            "transferQty"
        ).value = "1";

        document.getElementById(
            "transferDescription"
        ).value = "";

        resetTransferPartPicker();

        document.getElementById(
            "transferAvailableStock"
        ).value = "";

    }


    function renderTransferLinesTable() {

        const tbody =
            document.getElementById(
                "transferLinesBody"
            );

        if (!tbody) {
            return;
        }

        if (!transferLines.length) {

            tbody.innerHTML = `

                <tr>
                    <td colspan="4" class="empty-table">
                        No items added.
                    </td>
                </tr>

            `;

            return;

        }

        tbody.innerHTML =
            transferLines.map(function (line) {

                return `

                    <tr>

                        <td>
                            ${escapeHtml(line.partNo)}
                        </td>

                        <td>
                            ${escapeHtml(line.description || "-")}
                        </td>

                        <td>
                            ${line.qty}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="action-btn delete"
                                data-remove-transfer-line="${escapeHtml(
                                    line.id
                                )}">
                                Remove
                            </button>

                        </td>

                    </tr>

                `;

            }).join("");

    }


    function saveTransferRequisition(event) {

        event.preventDefault();

        if (!transferLines.length) {

            showToast(
                "Add at least one part to the requisition.",
                "error"
            );

            return;

        }

        const transferNo =
            `TRF-${String(
                state.sequences.transfer++
            ).padStart(4, "0")}`;

        const requisition = {

            id: uid("TRF"),

            transferNo,

            date:
                document.getElementById(
                    "transferDate"
                ).value || today(),

            fromBranch:
                otherBranch(transferMyBranch),

            toBranch: transferMyBranch,

            lines: JSON.parse(
                JSON.stringify(transferLines)
            ),

            status: "Requested"

        };

        state.branchTransfers.unshift(requisition);

        saveState();

        transferLines = [];

        document.getElementById(
            "transferNoDisplay"
        ).value =
            `TRF-${String(
                state.sequences.transfer
            ).padStart(4, "0")}`;

        document.getElementById(
            "transferDate"
        ).value = today();

        renderTransferLinesTable();

        renderTransferHistory();

        showToast(
            `${transferNo} raised — awaiting fulfilment from ${requisition.fromBranch}.`
        );

    }


    function clearTransferDraft() {

        transferLines = [];

        renderTransferLinesTable();

    }


    function markTransferReceived(id) {

        const requisition =
            state.branchTransfers.find(function (item) {

                return item.id === id;

            });

        if (!requisition || requisition.status === "Received") {
            return;
        }

        /*
         * This app tracks a single stock pool per part with one
         * "location" tag (there is no per-branch split). Marking a
         * transfer as received re-tags each requested part as now
         * being at the requesting branch. It does not duplicate
         * inventory rows, so a partial transfer still moves the
         * whole recorded stock figure — the same simplification the
         * rest of the app already makes for a product's location.
         */

        requisition.lines.forEach(function (line) {

            const product = findProduct(line.partNo);

            if (product) {

                product.location = requisition.toBranch;

            }

        });

        requisition.status = "Received";

        saveState();

        renderInventory();

        renderDashboard();

        renderTransferHistory();

        resetTransferPartPicker();

        showToast(
            `${requisition.transferNo} marked received at ${requisition.toBranch}.`
        );

    }


    function renderTransferHistory() {

        const tbody =
            document.getElementById(
                "transferHistoryBody"
            );

        if (!tbody) {
            return;
        }

        if (!state.branchTransfers.length) {

            tbody.innerHTML = `

                <tr>
                    <td colspan="7" class="empty-table">
                        No branch transfer requisitions yet.
                    </td>
                </tr>

            `;

            return;

        }

        tbody.innerHTML =
            state.branchTransfers.map(function (requisition) {

                return `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHtml(requisition.transferNo)}
                            </strong>
                        </td>

                        <td>
                            ${formatDate(requisition.date)}
                        </td>

                        <td>
                            ${escapeHtml(requisition.fromBranch)}
                        </td>

                        <td>
                            ${escapeHtml(requisition.toBranch)}
                        </td>

                        <td>
                            ${requisition.lines.length}
                        </td>

                        <td>

                            <span class="badge ${
                                requisition.status === "Received"
                                    ? "green"
                                    : "orange"
                            }">
                                ${escapeHtml(requisition.status)}
                            </span>

                        </td>

                        <td>

                            ${
                                requisition.status !== "Received"
                                    ? `
                                        <button
                                            type="button"
                                            class="action-btn edit"
                                            data-receive-transfer="${escapeHtml(
                                                requisition.id
                                            )}">
                                            Mark Received
                                        </button>
                                      `
                                    : ""
                            }

                        </td>

                    </tr>

                `;

            }).join("");

    }


    /* =========================================================
       EXCEL IMPORT
    ========================================================= */

    function normalizeHeader(value) {

        return String(value || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

    }


    function getExcelValue(row, aliases) {

        const keys =
            Object.keys(row);


        for (const alias of aliases) {

            const target =
                normalizeHeader(alias);


            const key =
                keys.find(function (item) {

                    return normalizeHeader(item) ===
                        target;

                });


            if (key !== undefined) {

                return row[key];

            }

        }


        return "";

    }


    function importExcel(file) {

        if (!window.XLSX) {

            showToast(
                "Excel library could not be loaded.",
                "error"
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload = function (event) {

            try {

                const workbook =
                    XLSX.read(
                        event.target.result,
                        {
                            type: "array"
                        }
                    );


                const sheet =
                    workbook.Sheets[
                        workbook.SheetNames[0]
                    ];


                const rows =
                    XLSX.utils.sheet_to_json(
                        sheet,
                        {
                            defval: ""
                        }
                    );


                if (!rows.length) {

                    showToast(
                        "The Excel file contains no data.",
                        "error"
                    );

                    return;

                }


                let imported = 0;


                rows.forEach(function (row) {

                    const partNo =
                        String(
                            getExcelValue(
                                row,
                                [
                                    "Part No",
                                    "Part Number",
                                    "Product Code",
                                    "PartNo"
                                ]
                            )
                        ).trim();


                    const name =
                        String(
                            getExcelValue(
                                row,
                                [
                                    "Product",
                                    "Product Name",
                                    "Name",
                                    "Description"
                                ]
                            )
                        ).trim();


                    if (!partNo || !name) {
                        return;
                    }


                    const category =
                        String(
                            getExcelValue(
                                row,
                                ["Category"]
                            ) ||
                            "Service Parts"
                        );


                    const unit =
                        String(
                            getExcelValue(
                                row,
                                ["Unit", "UOM"]
                            ) ||
                            "pcs"
                        );


                    const stock =
                        Number(
                            getExcelValue(
                                row,
                                [
                                    "Stock",
                                    "Qty",
                                    "Quantity"
                                ]
                            )
                        ) || 0;


                    const salePrice =
                        Number(
                            getExcelValue(
                                row,
                                [
                                    "Sale Price",
                                    "Price",
                                    "Selling Price"
                                ]
                            )
                        ) || 0;


                    const costPrice =
                        Number(
                            getExcelValue(
                                row,
                                [
                                    "Cost Price",
                                    "Cost"
                                ]
                            )
                        ) || 0;


                    const tax =
                        Number(
                            getExcelValue(
                                row,
                                [
                                    "GST",
                                    "Tax"
                                ]
                            )
                        ) || 7;


                    const reorderLevel =
                        Number(
                            getExcelValue(
                                row,
                                [
                                    "Reorder",
                                    "Reorder Level",
                                    "Min Stock"
                                ]
                            )
                        ) || 5;


                    const location =
                        String(
                            getExcelValue(
                                row,
                                ["Location"]
                            ) ||
                            "Thimphu"
                        );


                    const model =
                        String(
                            getExcelValue(
                                row,
                                ["Model"]
                            )
                        );


                    const existing =
                        findProduct(
                            partNo
                        );


                    if (existing) {

                        existing.name =
                            name;

                        existing.description =
                            String(
                                getExcelValue(
                                    row,
                                    ["Description"]
                                ) ||
                                existing.description ||
                                name
                            );

                        existing.category =
                            category;

                        existing.unit =
                            unit;

                        existing.stock =
                            stock;

                        existing.salePrice =
                            salePrice;

                        existing.costPrice =
                            costPrice;

                        existing.tax =
                            tax;

                        existing.reorderLevel =
                            reorderLevel;

                        existing.location =
                            location;

                        existing.model =
                            model;

                    } else {

                        state.inventory.push({

                            id: `PRD-${String(
                                state.sequences.product++
                            ).padStart(3, "0")}`,

                            partNo,

                            name,

                            description:
                                String(
                                    getExcelValue(
                                        row,
                                        ["Description"]
                                    ) ||
                                    name
                                ),

                            category,

                            serialNumber:
                                String(
                                    getExcelValue(
                                        row,
                                        ["Serial Number"]
                                    )
                                ),

                            model,

                            salePrice,

                            costPrice,

                            tax,

                            unit,

                            stock,

                            reorderLevel,

                            location,

                            image: "",

                            details: ""

                        });

                    }


                    imported++;

                });


                saveState();

                populateProductDropdowns();

                renderInventory();

                renderDashboard();


                showToast(
                    `${imported} product row(s) imported successfully.`
                );

            } catch (error) {

                console.error(error);

                showToast(
                    "Could not read the Excel file.",
                    "error"
                );

            }

        };


        reader.readAsArrayBuffer(
            file
        );

    }


    /* =========================================================
       EVENT BINDING
    ========================================================= */

    function bindEvents() {


        /* -----------------------------------------------------
           MAIN NAV
        ----------------------------------------------------- */

        document
            .querySelectorAll(
                ".nav-item[data-tab]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const tab =
                            button.dataset.tab;


                        if (
                            tab ===
                            "inventory"
                        ) {

                            showTab(
                                "inventory",
                                false
                            );

                            toggleInventoryNav();

                            return;

                        }


                        if (
                            tab ===
                            "quotation"
                        ) {

                            showTab(
                                "quotation",
                                true,
                                false
                            );

                            toggleQuotationNav();

                            return;

                        }


                        showTab(tab);

                    }
                );

            });


        /* -----------------------------------------------------
           DASHBOARD BUTTONS
        ----------------------------------------------------- */

        document
            .querySelectorAll(
                "[data-tab-button]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        showTab(
                            button.dataset.tabButton
                        );

                    }
                );

            });


        /* -----------------------------------------------------
           DASHBOARD JOB CLICK
        ----------------------------------------------------- */

        document.addEventListener(
            "click",
            function (event) {

                const item =
                    event.target.closest(
                        "[data-dashboard-job]"
                    );


                if (!item) {
                    return;
                }


                const jobId =
                    item.dataset.dashboardJob;


                showTab(
                    "workshop"
                );


                const input =
                    document.getElementById(
                        "jobCardSearch"
                    );


                if (input) {

                    input.value =
                        jobId;

                }


                const job =
                    findJobById(jobId);


                renderJobResult(
                    job,
                    document.getElementById(
                        "workshopResult"
                    )
                );

            }
        );


        /* -----------------------------------------------------
           WORKSHOP SEARCH
        ----------------------------------------------------- */

        document
            .getElementById(
                "searchJobBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    const input =
                        document.getElementById(
                            "jobCardSearch"
                        );


                    const job =
                        findJobById(
                            input.value
                        );


                    renderJobResult(
                        job,
                        document.getElementById(
                            "workshopResult"
                        )
                    );


                    if (job) {

                        showToast(
                            `${job.id} fetched successfully.`
                        );

                    }

                }
            );


        document
            .getElementById(
                "jobCardSearch"
            )
            ?.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        document
                            .getElementById(
                                "searchJobBtn"
                            )
                            .click();

                    }

                }
            );


        /* -----------------------------------------------------
           ADD PARTS (REQUISITION)
        ----------------------------------------------------- */

        document
            .getElementById(
                "addPartsBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    const section =
                        document.getElementById(
                            "requestedPartsSection"
                        );

                    const jobId =
                        section?.dataset.jobId ||
                        document.getElementById(
                            "jobCardSearch"
                        )?.value;

                    openAddPartsForm(jobId);

                }
            );


        /* -----------------------------------------------------
           ADD PARTS - SEARCHABLE PART PICKER
        ----------------------------------------------------- */

        document
            .getElementById(
                "addPartPartSearch"
            )
            ?.addEventListener(
                "input",
                function () {

                    /* typing invalidates the previous pick */

                    document.getElementById(
                        "addPartPartSelect"
                    ).value = "";

                    document.getElementById(
                        "addPartCurrentStock"
                    ).value = "";

                    renderAddPartSuggestions(
                        this.value
                    );

                }
            );


        document
            .getElementById(
                "addPartPartSearch"
            )
            ?.addEventListener(
                "focus",
                function () {

                    renderAddPartSuggestions(
                        document.getElementById(
                            "addPartPartSelect"
                        ).value
                            ? ""
                            : this.value
                    );

                }
            );


        document
            .getElementById(
                "addPartPartSearch"
            )
            ?.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "ArrowDown") {

                        event.preventDefault();

                        moveAddPartActive(1);

                    } else if (event.key === "ArrowUp") {

                        event.preventDefault();

                        moveAddPartActive(-1);

                    } else if (event.key === "Enter") {

                        if (
                            addPartActiveIndex >= 0 &&
                            addPartFiltered[addPartActiveIndex]
                        ) {

                            event.preventDefault();

                            selectAddPart(
                                addPartFiltered[
                                    addPartActiveIndex
                                ].partNo
                            );

                        }

                    } else if (event.key === "Escape") {

                        closeAddPartSuggestions();

                    }

                }
            );


        document.addEventListener(
            "click",
            function (event) {

                const option =
                    event.target.closest(
                        "[data-add-part-option]"
                    );

                if (option) {

                    selectAddPart(
                        option.dataset.addPartOption
                    );

                    return;

                }

                if (
                    !event.target.closest(
                        "#addPartPartSearchWrap"
                    )
                ) {

                    closeAddPartSuggestions();

                }

            }
        );


        document
            .getElementById(
                "addPartForm"
            )
            ?.addEventListener(
                "submit",
                saveAddPartLine
            );


        document
            .getElementById(
                "cancelAddPartBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    closeModal("addPartsModal");

                }
            );


        document
            .getElementById(
                "closeAddPartsBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    closeModal("addPartsModal");

                }
            );


        /* -----------------------------------------------------
           WORKSHOP ISSUE
        ----------------------------------------------------- */

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-issue-part]"
                    );


                if (!button) {
                    return;
                }


                const jobId =
                    button.dataset.jobId;


                const partNo =
                    button.dataset.issuePart;


                const input =
                    document.querySelector(
                        `[data-issue-qty="${CSS.escape(
                            partNo
                        )}"]`
                    );


                const qty =
                    Number(
                        input?.value
                    ) || 0;


                issueJobPart(
                    jobId,
                    partNo,
                    qty
                );

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-issue-all]"
                    );


                if (!button) {
                    return;
                }


                issueAllParts(
                    button.dataset.issueAll
                );

            }
        );


        /* -----------------------------------------------------
           INVENTORY
        ----------------------------------------------------- */

        document
            .getElementById(
                "inventorySearch"
            )
            ?.addEventListener(
                "input",
                renderInventory
            );


        document
            .getElementById(
                "inventoryLocationFilter"
            )
            ?.addEventListener(
                "change",
                renderInventory
            );


        document
            .getElementById(
                "inventoryStockFilter"
            )
            ?.addEventListener(
                "change",
                renderInventory
            );


        document
            .getElementById(
                "addProductTopBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    openAddProductModal();

                }
            );


        document
            .getElementById(
                "addProductForm"
            )
            ?.addEventListener(
                "submit",
                saveProduct
            );


        document.addEventListener(
            "click",
            function (event) {

                const editButton =
                    event.target.closest(
                        "[data-edit-product]"
                    );


                if (
                    editButton
                ) {

                    openAddProductModal(
                        editButton.dataset.editProduct
                    );

                }

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                const deleteButton =
                    event.target.closest(
                        "[data-delete-product]"
                    );


                if (!deleteButton) {
                    return;
                }


                const product =
                    state.inventory.find(
                        function (item) {

                            return item.id ===
                                deleteButton.dataset.deleteProduct;

                        }
                    );


                if (!product) {
                    return;
                }


                if (
                    !confirm(
                        `Delete ${product.name}?`
                    )
                ) {

                    return;

                }


                state.inventory =
                    state.inventory.filter(
                        function (item) {

                            return item.id !==
                                product.id;

                        }
                    );


                saveState();

                populateProductDropdowns();

                renderInventory();

                renderDashboard();


                showToast(
                    "Product deleted."
                );

            }
        );


        /* -----------------------------------------------------
           INVENTORY SUBMENU
        ----------------------------------------------------- */

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-inventory-action]"
                    );


                if (!button) {
                    return;
                }


                showTab(
                    "inventory",
                    false
                );


                const action =
                    button.dataset.inventoryAction;


                if (
                    action ===
                    "add-product"
                ) {

                    openAddProductModal();

                    return;

                }


                openInventoryManager(
                    action
                );

            }
        );


        /* -----------------------------------------------------
           QUOTATION SUBMENU
        ----------------------------------------------------- */

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-quotation-nav-action]"
                    );


                if (!button) {
                    return;
                }


                showTab(
                    "quotation",
                    true,
                    false
                );


                const action =
                    button.dataset.quotationNavAction;


                if (
                    action ===
                    "add-quotation"
                ) {

                    clearQuotation();

                    document
                        .getElementById(
                            "quotationSearch"
                        )
                        ?.focus();

                    return;

                }


                /*
                 * "manage-quotation" - the tab is already
                 * showing, so just draw attention to the
                 * Quotations history table below the builder.
                 */

                document
                    .getElementById(
                        "quotationHistorySearch"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

            }
        );


        /* -----------------------------------------------------
           QUOTATION
        ----------------------------------------------------- */

        document
            .getElementById(
                "quotationSearch"
            )
            ?.addEventListener(
                "input",
                renderQuotationSearch
            );


        [
            "quotationDiscount",
            "quotationHandlingCharge"
        ].forEach(function (id) {

            document
                .getElementById(id)
                ?.addEventListener(
                    "input",
                    renderQuotationCart
                );

        });


        document
            .getElementById(
                "clearQuotationBtn"
            )
            ?.addEventListener(
                "click",
                clearQuotation
            );


        document
            .getElementById(
                "saveQuotationBtn"
            )
            ?.addEventListener(
                "click",
                saveQuotation
            );


        document
            .getElementById(
                "quotationHistorySearch"
            )
            ?.addEventListener(
                "input",
                renderQuotationHistory
            );


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-add-quotation]"
                    );


                if (!button) {
                    return;
                }


                addToQuotation(
                    button.dataset.addQuotation
                );

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-remove-quotation]"
                    );


                if (!button) {
                    return;
                }


                quotationCart =
                    quotationCart.filter(
                        function (item) {

                            return item.productId !==
                                button.dataset.removeQuotation;

                        }
                    );


                renderQuotationCart();

            }
        );


        document.addEventListener(
            "change",
            function (event) {

                const input =
                    event.target.closest(
                        "[data-quotation-qty]"
                    );


                if (!input) {
                    return;
                }


                const item =
                    quotationCart.find(
                        function (cartItem) {

                            return cartItem.productId ===
                                input.dataset.quotationQty;

                        }
                    );


                if (!item) {
                    return;
                }


                const qty =
                    Math.max(
                        1,
                        Number(input.value) || 1
                    );


                item.qty = qty;

                input.value = qty;

                renderQuotationCart();

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-view-quotation]"
                    );


                if (!button) {
                    return;
                }


                viewQuotation(
                    button.dataset.viewQuotation
                );

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-delete-quotation]"
                    );


                if (!button) {
                    return;
                }


                deleteQuotation(
                    button.dataset.deleteQuotation
                );

            }
        );


        document
            .getElementById(
                "closeQuotationBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    closeModal("quotationModal");

                }
            );


        document
            .getElementById(
                "closeQuotationFooterBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    closeModal("quotationModal");

                }
            );


        document
            .getElementById(
                "convertQuotationBtn"
            )
            ?.addEventListener(
                "click",
                convertQuotationToCounterSale
            );


        document
            .getElementById(
                "printQuotationBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    window.print();

                }
            );


        /* -----------------------------------------------------
           PARTY SALE
        ----------------------------------------------------- */

        document
            .getElementById("partySearch")
            ?.addEventListener(
                "input",
                renderPartySearch
            );

        [
            "partyDiscount",
            "partyCashDiscount",
            "partyHandlingCharge",
            "partySurcharge"
        ].forEach(function (id) {

            document
                .getElementById(id)
                ?.addEventListener(
                    "input",
                    renderPartyCart
                );

        });

        document
            .getElementById("clearPartySaleBtn")
            ?.addEventListener(
                "click",
                clearPartySale
            );

        document
            .getElementById("sendPartySaleToCashBtn")
            ?.addEventListener(
                "click",
                sendPartySaleToCash
            );

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-add-party]"
                    );

                if (!button) {
                    return;
                }

                addToParty(
                    button.dataset.addParty
                );

                renderPartySearch();

            }
        );

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-remove-party]"
                    );

                if (!button) {
                    return;
                }

                partyCart =
                    partyCart.filter(function (item) {

                        return item.productId !==
                            button.dataset.removeParty;

                    });

                renderPartyCart();

            }
        );

        document.addEventListener(
            "change",
            function (event) {

                const input =
                    event.target.closest(
                        "[data-party-qty]"
                    );

                if (!input) {
                    return;
                }

                const item =
                    partyCart.find(function (cartItem) {

                        return cartItem.productId ===
                            input.dataset.partyQty;

                    });

                if (!item) {
                    return;
                }

                const product =
                    state.inventory.find(function (product) {

                        return product.id === item.productId;

                    });

                let qty = Number(input.value) || 1;

                qty =
                    Math.max(
                        1,
                        Math.min(qty, Number(product.stock))
                    );

                item.qty = qty;

                input.value = qty;

                renderPartyCart();

            }
        );


        /* -----------------------------------------------------
           BRANCH TRANSFER
        ----------------------------------------------------- */

        document
            .getElementById("transferMyBranch")
            ?.addEventListener(
                "change",
                function () {

                    transferMyBranch = this.value;

                    renderTransferForm();

                }
            );

        document
            .getElementById("transferPartSearch")
            ?.addEventListener(
                "input",
                function () {

                    document.getElementById(
                        "transferPartSelect"
                    ).value = "";

                    document.getElementById(
                        "transferAvailableStock"
                    ).value = "";

                    renderTransferPartSuggestions(
                        this.value
                    );

                }
            );

        document
            .getElementById("transferPartSearch")
            ?.addEventListener(
                "focus",
                function () {

                    renderTransferPartSuggestions(
                        document.getElementById(
                            "transferPartSelect"
                        ).value
                            ? ""
                            : this.value
                    );

                }
            );

        document
            .getElementById("transferPartSearch")
            ?.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "ArrowDown") {

                        event.preventDefault();

                        moveTransferPartActive(1);

                    } else if (event.key === "ArrowUp") {

                        event.preventDefault();

                        moveTransferPartActive(-1);

                    } else if (event.key === "Enter") {

                        if (
                            transferPartActiveIndex >= 0 &&
                            transferPartFiltered[transferPartActiveIndex]
                        ) {

                            event.preventDefault();

                            selectTransferPart(
                                transferPartFiltered[
                                    transferPartActiveIndex
                                ].partNo
                            );

                        }

                    } else if (event.key === "Escape") {

                        closeTransferPartSuggestions();

                    }

                }
            );

        document.addEventListener(
            "click",
            function (event) {

                const option =
                    event.target.closest(
                        "[data-transfer-part-option]"
                    );

                if (option) {

                    selectTransferPart(
                        option.dataset.transferPartOption
                    );

                    return;

                }

                if (
                    !event.target.closest(
                        "#transferPartSearchWrap"
                    )
                ) {

                    closeTransferPartSuggestions();

                }

            }
        );

        document
            .getElementById("addTransferLineBtn")
            ?.addEventListener(
                "click",
                addTransferLine
            );

        document
            .getElementById("transferForm")
            ?.addEventListener(
                "submit",
                saveTransferRequisition
            );

        document
            .getElementById("clearTransferBtn")
            ?.addEventListener(
                "click",
                clearTransferDraft
            );

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-remove-transfer-line]"
                    );

                if (!button) {
                    return;
                }

                transferLines =
                    transferLines.filter(function (line) {

                        return line.id !==
                            button.dataset.removeTransferLine;

                    });

                renderTransferLinesTable();

            }
        );

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-receive-transfer]"
                    );

                if (!button) {
                    return;
                }

                markTransferReceived(
                    button.dataset.receiveTransfer
                );

            }
        );


        /* -----------------------------------------------------
           MANAGEMENT ACTIONS
        ----------------------------------------------------- */

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-manager-delete-category]"
                    );


                if (!button) {
                    return;
                }


                const category =
                    button.dataset.managerDeleteCategory;


                state.categories =
                    state.categories.filter(
                        function (item) {

                            return item !==
                                category;

                        }
                    );


                saveState();

                populateProductDropdowns();

                openInventoryManager(
                    "manage-category"
                );


                showToast(
                    "Category removed."
                );

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-manager-delete-unit]"
                    );


                if (!button) {
                    return;
                }


                const unit =
                    button.dataset.managerDeleteUnit;


                state.units =
                    state.units.filter(
                        function (item) {

                            return item !==
                                unit;

                        }
                    );


                saveState();

                populateProductDropdowns();

                openInventoryManager(
                    "units"
                );


                showToast(
                    "Unit removed."
                );

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-manager-edit-product]"
                    );


                if (!button) {
                    return;
                }


                closeModal(
                    "inventoryManagerModal"
                );


                openAddProductModal(
                    button.dataset.managerEditProduct
                );

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-delete-group-price]"
                    );


                if (!button) {
                    return;
                }


                const index =
                    Number(
                        button.dataset.deleteGroupPrice
                    );


                state.groupPrices.splice(
                    index,
                    1
                );


                saveState();

                openInventoryManager(
                    "group-pricing"
                );

            }
        );


        /* -----------------------------------------------------
           EXCEL
        ----------------------------------------------------- */

        document
            .getElementById(
                "importExcelBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    document
                        .getElementById(
                            "excelFileInput"
                        )
                        .click();

                }
            );


        document
            .getElementById(
                "excelFileInput"
            )
            ?.addEventListener(
                "change",
                function (event) {

                    const file =
                        event.target.files[0];


                    if (file) {

                        importExcel(
                            file
                        );

                    }


                    event.target.value = "";

                }
            );


        /* -----------------------------------------------------
           PRODUCT IMAGE
        ----------------------------------------------------- */

        document
            .getElementById(
                "productImage"
            )
            ?.addEventListener(
                "change",
                function (event) {

                    const file =
                        event.target.files[0];


                    if (!file) {
                        return;
                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        function () {

                            const preview =
                                document.getElementById(
                                    "productImagePreview"
                                );


                            preview.src =
                                reader.result;


                            preview.classList.add(
                                "visible"
                            );

                        };


                    reader.readAsDataURL(
                        file
                    );

                }
            );


        /* -----------------------------------------------------
           MRN
        ----------------------------------------------------- */

        document
            .getElementById(
                "mrnProductSelect"
            )
            ?.addEventListener(
                "change",
                function () {

                    fillMrnProduct(
                        this.value
                    );

                }
            );


        document
            .getElementById(
                "addMrnLineBtn"
            )
            ?.addEventListener(
                "click",
                addMrnLine
            );


        document
            .getElementById(
                "mrnForm"
            )
            ?.addEventListener(
                "submit",
                saveMrn
            );


        document
            .getElementById(
                "clearMrnBtn"
            )
            ?.addEventListener(
                "click",
                clearMrn
            );


        document
            .getElementById(
                "newMrnBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    initializeMrn();

                    openModal("mrnFormModal");

                }
            );


        document
            .getElementById(
                "cancelMrnFormBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    clearMrn();

                    closeModal("mrnFormModal");

                }
            );


        document
            .getElementById(
                "closeMrnFormBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    closeModal("mrnFormModal");

                }
            );


        document
            .getElementById(
                "mrnHistorySearch"
            )
            ?.addEventListener(
                "input",
                renderMrnHistory
            );


        [
            "mrnDiscountA",
            "mrnDiscountB",
            "mrnDiscountC",
            "mrnCashDiscount",
            "mrnHandlingCharge",
            "mrnVorSurcharge",
            "mrnServiceTax",
            "mrnECess",
            "mrnExcise",
            "mrnTaxSurcharge"
        ].forEach(function (id) {

            document
                .getElementById(id)
                ?.addEventListener(
                    "input",
                    calculateMrn
                );

        });


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-remove-mrn-line]"
                    );


                if (!button) {
                    return;
                }


                mrnLines =
                    mrnLines.filter(
                        function (line) {

                            return line.id !==
                                button.dataset.removeMrnLine;

                        }
                    );


                renderMrnLines();

                calculateMrn();

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-view-mrn]"
                    );


                if (!button) {
                    return;
                }


                const receipt =
                    state.materialReceipts.find(
                        function (item) {

                            return item.id ===
                                button.dataset.viewMrn;

                        }
                    );


                if (receipt) {

                    showMrnModal(
                        receipt
                    );

                }

            }
        );


        /* -----------------------------------------------------
           COUNTER
        ----------------------------------------------------- */

        document
            .getElementById(
                "counterSearch"
            )
            ?.addEventListener(
                "input",
                renderCounterSearch
            );


        document
            .getElementById(
                "counterDiscount"
            )
            ?.addEventListener(
                "input",
                renderCounterCart
            );


        [
            "counterHandlingCharge",
            "counterSurcharge",
            "counterCashDiscount"
        ].forEach(function (id) {

            document
                .getElementById(id)
                ?.addEventListener(
                    "input",
                    renderCounterCart
                );

        });


        document
            .getElementById(
                "counterSaleType"
            )
            ?.addEventListener(
                "change",
                function () {

                    document.getElementById(
                        "counterSaleNumber"
                    ).textContent = "Counter Sale";

                    renderCounterCart();

                }
            );


        document
            .getElementById(
                "clearSaleBtn"
            )
            ?.addEventListener(
                "click",
                clearCounterSale
            );


        document
            .getElementById(
                "sendSaleToCashBtn"
            )
            ?.addEventListener(
                "click",
                sendSaleToCash
            );


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-add-counter]"
                    );


                if (!button) {
                    return;
                }


                addToCounter(
                    button.dataset.addCounter
                );


                renderCounterSearch();

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-remove-counter]"
                    );


                if (!button) {
                    return;
                }


                counterCart =
                    counterCart.filter(
                        function (item) {

                            return item.productId !==
                                button.dataset.removeCounter;

                        }
                    );


                renderCounterCart();

            }
        );


        document.addEventListener(
            "change",
            function (event) {

                const input =
                    event.target.closest(
                        "[data-counter-qty]"
                    );


                if (!input) {
                    return;
                }


                const item =
                    counterCart.find(
                        function (cartItem) {

                            return cartItem.productId ===
                                input.dataset.counterQty;

                        }
                    );


                if (!item) {
                    return;
                }


                const product =
                    state.inventory.find(
                        function (product) {

                            return product.id ===
                                item.productId;

                        }
                    );


                let qty =
                    Number(input.value) || 1;


                qty =
                    Math.max(
                        1,
                        Math.min(
                            qty,
                            Number(product.stock)
                        )
                    );


                item.qty = qty;

                input.value = qty;

                renderCounterCart();

            }
        );


        /* -----------------------------------------------------
           CASH
        ----------------------------------------------------- */

        document.addEventListener(
            "click",
            function (event) {

                const item =
                    event.target.closest(
                        "[data-select-sale]"
                    );


                if (!item) {
                    return;
                }


                selectedCashSaleId =
                    item.dataset.selectSale;


                renderPendingSales();

                renderPaymentPanel();

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-payment-method]"
                    );


                if (!button) {
                    return;
                }


                selectedPaymentMethod =
                    button.dataset.paymentMethod;


                renderPaymentPanel();

            }
        );


        document.addEventListener(
            "input",
            function (event) {

                if (
                    event.target.id ===
                    "cashAmountReceived"
                ) {

                    updateCashChange();

                }

                if (event.target.id === "paymentJournalNo") {

                    paymentJournalNo = event.target.value;

                }

                if (event.target.id === "paymentRemarks") {

                    paymentRemarks = event.target.value;

                }

                if (event.target.id === "paymentChequeNo") {

                    paymentChequeNo = event.target.value;

                }

                if (event.target.id === "paymentChequeDate") {

                    paymentChequeDate = event.target.value;

                }

                if (event.target.id === "paymentChequeRemarks") {

                    paymentChequeRemarks = event.target.value;

                }

            }
        );


        document.addEventListener(
            "change",
            function (event) {

                if (event.target.id === "paymentBankName") {

                    paymentBankName = event.target.value;

                }

                if (event.target.id === "paymentChequeBank") {

                    paymentChequeBank = event.target.value;

                }

                if (event.target.id === "paymentChequeDate") {

                    paymentChequeDate = event.target.value;

                }

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.id ===
                    "completePaymentBtn"
                ) {

                    completePayment();

                }

            }
        );


        /* -----------------------------------------------------
           LOGOUT
        ----------------------------------------------------- */

        document
            .getElementById(
                "logoutBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    if (
                        !confirm(
                            "Log out of Zimdra DMS?"
                        )
                    ) {

                        return;

                    }

                    showToast(
                        "Logged out."
                    );

                    setTimeout(function () {

                        window.location.reload();

                    }, 400);

                }
            );


        /* -----------------------------------------------------
           TRANSACTIONS
        ----------------------------------------------------- */

        document
            .getElementById(
                "transactionSearch"
            )
            ?.addEventListener(
                "input",
                renderTransactions
            );


        /* -----------------------------------------------------
           MODALS
        ----------------------------------------------------- */

        document
            .getElementById(
                "closeAddProductBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    closeModal(
                        "addProductModal"
                    );

                }
            );


        document
            .getElementById(
                "cancelAddProductBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    closeModal(
                        "addProductModal"
                    );

                }
            );


        document
            .getElementById(
                "closeInventoryManagerBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    closeModal(
                        "inventoryManagerModal"
                    );

                }
            );


        document
            .getElementById(
                "closeInvoiceBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    closeModal(
                        "invoiceModal"
                    );

                }
            );


        document
            .getElementById(
                "closeInvoiceFooterBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    closeModal(
                        "invoiceModal"
                    );

                }
            );


        document
            .getElementById(
                "closeMrnBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    closeModal(
                        "mrnModal"
                    );

                }
            );


        document
            .getElementById(
                "closeMrnFooterBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    closeModal(
                        "mrnModal"
                    );

                }
            );


        document
            .getElementById(
                "printInvoiceBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    window.print();

                }
            );


        document
            .getElementById(
                "printMrnBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    window.print();

                }
            );


        document.addEventListener(
            "click",
            function (event) {

                const backdrop =
                    event.target.closest(
                        "[data-close-modal]"
                    );


                if (!backdrop) {
                    return;
                }


                closeModal(
                    backdrop.dataset.closeModal
                );

            }
        );


        /* -----------------------------------------------------
           MANAGER ADD CATEGORY
        ----------------------------------------------------- */

        document.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.id !==
                    "managerAddCategoryBtn"
                ) {

                    return;

                }


                const input =
                    document.getElementById(
                        "managerCategoryInput"
                    );


                const value =
                    input.value.trim();


                if (!value) {

                    showToast(
                        "Enter a category name.",
                        "error"
                    );

                    return;

                }


                if (
                    state.categories.includes(
                        value
                    )
                ) {

                    showToast(
                        "Category already exists.",
                        "error"
                    );

                    return;

                }


                state.categories.push(
                    value
                );


                saveState();

                populateProductDropdowns();

                openInventoryManager(
                    "manage-category"
                );


                showToast(
                    "Category added."
                );

            }
        );


        /* -----------------------------------------------------
           MANAGER ADD UNIT
        ----------------------------------------------------- */

        document.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.id !==
                    "managerAddUnitBtn"
                ) {

                    return;

                }


                const input =
                    document.getElementById(
                        "managerUnitInput"
                    );


                const value =
                    input.value.trim();


                if (!value) {

                    showToast(
                        "Enter a unit.",
                        "error"
                    );

                    return;

                }


                if (
                    state.units.includes(
                        value
                    )
                ) {

                    showToast(
                        "Unit already exists.",
                        "error"
                    );

                    return;

                }


                state.units.push(
                    value
                );


                saveState();

                populateProductDropdowns();

                openInventoryManager(
                    "units"
                );


                showToast(
                    "Unit added."
                );

            }
        );


        /* -----------------------------------------------------
           GROUP PRICING
        ----------------------------------------------------- */

        document.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.id !==
                    "addGroupPriceBtn"
                ) {

                    return;

                }


                const name =
                    document.getElementById(
                        "groupPriceName"
                    ).value.trim();


                const discount =
                    Number(
                        document.getElementById(
                            "groupPriceDiscount"
                        ).value
                    ) || 0;


                if (!name) {

                    showToast(
                        "Enter a group name.",
                        "error"
                    );

                    return;

                }


                state.groupPrices.push({

                    name,

                    discount:
                        Math.min(
                            Math.max(
                                discount,
                                0
                            ),
                            100
                        )

                });


                saveState();

                openInventoryManager(
                    "group-pricing"
                );


                showToast(
                    "Group pricing rule added."
                );

            }
        );

    }


    /* =========================================================
       INITIALIZE
    ========================================================= */

    function init() {

        loadState();

        populateProductDropdowns();

        bindEvents();

        renderDashboard();

        renderInventory();

        renderCounterSearch();

        renderCounterCart();

        renderPendingSales();

        renderTransactions();

        initializeMrn();

        showTab(
            "dashboard"
        );

    }


    init();


})();