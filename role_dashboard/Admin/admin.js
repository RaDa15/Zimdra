/* ============================================================
   ZIMDRA DMS — ADMIN DASHBOARD JS
   ============================================================ */


/* ============================================================
   DEMO DATA
   ============================================================ */

const dashboardDemoData = {

    revenue: {

        7: {

            labels: [
                "02 Sep",
                "03 Sep",
                "04 Sep",
                "05 Sep",
                "06 Sep",
                "07 Sep",
                "08 Sep"
            ],

            values: [
                48500,
                67200,
                55800,
                82400,
                73600,
                91500,
                68900
            ]

        },


        14: {

            labels: [
                "26 Aug",
                "27 Aug",
                "28 Aug",
                "29 Aug",
                "30 Aug",
                "31 Aug",
                "01 Sep",
                "02 Sep",
                "03 Sep",
                "04 Sep",
                "05 Sep",
                "06 Sep",
                "07 Sep",
                "08 Sep"
            ],

            values: [
                45200,
                51800,
                63400,
                48700,
                72900,
                68100,
                55700,
                48500,
                67200,
                55800,
                82400,
                73600,
                91500,
                68900
            ]

        },


        30: {

            labels: [
                "10 Aug",
                "12 Aug",
                "14 Aug",
                "16 Aug",
                "18 Aug",
                "20 Aug",
                "22 Aug",
                "24 Aug",
                "26 Aug",
                "28 Aug",
                "30 Aug",
                "01 Sep",
                "03 Sep",
                "05 Sep",
                "07 Sep"
            ],

            values: [
                42100,
                53800,
                47600,
                69200,
                58400,
                73100,
                65800,
                81200,
                45200,
                63400,
                72900,
                55700,
                67200,
                82400,
                91500
            ]

        }

    },


    paymentMethods: {

        "Cash": 186500,

        "Bank Transfer": 124800,

        "Credit Card": 98500,

        "Mobile Payment": 76400

    },


    jobs: {

        total: 42,

        completed: 17,

        inProgress: 14,

        readyBilling: 7,

        pending: 4

    },


    revenueSnapshot: {

        topRevenueDay: "07 Sep 2026",

        topRevenueAmount: 91500,

        averageTransaction: 4825,

        billingPipeline: 7,

        outstandingAmount: 38600,

        totalRevenue: 486200,

        revenueGrowth: 12.8,

        pendingBills: 8

    },


    users: {

        active: 18

    },


    inventory: {

        lowStock: 9

    }

};


/* ============================================================
   USERS
   ============================================================ */

let users = [

    {
        id: 1,
        name: "Karma Wangchuk",
        username: "karma.admin",
        role: "admin",
        phone: "17123456",
        status: "Active",
        lastActive: "2 mins ago"
    },

    {
        id: 2,
        name: "Sonam Dorji",
        username: "sonam.manager",
        role: "service_manager",
        phone: "17234567",
        status: "Active",
        lastActive: "5 mins ago"
    },

    {
        id: 3,
        name: "Tashi Choden",
        username: "tashi.store",
        role: "storekeeper",
        phone: "17345678",
        status: "Active",
        lastActive: "8 mins ago"
    },

    {
        id: 4,
        name: "Pema Tshering",
        username: "pema.billing",
        role: "billing_clerk",
        phone: "17456789",
        status: "Active",
        lastActive: "12 mins ago"
    },

    {
        id: 5,
        name: "Jigme Namgyal",
        username: "jigme.cash",
        role: "cash_counter",
        phone: "17567890",
        status: "Active",
        lastActive: "18 mins ago"
    },

    {
        id: 6,
        name: "Dorji Thinley",
        username: "dorji.tech",
        role: "technician",
        phone: "17678901",
        status: "Active",
        lastActive: "22 mins ago"
    },

    {
        id: 7,
        name: "Chimi Lhamo",
        username: "chimi.reception",
        role: "reception",
        phone: "17789012",
        status: "Inactive",
        lastActive: "Yesterday"
    },

    {
        id: 8,
        name: "Ugyen Tobgay",
        username: "ugyen.tech",
        role: "technician",
        phone: "17890123",
        status: "Active",
        lastActive: "31 mins ago"
    }

];


/* ============================================================
   WORKSHOP DATA
   ============================================================ */

