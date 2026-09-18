/* ═══════════════════════════════════════════════════════════════════════════
   LP TRACKING MODUL — DomiDomi / Schlieger skupina · v2.1 (2026-09-18)
   Atribuce z URL → sessionStorage hned při načtení (lp_attr_first / lp_attr_last) → cookies po marketingovém
   souhlasu → záloha do Make → Lead Gateway (x-gateway-key, plný eventDetails dle README §5.1) → dataLayer eventy.
   Pixel i GA běží VÝHRADNĚ z GTM (žádné fbq/gtag zde).

   v2.1: plná atribuce v eventDetails (leadId, submittedAt, formId, pageUrl, landingUrl, referrer, campaignId/adsetId/adId,
   sourcePlatform, utm*, gclid/gbraid/wbraid/fbclid/msclkid/sznclid, gaClientId, device, firstTouch, consent);
   sessionStorage vrstva atribuce před souhlasem (README §4.1); nové config klíče attribution_session_storage,
   send_ga_client_id, attribution_only. Tvar form_sent / leadCapture beze změny.

   dataLayer eventy (jen tyto): view_form, begin_form, form_step, form_error, cta_click,
   phone_click, scroll_depth, form_sent (při odchodu POSTu do gateway), leadCapture (po odpovědi).

   Konfigurace: window.LP_TRACKING_CONFIG (definovat PŘED načtením modulu).
   API: LPTracking.sendLead(answers, hooks) · LPTracking.observeForm(host) · LPTracking.formStep(n, name)
        LPTracking.formError(field) · LPTracking.pushDL(event, data) · LPTracking.getConsent() · LPTracking.getAttribution()
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
    attribution_session_storage: true, // v2.1: atribuce do sessionStorage hned při načtení (README §4.1); false = jen paměť stránky (v2.0)
    send_ga_client_id: true,         // v2.1: gaClientId z cookie _ga do gateway/Make (jen při analytickém souhlasu, README §8)
    attribution_only: false,         // v2.1: true na stránkách bez formuláře — jen sběr atribuce + CTA/scroll eventy
    ss_first_key: 'lp_attr_first',
    ss_last_key: 'lp_attr_last',
    utm_keys: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content', 'utm_term'],
    click_keys: ['gclid', 'fbclid', 'msclkid', 'ttclid', 'sznclid', 'gbraid', 'wbraid'],
    gw_click_keys: ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'sznclid'], // do gateway (ttclid jen do Make)
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

  /* ─── sessionStorage (v2.1) — atribuce probíhající návštěvy, zapisuje se i před souhlasem (README §4.1) ─── */
  function _ssGet(key) {
    if (!C.attribution_session_storage) return null;
    try { var v = window.sessionStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function _ssSet(key, obj) {
    if (!C.attribution_session_storage) return;
    try { window.sessionStorage.setItem(key, JSON.stringify(obj)); } catch (e) {}
  }

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

  /* ─── ATRIBUCE (v2.1, README §4.1) ───
     Při načtení: touch z URL (nebo z externího referreru) → paměť + sessionStorage (lp_attr_last; lp_attr_first jen pokud
     ještě neexistuje ani v cookie). Cookies _attribution_first (90 d) / _attribution_last (30 d) až po marketingovém souhlasu.
     Pravý direct (bez parametrů a bez externího referreru) last touch NEPŘEPISUJE. */
  var _urlTouch = null;
  var _lastCta = 'none';

  function _emptyTouch() {
    var t = { timestamp: null, raw_query_string: null, landing_url: null, referrer: null };
    _allKeys().forEach(function (k) { t[k] = null; });
    return t;
  }
  function _parse(raw) { if (raw) { try { return JSON.parse(raw); } catch (e) {} } return null; }
  function _host(u) {
    if (!u) return '';
    try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase(); } catch (e) { return ''; }
  }
  function _isExternalReferrer(ref) {
    var h = _host(ref);
    return !!h && h !== _host(window.location.href);
  }
  function captureAttribution() {
    try {
      var params = new URLSearchParams(window.location.search);
      var keys = _allKeys();
      var hasParams = keys.some(function (k) { return params.has(k); });
      var ref = document.referrer || '';
      var external = _isExternalReferrer(ref);
      if (!hasParams && !external) return;                     /* pravý direct / interní navigace → last se nemění */
      var t = _emptyTouch();
      t.timestamp = new Date().toISOString();
      t.raw_query_string = hasParams ? (window.location.search || null) : null;
      t.landing_url = window.location.href;
      t.referrer = ref || null;
      if (hasParams) keys.forEach(function (k) { if (params.has(k)) t[k] = params.get(k); });
      _urlTouch = t;
      _ssSet(C.ss_last_key, t);
      if (!_getCookie('_attribution_first') && !_ssGet(C.ss_first_key)) _ssSet(C.ss_first_key, t);
    } catch (e) {}
  }
  function persistAttribution() {
    if (!getConsent().marketing) return;
    var last = _urlTouch || _ssGet(C.ss_last_key);
    var first = _ssGet(C.ss_first_key) || last;
    if (!last && !first) return;
    if (!_getCookie('_attribution_first') && first) _setCookie('_attribution_first', JSON.stringify(first), C.attr_first_days);
    if (last) _setCookie('_attribution_last', JSON.stringify(last), C.attr_last_days);
  }
  function _readTouch(which) {
    if (which === 'last') return _urlTouch || _ssGet(C.ss_last_key) || _parse(_getCookie('_attribution_last')) || _emptyTouch();
    return _parse(_getCookie('_attribution_first')) || _ssGet(C.ss_first_key) || _urlTouch || _emptyTouch();
  }
  function getAttribution() { return { first: _readTouch('first'), last: _readTouch('last') }; }
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
  function _origin(u) {
    if (!u) return '';
    try { return new URL(u).origin + '/'; } catch (e) { return ''; }
  }
  /* gaClientId (v2.1): cookie _ga "GA1.1.1234567890.1712345678" → "1234567890.1712345678"; jen při analytickém souhlasu */
  function _gaClientId(consent) {
    if (!C.send_ga_client_id || !consent.analytics) return '';
    var raw = _getCookie('_ga');
    if (!raw) return '';
    var p = String(raw).split('.');
    return p.length >= 4 ? p.slice(2).join('.') : '';
  }
  /* device (v2.1): hrubá kategorie z UA — do gateway nejde plný user agent */
  function _device() {
    try {
      var ua = navigator.userAgent || '';
      if (/tablet|ipad|playbook|silk/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) return 'tablet';
      if (/mobi|iphone|ipod|android|phone|blackberry|opera mini/i.test(ua)) return 'mobile';
      if (navigator.userAgentData && navigator.userAgentData.mobile) return 'mobile';
    } catch (e) {}
    return 'desktop';
  }
  /* touch ořezaný podle souhlasu: click ID a raw_query_string jen s marketingovým souhlasem */
  function _trimTouch(t, consent) {
    var out = {};
    Object.keys(t).forEach(function (k) {
      var marketingOnly = (C.click_keys.indexOf(k) !== -1) || k === 'raw_query_string';
      out[k] = (marketingOnly && !consent.marketing) ? null : t[k];
    });
    if (!consent.marketing) {
      out.landing_url = t.landing_url ? _stripQuery(t.landing_url) : null;
      out.referrer = t.referrer ? (_origin(t.referrer) || null) : null;
    }
    return out;
  }
  /* camelCase atribuce z jednoho touche (README §5.1) — click ID a plné URL jen s marketingovým souhlasem.
     params (URL aktuální stránky) se používá jen jako fallback pro last touch, nikdy pro first. */
  function _touchCamel(touch, params, consent) {
    var mk = consent.marketing;
    var d = {
      utmSource: _firstVal(touch, params, ['utm_source']),
      utmMedium: _firstVal(touch, params, ['utm_medium']),
      utmCampaign: _firstVal(touch, params, ['utm_campaign']),
      utmContent: _firstVal(touch, params, ['utm_content']),
      utmTerm: _firstVal(touch, params, ['utm_term']),
      campaignId: _firstVal(touch, params, ['campaignId', 'campaign_id', 'utm_id']),
      adsetId: _firstVal(touch, params, ['adsetId', 'adset_id']),
      adId: _firstVal(touch, params, ['adId', 'ad_id']),
      sourcePlatform: ''
    };
    C.gw_click_keys.forEach(function (k) { d[k] = mk ? _firstVal(touch, params, [k]) : ''; });
    var lu = (touch && touch.landing_url) || '';
    var rf = (touch && touch.referrer) || '';
    d.landingUrl = mk ? lu : _stripQuery(lu);
    d.referrer = mk ? rf : _origin(rf);
    d.timestamp = (touch && touch.timestamp) || null;
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
  /* kořen payloadu = LAST touch (kompatibilní s v2.0, navíc gbraid/wbraid/msclkid/sznclid) */
  function buildAttribution(consent) {
    consent = consent || getConsent();
    var params = null;
    try { params = new URLSearchParams(window.location.search); } catch (e) {}
    var d = _touchCamel(_readTouch('last'), params, consent);
    delete d.timestamp;
    return d;
  }
  /* firstTouch objekt do eventDetails (README §5.1) — bez fallbacku na aktuální URL */
  function buildFirstTouch(consent) {
    consent = consent || getConsent();
    return _touchCamel(_readTouch('first'), null, consent);
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

  /* ─── eventDetails — přesně dle README §5.1 (v2.1: plná atribuce, consent gating dle §5.1a) ───
     ctx: { leadId, submittedAt, consent } */
  function buildEventDetails(answers, attribution, ctx) {
    ctx = ctx || {};
    var consent = ctx.consent || getConsent();
    var n = _splitName(answers.name);
    var cb = consentBlock(consent);
    var ed = {
      tenantId: C.tenant_id,
      leadSource: C.gw_lead_source,
      customerType: C.gw_customer_type,
      leadProducts: C.gw_lead_products.slice(),
      note: _buildNote(answers),
      userData: {
        name: n.first || '',
        surname: n.last || '',
        email: answers.email ? String(answers.email).trim().toLowerCase() : '',
        phone: answers.phone ? String(answers.phone).trim() : '',
        zip: _extractPsc(answers.zip || answers.location) || '',
        city: answers.city || 'neznáme',
        address: answers.address || 'neznáme'
      },
      leadId: ctx.leadId || '',
      submittedAt: ctx.submittedAt || new Date().toISOString(),
      formId: C.form_id,
      pageUrl: _stripQuery(window.location.href),
      landingUrl: attribution.landingUrl || '',
      referrer: attribution.referrer || '',
      campaignId: attribution.campaignId || '',
      adsetId: attribution.adsetId || '',
      adId: attribution.adId || '',
      sourcePlatform: attribution.sourcePlatform || '',
      utmSource: attribution.utmSource || '',
      utmMedium: attribution.utmMedium || '',
      utmCampaign: attribution.utmCampaign || '',
      utmContent: attribution.utmContent || '',
      utmTerm: attribution.utmTerm || ''
    };
    C.gw_click_keys.forEach(function (k) { ed[k] = attribution[k] || ''; });
    ed.gaClientId = _gaClientId(consent);
    ed.device = _device();
    ed.firstTouch = buildFirstTouch(consent);
    ed.consent = {
      status: cb.consent_status,
      marketing: !!consent.marketing,
      analytics: !!consent.analytics,
      timestamp: cb.consent_timestamp
    };
    return ed;
  }

  /* ─── plný payload (Make) — řez podle souhlasu se dělá TADY, ne v Make ─── */
  function buildLeadPayload(answers, recaptchaToken, consent, leadUuid, submittedAt) {
    consent = consent || getConsent();
    var uuid = leadUuid || _genUuid(), now = new Date(), n = _splitName(answers.name);
    var mk = consent.marketing;
    var attribution = buildAttribution(consent);
    var lastTouch = _trimTouch(_readTouch('last'), consent);
    var payload = {
      eventDetails: buildEventDetails(answers, attribution, { leadId: uuid, submittedAt: submittedAt || now.toISOString(), consent: consent }),
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
        landing_page_url: attribution.landingUrl || null,
        referrer_url: mk ? (document.referrer || null) : null,
        referrer_domain: _domain(document.referrer)
      },
      /* v2.1: client_id z _ga jen při analytickém souhlasu; session_id se dál neposílá (párování přes lead_id v BigQuery) */
      session: { user_agent: mk ? navigator.userAgent : null, client_id: _gaClientId(consent) || null, device: _device() },
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
    lead.submittedAt = new Date().toISOString();   /* v2.1: čas kliku daného pokusu (leadId zůstává) */
    var finished = false;
    function done(ok, gw, payload) {
      if (finished) return; finished = true;
      if (ok && gw && gw.result === 'success') _pending = null; /* další submit = nový lead */
      try { var fn = ok ? hooks.onSuccess : hooks.onError; if (fn) fn(gw, payload); } catch (e) {}
    }
    var payload = buildLeadPayload(answers, null, consent, lead.uuid, lead.submittedAt);
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

  /* ─── init při načtení: atribuce → paměť + sessionStorage; cookies až po marketingovém souhlasu ───
     attribution_only: true → stejný init, jen se nečeká gateway config (stránky bez formuláře) */
  captureAttribution();
  onMarketingConsent(persistAttribution);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindCta); else bindCta();

  return {
    config: C, sendLead: sendLead, observeForm: observeForm, trackViewForm: trackViewForm, trackBeginForm: trackBeginForm,
    formStep: formStep, formError: formError, pushDL: pushDL, getConsent: getConsent, getAttribution: getAttribution,
    buildLeadPayload: buildLeadPayload, buildAttribution: buildAttribution, buildFirstTouch: buildFirstTouch,
    buildEventDetails: buildEventDetails, extractGatewayResult: extractGatewayResult
  };
})();
