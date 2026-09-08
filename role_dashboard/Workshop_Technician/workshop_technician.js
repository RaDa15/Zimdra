/* ============================================================
   ZIMDRA DMS
   WORKSHOP TECHNICIAN
   Prototype / LocalStorage
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       CONFIG
    ======================================================== */

    const STORAGE_KEY = "zimdra_workshop_technician_v1";

    /*
       This is the same Storekeeper storage key used by the
       Storekeeper screen created earlier.
    */
    const STOREKEEPER_KEY = "zimdra_storekeeper_v2";

    const CURRENT_TECHNICIAN = "Pema Wangchuk";


    /* ========================================================
       DOM HELPERS
    ======================================================== */

    const $ = (selector) =>
        document.querySelector(selector);

    const $$ = (selector) =>
        document.querySelectorAll(selector);


    /* ========================================================
       STATE
    ======================================================== */

    let state = loadState();

    let currentJobId = null;


    /* ========================================================
       DEFAULT STATE
    ======================================================== */

    function createDefaultState() {

        return {

            technician: CURRENT_TECHNICIAN,

            jobs: [],

            parts: [],

            notifications: [],

            counter: {

                request: 0

            }

        };

    }


    /* ========================================================
       LOAD STATE
    ======================================================== */

    function loadState() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (saved) {

                return JSON.parse(saved);

            }

        } catch (error) {

            console.error(
                "Unable to load technician data",
                error
            );

        }

        return createDefaultState();

    }


    /* ========================================================
       SAVE STATE
    ======================================================== */

    function saveState() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );

    }


    /* ========================================================
       DEMO DATA
    ======================================================== */

    function demoState() {

        const today = new Date();

        return {

            technician: CURRENT_TECHNICIAN,

            jobs: [

                {
                    id: "JC-2026-001",

                    customer: "Karma Dorji",

                    mobile: "17123456",

                    vehicle: "Toyota Hilux",

                    registration: "BP-1-A1234",

                    technician: "Pema Wangchuk",

                    supervisor: "Sonam Dorji",

                    jobType: "General Service",

                    complaint:
                        "Vehicle due for periodic service. Customer reports engine vibration during idle.",

                    status: "In Progress",

                    assignedDate: "2026-09-08",

                    startedAt:
                        "2026-09-08T08:45:00",

                    checklist: [

                        {
                            id: "W001",
                            text: "Engine oil inspection",
                            completed: true
                        },

                        {
                            id: "W002",
                            text: "Replace engine oil",
                            completed: false
                        },

                        {
                            id: "W003",
                            text: "Replace oil filter",
                            completed: false
                        },

                        {
                            id: "W004",
                            text: "Inspect air filter",
                            completed: false
                        },

                        {
                            id: "W005",
                            text: "Inspect brake system",
                            completed: false
                        }

                    ],

                    notes:
                        "Initial inspection completed. Engine oil condition poor. Further inspection required.",

                    parts: [

                        {
                            code: "OF-1024",
                            name: "Toyota Oil Filter",
                            requested: 1,
                            issued: 1,
                            status: "Issued"
                        },

                        {
                            code: "AF-2031",
                            name: "Toyota Air Filter",
                            requested: 1,
                            issued: 1,
                            status: "Issued"
                        },

                        {
                            code: "BP-4001",
                            name: "Front Brake Pad Set",
                            requested: 2,
                            issued: 0,
                            status: "Pending"
                        }

                    ]

                },


                {
                    id: "JC-2026-002",

                    customer: "Tashi Wangmo",

                    mobile: "17654321",

                    vehicle: "Toyota Fortuner",

                    registration: "BP-2-B7788",

                    technician: "Pema Wangchuk",

                    supervisor: "Sonam Dorji",

                    jobType: "Brake Service",

                    complaint:
                        "Customer reports squeaking noise from front brakes.",

                    status: "Waiting for Parts",

                    assignedDate: "2026-09-08",

                    startedAt:
                        "2026-09-08T09:15:00",

                    checklist: [

                        {
                            id: "W006",
                            text: "Inspect front brake pads",
                            completed: true
                        },

                        {
                            id: "W007",
                            text: "Remove old brake pads",
                            completed: false
                        },

                        {
                            id: "W008",
                            text: "Install new brake pads",
                            completed: false
                        },

                        {
                            id: "W009",
                            text: "Check brake fluid",
                            completed: false
                        },

                        {
                            id: "W010",
                            text: "Road test vehicle",
                            completed: false
                        }

                    ],

                    notes:
                        "Front brake pads require replacement.",

                    parts: [

                        {
                            code: "BP-4001",
                            name: "Front Brake Pad Set",
                            requested: 1,
                            issued: 0,
                            status: "Pending"
                        },

                        {
                            code: "BF-7012",
                            name: "Brake Fluid 500ml",
                            requested: 1,
                            issued: 0,
                            status: "Pending"
                        }

                    ]

                },


                {
                    id: "JC-2026-003",

                    customer: "Dorji Tshering",

                    mobile: "17789012",

                    vehicle: "Toyota Prado",

                    registration: "BP-3-C4567",

                    technician: "Pema Wangchuk",

                    supervisor: "Sonam Dorji",

                    jobType: "Engine Service",

                    complaint:
                        "Engine oil service and filter replacement.",

                    status: "Work Completed",

                    assignedDate: "2026-09-07",

                    startedAt:
                        "2026-09-07T10:00:00",

                    completedAt:
                        "2026-09-07T14:45:00",

                    checklist: [

                        {
                            id: "W011",
                            text: "Drain old engine oil",
                            completed: true
                        },

                        {
                            id: "W012",
                            text: "Replace oil filter",
                            completed: true
                        },

                        {
                            id: "W013",
                            text: "Fill new engine oil",
                            completed: true
                        },

                        {
                            id: "W014",
                            text: "Check engine leaks",
                            completed: true
                        },

                        {
                            id: "W015",
                            text: "Run engine inspection",
                            completed: true
                        }

                    ],

                    notes:
                        "Engine oil and oil filter replaced. No visible leaks detected.",

                    parts: [

                        {
                            code: "EO-9012",
                            name: "Engine Oil 5W-30 1L",
                            requested: 4,
                            issued: 4,
                            status: "Issued"
                        },

                        {
                            code: "OF-1024",
                            name: "Toyota Oil Filter",
                            requested: 1,
                            issued: 1,
                            status: "Issued"
                        }

                    ]

                },


                {
                    id: "JC-2026-004",

                    customer: "Ugyen Phuntsho",

                    mobile: "17223344",

                    vehicle: "Toyota Corolla",

                    registration: "BP-4-D9087",

                    technician: "Pema Wangchuk",

                    supervisor: "Sonam Dorji",

                    jobType: "Periodic Service",

                    complaint:
                        "Periodic service due.",

                    status: "Assigned",

                    assignedDate: "2026-09-08",

                    startedAt: null,

                    checklist: [

                        {
                            id: "W016",
                            text: "Vehicle inspection",
                            completed: false
                        },

                        {
                            id: "W017",
                            text: "Engine oil inspection",
                            completed: false
                        },

                        {
                            id: "W018",
                            text: "Brake inspection",
                            completed: false
                        },

                        {
                            id: "W019",
                            text: "Battery inspection",
                            completed: false
                        }

                    ],

                    notes: "",

                    parts: [

                        {
                            code: "OF-1024",
                            name: "Toyota Oil Filter",
                            requested: 1,
                            issued: 0,
                            status: "Pending"
                        }

                    ]

                }

            ],

            parts: [

                {
                    id: "PR-20260908-001",
                    jobCardId: "JC-2026-001",
                    code: "BP-4001",
                    name: "Front Brake Pad Set",
                    requested: 2,
                    issued: 0,
                    status: "Pending",
                    priority: "Urgent",
                    reason: "Front brake pads worn and require replacement.",
                    requestedBy: CURRENT_TECHNICIAN,
                    requestedAt: today.toISOString()
                },

                {
                    id: "PR-20260908-002",
                    jobCardId: "JC-2026-002",
                    code: "BP-4001",
                    name: "Front Brake Pad Set",
                    requested: 1,
                    issued: 0,
                    status: "Pending",
                    priority: "Normal",
                    reason: "Replace worn front brake pads.",
                    requestedBy: CURRENT_TECHNICIAN,
                    requestedAt: today.toISOString()
                },

                {
                    id: "PR-20260908-003",
                    jobCardId: "JC-2026-002",
                    code: "BF-7012",
                    name: "Brake Fluid 500ml",
                    requested: 1,
                    issued: 0,
                    status: "Pending",
                    priority: "Normal",
                    reason: "Brake fluid replacement.",
                    requestedBy: CURRENT_TECHNICIAN,
                    requestedAt: today.toISOString()
                }

            ],

            notifications: [

                {
                    id: "N001",
                    message:
                        "Parts request PR-20260908-001 is waiting for Storekeeper.",
                    read: false
                },

                {
                    id: "N002",
                    message:
                        "Job JC-2026-003 is ready for Supervisor inspection.",
                    read: false
                }

            ],

            counter: {
                request: 3
            }

        };

    }


    /* ========================================================
       LOAD DEMO
    ======================================================== */

    function loadDemoData() {

        const confirmed =
            confirm(
                "Load technician demo data? Existing technician data will be replaced."
            );

        if (!confirmed) {
            return;
        }

        state = demoState();

        saveState();

        renderAll();

        showToast(
            "Demo data loaded",
            "Technician jobs, parts requests and work history are ready."
        );

    }


    /* ========================================================
       INITIALIZE
    ======================================================== */

    function initialize() {

        if (
            !state.jobs ||
            state.jobs.length === 0
        ) {

            state = demoState();

            saveState();

        }

        updateTechnicianInfo();

        renderAll();

        setupEvents();

        syncWithStorekeeper();

    }


    /* ========================================================
       TECHNICIAN INFO
    ======================================================== */

    function updateTechnicianInfo() {

        const technician =
            state.technician || CURRENT_TECHNICIAN;

        const firstName =
            technician.split(" ")[0];

        if ($("#loggedInTechnician")) {
            $("#loggedInTechnician").textContent =
                technician;
        }

        if ($("#welcomeTechnician")) {
            $("#welcomeTechnician").textContent =
                firstName;
        }

    }


    /* ========================================================
       NAVIGATION
    ======================================================== */

    function openTab(tabName) {

        $$(".nav-item").forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.tab === tabName
            );

        });


        $$(".page").forEach(page => {

            page.classList.remove("active");

        });


        const page =
            document.getElementById(
                `${tabName}Page`
            );

        if (page) {

            page.classList.add("active");

        }


        const titles = {

            dashboard:
                "Technician Dashboard",

            jobs:
                "My Jobs",

            parts:
                "Parts Requests",

            history:
                "Work History"

        };

        $("#pageTitle").textContent =
            titles[tabName] || "Technician";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ========================================================
       JOB WORKSPACE
    ======================================================== */

    function openJob(jobId) {

        const job =
            state.jobs.find(
                item => item.id === jobId
            );

        if (!job) {

            showToast(
                "Job not found",
                "The selected Job Card could not be loaded.",
                "error"
            );

            return;

        }

        currentJobId = jobId;

        populateWorkspace(job);

        $$(".page").forEach(page => {

            page.classList.remove("active");

        });

        $("#workspacePage").classList.add("active");

        $$(".nav-item").forEach(button => {

            button.classList.remove("active");

        });

        $("#pageTitle").textContent =
            `Job Card ${job.id}`;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ========================================================
       POPULATE WORKSPACE
    ======================================================== */

    function populateWorkspace(job) {

        $("#workspaceJobCard").textContent =
            job.id;

        $("#workspaceJobType").textContent =
            job.jobType;

        $("#workspaceCustomer").textContent =
            job.customer;

        $("#workspaceVehicle").textContent =
            `${job.vehicle} • ${job.registration}`;


        $("#detailCustomer").textContent =
            job.customer;

        $("#detailMobile").textContent =
            job.mobile || "—";

        $("#detailVehicle").textContent =
            job.vehicle;

        $("#detailRegistration").textContent =
            job.registration;

        $("#detailTechnician").textContent =
            job.technician;

        $("#detailSupervisor").textContent =
            job.supervisor;

        $("#detailComplaint").textContent =
            job.complaint || "—";


        $("#technicianNotes").value =
            job.notes || "";


        renderWorkspaceStatus(job);

        renderChecklist(job);

        renderWorkspaceParts(job);

        updateProgress(job);

    }


    /* ========================================================
       STATUS CLASS
    ======================================================== */

    function statusClass(status) {

        return status
            .toLowerCase()
            .replace(/\s+/g, "-");

    }


    /* ========================================================
       RENDER STATUS
    ======================================================== */

    function renderWorkspaceStatus(job) {

        const badge =
            $("#workspaceStatus");

        badge.textContent =
            job.status;

        badge.className =
            `status-badge large ${statusClass(job.status)}`;


        const startButton =
            $("#startWorkBtn");

        if (
            job.status === "Assigned"
        ) {

            startButton.style.display =
                "inline-flex";

            startButton.textContent =
                "Start Work";

        }

        else if (
            job.status === "Submitted to Supervisor"
        ) {

            startButton.style.display =
                "none";

        }

        else {

            startButton.style.display =
                "inline-flex";

            startButton.textContent =
                "Update Work";

        }

    }


    /* ========================================================
       CHECKLIST
    ======================================================== */

    function renderChecklist(job) {

        const container =
            $("#checklistContainer");

        container.innerHTML = "";


        if (
            !job.checklist ||
            job.checklist.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">
                    <strong>No work items</strong>
                    Add work items to track the repair.
                </div>
            `;

            updateChecklistProgress(job);

            return;

        }


        job.checklist.forEach(item => {

            const row =
                document.createElement("div");

            row.className =
                `check-item ${
                    item.completed
                        ? "completed"
                        : ""
                }`;

            row.innerHTML = `

                <input
                    type="checkbox"
                    id="check-${item.id}"
                    data-check-id="${item.id}"
                    ${item.completed ? "checked" : ""}
                >

                <label for="check-${item.id}">
                    ${escapeHtml(item.text)}
                </label>

                <button
                    class="delete-work"
                    type="button"
                    data-delete-work="${item.id}"
                    title="Remove">
                    ×
                </button>

            `;

            container.appendChild(row);

        });


        updateChecklistProgress(job);

    }


    /* ========================================================
       UPDATE CHECKLIST PROGRESS
    ======================================================== */

    function updateChecklistProgress(job) {

        const total =
            job.checklist?.length || 0;

        const completed =
            job.checklist
                ?.filter(item => item.completed)
                .length || 0;

        $("#checklistProgress").textContent =
            `${completed} / ${total} Completed`;

    }


    /* ========================================================
       UPDATE JOB PROGRESS
    ======================================================== */

    function updateProgress(job) {

        const total =
            job.checklist?.length || 0;

        const completed =
            job.checklist
                ?.filter(item => item.completed)
                .length || 0;

        let percent = 0;

        if (total > 0) {

            percent =
                Math.round(
                    (completed / total) * 100
                );

        }


        if (
            job.status === "Submitted to Supervisor"
        ) {

            percent = 100;

        }


        $("#progressPercent").textContent =
            `${percent}%`;

        $("#progressBar").style.width =
            `${percent}%`;

    }


    /* ========================================================
       WORKSPACE PARTS
    ======================================================== */

    function renderWorkspaceParts(job) {

        const container =
            $("#workspacePartsList");

        container.innerHTML = "";


        if (
            !job.parts ||
            job.parts.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">
                    <strong>No parts</strong>
                    No parts have been requested for this job.
                </div>
            `;

            return;

        }


        job.parts.forEach(part => {

            const card =
                document.createElement("div");

            card.className =
                "part-card";

            const status =
                part.issued >= part.requested
                    ? "Issued"
                    : part.issued > 0
                        ? "Partially Issued"
                        : "Pending";


            card.innerHTML = `

                <div class="part-top">

                    <div>

                        <strong>
                            ${escapeHtml(part.name)}
                        </strong>

                        <div class="part-code">
                            ${escapeHtml(part.code)}
                        </div>

                    </div>

                    <span class="status-badge ${
                        status === "Issued"
                            ? "issued"
                            : "pending"
                    }">
                        ${status}
                    </span>

                </div>

                <div class="part-meta">

                    <span>
                        Requested:
                        <strong>${part.requested}</strong>
                    </span>

                    <span>
                        Issued:
                        <strong>${part.issued}</strong>
                    </span>

                </div>

            `;

            container.appendChild(card);

        });

    }


    /* ========================================================
       RENDER DASHBOARD
    ======================================================== */

    function renderDashboard() {

        const jobs =
            state.jobs || [];


        const assigned =
            jobs.filter(
                job =>
                    job.status !==
                    "Submitted to Supervisor"
            ).length;

        const progress =
            jobs.filter(
                job =>
                    job.status ===
                    "In Progress"
            ).length;

        const waiting =
            jobs.filter(
                job =>
                    job.status ===
                    "Waiting for Parts"
            ).length;

        const completed =
            jobs.filter(
                job =>
                    job.status ===
                    "Work Completed" ||
                    job.status ===
                    "Submitted to Supervisor"
            ).length;


        $("#statAssigned").textContent =
            assigned;

        $("#statProgress").textContent =
            progress;

        $("#statWaiting").textContent =
            waiting;

        $("#statCompleted").textContent =
            completed;


        renderDashboardJobs();

        renderPartsAlerts();

    }


    /* ========================================================
       DASHBOARD JOBS
    ======================================================== */

    function renderDashboardJobs() {

        const body =
            $("#dashboardJobsBody");

        body.innerHTML = "";


        const jobs =
            state.jobs.slice(0, 5);


        if (jobs.length === 0) {

            body.innerHTML = emptyRow(
                6,
                "No jobs assigned"
            );

            return;

        }


        jobs.forEach(job => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td class="mono">
                    ${escapeHtml(job.id)}
                </td>

                <td>
                    ${escapeHtml(job.customer)}
                </td>

                <td>
                    ${escapeHtml(job.vehicle)}
                </td>

                <td>
                    ${escapeHtml(job.jobType)}
                </td>

                <td>
                    <span class="status-badge ${
                        statusClass(job.status)
                    }">
                        ${escapeHtml(job.status)}
                    </span>
                </td>

                <td>
                    <button
                        class="table-action"
                        data-open-job="${job.id}">
                        Open
                    </button>
                </td>

            `;

            body.appendChild(row);

        });

    }


    /* ========================================================
       PART ALERTS
    ======================================================== */

    function renderPartsAlerts() {

        const container =
            $("#partsAlerts");

        container.innerHTML = "";


        const requests =
            state.parts
                .filter(
                    item =>
                        item.status === "Pending"
                )
                .slice(0, 5);


        $("#notificationCount").textContent =
            requests.length;


        if (requests.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    <strong>No pending requests</strong>
                    All current parts requests have been processed.
                </div>
            `;

            return;

        }


        requests.forEach(request => {

            const item =
                document.createElement("div");

            item.className =
                "alert-item";

            item.innerHTML = `

                <div>

                    <strong>
                        ${escapeHtml(request.name)}
                    </strong>

                    <span>
                        ${escapeHtml(request.jobCardId)}
                        · Qty ${request.requested}
                    </span>

                </div>

                <span class="status-badge pending">
                    ${escapeHtml(request.priority)}
                </span>

            `;

            container.appendChild(item);

        });

    }


    /* ========================================================
       RENDER JOB TABLE
    ======================================================== */

    function renderJobs() {

        const body =
            $("#jobsTableBody");

        body.innerHTML = "";


        const search =
            ($("#jobSearch").value || "")
                .trim()
                .toLowerCase();

        const filter =
            $("#jobStatusFilter").value;


        const jobs =
            state.jobs.filter(job => {

                const matchesSearch =
                    !search ||
                    job.id.toLowerCase().includes(search) ||
                    job.customer.toLowerCase().includes(search) ||
                    job.vehicle.toLowerCase().includes(search) ||
                    job.registration.toLowerCase().includes(search);

                const matchesStatus =
                    filter === "All" ||
                    job.status === filter;

                return (
                    matchesSearch &&
                    matchesStatus
                );

            });


        if (jobs.length === 0) {

            body.innerHTML =
                emptyRow(
                    8,
                    "No matching jobs found"
                );

            return;

        }


        jobs.forEach(job => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td class="mono">
                    ${escapeHtml(job.id)}
                </td>

                <td>
                    ${escapeHtml(job.customer)}
                </td>

                <td>
                    ${escapeHtml(job.vehicle)}
                </td>

                <td class="mono">
                    ${escapeHtml(job.registration)}
                </td>

                <td>
                    ${escapeHtml(job.supervisor)}
                </td>

                <td>
                    ${escapeHtml(job.jobType)}
                </td>

                <td>
                    <span class="status-badge ${
                        statusClass(job.status)
                    }">
                        ${escapeHtml(job.status)}
                    </span>
                </td>

                <td>
                    <button
                        class="table-action"
                        data-open-job="${job.id}">
                        Open Job
                    </button>
                </td>

            `;

            body.appendChild(row);

        });

    }


    /* ========================================================
       PART REQUEST TABLE
    ======================================================== */

    function renderPartsTable() {

        const body =
            $("#partsTableBody");

        body.innerHTML = "";


        const requests =
            state.parts || [];


        if (requests.length === 0) {

            body.innerHTML =
                emptyRow(
                    7,
                    "No parts requests"
                );

            return;

        }


        requests.forEach(request => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td class="mono">
                    ${escapeHtml(request.id)}
                </td>

                <td class="mono">
                    ${escapeHtml(request.jobCardId)}
                </td>

                <td>

                    <strong>
                        ${escapeHtml(request.name)}
                    </strong>

                    <div class="part-code">
                        ${escapeHtml(request.code)}
                    </div>

                </td>

                <td>
                    ${request.requested}
                </td>

                <td>
                    ${request.issued}
                </td>

                <td>

                    <span class="status-badge ${
                        request.status === "Issued"
                            ? "issued"
                            : "pending"
                    }">
                        ${escapeHtml(request.status)}
                    </span>

                </td>

                <td>
                    ${formatDateTime(
                        request.requestedAt
                    )}
                </td>

            `;

            body.appendChild(row);

        });

    }


    /* ========================================================
       HISTORY
    ======================================================== */

    function renderHistory() {

        const body =
            $("#historyTableBody");

        body.innerHTML = "";


        const jobs =
            state.jobs.filter(
                job =>
                    job.status ===
                    "Work Completed" ||
                    job.status ===
                    "Submitted to Supervisor"
            );


        if (jobs.length === 0) {

            body.innerHTML =
                emptyRow(
                    7,
                    "No completed work yet"
                );

            return;

        }


        jobs.forEach(job => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td class="mono">
                    ${escapeHtml(job.id)}
                </td>

                <td>
                    ${escapeHtml(job.customer)}
                </td>

                <td>
                    ${escapeHtml(job.vehicle)}
                </td>

                <td>
                    ${escapeHtml(job.jobType)}
                </td>

                <td>
                    ${
                        formatDateTime(
                            job.completedAt
                        )
                    }
                </td>

                <td>
                    ${escapeHtml(job.supervisor)}
                </td>

                <td>
                    <span class="status-badge ${
                        statusClass(job.status)
                    }">
                        ${escapeHtml(job.status)}
                    </span>
                </td>

            `;

            body.appendChild(row);

        });

    }


    /* ========================================================
       RENDER ALL
    ======================================================== */

    function renderAll() {

        renderDashboard();

        renderJobs();

        renderPartsTable();

        renderHistory();

        updateTechnicianInfo();

        if (currentJobId) {

            const job =
                state.jobs.find(
                    item =>
                        item.id === currentJobId
                );

            if (job) {

                populateWorkspace(job);

            }

        }

        updateCurrentDate();

    }


    /* ========================================================
       START WORK
    ======================================================== */

    function startWork() {

        const job =
            getCurrentJob();

        if (!job) {
            return;
        }


        if (
            job.status ===
            "Submitted to Supervisor"
        ) {

            showToast(
                "Job already submitted",
                "This job has already been sent to the Supervisor.",
                "error"
            );

            return;

        }


        if (!job.startedAt) {

            job.startedAt =
                new Date().toISOString();

        }


        job.status =
            "In Progress";


        saveState();

        renderAll();

        showToast(
            "Work started",
            `${job.id} is now marked as In Progress.`
        );

    }


    /* ========================================================
       CHANGE JOB STATUS
    ======================================================== */

    function changeJobStatus(status) {

        const job =
            getCurrentJob();

        if (!job) {
            return;
        }


        if (
            status === "Work Completed"
        ) {

            const incomplete =
                (job.checklist || [])
                    .filter(
                        item =>
                            !item.completed
                    );

            if (incomplete.length > 0) {

                const proceed =
                    confirm(
                        `${incomplete.length} work item(s) are still incomplete. Mark the job as Work Completed anyway?`
                    );

                if (!proceed) {
                    return;
                }

            }

            job.completedAt =
                new Date().toISOString();

        }


        job.status = status;

        saveState();

        renderAll();

        showToast(
            "Job status updated",
            `${job.id} is now "${status}".`
        );

    }


    /* ========================================================
       SUBMIT TO SUPERVISOR
    ======================================================== */

    function submitToSupervisor() {

        const job =
            getCurrentJob();

        if (!job) {
            return;
        }


        const incomplete =
            (job.checklist || [])
                .filter(
                    item =>
                        !item.completed
                );


        if (incomplete.length > 0) {

            showToast(
                "Work incomplete",
                "Complete all checklist items before submitting the job.",
                "error"
            );

            return;

        }


        const pendingParts =
            (job.parts || [])
                .filter(
                    part =>
                        part.issued <
                        part.requested
                );


        if (pendingParts.length > 0) {

            const proceed =
                confirm(
                    "Some requested parts have not been fully issued. Submit the job anyway?"
                );

            if (!proceed) {
                return;
            }

        }


        if (
            !job.notes ||
            !job.notes.trim()
        ) {

            const proceed =
                confirm(
                    "Technician notes are empty. Submit without notes?"
                );

            if (!proceed) {
                return;
            }

        }


        job.status =
            "Submitted to Supervisor";

        job.completedAt =
            job.completedAt ||
            new Date().toISOString();

        job.submittedAt =
            new Date().toISOString();


        state.notifications.push({

            id:
                `N-${Date.now()}`,

            message:
                `${job.id} has been submitted to ${job.supervisor} for inspection.`,

            read: false

        });


        saveState();

        renderAll();

        showToast(
            "Submitted to Supervisor",
            `${job.id} has been handed over for inspection.`
        );

    }


    /* ========================================================
       CHECKLIST CHANGE
    ======================================================== */

    function toggleChecklistItem(itemId) {

        const job =
            getCurrentJob();

        if (!job) {
            return;
        }


        const item =
            job.checklist.find(
                work =>
                    work.id === itemId
            );

        if (!item) {
            return;
        }


        item.completed =
            !item.completed;


        if (
            item.completed &&
            job.status === "Assigned"
        ) {

            job.status =
                "In Progress";

            job.startedAt =
                job.startedAt ||
                new Date().toISOString();

        }


        saveState();

        renderAll();

    }


    /* ========================================================
       DELETE WORK ITEM
    ======================================================== */

    function deleteWorkItem(itemId) {

        const job =
            getCurrentJob();

        if (!job) {
            return;
        }


        const item =
            job.checklist.find(
                work =>
                    work.id === itemId
            );

        if (!item) {
            return;
        }


        const confirmed =
            confirm(
                `Remove "${item.text}" from the work checklist?`
            );

        if (!confirmed) {
            return;
        }


        job.checklist =
            job.checklist.filter(
                work =>
                    work.id !== itemId
            );


        saveState();

        renderAll();

    }


    /* ========================================================
       ADD WORK ITEM
    ======================================================== */

    function addWorkItem(name) {

        const job =
            getCurrentJob();

        if (!job) {
            return;
        }


        const cleanName =
            name.trim();

        if (!cleanName) {
            return;
        }


        const newItem = {

            id:
                `W-${Date.now()}`,

            text:
                cleanName,

            completed:
                false

        };


        if (!job.checklist) {

            job.checklist = [];

        }


        job.checklist.push(newItem);

        saveState();

        closeModal("workItemModal");

        $("#workItemForm").reset();

        renderAll();

        showToast(
            "Work item added",
            cleanName
        );

    }


    /* ========================================================
       PART REQUEST
    ======================================================== */

    function openPartRequestModal(jobId = null) {

        const selectedJobId =
            jobId ||
            currentJobId;


        if (!selectedJobId) {

            showToast(
                "Select a job first",
                "Open a Job Card before requesting a part.",
                "error"
            );

            return;

        }


        $("#requestJobCard").value =
            selectedJobId;


        populatePartOptions();


        openModal("partRequestModal");

    }


    /* ========================================================
       PART OPTIONS
    ======================================================== */

    function populatePartOptions() {

        const select =
            $("#requestPart");

        select.innerHTML = `
            <option value="">
                Select Part
            </option>
        `;


        const inventory =
            getStorekeeperInventory();


        if (
            inventory &&
            inventory.length
        ) {

            inventory.forEach(part => {

                const option =
                    document.createElement("option");

                option.value =
                    part.partId ||
                    part.id ||
                    part.code ||
                    "";

                option.textContent =
                    `${part.partName || part.name} (${part.stock ?? 0} in stock)`;

                select.appendChild(option);

            });

            return;

        }


        /*
           Fallback prototype inventory.
        */

        const fallbackParts = [

            {
                id: "OF-1024",
                name: "Toyota Oil Filter"
            },

            {
                id: "AF-2031",
                name: "Toyota Air Filter"
            },

            {
                id: "BP-4001",
                name: "Front Brake Pad Set"
            },

            {
                id: "SP-3010",
                name: "Iridium Spark Plug"
            },

            {
                id: "BF-7012",
                name: "Brake Fluid 500ml"
            },

            {
                id: "EO-9012",
                name: "Engine Oil 5W-30 1L"
            },

            {
                id: "CO-8011",
                name: "Coolant 1L"
            },

            {
                id: "WB-5010",
                name: "Wiper Blade 24 inch"
            }

        ];


        fallbackParts.forEach(part => {

            const option =
                document.createElement("option");

            option.value =
                part.id;

            option.textContent =
                part.name;

            select.appendChild(option);

        });

    }


    /* ========================================================
       CREATE PART REQUEST
    ======================================================== */

    function createPartRequest() {

        const jobId =
            $("#requestJobCard").value;

        const partCode =
            $("#requestPart").value;

        const quantity =
            Number(
                $("#requestQuantity").value
            );

        const priority =
            $("#requestPriority").value;

        const reason =
            $("#requestReason").value.trim();


        if (
            !jobId ||
            !partCode ||
            quantity <= 0 ||
            !reason
        ) {

            showToast(
                "Missing information",
                "Please complete all part request fields.",
                "error"
            );

            return;

        }


        const job =
            state.jobs.find(
                item =>
                    item.id === jobId
            );

        if (!job) {
            return;
        }


        const inventoryPart =
            findInventoryPart(partCode);


        const partName =
            inventoryPart?.partName ||
            inventoryPart?.name ||
            getFallbackPartName(partCode);


        state.counter.request++;

        const requestId =
            `PR-${formatDateId()}-${String(
                state.counter.request
            ).padStart(3, "0")}`;


        const request = {

            id: requestId,

            jobCardId: jobId,

            code: partCode,

            name: partName,

            requested: quantity,

            issued: 0,

            status: "Pending",

            priority,

            reason,

            requestedBy:
                state.technician,

            requestedAt:
                new Date().toISOString()

        };


        state.parts.push(request);


        /*
           Add request to current job.
        */

        if (!job.parts) {

            job.parts = [];

        }


        const existing =
            job.parts.find(
                part =>
                    part.code === partCode &&
                    part.status !== "Issued"
            );


        if (existing) {

            existing.requested +=
                quantity;

        }

        else {

            job.parts.push({

                code: partCode,

                name: partName,

                requested: quantity,

                issued: 0,

                status: "Pending"

            });

        }


        /*
           A part request means the technician
           is waiting for store support.
        */

        if (
            job.status === "In Progress"
        ) {

            job.status =
                "Waiting for Parts";

        }


        state.notifications.push({

            id:
                `N-${Date.now()}`,

            message:
                `Part request ${requestId} sent to Storekeeper.`,

            read: false

        });


        saveState();

        closeModal("partRequestModal");

        $("#partRequestForm").reset();

        renderAll();

        showToast(
            "Part request sent",
            `${partName} × ${quantity} requested for ${jobId}.`
        );

    }


    /* ========================================================
       STOREKEEPER INTEGRATION
    ======================================================== */

    function getStorekeeperState() {

        try {

            const raw =
                localStorage.getItem(
                    STOREKEEPER_KEY
                );

            if (!raw) {
                return null;
            }

            return JSON.parse(raw);

        } catch (error) {

            console.error(
                "Unable to read Storekeeper data",
                error
            );

            return null;

        }

    }


    function getStorekeeperInventory() {

        const storeState =
            getStorekeeperState();

        if (!storeState) {
            return [];
        }


        return (
            storeState.inventory ||
            []
        );

    }


    function findInventoryPart(code) {

        const inventory =
            getStorekeeperInventory();


        return inventory.find(part => {

            const id =
                part.partId ||
                part.id ||
                part.code;

            return id === code;

        });

    }


    function syncWithStorekeeper() {

        const storeState =
            getStorekeeperState();

        if (!storeState) {
            return;
        }


        /*
           Storekeeper transaction format may vary
           slightly depending on the version.

           We look for Workshop Issue transactions
           and synchronize issued quantities.
        */

        const transactions =
            storeState.transactions ||
            storeState.stockTransactions ||
            [];


        if (!Array.isArray(transactions)) {
            return;
        }


        let changed = false;


        state.parts.forEach(request => {

            const issuedQty =
                transactions
                    .filter(transaction => {

                        const type =
                            transaction.type ||
                            transaction.transactionType ||
                            "";

                        const jobId =
                            transaction.jobCardId ||
                            transaction.jobId ||
                            "";

                        const code =
                            transaction.partId ||
                            transaction.code ||
                            transaction.partCode ||
                            "";

                        return (
                            type.toLowerCase()
                                .includes("issue") &&
                            jobId ===
                                request.jobCardId &&
                            code ===
                                request.code
                        );

                    })
                    .reduce(
                        (
                            total,
                            transaction
                        ) => {

                            return total +
                                Number(
                                    transaction.quantity ||
                                    transaction.qty ||
                                    transaction.issuedQty ||
                                    0
                                );

                        },
                        0
                    );


            if (
                issuedQty !==
                Number(request.issued)
            ) {

                request.issued =
                    Math.min(
                        issuedQty,
                        request.requested
                    );

                request.status =
                    request.issued >=
                    request.requested
                        ? "Issued"
                        : request.issued > 0
                            ? "Partially Issued"
                            : "Pending";

                changed = true;

            }

        });


        /*
           Also synchronize job-level parts.
        */

        state.jobs.forEach(job => {

            if (!job.parts) {
                return;
            }


            job.parts.forEach(jobPart => {

                const relatedRequests =
                    state.parts.filter(
                        request =>
                            request.jobCardId ===
                                job.id &&
                            request.code ===
                                jobPart.code
                    );


                const totalIssued =
                    relatedRequests.reduce(
                        (
                            total,
                            request
                        ) =>
                            total +
                            Number(
                                request.issued || 0
                            ),
                        0
                    );


                if (
                    totalIssued >
                    jobPart.issued
                ) {

                    jobPart.issued =
                        totalIssued;

                    jobPart.status =
                        jobPart.issued >=
                        jobPart.requested
                            ? "Issued"
                            : "Pending";

                    changed = true;

                }

            });

        });


        if (changed) {

            saveState();

            renderAll();

        }

    }


    /* ========================================================
       NOTES
    ======================================================== */

    function saveTechnicianNotes() {

        const job =
            getCurrentJob();

        if (!job) {
            return;
        }


        job.notes =
            $("#technicianNotes")
                .value;


        saveState();

    }


    /* ========================================================
       CURRENT JOB
    ======================================================== */

    function getCurrentJob() {

        if (!currentJobId) {
            return null;
        }


        return state.jobs.find(
            job =>
                job.id === currentJobId
        ) || null;

    }


    /* ========================================================
       MODALS
    ======================================================== */

    function openModal(id) {

        const modal =
            document.getElementById(id);

        if (modal) {

            modal.classList.add("active");

        }

    }


    function closeModal(id) {

        const modal =
            document.getElementById(id);

        if (modal) {

            modal.classList.remove("active");

        }

    }


    /* ========================================================
       TOAST
    ======================================================== */

    let toastTimer = null;

    function showToast(
        title,
        message,
        type = "success"
    ) {

        const toast =
            $("#toast");

        const icon =
            $("#toastIcon");


        $("#toastTitle").textContent =
            title;

        $("#toastMessage").textContent =
            message;


        icon.textContent =
            type === "error"
                ? "!"
                : "✓";


        icon.style.background =
            type === "error"
                ? "var(--red)"
                : "var(--green)";


        toast.classList.add("active");


        clearTimeout(toastTimer);

        toastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "active"
                );

            }, 3500);

    }


    /* ========================================================
       EMPTY TABLE ROW
    ======================================================== */

    function emptyRow(
        colspan,
        message
    ) {

        return `

            <tr>

                <td colspan="${colspan}">

                    <div class="empty-state">

                        <strong>
                            ${escapeHtml(message)}
                        </strong>

                        Nothing to display.

                    </div>

                </td>

            </tr>

        `;

    }


    /* ========================================================
       DATE
    ======================================================== */

    function updateCurrentDate() {

        const now =
            new Date();

        $("#currentDate").textContent =
            now.toLocaleDateString(
                "en-BT",
                {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

    }


    function formatDateTime(value) {

        if (!value) {
            return "—";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "—";

        }


        return date.toLocaleString(
            "en-BT",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    function formatDateId() {

        const date =
            new Date();

        const y =
            date.getFullYear();

        const m =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const d =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${y}${m}${d}`;

    }


    /* ========================================================
       FALLBACK PART NAME
    ======================================================== */

    function getFallbackPartName(code) {

        const parts = {

            "OF-1024":
                "Toyota Oil Filter",

            "AF-2031":
                "Toyota Air Filter",

            "BP-4001":
                "Front Brake Pad Set",

            "SP-3010":
                "Iridium Spark Plug",

            "EF-5011":
                "Engine Air Filter",

            "BF-7012":
                "Brake Fluid 500ml",

            "EO-9012":
                "Engine Oil 5W-30 1L",

            "CO-8011":
                "Coolant 1L",

            "WB-5010":
                "Wiper Blade 24 inch"

        };


        return parts[code] ||
            code;

    }


    /* ========================================================
       HTML ESCAPE
    ======================================================== */

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(
                /[&<>"']/g,
                character => {

                    const map = {

                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#039;"

                    };

                    return map[character];

                }
            );

    }


    /* ========================================================
       EVENTS
    ======================================================== */

    function setupEvents() {

        /* -----------------------------------------------
           NAVIGATION
        ------------------------------------------------ */

        $$(".nav-item").forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openTab(
                        button.dataset.tab
                    );

                }
            );

        });


        /* -----------------------------------------------
           DASHBOARD / INTERNAL TAB BUTTONS
        ------------------------------------------------ */

        document.addEventListener(
            "click",
            event => {

                const target =
                    event.target.closest(
                        "[data-tab-target]"
                    );

                if (!target) {
                    return;
                }

                openTab(
                    target.dataset.tabTarget
                );

            }
        );


        /* -----------------------------------------------
           OPEN JOB
        ------------------------------------------------ */

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

                openJob(
                    button.dataset.openJob
                );

            }
        );


        /* -----------------------------------------------
           BACK
        ------------------------------------------------ */

        $("#backToJobsBtn")
            .addEventListener(
                "click",
                () => {

                    openTab("jobs");

                }
            );


        /* -----------------------------------------------
           START WORK
        ------------------------------------------------ */

        $("#startWorkBtn")
            .addEventListener(
                "click",
                startWork
            );


        /* -----------------------------------------------
           STATUS ACTIONS
        ------------------------------------------------ */

        $$(".status-action")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        changeJobStatus(
                            button.dataset.jobStatus
                        );

                    }
                );

            });


        /* -----------------------------------------------
           SUBMIT SUPERVISOR
        ------------------------------------------------ */

        $("#submitSupervisorBtn")
            .addEventListener(
                "click",
                submitToSupervisor
            );


        /* -----------------------------------------------
           CHECKLIST
        ------------------------------------------------ */

        $("#checklistContainer")
            .addEventListener(
                "change",
                event => {

                    const checkbox =
                        event.target.closest(
                            "[data-check-id]"
                        );

                    if (!checkbox) {
                        return;
                    }

                    toggleChecklistItem(
                        checkbox.dataset.checkId
                    );

                }
            );


        $("#checklistContainer")
            .addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            "[data-delete-work]"
                        );

                    if (!button) {
                        return;
                    }

                    deleteWorkItem(
                        button.dataset.deleteWork
                    );

                }
            );


        /* -----------------------------------------------
           ADD WORK
        ------------------------------------------------ */

        $("#addWorkItemBtn")
            .addEventListener(
                "click",
                () => {

                    if (!currentJobId) {

                        showToast(
                            "No job selected",
                            "Open a job first.",
                            "error"
                        );

                        return;

                    }

                    openModal("workItemModal");

                }
            );


        $("#workItemForm")
            .addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    addWorkItem(
                        $("#workItemName")
                            .value
                    );

                }
            );


        /* -----------------------------------------------
           PART REQUEST
        ------------------------------------------------ */

        $("#requestPartBtn")
            .addEventListener(
                "click",
                () => {

                    openPartRequestModal();

                }
            );


        $("#newPartRequestBtn")
            .addEventListener(
                "click",
                () => {

                    openPartRequestModal();

                }
            );


        $("#partRequestForm")
            .addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    createPartRequest();

                }
            );


        /* -----------------------------------------------
           MODAL CLOSE
        ------------------------------------------------ */

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-close-modal]"
                    );

                if (!button) {
                    return;
                }

                closeModal(
                    button.dataset.closeModal
                );

            }
        );


        $$(".modal-backdrop")
            .forEach(backdrop => {

                backdrop.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target ===
                            backdrop
                        ) {

                            backdrop.classList.remove(
                                "active"
                            );

                        }

                    }
                );

            });


        /* -----------------------------------------------
           SEARCH
        ------------------------------------------------ */

        $("#jobSearch")
            .addEventListener(
                "input",
                renderJobs
            );


        $("#jobStatusFilter")
            .addEventListener(
                "change",
                renderJobs
            );


        /* -----------------------------------------------
           NOTES AUTOSAVE
        ------------------------------------------------ */

        $("#technicianNotes")
            .addEventListener(
                "input",
                saveTechnicianNotes
            );


        /* -----------------------------------------------
           DEMO
        ------------------------------------------------ */

        $("#loadDemoBtn")
            .addEventListener(
                "click",
                loadDemoData
            );


        /* -----------------------------------------------
           MOBILE SIDEBAR
        ------------------------------------------------ */

        $("#mobileMenuBtn")
            .addEventListener(
                "click",
                () => {

                    $("#sidebar")
                        .classList.toggle(
                            "open"
                        );

                }
            );


        /* -----------------------------------------------
           NOTIFICATION
        ------------------------------------------------ */

        $("#notificationBtn")
            .addEventListener(
                "click",
                () => {

                    const unread =
                        state.notifications
                            .filter(
                                item =>
                                    !item.read
                            );

                    if (
                        unread.length === 0
                    ) {

                        showToast(
                            "Notifications",
                            "You have no new notifications."
                        );

                        return;

                    }


                    unread.forEach(
                        item =>
                            item.read = true
                    );


                    saveState();

                    renderPartsAlerts();

                    showToast(
                        "Notifications",
                        `${unread.length} notification(s) marked as read.`
                    );

                }
            );


        /* -----------------------------------------------
           KEYBOARD ESCAPE
        ------------------------------------------------ */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    $$(".modal-backdrop")
                        .forEach(
                            modal =>
                                modal.classList.remove(
                                    "active"
                                )
                        );

                }

            }
        );


        /* -----------------------------------------------
           CROSS-TAB STOREKEEPER UPDATE
        ------------------------------------------------ */

        window.addEventListener(
            "storage",
            event => {

                if (
                    event.key ===
                    STOREKEEPER_KEY
                ) {

                    syncWithStorekeeper();

                }

            }
        );

    }


    /* ========================================================
       START APPLICATION
    ======================================================== */

    initialize();

});