const workshopJobs = [

    {
        id: "JC-2026-001",
        customer: "Tshering Dorji",
        vehicle: "Toyota Hilux",
        technician: "Dorji Thinley",
        supervisor: "Sonam Dorji",
        status: "In Progress",
        priority: "High"
    },

    {
        id: "JC-2026-002",
        customer: "Pema Wangmo",
        vehicle: "Toyota Corolla",
        technician: "Ugyen Tobgay",
        supervisor: "Sonam Dorji",
        status: "Ready for Billing",
        priority: "Medium"
    },

    {
        id: "JC-2026-003",
        customer: "Karma Lhendup",
        vehicle: "Land Cruiser Prado",
        technician: "Dorji Thinley",
        supervisor: "Sonam Dorji",
        status: "Completed",
        priority: "Low"
    },

    {
        id: "JC-2026-004",
        customer: "Sonam Choden",
        vehicle: "Toyota Fortuner",
        technician: "Ugyen Tobgay",
        supervisor: "Sonam Dorji",
        status: "In Progress",
        priority: "High"
    },

    {
        id: "JC-2026-005",
        customer: "Jigme Wangchuk",
        vehicle: "Toyota RAV4",
        technician: "Dorji Thinley",
        supervisor: "Sonam Dorji",
        status: "Completed",
        priority: "Low"
    },

    {
        id: "JC-2026-006",
        customer: "Dechen Lhamo",
        vehicle: "Toyota Yaris",
        technician: "Ugyen Tobgay",
        supervisor: "Sonam Dorji",
        status: "Ready for Billing",
        priority: "Medium"
    },

    {
        id: "JC-2026-007",
        customer: "Tashi Dorji",
        vehicle: "Hilux Revo",
        technician: "Dorji Thinley",
        supervisor: "Sonam Dorji",
        status: "In Progress",
        priority: "Medium"
    },

    {
        id: "JC-2026-008",
        customer: "Kezang Choden",
        vehicle: "Toyota Camry",
        technician: "Ugyen Tobgay",
        supervisor: "Sonam Dorji",
        status: "Completed",
        priority: "Low"
    }

];


/* ============================================================
   BILLING DATA
   ============================================================ */

const billingRecords = [

    {
        bill: "INV-2026-1001",
        job: "JC-2026-001",
        customer: "Tshering Dorji",
        amount: 48500,
        method: "Cash",
        status: "Paid",
        date: "08 Sep 2026"
    },

    {
        bill: "INV-2026-1002",
        job: "JC-2026-002",
        customer: "Pema Wangmo",
        amount: 67200,
        method: "Bank Transfer",
        status: "Paid",
        date: "07 Sep 2026"
    },

    {
        bill: "INV-2026-1003",
        job: "JC-2026-003",
        customer: "Karma Lhendup",
        amount: 55800,
        method: "Mobile Payment",
        status: "Paid",
        date: "06 Sep 2026"
    },

    {
        bill: "INV-2026-1004",
        job: "JC-2026-004",
        customer: "Sonam Choden",
        amount: 82400,
        method: "Credit Card",
        status: "Paid",
        date: "05 Sep 2026"
    },

    {
        bill: "INV-2026-1005",
        job: "JC-2026-005",
        customer: "Jigme Wangchuk",
        amount: 38600,
        method: "Cash",
        status: "Pending",
        date: "04 Sep 2026"
    },

    {
        bill: "INV-2026-1006",
        job: "JC-2026-006",
        customer: "Dechen Lhamo",
        amount: 73600,
        method: "Bank Transfer",
        status: "Paid",
        date: "03 Sep 2026"
    },

    {
        bill: "INV-2026-1007",
        job: "JC-2026-007",
        customer: "Tashi Dorji",
        amount: 91500,
        method: "Cash",
        status: "Paid",
        date: "07 Sep 2026"
    },

    {
        bill: "INV-2026-1008",
        job: "JC-2026-008",
        customer: "Kezang Choden",
        amount: 68900,
        method: "Mobile Payment",
        status: "Pending",
        date: "02 Sep 2026"
    }

];


/* ============================================================
   INVENTORY DATA
   ============================================================ */

const inventory = [

    {
        partNo: "BP-001",
        name: "Brake Pad Front",
        stock: 24,
        reorder: 10,
        price: 2850
    },

    {
        partNo: "OF-002",
        name: "Engine Oil Filter",
        stock: 8,
        reorder: 10,
        price: 850
    },

    {
        partNo: "AF-003",
        name: "Air Filter",
        stock: 17,
        reorder: 8,
        price: 1250
    },

    {
        partNo: "SP-004",
        name: "Spark Plug",
        stock: 5,
        reorder: 12,
        price: 620
    },

    {
        partNo: "BAT-005",
        name: "Battery 12V",
        stock: 0,
        reorder: 5,
        price: 12800
    },

    {
        partNo: "ATF-006",
        name: "ATF Fluid",
        stock: 32,
        reorder: 10,
        price: 1450
    },

    {
        partNo: "WB-007",
        name: "Wiper Blade",
        stock: 14,
        reorder: 6,
        price: 950
    },

    {
        partNo: "CL-008",
        name: "Coolant",
        stock: 7,
        reorder: 10,
        price: 1250
    },

    {
        partNo: "BR-009",
        name: "Brake Rotor",
        stock: 6,
        reorder: 5,
        price: 6200
    },

    {
        partNo: "CV-010",
        name: "CV Joint",
        stock: 3,
        reorder: 6,
        price: 8900
    }

];


