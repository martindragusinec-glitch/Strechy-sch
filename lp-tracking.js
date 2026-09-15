/* ═══════════════════════════════════════════════════════════════════════════
   LP TRACKING MODUL — DomiDomi / Schlieger skupina · v2.0 (2026-09-07)
   Atribuce z URL (jen v paměti) → souhlas z CMP → záloha do Make → Lead Gateway
   (x-gateway-key) → dataLayer eventy. Pixel i GA běží VÝHRADNĚ z GTM (žádné fbq/gtag zde).

   dataLayer eventy (jen tyto): view_form, begin_form, form_step, form_error, cta_click,
   phone_click, scroll_depth, form_sent (při odchodu POSTu do gateway), leadCapture (po odpovědi).

   Konfigurace: window.LP_TRACKING_CONFIG (definovat PŘED načtením modulu).
   API: LPTracking.sendLead(answers, hooks) · LPTracking.observeForm(host) · LPTracking.formStep(n, name)
        LPTracking.formError(field) · LPTracking.pushDL(event, data) · LPTracking.getConsent()
   CMP: Cookiebot (window.Cookiebot) nebo LPConsent (lp-consent.js); jinak vše = denied.
   ═══════════════════════════════════════════════════════════════════════════ */
window.LPTracking = (function () {
  'use strict';

  /* ─── CONFIG (defaults; přepisuje window.LP_TRACKING_CONFIG) ─── */
  var DEFAULTS = {
    gateway_url: 'https://cwertkgbliffhzrynrxt.supabase.co/functions/v1/make-server-9924f985/lead-gateway/ingest',
    gateway_key: '',                 // x-gateway-key — DOPLNIT (od správce gateway)
    make_webhook_url: '',            // Make webhook: záloha leadu hned po submitu + log výsledku ('' = vypnuto)
    log_gateway_result: true,        // druhá zpráva do Make (type: "gateway_result")
    recaptcha_site_key: '',          // reCAPTCHA v3 site key ('' = bez reCAPTCHA)
    company: '',                     // značka (domidomi / schlieger / ciperka / warmteo)
    product: '',                     // produktový kód (REK / FVE / TC / ZAT / NZU)
    form_name: '',                   // název formuláře (view_form / begin_form)
    form_id: '',                     // formId (form_sent / leadCapture), např. MULTI_STEP_FORM_REK
    product_type: '',                // productType (form_sent / leadCapture), např. rekonstrukce
    tenant_id: '',                   // eventDetails.tenantId (manuál §1.3)
    gw_lead_source: '',              // eventDetails.leadSource
    gw_customer_type: 'B2C',
    gw_lead_products: [],            // eventDetails.leadProducts, např. ['REK']
    lead_source: 'website',
    note_prefix: 'Lead odeslaný z Webu.',
    attr_first_days: 90,
    attr_last_days: 30,
    fetch_timeout_ms: 5000,
    recaptcha_timeout_ms: 3000,
    hard_timeout_ms: 7000,
    consent_adapter: null,           // volitelně: function () { return { known, marketing, analytics }; }
    utm_keys: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content', 'utm_term'],
    click_keys: ['gclid', 'fbclid', 'msclkid', 'ttclid', 'sznclid', 'gbraid', 'wbraid'],
    ad_keys: ['campaignId', 'adsetId', 'adId', 'campaign_id', 'adset_id', 'ad_id']
  };
  var C = {};
  Object.keys(DEFAULTS).forEach(function (k) { C[k] = DEFAULTS[k]; });
  var USER = window.LP_TRACKING_CONFIG || {};
  Object.keys(USER).forEach(function (k) { C[k] = USER[k]; });

  /* ─── cookies (jen čtení + zápis atribuce po souhlasu) ─── */
  function _setCookie(name, value, days) {
    try {
      var d = new Date();
      d.setTime(d.getTime() + days * 864e5);
      document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax' + (location.protocol === 'https:' ? ';Secure' : '');
    } catch (e) {}
  }
  function _getCookie(name) {
    try {
      var m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) { return null; }
  }
  function _allKeys() { return C.utm_keys.concat(C.click_keys, C.ad_keys); }

  /* ─── SOUHLAS — zdroj pravdy je API CMP na stránce; volat při submitu, ne při načtení ─── */
  var UNKNOWN = { known: false, marketing: false, analytics: false };
  function getConsent() {
    try {
      if (typeof C.consent_adapter === 'function') {
        var r = C.consent_adapter() || {};
        return { known: !!r.known, marketing: !!r.marketing, analytics: !!r.analytics };
      }
      var cb = window.Cookiebot;
      if (cb) {
        if (!cb.hasResponse) return UNKNOWN;
        return { known: true, marketing: !!(cb.consent && cb.consent.marketing), analytics: !!(cb.consent && cb.consent.statistics) };
      }
      var lc = window.LPConsent;
      if (lc) {
        if (!lc.hasResponse) return UNKNOWN;
        return { known: true, marketing: !!(lc.consent && lc.consent.marketing), analytics: !!(lc.consent && lc.consent.statistics) };
      }
    } catch (e) {}
    return UNKNOWN;
  }
  function consentBlock(c) {
    var m = c.marketing ? 'granted' : 'denied', a = c.analytics ? 'granted' : 'denied';
    var status = !c.known ? 'unknown' : (c.marketing && c.analytics) ? 'granted' : (c.marketing || c.analytics) ? 'partial' : 'denied';
    return {
      consent_status: status,
      consent_ad_storage: m,
      consent_ad_user_data: m,
      consent_ad_personalization: m,
      consent_analytics_storage: a,
      consent_timestamp: c.known ? new Date().toISOString() : null
    };
  }
  /* zavolá fn, jakmile je (nebo už je) marketingový souhlas — Cookiebot i LPConsent */
  function onMarketingConsent(fn) {
    var check = function () { if (getConsent().marketing) fn(); };
    try {
      window.addEventListener('CookiebotOnAccept', check);
      window.addEventListener('CookiebotOnConsentReady', check);
      window.addEventListener('lpconsent:update', check);
    } catch (e) {}
    check();
  }

  /* ─── ATRIBUCE — při načtení jen v JS proměnných, cookies až po marketingovém souhlasu ─── */
  var _urlTouch = null;
  var _landingUrl = window.location.href;
  var _landingReferrer = document.referrer || '';
  var _lastCta = 'none';

  function _emptyTouch() {
    var t = { timestamp: null, raw_query_string: null };
    _allKeys().forEach(function (k) { t[k] = null; });
    return t;
  }
  function captureAttribution() {
    try {
      var params = new URLSearchParams(window.location.search);
      var keys = _allKeys();
      if (!keys.some(function (k) { return params.has(k); })) return;
      _urlTouch = { timestamp: new Date().toISOString(), raw_query_string: window.location.search || null };
      keys.forEach(function (k) { _urlTouch[k] = params.get(k); });
    } catch (e) {}
  }
  function persistAttribution() {
    if (!_urlTouch) return;
    if (!getConsent().marketing) return;
    var json = JSON.stringify(_urlTouch);
    var existing = _getCookie('_attribution_first');
    _setCookie('_attribution_first', existing || json, C.attr_first_days);
    _setCookie('_attribution_last', json, C.attr_last_days);
  }
  function _parse(raw) { if (raw) { try { return JSON.parse(raw); } catch (e) {} } return null; }
  function _readTouch(which) {
    if (which === 'last') return _urlTouch || _parse(_getCookie('_attribution_last')) || _emptyTouch();
    return _parse(_getCookie('_attribution_first')) || _urlTouch || _emptyTouch();
  }
  /* _fbc: NIKDY nevytvářet vlastním kódem, jen číst cookie, kterou nastaví pixel z GTM */
  function _getFbp() { return _getCookie('_fbp') || null; }
  function _getFbc() { return _getCookie('_fbc') || null; }

  function _firstVal(touch, params, keys) {
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (touch && touch[k]) return String(touch[k]);
      if (params && params.get(k)) return String(params.get(k));
    }
    return '';
  }
  function _sourcePlatform(d) {
    var src = (d.utmSource || '').toLowerCase();
    if (d.fbclid || /^(facebook|fb|instagram|ig|meta)$/.test(src)) return 'META';
    if (d.gclid || d.gbraid || d.wbraid || /^google/.test(src)) return 'GOOGLE';
    if (d.sznclid || /^(seznam|sklik)$/.test(src)) return 'SEZNAM';
    if (d.ttclid || src === 'tiktok') return 'TIKTOK';
    if (d.msclkid || /^(bing|microsoft)$/.test(src)) return 'BING';
    return src ? src.toUpperCase() : '';
  }
  function _stripQuery(u) {
    if (!u) return '';
    try { var x = new URL(u, window.location.href); return x.origin + x.pathname; } catch (e) { return String(u).split('?')[0].split('#')[0]; }
  }
  function _domain(u) {
    if (!u) return null;
    try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return null; }
  }
  /* touch ořezaný podle souhlasu: click ID a raw_query_string jen s marketingovým souhlasem */
  function _trimTouch(t, consent) {
    var out = {};
    Object.keys(t).forEach(function (k) {
      var marketingOnly = (C.click_keys.indexOf(k) !== -1) || k === 'raw_query_string';
      out[k] = (marketingOnly && !consent.marketing) ? null : t[k];
    });
    return out;
  }
  /* camelCase atribuce (kořen payloadu i leadCapture) — click ID a plné URL jen s marketingovým souhlasem */
  function buildAttribution(consent) {
    consent = consent || getConsent();
    var touch = _readTouch('last'), params = null;
    try { params = new URLSearchParams(window.location.search); } catch (e) {}
    var mk = consent.marketing;
    var d = {
      campaignId: _firstVal(touch, params, ['campaignId', 'campaign_id', 'utm_id']),
      adsetId: _firstVal(touch, params, ['adsetId', 'adset_id']),
      adId: _firstVal(touch, params, ['adId', 'ad_id']),
      sourcePlatform: '',
      utmSource: _firstVal(touch, params, ['utm_source']),
      utmMedium: _firstVal(touch, params, ['utm_medium']),
      utmCampaign: _firstVal(touch, params, ['utm_campaign']),
      utmContent: _firstVal(touch, params, ['utm_content']),
      utmTerm: _firstVal(touch, params, ['utm_term']),
      gclid: mk ? _firstVal(touch, params, ['gclid']) : '',
      fbclid: mk ? _firstVal(touch, params, ['fbclid']) : '',
      landingUrl: mk ? _landingUrl : _stripQuery(_landingUrl),
      referrer: mk ? _landingReferrer : (_domain(_landingReferrer) || '')
    };
    /* platforma se určí z plných dat (i bez souhlasu — do payloadu jde jen název platformy, ne ID) */
    d.sourcePlatform = _sourcePlatform({
      utmSource: d.utmSource,
      fbclid: _firstVal(touch, params, ['fbclid']), gclid: _firstVal(touch, params, ['gclid']),
      gbraid: _firstVal(touch, params, ['gbraid']), wbraid: _firstVal(touch, params, ['wbraid']),
      sznclid: _firstVal(touch, params, ['sznclid']), ttclid: _firstVal(touch, params, ['ttclid']),
      msclkid: _firstVal(touch, params, ['msclkid'])
    });
    return d;
  }

  /* ─── util ─── */
  function _splitName(full) {
    if (!full) return { first: null, last: null };
    var t = String(full).trim();
    if (!t) return { first: null, last: null };
    var i = t.indexOf(' ');
    return i === -1 ? { first: t, last: null } : { first: t.substring(0, i), last: t.substring(i + 1).trim() || null };
  }
  function _extractPsc(s) {
    if (!s) return null;
    var m = String(s).match(/(\d{3})\s?(\d{2})/);
    return m ? (m[1] + m[2]) : null;
  }
  function _genUuid() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  function _merge(base, over) {
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
    if (over) Object.keys(over).forEach(function (k) { out[k] = over[k]; });
    return out;
  }
  function _buildNote(answers) {
    var fields = answers.note_fields || { 'Typ': answers.type, 'Rozsah': answers.scope, 'Velikost': answers.size };
    var parts = [];
    Object.keys(fields).forEach(function (label) {
      if (fields[label] !== undefined && fields[label] !== null && fields[label] !== '') parts.push(label + ': ' + fields[label]);
    });
    return C.note_prefix + (parts.length ? ' ' + parts.join('---') : '');
  }

  /* ─── eventDetails — přesně dle spec Lead Gateway ─── */
  function buildEventDetails(answers, attribution) {
    var n = _splitName(answers.name);
    return {
      adId: attribution.adId,
      note: _buildNote(answers),
      tenantId: C.tenant_id,
      userData: {
        zip: _extractPsc(answers.zip || answers.location) || '',
        city: answers.city || 'neznáme',
        name: n.first || '',
        email: answers.email ? String(answers.email).trim().toLowerCase() : '',
        phone: answers.phone ? String(answers.phone).trim() : '',
        address: answers.address || 'neznáme',
        surname: n.last || ''
      },
      leadSource: C.gw_lead_source,
      customerType: C.gw_customer_type,
      leadProducts: C.gw_lead_products.slice()
    };
  }

  /* ─── plný payload (Make) — řez podle souhlasu se dělá TADY, ne v Make ─── */
  function buildLeadPayload(answers, recaptchaToken, consent, leadUuid) {
    consent = consent || getConsent();
    var uuid = leadUuid || _genUuid(), now = new Date(), n = _splitName(answers.name);
    var mk = consent.marketing;
    var attribution = buildAttribution(consent);
    var lastTouch = _trimTouch(_readTouch('last'), consent);
    var payload = {
      eventDetails: buildEventDetails(answers, attribution),
      lead_uuid: uuid,
      event_id: uuid,
      event_time_iso: now.toISOString(),
      event_time_unix: Math.floor(now.getTime() / 1000),
      action_source: 'website',
      company: C.company,
      product: C.product,
      form_name: C.form_name,
      form_id: C.form_id,
      lead_source: C.lead_source,
      user_data: {
        first_name: n.first,
        last_name: n.last,
        email: answers.email ? String(answers.email).trim().toLowerCase() : null,
        phone: answers.phone ? String(answers.phone).trim() : null,
        postal_code: _extractPsc(answers.zip || answers.location),
        custom_type: answers.type || null,
        custom_scope: answers.scope || null,
        custom_size: answers.size || null,
        custom_location: answers.location || null
      },
      marketing: {
        first_touch: _trimTouch(_readTouch('first'), consent),
        last_touch: lastTouch,
        fbp: mk ? _getFbp() : null,
        fbc: mk ? _getFbc() : null,
        raw_query_string: mk ? (lastTouch.raw_query_string || (window.location.search || null)) : null
      },
      page: {
        url: mk ? window.location.href : _stripQuery(window.location.href),
        landing_page_url: mk ? _landingUrl : _stripQuery(_landingUrl),
        referrer_url: mk ? (document.referrer || null) : null,
        referrer_domain: _domain(document.referrer)
      },
      /* session.client_id / session_id se do Make neposílají — párování s GA přes lead_id v BigQuery */
      session: { user_agent: mk ? navigator.userAgent : null },
      consent: consentBlock(consent),
      security: { recaptcha_token: recaptchaToken || null },
      recaptchaToken: recaptchaToken || ''
    };
    Object.keys(attribution).forEach(function (k) { payload[k] = attribution[k]; });
    if (answers.extra && typeof answers.extra === 'object') {
      Object.keys(answers.extra).forEach(function (k) { payload.user_data['custom_' + k] = answers.extra[k]; });
    }
    return payload;
  }

  /* ─── odpověď gateway → { gatewayId, ok } (objekt / {data:{…}} / [{data:{…}}]) ─── */
  function extractGatewayResult(res) {
    var out = { gatewayId: '', ok: false };
    try {
      var r = res;
      if (Array.isArray(r)) r = r[0];
      if (!r || typeof r !== 'object') return out;
      var d = (r.data && typeof r.data === 'object') ? r.data : (r.body && typeof r.body === 'object') ? r.body : r;
      if (d.gateway_log_id) out.gatewayId = String(d.gateway_log_id);
      out.ok = !!(d.success && d.accepted);
    } catch (e) {}
    return out;
  }

  /* ─── dataLayer ─── */
  function pushDL(evt, data) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: evt }, data || {}));
  }
  var NULLS = {
    additionalUserData: { floorArea: 'null', roofPitch: 'null', orientation: 'null', conservationArea: 'null',
      roofType: 'null', ownerOfProperty: 'null', amountOfLivingPerson: 'null', buildingType: 'null', currentHeatSolution: 'null' },
    electricConsumption: { unit: 'null', amount: 'null', period: 'null', cost: 'null' },
    contactTime: { callTime: 'none', meetTime: 'none' }
  };
  /* form_sent — konverzní event, bez PII, bez gatewayID; 1× na lead_id */
  function pushFormSent(payload) {
    pushDL('form_sent', {
      lead_id: payload.lead_uuid,
      lead_source: C.gw_lead_source,
      form_id: C.form_id,
      tenant_id: C.tenant_id,
      product_type: C.product_type,
      product_variant: payload.user_data.custom_type || 'null',
      lead_cta: _lastCta,
      timestamp: new Date().toISOString()
    });
  }
  /* leadCapture — datový event po odpovědi gateway (result: success | fallback | error) */
  function pushLeadCapture(payload, gw, answers) {
    var ed = payload.eventDetails, ud = payload.user_data;
    pushDL('leadCapture', {
      eventDetails: {
        leadId: payload.lead_uuid,
        leadSource: ed.leadSource,
        leadCTA: _lastCta,
        formId: C.form_id,
        adId: ed.adId || '',
        gatewayID: gw.gatewayId || '',
        tenantId: ed.tenantId,
        pageURL: location.origin + location.pathname,
        URLParams: location.search,
        referrerURL: document.referrer,
        result: gw.result,
        timestamp: new Date().toISOString()
      },
      productDetail: _merge({
        productType: C.product_type,
        productVariant: ud.custom_type || 'null',
        currency: 'null',
        price: 'null',
        productParameters: { scope: ud.custom_scope || 'null', size: ud.custom_size || 'null' }
      }, answers.productDetail),
      userData: {
        zip: ud.postal_code || '', city: ed.userData.city, name: ud.first_name || '', email: ud.email || '',
        phone: ud.phone || '', address: ed.userData.address, surname: ud.last_name || ''
      },
      additionalUserData: _merge(NULLS.additionalUserData, answers.additionalUserData),
      electricConsumption: _merge(NULLS.electricConsumption, answers.electricConsumption),
      contactTime: _merge(NULLS.contactTime, answers.contactTime)
    });
  }

  /* ─── view_form / begin_form / form_step / form_error ─── */
  var _viewed = false, _begun = false;
  function trackViewForm() {
    if (_viewed) return; _viewed = true;
    pushDL('view_form', { form_name: C.form_name, form_id: C.form_id, company: C.company, product: C.product });
  }
  function trackBeginForm() {
    if (_begun) return; _begun = true;
    trackViewForm();
    pushDL('begin_form', { form_name: C.form_name, form_id: C.form_id, company: C.company, product: C.product });
  }
  function observeForm(host) {
    if (!host) return;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (en) { return en.isIntersecting; })) { trackViewForm(); io.disconnect(); }
      }, { threshold: 0.4 });
      io.observe(host);
    } else { trackViewForm(); }
    host.addEventListener('click', function (e) { if (e.target.closest('button, input, label, select, textarea')) trackBeginForm(); });
    host.addEventListener('input', trackBeginForm);
  }
  function formStep(step, stepName) { pushDL('form_step', { step: step, step_name: stepName || '', form_id: C.form_id }); }
  function formError(field, message) { pushDL('form_error', { field: field || '', error: message || '', form_id: C.form_id }); }

  /* ─── CTA / tel / scroll ─── */
  function bindCta() {
    document.querySelectorAll('[data-cta]').forEach(function (a) {
      a.addEventListener('click', function () {
        var loc = a.getAttribute('data-cta');
        var txt = (a.textContent || '').replace(/\s+/g, ' ').trim();
        _lastCta = loc + (txt ? ' - ' + txt : '');
        pushDL('cta_click', { cta_location: loc, cta_text: txt });
      });
    });
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.addEventListener('click', function () { pushDL('phone_click', { tel: a.getAttribute('href') }); });
    });
    var marks = { 25: false, 50: false, 75: false, 100: false };
    document.addEventListener('scroll', function () {
      var h = document.documentElement;
      var pct = 100 * h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      [25, 50, 75, 100].forEach(function (d) {
        if (!marks[d] && pct >= d - 0.5) { marks[d] = true; pushDL('scroll_depth', { depth_percent: d }); }
      });
    }, { passive: true });
  }

  /* ─── HLAVNÍ API: sendLead(answers, hooks) ───
     answers: { name, phone, email, zip|location, type, scope, size, city?, address?, note_fields?, extra?,
                productDetail?, additionalUserData?, electricConsumption?, contactTime? }
     hooks:   { onSuccess(gw, payload), onError(gw, payload) }
     Pořadí: záloha do Make (hned) → [reCAPTCHA] → form_sent + POST gateway → odpověď → leadCapture → hook
     Retry po chybě gateway: stejné lead_id, form_sent se znovu neodpálí. */
  var _pending = null; /* { uuid, formSent } — drží lead_id přes opakované odeslání */
  function sendLead(answers, hooks) {
    hooks = hooks || {};
    var consent = getConsent();
    if (!_pending) _pending = { uuid: _genUuid(), formSent: false };
    var lead = _pending;
    var finished = false;
    function done(ok, gw, payload) {
      if (finished) return; finished = true;
      if (ok && gw && gw.result === 'success') _pending = null; /* další submit = nový lead */
      try { var fn = ok ? hooks.onSuccess : hooks.onError; if (fn) fn(gw, payload); } catch (e) {}
    }
    var payload = buildLeadPayload(answers, null, consent, lead.uuid);
    var hard = setTimeout(function () { done(true, { gatewayId: '', ok: false, result: 'fallback' }, payload); }, C.hard_timeout_ms);

    /* Make webhook (fire-and-forget); keepalive → request přežije i okamžité zavření okna */
    function postToMake(body) {
      if (!C.make_webhook_url) return;
      try {
        fetch(C.make_webhook_url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body), keepalive: true }).catch(function () {
            try { if (navigator.sendBeacon) navigator.sendBeacon(C.make_webhook_url, new Blob([JSON.stringify(body)], { type: 'application/json' })); } catch (e) {}
          });
      } catch (e) {}
    }
    /* 0) ZÁLOHA HNED PO SUBMITU — ještě před reCAPTCHA i gateway (type: "lead", bez tokenu) */
    postToMake(Object.assign({ type: 'lead', attempt: lead.attempt = (lead.attempt || 0) + 1 }, payload));

    function logGatewayResult(gw) {
      if (!C.log_gateway_result) return;
      postToMake({
        type: 'gateway_result',
        lead_uuid: payload.lead_uuid, event_id: payload.event_id, attempt: lead.attempt,
        tenantId: payload.eventDetails.tenantId,
        email: payload.eventDetails.userData.email, phone: payload.eventDetails.userData.phone,
        gateway_log_id: gw.gatewayId || '', recaptcha_token: payload.recaptchaToken || '',
        result: gw.result, http_status: gw.httpStatus || 0, error: gw.error || '', response_raw: (gw.raw || '').slice(0, 2000),
        page_url: _stripQuery(window.location.href), timestamp: new Date().toISOString()
      });
    }

    function go(token) {
      payload.security.recaptcha_token = token || null;
      payload.recaptchaToken = token || '';
      var fired = false;
      function fireLeadCapture(gw) {
        if (fired) return; fired = true;
        pushLeadCapture(payload, gw, answers);
      }
      /* 1) form_sent ve stejném okamžiku, kdy odchází POST do gateway (1× na lead_id) */
      if (!lead.formSent) { lead.formSent = true; pushFormSent(payload); }
      var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var ft = setTimeout(function () { if (ctrl) ctrl.abort(); }, C.fetch_timeout_ms);
      var httpStatus = 0, raw = '';
      fetch(C.gateway_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-gateway-key': C.gateway_key },
        body: JSON.stringify({ eventDetails: payload.eventDetails }),
        signal: ctrl ? ctrl.signal : undefined,
        keepalive: true
      })
      .then(function (res) {
        clearTimeout(ft); httpStatus = res.status;
        return res.text().then(function (t) { raw = t || ''; try { return JSON.parse(t); } catch (e) { return {}; } });
      })
      .then(function (data) {
        clearTimeout(hard);
        /* 2) gateway odpověděla → 3) leadCapture: success (success && accepted) / error (odpověděla, ale odmítla) */
        var gw = extractGatewayResult(data);
        gw.httpStatus = httpStatus; gw.raw = raw;
        gw.result = gw.ok ? 'success' : 'error';
        if (!gw.ok) gw.error = (data && (data.error || data.message)) ? String(data.error || data.message) : ('HTTP ' + httpStatus);
        fireLeadCapture(gw);
        logGatewayResult(gw);
        done(gw.ok, gw, payload);
      })
      .catch(function (err) {
        clearTimeout(ft); clearTimeout(hard);
        /* gateway neodpověděla (timeout / síť / CORS) → fallback: lead je v Make (záloha z kroku 0), gatewayID prázdné */
        var gw = { gatewayId: '', ok: false, result: 'fallback', httpStatus: httpStatus, raw: raw,
          error: (err && err.name === 'AbortError') ? 'timeout' : ('network: ' + (err && err.message ? err.message : 'unknown')) };
        fireLeadCapture(gw);
        logGatewayResult(gw);
        done(true, gw, payload); /* uživateli neukazujeme chybu sítě */
      });
    }

    if (C.recaptcha_site_key && typeof grecaptcha !== 'undefined' && grecaptcha.ready) {
      var grT = setTimeout(function () { if (!finished) go(null); }, C.recaptcha_timeout_ms);
      grecaptcha.ready(function () {
        grecaptcha.execute(C.recaptcha_site_key, { action: 'submit' })
          .then(function (t) { clearTimeout(grT); go(t); })
          .catch(function () { clearTimeout(grT); go(null); });
      });
    } else { go(null); }
  }

  /* ─── init při načtení: atribuce jen do paměti; cookies až po marketingovém souhlasu ─── */
  captureAttribution();
  onMarketingConsent(persistAttribution);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindCta); else bindCta();

  return {
    config: C, sendLead: sendLead, observeForm: observeForm, trackViewForm: trackViewForm, trackBeginForm: trackBeginForm,
    formStep: formStep, formError: formError, pushDL: pushDL, getConsent: getConsent,
    buildLeadPayload: buildLeadPayload, buildAttribution: buildAttribution, extractGatewayResult: extractGatewayResult
  };
})();
