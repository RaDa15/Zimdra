/* ================================================================
   ZIMDRA DMS
   Billing Clerk
================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "zimdra_billing_clerk_v1";

  const GST_RATE = 18;

  let state = loadState();

  let currentJob = null;

  let activeTab = "dashboard";

  let toastTimer = null;

  /* ============================================================
       DEMO DATA

       NOTE: this is the single source of demo data. The
       "Load Demo Data" button in the sidebar now calls this
       same function instead of keeping its own separate copy,
       so the two entry points can never drift out of sync.
    ============================================================ */

  function demoState() {
    return {
      jobCards: [
        {
          id: "JC-2026-001",

          customer: "Karma Dorji",
          customerCode: "CUS-0231",
          mobile: "17345678",

          vehicle: "Toyota Hilux",
          registration: "BP-1-A1234",
          chassisNo: "MR0FR22G5N0123456",

          jobDate: "2026-09-08",
          omlg: 45210,
          bay: "Bay 1",
          govtVehicle: "N",
          gpNo: "GP-1042",

          mechanic: "Pema Wangchuk",
          mechanic2: "",
          supervisor: "Sonam Dorji",
          deliveredBy: "",

          jobType: "General Service",

          status: "Parts Issued",

          parts: [
            {
              partId: "OF-1024",
              requisitionNo: "REQ-3301",
              name: "Toyota Oil Filter",
              requestedQty: 1,
              issuedQty: 1,
              unitPrice: 850,
              gstRate: 18,
            },

            {
              partId: "AF-2031",
              requisitionNo: "REQ-3301",
              name: "Toyota Air Filter",
              requestedQty: 1,
              issuedQty: 1,
              unitPrice: 1200,
              gstRate: 18,
            },

            {
              partId: "BP-4001",
              requisitionNo: "REQ-3302",
              name: "Front Brake Pad Set",
              requestedQty: 2,
              issuedQty: 2,
              unitPrice: 2500,
              gstRate: 18,
            },
          ],
        },

        {
          id: "JC-2026-002",

          customer: "Tashi Wangmo",
          customerCode: "CUS-0455",
          mobile: "17654321",

          vehicle: "Toyota Fortuner",
          registration: "BP-2-B7788",
          chassisNo: "MR0FZ29G7N0654321",

          jobDate: "2026-09-08",
          omlg: 61830,
          bay: "Bay 2",
          govtVehicle: "N",
          gpNo: "GP-1043",

          mechanic: "Dorji Tshering",
          mechanic2: "",
          supervisor: "Sonam Dorji",
          deliveredBy: "",

          jobType: "Brake Service",

          status: "Parts Issued",

          parts: [
            {
              partId: "BP-4001",
              requisitionNo: "REQ-3310",
              name: "Front Brake Pad Set",
              requestedQty: 1,
              issuedQty: 1,
              unitPrice: 2500,
              gstRate: 18,
            },

            {
              partId: "BF-7012",
              requisitionNo: "REQ-3310",
              name: "Brake Fluid 500ml",
              requestedQty: 1,
              issuedQty: 1,
              unitPrice: 480,
              gstRate: 18,
            },
          ],
        },

        {
          id: "JC-2026-003",

          customer: "Dorji Tshering",
          customerCode: "CUS-0198",
          mobile: "17112233",

          vehicle: "Toyota Prado",
          registration: "BP-3-C4567",
          chassisNo: "JTEBU29J904012345",

          jobDate: "2026-09-07",
          omlg: 78120,
          bay: "Bay 3",
          govtVehicle: "Y",
          gpNo: "GP-0987",

          mechanic: "Kezang Norbu",
          mechanic2: "",
          supervisor: "Sonam Dorji",
          deliveredBy: "Sonam Dorji",

          jobType: "Engine Service",

          status: "Parts Issued",

          parts: [
            {
              partId: "EO-9012",
              requisitionNo: "REQ-3280",
              name: "Engine Oil 5W-30 1L",
              requestedQty: 4,
              issuedQty: 4,
              unitPrice: 950,
              gstRate: 18,
            },

            {
              partId: "OF-1024",
              requisitionNo: "REQ-3280",
              name: "Toyota Oil Filter",
              requestedQty: 1,
              issuedQty: 1,
              unitPrice: 850,
              gstRate: 18,
            },
          ],
        },

        {
          id: "JC-2026-004",

          customer: "Ugyen Phuntsho",
          customerCode: "CUS-0512",
          mobile: "17889900",

          vehicle: "Toyota Corolla",
          registration: "BP-4-D9087",
          chassisNo: "",

          jobDate: "2026-09-08",
          omlg: 22040,
          bay: "Bay 4",
          govtVehicle: "N",
          gpNo: "",

          mechanic: "Pema Wangchuk",
          mechanic2: "",
          supervisor: "Sonam Dorji",
          deliveredBy: "",

          jobType: "Periodic Service",

          status: "Work In Progress",

          parts: [
            {
              partId: "OF-1024",
              requisitionNo: "REQ-3320",
              name: "Toyota Oil Filter",
              requestedQty: 1,
              issuedQty: 0,
              unitPrice: 850,
              gstRate: 18,
            },
          ],
        },
      ],

      bills: [
        {
          billNo: "BL-20260908-001",

          jobCardId: "JC-2026-001",

          customer: "Karma Dorji",
          customerCode: "CUS-0231",
          mobile: "17345678",

          vehicle: "Toyota Hilux",
          registration: "BP-1-A1234",
          chassisNo: "MR0FR22G5N0123456",

          jobDate: "2026-09-08",
          omlg: 45210,
          bay: "Bay 1",
          govtVehicle: "N",
          gpNo: "GP-1042",

          mechanic: "Pema Wangchuk",
          mechanic2: "",
          supervisor: "Sonam Dorji",
          deliveredBy: "",

          billKind: "Invoice",
          creditCard: "N",
          cardCode: "",
          chequeNo: "",
          chequeDate: "",

          items: [
            {
              partId: "OF-1024",
              name: "Toyota Oil Filter",
              qty: 1,
              unitPrice: 850,
              gstRate: 18,
              subtotal: 850,
              gst: 153,
              total: 1003,
            },

            {
              partId: "AF-2031",
              name: "Toyota Air Filter",
              qty: 1,
              unitPrice: 1200,
              gstRate: 18,
              subtotal: 1200,
              gst: 216,
              total: 1416,
            },

            {
              partId: "BP-4001",
              name: "Front Brake Pad Set",
              qty: 2,
              unitPrice: 2500,
              gstRate: 18,
              subtotal: 5000,
              gst: 900,
              total: 5900,
            },
          ],

          partsSubtotal: 7050,

          labour: 2500,

          handling: 0,

          other: 500,

          surcharge: 0,

          discount: 300,

          specialDiscountPercent: 0,

          labourServiceDiscount: 0,

          taxable: 9750,

          gstSpares: 1269,

          gstService: 486,

          gst: 1755,

          surchargeGst: 0,

          grandTotal: 11505,

          notes:
            "General service, brake inspection and oil filter replacement.",

          status: "Pending Payment",

          paymentMethod: "",

          amountPaid: 0,

          change: 0,

          createdAt: "2026-09-08T09:30:00",

          paidAt: null,
        },

        {
          billNo: "BL-20260908-002",

          jobCardId: "JC-2026-002",

          customer: "Tashi Wangmo",
          customerCode: "CUS-0455",
          mobile: "17654321",

          vehicle: "Toyota Fortuner",
          registration: "BP-2-B7788",
          chassisNo: "MR0FZ29G7N0654321",

          jobDate: "2026-09-08",
          omlg: 61830,
          bay: "Bay 2",
          govtVehicle: "N",
          gpNo: "GP-1043",

          mechanic: "Dorji Tshering",
          mechanic2: "",
          supervisor: "Sonam Dorji",
          deliveredBy: "",

          billKind: "Cash",
          creditCard: "N",
          cardCode: "",
          chequeNo: "",
          chequeDate: "",

          items: [
            {
              partId: "BP-4001",
              name: "Front Brake Pad Set",
              qty: 1,
              unitPrice: 2500,
              gstRate: 18,
              subtotal: 2500,
              gst: 450,
              total: 2950,
            },

            {
              partId: "BF-7012",
              name: "Brake Fluid 500ml",
              qty: 1,
              unitPrice: 480,
              gstRate: 18,
              subtotal: 480,
              gst: 86.4,
              total: 566.4,
            },
          ],

          partsSubtotal: 2980,

          labour: 1800,

          handling: 0,

          other: 0,

          surcharge: 0,

          discount: 100,

          specialDiscountPercent: 0,

          labourServiceDiscount: 0,

          taxable: 4680,

          gstSpares: 536.4,

          gstService: 306,

          gst: 842.4,

          surchargeGst: 0,

          grandTotal: 5522.4,

          notes: "Front brake pad replacement and brake fluid service.",

          status: "Pending Payment",

          paymentMethod: "",

          amountPaid: 0,

          change: 0,

          createdAt: "2026-09-08T10:15:00",

          paidAt: null,
        },

        {
          billNo: "BL-20260907-003",

          jobCardId: "JC-2026-003",

          customer: "Dorji Tshering",
          customerCode: "CUS-0198",
          mobile: "17112233",

          vehicle: "Toyota Prado",
          registration: "BP-3-C4567",
          chassisNo: "JTEBU29J904012345",

          jobDate: "2026-09-07",
          omlg: 78120,
          bay: "Bay 3",
          govtVehicle: "Y",
          gpNo: "GP-0987",

          mechanic: "Kezang Norbu",
          mechanic2: "",
          supervisor: "Sonam Dorji",
          deliveredBy: "Sonam Dorji",

          billKind: "Cash",
          creditCard: "N",
          cardCode: "",
          chequeNo: "",
          chequeDate: "",

          items: [
            {
              partId: "EO-9012",
              name: "Engine Oil 5W-30 1L",
              qty: 4,
              unitPrice: 950,
              gstRate: 18,
              subtotal: 3800,
              gst: 684,
              total: 4484,
            },

            {
              partId: "OF-1024",
              name: "Toyota Oil Filter",
              qty: 1,
              unitPrice: 850,
              gstRate: 18,
              subtotal: 850,
              gst: 153,
              total: 1003,
            },
          ],

          partsSubtotal: 4650,

          labour: 2200,

          handling: 0,

          other: 300,

          surcharge: 0,

          discount: 150,

          specialDiscountPercent: 0,

          labourServiceDiscount: 0,

          taxable: 7000,

          gstSpares: 795.6,

          gstService: 464.4,

          gst: 1260,

          surchargeGst: 0,

          grandTotal: 8260,

          notes: "Engine oil replacement and periodic engine service.",

          status: "Paid",

          paymentMethod: "Cash",

          amountPaid: 8500,

          change: 240,

          createdAt: "2026-09-07T15:20:00",

          paidAt: "2026-09-07T15:42:00",
        },
      ],

      counter: {
        bill: 3,
      },
    };
  }

  /* ============================================================
       LOAD / SAVE
    ============================================================ */

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return demoState();
      }

      const parsed = JSON.parse(saved);

      if (
        !parsed ||
        !Array.isArray(parsed.jobCards) ||
        !Array.isArray(parsed.bills)
      ) {
        return demoState();
      }

      return parsed;
    } catch (error) {
      console.error(error);

      return demoState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  /* ============================================================
       HELPERS
    ============================================================ */

  function $(id) {
    return document.getElementById(id);
  }

  function money(value) {
    const amount = Number(value) || 0;

    return (
      "Nu. " +
      amount.toLocaleString("en-BT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function number(value) {
    const n = parseFloat(value);

    return Number.isFinite(n) ? n : 0;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function yesNo(value) {
    return value === "Y" || value === true ? "Yes" : "No";
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-BT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function showToast(message, type = "success") {
    const toast = $("toast");

    toast.textContent = message;

    toast.className = `toast ${type}`;

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  }

  function showError(message) {
    const error = $("jobError");

    error.textContent = message;

    error.classList.remove("hidden");
  }

  function clearError() {
    $("jobError").textContent = "";

    $("jobError").classList.add("hidden");
  }

  /* ============================================================
       TAB NAVIGATION
    ============================================================ */

  const pageTitles = {
    dashboard: "Billing Clerk Dashboard",

    billing: "Create Workshop Bill",

    pending: "Pending Bills",

    completed: "Completed Bills",
  };

  function showTab(tab) {
    activeTab = tab;

    document.querySelectorAll(".tab-section").forEach((section) => {
      section.classList.add("hidden");
    });

    const target = $(tab);

    if (target) {
      target.classList.remove("hidden");
    }

    document.querySelectorAll(".nav-item[data-tab]").forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === tab);
    });

    $("pageTitle").textContent = pageTitles[tab] || "Billing Clerk";

    renderAll();
  }

  document.querySelectorAll(".nav-item[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      showTab(button.dataset.tab);
    });
  });

  document.querySelectorAll("[data-tab-target]").forEach((button) => {
    button.addEventListener("click", () => {
      showTab(button.dataset.tabTarget);
    });
  });

  /* ============================================================
       JOB CARD LOOKUP
    ============================================================ */

  $("lookupJobBtn").addEventListener("click", lookupJob);

  $("jobCardInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      lookupJob();
    }
  });

  function lookupJob() {
    clearError();

    const jobCardId = $("jobCardInput").value.trim().toUpperCase();

    if (!jobCardId) {
      showError("Please enter a Job Card ID.");

      return;
    }

    const job = state.jobCards.find(
      (item) => item.id.toUpperCase() === jobCardId,
    );

    if (!job) {
      $("jobDetails").classList.add("hidden");

      currentJob = null;

      showError("Job Card not found. Please check the Job Card ID.");

      return;
    }

    currentJob = job;

    $("jobCardInput").value = job.id;

    renderJobDetails();

    showToast(`${job.id} loaded successfully.`, "success");
  }

  /* ============================================================
       RENDER JOB DETAILS
    ============================================================ */

  function renderJobDetails() {
    if (!currentJob) {
      $("jobDetails").classList.add("hidden");

      return;
    }

    $("jobDetails").classList.remove("hidden");

    $("jobCardTitle").textContent = currentJob.id;

    $("jobCustomer").textContent = currentJob.customer || "—";

    $("jobCustomerCode").textContent = currentJob.customerCode || "—";

    $("jobMobile").textContent = currentJob.mobile || "—";

    $("jobVehicle").textContent = currentJob.vehicle || "—";

    $("jobReg").textContent = currentJob.registration || "—";

    $("jobChassis").textContent = currentJob.chassisNo || "—";

    $("jobOrderNo").textContent = currentJob.id || "—";

    $("jobDateValue").textContent = currentJob.jobDate
      ? formatDate(currentJob.jobDate)
      : "—";

    $("jobOmlg").textContent =
      currentJob.omlg === undefined || currentJob.omlg === ""
        ? "—"
        : String(currentJob.omlg);

    $("jobBay").textContent = currentJob.bay || "—";

    $("jobGovtVehicle").textContent = currentJob.govtVehicle
      ? yesNo(currentJob.govtVehicle)
      : "—";

    $("jobGpNo").textContent = currentJob.gpNo || "—";

    $("jobMechanic").textContent = currentJob.mechanic || "—";

    $("jobMechanic2").textContent = currentJob.mechanic2 || "—";

    $("jobSupervisor").textContent = currentJob.supervisor || "—";

    $("jobDeliveredBy").textContent = currentJob.deliveredBy || "—";

    const status = currentJob.status || "Pending";

    const badge = $("jobStatusBadge");

    badge.textContent = status;

    badge.className = "status-badge";

    if (
      status.toLowerCase().includes("pending") ||
      status.toLowerCase().includes("progress")
    ) {
      badge.classList.add("pending");
    } else if (status.toLowerCase().includes("paid")) {
      badge.classList.add("paid");
    }

    renderBillingParts();

    updateBillingTotals();
  }

  /* ============================================================
       BILLING PARTS
    ============================================================ */

  function getIssuedParts() {
    if (!currentJob) {
      return [];
    }

    return (currentJob.parts || []).filter(
      (part) => number(part.issuedQty) > 0,
    );
  }

  function renderBillingParts() {
    const tbody = $("billingPartsBody");

    const parts = getIssuedParts();

    tbody.innerHTML = "";

    if (!parts.length) {
      $("noPartsMessage").classList.remove("hidden");

      return;
    }

    $("noPartsMessage").classList.add("hidden");

    parts.forEach((part) => {
      const qty = number(part.issuedQty);

      const unitPrice = number(part.unitPrice);

      const gstRate = number(part.gstRate || GST_RATE);

      const base = qty * unitPrice;

      const gst = (base * gstRate) / 100;

      const total = base + gst;

      const row = document.createElement("tr");

      row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHtml(part.partId)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(part.name)}
                </td>

                <td>
                    ${qty}
                </td>

                <td>
                    ${money(unitPrice)}
                </td>

                <td>
                    ${gstRate.toFixed(2)}%
                </td>

                <td>
                    <strong>
                        ${money(total)}
                    </strong>
                </td>

            `;

      tbody.appendChild(row);
    });
  }

  /* ============================================================
       BILLING TOTALS

       Extended to cover the legacy "Bill Preparation" charge
       set: Handling Charge and Surcharge (each own GST line),
       a Special Discount that can be entered as an amount and/or
       a percentage, and a Labour & Service Discount applied
       specifically against labour/other/handling charges.

       Existing fields (partsSubtotal, labour, other, discount,
       taxable, gst, grandTotal) keep the same meaning as before
       so older saved bills still render correctly.
    ============================================================ */

  function calculateBill() {
    const parts = getIssuedParts();

    let partsSubtotal = 0;

    let partsGST = 0;

    parts.forEach((part) => {
      const qty = number(part.issuedQty);

      const price = number(part.unitPrice);

      const gstRate = number(part.gstRate || GST_RATE);

      const base = qty * price;

      const gst = (base * gstRate) / 100;

      partsSubtotal += base;

      partsGST += gst;
    });

    const labour = Math.max(0, number($("labourCharge").value));

    const handling = Math.max(0, number($("handlingCharge").value));

    const other = Math.max(0, number($("otherCharge").value));

    const surcharge = Math.max(0, number($("surchargeAmount").value));

    const discountAmountEntered = Math.max(
      0,
      number($("billingDiscount").value),
    );

    const specialDiscountPercent = Math.min(
      100,
      Math.max(0, number($("specialDiscountPercent").value)),
    );

    const labourServiceDiscountEntered = Math.max(
      0,
      number($("labourServiceDiscount").value),
    );

    const beforeDiscount = partsSubtotal + labour + other + handling;

    /*
     * Special Discount is recorded on the legacy paper form as
     * both an amount and a percentage. Both are honoured here:
     * the percentage is applied against the pre-discount total,
     * then added to the flat amount.
     */

    const specialDiscountFromPercent =
      beforeDiscount * (specialDiscountPercent / 100);

    const specialDiscountRequested =
      discountAmountEntered + specialDiscountFromPercent;

    const specialDiscount = Math.min(specialDiscountRequested, beforeDiscount);

    /*
     * Labour & Service Discount is a separate discount bucket
     * specific to labour + other + handling (the "service" side
     * of the bill), capped so it never exceeds those charges.
     */

    const serviceCharges = labour + other + handling;

    const labourServiceDiscount = Math.min(
      labourServiceDiscountEntered,
      Math.max(0, serviceCharges - Math.min(specialDiscount, serviceCharges)),
    );

    const actualDiscount = Math.min(
      specialDiscount + labourServiceDiscount,
      beforeDiscount,
    );

    /*
     * For prototype purposes, GST is calculated on:
     *
     * GST on Spares/Oils (parts GST, after proportional discount)
     * + GST on Service (labour + other + handling GST, after
     *   proportional discount)
     *
     * Surcharge is not discounted and carries its own GST line,
     * matching the legacy form's separate "Surcharge" + "GST 5%"
     * rows.
     */

    const discountRatio =
      beforeDiscount > 0 ? actualDiscount / beforeDiscount : 0;

    const discountedPartsTaxable = partsSubtotal * (1 - discountRatio);

    const discountedLabour = labour * (1 - discountRatio);

    const discountedOther = other * (1 - discountRatio);

    const discountedHandling = handling * (1 - discountRatio);

    const partsGSTAfterDiscount = partsGST * (1 - discountRatio);

    const labourGST = (discountedLabour * GST_RATE) / 100;

    const otherGST = (discountedOther * GST_RATE) / 100;

    const handlingGST = (discountedHandling * GST_RATE) / 100;

    const gstService = labourGST + otherGST + handlingGST;

    const taxable = beforeDiscount - actualDiscount;

    const gst = partsGSTAfterDiscount + gstService;

    const surchargeGst = (surcharge * GST_RATE) / 100;

    const grandTotal = taxable + gst + surcharge + surchargeGst;

    return {
      partsSubtotal,

      labour,

      handling,

      other,

      surcharge,

      discount: specialDiscount,

      specialDiscountPercent,

      labourServiceDiscount,

      taxable,

      gstSpares: partsGSTAfterDiscount,

      gstService,

      gst,

      surchargeGst,

      grandTotal,

      partsGST,

      discountedPartsTaxable,
    };
  }

  function updateBillingTotals() {
    const totals = calculateBill();

    $("partsSubtotal").textContent = money(totals.partsSubtotal);

    $("handlingTotal").textContent = money(totals.handling);

    $("labourTotal").textContent = money(totals.labour);

    $("otherTotal").textContent = money(totals.other);

    $("discountTotal").textContent = money(totals.discount);

    $("labourServiceDiscountTotal").textContent = money(
      totals.labourServiceDiscount,
    );

    $("taxableTotal").textContent = money(totals.taxable);

    $("gstSparesTotal").textContent = money(totals.gstSpares);

    $("gstServiceTotal").textContent = money(totals.gstService);

    $("surchargeTotal").textContent = money(totals.surcharge);

    $("surchargeGstTotal").textContent = money(totals.surchargeGst);

    $("grandTotal").textContent = money(totals.grandTotal);
  }

  [
    "labourCharge",
    "handlingCharge",
    "otherCharge",
    "surchargeAmount",
    "billingDiscount",
    "specialDiscountPercent",
    "labourServiceDiscount",
  ].forEach((id) => {
    $(id).addEventListener("input", updateBillingTotals);
  });

  /* ============================================================
       CLEAR BILLING
    ============================================================ */

  $("clearBillingBtn").addEventListener("click", () => {
    currentJob = null;

    $("jobCardInput").value = "";

    $("jobDetails").classList.add("hidden");

    $("labourCharge").value = "0";

    $("handlingCharge").value = "0";

    $("otherCharge").value = "0";

    $("surchargeAmount").value = "0";

    $("billingDiscount").value = "0";

    $("specialDiscountPercent").value = "0";

    $("labourServiceDiscount").value = "0";

    $("billingNotes").value = "";

    $("billKind").value = "Cash";

    $("creditCardYN").value = "N";

    $("cardCode").value = "";

    $("govtVehicleYN").value = "N";

    $("chequeNo").value = "";

    $("chequeDate").value = "";

    clearError();

    showToast("Billing screen cleared.", "success");
  });

  /* ============================================================
       CREATE BILL NUMBER
    ============================================================ */

  function generateBillNumber() {
    state.counter = state.counter || {};

    state.counter.bill = number(state.counter.bill) + 1;

    const sequence = String(state.counter.bill).padStart(3, "0");

    const date = today().replaceAll("-", "");

    return `BL-${date}-${sequence}`;
  }

  /* ============================================================
       CHECK EXISTING BILL
    ============================================================ */

  function existingBillForJob(jobId) {
    return state.bills.find(
      (bill) => bill.jobCardId === jobId && bill.status !== "Cancelled",
    );
  }

  /* ============================================================
       SAVE BILL
    ============================================================ */

  $("saveBillBtn").addEventListener("click", saveBill);

  function saveBill() {
    clearError();

    if (!currentJob) {
      showError("Please fetch a Job Card before creating a bill.");

      return;
    }

    const issuedParts = getIssuedParts();

    if (!issuedParts.length) {
      showError(
        "No parts have been issued for this Job Card. Billing cannot be created yet.",
      );

      return;
    }

    const existing = existingBillForJob(currentJob.id);

    if (existing) {
      showError(
        `A bill already exists for ${currentJob.id}: ${existing.billNo}.`,
      );

      return;
    }

    const totals = calculateBill();

    if (totals.grandTotal <= 0) {
      showError("The bill total must be greater than zero.");

      return;
    }

    const billNo = generateBillNumber();

    const items = issuedParts.map((part) => {
      const qty = number(part.issuedQty);

      const unitPrice = number(part.unitPrice);

      const gstRate = number(part.gstRate || GST_RATE);

      const subtotal = qty * unitPrice;

      const gst = (subtotal * gstRate) / 100;

      return {
        partId: part.partId,

        name: part.name,

        qty,

        unitPrice,

        gstRate,

        subtotal,

        gst,

        total: subtotal + gst,
      };
    });

    const bill = {
      billNo,

      jobCardId: currentJob.id,

      customer: currentJob.customer,

      customerCode: currentJob.customerCode || "",

      mobile: currentJob.mobile,

      vehicle: currentJob.vehicle,

      registration: currentJob.registration,

      chassisNo: currentJob.chassisNo || "",

      jobDate: currentJob.jobDate || "",

      omlg: currentJob.omlg,

      bay: currentJob.bay || "",

      govtVehicle: $("govtVehicleYN").value,

      gpNo: currentJob.gpNo || "",

      mechanic: currentJob.mechanic,

      mechanic2: currentJob.mechanic2 || "",

      supervisor: currentJob.supervisor,

      deliveredBy: currentJob.deliveredBy || "",

      billKind: $("billKind").value,

      creditCard: $("creditCardYN").value,

      cardCode: $("cardCode").value.trim(),

      chequeNo: $("chequeNo").value.trim(),

      chequeDate: $("chequeDate").value,

      items,

      partsSubtotal: totals.partsSubtotal,

      labour: totals.labour,

      handling: totals.handling,

      other: totals.other,

      surcharge: totals.surcharge,

      discount: totals.discount,

      specialDiscountPercent: totals.specialDiscountPercent,

      labourServiceDiscount: totals.labourServiceDiscount,

      taxable: totals.taxable,

      gstSpares: totals.gstSpares,

      gstService: totals.gstService,

      gst: totals.gst,

      surchargeGst: totals.surchargeGst,

      grandTotal: totals.grandTotal,

      notes: $("billingNotes").value.trim(),

      status: "Pending Payment",

      paymentMethod: "",

      amountPaid: 0,

      change: 0,

      createdAt: new Date().toISOString(),

      paidAt: null,
    };

    state.bills.push(bill);

    currentJob.status = "Billing Completed";

    saveState();

    renderAll();

    renderInvoice(bill);

    $("billModal").classList.remove("hidden");

    showToast(`${billNo} created and sent to Cash Counter.`, "success");

    /*
     * Clear current job after successfully creating bill.
     */

    currentJob = null;

    $("jobCardInput").value = "";

    $("jobDetails").classList.add("hidden");
  }

  /* ============================================================
       RENDER PENDING BILLS
    ============================================================ */

  function renderPendingBills() {
    const tbody = $("pendingBillsBody");

    const empty = $("pendingEmpty");

    const bills = state.bills.filter(
      (bill) => bill.status === "Pending Payment",
    );

    tbody.innerHTML = "";

    if (!bills.length) {
      empty.classList.remove("hidden");

      return;
    }

    empty.classList.add("hidden");

    bills
      .slice()
      .reverse()
      .forEach((bill) => {
        const row = document.createElement("tr");

        row.innerHTML = `

                    <td>
                        <strong>
                            ${escapeHtml(bill.billNo)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(bill.jobCardId)}
                    </td>

                    <td>
                        ${escapeHtml(bill.customer)}
                    </td>

                    <td>
                        ${escapeHtml(bill.vehicle)}
                    </td>

                    <td>
                        ${formatDate(bill.createdAt)}
                    </td>

                    <td>
                        <strong>
                            ${money(bill.grandTotal)}
                        </strong>
                    </td>

                    <td>
                        <span class="status-badge pending">
                            Pending Payment
                        </span>
                    </td>

                `;

        row.addEventListener("click", () => openInvoice(bill));

        tbody.appendChild(row);
      });
  }

  /* ============================================================
       COMPLETED BILLS
    ============================================================ */

  function renderCompletedBills() {
    const tbody = $("completedBillsBody");

    const empty = $("completedEmpty");

    const bills = state.bills.filter((bill) => bill.status === "Paid");

    tbody.innerHTML = "";

    if (!bills.length) {
      empty.classList.remove("hidden");

      return;
    }

    empty.classList.add("hidden");

    bills
      .slice()
      .reverse()
      .forEach((bill) => {
        const row = document.createElement("tr");

        row.innerHTML = `

                    <td>
                        <strong>
                            ${escapeHtml(bill.billNo)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(bill.jobCardId)}
                    </td>

                    <td>
                        ${escapeHtml(bill.customer)}
                    </td>

                    <td>
                        ${formatDate(bill.createdAt)}
                    </td>

                    <td>
                        ${escapeHtml(bill.paymentMethod || "—")}
                    </td>

                    <td>
                        <strong>
                            ${money(bill.grandTotal)}
                        </strong>
                    </td>

                    <td>
                        <span class="status-badge paid">
                            Paid
                        </span>
                    </td>

                `;

        row.addEventListener("click", () => openInvoice(bill));

        tbody.appendChild(row);
      });
  }

  /* ============================================================
       DASHBOARD
    ============================================================ */

  function renderDashboard() {
    const bills = state.bills || [];

    const pending = bills.filter((bill) => bill.status === "Pending Payment");

    const paid = bills.filter((bill) => bill.status === "Paid");

    const totalValue = bills.reduce(
      (sum, bill) => sum + number(bill.grandTotal),
      0,
    );

    $("statTotalBills").textContent = bills.length;

    $("statPendingBills").textContent = pending.length;

    $("statPaidBills").textContent = paid.length;

    $("statTotalValue").textContent = money(totalValue);

    $("pendingNavCount").textContent = pending.length;

    /*
     * Jobs ready for billing
     */

    const readyBody = $("dashboardReadyBody");

    readyBody.innerHTML = "";

    const readyJobs = state.jobCards.filter((job) => {
      const issued = (job.parts || []).some(
        (part) => number(part.issuedQty) > 0,
      );

      const alreadyBilled = existingBillForJob(job.id);

      return issued && !alreadyBilled;
    });

    if (!readyJobs.length) {
      readyBody.innerHTML = `

                <tr>

                    <td colspan="5">

                        <div class="empty-state">

                            <strong>
                                No jobs ready for billing
                            </strong>

                        </div>

                    </td>

                </tr>

            `;
    } else {
      readyJobs.slice(0, 8).forEach((job) => {
        const issuedCount = (job.parts || []).filter(
          (part) => number(part.issuedQty) > 0,
        ).length;

        const row = document.createElement("tr");

        row.innerHTML = `

                        <td>
                            <strong>
                                ${escapeHtml(job.id)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(job.customer)}
                        </td>

                        <td>
                            ${escapeHtml(job.vehicle)}
                        </td>

                        <td>
                            ${issuedCount}
                        </td>

                        <td>
                            <span class="status-badge">
                                Ready
                            </span>
                        </td>

                    `;

        row.addEventListener("click", () => {
          showTab("billing");

          $("jobCardInput").value = job.id;

          lookupJob();
        });

        readyBody.appendChild(row);
      });
    }

    /*
     * Pending payment mini list
     */

    const pendingList = $("dashboardPendingList");

    pendingList.innerHTML = "";

    if (!pending.length) {
      pendingList.innerHTML = `

                <div class="empty-state">

                    <strong>
                        No pending payments
                    </strong>

                    <p>
                        Bills sent to Cash Counter
                        will appear here.
                    </p>

                </div>

            `;

      return;
    }

    pending
      .slice()
      .reverse()
      .slice(0, 5)
      .forEach((bill) => {
        const item = document.createElement("div");

        item.className = "mini-item";

        item.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHtml(bill.billNo)}
                        </strong>

                        <span>
                            ${escapeHtml(bill.customer)}
                        </span>

                    </div>

                    <div class="mini-amount">
                        ${money(bill.grandTotal)}
                    </div>

                `;

        item.addEventListener("click", () => openInvoice(bill));

        pendingList.appendChild(item);
      });
  }

  /* ============================================================
       INVOICE
    ============================================================ */

  function renderInvoice(bill) {
    const rows = bill.items
      .map(
        (item) => `

                    <tr>

                        <td>
                            ${escapeHtml(item.partId)}
                        </td>

                        <td>
                            ${escapeHtml(item.name)}
                        </td>

                        <td>
                            ${item.qty}
                        </td>

                        <td>
                            ${money(item.unitPrice)}
                        </td>

                        <td>
                            ${money(item.gst)}
                        </td>

                        <td>
                            ${money(item.total)}
                        </td>

                    </tr>

                `,
      )
      .join("");

    $("invoiceContent").innerHTML = `

            <div class="invoice-header">

                <div class="invoice-company">

                    <h2>
                        ZIMDRA AUTOMOTIVE
                    </h2>

                    <p>
                        Thimphu, Bhutan<br>
                        Tel: +975 2 323232<br>
                        GST Registration: ZD-GST-001
                    </p>

                </div>


                <div class="invoice-number">

                    <span>
                        Bill Number (${escapeHtml(bill.billKind || "Invoice")})
                    </span>

                    <strong>
                        ${escapeHtml(bill.billNo)}
                    </strong>

                    <span>
                        Date
                    </span>

                    <strong>
                        ${formatDate(bill.createdAt)}
                    </strong>

                </div>

            </div>


            <div class="invoice-customer">

                <div>

                    <span>
                        Customer / Code
                    </span>

                    <strong>
                        ${escapeHtml(bill.customer)}
                        ${bill.customerCode ? " / " + escapeHtml(bill.customerCode) : ""}
                    </strong>

                </div>


                <div>

                    <span>
                        Job Order No.
                    </span>

                    <strong>
                        ${escapeHtml(bill.jobCardId)}
                    </strong>

                </div>


                <div>

                    <span>
                        Mobile
                    </span>

                    <strong>
                        ${escapeHtml(bill.mobile || "—")}
                    </strong>

                </div>


                <div>

                    <span>
                        Vehicle / Model
                    </span>

                    <strong>
                        ${escapeHtml(bill.vehicle)}
                    </strong>

                </div>


                <div>

                    <span>
                        Registration No.
                    </span>

                    <strong>
                        ${escapeHtml(bill.registration)}
                    </strong>

                </div>


                <div>

                    <span>
                        Chassis No.
                    </span>

                    <strong>
                        ${escapeHtml(bill.chassisNo || "—")}
                    </strong>

                </div>


                <div>

                    <span>
                        Job Date
                    </span>

                    <strong>
                        ${bill.jobDate ? formatDate(bill.jobDate) : "—"}
                    </strong>

                </div>


                <div>

                    <span>
                        O.MLG (Odometer)
                    </span>

                    <strong>
                        ${bill.omlg === undefined || bill.omlg === "" ? "—" : escapeHtml(String(bill.omlg))}
                    </strong>

                </div>


                <div>

                    <span>
                        Bay
                    </span>

                    <strong>
                        ${escapeHtml(bill.bay || "—")}
                    </strong>

                </div>


                <div>

                    <span>
                        Govt. Vehicle
                    </span>

                    <strong>
                        ${bill.govtVehicle ? yesNo(bill.govtVehicle) : "—"}
                    </strong>

                </div>


                <div>

                    <span>
                        G.P. No. (Gate Pass)
                    </span>

                    <strong>
                        ${escapeHtml(bill.gpNo || "—")}
                    </strong>

                </div>


                <div>

                    <span>
                        Mechanic / Mechanic 2
                    </span>

                    <strong>
                        ${escapeHtml(bill.mechanic || "—")}
                        ${bill.mechanic2 ? " / " + escapeHtml(bill.mechanic2) : ""}
                    </strong>

                </div>


                <div>

                    <span>
                        Floor Supervisor
                    </span>

                    <strong>
                        ${escapeHtml(bill.supervisor || "—")}
                    </strong>

                </div>


                <div>

                    <span>
                        Delivered By
                    </span>

                    <strong>
                        ${escapeHtml(bill.deliveredBy || "—")}
                    </strong>

                </div>

            </div>


            <table>

                <thead>

                    <tr>

                        <th>Part ID</th>

                        <th>Description</th>

                        <th>Qty</th>

                        <th>Unit Price</th>

                        <th>GST</th>

                        <th>Total</th>

                    </tr>

                </thead>

                <tbody>

                    ${rows}

                </tbody>

            </table>


            <div class="invoice-total">

                <div class="total-line">

                    <span>
                        Spares/Oils Value
                    </span>

                    <strong>
                        ${money(bill.partsSubtotal)}
                    </strong>

                </div>


                <div class="total-line">

                    <span>
                        Handling Charge
                    </span>

                    <strong>
                        ${money(bill.handling)}
                    </strong>

                </div>


                <div class="total-line">

                    <span>
                        Labour
                    </span>

                    <strong>
                        ${money(bill.labour)}
                    </strong>

                </div>


                <div class="total-line">

                    <span>
                        Other Charges
                    </span>

                    <strong>
                        ${money(bill.other)}
                    </strong>

                </div>


                <div class="total-line">

                    <span>
                        Special Discount${bill.specialDiscountPercent ? ` (${bill.specialDiscountPercent}%)` : ""}
                    </span>

                    <strong>
                        ${money(bill.discount)}
                    </strong>

                </div>


                <div class="total-line">

                    <span>
                        Labour &amp; Service Discount
                    </span>

                    <strong>
                        ${money(bill.labourServiceDiscount)}
                    </strong>

                </div>


                <div class="total-line">

                    <span>
                        Taxable Amount
                    </span>

                    <strong>
                        ${money(bill.taxable)}
                    </strong>

                </div>


                <div class="total-line">

                    <span>
                        GST on Spares/Oils
                    </span>

                    <strong>
                        ${money(bill.gstSpares !== undefined ? bill.gstSpares : bill.gst)}
                    </strong>

                </div>


                <div class="total-line">

                    <span>
                        GST on Service
                    </span>

                    <strong>
                        ${money(bill.gstService !== undefined ? bill.gstService : 0)}
                    </strong>

                </div>


                <div class="total-line">

                    <span>
                        Surcharge
                    </span>

                    <strong>
                        ${money(bill.surcharge)}
                    </strong>

                </div>


                <div class="total-line">

                    <span>
                        GST on Surcharge
                    </span>

                    <strong>
                        ${money(bill.surchargeGst)}
                    </strong>

                </div>


                <div class="total-line final">

                    <span>
                        Grand Total
                    </span>

                    <strong>
                        ${money(bill.grandTotal)}
                    </strong>

                </div>

            </div>


            <div class="invoice-footer">

                <strong>
                    Payment Status:
                </strong>

                ${escapeHtml(bill.status)}

                ${
                  bill.paymentMethod
                    ? `
                            <br>
                            Payment Method:
                            ${escapeHtml(bill.paymentMethod)}
                          `
                    : ""
                }

                ${
                  bill.creditCard === "Y"
                    ? `
                            <br>
                            Paid by Credit Card${bill.cardCode ? " — Card Code: " + escapeHtml(bill.cardCode) : ""}
                          `
                    : ""
                }

                ${
                  bill.chequeNo
                    ? `
                            <br>
                            Cheque No.: ${escapeHtml(bill.chequeNo)}
                            ${bill.chequeDate ? " — " + formatDate(bill.chequeDate) : ""}
                          `
                    : ""
                }

                ${
                  bill.amountPaid
                    ? `
                            <br>
                            Amount Paid:
                            ${money(bill.amountPaid)}
                          `
                    : ""
                }

                ${
                  bill.change
                    ? `
                            <br>
                            Change:
                            ${money(bill.change)}
                          `
                    : ""
                }

                ${
                  bill.notes
                    ? `
                            <br>
                            Notes:
                            ${escapeHtml(bill.notes)}
                          `
                    : ""
                }

                <br><br>

                Thank you for choosing
                Zimdra Automotive.

            </div>

        `;
  }

  function openInvoice(bill) {
    renderInvoice(bill);

    $("billModal").classList.remove("hidden");
  }

  /* ============================================================
       CASH MEMO / PROFORMA INVOICE
       (legacy "Cash Memo" — a parts-only pre-bill estimate)

       This is a preview only: it reads the currently fetched
       Job Card's issued parts and renders an estimate. It does
       NOT create a Bill and does not touch state.bills, so it
       cannot interfere with the existing billing flow.
    ============================================================ */

  function renderCashMemo(job) {
    const parts = (job.parts || []).filter(
      (part) => number(part.issuedQty) > 0,
    );

    let taxableSpares = 0;

    const rows = parts
      .map((part) => {
        const qty = number(part.issuedQty);

        const unitPrice = number(part.unitPrice);

        const lineValue = qty * unitPrice;

        taxableSpares += lineValue;

        return `

                    <tr>

                        <td>
                            ${escapeHtml(part.requisitionNo || "—")}
                        </td>

                        <td>
                            ${escapeHtml(part.partId)}
                        </td>

                        <td>
                            ${escapeHtml(part.name)}
                        </td>

                        <td>
                            ${qty}
                        </td>

                    </tr>

                `;
      })
      .join("");

    $("cashMemoContent").innerHTML = `

            <div class="invoice-header">

                <div class="invoice-company">

                    <h2>
                        ZIMDRA AUTOMOTIVE
                    </h2>

                    <p>
                        Authorised Workshop — Thimphu, Bhutan<br>
                        Tel / Phone: ${escapeHtml(job.mobile || "—")}
                    </p>

                </div>


                <div class="invoice-number">

                    <span>
                        Job Order No.
                    </span>

                    <strong>
                        ${escapeHtml(job.id)}
                    </strong>

                    <span>
                        Date
                    </span>

                    <strong>
                        ${formatDate(today())}
                    </strong>

                </div>

            </div>


            <div class="invoice-customer">

                <div>

                    <span>
                        Customer Name
                    </span>

                    <strong>
                        ${escapeHtml(job.customer || "—")}
                    </strong>

                </div>


                <div>

                    <span>
                        PIN
                    </span>

                    <strong>
                        ${escapeHtml(job.pin || "—")}
                    </strong>

                </div>


                <div>

                    <span>
                        Telephone
                    </span>

                    <strong>
                        ${escapeHtml(job.mobile || "—")}
                    </strong>

                </div>


                <div>

                    <span>
                        Registration No.
                    </span>

                    <strong>
                        ${escapeHtml(job.registration || "—")}
                    </strong>

                </div>


                <div>

                    <span>
                        Model
                    </span>

                    <strong>
                        ${escapeHtml(job.vehicle || "—")}
                    </strong>

                </div>

            </div>


            <table>

                <thead>

                    <tr>

                        <th>Requisition No.</th>

                        <th>Part No.</th>

                        <th>Description</th>

                        <th>Qty</th>

                    </tr>

                </thead>

                <tbody>

                    ${
                      rows ||
                      `<tr><td colspan="4">No parts issued yet for this Job Card.</td></tr>`
                    }

                </tbody>

            </table>


            <div class="invoice-total">

                <div class="total-line">

                    <span>
                        Value of Taxable Spares
                    </span>

                    <strong>
                        ${money(taxableSpares)}
                    </strong>

                </div>


                <div class="total-line final">

                    <span>
                        Net Taxable Value
                    </span>

                    <strong>
                        ${money(taxableSpares)}
                    </strong>

                </div>

            </div>


            <div class="invoice-footer">

                This is a Cash Memo / proforma estimate for the
                customer's reference only — it is not a tax
                invoice and GST is not shown. Labour, other
                charges, discounts and GST are finalised on the
                Workshop Bill.

            </div>

        `;
  }

  $("cashMemoBtn").addEventListener("click", () => {
    if (!currentJob) {
      showError("Please fetch a Job Card before previewing a Cash Memo.");

      return;
    }

    renderCashMemo(currentJob);

    $("cashMemoModal").classList.remove("hidden");
  });

  function closeCashMemoModal() {
    $("cashMemoModal").classList.add("hidden");
  }

  $("closeCashMemoModal").addEventListener("click", closeCashMemoModal);

  $("closeCashMemoBtn").addEventListener("click", closeCashMemoModal);

  $("cashMemoModal").addEventListener("click", (event) => {
    if (event.target === $("cashMemoModal")) {
      closeCashMemoModal();
    }
  });

  $("printCashMemoBtn").addEventListener("click", () => {
    window.print();
  });

  /* ============================================================
       MODAL (Bill Preview)
    ============================================================ */

  function closeInvoiceModal() {
    $("billModal").classList.add("hidden");
  }

  $("closeBillModal").addEventListener("click", closeInvoiceModal);

  $("closeBillBtn").addEventListener("click", closeInvoiceModal);

  $("billModal").addEventListener("click", (event) => {
    if (event.target === $("billModal")) {
      closeInvoiceModal();
    }
  });

  $("printBillBtn").addEventListener("click", () => {
    window.print();
  });

  /* ============================================================
       DEMO DATA (button)

       Previously this handler defined its own unused copy of
       demoState() and never actually loaded it, so the button
       did nothing beyond the confirm dialog. It now calls the
       single top-level demoState() so demo data always loads
       consistently everywhere it's used.
    ============================================================ */

  $("loadDemoBtn").addEventListener("click", () => {
    const confirmed = confirm(
      "Load demo billing data? Existing local billing data will be replaced.",
    );

    if (!confirmed) {
      return;
    }

    state = demoState();

    currentJob = null;

    saveState();

    renderAll();

    $("jobDetails").classList.add("hidden");

    $("jobCardInput").value = "";

    showToast("Demo billing data loaded.", "success");
  });

  /* ============================================================
       CLEAR DATA
    ============================================================ */

  $("clearDataBtn").addEventListener("click", () => {
    const confirmed = confirm("Clear all Billing Clerk local data?");

    if (!confirmed) {
      return;
    }

    state = {
      jobCards: [],

      bills: [],

      counter: {
        bill: 0,
      },
    };

    currentJob = null;

    saveState();

    renderAll();

    $("jobDetails").classList.add("hidden");

    $("jobCardInput").value = "";

    showToast("Billing data cleared.", "success");
  });

  /* ============================================================
       GLOBAL RENDER
    ============================================================ */

  function renderAll() {
    renderDashboard();

    renderPendingBills();

    renderCompletedBills();

    renderPendingCount();

    updateBillingTotals();
  }

  function renderPendingCount() {
    const count = state.bills.filter(
      (bill) => bill.status === "Pending Payment",
    ).length;

    $("pendingNavCount").textContent = count;
  }

  /* ============================================================
       INITIALISE
    ============================================================ */

  saveState();

  renderAll();

  showTab("dashboard");
});