/* ============================================================
   AUDIT DATA
   ============================================================ */

const auditLogs = [

    {
        date: "08 Sep 2026 14:21",
        user: "System Admin",
        action: "LOGIN",
        module: "Authentication",
        description: "Administrator logged into the system"
    },

    {
        date: "08 Sep 2026 14:16",
        user: "Tashi Choden",
        action: "PART ISSUE",
        module: "Inventory",
        description: "Parts issued against JC-2026-001"
    },

    {
        date: "08 Sep 2026 14:03",
        user: "Pema Tshering",
        action: "INVOICE",
        module: "Billing",
        description: "Invoice INV-2026-1001 generated"
    },

    {
        date: "08 Sep 2026 13:48",
        user: "Sonam Dorji",
        action: "JOB UPDATE",
        module: "Workshop",
        description: "JC-2026-002 moved to Ready for Billing"
    },

    {
        date: "08 Sep 2026 13:22",
        user: "Jigme Namgyal",
        action: "PAYMENT",
        module: "Cash Counter",
        description: "Customer payment received"
    },

    {
        date: "08 Sep 2026 12:58",
        user: "System Admin",
        action: "USER UPDATE",
        module: "Users",
        description: "Technician user account updated"
    }

];


/* ============================================================
   CHART VARIABLES
   ============================================================ */

let revenueTrendChart = null;

let paymentMethodChart = null;

let jobStatusChart = null;

let technicianPerformanceChart = null;


/* ============================================================
   HELPERS
   ============================================================ */

function formatCurrency(value) {

    return "Nu. " + Number(value).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


function formatNumber(value) {

    return Number(value).toLocaleString("en-IN");

}


function getInitials(name) {

    return name
        .split(" ")
        .map(word => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

}


function showToast(message) {

    const toast =
        document.getElementById("toast");

    const messageElement =
        document.getElementById("toastMessage");

    messageElement.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

}


/* ============================================================
   DATE / TIME
   ============================================================ */

function updateDateTime() {

    const now = new Date();

    document.getElementById(
        "currentDate"
    ).textContent = now.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );


    document.getElementById(
        "currentTime"
    ).textContent = now.toLocaleTimeString(
        "en-GB",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );

}


setInterval(updateDateTime, 1000);


/* ============================================================
   DASHBOARD KPI
   ============================================================ */

function updateDashboardKPIs() {

    const snapshot =
        dashboardDemoData.revenueSnapshot;

    const jobs =
        dashboardDemoData.jobs;


    document.getElementById(
        "totalRevenue"
    ).textContent =
        formatCurrency(snapshot.totalRevenue);


    document.getElementById(
        "revenueGrowth"
    ).textContent =
        "+" + snapshot.revenueGrowth + "%";


    document.getElementById(
        "totalJobs"
    ).textContent =
        jobs.total;


    document.getElementById(
        "activeJobs"
    ).textContent =
        jobs.inProgress;


    document.getElementById(
        "readyBilling"
    ).textContent =
        jobs.readyBilling;


    document.getElementById(
        "pendingPayment"
    ).textContent =
        formatCurrency(
            snapshot.outstandingAmount
        );


    document.getElementById(
        "pendingBillsCount"
    ).textContent =
        snapshot.pendingBills;


    document.getElementById(
        "lowStock"
    ).textContent =
        dashboardDemoData.inventory.lowStock;


    document.getElementById(
        "activeUsers"
    ).textContent =
        dashboardDemoData.users.active;

}


/* ============================================================
   REVENUE SNAPSHOT
   ============================================================ */

function updateRevenueSnapshot() {

    const snapshot =
        dashboardDemoData.revenueSnapshot;


    document.getElementById(
        "topRevenueDay"
    ).textContent =
        snapshot.topRevenueDay;


    document.getElementById(
        "topRevenueAmount"
    ).textContent =
        formatCurrency(
            snapshot.topRevenueAmount
        );


    document.getElementById(
        "averageTransaction"
    ).textContent =
        formatCurrency(
            snapshot.averageTransaction
        );


    document.getElementById(
        "billingPipeline"
    ).textContent =
        snapshot.billingPipeline;


    document.getElementById(
        "outstandingAmount"
    ).textContent =
        formatCurrency(
            snapshot.outstandingAmount
        );

}


/* ============================================================
   REVENUE TREND CHART
   ============================================================ */

function renderRevenueTrend(range = 7) {

    const canvas =
        document.getElementById(
            "revenueTrendChart"
        );

    if (!canvas) return;


    const data =
        dashboardDemoData.revenue[range];


    if (revenueTrendChart) {

        revenueTrendChart.destroy();

    }


    revenueTrendChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: data.labels,

                    datasets: [

                        {

                            label:
                                "Revenue Earned",

                            data:
                                data.values,

                            tension:
                                0.35,

                            fill:
                                true,

                            pointRadius:
                                4,

                            pointHoverRadius:
                                6,

                            borderWidth:
                                3

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    interaction: {

                        intersect:
                            false,

                        mode:
                            "index"

                    },


                    plugins: {

                        legend: {

                            display:
                                false

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            " Revenue: " +
                                            formatCurrency(
                                                context.parsed.y
                                            )
                                        );

                                    }

                            }

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                callback:
                                    function(value) {

                                        return (
                                            "Nu. " +
                                            Number(value)
                                                .toLocaleString(
                                                    "en-IN"
                                                )
                                        );

                                    }

                            }

                        },


                        x: {

                            grid: {

                                display:
                                    false

                            }

                        }

                    }

                }

            }
        );

}


