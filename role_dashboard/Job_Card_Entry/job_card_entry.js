/* ==========================================================================
   job_card_entry.js
   Zimdra DMS — Service Supervisor / Job Card Entry
   ========================================================================== */

(function () {

    "use strict";


    /* ========================================================================
       CONFIGURATION
       ======================================================================== */

    const STORAGE_KEY = "zimdra_job_cards_v2";

    const CURRENT_USER = {
        name: "S. Sarkar",
        role: "Service Supervisor"
    };

    let jobCards = [];
    let currentJobId = null;
    let editingJobId = null;
    let toastTimer = null;


    /* ========================================================================
       DOM HELPERS
       ======================================================================== */

    function $(selector) {
        return document.querySelector(selector);
    }


    function $$(selector) {
        return Array.from(document.querySelectorAll(selector));
    }


    /* ========================================================================
       DATE HELPERS
       ======================================================================== */

    function todayISO() {

        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    function currentYear() {
        return new Date().getFullYear();
    }


    function formatDate(value) {

        if (!value) {
            return "—";
        }

        const date = new Date(`${value}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    function formatDateTime(value) {

        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }


    function isToday(value) {

        if (!value) {
            return false;
        }

        if (value.includes("T")) {
            return value.slice(0, 10) === todayISO();
        }

        return value === todayISO();
    }


    function updateCurrentDate() {

        const element = $("#currentDate");

        if (!element) {
            return;
        }

        const now = new Date();

        element.textContent = now.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).toUpperCase();
    }


    /* ========================================================================
       STORAGE
       ======================================================================== */

    function loadJobCards() {

        try {

            const stored = localStorage.getItem(STORAGE_KEY);

            if (!stored) {
                jobCards = createDemoData();
                saveJobCards();
                return;
            }

            const parsed = JSON.parse(stored);

            jobCards = Array.isArray(parsed)
                ? parsed
                : createDemoData();

        } catch (error) {

            console.error("Unable to load Job Cards:", error);

            jobCards = createDemoData();
        }
    }


    function saveJobCards() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(jobCards)
        );
    }


    /* ========================================================================
       DEMO DATA
       ======================================================================== */

    function createDemoData() {

        const year = currentYear();

        return [

            {
                id: `JC-${year}-00421`,
                arrivalNo: `ARR-${year}-00121`,
                createdAt: new Date().toISOString(),

                customerName: "Karma Dorji",
                customerId: "CUS-00121",
                customerPhone: "+975 17123456",
                customerEmail: "karma@example.com",
                customerType: "Retail",
                customerAddress: "Thimphu",

                registration: "BP-2-A1234",
                vin: "JTDBR32E720123456",
                chassisNo: "MR053BB3402123456",
                engineNo: "2ZR-FAE-001234",
                make: "Toyota",
                model: "Corolla",
                modelYear: "2022",
                fuel: "Petrol",
                odometer: "48200",
                mileage: "14 km/l",
                fuelLevel: "½",
                vehicleColor: "White",

                serviceType: "GROUP-1 SRV",
                visitType: "Paid Service",
                supervisor: "S. Sarkar",
                jobPriority: "Normal",
                complaint: "Periodic maintenance and brake inspection.",
                additionalWork: "Check front suspension noise.",

                initialBay: "Bay 02",
                roadTestRequired: "Yes",
                customerApproval: "Approved",

                promisedDate: todayISO(),
                promisedTime: "16:00",
                deliveryDate: todayISO(),
                deliveryTime: "17:00",
                groupCode: "SRV",
                floorSupervisor: "S. Sarkar",
                receivedBy: "S. Sarkar",
                deliveredBy: "",
                billNo: "",
                insuranceBillNo: "",

                insuranceCompany: "",
                insurancePolicyNo: "",
                warrantyStatus: "Not Applicable",
                warrantyNo: "",

                pickupDrop: "Customer Drop-off",
                keysReceived: "Yes",
                accessoriesReceived: "Spare tyre, toolkit",
                conditionNotes: "Minor scratch on front bumper.",
                supervisorNotes: "Inspect brakes and suspension.",

                status: "OPEN",
                partsStatus: "WAITING PARTS",
                storekeeperQueue: true
            },


            {
                id: `JC-${year}-00420`,
                arrivalNo: `ARR-${year}-00120`,
                createdAt: new Date(Date.now() - 86400000).toISOString(),

                customerName: "Sonam Wangchuk",
                customerId: "CUS-00120",
                customerPhone: "+975 17654321",
                customerEmail: "sonam@example.com",
                customerType: "Corporate",
                customerAddress: "Babesa, Thimphu",

                registration: "BP-1-C7788",
                vin: "KMHXXXXXX12345678",
                chassisNo: "KMHCT41BBCU112233",
                engineNo: "G4NA-889912",
                make: "Hyundai",
                model: "Creta",
                modelYear: "2023",
                fuel: "Petrol",
                odometer: "28700",
                mileage: "15 km/l",
                fuelLevel: "¾",
                vehicleColor: "Silver",

                serviceType: "GROUP-1 SRV",
                visitType: "2nd Free Service",
                supervisor: "P. Dorji",
                jobPriority: "Normal",
                complaint: "Second free service.",
                additionalWork: "Inspect AC cooling.",

                initialBay: "Bay 03",
                roadTestRequired: "Yes",
                customerApproval: "Approved",

                promisedDate: todayISO(),
                promisedTime: "15:30",
                deliveryDate: todayISO(),
                deliveryTime: "16:30",
                groupCode: "SRV",
                floorSupervisor: "P. Dorji",
                receivedBy: "P. Dorji",
                deliveredBy: "",
                billNo: "",
                insuranceBillNo: "",

                insuranceCompany: "",
                insurancePolicyNo: "",
                warrantyStatus: "Under Warranty",
                warrantyNo: "WR-2026-221",

                pickupDrop: "Customer Drop-off",
                keysReceived: "Yes",
                accessoriesReceived: "Toolkit",
                conditionNotes: "No major visible damage.",
                supervisorNotes: "Complete scheduled service.",

                status: "IN PROGRESS",
                partsStatus: "PARTIALLY ISSUED",
                storekeeperQueue: true
            },


            {
                id: `JC-${year}-00418`,
                arrivalNo: `ARR-${year}-00118`,
                createdAt: new Date(Date.now() - 172800000).toISOString(),

                customerName: "Pema Wangchuk",
                customerId: "CUS-00118",
                customerPhone: "+975 17333444",
                customerEmail: "",
                customerType: "Retail",
                customerAddress: "Motithang",

                registration: "BP-3-D4567",
                vin: "MROXXXXXX1234567",
                chassisNo: "MROFZ29G701122334",
                engineNo: "1GD-998877",
                make: "Toyota",
                model: "Hilux",
                modelYear: "2021",
                fuel: "Diesel",
                odometer: "76800",
                mileage: "10 km/l",
                fuelLevel: "¼",
                vehicleColor: "Black",

                serviceType: "GROUP-3 OTHR",
                visitType: "Running Repair",
                supervisor: "T. Wangchuk",
                jobPriority: "High",
                complaint: "Engine warning light is ON.",
                additionalWork: "Check engine diagnostics.",

                initialBay: "Bay 04",
                roadTestRequired: "Yes",
                customerApproval: "Pending",

                promisedDate: todayISO(),
                promisedTime: "17:00",
                deliveryDate: "",
                deliveryTime: "",
                groupCode: "OTHR",
                floorSupervisor: "T. Wangchuk",
                receivedBy: "T. Wangchuk",
                deliveredBy: "",
                billNo: "",
                insuranceBillNo: "",

                insuranceCompany: "",
                insurancePolicyNo: "",
                warrantyStatus: "Expired",
                warrantyNo: "",

                pickupDrop: "Customer Drop-off",
                keysReceived: "Yes",
                accessoriesReceived: "Jack and toolkit",
                conditionNotes: "Engine warning light illuminated.",
                supervisorNotes: "Run diagnostic scan before repair.",

                status: "WAITING APPROVAL",
                partsStatus: "WAITING ISSUE",
                storekeeperQueue: true
            },


            {
                id: `JC-${year}-00415`,
                arrivalNo: `ARR-${year}-00115`,
                createdAt: new Date(Date.now() - 259200000).toISOString(),

                customerName: "Tashi Dorji",
                customerId: "CUS-00115",
                customerPhone: "+975 17555555",
                customerEmail: "",
                customerType: "Fleet",
                customerAddress: "Phuentsholing",

                registration: "BP-2-B9001",
                vin: "MITSXXXXXX000111",
                chassisNo: "MMBJNKB40LH000111",
                engineNo: "4N15-778899",
                make: "Mitsubishi",
                model: "Pajero Sport",
                modelYear: "2020",
                fuel: "Diesel",
                odometer: "93400",
                mileage: "9 km/l",
                fuelLevel: "½",
                vehicleColor: "Grey",

                serviceType: "GROUP-2 BODY",
                visitType: "Accidental",
                supervisor: "P. Dorji",
                jobPriority: "High",
                complaint: "Rear bumper damage.",
                additionalWork: "Inspect rear parking sensors.",

                initialBay: "Bay 05",
                roadTestRequired: "No",
                customerApproval: "Approved",

                promisedDate: todayISO(),
                promisedTime: "17:30",
                deliveryDate: "",
                deliveryTime: "",
                groupCode: "BODY",
                floorSupervisor: "P. Dorji",
                receivedBy: "P. Dorji",
                deliveredBy: "",
                billNo: "",
                insuranceBillNo: "INS-2026-00415",

                insuranceCompany: "Bhutan Insurance",
                insurancePolicyNo: "BI-ACC-445566",
                warrantyStatus: "Not Applicable",
                warrantyNo: "",

                pickupDrop: "Recovery / Towing",
                keysReceived: "Yes",
                accessoriesReceived: "Toolkit",
                conditionNotes: "Rear bumper cracked. Rear right reflector damaged.",
                supervisorNotes: "Insurance estimate required.",

                status: "OPEN",
                partsStatus: "WAITING PARTS",
                storekeeperQueue: true
            },

            {
                id: `JC-${year}-00412`,
                arrivalNo: `ARR-${year}-00112`,
                createdAt: new Date(Date.now() - 432000000).toISOString(),

                customerName: "Sangay Tamang",
                customerId: "CUS-00112",
                customerPhone: "+975 17777777",
                customerEmail: "",
                customerType: "Retail",
                customerAddress: "Changangkha",

                registration: "BP-4-E2211",
                vin: "MAHXXXXXX990011",
                chassisNo: "MA1YB2GK5LB990011",
                engineNo: "D22-334455",
                make: "Mahindra",
                model: "Scorpio",
                modelYear: "2021",
                fuel: "Diesel",
                odometer: "66200",
                mileage: "11 km/l",
                fuelLevel: "½",
                vehicleColor: "White",

                serviceType: "GROUP-1 SRV",
                visitType: "Paid Service",
                supervisor: "S. Sarkar",
                jobPriority: "Normal",
                complaint: "General service.",
                additionalWork: "Check tyre condition.",

                initialBay: "Bay 01",
                roadTestRequired: "Yes",
                customerApproval: "Approved",

                promisedDate: todayISO(),
                promisedTime: "14:00",
                deliveryDate: todayISO(),
                deliveryTime: "16:00",
                groupCode: "SRV",
                floorSupervisor: "S. Sarkar",
                receivedBy: "S. Sarkar",
                deliveredBy: "S. Sarkar",
                billNo: "INV-2026-1001",
                insuranceBillNo: "",

                insuranceCompany: "",
                insurancePolicyNo: "",
                warrantyStatus: "Not Applicable",
                warrantyNo: "",

                pickupDrop: "Customer Drop-off",
                keysReceived: "Yes",
                accessoriesReceived: "Toolkit",
                conditionNotes: "Normal wear and tear.",
                supervisorNotes: "Completed scheduled work.",

                status: "COMPLETED",
                partsStatus: "PARTS ISSUED",
                storekeeperQueue: false
            },

            {
                id: `JC-${year}-00409`,
                arrivalNo: `ARR-${year}-00109`,
                createdAt: new Date(Date.now() - 604800000).toISOString(),

                customerName: "A. Kr. Dey",
                customerId: "CUS-00109",
                customerPhone: "+975 17999999",
                customerEmail: "",
                customerType: "Corporate",
                customerAddress: "Thimphu",

                registration: "BP-1-F3322",
                vin: "FORTXXXXXX112233",
                chassisNo: "MHFYZ59G701112233",
                engineNo: "1GD-123456",
                make: "Toyota",
                model: "Fortuner",
                modelYear: "2020",
                fuel: "Diesel",
                odometer: "85100",
                mileage: "8 km/l",
                fuelLevel: "¾",
                vehicleColor: "Black",

                serviceType: "GROUP-3 OTHR",
                visitType: "Repeat Job",
                supervisor: "T. Wangchuk",
                jobPriority: "Normal",
                complaint: "Repeat complaint regarding AC.",
                additionalWork: "Inspect previous repair.",

                initialBay: "Bay 06",
                roadTestRequired: "Yes",
                customerApproval: "Approved",

                promisedDate: todayISO(),
                promisedTime: "17:00",
                deliveryDate: "",
                deliveryTime: "",
                groupCode: "OTHR",
                floorSupervisor: "T. Wangchuk",
                receivedBy: "T. Wangchuk",
                deliveredBy: "",
                billNo: "",
                insuranceBillNo: "",

                insuranceCompany: "",
                insurancePolicyNo: "",
                warrantyStatus: "Warranty Claim",
                warrantyNo: "WR-REPEAT-409",

                pickupDrop: "Customer Drop-off",
                keysReceived: "Yes",
                accessoriesReceived: "Toolkit",
                conditionNotes: "Previous AC complaint recorded.",
                supervisorNotes: "Review previous job history.",

                status: "OPEN",
                partsStatus: "WAITING PARTS",
                storekeeperQueue: true
            }

        ];
    }


    /* ========================================================================
       ID GENERATION
       ======================================================================== */

    function generateJobCardNumber() {

        const year = currentYear();

        const numbers = jobCards
            .map(job => {
                const match = String(job.id || "").match(
                    /JC-\d{4}-(\d+)/
                );

                return match
                    ? Number(match[1])
                    : 0;
            })
            .filter(Number.isFinite);

        const next = Math.max(0, ...numbers) + 1;

        return `JC-${year}-${String(next).padStart(5, "0")}`;
    }


    function generateArrivalNumber() {

        const year = currentYear();

        const numbers = jobCards
            .map(job => {
                const match = String(job.arrivalNo || "").match(
                    /ARR-\d{4}-(\d+)/
                );

                return match
                    ? Number(match[1])
                    : 0;
            })
            .filter(Number.isFinite);

        const next = Math.max(0, ...numbers) + 1;

        return `ARR-${year}-${String(next).padStart(5, "0")}`;
    }


    /* ========================================================================
       ESCAPE HTML
       ======================================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* ========================================================================
       STATUS CLASS
       ======================================================================== */

    function statusClass(status) {

        switch (String(status || "").toUpperCase()) {

            case "COMPLETED":
                return "status-badge--green";

            case "DRAFT":
                return "status-badge--gray";

            case "CANCELLED":
                return "status-badge--red";

            case "WAITING APPROVAL":
            case "WAITING PARTS":
            case "WAITING ISSUE":
            case "PARTIALLY ISSUED":
                return "status-badge--yellow";

            default:
                return "status-badge--blue";
        }
    }


    /* ========================================================================
       NAVIGATION
       ======================================================================== */

    function showView(viewName) {

        $$(".view").forEach(view => {
            view.classList.remove("is-visible");
        });

        const target = $(`#view-${viewName}`);

        if (target) {
            target.classList.add("is-visible");
        }

        $$(".nav-item").forEach(item => {

            item.classList.toggle(
                "is-active",
                item.dataset.view === viewName
            );

        });

        const sidebar = $("#sidebar");

        if (sidebar) {
            sidebar.classList.remove("is-open");
        }
    }


    /* ========================================================================
       DASHBOARD
       ======================================================================== */

    function renderDashboard() {

        const todayArrivals = jobCards.filter(job =>
            isToday(job.createdAt)
        ).length;

        const openJobs = jobCards.filter(job =>
            !["COMPLETED", "CANCELLED", "DRAFT"].includes(
                String(job.status || "").toUpperCase()
            )
        ).length;

        const waitingParts = jobCards.filter(job =>
            [
                "WAITING PARTS",
                "WAITING ISSUE",
                "PARTIALLY ISSUED",
                "WAITING PARTS"
            ].includes(
                String(job.partsStatus || "").toUpperCase()
            )
        ).length;

        const completed = jobCards.filter(job =>
            String(job.status || "").toUpperCase() === "COMPLETED"
        ).length;


        $("#dashArrivals").textContent =
            String(todayArrivals).padStart(2, "0");

        $("#dashOpen").textContent =
            String(openJobs).padStart(2, "0");

        $("#dashParts").textContent =
            String(waitingParts).padStart(2, "0");

        $("#dashCompleted").textContent =
            String(completed).padStart(2, "0");


        const body = $("#dashboardJobsBody");

        if (!body) {
            return;
        }

        const recent = [...jobCards]
            .sort((a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
            )
            .slice(0, 8);


        if (!recent.length) {

            body.innerHTML = `
                <tr>
                    <td colspan="8">
                        No Job Cards available.
                    </td>
                </tr>
            `;

            return;
        }


        body.innerHTML = recent.map(job => {

            return `
                <tr>

                    <td>
                        <div class="table-primary">
                            ${escapeHTML(job.id)}
                        </div>

                        <div class="table-secondary">
                            ${escapeHTML(formatDateTime(job.createdAt))}
                        </div>
                    </td>

                    <td>
                        ${escapeHTML(job.registration || "—")}
                    </td>

                    <td>
                        ${escapeHTML(job.customerName || "—")}
                    </td>

                    <td>
                        ${escapeHTML(job.serviceType || "—")}
                    </td>

                    <td>
                        ${escapeHTML(job.supervisor || "—")}
                    </td>

                    <td>
                        ${escapeHTML(job.mechanic1 || "—")}
                    </td>

                    <td>
                        <span class="status-badge ${statusClass(job.status)}">
                            ${escapeHTML(job.status || "OPEN")}
                        </span>
                    </td>

                    <td>
                        <button
                            type="button"
                            class="action-button"
                            data-open-job="${escapeHTML(job.id)}"
                        >
                            Open
                        </button>
                    </td>

                </tr>
            `;
        }).join("");
    }


    /* ========================================================================
       ARRIVAL TABLE
       ======================================================================== */

    function renderArrivalTable(searchTerm = "") {

        const body = $("#arrivalTableBody");

        if (!body) {
            return;
        }


        const term = String(searchTerm || "")
            .trim()
            .toLowerCase();


        let filtered = [...jobCards];


        if (term) {

            filtered = filtered.filter(job => {

                const searchable = [

                    job.id,
                    job.arrivalNo,

                    job.customerName,
                    job.customerId,
                    job.customerPhone,

                    job.registration,
                    job.vin,
                    job.chassisNo,
                    job.engineNo,

                    job.make,
                    job.model,

                    job.serviceType,
                    job.visitType,

                    job.supervisor,
                    job.mechanic1,
                    job.mechanic2,

                    job.groupCode

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchable.includes(term);
            });
        }


        filtered.sort((a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );


        $("#arrivalResultCount").textContent =
            filtered.length;


        if (!filtered.length) {

            body.innerHTML = `
                <tr>
                    <td colspan="9">
                        No Job Cards found.
                    </td>
                </tr>
            `;

            return;
        }


        body.innerHTML = filtered.map(job => {

            return `
                <tr>

                    <td>
                        <div class="table-primary">
                            ${escapeHTML(job.id)}
                        </div>

                        <div class="table-secondary">
                            ${escapeHTML(formatDateTime(job.createdAt))}
                        </div>
                    </td>

                    <td>
                        ${escapeHTML(job.arrivalNo || "—")}
                    </td>

                    <td>
                        <div class="table-primary">
                            ${escapeHTML(job.registration || "—")}
                        </div>

                        <div class="table-secondary">
                            ${escapeHTML(`${job.make || ""} ${job.model || ""}`.trim())}
                        </div>
                    </td>

                    <td>
                        <div class="table-primary">
                            ${escapeHTML(job.customerName || "—")}
                        </div>

                        <div class="table-secondary">
                            ${escapeHTML(job.customerPhone || "")}
                        </div>
                    </td>

                    <td>
                        ${escapeHTML(job.serviceType || "—")}
                    </td>

                    <td>
                        ${escapeHTML(job.supervisor || "—")}
                    </td>

                    <td>
                        ${escapeHTML(formatDate(job.promisedDate))}
                    </td>

                    <td>
                        <span class="status-badge ${statusClass(job.status)}">
                            ${escapeHTML(job.status || "OPEN")}
                        </span>
                    </td>

                    <td>
                        <button
                            type="button"
                            class="action-button"
                            data-open-job="${escapeHTML(job.id)}"
                        >
                            View
                        </button>
                    </td>

                </tr>
            `;
        }).join("");
    }


    /* ========================================================================
       MODAL
       ======================================================================== */

    function openModal(modal) {

        if (!modal) {
            return;
        }

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    }


    function closeModal(modal) {

        if (!modal) {
            return;
        }

        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");

        const anyModalOpen = !$("#arrivalModal").hidden ||
            !$("#jobCardModal").hidden;

        if (!anyModalOpen) {
            document.body.style.overflow = "";
        }
    }


    /* ========================================================================
       NEW ARRIVAL FORM
       ======================================================================== */

    function setDefaultFormValues() {

        $("#promisedDate").value = todayISO();

        if (!$("#deliveryDate").value) {
            $("#deliveryDate").value = todayISO();
        }

        $("#promisedTime").value = "16:00";
        $("#deliveryTime").value = "17:00";

        $("#formStatusText").textContent = "New Job Card";
    }


    function resetArrivalForm() {

        const form = $("#arrivalForm");

        if (!form) {
            return;
        }

        form.reset();

        editingJobId = null;

        $("#arrivalModalTitle").textContent =
            "Create Job Card";

        $("#formStatusText").textContent =
            "New Job Card";

        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.textContent =
                "Create Job Card →";
        }

        setDefaultFormValues();
    }


    function openNewArrivalModal() {

        resetArrivalForm();

        openModal($("#arrivalModal"));

        setTimeout(() => {
            $("#customerName")?.focus();
        }, 50);
    }


    /* ========================================================================
       FORM DATA
       ======================================================================== */

    function collectFormData() {

        const form = $("#arrivalForm");

        const formData = new FormData(form);

        const data = {};

        for (const [key, value] of formData.entries()) {
            data[key] = String(value).trim();
        }

        return data;
    }


    function validateForm() {

        const form = $("#arrivalForm");

        if (!form.checkValidity()) {

            form.reportValidity();

            return false;
        }

        return true;
    }


    /* ========================================================================
       SAVE NEW / EDIT
       ======================================================================== */

    function saveJobCard(event) {

        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const data = collectFormData();

        const now = new Date().toISOString();


        if (editingJobId) {

            const index = jobCards.findIndex(
                job => job.id === editingJobId
            );

            if (index === -1) {
                return;
            }


            const existing = jobCards[index];


            jobCards[index] = {
                ...existing,
                ...data,

                updatedAt: now,

                status:
                    existing.status === "DRAFT"
                        ? "OPEN"
                        : existing.status,

                partsStatus:
                    existing.partsStatus === "NOT SENT"
                        ? "WAITING PARTS"
                        : existing.partsStatus,

                storekeeperQueue:
                    existing.partsStatus === "PARTS ISSUED"
                        ? false
                        : true
            };


            saveJobCards();

            closeModal($("#arrivalModal"));

            renderAll();

            showToast(
                "Job Card Updated",
                `${existing.id} has been updated successfully.`
            );

            return;
        }


        const newJob = {

            id: generateJobCardNumber(),
            arrivalNo: generateArrivalNumber(),

            createdAt: now,
            updatedAt: now,

            ...data,

            status: "OPEN",
            partsStatus: "WAITING PARTS",
            storekeeperQueue: true
        };


        jobCards.unshift(newJob);

        saveJobCards();

        closeModal($("#arrivalModal"));

        renderAll();

        showToast(
            "Job Card Created",
            `${newJob.id} is now available to Storekeeper.`
        );

        showView("arrival");
    }


    /* ========================================================================
       SAVE DRAFT
       ======================================================================== */

    function saveDraft() {

        const form = $("#arrivalForm");

        const data = collectFormData();

        if (!data.customerName && !data.registration) {

            showToast(
                "Draft Not Saved",
                "Enter at least the customer name or registration number."
            );

            return;
        }


        const now = new Date().toISOString();


        if (editingJobId) {

            const index = jobCards.findIndex(
                job => job.id === editingJobId
            );

            if (index === -1) {
                return;
            }


            jobCards[index] = {
                ...jobCards[index],
                ...data,

                status: "DRAFT",
                partsStatus: "NOT SENT",
                storekeeperQueue: false,

                updatedAt: now
            };


            saveJobCards();

            closeModal($("#arrivalModal"));

            renderAll();

            showToast(
                "Draft Saved",
                `${editingJobId} has been saved as a draft.`
            );

            return;
        }


        const draft = {

            id: generateJobCardNumber(),
            arrivalNo: generateArrivalNumber(),

            createdAt: now,
            updatedAt: now,

            ...data,

            status: "DRAFT",
            partsStatus: "NOT SENT",
            storekeeperQueue: false
        };


        jobCards.unshift(draft);

        saveJobCards();

        closeModal($("#arrivalModal"));

        renderAll();

        showToast(
            "Draft Saved",
            `${draft.id} has been saved as a draft.`
        );
    }


    /* ========================================================================
       EDIT
       ======================================================================== */

    function editJobCard(jobId) {

        const job = jobCards.find(
            item => item.id === jobId
        );

        if (!job) {
            return;
        }


        editingJobId = jobId;

        const form = $("#arrivalForm");


        for (const [key, value] of Object.entries(job)) {

            const field = form.elements[key];

            if (!field) {
                continue;
            }

            if (field.type === "checkbox") {
                field.checked = Boolean(value);
            } else {
                field.value = value ?? "";
            }
        }


        $("#arrivalModalTitle").textContent =
            `Edit ${job.id}`;

        $("#formStatusText").textContent =
            `Editing ${job.id}`;


        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.textContent =
                "Save Changes →";
        }


        closeModal($("#jobCardModal"));

        openModal($("#arrivalModal"));

        setTimeout(() => {
            $("#customerName")?.focus();
        }, 50);
    }


    /* ========================================================================
       VIEW JOB CARD
       ======================================================================== */

    function openJobCard(jobId) {

        const job = jobCards.find(
            item => item.id === jobId
        );

        if (!job) {
            return;
        }


        currentJobId = jobId;


        $("#viewJobNo").textContent =
            job.id || "—";


        $("#viewStatus").textContent =
            job.status || "OPEN";

        $("#viewStatus").className =
            `status-badge ${statusClass(job.status)}`;


        $("#viewJobMeta").textContent =
            `${job.arrivalNo || "No arrival"} · Created ${formatDateTime(job.createdAt)}`;


        $("#viewVehicle").textContent =
            job.registration || "—";

        $("#viewVehicleModel").textContent =
            `${job.make || ""} ${job.model || ""}`.trim() || "—";


        $("#viewCustomer").textContent =
            job.customerName || "—";

        $("#viewPhone").textContent =
            job.customerPhone || "—";


        $("#viewService").textContent =
            job.serviceType || "—";

        $("#viewVisit").textContent =
            job.visitType || "—";


        $("#viewPromised").textContent =
            formatDate(job.promisedDate);

        $("#viewDelivery").textContent =
            formatDate(job.deliveryDate);


        setDetail("detailCustomerName", job.customerName);
        setDetail("detailCustomerId", job.customerId);
        setDetail("detailPhone", job.customerPhone);
        setDetail("detailEmail", job.customerEmail);
        setDetail("detailCustomerType", job.customerType);
        setDetail("detailCustomerAddress", job.customerAddress);

        setDetail("detailRegistration", job.registration);
        setDetail("detailVin", job.vin);
        setDetail("detailChassisNo", job.chassisNo);
        setDetail("detailEngine", job.engineNo);

        setDetail(
            "detailModel",
            `${job.make || ""} ${job.model || ""}`.trim()
        );

        setDetail("detailYear", job.modelYear);
        setDetail("detailFuel", job.fuel);
        setDetail(
            "detailOdometer",
            job.odometer ? `${job.odometer} KM` : ""
        );
        setDetail("detailMileage", job.mileage);
        setDetail("detailFuelLevel", job.fuelLevel);
        setDetail("detailVehicleColor", job.vehicleColor);


        setDetail("detailService", job.serviceType);
        setDetail("detailVisit", job.visitType);
        setDetail("detailSupervisor", job.supervisor);
        setDetail("detailPriority", job.jobPriority);
        setDetail("detailArrival", job.arrivalNo);

        setDetail("detailComplaint", job.complaint);
        setDetail("detailAdditionalWork", job.additionalWork);


        setDetail(
            "detailPromisedDate",
            formatDate(job.promisedDate)
        );

        setDetail("detailPromisedTime", job.promisedTime);

        setDetail(
            "detailDeliveryDate",
            formatDate(job.deliveryDate)
        );

        setDetail("detailDeliveryTime", job.deliveryTime);

        setDetail("detailGroupCode", job.groupCode);
        setDetail("detailFlorSup", job.floorSupervisor);
        setDetail("detailReceivedBy", job.receivedBy);
        setDetail("detailDeliveredBy", job.deliveredBy);
        setDetail("detailBillNo", job.billNo);
        setDetail(
            "detailInsuranceBillNo",
            job.insuranceBillNo
        );


        setDetail(
            "detailInsuranceCompany",
            job.insuranceCompany
        );

        setDetail(
            "detailInsurancePolicy",
            job.insurancePolicyNo
        );

        setDetail(
            "detailWarrantyStatus",
            job.warrantyStatus
        );

        setDetail(
            "detailWarrantyNo",
            job.warrantyNo
        );


        setDetail(
            "detailPickupDrop",
            job.pickupDrop
        );

        setDetail(
            "detailKeysReceived",
            job.keysReceived
        );

        setDetail(
            "detailAccessories",
            job.accessoriesReceived
        );

        setDetail(
            "detailCondition",
            job.conditionNotes
        );

        setDetail(
            "detailSupervisorNotes",
            job.supervisorNotes
        );


        const partsStatus =
            job.partsStatus || "WAITING PARTS";


        $("#viewPartsStatus").textContent =
            partsStatus;

        $("#viewPartsStatus").className =
            `status-badge ${partsStatusClass(partsStatus)}`;


        if (partsStatus === "PARTS ISSUED") {

            $("#viewPartsMessage").textContent =
                "Parts have been issued by Storekeeper against this Job Card.";

        } else if (partsStatus === "PARTIALLY ISSUED") {

            $("#viewPartsMessage").textContent =
                "Some required parts have been issued. Storekeeper action remains pending.";

        } else {

            $("#viewPartsMessage").textContent =
                "Job Card is available to Storekeeper for parts issue.";
        }


        $("#viewFooterStatus").textContent =
            job.status === "DRAFT"
                ? "Job Card Draft"
                : "Job Card Active";


        openModal($("#jobCardModal"));
    }


    function setDetail(id, value) {

        const element = $(`#${id}`);

        if (!element) {
            return;
        }

        element.textContent =
            value === undefined ||
            value === null ||
            value === ""
                ? "—"
                : value;
    }


    function partsStatusClass(status) {

        switch (String(status || "").toUpperCase()) {

            case "PARTS ISSUED":
                return "status-badge--green";

            case "NOT SENT":
                return "status-badge--gray";

            case "WAITING ISSUE":
            case "PARTIALLY ISSUED":
            case "WAITING PARTS":
                return "status-badge--yellow";

            default:
                return "status-badge--blue";
        }
    }


    /* ========================================================================
       DELETE
       ======================================================================== */

    function deleteCurrentJob() {

        if (!currentJobId) {
            return;
        }


        const job = jobCards.find(
            item => item.id === currentJobId
        );

        if (!job) {
            return;
        }


        let message =
            `Delete ${job.id}? This action cannot be undone.`;

        if (job.partsStatus === "PARTS ISSUED") {

            message =
                `${job.id} already has parts issued. ` +
                `Deleting it may create an inventory reconciliation issue.\n\n` +
                `Continue anyway?`;
        }


        const confirmed = window.confirm(message);

        if (!confirmed) {
            return;
        }


        jobCards = jobCards.filter(
            item => item.id !== currentJobId
        );


        saveJobCards();

        closeModal($("#jobCardModal"));

        currentJobId = null;

        renderAll();

        showToast(
            "Job Card Deleted",
            `${job.id} has been removed.`
        );
    }


    /* ========================================================================
       DRAFT FROM VIEW
       ======================================================================== */

    function draftCurrentJob() {

        if (!currentJobId) {
            return;
        }


        const index = jobCards.findIndex(
            item => item.id === currentJobId
        );

        if (index === -1) {
            return;
        }


        jobCards[index].status = "DRAFT";
        jobCards[index].partsStatus = "NOT SENT";
        jobCards[index].storekeeperQueue = false;
        jobCards[index].updatedAt =
            new Date().toISOString();


        saveJobCards();

        closeModal($("#jobCardModal"));

        renderAll();

        showToast(
            "Draft Saved",
            `${jobCards[index].id} is now a draft.`
        );
    }


    /* ========================================================================
       PRINT
       ======================================================================== */

    function printCurrentJob() {

        if (!currentJobId) {
            return;
        }


        const job = jobCards.find(
            item => item.id === currentJobId
        );

        if (!job) {
            return;
        }


        const popup = window.open(
            "",
            "_blank",
            "width=1000,height=800"
        );


        if (!popup) {

            showToast(
                "Print Blocked",
                "Please allow popups to print the Job Card."
            );

            return;
        }


        const rows = [

            ["Job Card", job.id],
            ["Arrival Number", job.arrivalNo],

            ["Customer Name", job.customerName],
            ["Customer ID", job.customerId],
            ["Contact", job.customerPhone],
            ["Email", job.customerEmail],
            ["Customer Type", job.customerType],
            ["Address", job.customerAddress],

            ["Registration", job.registration],
            ["VIN Number", job.vin],
            ["Chassis Number", job.chassisNo],
            ["Engine Number", job.engineNo],
            ["Make", job.make],
            ["Model", job.model],
            ["Model Year", job.modelYear],
            ["Fuel", job.fuel],
            ["Odometer", job.odometer ? `${job.odometer} KM` : ""],
            ["Mileage", job.mileage],
            ["Fuel Level", job.fuelLevel],
            ["Colour", job.vehicleColor],

            ["Service Type", job.serviceType],
            ["Visit Type", job.visitType],
            ["Supervisor", job.supervisor],
            ["Priority", job.jobPriority],

            ["Complaint", job.complaint],
            ["Additional Work", job.additionalWork],

            ["Promised Date", formatDate(job.promisedDate)],
            ["Promised Time", job.promisedTime],
            ["Delivery Date", formatDate(job.deliveryDate)],
            ["Delivery Time", job.deliveryTime],

            ["GrpCode", job.groupCode],
            ["FlorSup", job.floorSupervisor],
            ["Received By", job.receivedBy],
            ["Delivered By", job.deliveredBy],

            ["Bill No", job.billNo],
            ["INS.BillNo", job.insuranceBillNo],

            ["Insurance Company", job.insuranceCompany],
            ["Insurance Policy", job.insurancePolicyNo],

            ["Warranty", job.warrantyStatus],
            ["Warranty Reference", job.warrantyNo],

            ["Vehicle Handover", job.pickupDrop],
            ["Keys Received", job.keysReceived],
            ["Accessories / Belongings", job.accessoriesReceived],

            ["Vehicle Condition", job.conditionNotes],
            ["Supervisor Notes", job.supervisorNotes],

            ["Job Status", job.status],
            ["Parts Status", job.partsStatus]

        ];


        const htmlRows = rows.map(row => {

            return `
                <tr>
                    <td>${escapeHTML(row[0])}</td>
                    <td>${escapeHTML(row[1] || "—")}</td>
                </tr>
            `;

        }).join("");


        popup.document.write(`
            <!doctype html>

            <html>
            <head>

                <meta charset="utf-8">

                <title>${escapeHTML(job.id)}</title>

                <style>

                    body {
                        font-family: Arial, sans-serif;
                        padding: 30px;
                        color: #18212b;
                    }

                    h1 {
                        margin-bottom: 5px;
                    }

                    .meta {
                        color: #68737f;
                        margin-bottom: 25px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    td {
                        padding: 8px;
                        border: 1px solid #dfe5ea;
                        vertical-align: top;
                    }

                    td:first-child {
                        width: 30%;
                        font-weight: bold;
                        background: #f4f6f8;
                    }

                    @media print {
                        body {
                            padding: 10px;
                        }
                    }

                </style>

            </head>

            <body>

                <h1>Zimdra Automobile Workshop</h1>

                <div class="meta">
                    Job Card ${escapeHTML(job.id)}
                    · ${escapeHTML(formatDateTime(job.createdAt))}
                </div>

                <table>
                    ${htmlRows}
                </table>

                <script>
                    window.onload = function () {
                        window.print();
                    };
                <\/script>

            </body>
            </html>
        `);


        popup.document.close();
    }


    /* ========================================================================
       SEARCH
       ======================================================================== */

    function runSearch() {

        renderArrivalTable(
            $("#jobSearch").value
        );

        showView("arrival");
    }


    /* ========================================================================
       TOAST
       ======================================================================== */

    function showToast(title, message) {

        const toast = $("#toast");

        if (!toast) {
            return;
        }


        $("#toastTitle").textContent =
            title;

        $("#toastMessage").textContent =
            message;


        toast.hidden = false;


        clearTimeout(toastTimer);


        toastTimer = setTimeout(() => {
            toast.hidden = true;
        }, 4000);
    }


    /* ========================================================================
       EVENT BINDING
       ======================================================================== */

    function bindEvents() {


        /* Navigation */

        $$(".nav-item").forEach(button => {

            button.addEventListener("click", () => {

                showView(
                    button.dataset.view
                );

            });

        });


        $$("[data-view]").forEach(button => {

            if (button.classList.contains("nav-item")) {
                return;
            }

            button.addEventListener("click", () => {

                showView(
                    button.dataset.view
                );

            });

        });


        /* Add Arrival */

        $("#addArrivalBtn")?.addEventListener(
            "click",
            openNewArrivalModal
        );


        /* Form */

        $("#arrivalForm")?.addEventListener(
            "submit",
            saveJobCard
        );


        $("#saveDraftBtn")?.addEventListener(
            "click",
            saveDraft
        );


        /* Arrival Modal */

        $("#arrivalModalClose")?.addEventListener(
            "click",
            () => closeModal($("#arrivalModal"))
        );


        $("#cancelArrivalBtn")?.addEventListener(
            "click",
            () => closeModal($("#arrivalModal"))
        );


        /* Job View Modal */

        $("#jobCardModalClose")?.addEventListener(
            "click",
            () => closeModal($("#jobCardModal"))
        );


        $("#editJobBtn")?.addEventListener(
            "click",
            () => {

                if (currentJobId) {
                    editJobCard(currentJobId);
                }

            }
        );


        $("#deleteJobBtn")?.addEventListener(
            "click",
            deleteCurrentJob
        );


        $("#draftJobBtn")?.addEventListener(
            "click",
            draftCurrentJob
        );


        $("#printJobBtn")?.addEventListener(
            "click",
            printCurrentJob
        );


        /* Search */

        $("#jobSearchBtn")?.addEventListener(
            "click",
            runSearch
        );


        $("#jobSearch")?.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    runSearch();
                }

            }
        );


        /* Table buttons */

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-open-job]"
                    );

                if (!button) {
                    return;
                }

                openJobCard(
                    button.dataset.openJob
                );

            }
        );


        /* Mobile sidebar */

        $("#mobileMenuBtn")?.addEventListener(
            "click",
            () => {

                $("#sidebar")?.classList.toggle(
                    "is-open"
                );

            }
        );


        /* Backdrop */

        $("#arrivalModal")?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("#arrivalModal")
                ) {
                    closeModal($("#arrivalModal"));
                }

            }
        );


        $("#jobCardModal")?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("#jobCardModal")
                ) {
                    closeModal($("#jobCardModal"));
                }

            }
        );


        /* Escape */

        document.addEventListener(
            "keydown",
            event => {

                if (event.key !== "Escape") {
                    return;
                }


                if (!$("#arrivalModal").hidden) {

                    closeModal(
                        $("#arrivalModal")
                    );

                    return;
                }


                if (!$("#jobCardModal").hidden) {

                    closeModal(
                        $("#jobCardModal")
                    );

                }

            }
        );


        /* Logout */

        $("#logoutBtn")?.addEventListener(
            "click",
            () => {

                const confirmed = window.confirm(
                    "Sign out of Zimdra DMS?"
                );

                if (!confirmed) {
                    return;
                }

                /*
                 * Service Supervisor folder:
                 * zimdra-dms/role_dashboard/service_supervisor/
                 *
                 * auth is two levels up.
                 */

                window.location.href =
                    "../../auth/sign_in.html";

            }
        );


        /* Prevent accidental loss when editing */

        window.addEventListener(
            "beforeunload",
            event => {

                const modalOpen =
                    !$("#arrivalModal").hidden;

                if (!modalOpen) {
                    return;
                }

                /*
                 * Do not block the browser for ordinary new forms.
                 * Only warn when the user is actively editing.
                 */

                if (editingJobId) {

                    event.preventDefault();

                    event.returnValue = "";
                }

            }
        );
    }


    /* ========================================================================
       RENDER ALL
       ======================================================================== */

    function renderAll() {

        updateCurrentDate();

        renderDashboard();

        renderArrivalTable(
            $("#jobSearch")?.value || ""
        );
    }


    /* ========================================================================
       INITIALIZE
       ======================================================================== */

    function init() {

        loadJobCards();

        bindEvents();

        renderAll();

        showView("dashboard");
    }


    init();

})();