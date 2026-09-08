/* ==========================================================================
   sign_in.js — sign-in behaviour
   --------------------------------------------------------------------------
   Path: zimdra-dms/auth/sign_in.js

   PROTOTYPE ONLY.
   Any 4-digit PIN is accepted.
   ========================================================================== */

(function () {

  'use strict';

  /* ------------------------------------------------------------------------
     DESKS / ROLES
     ------------------------------------------------------------------------ */

  const DESKS = [

    
    {
      role: 'Service_Supervisor',
      label: 'Service supervisor',
      hint: 'Allocates jobs to bays and mechanics, approves labour and tracks WIP.',
      id: 'ZM-SS-02',
      name: 'S. Sarkar',
      emp: 'ZAW16',
      waiting: 5
    },

    {
      role: 'Workshop_Technician',
      label: 'Workshop technician',
      hint: 'Reads assigned jobs, records work done and raises parts requisitions.',
      id: 'ZM-ER-01',
      name: 'E. Rai',
      emp: 'Z015',
      waiting: 3
    },


    {
      role: 'Storekeeper',
      label: 'Storekeeper',
      hint: 'Issues parts against requisitions, keeps stock and raises purchase requisitions.',
      id: 'ZM-DG-04',
      name: 'D. Gyeltshen',
      emp: 'ZAW02',
      waiting: 2
    },

    {
      role: 'Clerk_Billing',
      label: 'Billing clerk',
      hint: 'Prepares and posts bills, records payments and manages credit.',
      id: 'ZM-KW-05',
      name: 'K. Wangmo',
      emp: 'ZAW05',
      waiting: 4
    },

    {
      role: 'Admin',
      label: 'Admin',
      hint: 'Reviews throughput, technician productivity, revenue and dead stock.',
      id: 'ZM-TD-03',
      name: 'T. Dorji',
      emp: 'ZAW79',
      waiting: 0
    }

  ];


  /* ------------------------------------------------------------------------
     PROTOTYPE SETTINGS
     ------------------------------------------------------------------------

     TRUE = redirect to the selected role dashboard.
     ------------------------------------------------------------------------ */

  const REDIRECT = true;


  /* ------------------------------------------------------------------------
     ELEMENT HELPERS
     ------------------------------------------------------------------------ */

  const $ = function (selector) {
    return document.querySelector(selector);
  };


  const el = {

    desk: $('#desk'),
    hint: $('#deskHint'),
    userId: $('#userId'),
    userName: $('#userName'),

    pinRow: $('#pinRow'),
    pinError: $('#pinError'),

    submit: $('#submit'),
    bay: $('#bay'),

    stay: $('#stay'),

    waiting: $('#waiting'),
    lastSeen: $('#lastSeen'),

    done: $('#done'),
    doneTitle: $('#doneTitle'),
    doneBody: $('#doneBody')

  };


  /* ------------------------------------------------------------------------
     PIN INPUTS
     ------------------------------------------------------------------------ */

  const pins = Array.prototype.slice.call(
    document.querySelectorAll('#pin input')
  );


  /* ------------------------------------------------------------------------
     DESK SELECTION
     ------------------------------------------------------------------------ */

  DESKS.forEach(function (desk, index) {

    const option = document.createElement('option');

    option.value = String(index);
    option.textContent = desk.label;

    el.desk.appendChild(option);

  });


  function current() {

    return DESKS[Number(el.desk.value)];

  }


  function paintDesk() {

    const desk = current();

    if (!desk) {
      return;
    }

    el.hint.textContent = desk.hint;

    el.userId.textContent = desk.id;
    el.userName.textContent = desk.name;


    /* Waiting jobs */

    el.waiting.textContent =
      desk.waiting === 0
        ? 'No jobs waiting at this desk'
        : desk.waiting +
          (
            desk.waiting === 1
              ? ' job waiting at this desk'
              : ' jobs waiting at this desk'
          );


    el.waiting.setAttribute(
      'data-status',
      desk.waiting === 0
        ? 'posted'
        : 'ready'
    );


    clearPin();
    hideError();

    el.done.hidden = true;

  }


  el.desk.addEventListener(
    'change',
    paintDesk
  );


  /* ------------------------------------------------------------------------
     LAST SIGNED IN
     ------------------------------------------------------------------------ */

  (function lastSeen() {

    const time = new Date();

    time.setDate(
      time.getDate() - 4
    );

    time.setHours(
      8,
      12,
      0,
      0
    );


    const pad = function (number) {

      return String(number).padStart(
        2,
        '0'
      );

    };


    el.lastSeen.textContent =
      pad(time.getDate()) +
      '/' +
      pad(time.getMonth() + 1) +
      '/' +
      time.getFullYear() +
      ' ' +
      pad(time.getHours()) +
      ':' +
      pad(time.getMinutes());

  })();


  /* ------------------------------------------------------------------------
     PIN ENTRY
     ------------------------------------------------------------------------ */

  pins.forEach(function (box, index) {


    /* Single digit input */

    box.addEventListener(
      'input',
      function () {

        box.value = box.value
          .replace(/\D/g, '')
          .slice(0, 1);


        box.dataset.filled =
          box.value
            ? 'true'
            : 'false';


        hideError();


        /* Move to next box */

        if (
          box.value &&
          index < pins.length - 1
        ) {

          pins[index + 1].focus();

        }


        syncSubmit();

      }
    );


    /* Keyboard navigation */

    box.addEventListener(
      'keydown',
      function (event) {


        /* Backspace */

        if (
          event.key === 'Backspace' &&
          !box.value &&
          index > 0
        ) {

          event.preventDefault();

          pins[index - 1].value = '';

          pins[index - 1].dataset.filled =
            'false';

          pins[index - 1].focus();

          syncSubmit();

        }


        /* Left arrow */

        if (
          event.key === 'ArrowLeft' &&
          index > 0
        ) {

          event.preventDefault();

          pins[index - 1].focus();

        }


        /* Right arrow */

        if (
          event.key === 'ArrowRight' &&
          index < pins.length - 1
        ) {

          event.preventDefault();

          pins[index + 1].focus();

        }

      }
    );


    /* Paste */

    box.addEventListener(
      'paste',
      function (event) {

        event.preventDefault();


        const clipboard =
          event.clipboardData ||
          window.clipboardData;


        const digits =
          (
            clipboard
              ? clipboard.getData('text')
              : ''
          )
            .replace(/\D/g, '')
            .slice(0, 4)
            .split('');


        digits.forEach(
          function (digit, position) {

            if (pins[position]) {

              pins[position].value =
                digit;

              pins[position].dataset.filled =
                'true';

            }

          }
        );


        const next =
          pins[digits.length] ||
          pins[pins.length - 1];


        if (next) {
          next.focus();
        }


        hideError();
        syncSubmit();

      }
    );

  });


  /* ------------------------------------------------------------------------
     PIN VALUE
     ------------------------------------------------------------------------ */

  function pinValue() {

    return pins
      .map(function (input) {
        return input.value;
      })
      .join('');

  }


  /* ------------------------------------------------------------------------
     ENABLE / DISABLE SUBMIT
     ------------------------------------------------------------------------ */

  function syncSubmit() {

    const complete =
      /^\d{4}$/.test(pinValue());


    el.submit.disabled =
      !complete;

  }


  /* ------------------------------------------------------------------------
     CLEAR PIN
     ------------------------------------------------------------------------ */

  function clearPin() {

    pins.forEach(function (input) {

      input.value = '';

      input.dataset.filled =
        'false';

    });


    syncSubmit();

  }


  /* ------------------------------------------------------------------------
     ERRORS
     ------------------------------------------------------------------------ */

  function showError(message) {

    el.pinError.textContent =
      message;

    el.pinError.hidden =
      false;

    el.pinRow.dataset.invalid =
      'true';

  }


  function hideError() {

    el.pinError.hidden =
      true;

    el.pinRow.dataset.invalid =
      'false';

  }


  /* ------------------------------------------------------------------------
     CREATE PROTOTYPE SESSION
     ------------------------------------------------------------------------ */

  function createSession(desk, density) {

    const session = {

      role: desk.role,

      roleLabel: desk.label,

      employeeCode: desk.emp,

      userId: desk.id,

      name: desk.name,

      density:
        density === 'bay'
          ? 'bay'
          : 'desk',

      remember:
        el.stay.checked,

      location:
        'Phuentsholing',

      at:
        new Date().toISOString()

    };


    /*
      Save session so the dashboard can identify
      which role/user has logged in.
    */

    sessionStorage.setItem(
      'ZIMDRA_SESSION',
      JSON.stringify(session)
    );


    /*
      Also expose it globally for prototype use.
    */

    window.ZIMDRA_SESSION =
      session;


    return session;

  }


  /* ------------------------------------------------------------------------
     DASHBOARD URL
     ------------------------------------------------------------------------ */

 function getDashboardUrl(role) {
  const dashboards = {
    'Admin': '../role_dashboard/admin/admin.html',

    'Storekeeper': '../role_dashboard/storekeeper/storekeeper.html',

    'Service_Supervisor':
      '../role_dashboard/service_supervisor/service_supervisor.html',

    'Clerk_Billing':
      '../role_dashboard/clerk_billing/clerk_billing.html',

    'Workshop_Technician':
      '../role_dashboard/workshop_technician/workshop_technician.html'
  };

  return dashboards[role] || '../role_dashboard/admin/admin.html';
}


  /* ------------------------------------------------------------------------
     SIGN IN
     ------------------------------------------------------------------------ */

  function signIn(desk, density) {

    const session =
      createSession(
        desk,
        density
      );


    const destination =
      getDashboardUrl(
        desk.role
      );


    hideError();


    /*
      Redirect immediately after successful
      prototype authentication.
    */

    if (REDIRECT) {

      window.location.href =
        destination;

      return;

    }


    /*
      Fallback confirmation if REDIRECT
      is turned off.
    */

    el.done.hidden =
      false;


    el.doneTitle.textContent =
      'Signed in as ' +
      desk.name +
      ' · ' +
      desk.label;


    el.doneBody.innerHTML =
      'Opening <code>' +
      destination +
      '</code>' +
      (
        session.density === 'bay'
          ? ' in bay density.'
          : '.'
      );

  }


  /* ------------------------------------------------------------------------
     SUBMIT LOGIN
     ------------------------------------------------------------------------ */

  $('#signin').addEventListener(
    'submit',
    function (event) {

      event.preventDefault();


      const desk =
        current();


      const pin =
        pinValue();


      /*
        Any 4-digit PIN is accepted.
      */

      if (!/^\d{4}$/.test(pin)) {

        showError(
          'Enter all 4 PIN digits before signing in.'
        );


        if (pins[0]) {
          pins[0].focus();
        }


        return;

      }


      signIn(
        desk,
        'desk'
      );

    }
  );


  /* ------------------------------------------------------------------------
     BAY TABLET LOGIN
     ------------------------------------------------------------------------ */

  el.bay.addEventListener(
    'click',
    function () {

      const desk =
        current();


      const pin =
        pinValue();


      if (!/^\d{4}$/.test(pin)) {

        showError(
          'Enter all 4 PIN digits first, then choose the bay tablet.'
        );


        if (pins[0]) {
          pins[0].focus();
        }


        return;

      }


      document.documentElement.setAttribute(
        'data-density',
        'bay'
      );


      signIn(
        desk,
        'bay'
      );

    }
  );


  /* ------------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------------

     Service Supervisor is selected by default.
     ------------------------------------------------------------------------ */

  const supervisorIndex =
    DESKS.findIndex(
      function (desk) {

        return desk.role ===
          'Service_Supervisor';

      }
    );


  if (supervisorIndex !== -1) {

    el.desk.value =
      String(supervisorIndex);

  }


  paintDesk();
  syncSubmit();


  /* Initial PIN focus */

  if (pins.length) {

    pins[0].focus();

  }

})();