/* ============================================================
   PAYMENT METHOD CHART
   ============================================================ */

function renderPaymentMethodChart() {

    const canvas =
        document.getElementById(
            "paymentMethodChart"
        );

    if (!canvas) return;


    const methods =
        dashboardDemoData.paymentMethods;


    if (paymentMethodChart) {

        paymentMethodChart.destroy();

    }


    paymentMethodChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels:
                        Object.keys(methods),

                    datasets: [

                        {

                            data:
                                Object.values(methods),

                            borderWidth:
                                2

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "65%",


                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        const total =
                                            Object.values(
                                                methods
                                            ).reduce(
                                                (
                                                    sum,
                                                    value
                                                ) =>
                                                    sum + value,
                                                0
                                            );


                                        const percentage =
                                            (
                                                context.parsed /
                                                total *
                                                100
                                            ).toFixed(1);


                                        return (
                                            context.label +
                                            ": " +
                                            formatCurrency(
                                                context.parsed
                                            ) +
                                            " (" +
                                            percentage +
                                            "%)"
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/* ============================================================
   JOB STATUS CHART
   ============================================================ */

function renderJobStatusChart() {

    const canvas =
        document.getElementById(
            "jobStatusChart"
        );

    if (!canvas) return;


    const jobs =
        dashboardDemoData.jobs;


    if (jobStatusChart) {

        jobStatusChart.destroy();

    }


    jobStatusChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Completed",
                        "In Progress",
                        "Ready for Billing",
                        "Pending"
                    ],

                    datasets: [

                        {

                            data: [

                                jobs.completed,

                                jobs.inProgress,

                                jobs.readyBilling,

                                jobs.pending

                            ],

                            borderWidth:
                                2

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "65%",


                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );

}


/* ============================================================
   TECHNICIAN PERFORMANCE
   ============================================================ */

function renderTechnicianPerformanceChart() {

    const canvas =
        document.getElementById(
            "technicianPerformanceChart"
        );

    if (!canvas) return;


    if (technicianPerformanceChart) {

        technicianPerformanceChart.destroy();

    }


    technicianPerformanceChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Dorji Thinley",
                        "Ugyen Tobgay",
                        "Karma Wangchuk",
                        "Pema Dorji"
                    ],

                    datasets: [

                        {

                            label:
                                "Completed Jobs",

                            data: [
                                8,
                                6,
                                5,
                                4
                            ],

                            borderRadius:
                                6

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                stepSize:
                                    2

                            }

                        },

                        x: {

                            grid: {

                                display:
                                    false

                            }

                        }

                    }

                }

            }
        );

}


/* ============================================================
   REVENUE RANGE BUTTONS
   ============================================================ */

function initializeRevenueRangeButtons() {

    const buttons =
        document.querySelectorAll(
            ".range-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function() {

                buttons.forEach(btn =>
                    btn.classList.remove(
                        "active"
                    )
                );


                this.classList.add(
                    "active"
                );


                const range =
                    Number(
                        this.dataset.range
                    );


                renderRevenueTrend(
                    range
                );

            }
        );

    });

}


/* ============================================================
   USERS TABLE
   ============================================================ */

function roleLabel(role) {

    const labels = {

        admin: "Administrator",

        service_manager:
            "Service Manager",

        storekeeper:
            "Storekeeper",

        billing_clerk:
            "Billing Clerk",

        cash_counter:
            "Cash Counter",

        technician:
            "Technician",

        reception:
            "Reception"

    };


    return labels[role] || role;

}


