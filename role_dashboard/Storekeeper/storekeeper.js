/* ============================================================
   ZIMDRA DMS - STOREKEEPER
   Complete frontend prototype
   ============================================================ */

(function () {
    "use strict";

    const STORAGE_KEY = "zimdra_storekeeper_v3";

    let state = null;
    let selectedJobCard = null;
    let selectedPaymentSale = null;
    let selectedPaymentMethod = "Cash";


    /* =========================================================
       DEMO INVENTORY
    ========================================================= */

    const DEMO_INVENTORY = [
        {
            id: "OF-1024",
            name: "Toyota Oil Filter",
            category: "Filters",
            stock: 12,
            reorder: 5,
            price: 850,
            gst: 18
        },
        {
            id: "AF-2031",
            name: "Toyota Air Filter",
            category: "Filters",
            stock: 5,
            reorder: 4,
            price: 1200,
            gst: 18
        },
        {
            id: "BP-4001",
            name: "Front Brake Pad Set",
            category: "Brake",
            stock: 6,
            reorder: 3,
            price: 2500,
            gst: 18
        },
        {
            id: "SP-3010",
            name: "Iridium Spark Plug",
            category: "Ignition",
            stock: 24,
            reorder: 8,
            price: 350,
            gst: 18
        },
        {
            id: "EF-5011",
            name: "Engine Air Filter",
            category: "Filters",
            stock: 3,
            reorder: 5,
            price: 1450,
            gst: 18
        },
        {
            id: "BF-7012",
            name: "Brake Fluid 500ml",
            category: "Brake",
            stock: 15,
            reorder: 5,
            price: 480,
            gst: 18
        },
        {
            id: "EO-9012",
            name: "Engine Oil 5W-30 1L",
            category: "Lubricants",
            stock: 20,
            reorder: 8,
            price: 950,
            gst: 18
        },
        {
            id: "CO-8011",
            name: "Coolant 1L",
            category: "Fluids",
            stock: 10,
            reorder: 4,
            price: 650,
            gst: 18
        },
        {
            id: "WB-5010",
            name: "Wiper Blade 24 inch",
            category: "Exterior",
            stock: 8,
            reorder: 3,
            price: 900,
            gst: 18
        }
    ];


    /* =========================================================
       DEMO JOB CARDS
    ========================================================= */

    const DEMO_JOBS = [
        {
            id: "JC-2026-001",
            customer: "Karma Dorji",
            vehicle: "Toyota Hilux",
            reg: "BP-1-A1234",
            mechanic: "Pema Tshering",
            supervisor: "Sonam Wangchuk",
            type: "General Service",
            status: "Parts Requested",

            parts: [
                {
                    partId: "OF-1024",
                    requested: 1,
                    issued: 0
                },
                {
                    partId: "AF-2031",
                    requested: 1,
                    issued: 0
                },
                {
                    partId: "BP-4001",
                    requested: 2,
                    issued: 0
                }
            ]
        },

        {
            id: "JC-2026-002",
            customer: "Tashi Wangmo",
            vehicle: "Toyota Fortuner",
            reg: "BP-2-B7788",
            mechanic: "Jigme Dorji",
            supervisor: "Sonam Wangchuk",
            type: "Brake Service",
            status: "Parts Requested",

            parts: [
                {
                    partId: "BP-4001",
                    requested: 1,
                    issued: 0
                },
                {
                    partId: "BF-7012",
                    requested: 1,
                    issued: 0
                }
            ]
        },

        {
            id: "JC-2026-003",
            customer: "Dorji Tshering",
            vehicle: "Toyota Prado",
            reg: "BP-3-C4567",
            mechanic: "Karma Tobgay",
            supervisor: "Pema Tshering",
            type: "Engine Service",
            status: "Parts Requested",

            parts: [
                {
                    partId: "EO-9012",
                    requested: 4,
                    issued: 0
                },
                {
                    partId: "OF-1024",
                    requested: 1,
                    issued: 0
                }
            ]
        }
    ];


    /* =========================================================
       INITIAL STATE
    ========================================================= */

    function createInitialState() {

        return {
            inventory: clone(DEMO_INVENTORY),

            jobs: clone(DEMO_JOBS),

            sales: [],

            transactions: [],

            counterSequence: 1,

            workshopIssueSequence: 1,

            lastInvoice: null
        };
    }


    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }


    /* =========================================================
       STORAGE
    ========================================================= */

    function loadState() {

        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            state = createInitialState();
            saveState();
            return;
        }

        try {

            const parsed = JSON.parse(raw);

            state = parsed;

            if (!Array.isArray(state.inventory)) {
                state.inventory = clone(DEMO_INVENTORY);
            }

            if (!Array.isArray(state.jobs)) {
                state.jobs = clone(DEMO_JOBS);
            }

            if (!Array.isArray(state.sales)) {
                state.sales = [];
            }

            if (!Array.isArray(state.transactions)) {
                state.transactions = [];
            }

        } catch (error) {

            console.error(error);

            state = createInitialState();
            saveState();
        }
    }


    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }


    /* =========================================================
       HELPERS
    ========================================================= */

    function money(value) {

        const number = Number(value) || 0;

        return "Nu. " + number.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }


    function number(value) {

        const result = Number(value);

        return Number.isFinite(result) ? result : 0;
    }


    function todayKey() {

        const date = new Date();

        return date.toISOString().slice(0, 10);
    }


    function nowText() {

        return new Date().toLocaleString("en-BT", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }


    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getPart(partId) {

        return state.inventory.find(function (part) {
            return part.id === partId;
        });
    }


    function showToast(message) {

        const toast = document.getElementById("toast");
        const messageBox = document.getElementById("toastMessage");

        if (!toast || !messageBox) return;

        messageBox.textContent = message;

        toast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2800);
    }


    /* =========================================================
       NAVIGATION
    ========================================================= */

    const pageTitles = {
        dashboard: "Storekeeper Dashboard",
        workshop: "Workshop Parts Issue",
        counter: "Counter Sale",
        cash: "Cash Counter",
        inventory: "Inventory",
        transactions: "Transactions"
    };


    function showTab(tabName) {

        const sections = document.querySelectorAll(".page-section");

        sections.forEach(function (section) {

            section.classList.toggle(
                "active",
                section.id === tabName
            );

        });


        const navItems = document.querySelectorAll(".nav-item");

        navItems.forEach(function (item) {

            item.classList.toggle(
                "active",
                item.dataset.tab === tabName
            );

        });


        const title = document.getElementById("pageTitle");

        if (title) {
            title.textContent =
                pageTitles[tabName] || "Storekeeper Dashboard";
        }


        if (tabName === "dashboard") {
            renderDashboard();
        }

        if (tabName === "inventory") {
            renderInventory();
        }

        if (tabName === "transactions") {
            renderTransactions();
        }

        if (tabName === "cash") {
            renderPendingPayments();
        }

        if (tabName === "counter") {
            renderCounterSearch();
            renderSale();
        }
    }


    function initNavigation() {

        document.querySelectorAll(".nav-item").forEach(function (button) {

            button.addEventListener("click", function () {

                showTab(button.dataset.tab);

            });

        });


        document.querySelectorAll("[data-tab-target]").forEach(function (button) {

            button.addEventListener("click", function () {

                showTab(button.dataset.tabTarget);

            });

        });
    }


    /* =========================================================
       DASHBOARD
    ========================================================= */

    function renderDashboard() {

        const statParts = document.getElementById("statParts");
        const statLowStock = document.getElementById("statLowStock");
        const statIssues = document.getElementById("statIssues");
        const statSales = document.getElementById("statSales");

        if (statParts) {
            statParts.textContent = state.inventory.length;
        }


        const lowStock = state.inventory.filter(function (part) {
            return part.stock <= part.reorder;
        });


        if (statLowStock) {
            statLowStock.textContent = lowStock.length;
        }


        const issuesToday = state.transactions.filter(function (transaction) {

            return transaction.type === "Workshop Issue" &&
                transaction.dateKey === todayKey();

        });


        if (statIssues) {
            statIssues.textContent = issuesToday.length;
        }


        const salesToday = state.sales
            .filter(function (sale) {
                return sale.status === "Paid" &&
                    sale.dateKey === todayKey();
            })
            .reduce(function (sum, sale) {
                return sum + number(sale.grandTotal);
            }, 0);


        if (statSales) {
            statSales.textContent = money(salesToday);
        }


        renderDashboardRequests();
        renderDashboardLowStock();
    }


    function renderDashboardRequests() {

        const container =
            document.getElementById("dashboardRequests");

        if (!container) return;


        const jobs = state.jobs.filter(function (job) {

            return job.parts.some(function (part) {
                return number(part.requested) > number(part.issued);
            });

        });


        if (!jobs.length) {

            container.innerHTML =
                '<div class="empty-state">No pending workshop requests.</div>';

            return;
        }


        container.innerHTML = jobs.slice(0, 6).map(function (job) {

            const pending = job.parts.reduce(function (sum, part) {

                return sum +
                    Math.max(
                        0,
                        number(part.requested) -
                        number(part.issued)
                    );

            }, 0);


            return `
                <div class="dashboard-row">
                    <div>
                        <strong>${escapeHtml(job.id)}</strong>
                        <span>${escapeHtml(job.customer)} · ${escapeHtml(job.vehicle)}</span>
                    </div>

                    <span class="badge orange">
                        ${pending} part(s)
                    </span>
                </div>
            `;

        }).join("");
    }


    function renderDashboardLowStock() {

        const container =
            document.getElementById("dashboardLowStock");

        if (!container) return;


        const lowStock = state.inventory.filter(function (part) {
            return number(part.stock) <= number(part.reorder);
        });


        if (!lowStock.length) {

            container.innerHTML =
                '<div class="empty-state">All parts are adequately stocked.</div>';

            return;
        }


        container.innerHTML = lowStock.slice(0, 6).map(function (part) {

            return `
                <div class="dashboard-row">
                    <div>
                        <strong>${escapeHtml(part.name)}</strong>
                        <span>${escapeHtml(part.id)}</span>
                    </div>

                    <span class="badge red">
                        ${number(part.stock)} left
                    </span>
                </div>
            `;

        }).join("");
    }


    /* =========================================================
       WORKSHOP JOB LOOKUP
    ========================================================= */

    function lookupJob() {

        const input =
            document.getElementById("jobCardInput");

        const error =
            document.getElementById("jobError");

        const details =
            document.getElementById("jobDetails");


        const id = input.value.trim().toUpperCase();


        if (!id) {

            error.textContent =
                "Please enter a Job Card ID.";

            details.classList.add("hidden");

            return;
        }


        const job = state.jobs.find(function (item) {

            return item.id.toUpperCase() === id;

        });


        if (!job) {

            error.textContent =
                "Job Card not found. Try JC-2026-001.";

            details.classList.add("hidden");

            selectedJobCard = null;

            return;
        }


        error.textContent = "";

        selectedJobCard = job;

        renderJob(job);
    }


    function renderJob(job) {

        document.getElementById("jobDetails")
            .classList.remove("hidden");


        document.getElementById("jobCardTitle").textContent =
            job.id;

        document.getElementById("jobCustomer").textContent =
            job.customer;

        document.getElementById("jobVehicle").textContent =
            job.vehicle;

        document.getElementById("jobReg").textContent =
            job.reg;

        document.getElementById("jobMechanic").textContent =
            job.mechanic;

        document.getElementById("jobSupervisor").textContent =
            job.supervisor;

        document.getElementById("jobType").textContent =
            job.type;


        const badge =
            document.getElementById("jobStatusBadge");


        const pendingParts = job.parts.filter(function (part) {

            return number(part.issued) < number(part.requested);

        });


        if (!pendingParts.length) {

            badge.textContent = "Parts Issued";
            badge.className = "badge green";

        } else {

            badge.textContent = "Parts Requested";
            badge.className = "badge blue";

        }


        renderWorkshopParts(job);

        calculateWorkshopTotal();
    }


    function renderWorkshopParts(job) {

        const body =
            document.getElementById("workshopPartsBody");

        if (!body) return;


        body.innerHTML = "";


        job.parts.forEach(function (requestedPart, index) {

            const part =
                getPart(requestedPart.partId);


            if (!part) return;


            const pendingQty =
                Math.max(
                    0,
                    number(requestedPart.requested) -
                    number(requestedPart.issued)
                );


            const available =
                number(part.stock);


            const maxIssue =
                Math.min(pendingQty, available);


            const disabled =
                maxIssue <= 0;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <input
                        class="check workshop-check"
                        type="checkbox"
                        data-index="${index}"
                        ${disabled ? "disabled" : ""}
                    >
                </td>

                <td>
                    <strong>${escapeHtml(part.id)}</strong>
                </td>

                <td>
                    ${escapeHtml(part.name)}
                </td>

                <td>
                    ${pendingQty}
                </td>

                <td>
                    ${available}
                </td>

                <td>

                    <input
                        class="qty-input issue-qty"
                        type="number"
                        min="0"
                        max="${maxIssue}"
                        value="${maxIssue}"
                        data-index="${index}"
                        ${disabled ? "disabled" : ""}
                    >

                </td>

                <td>
                    ${money(part.price)}
                </td>

                <td class="workshop-line-total">
                    ${money(0)}
                </td>
            `;


            body.appendChild(row);

        });


        body.querySelectorAll(".issue-qty").forEach(function (input) {

            input.addEventListener("input", function () {

                const max = number(input.max);
                let value = number(input.value);

                if (value < 0) value = 0;
                if (value > max) value = max;

                input.value = value;

                calculateWorkshopTotal();
            });

        });


        body.querySelectorAll(".workshop-check").forEach(function (checkbox) {

            checkbox.addEventListener("change", function () {

                const index = checkbox.dataset.index;

                const qtyInput =
                    body.querySelector(
                        `.issue-qty[data-index="${index}"]`
                    );


                if (checkbox.checked) {

                    if (number(qtyInput.value) === 0) {
                        qtyInput.value = qtyInput.max;
                    }

                } else {

                    qtyInput.value = 0;

                }


                calculateWorkshopTotal();

            });

        });
    }


    function calculateWorkshopTotal() {

        const body =
            document.getElementById("workshopPartsBody");

        if (!body || !selectedJobCard) return;


        let subtotal = 0;
        let gst = 0;


        body.querySelectorAll("tr").forEach(function (row) {

            const qtyInput =
                row.querySelector(".issue-qty");


            if (!qtyInput) return;


            const index =
                number(qtyInput.dataset.index);


            const jobPart =
                selectedJobCard.parts[index];


            const part =
                getPart(jobPart.partId);


            if (!part) return;


            const qty =
                number(qtyInput.value);


            const lineSubtotal =
                qty * number(part.price);


            const lineGst =
                lineSubtotal *
                number(part.gst) /
                100;


            subtotal += lineSubtotal;
            gst += lineGst;


            const totalCell =
                row.querySelector(".workshop-line-total");


            if (totalCell) {
                totalCell.textContent =
                    money(lineSubtotal + lineGst);
            }

        });


        const total =
            subtotal + gst;


        document.getElementById("workshopSubtotal")
            .textContent = money(subtotal);

        document.getElementById("workshopGst")
            .textContent = money(gst);

        document.getElementById("workshopTotal")
            .textContent = money(total);
    }


    function selectAllWorkshopParts() {

        const master =
            document.getElementById("selectAllPartsBtn");


        document.querySelectorAll(".workshop-check")
            .forEach(function (checkbox) {

                if (checkbox.disabled) return;

                checkbox.checked = master.checked;

                const index =
                    checkbox.dataset.index;

                const input =
                    document.querySelector(
                        `.issue-qty[data-index="${index}"]`
                    );


                if (master.checked) {

                    input.value = input.max;

                } else {

                    input.value = 0;

                }

            });


        calculateWorkshopTotal();
    }


    function clearWorkshop() {

        selectedJobCard = null;

        document.getElementById("jobCardInput").value = "";

        document.getElementById("jobError").textContent = "";

        document.getElementById("jobDetails")
            .classList.add("hidden");

        document.getElementById("selectAllPartsBtn").checked = false;
    }


    function issueWorkshopParts() {

        if (!selectedJobCard) {

            showToast("Please look up a Job Card first.");

            return;
        }


        const body =
            document.getElementById("workshopPartsBody");


        const selected = [];


        body.querySelectorAll("tr").forEach(function (row) {

            const checkbox =
                row.querySelector(".workshop-check");

            const qtyInput =
                row.querySelector(".issue-qty");


            if (!checkbox || !qtyInput) return;


            const qty =
                number(qtyInput.value);


            if (checkbox.checked && qty > 0) {

                selected.push({
                    index: number(qtyInput.dataset.index),
                    qty: qty
                });

            }

        });


        if (!selected.length) {

            showToast("Select at least one part to issue.");

            return;
        }


        let subtotal = 0;
        let gst = 0;
        const issuedItems = [];


        for (const item of selected) {

            const jobPart =
                selectedJobCard.parts[item.index];

            const inventoryPart =
                getPart(jobPart.partId);


            if (!inventoryPart) {

                showToast(
                    "Part " + jobPart.partId +
                    " was not found in inventory."
                );

                return;
            }


            if (item.qty > inventoryPart.stock) {

                showToast(
                    "Insufficient stock for " +
                    inventoryPart.name
                );

                return;
            }


            const pending =
                number(jobPart.requested) -
                number(jobPart.issued);


            if (item.qty > pending) {

                showToast(
                    "Issue quantity exceeds request for " +
                    inventoryPart.name
                );

                return;
            }

        }


        selected.forEach(function (item) {

            const jobPart =
                selectedJobCard.parts[item.index];

            const inventoryPart =
                getPart(jobPart.partId);


            inventoryPart.stock -= item.qty;

            jobPart.issued =
                number(jobPart.issued) +
                item.qty;


            const lineSubtotal =
                item.qty * number(inventoryPart.price);

            const lineGst =
                lineSubtotal *
                number(inventoryPart.gst) /
                100;


            subtotal += lineSubtotal;
            gst += lineGst;


            issuedItems.push({
                partId: inventoryPart.id,
                name: inventoryPart.name,
                qty: item.qty,
                price: inventoryPart.price,
                gst: inventoryPart.gst,
                subtotal: lineSubtotal,
                gstAmount: lineGst
            });

        });


        const allIssued =
            selectedJobCard.parts.every(function (part) {

                return number(part.issued) >=
                    number(part.requested);

            });


        selectedJobCard.status =
            allIssued
                ? "Parts Issued"
                : "Partially Issued";


        const total =
            subtotal + gst;


        state.transactions.unshift({

            id:
                "WI-" +
                new Date().getTime(),

            date:
                nowText(),

            dateKey:
                todayKey(),

            reference:
                selectedJobCard.id,

            type:
                "Workshop Issue",

            customer:
                selectedJobCard.customer,

            amount:
                total,

            status:
                "Issued",

            items:
                issuedItems

        });


        saveState();


        showToast(
            "Parts issued successfully to " +
            selectedJobCard.id
        );


        renderJob(selectedJobCard);

        renderDashboard();

        renderInventory();

        renderTransactions();
    }


    /* =========================================================
       COUNTER SALE
    ========================================================= */

    let currentSale = {
        items: [],
        customer: "",
        mobile: "",
        vehicle: "",
        customerType: "Retail",
        discount: 0
    };


    function resetCurrentSale() {

        currentSale = {
            items: [],
            customer: "",
            mobile: "",
            vehicle: "",
            customerType: "Retail",
            discount: 0
        };


        const fields = [
            "saleCustomer",
            "saleMobile",
            "saleVehicle"
        ];


        fields.forEach(function (id) {

            const element =
                document.getElementById(id);

            if (element) {
                element.value = "";
            }

        });


        document.getElementById("saleCustomerType")
            .value = "Retail";


        document.getElementById("saleDiscount")
            .value = "0";


        document.getElementById("currentSaleNo")
            .textContent = "CS-NEW";


        renderCounterSearch();
        renderSale();
    }


    function renderCounterSearch() {

        const container =
            document.getElementById("partSearchResults");

        const input =
            document.getElementById("partSearchInput");


        if (!container) return;


        const search =
            input
                ? input.value.trim().toLowerCase()
                : "";


        const parts =
            state.inventory.filter(function (part) {

                if (!search) return true;

                return (
                    part.id.toLowerCase().includes(search) ||
                    part.name.toLowerCase().includes(search) ||
                    part.category.toLowerCase().includes(search)
                );

            });


        if (!parts.length) {

            container.innerHTML =
                '<div class="empty-state">No parts found.</div>';

            return;
        }


        container.innerHTML =
            parts.map(function (part) {

                const stock =
                    number(part.stock);


                return `
                    <button
                        class="part-result"
                        data-part-id="${escapeHtml(part.id)}"
                        ${stock <= 0 ? "disabled" : ""}
                    >

                        <div class="part-result-top">

                            <div>
                                <strong>
                                    ${escapeHtml(part.name)}
                                </strong>

                                <span>
                                    ${escapeHtml(part.id)}
                                    ·
                                    ${escapeHtml(part.category)}
                                </span>
                            </div>

                            <div class="part-result-price">
                                ${money(part.price)}
                            </div>

                        </div>

                        <span>
                            Stock: ${stock}
                        </span>

                    </button>
                `;

            }).join("");
    }


    function addPartToSale(partId) {

        const part =
            getPart(partId);


        if (!part) {

            showToast("Part not found.");

            return;
        }


        if (number(part.stock) <= 0) {

            showToast("This part is out of stock.");

            return;
        }


        const existing =
            currentSale.items.find(function (item) {

                return item.partId === partId;

            });


        if (existing) {

            if (existing.qty >= part.stock) {

                showToast("Cannot exceed available stock.");

                return;
            }

            existing.qty += 1;

        } else {

            currentSale.items.push({

                partId: part.id,

                name: part.name,

                qty: 1,

                price: number(part.price),

                gst: number(part.gst)

            });

        }


        renderSale();
    }


    function renderSale() {

        const body =
            document.getElementById("saleItemsBody");

        const empty =
            document.getElementById("saleEmpty");


        if (!body) return;


        body.innerHTML = "";


        if (!currentSale.items.length) {

            empty.classList.remove("hidden");

        } else {

            empty.classList.add("hidden");

        }


        currentSale.items.forEach(function (item, index) {

            const part =
                getPart(item.partId);


            if (!part) return;


            const lineSubtotal =
                item.qty * item.price;


            const lineGst =
                lineSubtotal *
                item.gst /
                100;


            const lineTotal =
                lineSubtotal + lineGst;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>${escapeHtml(item.name)}</strong>
                    <div class="kicker">
                        ${escapeHtml(item.partId)}
                    </div>
                </td>

                <td>
                    <input
                        class="qty-input sale-qty"
                        type="number"
                        min="1"
                        max="${part.stock}"
                        value="${item.qty}"
                        data-index="${index}"
                    >
                </td>

                <td>
                    ${money(item.price)}
                </td>

                <td>
                    ${item.gst}%
                </td>

                <td>
                    ${money(lineTotal)}
                </td>

                <td>
                    <button
                        class="text-button"
                        data-remove="${index}">
                        Remove
                    </button>
                </td>
            `;


            body.appendChild(row);

        });


        body.querySelectorAll(".sale-qty")
            .forEach(function (input) {

                input.addEventListener("input", function () {

                    const index =
                        number(input.dataset.index);

                    const item =
                        currentSale.items[index];

                    const part =
                        getPart(item.partId);


                    let qty =
                        Math.floor(number(input.value));


                    if (qty < 1) qty = 1;

                    if (qty > part.stock) {
                        qty = part.stock;
                    }


                    item.qty = qty;

                    input.value = qty;

                    calculateSale();

                });

            });


        body.querySelectorAll("[data-remove]")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    const index =
                        number(button.dataset.remove);

                    currentSale.items.splice(index, 1);

                    renderSale();

                });

            });


        calculateSale();
    }


    function calculateSale() {

        let subtotal = 0;


        currentSale.items.forEach(function (item) {

            subtotal +=
                number(item.qty) *
                number(item.price);

        });


        let discount =
            number(
                document.getElementById("saleDiscount").value
            );


        if (discount < 0) {
            discount = 0;
        }


        if (discount > subtotal) {
            discount = subtotal;
        }


        currentSale.discount = discount;


        const taxable =
            Math.max(0, subtotal - discount);


        let gst = 0;


        if (subtotal > 0) {

            currentSale.items.forEach(function (item) {

                const lineSubtotal =
                    number(item.qty) *
                    number(item.price);


                const allocatedDiscount =
                    discount *
                    (lineSubtotal / subtotal);


                const taxableLine =
                    Math.max(
                        0,
                        lineSubtotal -
                        allocatedDiscount
                    );


                gst +=
                    taxableLine *
                    number(item.gst) /
                    100;

            });

        }


        const grandTotal =
            taxable + gst;


        document.getElementById("saleSubtotal")
            .textContent = money(subtotal);

        const discountDisplay =
            document.getElementById("saleDiscountDisplay");

        if (discountDisplay) {
            discountDisplay.textContent =
                money(discount);
        }

        document.getElementById("saleTaxable")
            .textContent = money(taxable);

        document.getElementById("saleGst")
            .textContent = money(gst);

        document.getElementById("saleGrandTotal")
            .textContent = money(grandTotal);


        document.getElementById("saleItemCount")
            .textContent =
            currentSale.items.length +
            (currentSale.items.length === 1 ? " Item" : " Items");


        return {
            subtotal: subtotal,
            discount: discount,
            taxable: taxable,
            gst: gst,
            grandTotal: grandTotal
        };
    }


    function sendSaleToCash() {

        if (!currentSale.items.length) {

            showToast("Add at least one part to the sale.");

            return;
        }


        const customer =
            document.getElementById("saleCustomer")
                .value.trim();


        const mobile =
            document.getElementById("saleMobile")
                .value.trim();


        if (!customer) {

            showToast("Please enter customer name.");

            return;
        }


        if (!mobile) {

            showToast("Please enter customer mobile number.");

            return;
        }


        const totals =
            calculateSale();


        if (totals.grandTotal <= 0) {

            showToast("Sale amount must be greater than zero.");

            return;
        }


        const saleNo =
            generateSaleNumber();


        const sale = {

            id:
                "SALE-" +
                Date.now(),

            saleNo:
                saleNo,

            date:
                nowText(),

            dateKey:
                todayKey(),

            customer:
                customer,

            mobile:
                mobile,

            vehicle:
                document.getElementById("saleVehicle")
                    .value.trim(),

            customerType:
                document.getElementById("saleCustomerType")
                    .value,

            items:
                clone(currentSale.items),

            subtotal:
                totals.subtotal,

            discount:
                totals.discount,

            taxable:
                totals.taxable,

            gst:
                totals.gst,

            grandTotal:
                totals.grandTotal,

            status:
                "Pending Payment",

            paymentMethod:
                "",

            amountReceived:
                0,

            change:
                0

        };


        state.sales.unshift(sale);

        saveState();


        document.getElementById("currentSaleNo")
            .textContent = saleNo;


        showToast(
            saleNo +
            " sent to Cash Counter."
        );


        resetCurrentSale();

        renderPendingPayments();

        showTab("cash");
    }


    function generateSaleNumber() {

        const date =
            new Date();

        const y =
            date.getFullYear();

        const m =
            String(date.getMonth() + 1)
                .padStart(2, "0");

        const d =
            String(date.getDate())
                .padStart(2, "0");


        const sequence =
            state.counterSequence++;


        saveState();


        return (
            "CS-" +
            y +
            m +
            d +
            "-" +
            String(sequence).padStart(3, "0")
        );
    }


    /* =========================================================
       CASH COUNTER
    ========================================================= */

    function renderPendingPayments() {

        const container =
            document.getElementById("pendingPayments");

        const count =
            document.getElementById("pendingCount");


        if (!container) return;


        const pending =
            state.sales.filter(function (sale) {

                return sale.status === "Pending Payment";

            });


        count.textContent = pending.length;


        if (!pending.length) {

            container.innerHTML =
                '<div class="empty-state">No pending payments.</div>';

            return;
        }


        container.innerHTML =
            pending.map(function (sale) {

                const selected =
                    selectedPaymentSale &&
                    selectedPaymentSale.id === sale.id;


                return `
                    <button
                        class="pending-item ${selected ? "selected" : ""}"
                        data-sale-id="${escapeHtml(sale.id)}">

                        <div class="pending-top">

                            <strong>
                                ${escapeHtml(sale.saleNo)}
                            </strong>

                            <strong>
                                ${money(sale.grandTotal)}
                            </strong>

                        </div>

                        <span>
                            ${escapeHtml(sale.customer)}
                            ·
                            ${escapeHtml(sale.mobile)}
                        </span>

                    </button>
                `;

            }).join("");


        container.querySelectorAll("[data-sale-id]")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    selectPayment(
                        button.dataset.saleId
                    );

                });

            });
    }


    function selectPayment(saleId) {

        const sale =
            state.sales.find(function (item) {

                return item.id === saleId;

            });


        if (!sale) return;


        selectedPaymentSale = sale;


        document.getElementById("noPaymentSelected")
            .classList.add("hidden");


        document.getElementById("paymentForm")
            .classList.remove("hidden");


        document.getElementById("paymentSaleNo")
            .textContent = sale.saleNo;


        document.getElementById("paymentCustomer")
            .textContent = sale.customer;


        document.getElementById("paymentMobile")
            .textContent = sale.mobile;


        document.getElementById("paymentDue")
            .textContent = money(sale.grandTotal);


        document.getElementById("amountReceived")
            .value = "";


        document.getElementById("changeAmount")
            .textContent = money(0);


        document.getElementById("paymentError")
            .textContent = "";


        selectedPaymentMethod =
            sale.paymentMethod || "Cash";


        document.querySelectorAll(".payment-method")
            .forEach(function (button) {

                button.classList.toggle(
                    "active",
                    button.dataset.method ===
                    selectedPaymentMethod
                );

            });


        renderPendingPayments();
    }


    function calculateChange() {

        if (!selectedPaymentSale) return;


        const received =
            number(
                document.getElementById("amountReceived")
                    .value
            );


        const due =
            number(selectedPaymentSale.grandTotal);


        const change =
            Math.max(
                0,
                received - due
            );


        document.getElementById("changeAmount")
            .textContent = money(change);
    }


    function completePayment() {

        if (!selectedPaymentSale) {

            showToast(
                "Please select a pending payment."
            );

            return;
        }


        const received =
            number(
                document.getElementById("amountReceived")
                    .value
            );


        const due =
            number(selectedPaymentSale.grandTotal);


        const error =
            document.getElementById("paymentError");


        if (received < due) {

            error.textContent =
                "Amount received is less than the amount due.";

            return;
        }


        error.textContent = "";


        /*
         * IMPORTANT:
         * Inventory is deducted only when the sale
         * is actually paid.
         */

        for (const item of selectedPaymentSale.items) {

            const part =
                getPart(item.partId);


            if (!part) {

                error.textContent =
                    "Part " +
                    item.partId +
                    " no longer exists in inventory.";

                return;
            }


            if (number(part.stock) < number(item.qty)) {

                error.textContent =
                    "Insufficient stock for " +
                    part.name +
                    ".";

                return;
            }

        }


        selectedPaymentSale.items.forEach(function (item) {

            const part =
                getPart(item.partId);

            part.stock -= number(item.qty);

        });


        const change =
            received - due;


        selectedPaymentSale.status =
            "Paid";

        selectedPaymentSale.paymentMethod =
            selectedPaymentMethod;

        selectedPaymentSale.amountReceived =
            received;

        selectedPaymentSale.change =
            change;

        selectedPaymentSale.paidAt =
            nowText();


        state.transactions.unshift({

            id:
                "TX-" +
                Date.now(),

            date:
                nowText(),

            dateKey:
                todayKey(),

            reference:
                selectedPaymentSale.saleNo,

            type:
                "Counter Sale",

            customer:
                selectedPaymentSale.customer,

            amount:
                selectedPaymentSale.grandTotal,

            status:
                "Paid",

            paymentMethod:
                selectedPaymentMethod,

            items:
                clone(selectedPaymentSale.items)

        });


        state.lastInvoice =
            clone(selectedPaymentSale);


        saveState();


        showToast(
            "Payment completed successfully."
        );


        renderDashboard();

        renderInventory();

        renderTransactions();

        renderPendingPayments();

        openInvoice(selectedPaymentSale);


        selectedPaymentSale = null;


        document.getElementById("paymentForm")
            .classList.add("hidden");


        document.getElementById("noPaymentSelected")
            .classList.remove("hidden");
    }


    /* =========================================================
       INVENTORY
    ========================================================= */

    function renderInventory() {

        const body =
            document.getElementById("inventoryBody");

        const searchInput =
            document.getElementById("inventorySearch");


        if (!body) return;


        const search =
            searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";


        const parts =
            state.inventory.filter(function (part) {

                if (!search) return true;

                return (
                    part.id.toLowerCase().includes(search) ||
                    part.name.toLowerCase().includes(search) ||
                    part.category.toLowerCase().includes(search)
                );

            });


        body.innerHTML = "";


        parts.forEach(function (part) {

            const low =
                number(part.stock) <=
                number(part.reorder);


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>${escapeHtml(part.id)}</strong>
                </td>

                <td>
                    ${escapeHtml(part.name)}
                </td>

                <td>
                    ${escapeHtml(part.category)}
                </td>

                <td class="${low ? "stock-low" : "stock-ok"}">
                    ${number(part.stock)}
                </td>

                <td>
                    ${number(part.reorder)}
                </td>

                <td>
                    ${money(part.price)}
                </td>

                <td>
                    ${number(part.gst)}%
                </td>

                <td>

                    ${
                        low
                            ? '<span class="badge red">Low Stock</span>'
                            : '<span class="badge green">In Stock</span>'
                    }

                </td>
            `;


            body.appendChild(row);

        });


        if (!parts.length) {

            body.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="empty-state">
                            No inventory parts found.
                        </div>
                    </td>
                </tr>
            `;

        }
    }


    /* =========================================================
       ADD PART
    ========================================================= */

    function openAddPartModal() {

        document.getElementById("addPartError")
            .textContent = "";


        document.getElementById("newPartId")
            .value = "";

        document.getElementById("newPartName")
            .value = "";

        document.getElementById("newPartCategory")
            .value = "";

        document.getElementById("newPartStock")
            .value = "0";

        document.getElementById("newPartReorder")
            .value = "5";

        document.getElementById("newPartPrice")
            .value = "";

        document.getElementById("newPartGst")
            .value = "18";


        document.getElementById("addPartModal")
            .classList.add("show");
    }


    function closeAddPartModal() {

        document.getElementById("addPartModal")
            .classList.remove("show");
    }


    function saveNewPart() {

        const error =
            document.getElementById("addPartError");


        const id =
            document.getElementById("newPartId")
                .value.trim().toUpperCase();


        const name =
            document.getElementById("newPartName")
                .value.trim();


        const category =
            document.getElementById("newPartCategory")
                .value.trim() ||
            "General";


        const stock =
            number(
                document.getElementById("newPartStock")
                    .value
            );


        const reorder =
            number(
                document.getElementById("newPartReorder")
                    .value
            );


        const price =
            number(
                document.getElementById("newPartPrice")
                    .value
            );


        const gst =
            number(
                document.getElementById("newPartGst")
                    .value
            );


        if (!id) {

            error.textContent =
                "Part ID is required.";

            return;
        }


        if (!name) {

            error.textContent =
                "Part Name is required.";

            return;
        }


        if (price <= 0) {

            error.textContent =
                "Unit Price must be greater than zero.";

            return;
        }


        const existing =
            state.inventory.find(function (part) {

                return part.id.toUpperCase() === id;

            });


        if (existing) {

            error.textContent =
                "A part with this Part ID already exists.";

            return;
        }


        state.inventory.push({

            id: id,

            name: name,

            category: category,

            stock: stock,

            reorder: reorder,

            price: price,

            gst: gst

        });


        saveState();


        closeAddPartModal();

        renderInventory();

        renderDashboard();

        renderCounterSearch();


        showToast(
            "Part " + id + " added successfully."
        );
    }


    /* =========================================================
       EXCEL IMPORT
    ========================================================= */

    function openExcelPicker() {

        const input =
            document.getElementById("excelFileInput");

        if (input) {
            input.click();
        }
    }


    function normalizeHeader(value) {

        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[_\-]+/g, " ")
            .replace(/\s+/g, " ");
    }


    function findColumn(row, names) {

        const keys =
            Object.keys(row);


        for (const name of names) {

            const target =
                normalizeHeader(name);


            const key =
                keys.find(function (item) {

                    return normalizeHeader(item) === target;

                });


            if (key) {
                return row[key];
            }

        }


        return "";
    }


    function importExcel(file) {

        if (!file) return;


        if (
            typeof XLSX === "undefined"
        ) {

            showToast(
                "Excel reader could not be loaded."
            );

            return;
        }


        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();


        if (
            extension !== "xlsx" &&
            extension !== "xls" &&
            extension !== "csv"
        ) {

            showToast(
                "Please upload an Excel or CSV file."
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload = function (event) {

            try {

                const data =
                    new Uint8Array(event.target.result);


                const workbook =
                    XLSX.read(data, {
                        type: "array"
                    });


                const sheetName =
                    workbook.SheetNames[0];


                const sheet =
                    workbook.Sheets[sheetName];


                const rows =
                    XLSX.utils.sheet_to_json(
                        sheet,
                        {
                            defval: ""
                        }
                    );


                if (!rows.length) {

                    showToast(
                        "The uploaded Excel file is empty."
                    );

                    return;
                }


                let added = 0;
                let updated = 0;
                let skipped = 0;


                rows.forEach(function (row) {

                    const id =
                        String(
                            findColumn(
                                row,
                                [
                                    "Part ID",
                                    "PartID",
                                    "ID",
                                    "Part Code",
                                    "Code"
                                ]
                            )
                        )
                        .trim()
                        .toUpperCase();


                    const name =
                        String(
                            findColumn(
                                row,
                                [
                                    "Part Name",
                                    "PartName",
                                    "Name",
                                    "Description"
                                ]
                            )
                        ).trim();


                    if (!id || !name) {

                        skipped++;
                        return;
                    }


                    const category =
                        String(
                            findColumn(
                                row,
                                [
                                    "Category",
                                    "Part Category"
                                ]
                            )
                        ).trim() ||
                        "General";


                    const stock =
                        number(
                            findColumn(
                                row,
                                [
                                    "Stock",
                                    "Quantity",
                                    "Qty",
                                    "Opening Stock"
                                ]
                            )
                        );


                    const reorder =
                        number(
                            findColumn(
                                row,
                                [
                                    "Reorder Level",
                                    "Reorder",
                                    "Minimum Stock",
                                    "Min Stock"
                                ]
                            )
                        );


                    const price =
                        number(
                            findColumn(
                                row,
                                [
                                    "Price",
                                    "Unit Price",
                                    "Selling Price",
                                    "Rate"
                                ]
                            )
                        );


                    const gst =
                        number(
                            findColumn(
                                row,
                                [
                                    "GST",
                                    "GST %",
                                    "Tax"
                                ]
                            )
                        ) || 18;


                    if (price <= 0) {

                        skipped++;
                        return;
                    }


                    const existing =
                        state.inventory.find(function (part) {

                            return part.id.toUpperCase() === id;

                        });


                    if (existing) {

                        /*
                         * Existing part:
                         * update master data.
                         */

                        existing.name =
                            name;

                        existing.category =
                            category;

                        existing.stock =
                            stock;

                        existing.reorder =
                            reorder;

                        existing.price =
                            price;

                        existing.gst =
                            gst;

                        updated++;

                    } else {

                        /*
                         * New part:
                         * add to inventory.
                         */

                        state.inventory.push({

                            id: id,

                            name: name,

                            category: category,

                            stock: stock,

                            reorder: reorder,

                            price: price,

                            gst: gst

                        });

                        added++;
                    }

                });


                saveState();


                renderInventory();

                renderDashboard();

                renderCounterSearch();


                showToast(
                    "Excel imported: " +
                    added +
                    " added, " +
                    updated +
                    " updated, " +
                    skipped +
                    " skipped."
                );


            } catch (error) {

                console.error(error);

                showToast(
                    "Unable to read the Excel file."
                );

            }

        };


        reader.readAsArrayBuffer(file);
    }


    /* =========================================================
       TRANSACTIONS
    ========================================================= */

    function renderTransactions() {

        const body =
            document.getElementById("transactionsBody");


        if (!body) return;


        body.innerHTML = "";


        if (!state.transactions.length) {

            body.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            No transactions yet.
                        </div>
                    </td>
                </tr>
            `;

            return;
        }


        state.transactions.forEach(function (transaction) {

            const row =
                document.createElement("tr");


            let badgeClass =
                "blue";


            if (transaction.status === "Paid") {
                badgeClass = "green";
            }

            if (transaction.status === "Issued") {
                badgeClass = "blue";
            }


            row.innerHTML = `

                <td>
                    ${escapeHtml(transaction.date)}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(transaction.reference)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(transaction.type)}
                </td>

                <td>
                    ${escapeHtml(transaction.customer)}
                </td>

                <td>
                    ${money(transaction.amount)}
                </td>

                <td>
                    <span class="badge ${badgeClass}">
                        ${escapeHtml(transaction.status)}
                    </span>
                </td>
            `;


            body.appendChild(row);

        });
    }


    /* =========================================================
       INVOICE
    ========================================================= */

    function openInvoice(sale) {

        const modal =
            document.getElementById("invoiceModal");


        const content =
            document.getElementById("invoiceContent");


        const itemRows =
            sale.items.map(function (item, index) {

                const lineSubtotal =
                    number(item.qty) *
                    number(item.price);


                const allocatedDiscount =
                    sale.subtotal > 0
                        ? sale.discount *
                          (lineSubtotal / sale.subtotal)
                        : 0;


                const taxableLine =
                    lineSubtotal -
                    allocatedDiscount;


                const gst =
                    taxableLine *
                    number(item.gst) /
                    100;


                return `
                    <tr>

                        <td>${index + 1}</td>

                        <td>
                            <strong>
                                ${escapeHtml(item.name)}
                            </strong>

                            <div class="kicker">
                                ${escapeHtml(item.partId)}
                            </div>
                        </td>

                        <td>${item.qty}</td>

                        <td>${money(item.price)}</td>

                        <td>${money(gst)}</td>

                        <td>${money(taxableLine + gst)}</td>

                    </tr>
                `;

            }).join("");


        content.innerHTML = `

            <div class="invoice-header">

                <div class="invoice-company">

                    <h2>ZIMDRA AUTOMOTIVE</h2>

                    <p>Thimphu, Bhutan</p>

                    <p>Tel: +975 2 000000</p>

                    <p>GST Registration: GST-BT-00001</p>

                </div>


                <div class="invoice-title">

                    <h1>INVOICE</h1>

                    <p>
                        Invoice No:
                        <strong>${escapeHtml(sale.saleNo)}</strong>
                    </p>

                    <p>
                        Date:
                        ${escapeHtml(sale.paidAt || sale.date)}
                    </p>

                </div>

            </div>


            <div class="invoice-customer">

                <div>

                    <span>Customer</span>

                    <strong>
                        ${escapeHtml(sale.customer)}
                    </strong>

                </div>

                <div>

                    <span>Mobile</span>

                    <strong>
                        ${escapeHtml(sale.mobile)}
                    </strong>

                </div>

                <div>

                    <span>Vehicle</span>

                    <strong>
                        ${escapeHtml(sale.vehicle || "-")}
                    </strong>

                </div>

                <div>

                    <span>Customer Type</span>

                    <strong>
                        ${escapeHtml(sale.customerType)}
                    </strong>

                </div>

            </div>


            <table>

                <thead>

                    <tr>

                        <th>#</th>
                        <th>Part</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>GST</th>
                        <th>Total</th>

                    </tr>

                </thead>

                <tbody>
                    ${itemRows}
                </tbody>

            </table>


            <div class="invoice-summary">

                <div>
                    <span>Subtotal</span>
                    <strong>${money(sale.subtotal)}</strong>
                </div>

                <div>
                    <span>Discount</span>
                    <strong>${money(sale.discount)}</strong>
                </div>

                <div>
                    <span>Taxable Amount</span>
                    <strong>${money(sale.taxable)}</strong>
                </div>

                <div>
                    <span>GST</span>
                    <strong>${money(sale.gst)}</strong>
                </div>

                <div class="invoice-grand">
                    <span>Grand Total</span>
                    <strong>${money(sale.grandTotal)}</strong>
                </div>

                <div>
                    <span>Amount Received</span>
                    <strong>${money(sale.amountReceived)}</strong>
                </div>

                <div>
                    <span>Change</span>
                    <strong>${money(sale.change)}</strong>
                </div>

                <div>
                    <span>Payment Method</span>
                    <strong>${escapeHtml(sale.paymentMethod)}</strong>
                </div>

            </div>


            <div class="invoice-footer">

                Thank you for choosing Zimdra Automotive.

                <br>

                This is a computer-generated invoice.

            </div>
        `;


        modal.classList.add("show");
    }


    function closeInvoice() {

        document.getElementById("invoiceModal")
            .classList.remove("show");
    }


    function printInvoice() {

        window.print();
    }


    /* =========================================================
       DEMO / RESET
    ========================================================= */

    function loadDemoData() {

        const confirmed =
            confirm(
                "Load demo data? Existing prototype data will be replaced."
            );


        if (!confirmed) return;


        state =
            createInitialState();


        saveState();


        selectedJobCard = null;

        selectedPaymentSale = null;


        resetCurrentSale();


        renderDashboard();

        renderInventory();

        renderTransactions();

        renderPendingPayments();


        showTab("dashboard");


        showToast(
            "Demo data loaded successfully."
        );
    }


    function clearData() {

        const confirmed =
            confirm(
                "Clear all Storekeeper data?"
            );


        if (!confirmed) return;


        localStorage.removeItem(STORAGE_KEY);


        state =
            createInitialState();


        saveState();


        selectedJobCard = null;

        selectedPaymentSale = null;


        resetCurrentSale();


        renderDashboard();

        renderInventory();

        renderTransactions();

        renderPendingPayments();


        showToast(
            "Data cleared and reset."
        );
    }


    /* =========================================================
       EVENT BINDINGS
    ========================================================= */

    function bindEvents() {

        /* Navigation */

        initNavigation();


        /* Quick counter */

        document.getElementById("quickCounterBtn")
            .addEventListener("click", function () {

                showTab("counter");

            });


        /* Workshop */

        document.getElementById("lookupJobBtn")
            .addEventListener("click", lookupJob);


        document.getElementById("jobCardInput")
            .addEventListener("keydown", function (event) {

                if (event.key === "Enter") {
                    lookupJob();
                }

            });


        document.getElementById("selectAllPartsBtn")
            .addEventListener(
                "change",
                selectAllWorkshopParts
            );


        document.getElementById("clearWorkshopBtn")
            .addEventListener(
                "click",
                clearWorkshop
            );


        document.getElementById("issuePartsBtn")
            .addEventListener(
                "click",
                issueWorkshopParts
            );


        /* Counter search */

        document.getElementById("partSearchInput")
            .addEventListener("input", function () {

                renderCounterSearch();

            });


        /*
         * Dynamic part search result buttons.
         * Event delegation means newly-created buttons
         * automatically work.
         */

        document.getElementById("partSearchResults")
            .addEventListener("click", function (event) {

                const button =
                    event.target.closest("[data-part-id]");


                if (!button) return;


                addPartToSale(
                    button.dataset.partId
                );

            });


        document.getElementById("saleDiscount")
            .addEventListener(
                "input",
                calculateSale
            );


        document.getElementById("saleCustomer")
            .addEventListener("input", function (event) {

                currentSale.customer =
                    event.target.value;

            });


        document.getElementById("saleMobile")
            .addEventListener("input", function (event) {

                currentSale.mobile =
                    event.target.value;

            });


        document.getElementById("saleVehicle")
            .addEventListener("input", function (event) {

                currentSale.vehicle =
                    event.target.value;

            });


        document.getElementById("saleCustomerType")
            .addEventListener("change", function (event) {

                currentSale.customerType =
                    event.target.value;

            });


        document.getElementById("newSaleBtn")
            .addEventListener(
                "click",
                function () {

                    resetCurrentSale();

                    showToast("New counter sale started.");

                }
            );


        document.getElementById("sendToCashBtn")
            .addEventListener(
                "click",
                sendSaleToCash
            );


        /* Cash */

        document.querySelectorAll(".payment-method")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        selectedPaymentMethod =
                            button.dataset.method;


                        document.querySelectorAll(
                            ".payment-method"
                        ).forEach(function (item) {

                            item.classList.toggle(
                                "active",
                                item === button
                            );

                        });

                    }
                );

            });


        document.getElementById("amountReceived")
            .addEventListener(
                "input",
                calculateChange
            );


        document.getElementById("completePaymentBtn")
            .addEventListener(
                "click",
                completePayment
            );


        /* Inventory */

        document.getElementById("inventorySearch")
            .addEventListener(
                "input",
                renderInventory
            );


        /*
         * ADD PART BUTTON
         */

        document.getElementById("addPartBtn")
            .addEventListener(
                "click",
                openAddPartModal
            );


        document.getElementById("closeAddPartBtn")
            .addEventListener(
                "click",
                closeAddPartModal
            );


        document.getElementById("cancelAddPartBtn")
            .addEventListener(
                "click",
                closeAddPartModal
            );


        document.getElementById("savePartBtn")
            .addEventListener(
                "click",
                saveNewPart
            );


        /*
         * UPLOAD EXCEL BUTTON
         */

        document.getElementById("uploadExcelBtn")
            .addEventListener(
                "click",
                openExcelPicker
            );


        document.getElementById("excelFileInput")
            .addEventListener(
                "change",
                function (event) {

                    const file =
                        event.target.files[0];

                    importExcel(file);

                    /*
                     * Reset input so the same file
                     * can be uploaded again.
                     */

                    event.target.value = "";

                }
            );


        /* Demo */

        document.getElementById("loadDemoBtn")
            .addEventListener(
                "click",
                loadDemoData
            );


        document.getElementById("clearDataBtn")
            .addEventListener(
                "click",
                clearData
            );


        /* Invoice */

        document.getElementById("closeInvoiceBtn")
            .addEventListener(
                "click",
                closeInvoice
            );


        document.getElementById("closeInvoiceBtn2")
            .addEventListener(
                "click",
                closeInvoice
            );


        document.getElementById("printInvoiceBtn")
            .addEventListener(
                "click",
                printInvoice
            );


        /*
         * Close modal when clicking backdrop.
         */

        document.querySelectorAll(".modal-backdrop")
            .forEach(function (backdrop) {

                backdrop.addEventListener(
                    "click",
                    function () {

                        const modal =
                            backdrop.closest(".modal");

                        if (modal) {
                            modal.classList.remove("show");
                        }

                    }
                );

            });


        /*
         * ESC closes modal.
         */

        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Escape") return;


                document.querySelectorAll(".modal.show")
                    .forEach(function (modal) {

                        modal.classList.remove("show");

                    });

            }
        );
    }


    /* =========================================================
       INIT
    ========================================================= */

    function init() {

        loadState();

        bindEvents();

        renderDashboard();

        renderInventory();

        renderTransactions();

        renderCounterSearch();

        renderSale();

        renderPendingPayments();

        showTab("dashboard");

    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();