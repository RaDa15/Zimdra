/* ==========================================================================
   arrival-assignment.js
   --------------------------------------------------------------------------
   Path: zimdra-dms/role_dashboard/Service_Supervisor/arrival-assignment.js

   Add-on for the new Visit & Assignment fields. Load it AFTER
   service_supervisor.js:

     <script src="service_supervisor.js"></script>
     <script src="arrival-assignment.js"></script>

   Nothing in service_supervisor.js needs editing. This file only fills the
   new dropdowns and keeps the summary panel in step.
   ========================================================================== */

(function () {
  'use strict';

  /* Employee codes are the real ones from the legacy system. In the built
     version this list comes from the Employee master, filtered to active
     mechanics, with workload computed from open job cards. */
  const MECHANICS = [
    { code: 'Z015',  name: 'E. Rai',            openJobs: 2, load: 80 },
    { code: 'N007',  name: 'P. Wangchuk',       openJobs: 1, load: 45 },
    { code: 'N008',  name: 'T. Dorji',          openJobs: 2, load: 92 },
    { code: 'N010',  name: 'K. Dorji',          openJobs: 1, load: 64 },
    { code: 'ZAW01', name: 'A. Kr. Dey',        openJobs: 0, load: 10 },
    { code: 'ZAW26', name: 'S. Tamang',         openJobs: 1, load: 55 },
    { code: 'ZAW27', name: 'B. Pada Sarkar',    openJobs: 0, load: 0  }
  ];

  const SUPERVISORS = [
    { code: 'ZAW15', name: 'Runn Supervisor' },
    { code: 'ZAW16', name: 'S. Sarkar' },
    { code: 'ZAW46', name: 'PDI Incharge' }
  ];

  /* A technician at or above this is already committed. Assigning more is a
     supervisor decision, so the option is flagged rather than hidden. */
  const HEAVY_LOAD = 85;

  const $ = function (s) { return document.querySelector(s); };

  /* ---------------------------------------------------------------------
     Populate the dropdowns
     --------------------------------------------------------------------- */

  function fillMechanics() {
    document.querySelectorAll('[data-mechanic-list]').forEach(function (select) {
      MECHANICS.forEach(function (m) {
        const o = document.createElement('option');
        o.value = m.code;
        o.textContent = m.name + ' · ' + m.openJobs +
          (m.openJobs === 1 ? ' job' : ' jobs') + ' · ' + m.load + '%' +
          (m.load >= HEAVY_LOAD ? '  ⚠' : '');
        o.dataset.load = String(m.load);
        select.appendChild(o);
      });
    });
  }

  function fillSupervisors() {
    document.querySelectorAll('[data-supervisor-list]').forEach(function (select) {
      SUPERVISORS.forEach(function (s) {
        const o = document.createElement('option');
        o.value = s.code;
        o.textContent = s.name;
        select.appendChild(o);
      });
    });
  }

  /* ---------------------------------------------------------------------
     Promised delivery — default to today at 17:00, never a past date
     --------------------------------------------------------------------- */

  function seedPromisedDate() {
    const d = $('#promisedDate');
    if (!d) return;
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    d.value = iso;
    d.min = iso;
  }

  /* ---------------------------------------------------------------------
     Summary panel
     --------------------------------------------------------------------- */

  function text(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function label(select) {
    if (!select || !select.value) return null;
    return select.options[select.selectedIndex].textContent.split(' · ')[0].trim();
  }

  function syncSummary() {
    const bay = $('#bay');
    text('summaryBay', bay && bay.value !== 'YARD'
      ? label(bay)
      : 'Yard');

    text('summaryMechanic', label($('#mech1')) || 'Unassigned');

    const d = $('#promisedDate');
    const t = $('#promisedTime');
    if (d && d.value) {
      const parts = d.value.split('-');
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      text('summaryPromised',
        parts[2] + ' ' + months[Number(parts[1]) - 1] + ' · ' + ((t && t.value) || '17:00'));
    } else {
      text('summaryPromised', '—');
    }
  }

  /* ---------------------------------------------------------------------
     Guard rails
     --------------------------------------------------------------------- */

  function wireGuards() {
    const m1 = $('#mech1');
    const m2 = $('#mech2');
    const help = $('#mech1Help');

    /* A heavily committed technician is not blocked — it is flagged, and the
       supervisor decides. */
    if (m1 && help) {
      m1.addEventListener('change', function () {
        const opt = m1.options[m1.selectedIndex];
        const load = Number(opt.dataset.load || 0);
        if (m1.value && load >= HEAVY_LOAD) {
          help.textContent = label(m1) + ' is at ' + load +
            '% and already has work in hand. Assign anyway, or pick someone else.';
          help.style.color = 'var(--hold-600)';
        } else {
          help.textContent = 'Current workload is shown beside each name.';
          help.style.color = '';
        }
        syncSummary();
      });
    }

    /* The same person cannot be both mechanics on one job. */
    if (m1 && m2) {
      const dedupe = function () {
        if (m2.value && m2.value === m1.value) {
          m2.value = '';
          const h = m2.closest('.field').querySelector('.field-help');
          if (h) {
            h.textContent = 'Second mechanic must be a different person.';
            h.style.color = 'var(--stop-600)';
            setTimeout(function () {
              h.textContent = 'Only for jobs worked by two people, such as body work.';
              h.style.color = '';
            }, 3500);
          }
        }
      };
      m1.addEventListener('change', dedupe);
      m2.addEventListener('change', dedupe);
    }

    /* Free services do not bill to the customer. Say so at the point of
       choosing, not at the point of billing. */
    const vt = $('#visitType');
    const vtHelp = $('#visitTypeHelp');
    if (vt && vtHelp) {
      vt.addEventListener('change', function () {
        if (vt.value.indexOf('FREE') === 0) {
          vtHelp.textContent = 'Free service — nothing is billed to the customer. ' +
            'Parts and labour are still recorded for the manufacturer claim.';
          vtHelp.style.color = 'var(--ink-700)';
        } else if (vt.value === 'REPEAT') {
          vtHelp.textContent = 'Repeat job — link the original job card before ' +
            'closing. Repeat work is reported separately.';
          vtHelp.style.color = 'var(--hold-600)';
        } else {
          vtHelp.textContent = 'Free services are not billed to the customer but ' +
            'still consume parts and labour for the manufacturer claim.';
          vtHelp.style.color = '';
        }
      });
    }
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */

  function init() {
    if (!$('#visitType')) return;   /* not on the arrival view */
    fillMechanics();
    fillSupervisors();
    seedPromisedDate();
    wireGuards();

    ['#bay', '#mech1', '#promisedDate', '#promisedTime'].forEach(function (sel) {
      const el = $(sel);
      if (el) el.addEventListener('change', syncSummary);
    });

    syncSummary();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* service_supervisor.js calls this after Clear Form so the summary panel
     does not keep showing a bay and mechanic that were just wiped. */
  window.ZimdraArrival = { sync: syncSummary };

})();