function renderUsers() {

    const tbody =
        document.getElementById(
            "usersTableBody"
        );


    const search =
        document.getElementById(
            "userSearch"
        ).value.toLowerCase();


    const role =
        document.getElementById(
            "roleFilter"
        ).value;


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const filtered =
        users.filter(user => {

            const matchesSearch =
                user.name
                    .toLowerCase()
                    .includes(search) ||

                user.username
                    .toLowerCase()
                    .includes(search);


            const matchesRole =
                role === "all" ||
                user.role === role;


            const matchesStatus =
                status === "all" ||
                user.status === status;


            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );

        });


    tbody.innerHTML = "";


    filtered.forEach(user => {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>

                <div class="user-cell">

                    <div class="user-avatar">
                        ${getInitials(user.name)}
                    </div>

                    <div>

                        <strong>
                            ${user.name}
                        </strong>

                        <span>
                            ${user.username}
                        </span>

                    </div>

                </div>

            </td>


            <td>
                ${user.username}
            </td>


            <td>
                ${roleLabel(user.role)}
            </td>


            <td>
                ${user.phone || "-"}
            </td>


            <td>

                <span class="status ${
                    user.status === "Active"
                        ? "active"
                        : "inactive"
                }">

                    ${user.status}

                </span>

            </td>


            <td>
                ${user.lastActive}
            </td>


            <td>

                <div class="table-actions">

                    <button
                        class="table-action"
                        onclick="editUser(${user.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="table-action"
                        onclick="deleteUser(${user.id})"
                    >
                        Delete
                    </button>

                </div>

            </td>

        `;


        tbody.appendChild(row);

    });

}


/* ============================================================
   USER MODAL
   ============================================================ */

function openUserModal(user = null) {

    const modal =
        document.getElementById(
            "userModal"
        );


    const title =
        document.getElementById(
            "modalTitle"
        );


    if (user) {

        title.textContent =
            "Edit User";


        document.getElementById(
            "editUserId"
        ).value =
            user.id;


        document.getElementById(
            "userName"
        ).value =
            user.name;


        document.getElementById(
            "username"
        ).value =
            user.username;


        document.getElementById(
            "userRole"
        ).value =
            user.role;


        document.getElementById(
            "userPhone"
        ).value =
            user.phone;


        document.getElementById(
            "userStatus"
        ).value =
            user.status;

    } else {

        title.textContent =
            "Add User";


        document.getElementById(
            "userForm"
        ).reset();


        document.getElementById(
            "editUserId"
        ).value = "";

    }


    modal.classList.add("open");

}


function closeUserModal() {

    document.getElementById(
        "userModal"
    ).classList.remove(
        "open"
    );

}


function editUser(id) {

    const user =
        users.find(
            user =>
                user.id === id
        );


    if (user) {

        openUserModal(user);

    }

}


function deleteUser(id) {

    const user =
        users.find(
            user =>
                user.id === id
        );


    if (!user) return;


    const confirmed =
        confirm(
            `Delete ${user.name}?`
        );


    if (!confirmed) return;


    users =
        users.filter(
            user =>
                user.id !== id
        );


    renderUsers();

    showToast(
        "User deleted successfully"
    );

}


/* ============================================================
   SAVE USER
   ============================================================ */

function saveUser(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "editUserId"
        ).value;


    const userData = {

        name:
            document.getElementById(
                "userName"
            ).value.trim(),

        username:
            document.getElementById(
                "username"
            ).value.trim(),

        role:
            document.getElementById(
                "userRole"
            ).value,

        phone:
            document.getElementById(
                "userPhone"
            ).value.trim(),

        status:
            document.getElementById(
                "userStatus"
            ).value

    };


    if (id) {

        const user =
            users.find(
                user =>
                    user.id === Number(id)
            );


        if (user) {

            Object.assign(
                user,
                userData
            );

            showToast(
                "User updated successfully"
            );

        }

    } else {

        const newUser = {

            id:
                Date.now(),

            ...userData,

            lastActive:
                "Just now"

        };


        users.push(
            newUser
        );


        showToast(
            "User added successfully"
        );

    }


    closeUserModal();

    renderUsers();

}


/* ============================================================
   WORKSHOP TABLE
   ============================================================ */

function renderWorkshop() {

    const tbody =
        document.getElementById(
            "workshopTableBody"
        );


    tbody.innerHTML = "";


    workshopJobs.forEach(job => {

        const row =
            document.createElement(
                "tr"
            );


        let statusClass =
            "progress";


        if (
            job.status ===
            "Completed"
        ) {

            statusClass =
                "completed";

        } else if (
            job.status ===
            "Ready for Billing"
        ) {

            statusClass =
                "ready";

        }


        row.innerHTML = `

            <td>
                <strong>
                    ${job.id}
                </strong>
            </td>

            <td>
                ${job.customer}
            </td>

            <td>
                ${job.vehicle}
            </td>

            <td>
                ${job.technician}
            </td>

            <td>
                ${job.supervisor}
            </td>

            <td>

                <span class="status ${statusClass}">
                    ${job.status}
                </span>

            </td>

            <td>

                <span class="priority ${
                    job.priority.toLowerCase()
                }">

                    ${job.priority}

                </span>

            </td>

        `;


        tbody.appendChild(row);

    });


    document.getElementById(
        "workTotalJobs"
    ).textContent =
        dashboardDemoData.jobs.total;


    document.getElementById(
        "workInProgress"
    ).textContent =
        dashboardDemoData.jobs.inProgress;


    document.getElementById(
        "workReadyBilling"
    ).textContent =
        dashboardDemoData.jobs.readyBilling;


    document.getElementById(
        "workCompleted"
    ).textContent =
        dashboardDemoData.jobs.completed;

}


/* ============================================================
   BILLING TABLE
   ============================================================ */

function renderBilling() {

    const tbody =
        document.getElementById(
            "billingTableBody"
        );


    tbody.innerHTML = "";


    billingRecords.forEach(record => {

        const row =
            document.createElement(
                "tr"
            );


        const statusClass =
            record.status === "Paid"
                ? "completed"
                : "warning";


        row.innerHTML = `

            <td>
                <strong>
                    ${record.bill}
                </strong>
            </td>

            <td>
                ${record.job}
            </td>

            <td>
                ${record.customer}
            </td>

            <td>
                <strong>
                    ${formatCurrency(record.amount)}
                </strong>
            </td>

            <td>
                ${record.method}
            </td>

            <td>

                <span class="status ${statusClass}">
                    ${record.status}
                </span>

            </td>

            <td>
                ${record.date}
            </td>

        `;


        tbody.appendChild(row);

    });


    const paid =
        billingRecords.filter(
            record =>
                record.status === "Paid"
        );


    const pending =
        billingRecords.filter(
            record =>
                record.status === "Pending"
        );


    const paidTotal =
        paid.reduce(
            (sum, record) =>
                sum + record.amount,
            0
        );


    const pendingTotal =
        pending.reduce(
            (sum, record) =>
                sum + record.amount,
            0
        );


    const average =
        paid.length
            ? paidTotal / paid.length
            : 0;


    document.getElementById(
        "billingRevenue"
    ).textContent =
        formatCurrency(
            paidTotal
        );


    document.getElementById(
        "paidTransactions"
    ).textContent =
        paid.length;


    document.getElementById(
        "billingPending"
    ).textContent =
        formatCurrency(
            pendingTotal
        );


    document.getElementById(
        "billingAverage"
    ).textContent =
        formatCurrency(
            average
        );

}


/* ============================================================
   INVENTORY TABLE
   ============================================================ */

function renderInventory() {

    const tbody =
        document.getElementById(
            "inventoryTableBody"
        );


    tbody.innerHTML = "";


    let lowStockCount = 0;

    let outStockCount = 0;

    let totalValue = 0;


    inventory.forEach(item => {

        const stockValue =
            item.stock *
            item.price;


        totalValue +=
            stockValue;


        let status =
            "Healthy";

        let statusClass =
            "completed";


        if (
            item.stock === 0
        ) {

            status =
                "Out of Stock";

            statusClass =
                "inactive";

            outStockCount++;

        } else if (
            item.stock <=
            item.reorder
        ) {

            status =
                "Low Stock";

            statusClass =
                "warning";

            lowStockCount++;

        }


        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                <strong>
                    ${item.partNo}
                </strong>
            </td>

            <td>
                ${item.name}
            </td>

            <td>
                <strong>
                    ${item.stock}
                </strong>
            </td>

            <td>
                ${item.reorder}
            </td>

            <td>
                ${formatCurrency(item.price)}
            </td>

            <td>
                ${formatCurrency(stockValue)}
            </td>

            <td>

                <span class="status ${statusClass}">
                    ${status}
                </span>

            </td>

        `;


        tbody.appendChild(row);

    });


    document.getElementById(
        "inventoryTotal"
    ).textContent =
        inventory.length;


    document.getElementById(
        "inventoryLow"
    ).textContent =
        lowStockCount;


    document.getElementById(
        "inventoryOut"
    ).textContent =
        outStockCount;


    document.getElementById(
        "inventoryValue"
    ).textContent =
        formatCurrency(
            totalValue
        );

}


