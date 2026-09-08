/* ==========================================================================
   core-store.js — shared job card data layer
   --------------------------------------------------------------------------
   Path: zimdra-dms/assets/js/core-store.js

   Every role dashboard loads this before its own <role>.js:

     <script src="../../assets/js/core-store.js"></script>
     <script src="service_supervisor.js"></script>

   This file owns persistence only. It does not know about the DOM, does not
   render anything, and does not decide UI behaviour — that stays in each
   role's own <role>.js, exactly as service_supervisor.js already does with
   its in-memory JOB_CARDS array.

   The record shape is deliberately identical to the JOB_CARDS objects
   already hand-authored in service_supervisor.js (job.customer, job.vehicle,
   job.parts, job.labour, job.checklist, job.totals, job.bay, job.mech1...).
   That is what lets a role page keep its existing render/modal code and
   simply read its working array from ZimdraStore instead of a hardcoded
   literal.

   PROTOTYPE. Storage is localStorage, single browser, no server. If this
   moves to a real backend later, only the six functions under "STORAGE"
   below need to change — everything above and below keeps working.
   ========================================================================== */

(function (global) {
  'use strict';

  var JOBS_KEY = 'zimdra_jobcards_v1';
  var SERIES_KEY = 'zimdra_series_v1';

  // ---- tiny localStorage shim, so this file also runs unmodified under a
  // Node test harness where there is no `window`/`localStorage`. -----------
  var hasBrowserStorage = typeof global.localStorage !== 'undefined' && global.localStorage !== null;
  var memory = (function () {
    var data = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
      setItem: function (k, v) { data[k] = String(v); }
    };
  })();
  var storage = hasBrowserStorage ? global.localStorage : memory;

  // ---- STORAGE ---------------------------------------------------------

  function _loadJobs() {
    var raw = storage.getItem(JOBS_KEY);
    if (!raw) return null; // null = "never seeded", distinct from "seeded empty"
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function _saveJobs(list) {
    storage.setItem(JOBS_KEY, JSON.stringify(list));
  }

  function _loadSeries() {
    var raw = storage.getItem(SERIES_KEY);
    if (!raw) return {};
    try { return JSON.parse(raw) || {}; } catch (e) { return {}; }
  }

  function _saveSeries(series) {
    storage.setItem(SERIES_KEY, JSON.stringify(series));
  }

  // ---- pub/sub, so a Storekeeper tab refreshes when Arrival (a different
  // tab, or a later reload of the same tab) saves a new job card. ---------

  var listeners = [];
  function subscribe(fn) {
    listeners.push(fn);
    return function unsubscribe() {
      var i = listeners.indexOf(fn);
      if (i !== -1) listeners.splice(i, 1);
    };
  }
  function _notify() {
    listeners.forEach(function (fn) {
      try { fn(); } catch (e) { /* one bad listener should not break the rest */ }
    });
  }
  if (hasBrowserStorage && typeof global.addEventListener === 'function') {
    global.addEventListener('storage', function (e) {
      if (e.key === JOBS_KEY) _notify();
    });
  }

  // ---- job card numbering -------------------------------------------------

  // Matches the existing id format used throughout service_supervisor.js:
  // 'JC-00421', 'JC-00420'... five digits, no gaps enforced (this is a
  // prototype; the real posting-transaction rules live in the DB layer
  // later, see overview.md).
  function nextJobId() {
    var series = _loadSeries();
    var current = series.jobCard || 0;

    // First call after seeding: start above the highest id already in the
    // store, so a freshly-created job card never collides with the seed
    // data (JC-00406 .. JC-00421).
    if (!current) {
      var existing = getAll();
      var maxSeen = 421; // matches the seeded demo set's highest id
      existing.forEach(function (j) {
        var n = parseInt(String(j.id).replace(/\D/g, ''), 10);
        if (!isNaN(n) && n > maxSeen) maxSeen = n;
      });
      current = maxSeen;
    }

    var next = current + 3; // mirrors the seed data's own spacing (406, 409, 412...)
    series.jobCard = next;
    _saveSeries(series);
    return 'JC-' + String(next).padStart(5, '0');
  }

  // ---- public API -----------------------------------------------------------

  /** True the very first time this browser ever touches the store. */
  function isEmpty() {
    var jobs = _loadJobs();
    return jobs === null;
  }

  /** One-time seed from a role page's own demo array. No-op if already seeded
   *  (by this page or another role page opened earlier), so the same demo
   *  set is shared everywhere without one page overwriting another's data. */
  function seedIfEmpty(records) {
    if (!isEmpty()) return;
    _saveJobs(records || []);
    _notify();
  }

  function getAll() {
    var jobs = _loadJobs();
    return jobs || [];
  }

  function get(id) {
    var jobs = getAll();
    for (var i = 0; i < jobs.length; i += 1) {
      if (jobs[i].id === id) return jobs[i];
    }
    return null;
  }

  /** Upsert — replaces the record with the same id, or appends if new. */
  function save(job) {
    var jobs = getAll();
    var idx = -1;
    for (var i = 0; i < jobs.length; i += 1) {
      if (jobs[i].id === job.id) { idx = i; break; }
    }
    if (idx === -1) jobs.unshift(job);
    else jobs[idx] = job;
    _saveJobs(jobs);
    _notify();
    return job;
  }

  function resetAll() {
    storage.setItem(JOBS_KEY, JSON.stringify(null));
    _saveSeries({});
    _notify();
  }

  global.ZimdraStore = {
    isEmpty: isEmpty,
    seedIfEmpty: seedIfEmpty,
    getAll: getAll,
    get: get,
    save: save,
    nextJobId: nextJobId,
    subscribe: subscribe,
    resetAll: resetAll
  };

})(typeof window !== 'undefined' ? window : global);