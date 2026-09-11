/* =========================================================
   SUPERVISOR.JS
   ZIMDRA DMS
   ---------------------------------------------------------
   PROTOTYPE ONLY

   Pages
     1. Dashboard        counters, load by trade, mechanic status
     2. Assign Mechanic  job card register + assignment modal
     3. Mechanic Roster  every mechanic grouped by trade

   The Supervisor does not create job cards. Job Card Entry
   creates them; this desk decides WHO works on them.

   Assignment rule
     Every line of work on a job card carries the trade it
     needs. A job card cannot go to a bay until each of those
     trades has a mechanic on the crew, one mechanic is named
     lead, and a bay is chosen.

   Storage
     zimdra_dms_session       written by auth/sign_in.js
     zimdra_dms_job_cards     written by Job Card Entry (read only here)
     zimdra_dms_assignments   written by this desk

   The module is exported on the global object so the Node VM
   harness can test the rules without a DOM.
========================================================= */

(function (global) {
    "use strict";

    /* =====================================================
       1. TRADES
       ===================================================== */

    const TRADES = {
        ENG: { code: "ENG", label: "Engine & transmission" },
        ELE: { code: "ELE", label: "Auto electrical" },
        BOD: { code: "BOD", label: "Body & paint" },
        AC: { code: "AC", label: "Air-conditioning" },
    };

    const TRADE_ORDER = ["ENG", "ELE", "BOD", "AC"];

    /* =====================================================
       2. MECHANIC ROSTER
       -----------------------------------------------------
       Names carried over from the Mechanic 1 / Mechanic 2
       lists on the Job Card Entry screen. The trade column
       is the Supervisor's own classification.
       ===================================================== */

    const ROSTER = [
        { code: "Z011", name: "E. Rai", trade: "ENG" },
        { code: "Z015", name: "K. Dorji", trade: "ENG" },
        { code: "Z019", name: "T. Dorji", trade: "ENG" },
        { code: "Z023", name: "P. Wangchuk", trade: "ELE" },
        { code: "Z027", name: "N. Gurung", trade: "ELE" },
        { code: "Z031", name: "S. Tamang", trade: "BOD" },
        { code: "Z034", name: "D. Wangdi", trade: "BOD" },
        { code: "Z042", name: "S. Dema", trade: "AC" },
    ];

    /* =====================================================
       3. SERVICE BAYS
       ===================================================== */

    const BAYS = ["Bay 01", "Bay 02", "Bay 03", "Bay 04", "Bay 05", "Bay 06"];

    /* =====================================================
       4. JOB CARDS
       -----------------------------------------------------
       Shape follows the Job Card Entry register: job card
       number, arrival, registration, make/model, customer,
       service group, visit type, priority, promised date.
       ===================================================== */

    const SEED_JOB_CARDS = [
        {
            no: "JC-2026-00421",
            registration: "BP-2-A1234",
            vehicle: "Swift VDi",
            customer: "Tshering Choden",
            phone: "+975 17112233",
            serviceType: "GROUP-1 SRV",
            visitType: "Paid Service",
            priority: "Normal",
            odometer: "68,420 KM",
            arrival: "09 Sep · 08:40",
            promised: "09 Sep · 16:00",
            lines: [
                { task: "Engine oil leak from timing cover", trade: "ENG", hours: 3.5 },
                { task: "Replace clutch plate assembly", trade: "ENG", hours: 4.0 },
                { task: "Cabin blower dead on speed 1 and 2", trade: "ELE", hours: 1.5 },
            ],
        },

        {
            no: "JC-2026-00422",
            registration: "BP-1-A7702",
            vehicle: "Dzire ZXi",
            customer: "Yeshey Wangmo",
            phone: "+975 17445566",
            serviceType: "GROUP-1 SRV",
            visitType: "Running Repair",
            priority: "High",
            odometer: "31,105 KM",
            arrival: "09 Sep · 09:05",
            promised: "09 Sep · 15:00",
            lines: [
                { task: "AC not cooling, suspected gas leak", trade: "AC", hours: 2.5 },
                { task: "Condenser fan cutting in and out", trade: "ELE", hours: 1.0 },
            ],
        },

        {
            no: "JC-2026-00423",
            registration: "BP-3-C1188",
            vehicle: "Alto K10",
            customer: "Dechen Tshomo",
            phone: "+975 17778899",
            serviceType: "GROUP-2 BODY",
            visitType: "Accidental",
            priority: "Urgent",
            odometer: "94,860 KM",
            arrival: "09 Sep · 09:30",
            promised: "11 Sep · 12:00",
            lines: [
                { task: "Rear bumper and tail gate dent repair", trade: "BOD", hours: 6.0 },
                { task: "Repaint rear quarter panel", trade: "BOD", hours: 5.0 },
            ],
        },

        {
            no: "JC-2026-00424",
            registration: "BP-2-B5560",
            vehicle: "Ertiga VXi",
            customer: "Phuentsholing Transport",
            phone: "+975 17223344",
            serviceType: "GROUP-1 SRV",
            visitType: "Paid Service Nine Point",
            priority: "Normal",
            odometer: "142,300 KM",
            arrival: "09 Sep · 10:10",
            promised: "10 Sep · 11:00",
            lines: [
                { task: "Periodic service, 140,000 KM schedule", trade: "ENG", hours: 3.0 },
                { task: "Alternator charging low", trade: "ELE", hours: 2.0 },
                { task: "Cabin filter service, vent smell", trade: "AC", hours: 1.0 },
            ],
        },

        {
            no: "JC-2026-00425",
            registration: "BP-1-A9034",
            vehicle: "Baleno Delta",
            customer: "Karma Lhendup",
            phone: "+975 17556677",
            serviceType: "GROUP-3 OTHR",
            visitType: "Running Repair",
            priority: "Normal",
            odometer: "22,470 KM",
            arrival: "09 Sep · 10:45",
            promised: "09 Sep · 17:00",
            lines: [
                { task: "Front left window regulator stuck", trade: "ELE", hours: 2.0 },
            ],
        },
    ];

    /* =====================================================
       5. STORAGE
       ===================================================== */

    const STORAGE = {
        session: "zimdra_dms_session",
        jobCards: "zimdra_dms_job_cards",
        assignments: "zimdra_dms_assignments",
    };

    const SIGN_IN_URL = "../../auth/sign_in.html";

    /* =====================================================
       6. LOOKUPS
       ===================================================== */

    function findMechanic(code) {
        return (
            ROSTER.find(function (mechanic) {
                return mechanic.code === code;
            }) || null
        );
    }

    /* =====================================================
       7. RULES
       -----------------------------------------------------
       No DOM below this heading until section 9. The Node
       harness tests these directly.
       ===================================================== */

    /**
     * The distinct trades a job card needs, in roster order.
     */
    function requiredTrades(job) {
        if (!job || !job.lines) {
            return [];
        }

        const seen = {};

        job.lines.forEach(function (line) {
            seen[line.trade] = true;
        });

        return TRADE_ORDER.filter(function (trade) {
            return seen[trade];
        });
    }

    /**
     * The trades a crew covers.
     */
    function coveredTrades(crew) {
        const seen = {};

        (crew || []).forEach(function (member) {
            seen[member.trade] = true;
        });

        return TRADE_ORDER.filter(function (trade) {
            return seen[trade];
        });
    }

    /**
     * Trades the job needs that nobody on the crew covers.
     */
    function openTrades(job, crew) {
        const covered = coveredTrades(crew);

        return requiredTrades(job).filter(function (trade) {
            return covered.indexOf(trade) === -1;
        });
    }

    /**
     * Crew members whose trade is not on this job card.
     * Allowed, but flagged so the override stays visible.
     */
    function offTradeMembers(job, crew) {
        const required = requiredTrades(job);

        return (crew || []).filter(function (member) {
            return required.indexOf(member.trade) === -1;
        });
    }

    /**
     * Total standard hours on a job card.
     */
    function jobHours(job) {
        if (!job || !job.lines) {
            return 0;
        }

        return job.lines.reduce(function (sum, line) {
            return sum + line.hours;
        }, 0);
    }

    /**
     * Standard hours per trade across a set of job cards.
     */
    function hoursByTrade(jobs) {
        const totals = {};

        TRADE_ORDER.forEach(function (trade) {
            totals[trade] = 0;
        });

        (jobs || []).forEach(function (job) {
            job.lines.forEach(function (line) {
                totals[line.trade] += line.hours;
            });
        });

        return totals;
    }

    /**
     * Where a mechanic stands right now.
     */
    function mechanicState(assignments, code) {
        const jobs = Object.keys(assignments || {});

        for (let index = 0; index < jobs.length; index += 1) {
            const no = jobs[index];

            const record = assignments[no];

            const member = (record.crew || []).find(function (person) {
                return person.code === code;
            });

            if (member) {
                return {
                    engaged: true,
                    job: no,
                    bay: record.bay,
                    lead: !!member.lead,
                };
            }
        }

        return { engaged: false, job: null, bay: null, lead: false };
    }

    /**
     * Counters for the dashboard tiles.
     */
    function summarise(jobs, assignments) {
        const assigned = Object.keys(assignments || {});

        const engaged = ROSTER.filter(function (mechanic) {
            return mechanicState(assignments, mechanic.code).engaged;
        }).length;

        const busyBays = assigned.map(function (no) {
            return assignments[no].bay;
        });

        const waiting = (jobs || []).filter(function (job) {
            return !(assignments || {})[job.no];
        });

        return {
            waiting: waiting.length,
            inBay: assigned.length,
            mechanicsEngaged: engaged,
            mechanicsFree: ROSTER.length - engaged,
            mechanicsTotal: ROSTER.length,
            baysFree: BAYS.filter(function (bayName) {
                return busyBays.indexOf(bayName) === -1;
            }).length,
            urgent: waiting.filter(function (job) {
                return job.priority === "Urgent" || job.priority === "High";
            }).length,
        };
    }

    /**
     * Can this job card go to a bay?
     */
    function validateAssignment(job, crew, bayName) {
        if (!crew || crew.length === 0) {
            return {
                ok: false,
                message: "Select at least one mechanic for this job card.",
            };
        }

        const open = openTrades(job, crew);

        if (open.length > 0) {
            const names = open.map(function (trade) {
                return TRADES[trade].label.toLowerCase();
            });

            return {
                ok: false,
                message:
                    "No mechanic selected for " +
                    names.join(" and ") +
                    " work. Add one, or remove that line from the job card.",
            };
        }

        const hasLead = crew.some(function (member) {
            return member.lead;
        });

        if (!hasLead) {
            return { ok: false, message: "Mark one mechanic as the lead." };
        }

        if (!bayName) {
            return { ok: false, message: "Select a service bay." };
        }

        return { ok: true, message: "" };
    }

    /**
     * Free-text search across the register.
     */
    function matchesSearch(job, term) {
        if (!term) {
            return true;
        }

        const needle = term.trim().toLowerCase();

        if (!needle) {
            return true;
        }

        return [
            job.no,
            job.registration,
            job.vehicle,
            job.customer,
            job.serviceType,
            job.visitType,
            job.priority,
        ]
            .join(" ")
            .toLowerCase()
            .indexOf(needle) !== -1;
    }

    /* =====================================================
       8. NODE HARNESS EXPORT
       ===================================================== */

    const api = {
        TRADES: TRADES,
        TRADE_ORDER: TRADE_ORDER,
        ROSTER: ROSTER,
        BAYS: BAYS,
        SEED_JOB_CARDS: SEED_JOB_CARDS,
        findMechanic: findMechanic,
        requiredTrades: requiredTrades,
        coveredTrades: coveredTrades,
        openTrades: openTrades,
        offTradeMembers: offTradeMembers,
        jobHours: jobHours,
        hoursByTrade: hoursByTrade,
        mechanicState: mechanicState,
        summarise: summarise,
        validateAssignment: validateAssignment,
        matchesSearch: matchesSearch,
    };

    global.ZimdraSupervisor = api;

    if (typeof document === "undefined") {
        return;
    }

    /* =====================================================
       9. DOM REFERENCES
       ===================================================== */

    const $ = function (id) {
        return document.getElementById(id);
    };

    const navItems = Array.from(document.querySelectorAll(".nav-item"));

    const sectionLinks = Array.from(document.querySelectorAll("[data-section]"));

    const sections = {
        dashboard: $("section-dashboard"),
        assign: $("section-assign"),
        roster: $("section-roster"),
        reports: $("section-reports"),
        settings: $("section-settings"),
    };

    const PAGE_TITLES = {
        dashboard: "Supervisor Dashboard",
        assign: "Assign Mechanic",
        roster: "Mechanic Roster",
        reports: "Reports",
        settings: "Settings",
    };

    const pageTitle = $("pageTitle");

    const currentDate = $("currentDate");

    const logoutBtn = $("logoutBtn");

    const navAssignCount = $("navAssignCount");

    const statWaiting = $("statWaiting");

    const statInBay = $("statInBay");

    const statFree = $("statFree");

    const statUrgent = $("statUrgent");

    const waitingList = $("waitingList");

    const tradeChart = $("tradeChart");

    const dashMechBody = $("dashMechBody");

    const mechSummary = $("mechSummary");

    const jobSearch = $("jobSearch");

    const clearSearch = $("clearSearch");

    const filterTabs = Array.from(document.querySelectorAll(".filter-tab"));

    const jobTableBody = $("jobTableBody");

    const jobResultCount = $("jobResultCount");

    const rosterGrid = $("rosterGrid");

    const assignModal = $("assignModal");

    const modalJobNo = $("modalJobNo");

    const modalStatus = $("modalStatus");

    const modalVehicle = $("modalVehicle");

    const modalCustomer = $("modalCustomer");

    const modalService = $("modalService");

    const modalPromised = $("modalPromised");

    const modalLines = $("modalLines");

    const coverageNote = $("coverageNote");

    const mechPicker = $("mechPicker");

    const showAllTrades = $("showAllTrades");

    const crewListEl = $("crewList");

    const crewNote = $("crewNote");

    const crewEmpty = $("crewEmpty");

    const bay = $("bay");

    const crewNotes = $("crewNotes");

    const assignError = $("assignError");

    const saveAssign = $("saveAssign");

    const cancelAssign = $("cancelAssign");

    const recallBtn = $("recallBtn");

    const modalClose = $("modalClose");

    const toast = $("toast");

    /* =====================================================
       10. STATE
       ===================================================== */

    const state = {
        section: "dashboard",
        filter: "waiting",
        search: "",
        jobs: [],
        assignments: {},
        openJob: null,
        crew: [],
        bay: "",
    };

    /* =====================================================
       11. SESSION
       ===================================================== */

    function readSession() {
        const stored =
            localStorage.getItem(STORAGE.session) ||
            sessionStorage.getItem(STORAGE.session);

        if (!stored) {
            return null;
        }

        try {
            return JSON.parse(stored);
        } catch (error) {
            console.warn("Unable to read session.", error);

            return null;
        }
    }

    function guardSession() {
        const session = readSession();

        if (!session || !session.authenticated || session.roleKey !== "supervisor") {
            window.location.replace(SIGN_IN_URL);

            return null;
        }

        const initials = (session.userName || "SV")
            .split(" ")
            .map(function (word) {
                return word.charAt(0);
            })
            .join("")
            .slice(0, 2)
            .toUpperCase();

        $("userName").textContent = session.userName;

        $("userId").textContent = session.userId;

        $("userInitials").textContent = initials;

        $("topName").textContent = session.userName;

        $("topInitials").textContent = initials;

        return session;
    }

    function handleLogout() {
        localStorage.removeItem(STORAGE.session);

        sessionStorage.removeItem(STORAGE.session);

        window.location.href = SIGN_IN_URL;
    }

    /* =====================================================
       12. DATA
       ===================================================== */

    /*
     * Job cards come from the Job Card Entry desk when that
     * screen has written them. Until then the seed set above
     * keeps this desk usable on its own.
     */

    function loadJobCards() {
        const stored = localStorage.getItem(STORAGE.jobCards);

        if (!stored) {
            return SEED_JOB_CARDS.slice();
        }

        try {
            const parsed = JSON.parse(stored);

            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.filter(function (job) {
                    return job && job.no && Array.isArray(job.lines);
                });
            }
        } catch (error) {
            console.warn("Unable to read job cards.", error);
        }

        return SEED_JOB_CARDS.slice();
    }

    function loadAssignments() {
        const stored = localStorage.getItem(STORAGE.assignments);

        if (!stored) {
            return {};
        }

        try {
            const parsed = JSON.parse(stored);

            return parsed && typeof parsed === "object" ? parsed : {};
        } catch (error) {
            console.warn("Unable to read assignments.", error);

            return {};
        }
    }

    function saveAssignments() {
        localStorage.setItem(
            STORAGE.assignments,
            JSON.stringify(state.assignments)
        );
    }

    function assignmentFor(no) {
        return state.assignments[no] || null;
    }

    function findJob(no) {
        return (
            state.jobs.find(function (job) {
                return job.no === no;
            }) || null
        );
    }

    function waitingJobs() {
        return state.jobs.filter(function (job) {
            return !assignmentFor(job.no);
        });
    }

    /**
     * A mechanic engaged on another job card is unavailable.
     */
    function busyElsewhere(code) {
        const jobs = Object.keys(state.assignments);

        for (let index = 0; index < jobs.length; index += 1) {
            const no = jobs[index];

            if (state.openJob && no === state.openJob.no) {
                continue;
            }

            const onCrew = (state.assignments[no].crew || []).some(function (m) {
                return m.code === code;
            });

            if (onCrew) {
                return { job: no, bay: state.assignments[no].bay };
            }
        }

        return null;
    }

    /* =====================================================
       13. SMALL BUILDERS
       ===================================================== */

    function el(tag, className, text) {
        const node = document.createElement(tag);

        if (className) {
            node.className = className;
        }

        if (text !== undefined) {
            node.textContent = text;
        }

        return node;
    }

    function badge(text, tone) {
        return el("span", "badge " + (tone || "gray"), text);
    }

    function priorityBadge(priority) {
        const tone =
            priority === "Urgent" ? "red" : priority === "High" ? "orange" : "gray";

        return badge(priority, tone);
    }

    function statusBadge(job) {
        const record = assignmentFor(job.no);

        return record
            ? badge("IN " + record.bay.toUpperCase(), "green")
            : badge("WAITING", "orange");
    }

    function tradeBadges(codes, tone) {
        const wrap = el("span");

        codes.forEach(function (code) {
            wrap.appendChild(badge(code, tone || "outline"));
        });

        return wrap;
    }

    function showToast(message, tone) {
        toast.textContent = message;

        toast.className = "toast show " + (tone || "");

        window.clearTimeout(showToast.timer);

        showToast.timer = window.setTimeout(function () {
            toast.className = "toast";
        }, 2800);
    }

    /* =====================================================
       14. NAVIGATION
       ===================================================== */

    function showSection(name) {
        if (!sections[name]) {
            return;
        }

        state.section = name;

        Object.keys(sections).forEach(function (key) {
            sections[key].classList.toggle("active", key === name);
        });

        navItems.forEach(function (item) {
            item.classList.toggle("active", item.dataset.section === name);
        });

        pageTitle.textContent = PAGE_TITLES[name];

        pageTitle.focus();

        if (name === "dashboard") {
            renderDashboard();
        }

        if (name === "assign") {
            renderJobTable();
        }

        if (name === "roster") {
            renderRoster();
        }
    }

    /* =====================================================
       15. DASHBOARD
       ===================================================== */

    function renderDashboard() {
        const totals = summarise(state.jobs, state.assignments);

        statWaiting.textContent = String(totals.waiting);

        statInBay.textContent = String(totals.inBay);

        statFree.textContent =
            totals.mechanicsFree + " / " + totals.mechanicsTotal;

        statUrgent.textContent = String(totals.urgent);

        navAssignCount.textContent = String(totals.waiting);

        renderWaitingList();

        renderTradeChart();

        renderMechanicTable(totals);
    }

    function renderWaitingList() {
        const waiting = waitingJobs();

        waitingList.innerHTML = "";

        if (waiting.length === 0) {
            const empty = el("div", "empty-state");

            empty.appendChild(el("strong", null, "Every job card has a crew"));

            empty.appendChild(
                el("span", null, "New arrivals will appear here as they are opened.")
            );

            waitingList.appendChild(empty);

            return;
        }

        waiting.slice(0, 6).forEach(function (job) {
            const row = el("button", "dashboard-item");

            row.type = "button";

            row.dataset.openJob = job.no;

            const main = el("div", "dashboard-item-main");

            main.appendChild(el("strong", null, job.no + " · " + job.vehicle));

            main.appendChild(
                el(
                    "span",
                    null,
                    job.registration +
                        " · " +
                        job.customer +
                        " · " +
                        jobHours(job).toFixed(1) +
                        " hrs"
                )
            );

            const value = el("div", "dashboard-item-value");

            value.appendChild(priorityBadge(job.priority));

            value.appendChild(tradeBadges(requiredTrades(job)));

            row.appendChild(main);

            row.appendChild(value);

            waitingList.appendChild(row);
        });
    }

    function renderTradeChart() {
        const waiting = waitingJobs();

        const hours = hoursByTrade(waiting);

        const peak = Math.max(
            1,
            ...TRADE_ORDER.map(function (trade) {
                return hours[trade];
            })
        );

        tradeChart.innerHTML = "";

        TRADE_ORDER.forEach(function (trade) {
            const inTrade = ROSTER.filter(function (mechanic) {
                return mechanic.trade === trade;
            });

            const free = inTrade.filter(function (mechanic) {
                return !mechanicState(state.assignments, mechanic.code).engaged;
            });

            const row = el("div", "chart-row");

            row.appendChild(el("div", "chart-row-label", TRADES[trade].label));

            const track = el("div", "chart-row-track");

            const tone = free.length === 0 && hours[trade] > 0 ? " red" : free.length === 0 ? " orange" : "";

            const fill = el("div", "chart-row-fill" + tone);

            fill.style.width = Math.round((hours[trade] / peak) * 100) + "%";

            track.appendChild(fill);

            row.appendChild(track);

            row.appendChild(
                el(
                    "div",
                    "chart-row-value",
                    hours[trade].toFixed(1) + " h · " + free.length + "/" + inTrade.length
                )
            );

            tradeChart.appendChild(row);
        });
    }

    function renderMechanicTable(totals) {
        mechSummary.textContent =
            totals.mechanicsFree +
            " free · " +
            totals.mechanicsEngaged +
            " on a job · " +
            totals.baysFree +
            " bays free";

        dashMechBody.innerHTML = "";

        ROSTER.forEach(function (mechanic) {
            const where = mechanicState(state.assignments, mechanic.code);

            const row = el("tr");

            row.appendChild(el("td", "cell-strong", mechanic.code));

            row.appendChild(el("td", null, mechanic.name));

            const trade = el("td");

            trade.appendChild(badge(mechanic.trade, "blue"));

            trade.appendChild(el("div", "cell-muted", TRADES[mechanic.trade].label));

            row.appendChild(trade);

            const status = el("td");

            status.appendChild(
                where.engaged ? badge("ON A JOB", "orange") : badge("FREE", "green")
            );

            row.appendChild(status);

            row.appendChild(el("td", null, where.job || "—"));

            row.appendChild(el("td", null, where.bay || "—"));

            row.appendChild(
                el("td", null, where.engaged ? (where.lead ? "Lead" : "Crew") : "—")
            );

            dashMechBody.appendChild(row);
        });
    }

    /* =====================================================
       16. JOB CARD REGISTER
       ===================================================== */

    function visibleJobs() {
        return state.jobs.filter(function (job) {
            const assigned = !!assignmentFor(job.no);

            if (state.filter === "waiting" && assigned) {
                return false;
            }

            if (state.filter === "assigned" && !assigned) {
                return false;
            }

            return matchesSearch(job, state.search);
        });
    }

    function renderJobTable() {
        const jobs = visibleJobs();

        jobTableBody.innerHTML = "";

        jobResultCount.textContent = String(jobs.length);

        if (jobs.length === 0) {
            const row = el("tr");

            const cell = el("td", "empty-table", "No job cards match this view.");

            cell.colSpan = 9;

            row.appendChild(cell);

            jobTableBody.appendChild(row);

            return;
        }

        jobs.forEach(function (job) {
            const record = assignmentFor(job.no);

            const row = el("tr");

            const no = el("td");

            no.appendChild(el("div", "cell-strong", job.no));

            no.appendChild(el("div", "cell-muted", job.arrival));

            row.appendChild(no);

            const vehicle = el("td");

            vehicle.appendChild(el("div", "cell-strong", job.vehicle));

            vehicle.appendChild(el("div", "cell-muted", job.registration));

            row.appendChild(vehicle);

            const customer = el("td");

            customer.appendChild(el("div", null, job.customer));

            customer.appendChild(el("div", "cell-muted", job.phone));

            row.appendChild(customer);

            const service = el("td");

            service.appendChild(el("div", null, job.serviceType));

            service.appendChild(el("div", "cell-muted", job.visitType));

            row.appendChild(service);

            const priority = el("td");

            priority.appendChild(priorityBadge(job.priority));

            row.appendChild(priority);

            const trades = el("td");

            trades.appendChild(tradeBadges(requiredTrades(job)));

            trades.appendChild(
                el("div", "cell-muted", jobHours(job).toFixed(1) + " std hrs")
            );

            row.appendChild(trades);

            const crew = el("td");

            if (record) {
                record.crew.forEach(function (member) {
                    crew.appendChild(
                        el(
                            "div",
                            member.lead ? "cell-strong" : null,
                            member.name + (member.lead ? " (lead)" : "")
                        )
                    );
                });
            } else {
                crew.appendChild(el("span", "cell-muted", "Not assigned"));
            }

            row.appendChild(crew);

            const status = el("td");

            status.appendChild(statusBadge(job));

            row.appendChild(status);

            const action = el("td");

            const button = el(
                "button",
                "action-btn",
                record ? "Edit crew" : "Assign"
            );

            button.type = "button";

            button.dataset.openJob = job.no;

            action.appendChild(button);

            row.appendChild(action);

            jobTableBody.appendChild(row);
        });
    }

    /* =====================================================
       17. ROSTER PAGE
       ===================================================== */

    function renderRoster() {
        rosterGrid.innerHTML = "";

        TRADE_ORDER.forEach(function (trade) {
            const inTrade = ROSTER.filter(function (mechanic) {
                return mechanic.trade === trade;
            });

            const free = inTrade.filter(function (mechanic) {
                return !mechanicState(state.assignments, mechanic.code).engaged;
            });

            const card = el("div", "trade-card");

            const head = el("div", "trade-card__head");

            const headText = el("div");

            headText.appendChild(el("strong", null, TRADES[trade].label));

            headText.appendChild(
                el(
                    "span",
                    null,
                    inTrade.length + " mechanics · " + free.length + " free now"
                )
            );

            head.appendChild(headText);

            head.appendChild(badge(trade, "blue"));

            card.appendChild(head);

            inTrade.forEach(function (mechanic) {
                const where = mechanicState(state.assignments, mechanic.code);

                const row = el("div", "mech-row");

                row.appendChild(el("div", "avatar small", mechanic.code.slice(1)));

                const main = el("div", "mech-row__main");

                main.appendChild(el("strong", null, mechanic.name));

                main.appendChild(
                    el(
                        "span",
                        null,
                        where.engaged
                            ? where.job +
                                  " · " +
                                  where.bay +
                                  " · " +
                                  (where.lead ? "lead" : "crew")
                            : mechanic.code + " · available"
                    )
                );

                row.appendChild(main);

                row.appendChild(
                    where.engaged ? badge("ON A JOB", "orange") : badge("FREE", "green")
                );

                card.appendChild(row);
            });

            rosterGrid.appendChild(card);
        });
    }

    /* =====================================================
       18. ASSIGNMENT MODAL
       ===================================================== */

    function openAssignModal(no) {
        const job = findJob(no);

        if (!job) {
            return;
        }

        const record = assignmentFor(no);

        state.openJob = job;

        state.crew = record
            ? record.crew.map(function (member) {
                  return Object.assign({}, member);
              })
            : [];

        state.bay = record ? record.bay : "";

        showAllTrades.checked = false;

        crewNotes.value = record && record.notes ? record.notes : "";

        assignError.hidden = true;

        modalJobNo.textContent = job.no;

        modalStatus.textContent = record ? "IN " + record.bay.toUpperCase() : "WAITING";

        modalStatus.className = "badge " + (record ? "green" : "orange");

        modalVehicle.textContent = job.vehicle + " · " + job.registration;

        modalCustomer.textContent = job.customer;

        modalService.textContent = job.serviceType + " · " + job.visitType;

        modalPromised.textContent = job.promised;

        recallBtn.hidden = !record;

        saveAssign.textContent = record
            ? "Update crew →"
            : "Assign mechanics →";

        renderBaySelect(record);

        renderModal();

        assignModal.classList.add("open");

        document.body.style.overflow = "hidden";
    }

    function closeAssignModal() {
        assignModal.classList.remove("open");

        document.body.style.overflow = "";

        state.openJob = null;

        state.crew = [];

        state.bay = "";
    }

    function renderModal() {
        renderModalLines();

        renderPicker();

        renderCrew();
    }

    function renderModalLines() {
        const job = state.openJob;

        const covered = coveredTrades(state.crew);

        modalLines.innerHTML = "";

        job.lines.forEach(function (line) {
            const isCovered = covered.indexOf(line.trade) !== -1;

            const row = el("tr");

            row.appendChild(el("td", null, line.task));

            const trade = el("td");

            trade.appendChild(badge(line.trade, "blue"));

            trade.appendChild(el("div", "cell-muted", TRADES[line.trade].label));

            row.appendChild(trade);

            row.appendChild(el("td", null, line.hours.toFixed(1) + " h"));

            const status = el("td");

            status.appendChild(
                isCovered ? badge("COVERED", "green") : badge("NO MECHANIC", "red")
            );

            row.appendChild(status);

            modalLines.appendChild(row);
        });

        const open = openTrades(job, state.crew);

        if (open.length === 0) {
            coverageNote.className = "ok";

            coverageNote.textContent = "Every trade on this job card is covered";
        } else {
            coverageNote.className = "warn";

            coverageNote.textContent =
                "Still uncovered: " +
                open
                    .map(function (trade) {
                        return TRADES[trade].label.toLowerCase();
                    })
                    .join(", ");
        }
    }

    function renderPicker() {
        const job = state.openJob;

        const required = requiredTrades(job);

        const trades = showAllTrades.checked ? TRADE_ORDER : required;

        mechPicker.innerHTML = "";

        trades.forEach(function (trade) {
            const group = el("div", "picker-group");

            const head = el("div", "picker-group__head");

            head.appendChild(el("strong", null, TRADES[trade].label));

            head.appendChild(
                badge(
                    required.indexOf(trade) === -1 ? "NOT NEEDED" : "NEEDED",
                    required.indexOf(trade) === -1 ? "gray" : "blue"
                )
            );

            group.appendChild(head);

            ROSTER.filter(function (mechanic) {
                return mechanic.trade === trade;
            }).forEach(function (mechanic) {
                const selected = state.crew.some(function (member) {
                    return member.code === mechanic.code;
                });

                const busy = busyElsewhere(mechanic.code);

                const option = el("button", "picker-option");

                option.type = "button";

                option.dataset.toggle = mechanic.code;

                if (selected) {
                    option.classList.add("selected");
                }

                if (busy && !selected) {
                    option.disabled = true;
                }

                option.appendChild(el("span", "picker-box", selected ? "✓" : ""));

                const main = el("div", "picker-option__main");

                main.appendChild(el("strong", null, mechanic.name));

                main.appendChild(
                    el(
                        "span",
                        null,
                        busy && !selected
                            ? mechanic.code + " · on " + busy.job + " in " + busy.bay
                            : mechanic.code + " · available"
                    )
                );

                option.appendChild(main);

                group.appendChild(option);
            });

            mechPicker.appendChild(group);
        });
    }

    function renderCrew() {
        const job = state.openJob;

        const required = requiredTrades(job);

        crewListEl.innerHTML = "";

        crewEmpty.hidden = state.crew.length > 0;

        crewNote.textContent =
            state.crew.length === 0
                ? "No mechanics selected"
                : state.crew.length === 1
                ? "1 mechanic"
                : state.crew.length + " mechanics";

        state.crew.forEach(function (member) {
            const row = el("div", "crew-row");

            row.appendChild(el("div", "avatar small", member.code.slice(1)));

            const main = el("div", "crew-row__main");

            main.appendChild(el("strong", null, member.name));

            const offTrade = required.indexOf(member.trade) === -1;

            main.appendChild(
                el(
                    "span",
                    offTrade ? "warn" : null,
                    offTrade
                        ? member.code +
                              " · " +
                              TRADES[member.trade].label +
                              " — not a trade on this job card"
                        : member.code + " · " + TRADES[member.trade].label
                )
            );

            row.appendChild(main);

            const lead = el("label", "lead-toggle");

            const leadInput = document.createElement("input");

            leadInput.type = "radio";

            leadInput.name = "crewLead";

            leadInput.value = member.code;

            leadInput.checked = !!member.lead;

            lead.appendChild(leadInput);

            lead.appendChild(el("span", null, "Lead"));

            row.appendChild(lead);

            const remove = el("button", "remove-btn", "Remove");

            remove.type = "button";

            remove.dataset.remove = member.code;

            row.appendChild(remove);

            crewListEl.appendChild(row);
        });
    }

    function renderBaySelect(record) {
        const taken = Object.keys(state.assignments)
            .filter(function (no) {
                return !state.openJob || no !== state.openJob.no;
            })
            .map(function (no) {
                return state.assignments[no].bay;
            });

        bay.innerHTML = "";

        const blank = document.createElement("option");

        blank.value = "";

        blank.textContent = "Select a bay";

        bay.appendChild(blank);

        BAYS.forEach(function (bayName) {
            const option = document.createElement("option");

            option.value = bayName;

            option.textContent =
                taken.indexOf(bayName) === -1 ? bayName : bayName + " — occupied";

            option.disabled = taken.indexOf(bayName) !== -1;

            bay.appendChild(option);
        });

        state.bay = record ? record.bay : state.bay;

        bay.value = state.bay || "";
    }

    /* =====================================================
       19. CREW EDITS
       ===================================================== */

    function toggleMechanic(code) {
        const already = state.crew.some(function (member) {
            return member.code === code;
        });

        if (already) {
            removeMechanic(code);

            return;
        }

        const mechanic = findMechanic(code);

        if (!mechanic || busyElsewhere(code)) {
            return;
        }

        state.crew.push({
            code: mechanic.code,
            name: mechanic.name,
            trade: mechanic.trade,
            lead: state.crew.length === 0,
        });

        assignError.hidden = true;

        renderModal();
    }

    function removeMechanic(code) {
        const wasLead = state.crew.some(function (member) {
            return member.code === code && member.lead;
        });

        state.crew = state.crew.filter(function (member) {
            return member.code !== code;
        });

        if (wasLead && state.crew.length > 0) {
            state.crew[0].lead = true;
        }

        assignError.hidden = true;

        renderModal();
    }

    function setLead(code) {
        state.crew.forEach(function (member) {
            member.lead = member.code === code;
        });

        renderCrew();
    }

    /* =====================================================
       20. SAVE / RECALL
       ===================================================== */

    function handleSave() {
        const job = state.openJob;

        if (!job) {
            return;
        }

        const check = validateAssignment(job, state.crew, state.bay);

        if (!check.ok) {
            assignError.textContent = check.message;

            assignError.hidden = false;

            showToast(check.message, "error");

            return;
        }

        const lead = state.crew.find(function (member) {
            return member.lead;
        });

        state.assignments[job.no] = {
            bay: state.bay,
            crew: state.crew.map(function (member) {
                return Object.assign({}, member);
            }),
            notes: crewNotes.value.trim(),
            assignedAt: new Date().toISOString(),
        };

        saveAssignments();

        closeAssignModal();

        renderDashboard();

        renderJobTable();

        renderRoster();

        showToast(
            job.no +
                " assigned to " +
                state.assignments[job.no].crew.length +
                " mechanic(s) in " +
                state.assignments[job.no].bay +
                " · lead " +
                lead.name,
            "success"
        );
    }

    function handleRecall() {
        const job = state.openJob;

        if (!job || !assignmentFor(job.no)) {
            return;
        }

        delete state.assignments[job.no];

        saveAssignments();

        closeAssignModal();

        renderDashboard();

        renderJobTable();

        renderRoster();

        showToast(job.no + " is back in the waiting list.");
    }

    /* =====================================================
       21. EVENTS
       ===================================================== */

    function bindEvents() {
        logoutBtn.addEventListener("click", handleLogout);

        sectionLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                showSection(link.dataset.section);
            });
        });

        filterTabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                state.filter = tab.dataset.filter;

                filterTabs.forEach(function (other) {
                    other.classList.toggle("active", other === tab);
                });

                renderJobTable();
            });
        });

        jobSearch.addEventListener("input", function () {
            state.search = jobSearch.value;

            renderJobTable();
        });

        clearSearch.addEventListener("click", function () {
            jobSearch.value = "";

            state.search = "";

            renderJobTable();

            jobSearch.focus();
        });

        document.addEventListener("click", function (event) {
            const opener = event.target.closest("[data-open-job]");

            if (opener) {
                openAssignModal(opener.dataset.openJob);
            }
        });

        mechPicker.addEventListener("click", function (event) {
            const option = event.target.closest(".picker-option");

            if (option && !option.disabled) {
                toggleMechanic(option.dataset.toggle);
            }
        });

        crewListEl.addEventListener("click", function (event) {
            const remove = event.target.closest("[data-remove]");

            if (remove) {
                removeMechanic(remove.dataset.remove);
            }
        });

        crewListEl.addEventListener("change", function (event) {
            if (event.target.name === "crewLead") {
                setLead(event.target.value);
            }
        });

        showAllTrades.addEventListener("change", renderPicker);

        bay.addEventListener("change", function () {
            state.bay = bay.value;

            assignError.hidden = true;
        });

        saveAssign.addEventListener("click", handleSave);

        recallBtn.addEventListener("click", handleRecall);

        cancelAssign.addEventListener("click", closeAssignModal);

        modalClose.addEventListener("click", closeAssignModal);

        assignModal.addEventListener("click", function (event) {
            if (event.target.hasAttribute("data-close-modal")) {
                closeAssignModal();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && assignModal.classList.contains("open")) {
                closeAssignModal();
            }
        });
    }

    /* =====================================================
       22. INITIALIZE
       ===================================================== */

    function init() {
        const session = guardSession();

        if (!session) {
            return;
        }

        currentDate.textContent = new Date()
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .toUpperCase();

        state.jobs = loadJobCards();

        state.assignments = loadAssignments();

        bindEvents();

        renderDashboard();

        renderJobTable();

        renderRoster();
    }

    init();
})(typeof window !== "undefined" ? window : globalThis);