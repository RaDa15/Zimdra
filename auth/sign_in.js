/* ==========================================================================
   sign_in.js — sign-in behaviour
   --------------------------------------------------------------------------
   Path:
   zimdra-dms/auth/sign_in.js

   PROTOTYPE ONLY
   --------------------------------------------------------------------------
   Demo authentication:
   Any 4-digit PIN is accepted.

   Roles:
     1. Job Card Entry
     2. Supervisor
     3. Storekeeper
     4. Billing
     5. Admin

   Responsibilities:
     - Populate role dropdown
     - Display role-specific user information
     - Handle four-digit PIN
     - Validate sign-in
     - Save terminal session
     - Remember last sign-in
     - Route user to correct dashboard
   ========================================================================== */

(function () {
  "use strict";

  /* ========================================================================
       1. ROLE CONFIGURATION
       ======================================================================== */

  const ROLES = {
    "job-card-entry": {
      label: "Job Card Entry",
      userId: "JCE-001",
      userName: "Job Card Officer",
      hint: "Create job cards, capture customer and vehicle information, and start workshop jobs.",
      status: "Job Card Entry desk ready.",
      redirect: "../role_dashboard/Job_Card_Entry/job_card_entry.html",
    },

    supervisor: {
      label: "Supervisor",
      userId: "SUP-001",
      userName: "Workshop Supervisor",
      hint: "Assign job cards to mechanics by trade, balance bay load and monitor job progress.",
      status: "Supervisor desk ready.",
      redirect: "../role_dashboard/Supervisor/supervisor.html",
    },

    storekeeper: {
      label: "Storekeeper",
      userId: "STR-001",
      userName: "Storekeeper",
      hint: "Manage inventory, process parts requests, issue parts and handle counter sales.",
      status: "Storekeeper desk ready.",
      redirect: "../role_dashboard/Storekeeper/storekeeper.html",
    },

    billing: {
      label: "Billing",
      userId: "BIL-001",
      userName: "Billing Clerk",
      hint: "Fetch completed job cards, review issued parts and labour, calculate taxes and prepare invoices.",
      status: "Billing desk ready.",
      redirect: "../role_dashboard/Billing/billing.html",
    },

    admin: {
      label: "Admin",
      userId: "ADM-001",
      userName: "System Administrator",
      hint: "Manage users, workshop configuration, reports, controls and overall system activity.",
      status: "Administrator access ready.",
      redirect: "../role_dashboard/Admin/admin.html",
    },
  };

  /* ========================================================================
       2. DOM REFERENCES
       ======================================================================== */

  const desk = document.getElementById("desk");

  const deskHint = document.getElementById("deskHint");

  const userId = document.getElementById("userId");

  const userName = document.getElementById("userName");

  const pin = document.getElementById("pin");

  const pinInputs = Array.from(pin.querySelectorAll("input"));

  const pinRow = document.getElementById("pinRow");

  const pinError = document.getElementById("pinError");

  const stay = document.getElementById("stay");

  const submit = document.getElementById("submit");

  const signin = document.getElementById("signin");

  const done = document.getElementById("done");

  const doneTitle = document.getElementById("doneTitle");

  const doneBody = document.getElementById("doneBody");

  const waiting = document.getElementById("waiting");

  const lastSeen = document.getElementById("lastSeen");

  /* ========================================================================
       3. STORAGE KEYS
       ======================================================================== */

  const STORAGE = {
    session: "zimdra_dms_session",

    terminal: "zimdra_dms_terminal_user",

    lastSeen: "zimdra_dms_last_seen",
  };

  /* ========================================================================
       4. HELPERS
       ======================================================================== */

  function getRole() {
    return ROLES[desk.value] || null;
  }

  function getPin() {
    return pinInputs
      .map(function (input) {
        return input.value;
      })
      .join("");
  }

  function clearPin() {
    pinInputs.forEach(function (input) {
      input.value = "";
    });

    pinInputs[0].focus();
  }

  function setWaiting(message, state) {
    waiting.textContent = message || "—";

    if (state) {
      waiting.dataset.status = state;
    } else {
      waiting.dataset.status = "ready";
    }
  }

  function showError(message) {
    pinError.textContent = message;

    pinError.hidden = false;

    pinRow.classList.add("is-error");

    pinRow.classList.remove("is-success");

    setWaiting("Sign-in requires attention.", "error");
  }

  function clearError() {
    pinError.textContent = "";

    pinError.hidden = true;

    pinRow.classList.remove("is-error");
  }

  function showSuccess() {
    pinError.textContent = "";

    pinError.hidden = true;

    pinRow.classList.remove("is-error");

    pinRow.classList.add("is-success");
  }

  function formatDateTime(date) {
    return new Intl.DateTimeFormat("en-BT", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  /* ========================================================================
       5. LAST SIGN-IN
       ======================================================================== */

  function renderLastSeen() {
    const stored = localStorage.getItem(STORAGE.lastSeen);

    if (!stored) {
      lastSeen.textContent = "—";

      return;
    }

    const date = new Date(stored);

    if (Number.isNaN(date.getTime())) {
      lastSeen.textContent = "—";

      return;
    }

    lastSeen.textContent = formatDateTime(date);
  }

  /* ========================================================================
       6. ROLE INFORMATION
       ======================================================================== */

  function updateRoleInformation() {
    clearError();

    const role = getRole();

    if (!role) {
      userId.textContent = "";

      userName.textContent = "";

      deskHint.textContent = "Select the desk you are assigned to.";

      setWaiting("Select a role to continue.", "ready");

      return;
    }

    userId.textContent = role.userId;

    userName.textContent = role.userName;

    deskHint.textContent = role.hint;

    setWaiting(role.status, "ready");
  }

  /* ========================================================================
       7. PIN INPUT BEHAVIOUR
       ======================================================================== */

  function bindPinInputs() {
    pinInputs.forEach(function (input, index) {
      /* --------------------------------------------------------------
               Only numeric characters
            -------------------------------------------------------------- */

      input.addEventListener("input", function () {
        const value = input.value.replace(/\D/g, "");

        input.value = value.slice(0, 1);

        clearError();

        if (input.value && index < pinInputs.length - 1) {
          pinInputs[index + 1].focus();
        }

        if (getPin().length === 4) {
          setWaiting("PIN entered. Ready to sign in.", "ready");
        }
      });

      /* --------------------------------------------------------------
               Keyboard navigation
            -------------------------------------------------------------- */

      input.addEventListener("keydown", function (event) {
        if (event.key === "Backspace" && !input.value && index > 0) {
          pinInputs[index - 1].focus();

          pinInputs[index - 1].value = "";

          event.preventDefault();
        }

        if (event.key === "ArrowLeft" && index > 0) {
          pinInputs[index - 1].focus();

          event.preventDefault();
        }

        if (event.key === "ArrowRight" && index < pinInputs.length - 1) {
          pinInputs[index + 1].focus();

          event.preventDefault();
        }
      });

      /* --------------------------------------------------------------
               Paste support
            -------------------------------------------------------------- */

      input.addEventListener("paste", function (event) {
        event.preventDefault();

        const pasted = (event.clipboardData || window.clipboardData)
          .getData("text")
          .replace(/\D/g, "")
          .slice(0, 4);

        if (!pasted) {
          return;
        }

        pasted.split("").forEach(function (digit, digitIndex) {
          if (pinInputs[digitIndex]) {
            pinInputs[digitIndex].value = digit;
          }
        });

        const nextIndex = Math.min(pasted.length, pinInputs.length - 1);

        pinInputs[nextIndex].focus();

        clearError();
      });
    });
  }

  /* ========================================================================
       8. FORM VALIDATION
       ======================================================================== */

  function validateForm() {
    const role = getRole();

    if (!role) {
      showError("Please select your role before signing in.");

      desk.focus();

      return false;
    }

    const enteredPin = getPin();

    if (!/^\d{4}$/.test(enteredPin)) {
      showError("Enter a four-digit PIN.");

      const firstEmpty = pinInputs.find(function (input) {
        return !input.value;
      });

      (firstEmpty || pinInputs[0]).focus();

      return false;
    }

    return true;
  }

  /* ========================================================================
       9. CREATE SESSION
       ======================================================================== */

  function createSession(role) {
    const now = new Date();

    const session = {
      authenticated: true,

      roleKey: desk.value,

      role: role.label,

      userId: role.userId,

      userName: role.userName,

      signedInAt: now.toISOString(),

      terminal: "this-terminal",
    };

    /*
     * "Keep me signed in" uses localStorage.
     *
     * Without it, sessionStorage is used and disappears
     * when the browser tab/session ends.
     */

    if (stay.checked) {
      localStorage.setItem(STORAGE.session, JSON.stringify(session));

      localStorage.setItem(STORAGE.terminal, JSON.stringify(session));
    } else {
      sessionStorage.setItem(STORAGE.session, JSON.stringify(session));
    }

    localStorage.setItem(STORAGE.lastSeen, now.toISOString());

    return session;
  }

  /* ========================================================================
       10. SHOW SUCCESS MESSAGE
       ======================================================================== */

  function showDone(role) {
    doneTitle.textContent = "Signed in successfully";

    doneBody.textContent =
      role.label + " · " + role.userName + " · opening workspace…";

    done.hidden = false;

    showSuccess();

    setWaiting("Access granted.", "success");
  }

  /* ========================================================================
       11. REDIRECT
       ======================================================================== */

  function redirectToRole(role) {
    /*
     * Small delay allows the success state to be visible.
     */

    window.setTimeout(function () {
      window.location.href = role.redirect;
    }, 500);
  }

  /* ========================================================================
       12. SUBMIT
       ======================================================================== */

  function handleSubmit(event) {
    event.preventDefault();

    clearError();

    if (!validateForm()) {
      return;
    }

    const role = getRole();

    /*
     * DEMO AUTHENTICATION
     * -------------------
     * Any four-digit PIN is accepted.
     */

    submit.disabled = true;

    submit.setAttribute("aria-busy", "true");

    setWaiting("Checking access…", "working");

    window.setTimeout(function () {
      createSession(role);

      showDone(role);

      redirectToRole(role);
    }, 350);
  }

  /* ========================================================================
       13. ROLE CHANGE
       ======================================================================== */

  function handleRoleChange() {
    updateRoleInformation();

    clearPin();

    submit.disabled = false;

    submit.removeAttribute("aria-busy");
  }

  /* ========================================================================
       14. ENTER KEY
       ======================================================================== */

  function bindKeyboardSubmit() {
    signin.addEventListener("keydown", function (event) {
      if (
        event.key === "Enter" &&
        document.activeElement.tagName !== "SELECT"
      ) {
        /*
         * Let normal form submission handle Enter
         * when the PIN is complete.
         */

        if (getPin().length === 4) {
          event.preventDefault();

          signin.requestSubmit();
        }
      }
    });
  }

  /* ========================================================================
       15. RESTORE PREVIOUS TERMINAL USER
    ======================================================================== */

  function restoreTerminalUser() {
    const stored = localStorage.getItem(STORAGE.terminal);

    if (!stored) {
      return;
    }

    try {
      const session = JSON.parse(stored);

      if (!session || !session.roleKey || !ROLES[session.roleKey]) {
        return;
      }

      /*
       * Restore the last role.
       *
       * PIN is deliberately NOT restored.
       */

      desk.value = session.roleKey;

      updateRoleInformation();

      setWaiting("Previous terminal user: " + session.userName, "ready");
    } catch (error) {
      console.warn("Unable to restore terminal user.", error);
    }
  }

  /* ========================================================================
       16. CHECK EXISTING SESSION
    ======================================================================== */

  function hasExistingSession() {
    const local = localStorage.getItem(STORAGE.session);

    const temporary = sessionStorage.getItem(STORAGE.session);

    return !!(local || temporary);
  }

  /* ========================================================================
       17. INITIALIZE
    ======================================================================== */

  function init() {
    /*
     * Initial state
     */

    updateRoleInformation();

    renderLastSeen();

    bindPinInputs();

    bindKeyboardSubmit();

    /*
     * Role selector
     */

    desk.addEventListener("change", handleRoleChange);

    /*
     * Form submission
     */

    signin.addEventListener("submit", handleSubmit);

    /*
     * Restore previous terminal role
     */

    restoreTerminalUser();

    /*
     * If a session already exists,
     * keep the user informed but do not
     * automatically redirect.
     */

    if (hasExistingSession()) {
      setWaiting("Previous terminal session found.", "ready");
    }

    /*
     * Focus role selector
     */

    desk.focus();
  }

  /* ========================================================================
       18. START APPLICATION
    ======================================================================== */

  init();
})();