/* ============================================================
   AUDIT TABLE
   ============================================================ */

function renderAudit() {

    const tbody =
        document.getElementById(
            "auditTableBody"
        );


    tbody.innerHTML = "";


    auditLogs.forEach(log => {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                ${log.date}
            </td>

            <td>
                <strong>
                    ${log.user}
                </strong>
            </td>

            <td>
                <span class="status progress">
                    ${log.action}
                </span>
            </td>

            <td>
                ${log.module}
            </td>

            <td>
                ${log.description}
            </td>

        `;


        tbody.appendChild(row);

    });

}


/* ============================================================
   NAVIGATION
   ============================================================ */

function initializeNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const tab =
                    item.dataset.tab;


                navItems.forEach(
                    nav =>
                        nav.classList.remove(
                            "active"
                        )
                );


                item.classList.add(
                    "active"
                );


                document
                    .querySelectorAll(
                        ".page-section"
                    )
                    .forEach(section => {

                        section.classList.remove(
                            "active"
                        );

                    });


                const section =
                    document.getElementById(
                        tab
                    );


                if (section) {

                    section.classList.add(
                        "active"
                    );

                }


                updatePageTitle(
                    tab
                );

            }
        );

    });

}


/* ============================================================
   PAGE TITLES
   ============================================================ */

function updatePageTitle(tab) {

    const titles = {

        dashboard:
            "System Dashboard",

        users:
            "Users & Roles",

        workshop:
            "Workshop Monitoring",

        billing:
            "Billing & Payments",

        inventory:
            "Inventory Overview",

        reports:
            "Reports",

        audit:
            "Audit Log",

        settings:
            "System Settings"

    };


    document.getElementById(
        "pageTitle"
    ).textContent =
        titles[tab] ||
        "System Dashboard";

}


/* ============================================================
   EXPORT CSV
   ============================================================ */

function downloadCSV(
    filename,
    headers,
    rows
) {

    const csv = [

        headers,

        ...rows

    ]

        .map(row =>
            row.map(value =>
                `"${String(value)
                    .replace(/"/g, '""')}"`
            ).join(",")
        )

        .join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* ============================================================
   EXPORT FUNCTIONS
   ============================================================ */

function exportDashboard() {

    downloadCSV(

        "zimdra-dashboard.csv",

        [
            "Metric",
            "Value"
        ],

        [
            [
                "Total Revenue",
                dashboardDemoData
                    .revenueSnapshot
                    .totalRevenue
            ],

            [
                "Revenue Growth",
                dashboardDemoData
                    .revenueSnapshot
                    .revenueGrowth + "%"
            ],

            [
                "Total Jobs",
                dashboardDemoData
                    .jobs
                    .total
            ],

            [
                "In Progress",
                dashboardDemoData
                    .jobs
                    .inProgress
            ],

            [
                "Ready Billing",
                dashboardDemoData
                    .jobs
                    .readyBilling
            ],

            [
                "Outstanding",
                dashboardDemoData
                    .revenueSnapshot
                    .outstandingAmount
            ],

            [
                "Low Stock",
                dashboardDemoData
                    .inventory
                    .lowStock
            ],

            [
                "Active Users",
                dashboardDemoData
                    .users
                    .active
            ]

        ]

    );


    showToast(
        "Dashboard exported"
    );

}


function exportWorkshop() {

    downloadCSV(

        "zimdra-workshop-jobs.csv",

        [
            "Job Card",
            "Customer",
            "Vehicle",
            "Technician",
            "Supervisor",
            "Status",
            "Priority"
        ],

        workshopJobs.map(job => [

            job.id,
            job.customer,
            job.vehicle,
            job.technician,
            job.supervisor,
            job.status,
            job.priority

        ])

    );


    showToast(
        "Workshop report exported"
    );

}


function exportBilling() {

    downloadCSV(

        "zimdra-billing.csv",

        [
            "Bill No",
            "Job Card",
            "Customer",
            "Amount",
            "Payment Method",
            "Status",
            "Date"
        ],

        billingRecords.map(record => [

            record.bill,
            record.job,
            record.customer,
            record.amount,
            record.method,
            record.status,
            record.date

        ])

    );


    showToast(
        "Billing report exported"
    );

}


function exportInventory() {

    downloadCSV(

        "zimdra-inventory.csv",

        [
            "Part No",
            "Part Name",
            "Stock",
            "Reorder Level",
            "Unit Price",
            "Stock Value"
        ],

        inventory.map(item => [

            item.partNo,
            item.name,
            item.stock,
            item.reorder,
            item.price,
            item.stock * item.price

        ])

    );


    showToast(
        "Inventory report exported"
    );

}


/* ============================================================
   REPORT CARDS
   ============================================================ */

function initializeReports() {

    document
        .querySelectorAll(
            ".report-card"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const report =
                        card.dataset.report;


                    if (
                        report ===
                        "revenue"
                    ) {

                        exportDashboard();

                    }


                    if (
                        report ===
                        "jobs"
                    ) {

                        exportWorkshop();

                    }


                    if (
                        report ===
                        "inventory"
                    ) {

                        exportInventory();

                    }


                    if (
                        report ===
                        "users"
                    ) {

                        downloadCSV(

                            "zimdra-users.csv",

                            [
                                "Name",
                                "Username",
                                "Role",
                                "Phone",
                                "Status",
                                "Last Active"
                            ],

                            users.map(
                                user => [

                                    user.name,
                                    user.username,
                                    roleLabel(
                                        user.role
                                    ),
                                    user.phone,
                                    user.status,
                                    user.lastActive

                                ]
                            )

                        );


                        showToast(
                            "User report exported"
                        );

                    }

                }
            );

        });

}


/* ============================================================
   DEMO DATA
   ============================================================ */

function loadDemoData() {

    updateDashboardKPIs();

    updateRevenueSnapshot();

    renderRevenueTrend(7);

    renderPaymentMethodChart();

    renderJobStatusChart();

    renderTechnicianPerformanceChart();

    renderWorkshop();

    renderBilling();

    renderInventory();

    renderAudit();

    renderUsers();


    localStorage.setItem(
        "zimdraAdminDemoLoaded",
        "true"
    );


    showToast(
        "Demo data loaded successfully"
    );

}


/* ============================================================
   RESET ADMIN DATA
   ============================================================ */

function resetAdminData() {

    const confirmed =
        confirm(
            "Reset Admin data stored in LocalStorage?"
        );


    if (!confirmed) return;


    localStorage.removeItem(
        "zimdraAdminDemoLoaded"
    );


    localStorage.removeItem(
        "zimdraAdminUsers"
    );


    showToast(
        "Admin data reset"
    );

}


/* ============================================================
   REFRESH
   ============================================================ */

function refreshDashboard() {

    renderRevenueTrend(
        document.querySelector(
            ".range-btn.active"
        )?.dataset.range || 7
    );


    renderPaymentMethodChart();

    renderJobStatusChart();

    renderTechnicianPerformanceChart();

    renderUsers();

    renderWorkshop();

    renderBilling();

    renderInventory();

    renderAudit();

    updateDashboardKPIs();

    updateRevenueSnapshot();


    showToast(
        "Dashboard refreshed"
    );

}


/* ============================================================
   LOGOUT
   ============================================================ */

function logout() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) return;


    /*
       Prototype behavior.

       Change this to your actual
       login page filename.
    */

    window.location.href =
        "sign_in.html";

}


/* ============================================================
   EVENT LISTENERS
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateDateTime();


        initializeNavigation();


        initializeRevenueRangeButtons();


        initializeReports();


        renderUsers();


        renderWorkshop();


        renderBilling();


        renderInventory();


        renderAudit();


        updateDashboardKPIs();


        updateRevenueSnapshot();


        renderRevenueTrend(7);


        renderPaymentMethodChart();


        renderJobStatusChart();


        renderTechnicianPerformanceChart();


        /* ADD USER */

        document
            .getElementById(
                "addUserBtn"
            )
            .addEventListener(
                "click",
                () => {

                    openUserModal();

                }
            );


        /* CLOSE MODAL */

        document
            .getElementById(
                "closeUserModal"
            )
            .addEventListener(
                "click",
                closeUserModal
            );


        document
            .getElementById(
                "cancelUserBtn"
            )
            .addEventListener(
                "click",
                closeUserModal
            );


        /* FORM */

        document
            .getElementById(
                "userForm"
            )
            .addEventListener(
                "submit",
                saveUser
            );


        /* USER FILTERS */

        document
            .getElementById(
                "userSearch"
            )
            .addEventListener(
                "input",
                renderUsers
            );


        document
            .getElementById(
                "roleFilter"
            )
            .addEventListener(
                "change",
                renderUsers
            );


        document
            .getElementById(
                "statusFilter"
            )
            .addEventListener(
                "change",
                renderUsers
            );


        /* REFRESH */

        document
            .getElementById(
                "refreshBtn"
            )
            .addEventListener(
                "click",
                refreshDashboard
            );


        /* DEMO */

        document
            .getElementById(
                "loadDemoBtn"
            )
            .addEventListener(
                "click",
                loadDemoData
            );


        document
            .getElementById(
                "settingsDemoBtn"
            )
            .addEventListener(
                "click",
                loadDemoData
            );


        /* RESET */

        document
            .getElementById(
                "clearAdminBtn"
            )
            .addEventListener(
                "click",
                resetAdminData
            );


        /* EXPORTS */

        document
            .getElementById(
                "dashboardExportBtn"
            )
            .addEventListener(
                "click",
                exportDashboard
            );


        document
            .getElementById(
                "workshopExportBtn"
            )
            .addEventListener(
                "click",
                exportWorkshop
            );


        document
            .getElementById(
                "billingExportBtn"
            )
            .addEventListener(
                "click",
                exportBilling
            );


        document
            .getElementById(
                "inventoryExportBtn"
            )
            .addEventListener(
                "click",
                exportInventory
            );


        /* LOGOUT */

        document
            .getElementById(
                "logoutBtn"
            )
            .addEventListener(
                "click",
                logout
            );


        /* CLOSE MODAL ON BACKDROP */

        document
            .getElementById(
                "userModal"
            )
            .addEventListener(
                "click",
                event => {

                    if (
                        event.target.id ===
                        "userModal"
                    ) {

                        closeUserModal();

                    }

                }
            );

    }
);