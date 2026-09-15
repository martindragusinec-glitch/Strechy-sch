/* ═══════════════════════════════════════════════════════════════════════════
   LP CONSENT — lehká cookie lišta pro statické LP · v1.0 (2026-09-07)
   Stejné API jako Cookiebot (hasResponse, consent.marketing, consent.statistics),
   takže lp-tracking.js funguje s oběma. Když je na stránce Cookiebot, tento soubor nevkládej.

   Načíst SYNCHRONNĚ v <head> PŘED GTM snippetem (nastavuje Consent Mode default).
   Konfigurace (volitelná, před načtením): window.LP_CONSENT_CONFIG = { brand_color, privacy_url, text, … }
   API: LPConsent.hasResponse · LPConsent.consent.{necessary,statistics,marketing} · LPConsent.acceptAll()
        LPConsent.rejectAll() · LPConsent.accept({ statistics, marketing }) · LPConsent.open() · LPConsent.on(fn)
   Události: window 'lpconsent:update' (detail = consent) · dataLayer event 'cookie_consent_update'
   Prvek s atributem [data-consent-open] (např. odkaz v patičce) lištu znovu otevře.
   ═══════════════════════════════════════════════════════════════════════════ */
window.LPConsent = (function () {
  'use strict';
  var CFG = window.LP_CONSENT_CONFIG || {};
  var COOKIE = CFG.cookie_name || 'lp_consent';
  var DAYS = CFG.cookie_days || 365;
  var BRAND = CFG.brand_color || '#E30A1A';
  var PRIVACY_URL = CFG.privacy_url || '';
  var TEXT = CFG.text || 'Používáme cookies pro měření návštěvnosti a personalizaci reklamy. Nezbytné cookies běží vždy, ostatní jen s vaším souhlasem.';

  var api = {
    hasResponse: false,
    consent: { necessary: true, statistics: false, marketing: false },
    timestamp: null
  };
  var listeners = [];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function _get() {
    try {
      var m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
      if (!m) return null;
      var v = JSON.parse(decodeURIComponent(m[1]));
      if (!v || typeof v !== 'object') return null;
      return v;
    } catch (e) { return null; }
  }
  function _set(v) {
    try {
      var d = new Date(); d.setTime(d.getTime() + DAYS * 864e5);
      document.cookie = COOKIE + '=' + encodeURIComponent(JSON.stringify(v)) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax' + (location.protocol === 'https:' ? ';Secure' : '');
    } catch (e) {}
  }
  function _modeMap(c) {
    var m = c.marketing ? 'granted' : 'denied', a = c.statistics ? 'granted' : 'denied';
    return { ad_storage: m, ad_user_data: m, ad_personalization: m, analytics_storage: a, functionality_storage: 'granted', security_storage: 'granted' };
  }
  function _status(c) {
    if (c.marketing && c.statistics) return 'granted';
    if (c.marketing || c.statistics) return 'partial';
    return 'denied';
  }

  /* ─── Consent Mode default (musí proběhnout před GTM) ─── */
  var stored = _get();
  if (stored && stored.consent) {
    api.hasResponse = true;
    api.consent = { necessary: true, statistics: !!stored.consent.statistics, marketing: !!stored.consent.marketing };
    api.timestamp = stored.ts || null;
    gtag('consent', 'default', _modeMap(api.consent));
  } else {
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted', wait_for_update: 500 });
  }

  function _apply(c, source) {
    api.hasResponse = true;
    api.consent = { necessary: true, statistics: !!c.statistics, marketing: !!c.marketing };
    api.timestamp = new Date().toISOString();
    _set({ consent: api.consent, ts: api.timestamp, v: 1 });
    gtag('consent', 'update', _modeMap(api.consent));
    window.dataLayer.push({
      event: 'cookie_consent_update',
      consent_status: _status(api.consent),
      consent_marketing: api.consent.marketing ? 'granted' : 'denied',
      consent_analytics: api.consent.statistics ? 'granted' : 'denied',
      consent_source: source || 'banner'
    });
    try { window.dispatchEvent(new CustomEvent('lpconsent:update', { detail: api.consent })); } catch (e) {}
    listeners.forEach(function (fn) { try { fn(api.consent); } catch (e) {} });
    _hide();
  }

  /* ─── UI ─── */
  var el = null;
  function _hide() { if (el) { el.style.display = 'none'; } }
  function _render(showSettings) {
    if (!el) {
      el = document.createElement('div');
      el.id = 'lp-consent';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', 'Nastavení cookies');
      el.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:560px;margin:0 auto;background:#fff;color:#111;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.18);padding:18px 20px;font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;';
      document.body.appendChild(el);
    }
    var btn = 'display:inline-block;border:0;border-radius:999px;padding:10px 18px;font-weight:700;font-size:14px;cursor:pointer;';
    var html = '<div style="font-weight:800;font-size:16px;margin-bottom:6px">Cookies na tomto webu</div>' +
      '<p style="margin:0 0 12px;color:#444">' + TEXT + (PRIVACY_URL ? ' <a href="' + PRIVACY_URL + '" target="_blank" rel="noopener" style="color:' + BRAND + '">Více informací</a>' : '') + '</p>';
    if (showSettings) {
      html += '<div style="display:grid;gap:8px;margin:0 0 14px;padding:12px;background:#f6f6f7;border-radius:12px">' +
        '<label style="display:flex;gap:10px;align-items:flex-start"><input type="checkbox" checked disabled style="margin-top:3px"><span><b>Nezbytné</b> – fungování webu a formuláře, vždy zapnuté</span></label>' +
        '<label style="display:flex;gap:10px;align-items:flex-start"><input id="lpc-stat" type="checkbox"' + (api.consent.statistics ? ' checked' : '') + ' style="margin-top:3px;accent-color:' + BRAND + '"><span><b>Statistické</b> – anonymní měření návštěvnosti (Google Analytics)</span></label>' +
        '<label style="display:flex;gap:10px;align-items:flex-start"><input id="lpc-mkt" type="checkbox"' + (api.consent.marketing ? ' checked' : '') + ' style="margin-top:3px;accent-color:' + BRAND + '"><span><b>Marketingové</b> – měření a personalizace reklamy (Meta, Google Ads)</span></label>' +
        '</div>';
    }
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' +
      '<button type="button" id="lpc-all" style="' + btn + 'background:' + BRAND + ';color:#fff">Přijmout vše</button>' +
      (showSettings
        ? '<button type="button" id="lpc-save" style="' + btn + 'background:#111;color:#fff">Uložit výběr</button>'
        : '<button type="button" id="lpc-settings" style="' + btn + 'background:#eee;color:#111">Nastavení</button>') +
      '<button type="button" id="lpc-none" style="' + btn + 'background:transparent;color:#555;text-decoration:underline;padding-left:6px">Jen nezbytné</button>' +
      '</div>';
    el.innerHTML = html;
    el.style.display = 'block';
    el.querySelector('#lpc-all').onclick = function () { _apply({ statistics: true, marketing: true }, 'accept_all'); };
    el.querySelector('#lpc-none').onclick = function () { _apply({ statistics: false, marketing: false }, 'reject_all'); };
    var st = el.querySelector('#lpc-settings'); if (st) st.onclick = function () { _render(true); };
    var sv = el.querySelector('#lpc-save'); if (sv) sv.onclick = function () {
      _apply({ statistics: el.querySelector('#lpc-stat').checked, marketing: el.querySelector('#lpc-mkt').checked }, 'custom');
    };
  }
  function _init() {
    if (!api.hasResponse) _render(false);
    document.querySelectorAll('[data-consent-open]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); _render(true); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _init); else _init();

  api.acceptAll = function () { _apply({ statistics: true, marketing: true }, 'api'); };
  api.rejectAll = function () { _apply({ statistics: false, marketing: false }, 'api'); };
  api.accept = function (c) { _apply(c || {}, 'api'); };
  api.open = function () { _render(true); };
  api.on = function (fn) { if (typeof fn === 'function') listeners.push(fn); };
  api.status = function () { return api.hasResponse ? _status(api.consent) : 'unknown'; };
  return api;
})();
