/* ==========================================================================
   service_supervisor.js
   ZIMDRA DMS — Service Supervisor
   ========================================================================== */

(() => {
  "use strict";

  /* ========================================================================
     STORAGE
     ======================================================================== */

  const STORAGE = {
    arrivals: "dms_vehicle_arrivals",
    jobCards: "dms_job_cards",
    issuedParts: "dms_parts_issued",
    inventory: "dms_inventory",
    supervisors: "dms_supervisors",
    mechanics: "dms_mechanics",
    currentJob: "dms_current_job_card",
    loggedRole: "dms_logged_in_role"
  };


  /* ========================================================================
     STATE
     ======================================================================== */

  const state = {
    currentJob: null,
    currentView: "dashboard",
    queueFilter: "all",
    queueSearch: "",
    selectedParts: new Map()
  };


  /* ========================================================================
     DEMO DATA
     ======================================================================== */

  const DEMO_JOBS = [
    {
      id: "JC-00421",
      jobCardId: "JC-00421",
      arrivalNo: "ARR-2026-0001",

      customerName: "Pema Dorji",
      customerPhone: "17123456",
      customerType: "Retail",

      registration: "BP-2-A1234",
      vin: "MR053123456789",
      engineNumber: "2GD-1234567",

      make: "Toyota",
      model: "Hilux",
      year: 2022,

      odometer: 48200,
      fuel: "Diesel",
      fuelLevel: "½",

      visitType: "Paid Service",
      complaint: "General service and brake noise from front wheels.",
      supervisorNotes: "Brake inspection required. General service recommended.",

      supervisor: "S. Sarkar",
      mechanic: "E. Rai",
      secondMechanic: "",
      bay: "Bay 01",

      serviceType: "General Service",
      priority: "NORMAL",

      status: "In Progress",

      openedAt: "2026-09-08T09:15:00",
      promisedDate: "2026-09-08",
      promisedTime: "17:00",

      labour: [
        {
          code: "LAB-001",
          operation: "General Service",
          standardHours: 2,
          chargedHours: 2,
          mechanic: "E. Rai",
          rate: 850
        },
        {
          code: "LAB-014",
          operation: "Brake Inspection",
          standardHours: 1,
          chargedHours: 1,
          mechanic: "E. Rai",
          rate: 650
        }
      ]
    },

    {
      id: "JC-00418",
      jobCardId: "JC-00418",

      customerName: "Sonam Wangchuk",
      customerPhone: "17654321",
      customerType: "Retail",

      registration: "BP-1-B9087",
      vin: "MHK123456789",
      engineNumber: "D4D-908712",

      make: "Toyota",
      model: "Fortuner",
      year: 2021,

      odometer: 65300,
      fuel: "Diesel",
      fuelLevel: "¾",

      visitType: "Running Repair",
      complaint: "Brake vibration during braking.",
      supervisorNotes: "Front brake inspection underway.",

      supervisor: "S. Sarkar",
      mechanic: "P. Wangchuk",
      secondMechanic: "",
      bay: "Bay 02",

      serviceType: "Brake Inspection",
      priority: "HIGH",

      status: "In Progress",

      openedAt: "2026-09-08T10:10:00",
      promisedDate: "2026-09-08",
      promisedTime: "16:30",

      labour: [
        {
          code: "LAB-020",
          operation: "Brake Diagnosis",
          standardHours: 1,
          chargedHours: 1.5,
          mechanic: "P. Wangchuk",
          rate: 850
        }
      ]
    },

    {
      id: "JC-00415",
      jobCardId: "JC-00415",

      customerName: "Tashi Dorji",
      customerPhone: "17771234",
      customerType: "Retail",

      registration: "BP-3-C4421",
      vin: "VIN-C4421",
      engineNumber: "ENG-C4421",

      make: "Hyundai",
      model: "Creta",
      year: 2020,

      odometer: 78500,
      fuel: "Petrol",
      fuelLevel: "½",

      visitType: "Running Repair",
      complaint: "Knocking sound from rear suspension.",
      supervisorNotes: "Suspension bush inspection completed. Parts required.",

      supervisor: "S. Sarkar",
      mechanic: "T. Dorji",
      secondMechanic: "",
      bay: "Bay 03",

      serviceType: "Suspension",
      priority: "NORMAL",

      status: "Waiting",

      openedAt: "2026-09-08T08:50:00",
      promisedDate: "2026-09-09",
      promisedTime: "17:00",

      labour: []
    },

    {
      id: "JC-00420",
      jobCardId: "JC-00420",

      customerName: "Karma Dorji",
      customerPhone: "17998877",
      customerType: "Corporate",

      registration: "BP-2-D7732",
      vin: "VIN-D7732",
      engineNumber: "ENG-D7732",

      make: "Ford",
      model: "Ranger",
      year: 2023,

      odometer: 31700,
      fuel: "Diesel",
      fuelLevel: "½",

      visitType: "Running Repair",
      complaint: "AC not cooling properly.",
      supervisorNotes: "AC system diagnosis in progress.",

      supervisor: "S. Sarkar",
      mechanic: "K. Dorji",
      secondMechanic: "",
      bay: "Bay 04",

      serviceType: "AC Diagnosis",
      priority: "NORMAL",

      status: "In Progress",

      openedAt: "2026-09-08T08:35:00",
      promisedDate: "2026-09-08",
      promisedTime: "17:30",

      labour: []
    },

    {
      id: "JC-00409",
      jobCardId: "JC-00409",

      customerName: "A. Kr. Dey",
      customerPhone: "17001122",
      customerType: "Retail",

      registration: "BP-1-A9944",
      vin: "VIN-A9944",
      engineNumber: "ENG-A9944",

      make: "Mahindra",
      model: "XUV700",
      year: 2022,

      odometer: 42500,
      fuel: "Diesel",
      fuelLevel: "½",

      visitType: "Paid Service",
      complaint: "Periodic maintenance service.",
      supervisorNotes: "Service completed and quality check passed.",

      supervisor: "S. Sarkar",
      mechanic: "A. Kr. Dey",
      secondMechanic: "",
      bay: "Bay 05",

      serviceType: "Billing Release",
      priority: "NORMAL",

      status: "Ready for Billing",

      openedAt: "2026-09-08T07:45:00",
      promisedDate: "2026-09-08",
      promisedTime: "15:30",

      labour: [
        {
          code: "LAB-001",
          operation: "Periodic Service",
          standardHours: 2,
          chargedHours: 2,
          mechanic: "A. Kr. Dey",
          rate: 850
        }
      ]
    },

    {
      id: "JC-00412",
      jobCardId: "JC-00412",

      customerName: "S. Tamang",
      customerPhone: "17223344",
      customerType: "Retail",

      registration: "BP-4-E2290",
      vin: "VIN-E2290",
      engineNumber: "ENG-E2290",

      make: "Isuzu",
      model: "D-Max",
      year: 2019,

      odometer: 94500,
      fuel: "Diesel",
      fuelLevel: "¼",

      visitType: "Running Repair",
      complaint: "Brake pedal hard.",
      supervisorNotes: "Brake overhaul requires customer approval.",

      supervisor: "S. Sarkar",
      mechanic: "S. Tamang",
      secondMechanic: "",
      bay: "Bay 06",

      serviceType: "Brake Overhaul",
      priority: "HIGH",

      status: "Hold",

      openedAt: "2026-09-08T08:05:00",
      promisedDate: "2026-09-09",
      promisedTime: "17:00",

      labour: []
    },

    {
      id: "JC-00417",
      jobCardId: "JC-00417",

      customerName: "Jigme Namgyal",
      customerPhone: "17334455",
      customerType: "Retail",

      registration: "BP-5-F3311",
      vin: "VIN-F3311",
      engineNumber: "ENG-F3311",

      make: "Nissan",
      model: "X-Trail",
      year: 2021,

      odometer: 52200,
      fuel: "Petrol",
      fuelLevel: "½",

      visitType: "Paid Service",
      complaint: "Engine warning light.",
      supervisorNotes: "Waiting for mechanic allocation.",

      supervisor: "",
      mechanic: "",
      secondMechanic: "",
      bay: "Yard",

      serviceType: "Diagnosis",
      priority: "NORMAL",

      status: "Assigned",

      openedAt: "2026-09-08T10:30:00",
      promisedDate: "2026-09-09",
      promisedTime: "17:00",

      labour: []
    }
  ];


  const DEMO_INVENTORY = [
    {
      id: "PART-001",
      partNo: "OIL-5W30",
      description: "Engine Oil 5W-30",
      stock: 25,
      uom: "L",
      unitCost: 950,
      gstRate: 18
    },
    {
      id: "PART-002",
      partNo: "FLT-OIL-01",
      description: "Oil Filter",
      stock: 18,
      uom: "PCS",
      unitCost: 650,
      gstRate: 18
    },
    {
      id: "PART-003",
      partNo: "FLT-AIR-01",
      description: "Air Filter",
      stock: 12,
      uom: "PCS",
      unitCost: 850,
      gstRate: 18
    },
    {
      id: "PART-004",
      partNo: "BRK-CLN-01",
      description: "Brake Cleaner",
      stock: 30,
      uom: "PCS",
      unitCost: 280,
      gstRate: 18
    },
    {
      id: "PART-005",
      partNo: "PAD-FRONT-01",
      description: "Front Brake Pad Set",
      stock: 6,
      uom: "SET",
      unitCost: 4800,
      gstRate: 18
    },
    {
      id: "PART-006",
      partNo: "SUS-BUSH-01",
      description: "Rear Suspension Bush",
      stock: 8,
      uom: "PCS",
      unitCost: 1250,
      gstRate: 18
    }
  ];


  /* ========================================================================
     HELPERS
     ======================================================================== */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);


  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  function getJSON(key, fallback = []) {
    try {
      const value = localStorage.getItem(key);

      if (!value) {
        return fallback;
      }

      return JSON.parse(value);

    } catch (error) {
      console.error(`Storage read error: ${key}`, error);
      return fallback;
    }
  }


  function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }


  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }


  function formatDate(dateString) {

    if (!dateString) {
      return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }


  function formatDateTime(dateString) {

    if (!dateString) {
      return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }


  function money(value) {

    return `Nu. ${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  }


  function escapeHTML(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function normalizeStatus(status) {

    return String(status || "")
      .trim()
      .toLowerCase()
      .replace(/[_-]/g, " ");

  }


  function statusClass(status) {

    const normalized = normalizeStatus(status);

    if (
      normalized.includes("ready") ||
      normalized.includes("completed") ||
      normalized.includes("released")
    ) {
      return "status-badge--green";
    }

    if (
      normalized.includes("waiting") ||
      normalized.includes("hold") ||
      normalized.includes("approval")
    ) {
      return "status-badge--yellow";
    }

    if (
      normalized.includes("cancel") ||
      normalized.includes("failed")
    ) {
      return "status-badge--red";
    }

    return "status-badge--blue";
  }


  function showToast(title, message) {

    const toast = $("#toast");
    const titleEl = $("#toastTitle");
    const messageEl = $("#toastMessage");

    if (!toast) {
      return;
    }

    titleEl.textContent = title;
    messageEl.textContent = message;

    toast.hidden = false;

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.hidden = true;
    }, 3200);
  }


  /* ========================================================================
     INITIAL DATA
     ======================================================================== */

  function initializeStorage() {

    const jobs = getJSON(STORAGE.jobCards, null);

    if (!Array.isArray(jobs) || jobs.length === 0) {
      setJSON(STORAGE.jobCards, DEMO_JOBS);
    }

    const inventory = getJSON(STORAGE.inventory, null);

    if (!Array.isArray(inventory) || inventory.length === 0) {
      setJSON(STORAGE.inventory, DEMO_INVENTORY);
    }

    const supervisors = getJSON(STORAGE.supervisors, null);

    if (!Array.isArray(supervisors) || supervisors.length === 0) {

      setJSON(STORAGE.supervisors, [
        "S. Sarkar",
        "T. Wangchuk",
        "P. Dorji"
      ]);

    }

    const mechanics = getJSON(STORAGE.mechanics, null);

    if (!Array.isArray(mechanics) || mechanics.length === 0) {

      setJSON(STORAGE.mechanics, [
        "E. Rai",
        "P. Wangchuk",
        "T. Dorji",
        "K. Dorji",
        "A. Kr. Dey",
        "S. Tamang",
        "J. Namgyal"
      ]);

    }

    const arrivals = getJSON(STORAGE.arrivals, []);

    if (!Array.isArray(arrivals)) {
      setJSON(STORAGE.arrivals, []);
    }

  }


  /* ========================================================================
     DATE
     ======================================================================== */

  function renderCurrentDate() {

    const dateElement = $("#currentDate");

    if (!dateElement) {
      return;
    }

    const date = new Date();

    dateElement.textContent =
      date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
        .toUpperCase();

  }


  /* ========================================================================
     NAVIGATION
     ======================================================================== */

  function openView(viewName) {

    const target = $(`#view-${viewName}`);

    if (!target) {
      return;
    }

    $$(".view").forEach(view => {
      view.classList.remove("is-visible");
    });

    target.classList.add("is-visible");

    $$(".nav-item").forEach(item => {

      item.classList.toggle(
        "is-active",
        item.dataset.view === viewName
      );

    });

    state.currentView = viewName;

    if (viewName === "dashboard") {
      renderDashboard();
    }

    if (viewName === "jobcards") {
      renderJobQueue();
    }

    if (viewName === "arrival") {
      prepareArrivalForm();
    }

    $("#sidebar")?.classList.remove("is-open");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  function initializeNavigation() {

    document.addEventListener("click", event => {

      const viewTrigger = event.target.closest("[data-view]");

      if (!viewTrigger) {
        return;
      }

      event.preventDefault();

      openView(viewTrigger.dataset.view);

    });


    $("#mobileMenuBtn")?.addEventListener("click", () => {

      $("#sidebar")?.classList.toggle("is-open");

    });

  }


  /* ========================================================================
     JOB CARD DATA
     ======================================================================== */

  function getJobs() {

    const jobs = getJSON(STORAGE.jobCards, []);

    return Array.isArray(jobs) ? jobs : [];

  }


  function saveJobs(jobs) {
    setJSON(STORAGE.jobCards, jobs);
  }


  function getJob(jobId) {

    const jobs = getJobs();

    return jobs.find(job => {

      return String(job.id || job.jobCardId)
        .toLowerCase() === String(jobId).toLowerCase();

    });

  }


  /* ========================================================================
     DASHBOARD
     ======================================================================== */

  function renderDashboard() {

    const jobs = getJobs();

    const arrivals = getJSON(STORAGE.arrivals, []);

    const toAssign = jobs.filter(job => {

      return (
        !job.mechanic ||
        !job.bay ||
        normalizeStatus(job.status) === "assigned"
      );

    }).length;


    const progress = jobs.filter(job => {

      return normalizeStatus(job.status) === "in progress";

    }).length;


    const hold = jobs.filter(job => {

      const status = normalizeStatus(job.status);

      return (
        status === "waiting" ||
        status === "hold" ||
        status === "approval"
      );

    }).length;


    const ready = jobs.filter(job => {

      const status = normalizeStatus(job.status);

      return (
        status === "ready for billing" ||
        status === "completed" ||
        status === "released"
      );

    }).length;


    $("#dashArrivals").textContent =
      String(arrivals.length || 4).padStart(2, "0");


    $("#dashToAssign").textContent =
      String(toAssign).padStart(2, "0");


    $("#dashProgress").textContent =
      String(progress).padStart(2, "0");


    $("#dashHold").textContent =
      String(hold).padStart(2, "0");


    $("#dashReady").textContent =
      String(ready).padStart(2, "0");


    renderDashboardJobs();

  }


  function renderDashboardJobs() {

    const tbody = $("#dashboardJobsBody");

    if (!tbody) {
      return;
    }

    const jobs = getJobs();

    tbody.innerHTML = jobs.slice(0, 10).map(job => {

      const status = job.status || "Assigned";

      return `
        <tr>

          <td>
            ${escapeHTML(job.jobCardId || job.id)}
          </td>

          <td>
            <strong>
              ${escapeHTML(job.registration || "—")}
            </strong>
          </td>

          <td>
            ${escapeHTML(job.customerName || "—")}
          </td>

          <td>
            ${escapeHTML(job.serviceType || job.visitType || "Workshop")}
          </td>

          <td>
            ${escapeHTML(job.bay || "Yard")}
            <br>
            <small>
              ${escapeHTML(job.mechanic || "Unassigned")}
            </small>
          </td>

          <td>
            ${escapeHTML(
              `${formatDate(job.promisedDate)} ${job.promisedTime || ""}`
            )}
          </td>

          <td>
            <span class="status-badge ${statusClass(status)}">
              ${escapeHTML(status.toUpperCase())}
            </span>
          </td>

          <td>
            <button
              class="table-action"
              data-open-job="${escapeHTML(job.jobCardId || job.id)}"
            >
              Open
            </button>
          </td>

        </tr>
      `;

    }).join("");

  }


  /* ========================================================================
     JOB QUEUE
     ======================================================================== */

  function renderJobQueue() {

    const jobs = getJobs();

    const search = state.queueSearch.toLowerCase().trim();

    let filtered = jobs.filter(job => {

      if (!search) {
        return true;
      }

      const text = [
        job.id,
        job.jobCardId,
        job.registration,
        job.customerName,
        job.mechanic,
        job.serviceType,
        job.status
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search);

    });


    filtered = filtered.filter(job => {

      const status = normalizeStatus(job.status);

      switch (state.queueFilter) {

        case "active":
          return status === "in progress";

        case "waiting":
          return (
            status === "waiting" ||
            status === "hold" ||
            status === "approval"
          );

        case "assigned":
          return (
            status === "assigned" ||
            !job.mechanic
          );

        case "ready":
          return (
            status === "ready for billing" ||
            status === "completed" ||
            status === "released"
          );

        default:
          return true;

      }

    });


    const tbody = $("#jobQueueTableBody");

    if (!tbody) {
      return;
    }


    if (filtered.length === 0) {

      tbody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-table">
              No matching job cards found.
            </div>
          </td>
        </tr>
      `;

    } else {

      tbody.innerHTML = filtered.map(job => {

        const status = job.status || "Assigned";

        return `
          <tr>

            <td>
              <strong class="mono-code">
                ${escapeHTML(job.jobCardId || job.id)}
              </strong>
            </td>

            <td>
              ${escapeHTML(job.registration || "—")}
            </td>

            <td>
              ${escapeHTML(job.customerName || "—")}
            </td>

            <td>
              ${escapeHTML(
                job.serviceType ||
                job.visitType ||
                "Workshop Service"
              )}
            </td>

            <td>
              ${escapeHTML(job.bay || "Yard")}
              <br>
              <small>
                ${escapeHTML(job.mechanic || "Unassigned")}
              </small>
            </td>

            <td>
              ${escapeHTML(formatDate(job.promisedDate))}
              <br>
              <small>
                ${escapeHTML(job.promisedTime || "")}
              </small>
            </td>

            <td>
              <span class="status-badge ${statusClass(status)}">
                ${escapeHTML(status.toUpperCase())}
              </span>
            </td>

            <td>
              <button
                class="table-action"
                data-open-job="${escapeHTML(job.jobCardId || job.id)}"
              >
                Open
              </button>
            </td>

          </tr>
        `;

      }).join("");

    }


    updateQueueCounts();

  }


  function updateQueueCounts() {

    const jobs = getJobs();

    const active = jobs.filter(job =>
      normalizeStatus(job.status) === "in progress"
    ).length;

    const waiting = jobs.filter(job => {

      const status = normalizeStatus(job.status);

      return (
        status === "waiting" ||
        status === "hold" ||
        status === "approval"
      );

    }).length;

    const assigned = jobs.filter(job => {

      return (
        normalizeStatus(job.status) === "assigned" ||
        !job.mechanic
      );

    }).length;

    const ready = jobs.filter(job => {

      const status = normalizeStatus(job.status);

      return (
        status === "ready for billing" ||
        status === "completed" ||
        status === "released"
      );

    }).length;


    $("#queueCountTotal").textContent =
      String(jobs.length).padStart(2, "0");

    $("#queueCountActive").textContent =
      String(active).padStart(2, "0");

    $("#queueCountWaiting").textContent =
      String(waiting).padStart(2, "0");

    $("#queueCountAssigned").textContent =
      String(assigned).padStart(2, "0");

    $("#queueCountReady").textContent =
      String(ready).padStart(2, "0");

  }


  function initializeQueueControls() {

    $("#jobQueueSearch")?.addEventListener("input", event => {

      state.queueSearch = event.target.value;

      renderJobQueue();

    });


    $$("#jobQueueFilters [data-queue-filter]").forEach(button => {

      button.addEventListener("click", () => {

        $$("#jobQueueFilters .filter-button").forEach(item => {
          item.classList.remove("is-active");
        });

        button.classList.add("is-active");

        state.queueFilter =
          button.dataset.queueFilter;

        renderJobQueue();

      });

    });

  }


  /* ========================================================================
     OPEN JOB
     ======================================================================== */

  function initializeJobOpenButtons() {

    document.addEventListener("click", event => {

      const button =
        event.target.closest("[data-open-job]");

      if (!button) {
        return;
      }

      openJobCard(button.dataset.openJob);

    });

  }


  function openJobCard(jobId) {

    const job = getJob(jobId);

    if (!job) {

      showToast(
        "Job Card Not Found",
        `Unable to find ${jobId}.`
      );

      return;

    }


    state.currentJob = job;

    localStorage.setItem(
      STORAGE.currentJob,
      job.id || job.jobCardId
    );


    populateJobModal(job);

    showJobModal();

  }


  /* ========================================================================
     JOB MODAL
     ======================================================================== */

  function showJobModal() {

    const modal = $("#jobCardModal");

    if (!modal) {
      return;
    }

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

  }


  function closeJobModal() {

    const modal = $("#jobCardModal");

    if (!modal) {
      return;
    }

    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

  }


  function populateJobModal(job) {

    $("#modalJobNo").textContent =
      job.jobCardId || job.id || "—";


    const status = job.status || "Assigned";

    const statusBadge = $("#modalStatusBadge");

    statusBadge.textContent =
      status.toUpperCase();

    statusBadge.className =
      `status-badge ${statusClass(status)}`;


    $("#modalPriorityBadge").textContent =
      String(job.priority || "NORMAL").toUpperCase();


    $("#modalDate").textContent =
      formatDateTime(job.openedAt);


    $("#modalPromisedDelivery").textContent =
      `${formatDate(job.promisedDate)} ${job.promisedTime || ""}`;


    $("#modalHeaderBay").textContent =
      job.bay || "Yard";


    $("#modalServiceType").textContent =
      job.serviceType ||
      job.visitType ||
      "Workshop";


    $("#modalCustomerName").textContent =
      job.customerName || "—";


    $("#modalCustomerPhone").textContent =
      job.customerPhone || "—";


    $("#modalCustomerType").textContent =
      job.customerType || "Retail";


    $("#modalRegNo").textContent =
      job.registration || "—";


    $("#modalModel").textContent =
      [job.make, job.model, job.year]
        .filter(Boolean)
        .join(" ") || "—";


    $("#modalChassis").textContent =
      job.vin || job.chassisNumber || "—";


    $("#modalEngine").textContent =
      job.engineNumber || "—";


    $("#modalMileage").textContent =
      job.odometer
        ? `${Number(job.odometer).toLocaleString()} KM`
        : "—";


    $("#modalFuel").textContent =
      job.fuelLevel || job.fuel || "—";


    $("#modalCustomerComplaint").textContent =
      job.complaint || "No complaint recorded.";


    $("#modalSupervisorNotes").textContent =
      job.supervisorNotes ||
      "No supervisor / technician findings recorded yet.";


    populateAssignmentControls(job);

    renderParts(job);

    renderLabour(job);

    renderChecklist(job);

    renderFinancials(job);

    renderModalActions(job);

    updateNextStep(job);

  }


  /* ========================================================================
     ASSIGNMENT
     ======================================================================== */

  function populateAssignmentControls(job) {

    const supervisors =
      getJSON(STORAGE.supervisors, []);

    const mechanics =
      getJSON(STORAGE.mechanics, []);


    fillSelect(
      $("#modalSelectSupervisor"),
      supervisors,
      job.supervisor,
      "Select supervisor"
    );


    fillSelect(
      $("#modalSelectMech1"),
      mechanics,
      job.mechanic,
      "Select mechanic"
    );


    fillSelect(
      $("#modalSelectMech2"),
      mechanics,
      job.secondMechanic,
      "No second mechanic"
    );


    $("#modalSelectBay").value =
      job.bay || "Yard";

  }


  function fillSelect(
    select,
    values,
    selected,
    placeholder
  ) {

    if (!select) {
      return;
    }

    const items = Array.isArray(values)
      ? values
      : [];


    select.innerHTML = "";

    const placeholderOption =
      document.createElement("option");

    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;

    select.appendChild(placeholderOption);


    items.forEach(value => {

      const option =
        document.createElement("option");

      option.value = value;
      option.textContent = value;

      if (value === selected) {
        option.selected = true;
      }

      select.appendChild(option);

    });

  }


  function saveAssignment() {

    if (!state.currentJob) {
      return;
    }


    const supervisor =
      $("#modalSelectSupervisor").value;

    const bay =
      $("#modalSelectBay").value;

    const mechanic =
      $("#modalSelectMech1").value;

    const secondMechanic =
      $("#modalSelectMech2").value;


    if (!supervisor) {

      showToast(
        "Supervisor Required",
        "Select the responsible supervisor."
      );

      return;

    }


    if (!mechanic) {

      showToast(
        "Mechanic Required",
        "Select the primary mechanic."
      );

      return;

    }


    const jobs = getJobs();

    const index = jobs.findIndex(job =>
      String(job.id || job.jobCardId) ===
      String(state.currentJob.id || state.currentJob.jobCardId)
    );


    if (index === -1) {
      return;
    }


    jobs[index] = {
      ...jobs[index],

      supervisor,
      bay,
      mechanic,
      secondMechanic,

      status:
        jobs[index].status === "Ready for Billing"
          ? jobs[index].status
          : "In Progress",

      assignedAt:
        jobs[index].assignedAt ||
        new Date().toISOString()
    };


    saveJobs(jobs);

    state.currentJob = jobs[index];

    populateJobModal(state.currentJob);

    renderDashboard();

    renderJobQueue();


    showToast(
      "Assignment Saved",
      `${mechanic} assigned to ${state.currentJob.jobCardId || state.currentJob.id}.`
    );

  }


  /* ========================================================================
     PARTS
     ======================================================================== */

  function getIssuedParts(job) {

    const allIssued =
      getJSON(STORAGE.issuedParts, []);

    return allIssued.filter(part => {

      const partJobId =
        part.jobCardId ||
        part.job_card_id ||
        part.jobCardID;

      return String(partJobId) ===
        String(job.id || job.jobCardId);

    });

  }


  function renderParts(job) {

    const tbody = $("#modalPartsBody");

    if (!tbody) {
      return;
    }


    const parts = getIssuedParts(job);

    if (parts.length === 0) {

      tbody.innerHTML = `
        <tr>
          <td colspan="9">
            <div class="empty-table">
              No parts issued yet.
              Use "Request Part" to issue inventory.
            </div>
          </td>
        </tr>
      `;

      $("#reqIssuedBy").textContent = "—";
      $("#reqJobCard").textContent =
        job.jobCardId || job.id;

      return;

    }


    let totalParts = 0;
    let lastIssuer = "—";


    tbody.innerHTML = parts.map(part => {

      const qty =
        Number(
          part.issuedQty ??
          part.quantity ??
          part.qty ??
          0
        );


      const unitCost =
        Number(
          part.unitCost ??
          part.rate ??
          part.unitPrice ??
          0
        );


      const gstRate =
        Number(
          part.gstRate ??
          part.taxRate ??
          0
        );


      const taxable =
        qty * unitCost;


      const gst =
        taxable * gstRate / 100;


      const total =
        taxable + gst;


      totalParts += total;

      lastIssuer =
        part.issuedBy ||
        part.issuer ||
        "S. Sarkar";


      return `
        <tr>

          <td class="mono-code">
            ${escapeHTML(
              part.partNo ||
              part.partNumber ||
              "—"
            )}
          </td>

          <td>
            ${escapeHTML(
              part.description ||
              part.partName ||
              "—"
            )}
          </td>

          <td>
            ${qty}
          </td>

          <td>
            ${escapeHTML(part.uom || "PCS")}
          </td>

          <td>
            ${money(unitCost)}
          </td>

          <td>
            ${gstRate}%
          </td>

          <td>
            ${money(gst)}
          </td>

          <td>
            ${money(total)}
          </td>

          <td>
            <small>
              ${escapeHTML(
                part.requisitionNo ||
                part.issueRef ||
                "Issued"
              )}
            </small>
          </td>

        </tr>
      `;

    }).join("");


    $("#reqIssuedBy").textContent =
      lastIssuer;

    $("#reqJobCard").textContent =
      job.jobCardId || job.id;

    $("#reqNoDisplay").textContent =
      parts[0]?.requisitionNo ||
      "Generated on issue";

  }


  function openPartsModal() {

    if (!state.currentJob) {
      return;
    }

    state.selectedParts.clear();

    $("#partsSearch").value = "";

    renderPartsPicker();

    const modal = $("#partsModal");

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");

  }


  function closePartsModal() {

    const modal = $("#partsModal");

    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");

    state.selectedParts.clear();

  }


  function renderPartsPicker() {

    const container = $("#partsPickList");

    if (!container) {
      return;
    }


    const search =
      $("#partsSearch").value
        .toLowerCase()
        .trim();


    const inventory =
      getJSON(STORAGE.inventory, []);


    const filtered =
      inventory.filter(part => {

        if (!search) {
          return true;
        }

        return [
          part.partNo,
          part.description
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);

      });


    if (filtered.length === 0) {

      container.innerHTML = `
        <div class="empty-table">
          No inventory item found.
        </div>
      `;

      return;

    }


    container.innerHTML =
      filtered.map(part => {

        const stock =
          Number(part.stock || 0);


        return `
          <label class="part-pick-item">

            <input
              type="checkbox"
              data-part-id="${escapeHTML(part.id)}"
              ${stock <= 0 ? "disabled" : ""}
            >

            <span>

              <span class="part-pick-name">
                ${escapeHTML(part.description)}
              </span>

              <span class="part-pick-meta">
                ${escapeHTML(part.partNo)}
                · Stock ${stock}
                · ${escapeHTML(part.uom || "PCS")}
                · ${money(part.unitCost)}
                · GST ${Number(part.gstRate || 0)}%
              </span>

            </span>

            <input
              class="part-pick-qty"
              type="number"
              min="0.01"
              step="0.01"
              value="1"
              data-part-qty="${escapeHTML(part.id)}"
              ${stock <= 0 ? "disabled" : ""}
            >

          </label>
        `;

      }).join("");


    updatePartsSelection();

  }


  function updatePartsSelection() {

    const checkboxes =
      $$("#partsPickList input[type='checkbox']");


    checkboxes.forEach(checkbox => {

      checkbox.addEventListener("change", () => {

        const partId =
          checkbox.dataset.partId;

        if (checkbox.checked) {

          const qtyInput =
            $(`[data-part-qty="${CSS.escape(partId)}"]`);

          state.selectedParts.set(
            partId,
            Number(qtyInput?.value || 1)
          );

        } else {

          state.selectedParts.delete(partId);

        }

        updateSelectedPartsTotal();

      });

    });


    $$("#partsPickList [data-part-qty]")
      .forEach(input => {

        input.addEventListener("input", () => {

          const partId =
            input.dataset.partQty;

          if (state.selectedParts.has(partId)) {

            state.selectedParts.set(
              partId,
              Number(input.value || 0)
            );

          }

          updateSelectedPartsTotal();

        });

      });

  }


  function updateSelectedPartsTotal() {

    const inventory =
      getJSON(STORAGE.inventory, []);


    let subtotal = 0;
    let tax = 0;


    state.selectedParts.forEach((qty, partId) => {

      const part =
        inventory.find(item =>
          String(item.id) === String(partId)
        );


      if (!part) {
        return;
      }


      const line =
        Number(qty || 0) *
        Number(part.unitCost || 0);


      subtotal += line;

      tax +=
        line *
        Number(part.gstRate || 0) /
        100;

    });


    $("#partsSelectedTotal").textContent =
      `Selected: ${money(subtotal + tax)} · `
      + `Tax: ${money(tax)} · `
      + `Parts: ${state.selectedParts.size}`;

  }


  function issueSelectedParts() {

    if (!state.currentJob) {
      return;
    }


    if (state.selectedParts.size === 0) {

      showToast(
        "No Parts Selected",
        "Select at least one inventory item."
      );

      return;

    }


    const inventory =
      getJSON(STORAGE.inventory, []);


    const issued =
      getJSON(STORAGE.issuedParts, []);


    const requisitionNo =
      generateRequisitionNumber();


    const timestamp =
      new Date().toISOString();


    const job =
      state.currentJob;


    const newIssued = [];


    for (const [partId, qtyValue] of state.selectedParts) {

      const part =
        inventory.find(item =>
          String(item.id) === String(partId)
        );


      if (!part) {
        continue;
      }


      const qty =
        Number(qtyValue);


      const stock =
        Number(part.stock || 0);


      if (!qty || qty <= 0) {

        showToast(
          "Invalid Quantity",
          `${part.description} has an invalid quantity.`
        );

        return;

      }


      if (qty > stock) {

        showToast(
          "Insufficient Stock",
          `${part.description}: available ${stock}, requested ${qty}.`
        );

        return;

      }


      part.stock =
        stock - qty;


      newIssued.push({

        id:
          `ISS-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,

        jobCardId:
          job.id || job.jobCardId,

        requisitionNo,

        partNo:
          part.partNo,

        description:
          part.description,

        issuedQty:
          qty,

        uom:
          part.uom || "PCS",

        unitCost:
          Number(part.unitCost || 0),

        gstRate:
          Number(part.gstRate || 0),

        issuedBy:
          job.supervisor || "S. Sarkar",

        issueTimestamp:
          timestamp,

        vehicleRegistration:
          job.registration,

        customerName:
          job.customerName,

        supervisor:
          job.supervisor,

        invoiceRef:
          "",

        warrantyClaimStatus:
          "Not Claimed"

      });

    }


    setJSON(STORAGE.inventory, inventory);

    setJSON(
      STORAGE.issuedParts,
      issued.concat(newIssued)
    );


    state.selectedParts.clear();

    closePartsModal();

    renderParts(job);

    renderFinancials(job);

    renderModalActions(job);

    updateNextStep(job);


    showToast(
      "Parts Issued",
      `${newIssued.length} part line(s) issued under ${requisitionNo}.`
    );

  }


  function generateRequisitionNumber() {

    const date =
      new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");


    const issued =
      getJSON(STORAGE.issuedParts, []);


    return `REQ-${date}-${String(
      issued.length + 1
    ).padStart(4, "0")}`;

  }


  /* ========================================================================
     LABOUR
     ======================================================================== */

  function renderLabour(job) {

    const tbody = $("#modalLabourBody");

    if (!tbody) {
      return;
    }


    const labour =
      Array.isArray(job.labour)
        ? job.labour
        : [];


    if (labour.length === 0) {

      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-table">
              No labour operations recorded.
            </div>
          </td>
        </tr>
      `;

      return;

    }


    tbody.innerHTML =
      labour.map(line => {

        const hours =
          Number(
            line.chargedHours ??
            line.hours ??
            0
          );


        const rate =
          Number(
            line.rate ??
            line.ratePerHour ??
            0
          );


        const total =
          hours * rate;


        return `
          <tr>

            <td class="mono-code">
              ${escapeHTML(line.code || "—")}
            </td>

            <td>
              ${escapeHTML(line.operation || "—")}
            </td>

            <td>
              ${Number(line.standardHours || 0).toFixed(1)}
            </td>

            <td>
              ${hours.toFixed(1)}
            </td>

            <td>
              ${escapeHTML(line.mechanic || job.mechanic || "—")}
            </td>

            <td>
              ${money(rate)}
            </td>

            <td>
              ${money(total)}
            </td>

          </tr>
        `;

      }).join("");

  }


  /* ========================================================================
     CHECKLIST
     ======================================================================== */

  function getChecklist(job) {

    if (
      Array.isArray(job.qualityChecklist) &&
      job.qualityChecklist.length
    ) {
      return job.qualityChecklist;
    }


    return [
      {
        id: "mechanical",
        name: "Mechanical",
        passed: false
      },
      {
        id: "electrical",
        name: "Electrical",
        passed: false
      },
      {
        id: "body",
        name: "Body / Exterior",
        passed: false
      },
      {
        id: "roadtest",
        name: "Road Test",
        passed: false
      },
      {
        id: "cleaning",
        name: "Final Clean",
        passed: false
      }
    ];

  }


  function renderChecklist(job) {

    const container =
      $("#modalChecklistGrid");


    const checklist =
      getChecklist(job);


    const passed =
      checklist.filter(item => item.passed).length;


    $("#modalChecklistCount").textContent =
      `${passed} / ${checklist.length} Sections Passed`;


    container.innerHTML =
      checklist.map(item => {

        return `
          <div
            class="checklist-item ${item.passed ? "is-passed" : ""}"
            data-check-id="${escapeHTML(item.id)}"
          >

            <div class="checklist-item__top">

              <span class="checklist-item__name">
                ${escapeHTML(item.name)}
              </span>

              <span class="checklist-item__status">
                ${item.passed ? "PASS" : "PENDING"}
              </span>

            </div>

            <button
              class="checklist-item__button"
              data-toggle-check="${escapeHTML(item.id)}"
            >
              ${item.passed ? "Mark Pending" : "Mark Passed"}
            </button>

          </div>
        `;

      }).join("");

  }


  function toggleChecklist(checkId) {

    if (!state.currentJob) {
      return;
    }


    const checklist =
      getChecklist(state.currentJob);


    const item =
      checklist.find(
        entry => entry.id === checkId
      );


    if (!item) {
      return;
    }


    item.passed = !item.passed;

    const jobs = getJobs();


    const index = jobs.findIndex(job =>
      String(job.id || job.jobCardId) ===
      String(
        state.currentJob.id ||
        state.currentJob.jobCardId
      )
    );


    if (index !== -1) {

      jobs[index] = {
        ...jobs[index],
        qualityChecklist: checklist
      };

      saveJobs(jobs);

      state.currentJob = jobs[index];

    }


    renderChecklist(state.currentJob);

    renderModalActions(state.currentJob);

    updateNextStep(state.currentJob);

  }


  /* ========================================================================
     FINANCIAL
     ======================================================================== */

  function calculateFinancials(job) {

    const parts =
      getIssuedParts(job);


    let partsNet = 0;
    let partsTax = 0;


    parts.forEach(part => {

      const qty =
        Number(
          part.issuedQty ??
          part.quantity ??
          part.qty ??
          0
        );


      const rate =
        Number(
          part.unitCost ??
          part.rate ??
          part.unitPrice ??
          0
        );


      const gstRate =
        Number(
          part.gstRate ??
          part.taxRate ??
          0
        );


      const net =
        qty * rate;


      partsNet += net;

      partsTax +=
        net * gstRate / 100;

    });


    let labourNet = 0;


    const labour =
      Array.isArray(job.labour)
        ? job.labour
        : [];


    labour.forEach(line => {

      const hours =
        Number(
          line.chargedHours ??
          line.hours ??
          0
        );


      const rate =
        Number(
          line.rate ??
          line.ratePerHour ??
          0
        );


      labourNet += hours * rate;

    });


    const labourTax =
      labourNet * 18 / 100;


    return {

      partsNet,

      labourNet,

      partsTax,

      labourTax,

      totalTax:
        partsTax + labourTax,

      grandTotal:
        partsNet +
        labourNet +
        partsTax +
        labourTax

    };

  }


  function renderFinancials(job) {

    const financials =
      calculateFinancials(job);


    $("#modalSparesTotal").textContent =
      money(financials.partsNet);


    $("#modalLabourTotal").textContent =
      money(financials.labourNet);


    $("#modalTaxTotal").textContent =
      money(financials.totalTax);


    $("#modalGrandTotal").textContent =
      money(financials.grandTotal);

  }


  /* ========================================================================
     NEXT STEP
     ======================================================================== */

  function updateNextStep(job) {

    const hasAssignment =
      Boolean(
        job.supervisor &&
        job.mechanic &&
        job.bay
      );


    const parts =
      getIssuedParts(job);


    const checklist =
      getChecklist(job);


    const passed =
      checklist.filter(item => item.passed).length;


    const allPassed =
      checklist.length > 0 &&
      passed === checklist.length;


    const status =
      normalizeStatus(job.status);


    let message =
      "Assign mechanic and bay.";


    if (!hasAssignment) {

      message =
        "Assign mechanic and bay.";

    } else if (parts.length === 0) {

      message =
        "Inspect vehicle and request required parts.";

    } else if (!allPassed) {

      message =
        "Complete all quality and bay inspection sections.";

    } else if (
      status !== "ready for billing"
    ) {

      message =
        "Release the Job Card for billing.";

    } else {

      message =
        "Job Card is ready for Billing Clerk.";

    }


    $("#modalNextStepHint").textContent =
      message;

  }


  /* ========================================================================
     MODAL ACTIONS
     ======================================================================== */

  function renderModalActions(job) {

    const container =
      $("#modalActionButtons");


    const assignmentComplete =
      Boolean(
        job.supervisor &&
        job.mechanic &&
        job.bay
      );


    const parts =
      getIssuedParts(job);


    const checklist =
      getChecklist(job);


    const passed =
      checklist.filter(item => item.passed).length;


    const qualityComplete =
      checklist.length > 0 &&
      passed === checklist.length;


    const status =
      normalizeStatus(job.status);


    const buttons = [];


    if (!assignmentComplete) {

      buttons.push(`
        <button
          class="primary-button"
          data-modal-action="focus-assignment"
        >
          Assign Mechanic / Bay
        </button>
      `);

    }


    if (assignmentComplete) {

      buttons.push(`
        <button
          class="secondary-button"
          data-modal-action="request-parts"
        >
          ＋ Request Parts
        </button>
      `);

    }


    if (
      assignmentComplete &&
      parts.length > 0 &&
      !qualityComplete
    ) {

      buttons.push(`
        <button
          class="secondary-button"
          data-modal-action="quality"
        >
          Complete Quality Check
        </button>
      `);

    }


    if (
      assignmentComplete &&
      qualityComplete &&
      status !== "ready for billing"
    ) {

      buttons.push(`
        <button
          class="primary-button"
          data-modal-action="release-billing"
        >
          Release for Billing →
        </button>
      `);

    }


    if (
      status === "ready for billing"
    ) {

      buttons.push(`
        <button
          class="primary-button"
          data-modal-action="billing-released"
        >
          ✓ Released to Billing
        </button>
      `);

    }


    container.innerHTML =
      buttons.join("");

  }


  /* ========================================================================
     RELEASE FOR BILLING
     ======================================================================== */

  function releaseForBilling() {

    if (!state.currentJob) {
      return;
    }


    const checklist =
      getChecklist(state.currentJob);


    const passed =
      checklist.filter(item => item.passed).length;


    if (passed !== checklist.length) {

      showToast(
        "Quality Check Required",
        "All quality and bay inspection sections must pass before billing release."
      );

      return;

    }


    const parts =
      getIssuedParts(state.currentJob);


    if (parts.length === 0) {

      const proceed =
        confirm(
          "No parts have been issued for this Job Card. Continue releasing for billing?"
        );


      if (!proceed) {
        return;
      }

    }


    const jobs = getJobs();


    const index = jobs.findIndex(job =>
      String(job.id || job.jobCardId) ===
      String(
        state.currentJob.id ||
        state.currentJob.jobCardId
      )
    );


    if (index === -1) {
      return;
    }


    jobs[index] = {
      ...jobs[index],

      status: "Ready for Billing",

      billingReleasedAt:
        new Date().toISOString(),

      billingReleasedBy:
        jobs[index].supervisor ||
        "S. Sarkar"

    };


    saveJobs(jobs);

    state.currentJob = jobs[index];


    renderDashboard();

    renderJobQueue();

    populateJobModal(state.currentJob);


    showToast(
      "Released for Billing",
      `${state.currentJob.jobCardId || state.currentJob.id} is now available to the Billing Clerk.`
    );

  }


  /* ========================================================================
     ARRIVAL
     ======================================================================== */

  function generateArrivalNumber() {

    const arrivals =
      getJSON(STORAGE.arrivals, []);


    const year =
      new Date().getFullYear();


    return `ARR-${year}-${String(
      arrivals.length + 1
    ).padStart(4, "0")}`;

  }


  function generateJobCardNumber() {

    const jobs =
      getJobs();


    const next =
      jobs.reduce((highest, job) => {

        const number =
          Number(
            String(job.id || job.jobCardId)
              .replace(/\D/g, "")
          );


        return Math.max(highest, number);

      }, 420);


    return `JC-${String(next + 1).padStart(5, "0")}`;

  }


  function prepareArrivalForm() {

    const form =
      $("#arrivalForm");


    if (!form) {
      return;
    }


    if (!form.dataset.prepared) {

      const arrivalNumber =
        generateArrivalNumber();


      $("#arrivalNumber").textContent =
        arrivalNumber;


      $("#summaryArrival").textContent =
        arrivalNumber;


      $("#summaryDate").textContent =
        formatDate(todayISO());


      $("#summaryTime").textContent =
        new Date().toLocaleTimeString(
          "en-GB",
          {
            hour: "2-digit",
            minute: "2-digit"
          }
        );


      $("#promisedDate").value =
        todayISO();


      form.dataset.prepared = "true";

    }


    updateArrivalSummary();

  }


  function initializeArrivalForm() {

    const form =
      $("#arrivalForm");


    if (!form) {
      return;
    }


    populateArrivalSupervisors();

    prepareArrivalForm();


    form.addEventListener("submit", event => {

      event.preventDefault();

      createVehicleArrival();

    });


    $("#clearArrivalBtn")
      ?.addEventListener(
        "click",
        clearArrivalForm
      );


    [
      "customerName",
      "customerPhone",
      "registration",
      "make",
      "model",
      "promisedDate",
      "promisedTime",
      "floorSupervisor"
    ].forEach(id => {

      $(`#${id}`)?.addEventListener(
        "input",
        updateArrivalSummary
      );

      $(`#${id}`)?.addEventListener(
        "change",
        updateArrivalSummary
      );

    });


    $("#customerSearchBtn")
      ?.addEventListener(
        "click",
        searchCustomer
      );

  }


  function populateArrivalSupervisors() {

    const select =
      $("#floorSupervisor");


    if (!select) {
      return;
    }


    const supervisors =
      getJSON(STORAGE.supervisors, []);


    select.innerHTML = `
      <option value="">
        Select supervisor
      </option>
    `;


    supervisors.forEach(supervisor => {

      const option =
        document.createElement("option");

      option.value = supervisor;
      option.textContent = supervisor;

      select.appendChild(option);

    });

  }


  function updateArrivalSummary() {

    $("#summaryArrival").textContent =
      $("#arrivalNumber")?.textContent || "—";


    $("#summaryDate").textContent =
      $("#promisedDate")?.value
        ? formatDate($("#promisedDate").value)
        : formatDate(todayISO());


    $("#summaryTime").textContent =
      new Date().toLocaleTimeString(
        "en-GB",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );


    const promisedDate =
      $("#promisedDate")?.value || "—";


    const promisedTime =
      $("#promisedTime")?.value || "";


    $("#summaryPromised").textContent =
      promisedDate === "—"
        ? "—"
        : `${formatDate(promisedDate)} ${promisedTime}`;


    $("#summarySupervisor").textContent =
      $("#floorSupervisor")?.value ||
      "Unassigned";


    $("#summaryRegistration").textContent =
      $("#registration")?.value ||
      "—";


    const make =
      $("#make")?.value || "";


    const model =
      $("#model")?.value || "";


    const year =
      $("#year")?.value || "";


    $("#summaryVehicle").textContent =
      [make, model, year]
        .filter(Boolean)
        .join(" ") ||
      "Make / Model";

  }


  function createVehicleArrival() {

    const form =
      $("#arrivalForm");


    if (!form.checkValidity()) {

      form.reportValidity();

      return;

    }


    const data = {

      id:
        generateArrivalNumber(),

      arrivalNo:
        generateArrivalNumber(),

      createdAt:
        new Date().toISOString(),

      customerName:
        $("#customerName").value.trim(),

      customerPhone:
        $("#customerPhone").value.trim(),

      customerEmail:
        $("#customerEmail").value.trim(),

      customerType:
        $("#customerType").value,

      registration:
        $("#registration").value.trim().toUpperCase(),

      vin:
        $("#vin").value.trim(),

      make:
        $("#make").value,

      model:
        $("#model").value.trim(),

      year:
        Number($("#year").value || 0),

      fuel:
        $("#fuel").value,

      odometer:
        Number($("#odometer").value || 0),

      fuelLevel:
        $("#fuelLevel").value,

      visitType:
        $("#visitType").value,

      appointment:
        $("#appointment").value,

      complaint:
        $("#complaint").value.trim(),

      supervisor:
        $("#floorSupervisor").value,

      bay:
        $("#bay").value,

      promisedDate:
        $("#promisedDate").value,

      promisedTime:
        $("#promisedTime").value,

      conditionNotes:
        $("#conditionNotes").value.trim(),

      status:
        "Checked In"

    };


    const arrivals =
      getJSON(STORAGE.arrivals, []);


    arrivals.push(data);

    setJSON(STORAGE.arrivals, arrivals);


    createJobCardFromArrival(data);


    showToast(
      "Vehicle Checked In",
      `${data.arrivalNo} created successfully.`
    );


    clearArrivalForm();

    openView("jobcards");

  }


  function createJobCardFromArrival(arrival) {

    const jobCardId =
      generateJobCardNumber();


    const job = {

      id:
        jobCardId,

      jobCardId,

      arrivalNo:
        arrival.arrivalNo,

      createdAt:
        arrival.createdAt,

      openedAt:
        new Date().toISOString(),

      customerName:
        arrival.customerName,

      customerPhone:
        arrival.customerPhone,

      customerEmail:
        arrival.customerEmail,

      customerType:
        arrival.customerType,

      registration:
        arrival.registration,

      vin:
        arrival.vin,

      make:
        arrival.make,

      model:
        arrival.model,

      year:
        arrival.year,

      fuel:
        arrival.fuel,

      fuelLevel:
        arrival.fuelLevel,

      odometer:
        arrival.odometer,

      visitType:
        arrival.visitType,

      appointment:
        arrival.appointment,

      complaint:
        arrival.complaint,

      conditionNotes:
        arrival.conditionNotes,

      supervisor:
        arrival.supervisor,

      mechanic:
        "",

      secondMechanic:
        "",

      bay:
        arrival.bay === "YARD"
          ? "Yard"
          : arrival.bay,

      serviceType:
        arrival.visitType,

      priority:
        "NORMAL",

      status:
        "Assigned",

      promisedDate:
        arrival.promisedDate,

      promisedTime:
        arrival.promisedTime,

      supervisorNotes:
        "",

      labour:
        [],

      qualityChecklist:
        getChecklist({})

    };


    const jobs =
      getJobs();


    jobs.unshift(job);

    saveJobs(jobs);


    showToast(
      "Job Card Created",
      `${jobCardId} created from ${arrival.arrivalNo}.`
    );

  }


  function clearArrivalForm() {

    const form =
      $("#arrivalForm");


    if (!form) {
      return;
    }


    form.reset();


    $("#customerType").value =
      "Retail";


    $("#fuelLevel").value =
      "½";


    $("#appointment").value =
      "Walk-in";


    $("#promisedTime").value =
      "17:00";


    $("#promisedDate").value =
      todayISO();


    const arrivalNumber =
      generateArrivalNumber();


    $("#arrivalNumber").textContent =
      arrivalNumber;


    $("#summaryArrival").textContent =
      arrivalNumber;


    updateArrivalSummary();

  }


  /* ========================================================================
     CUSTOMER SEARCH
     ======================================================================== */

  function searchCustomer() {

    const query =
      $("#customerSearch").value
        .toLowerCase()
        .trim();


    if (!query) {

      showToast(
        "Search Required",
        "Enter customer name, phone or customer ID."
      );

      return;

    }


    const arrivals =
      getJSON(STORAGE.arrivals, []);


    const match =
      arrivals.find(item => {

        const text = [
          item.customerName,
          item.customerPhone,
          item.customerId,
          item.registration
        ]
          .join(" ")
          .toLowerCase();

        return text.includes(query);

      });


    if (!match) {

      showToast(
        "No Customer Found",
        "No matching customer record was found."
      );

      return;

    }


    $("#customerName").value =
      match.customerName || "";


    $("#customerPhone").value =
      match.customerPhone || "";


    $("#customerEmail").value =
      match.customerEmail || "";


    $("#customerType").value =
      match.customerType || "Retail";


    showToast(
      "Customer Found",
      `${match.customerName} loaded into the arrival form.`
    );


    updateArrivalSummary();

  }


  /* ========================================================================
     MODAL EVENTS
     ======================================================================== */

  function initializeModalEvents() {

    $("#modalCloseBtn")
      ?.addEventListener(
        "click",
        closeJobModal
      );


    $("#modalPrintBtn")
      ?.addEventListener(
        "click",
        printJobCard
      );


    $("#btnUpdateAllocation")
      ?.addEventListener(
        "click",
        saveAssignment
      );


    $("#modalAddPartReqBtn")
      ?.addEventListener(
        "click",
        openPartsModal
      );


    $("#partsCloseBtn")
      ?.addEventListener(
        "click",
        closePartsModal
      );


    $("#partsCancelBtn")
      ?.addEventListener(
        "click",
        closePartsModal
      );


    $("#partsIssueBtn")
      ?.addEventListener(
        "click",
        issueSelectedParts
      );


    $("#partsSearch")
      ?.addEventListener(
        "input",
        renderPartsPicker
      );


    document.addEventListener("click", event => {

      const action =
        event.target.closest(
          "[data-modal-action]"
        );


      if (action) {

        handleModalAction(
          action.dataset.modalAction
        );

        return;

      }


      const check =
        event.target.closest(
          "[data-toggle-check]"
        );


      if (check) {

        toggleChecklist(
          check.dataset.toggleCheck
        );

      }

    });


    $("#jobCardModal")
      ?.addEventListener(
        "click",
        event => {

          if (
            event.target ===
            $("#jobCardModal")
          ) {
            closeJobModal();
          }

        }
      );


    $("#partsModal")
      ?.addEventListener(
        "click",
        event => {

          if (
            event.target ===
            $("#partsModal")
          ) {
            closePartsModal();
          }

        }
      );


    document.addEventListener(
      "keydown",
      event => {

        if (event.key === "Escape") {

          if (
            !$("#partsModal").hidden
          ) {
            closePartsModal();
            return;
          }

          if (
            !$("#jobCardModal").hidden
          ) {
            closeJobModal();
          }

        }

      }
    );

  }


  function handleModalAction(action) {

    switch (action) {

      case "focus-assignment":

        document
          .querySelector(".allocation-form-row")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

        break;


      case "request-parts":

        openPartsModal();

        break;


      case "quality":

        $("#modalChecklistGrid")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

        break;


      case "release-billing":

        releaseForBilling();

        break;


      case "billing-released":

        showToast(
          "Billing Released",
          "This Job Card has already been released to Billing."
        );

        break;

    }

  }


  /* ========================================================================
     PRINT
     ======================================================================== */

  function printJobCard() {

    if (!state.currentJob) {
      return;
    }


    window.print();

  }


  /* ========================================================================
     LOGOUT
     ======================================================================== */

  function initializeLogout() {

    $("#logoutBtn")
      ?.addEventListener(
        "click",
        () => {

          const confirmLogout =
            confirm(
              "Are you sure you want to sign out?"
            );


          if (!confirmLogout) {
            return;
          }


          localStorage.removeItem(
            STORAGE.loggedRole
          );


          showToast(
            "Signed Out",
            "Returning to the sign-in screen."
          );


          setTimeout(() => {

            window.location.href =
              "sign_in.html";

          }, 700);

        }
      );

  }


  /* ========================================================================
     INITIALIZATION
     ======================================================================== */

  function init() {

    initializeStorage();

    renderCurrentDate();

    initializeNavigation();

    initializeQueueControls();

    initializeJobOpenButtons();

    initializeArrivalForm();

    initializeModalEvents();

    initializeLogout();

    renderDashboard();

    renderJobQueue();

  }


  document.addEventListener(
    "DOMContentLoaded",
    init
  );

})();