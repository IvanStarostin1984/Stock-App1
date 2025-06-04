Software Design Description
3.1 Requirement Definition
3.1.1 Workflow
3.1.1.1 Workflow table
Workflow ID	Workflow name	Primary actors	Pre-condition	Post-condition	Main steps (happy path, “≤ n” = free-tier guard)	Status
WF-01	Display headline index (EoD)	Guest / Investor (UC-000/002)	Country code already known (see WF-08)	Latest official close, Δ %, ISO-8601 timestamp rendered; payload cached ≤ 24 h	1. Read local 24 h LRU cache. 2. If miss → 1 GET marketstack /eod (≤ 1 call·day⁻¹ ⇒ ≤ 30 month⁻¹ ≪ 100 limit — LIM-0003). 3. Compute Δ % vs. previous close. 4. Paint value (green ▲/red ▼, WCAG AA contrast — LIM-0010).	MVP
WF-02	View OHLC chart (1 d / 1 m / 3 m / 1 y)	Investor	WF-01 finished; symbol chosen	Interactive chart drawn with fl_chart (mobile) / Chart.js (web)	1. Pull series from same 24 h cache. 2. If miss → 1 GET /eod?symbols={sym} (range-agnostic: still ≤ 1 call·day⁻¹·sym⁻¹). 3. Down-sample ≤ 350 pts. 4. Render chart; maintain 60 fps (frame p95 ≤ 16 ms — LIM-0008).	MVP
WF-03	List top 5 gainers / losers	Guest / Investor	WF-01 finished	Two colour-coded lists; tap opens WF-02	1. Use constituents already fetched for WF-01 (no extra API). 2. Sort by Δ %. 3. Render lists with dual cues (arrow ± colour). 4. Refresh timer 02:00 local (max 1 extra read per day → still ≤ 90 calls·month⁻¹).	MVP
WF-04	Show news digest	Guest / Investor	Symbol or index in focus	≥ 3 headlines shown, links open in browser	1. Check 12 h cache (auto-purged on “invalidate:news” SSE). 2. Cache miss → 1 GET newsdata.io (≤ 200 day⁻¹ ⇒ safe; LIM-0016). 3. If 4xx or over-quota → RSS fallback (zero-cost, IF-0130).	MVP
WF-05	Register / Sign-in	User (UC-002)	Not registered	isRegistered = true; bcrypt-12 hash & AES-256 blob in IndexedDB	1.	Validate e-mail RegEx + pwd ≥ 8 chars. 2. Hash (~ 300 ms p95), encrypt, store locally (GDPR-safe — LIM-0001/-0002). 3. Navigate dashboard.
Note: „Post-condition: userId & JWT cached if backend present (else null)“	MVP
WF-06	Add holding to portfolio	Registered user	WF-05 done	Holding row added; totals auto-refresh each hour	1. Client validates {symbol, qty, price}. 2. Persist in local storage (≤ 5 kB). 3. Scheduler re-uses cached EoD quotes — no extra Marketstack calls.	MVP
WF-07	Toggle currency (EUR ↔ USD ↔ local)	Guest / Investor	WF-01 done	All monetary fields re-rendered in target currency	1. Check 24 h FX cache. 2. If stale → 1 GET exchangerate.host /latest (≤ 1 day⁻¹ ⇒ ≈ 30 month⁻¹ — LIM-0004). 3. Convert & repaint (< 2 s p95 — UR-0009).	MVP
WF-08	Acquire location (first run)	Mobile GPS / Browser Geo	App freshly installed; no country code	ISO-3166 code stored (SharedPrefs / localStorage)	1. Request geolocation permission. 2. On success parse lat/lon → country code; target ≤ 0.75 s p95 (PR-0008). 3. Denied/timeout → manual drop-down selector (zero API cost).	MVP
WF-09	“View on Web” detailed chart	Investor	WF-02 displayed	TradingView chart in in-app WebView	1. Open CDN script; SLA 99.9 % (AD-D10). 2. If 404 → load cached PNG (no external JS).	MVP
WF-10	CI auto-deploy PWA	DevOps bot (Git push)	Commit on main	Preview URL visible on Netlify; Lighthouse ≥ 90/100	1. GitHub Action invokes Netlify build hook (1 build-min ≈ 2 min). 2. Budget ≤ 300 build-min·month⁻¹ (LIM-0007) ⇒ ≤ 5 pushes·day⁻¹ safe. 3. Lighthouse test runs; build fails if Perf < 90.	MVP
WF-11	Global search equities/indices	Guest / Investor	Main page active; user types ≥ 3 chars	Suggestion list shown; pick opens WF-02	1. Filter 10 k-symbol trie in memory — 0 API calls. 2. Rank top 8 results (Levenshtein). 3. Enter/tap triggers WF-02 (chart re-uses existing cache). Perf: first list ≤ 1 s p95 (UR-0008).	MVP
WF-12	Unlock Pro (mock checkout)	Registered user	WF-05 completed; user opens “Go Pro” page	isPro = true persisted; badge & Snackbar show success	1. Open local stripe-mock checkout (localhost:12111, 1 local request). 2. On success flip flag, store in local storage. 3. Show “Pro unlocked” toast; navigate back. UX: SEQ ≥ 6/7, RTT ≤ 4 s p95 (UR-0007).	MVP
WF-13	Sync watch-list to cloud	Registered user / Investor (UC-015)	WF-06 done; network reachable	Watch-list items persisted on backend; local copy merged	1. Detect local create/update/delete in WatchList collection. 2. POST /api/watchlist (≤ 10 req·day⁻¹ ⇒ well within Supabase Free 500 MB quota). 3. On 200 merge ETag and update local cache. 4. Conflict → last-write-wins; show Snackbar.	OPT-Later
WF-14	Shopping-cart checkout (server)	Registered user / Pro candidate (UC-016)	WF-05 done; cart contains ≥ 1 SKU	Stripe test-mode payment intent created; session id stored; isPro true after webhook	1. POST /api/cart {lineItems}. 2. Serverless (Netlify Edge Fn, ≤ 50 inv·mo⁻¹ free) returns Checkout URL. 3. Redirect user; complete Stripe Test-mode payment. 4. Webhook from Stripe sets isPro=true in /api/user. 5. App refreshes credential and shows badge.	OPT-Later
WF-15	Publish news article (admin CMS)	Editor / Admin (UC-017)	Admin authenticated; draft ready	Article stored server-side; news cache purged	1. POST /api/admin/news ({title,body,src,ts}). 2. Validate length, sanitize HTML. 3. Insert row in Supabase Postgres (free tier). 4. Return 201 articleId; send SSE “invalidate:news”. 5. Clients auto-refresh on next WF-04.	OPT-Later

3.1.2 Use case table
Use-case ID	Use-case name (verb-noun)	Primary actors	Pre-condition	Post-condition (success)	Main steps (happy path, “≤ n” = free-tier guard)	Status
UC-01	Display headline index	Guest / Investor	Country code cached (UC-08)	Closing value + Δ % + ISO-8601 ts rendered; JSON cached ≤ 24 h	1 Read 24 h LRU cache for location index. 2 Cache-miss → GET Marketstack /eod (≤ 1 call·day⁻¹ ⇒ ≤ 30 month⁻¹ ≪ 100 quota § LIM-0003). 3 Compute Δ % vs. previous close. 4 Paint value with green ▲ or red ▼ plus ± sign (WCAG AA dual-cue § LIM-0010). 5 Show ISO-8601 timestamp.	MVP
UC-02	View price chart	Investor	UC-01 done; symbol chosen	Correct chart visible on phone & web	1 Pull series from 24 h cache for selected range (1 d / 1 m / 3 m / 1 y). 2 Cache-miss → GET /eod?symbols = SYM (still ≤ 1 call·day⁻¹·symbol⁻¹). 3 If range = 1 d → render sparkline preview (≤ 100 pts); else down-sample ≤ 350 OHLC points and render interactive chart with fl_chart (mobile) or Chart.js (web). 4 Keep frame-time ≤ 16 ms (mobile) and LCP ≤ 2.5 s (web).	MVP
UC-03	List top gainers / losers	Guest / Investor	UC-01 done	Two colour-coded 5-item lists; tap opens UC-02	1 Reuse index constituents from UC-01 (0 extra calls). 2 Compute each symbol’s Δ %. 3 Sort; take top 5 gainers and losers. 4 Render with green ▲ / red ▼ and ± sign (colour-blind mis-ID ≤ 2 %). 5 Tap item → invoke UC-02. 6 A11y verification: DaltonLens A/B simulator (n ≥ 8) – mis-ID must remain ≤ 2 %.	MVP
UC-04	Show news digest	Guest / Investor	Symbol or index in focus	≥ 3 headlines listed; external link opens	1 Look up 12 h cache for {symbol} headlines. 2 Cache-miss → GET NewsData.io /api/1/news (≤ 200 day⁻¹ § LIM-0016). 3 If 4xx / quota → RSS fallback (0 API). 4 Take newest 3; render cards (title, source, timestamp). 5 Tap opens URL in browser tab.	MVP
UC-05	Register / sign-in	User	Not registered	isRegistered = true; credentials stored locally (and JWT cached if remote backend enabled)	1 User enters e-mail & password. 2 Regex / length validate. 3 Hash with bcrypt-12 (~ 300 ms p95). 4 Encrypt hash with AES-256; store in IndexedDB / SharedPrefs (GDPR § LIM-0001/2). 5 Set isRegistered = true; navigate dashboard. 6 ≥ 3 failed attempts ⇒ 30 s lockout. 7 If remoteBackend = ON: POST /api/auth → receive JWT, cache 2 h.	MVP
UC-06	Manage holding	Registered user	UC-05 done	Portfolio row added / edited / deleted; totals scheduled hourly	1 User fills or edits {symbol, qty > 0, price > 0}. 2 Client-side validation. 3 Persist record (≤ 5 kB). 4 Allow delete with undo Snackbar ≤ 5 s. 5 Re-calculate totals using cached EoD prices (0 new Marketstack calls). 6 Schedule top-of-hour refresh. 7 Local create/update/delete emits event consumed by UC-15 when remoteBackend = ON.	MVP
UC-07	Toggle currency	Guest / Investor	UC-01 done	All monetary figures converted	1 User taps currency toggle (EUR ↔ USD ↔ local). 2 Check 24 h FX cache. 3 If stale → GET Exchangerate.host /latest (≤ 1 call·day⁻¹ ≈ 30 month⁻¹ § LIM-0004). 4 Convert values; repaint UI within ≤ 2 s (p95).	MVP
UC-08	Acquire location	Mobile GPS / Browser-Geo	First run; no country code	ISO-3166 country cached	1 Request geolocation permission. 2 On success: read lat/lon → map to country code offline (local JSON table). 3 Store code in SharedPrefs / localStorage. 4 On DENIED / TIMEOUT → show manual selector. 5 Positive path completes ≤ 0.75 s (p95).	MVP
UC-09	View on Web detailed chart	Investor	UC-02 displayed	TradingView chart shown in WebView	1 User taps “View on Web”. 2 Load TradingView Lightweight-Charts script from CDN (1 call·tap⁻¹, SLA 99.9 %). 3 Inject symbol into chart URL inside WebView. 4 If script 404 → load cached PNG snapshot. 5 Display chart; load ≤ 2 s (p95).	MVP
UC-10	Global search equities / indices	Guest / Investor	Main page active	Suggestion list; pick → UC-02	1 User types ≥ 3 chars. 2 Filter in-memory 10 k-symbol trie (0 API). 3 Rank top 8 by Levenshtein distance. 4 Render drop-down suggestions. 5 Enter / tap sets symbol & range = 1 d, triggers UC-02. 6 First list appears ≤ 1 s (p95).	MVP
UC-11	Unlock Pro (mock checkout)	Registered user	UC-05; Pro flag false	isPro = true; badge & snackbar	1 Navigate “Go Pro”. 2 Open stripe-mock checkout at localhost:12111 (offline). 3 Click “Pay” success. 4 Set isPro = true; persist. 5 Show toast & badge; return. 6 SEQ ≥ 6 / 7.	MVP
UC-12	CI auto-deploy PWA	DevOps bot	Commit on main	Preview URL posted; Lighthouse ≥ 90	1 GitHub Action runs unit + widget tests. 2 Invoke Netlify build-hook (≈ 2 build-min; cumulative ≤ 300 build-min·month⁻¹ § LIM-0007). 3 Run Lighthouse CLI → Assert Perf & A11y ≥ 90/100. 4 On pass, publish preview URL to PR & Slack. 5 On fail mark build red.	MVP
UC-13	Display key-ratios (mock)	Investor	UC-02 displayed (company-detail)	Five-column responsive table (PE, EPS, Yield, Cap, β + 1-y-ago + Δ %) visible	1 Read bundled assets/fundamentals.json (≤ 2 kB, 10 demo symbols) – 0 API. 2 Match current symbol; else “Data not available”. 3 Render table; verify WCAG AA reflow.	MVP
UC-14	Verify assets & launcher icon	CI bot / QA auditor	Build artefact produced	asset-lint passes; emulator rotation × 20 no overflow; custom icon visible	1 CI scans /assets densities + 1024² master PNG. 2 Run automated Android 13 emulator: rotate portrait ↔ landscape 20 times; assert no overflow/logcat error. 3 Fail build if lint / density / overflow check fails; else mark job green.	MVP
UC-15	Sync watch-list to cloud	Registered user	UC-06 done; network reachable; remoteBackend = ON	Watch-list items persisted on backend; local & remote data merged	1 Detect local create/update/delete in WatchList collection. 2 If signed-in + remoteBackend = ON → POST /api/watchlist (Supabase REST, ≤ 10 req·day⁻¹ ⇒ ≈ 300 month⁻¹ ≪ 500 MB DB cap & well below 1 M Netlify Edge-function invocations § Free quota). 3 Server returns ETag; update local cache. 4 409 conflict → last-write-wins; show Snackbar. 5 Offline → queue op; retry when online. ([Supabase][1], [netlify.com][2])	OPT-Later
UC-16	Shopping-cart checkout (server)	Registered user / Pro candidate	UC-05; cart contains ≥ 1 SKU; remoteBackend = ON	Stripe test-mode payment intent created; session id stored; isPro true after webhook	1 Tap “Go Pro (server)”. 2 Call Netlify Edge Function POST /api/cart {lineItems}. 3 Edge Fn creates Stripe Checkout Session (test-mode); secret key in env-vars. 4 Redirect to Stripe-hosted page; on success Stripe webhook sets isPro = true in Supabase row. 5 Client receives SSE / poll; badge appears. 6 Quota: Netlify Edge Fn ≤ 1 M inv·month⁻¹ (starter) § LIM-0017, Stripe test API ≤ 1 000 calls·s⁻¹ (global). ([netlify.com][2], [Stripe Docs][3])	OPT-Later
UC-17	Publish news article (admin CMS)	Admin / Editor	Admin authenticated; backend reachable; remoteBackend = ON	Article stored in Supabase Postgres; news-cache purged	1 Admin opens CMS page (role = editor). 2 Fill {title, body, src, url}. 3 POST /api/admin/news; Supabase inserts row (≤ 5 kB). 4 Return 201 articleId; emit SSE “invalidate:news”. 5 Clients auto-refresh on next UC-04. 6 Free tier: Supabase DB ≤ 500 MB; expected ≤ 50 req·day⁻¹. ([Supabase][1])	OPT-Later

3.1.3. Data structure table
DS ID	Status	Entity name	Attribute	Type	Constraints / validation	Relationships / purpose
DS-00	MVP	SchemaVersion	version	smallint	PK; initial = 1; current = 2; NOT NULL	Evolves +1 on each Liquibase-tagged migration; bumped to 2 to record the extension of DS-07 and the insertion of DS-08.
DS-01	MVP	CountrySetting	countryCode	char(2)	ISO-3166-1 alpha-2; PK; NOT NULL	Drives default index & FX lookup in DS-02 / DS-03
			acquisitionTs	datetime	NOT NULL	Audit GPS/Geo latency ≤ 0 .75 s (PR-0008)
			method	enum('GPS','HTML5','Manual')	default = 'GPS'	Captures geolocation source (mobile GPS, HTML5 API, manual selector)
			lastCurrency	char(3)	ISO-4217; NULL ⇒ fallback locale	Persists user’s last toggle (PF-007) → EUR ↔ USD round-trip ≤ 2 s w/o extra API calls
DS-02	MVP	EoDQuoteCache	symbol	varchar(8)	[A-Z.]{1,8}; PART PK (symbol, tradeDate)	Referenced by DS-05
			tradeDate	date	PART PK (symbol, tradeDate); NOT NULL	Distinct row per symbol-day — prevents stale duplicates
			open / high / low / close	decimal(10,4)	≥ 0; tick 0.0001	Δ % calculated at read time (ALG-001)
			seriesJson	text	G-ZIPped JSON ≤ 20 kB [{d,o,h,l,c}]; NULL allowed; 1 update / d	Persists 1 d / 1 m / 3 m / 1 y OHLC series — avoids extra Marketstack calls (UC-02)
			currency	char(3)	ISO-4217 — must match Exchangerate.host code	—
			fetchedTs	datetime	NOT NULL	TTL = 24 h → ≤ 1 call·day⁻¹·sym⁻¹ ≈ 90 mo⁻¹ ≪ 100-cap (LIM-0003)
DS-03	MVP	FXRateCache	base	char(3)	PART PK (base, quote); ISO-4217	Supports PF-007 currency toggle
			quote	char(3)	PK cont.; ISO-4217	—
			rate	decimal(12,6)	0 < rate < 10⁴	—
			fetchedTs	datetime	NOT NULL	TTL = 24 h ⇒ ≤ 30 req·mo⁻¹ (LIM-0004)
DS-04	MVP	NewsDigestCache	cacheKey	varchar(32)	PK {symbol}:{view} (e.g. AAPL:main)	Uniqueness guards ≤ 200 req·day⁻¹ (NewsData free)
			articlesJson	text	JSON array ≤ 20 items {title,url,src,publishedTs}; CHECK (LENGTH ≤ 20480)	Mirrors NewsData payload
			fetchedTs	datetime	NOT NULL	TTL = 12 h (LIM-0016)
DS-05	MVP	PortfolioHolding	holdingId	uuid	PK	Single-user local portfolio
			symbol	varchar(8)	FK → DS-02.symbol; NOT NULL	—
			quantity	decimal(18,4)	0 < qty ≤ 1 000 000	Client-side validated (FR-0106)
			buyPrice	decimal(10,2)	≥ 0	Optional cost-basis
			addedTs	datetime	NOT NULL	Timestamp for audit & hourly refresh
DS-06	MVP	UserCredential	email	varchar(254)	RFC 5322; PK	One row per device
			pwdHash	char(60)	bcrypt-12; NOT NULL	Stored inside AES-256-GCM envelope derived via PBKDF2-HMAC-SHA256 (OWASP MASVS L1)
			saltBase64	char(24)	NOT NULL; 16-byte Base64	Per-user salt — GDPR Art 32 key-separation
			isPro	boolean	default false	Flipped by FR-0108 (stripe-mock checkout)
			createdTs	datetime	NOT NULL	Audit trail → SEC-0003
DS-07	MVP	ApiQuotaLedger	apiId	enum('marketstack','fx','newsdata','stripe','supabase')	PK¹	Lightweight guard against free-tier quota overrun, now also covers optional calls to Stripe test-mode & Supabase REST
			rollingCount	smallint	≥ 0	Incremented per external call
			windowStartTs	datetime	PK²; INDEX(windowStartTs)	Marks beginning of rolling 24 h window; index speeds daily purge
			lastResetTs	datetime	NOT NULL	Cron @ 00 : 00 UTC rewrites counters; proves reset occurred
DS-08	OPT-Later	Reserved	—	—	—	Placeholder to keep ID sequence contiguous; will host future server entities if required.
DS-09	OPT-Later	WatchListItem	watchId	uuid	PK	Cloud-synced watch-list row (WF-13 / UC-15)
			userHash	char(64)	SHA-256(email); NOT NULL	Pseudonymised FK → DS-06.email; avoids plaintext PII — Supabase free DB ≤ 500 MB
			symbol	varchar(8)	FK → DS-02.symbol; NOT NULL	—
			targetPrice	decimal(10,2)	≥ 0; NULL allowed	Optional alert threshold
			note	varchar(64)	Plain UTF-8; NULL allowed	User memo
			addedTs	datetime	NOT NULL	Remote timestamp; merged on sync
			remoteSyncTs	datetime	NULL when pending	Last successful server round-trip
			——	——	——	Supabase Postgres free tier quota: ≤ 500 MB DB, unlimited API req
DS-10	OPT-Later	CartItem	cartItemId	uuid	PK	Server-side cart line (WF-14 / UC-16) processed by Netlify Edge Fn
			userHash	char(64)	SHA-256(email); NOT NULL	Links to DS-06; keeps GDPR pseudonymisation
			skuCode	varchar(16)	[A-Z0-9]{3,16}; NOT NULL	e.g. PRO01
			quantity	smallint	1 ≤ qty ≤ 10; default 1	—
			priceCents	int	≥ 0	Unit price at add-time (cent accuracy)
			checkoutSessionId	varchar(64)	UNIQUE; NULL until Stripe session	Maps Stripe test-mode session (rate ≤ 25 req·s⁻¹ limit)
			status	enum('OPEN','PAID','CANCELLED')	default 'OPEN'	State-machine driven by Stripe webhook
			addedTs	datetime	NOT NULL	Row creation time
			——	——	——	Netlify Edge Functions free quota ≤ 1 M inv·mo⁻¹ — comfortably below
DS-11	OPT-Later	NewsArticleServer	articleId	uuid	PK	Editor-authored news article (WF-15 / UC-17)
			editorHash	char(64)	SHA-256(editor email); NOT NULL	Traceability without PII
			title	varchar(256)	NOT NULL	—
			body	text	CHECK (LENGTH ≤ 10 kB)	Rich-text HTML sanitised server-side
			src	varchar(64)	e.g. UE Finance Desk; NOT NULL	Display source
			slug	varchar(64)	UNIQUE; kebab-case	SEO-friendly URL key
			publishedTs	datetime	NULL until status = 'PUBLISHED'	—
			status	enum('DRAFT','PUBLISHED')	default 'DRAFT'	Controls visibility; on publish triggers NewsDigestCache purge
			——	——	——	Fits Supabase free 500 MB cap; max expected ≤ 50 req·day⁻¹

3.1.4 Metadata table
MD ID	Data type	Category	Field name(key in storage)	Access level	Retention policy	Design note & SRS cross-ref	Status
MD-01	smallint	System	schemaVersion	internal (read-only)	Indefinite — increment only when a DS-00 migration occurs	Canonical migration-guard (DS-00; SRS § 9.6.8 “SchemaVersion”).	MVP
MD-02	varchar(15)	System	buildTag	internal (read-only)	Over-written on every Netlify / GitHub CI build (≤ 300 build-min·mo⁻¹ — LIM-0007)	Short Git commit (e.g. g3509b4f) enables deterministic repro (SRS § 9.6.26 PKG-0002).	MVP
MD-03	datetime	System	installTs	internal	Indefinite — cleared only on uninstall	GDPR first-use evidence (LIM-0001); baseline for time-to-first-crash KPI.	MVP
MD-05	datetime	Cache	fxLastFetch	internal	Auto-expires 24 h (≤ 30 req·mo⁻¹ — LIM-0004; DS-03 TTL)	Single daily guard for Exchangerate.host; used by PF-007 currency toggle.	MVP
MD-06	datetime	Cache	newsLastFetch	internal	Auto-expires 12 h (≤ 200 req·day⁻¹ — LIM-0016; DS-04 TTL)	Coarse free-tier guard for WF-04 and for editor-authored news once WF-15 is enabled; per-symbol keys live in DS-04.	MVP
MD-07	tinyint (0 – 100)	Performance	lastLighthousePerf	DevOps (read-only)	Circular buffer — keep most-recent 10 builds (≈ 2 weeks²)	Regression gate for PR-0005/6 (target ≥ 90 / 100).	MVP
MD-08	json	Quota	quotaSnapshot	internal	Rolling window 24 h, then overwrite (mirrors DS-07 counters)	Lightweight serialised view so UI can warn “89 % quota used”. Now also includes Stripe-test and Supabase counters added to DS-07.	MVP
MD-09	varchar(10)	Compliance	privacyConsentVer	user (read/write)	Until user revokes or a newer notice is published	Sized for semantic versions (e.g. 1.1.0); version 1 ↔ notice v 1.0 (24 May 2025). Supports GDPR Art 7(3) withdrawal.	MVP
MD-11	datetime	Compliance	privacyConsentTs	user (read/write)	Indefinite — updated on every affirmative consent	Fulfils GDPR Art 7(1) “demonstrate when consent obtained”; pairs with MD-09 (LIM-0001).	MVP
MD-12	tinyint (0 – 100)	Performance	lastLighthouseA11y	DevOps (read-only)	Circular buffer — keep most-recent 10 builds (≈ 2 weeks²)	Completes FR-0110 regression gate: Lighthouse Accessibility ≥ 90 / 100; stored alongside MD-07.	MVP
MD-13	datetime	Sync	watchLastSync	internal	Circular buffer — keep most-recent 30 days; overwritten on each successful cloud sync	Timestamp of last successful watch-list upload to Supabase (WF-13; DS-09). Helps respect Supabase Free-plan 500 MB DB quota. Contains no PII — timestamp only (GDPR safe).	OPT-Later
MD-14	datetime	Sync	cartLastSync	internal	Circular buffer — keep most-recent 30 days; updated after every /api/cart round-trip	Records last cart / session synchronisation with Netlify Edge Function + Stripe-test API (WF-14; DS-10). Supports 1 M edge-fn inv·mo⁻¹ Netlify Free cap and Stripe test-mode 25 req·s⁻¹ global limit. Contains no PII — timestamp only (GDPR safe).	OPT-Later
MD-15	varchar(6)	System	backendMode	internal	Indefinite — default "local"	Feature-flag for dependency-injection swap (local ▷ remote). Read at app start; drives DI container that registers remote repositories when backend is enabled (README § Architecture note).	OPT-Later
MD-16	datetime	Cache	adminNewsLastFetch	internal	Auto-expires 1 h (server-side CMS feed; zero external API cost)	Guards client pull-frequency for editor-authored news from Supabase (WF-15; DS-11) so that campus demo never exceeds free 5 GB egress / month.	OPT-Later

<sub>² Average CI cadence ≈ 5 builds·week⁻¹, so a 10-slot ring retains ~14 days of history without exceeding the embedded-cache budget.</sub>


3.1.7 List of interfaces
ID	Interface & Purpose	Data / Protocol	Free-tier / Hard Limit	Perf. target (p95 unless noted)	SRS / LIM xref	Status
–– User Interfaces ––						
UI-01	Flutter mobile UI — 6 screens, Material 3 widgets	Touch / gesture → Dart objects	n/a	Mobile frame ≤ 16 ms; CLS < 0.10	IF-0125, LIM-0008	MVP
UI-02	PWA web UI — 6 pages, Bootstrap 5 + Chart.js	Mouse / touch + HTML5	n/a	LCP ≤ 2.5 s (p75); CLS < 0.10	IF-0126, LIM-0009	MVP
–– Software (external) ––						
SI-01	Marketstack /eod — official EoD quotes	HTTPS REST JSON	100 calls mo⁻¹ cap	TTFB ≤ 200 ms	IF-0120, LIM-0003	MVP
SI-02	Exchangerate.host /latest — FX rates	HTTPS REST JSON	100 calls mo⁻¹ cap	TTFB ≤ 250 ms	IF-0121, LIM-0004	MVP
SI-03	NewsData.io /api/1/news — headline feed (primary)	HTTPS REST JSON	200 calls day⁻¹ cap; 30 credits / 15 min	TTFB ≤ 300 ms	IF-0122, LIM-0016	MVP
SI-04	RSS fallback — zero-cost backup feed	HTTP GET RSS 2.0	none (open)	TTFB ≤ 300 ms	IF-0130	MVP
SI-05	TradingView Lightweight-Chart CDN — deep-dive chart	HTTPS + iFrame	1 request tap⁻¹	WebView load ≤ 2 s	IF-0127, AD-D10	MVP
SI-06	Netlify build-hook + CDN — auto-deploy PWA	HTTPS REST	300 build-min mo⁻¹, 100 GB BW mo⁻¹	Preview URL ≤ 4 min	IF-0123, LIM-0007	MVP
SI-07	GitHub REST v3 / Actions — CI orchestration	HTTPS REST + YAML	2 000 CI-min mo⁻¹	Build ≤ 5 min	IF-0131	MVP
SI-08	jsDelivr CDN (Chart.js)	HTTPS GET UMD	global SLA ≥ 99.9 %	Script TTFB ≤ 150 ms	IF-0132, AD-D07	MVP
SI-09	stripe-mock v0.186 — local checkout stub	HTTP REST JSON (localhost)	none	RTT ≤ 400 ms	IF-0129, AD-D11	MVP
SI-10	Browser Geolocation API — HTML5 secure-context location	navigator.geolocation JSON {lat, lon, accuracy}	HTTPS-only; 1 call launch⁻¹	Country code ≤ 0.75 s	IF-0133, LIM-0008, AD-A05, PR-0008	MVP
— Backend-persistence interfaces (new) —						
SI-11	Supabase /rest/v1/watchlist — cloud watch-list CRUD	HTTPS REST JSON	500 MB DB; unlimited API calls proj⁻¹ (Free tier)	TTFB ≤ 300 ms; ≤ 5 000 watch-list calls mo⁻¹ (self-cap)	IF-0134, DS-09, WF-13, UC-15	OPT-Later
SI-12	Supabase /rest/v1/news — editor CMS endpoint	HTTPS REST JSON	same as SI-11	TTFB ≤ 300 ms; ≤ 1 000 news posts mo⁻¹	IF-0135, DS-11, WF-15, UC-17	OPT-Later
SI-13	Netlify Edge Function /api/cart — serverless cart & Stripe proxy	HTTPS REST JSON	1 M inv mo⁻¹; 128 MB RAM (invocation) (Netlify)
Cold-start ≤ 300 ms	IF-0136, DS-10, WF-14, UC-16, LIM-0017	OPT-Later
SI-14	Stripe Test API /v1/checkout_session — payment intent (server-side)	HTTPS REST JSON	25 req s⁻¹ (test mode) (Stripe Support)
RTT ≤ 400 ms	IF-0137, AD-D11, WF-14	OPT-Later
–– Hardware ––						
HI-01	Android GPS sensor — country auto-detect	Lat/Lon (WGS-84) via Android LocationSvc	1 call launch⁻¹	Country code ≤ 0.75 s	IF-0124, PR-0008	MVP
–– Memory ––						
MI-01	Local storage (IndexedDB / SharedPrefs) — client persistence	Key-value JSON + AES-256 blob (key via PBKDF2-HMAC-SHA256 ≥ 100 k iter)	≤ 5 kB record; AES-256 at-rest	RW ≤ 10 ms	IF-0128, LIM-0002	MVP
–– Internal Reporting & Ops ––						
INT-01	Lighthouse JSON report — Netlify build gate	CLI JSON artefact	1 run build⁻¹	Perf ≥ 90 / 100; A11y ≥ 90 / 100	FR-0110	MVP
INT-02	Quota ledger (ApiQuotaLedger) — runtime guard (DS-07)	Indexed counters	≤ 24 h rolling window	Cache-hit ≥ 95 % (≤ 80 Marketstack & FX calls mo⁻¹; ≤ 190 NewsData calls day⁻¹; ≤ 500 Supabase calls mo⁻¹; ≤ 500 Netlify Edge-fn inv mo⁻¹; ≤ 25 Stripe-test req s⁻¹)	PR-0009, DS-07, LIM-0016	MVP
INT-03	Heap & frame-time traces — DevTools export	JSON timeline	n/a	Heap ≤ 150 MB; frame ≤ 16 ms	PR-0004, PR-0007	MVP


3.1.8 Input table – classes, objects, attributes, functions (class catalogue)
Class ID	Layer / Component	Name (responsibility)	Key public attributes (< 10 %)	Key private attributes / state	Core functions (side-effects → return type)	Relationships & SRS / artefact cross-refs	Status
SD-01	Shared domain	QuoteModel (EoD quote + Δ %)	symbol:String close:double deltaPct:double timestamp:DateTime	_open/_high/_low:double _currency:String	fromJson(Map) → QuoteModel • toJson() → Map	Stored in DS-02; UI colour ▲▼ from deltaPct (LIM-0010); used by FR-0101 – 0103	MVP
SD-02	Shared domain	OhlcSeries (≤ 350 pts)	points:List<OhlcPoint>	—	downSample(int max) → OhlcSeries	Drawn by UI-M-ChartWidget / ChartJsAdaptor – FR-0102	MVP
SD-03	Shared domain	NewsArticle	title:String url:String source:String published:DateTime	—	fromJson(Map)	Cached in DS-04; rendered in News list – FR-0104	MVP
SD-04	Shared domain	FxRate	base:String quote:String rate:double fetched:DateTime	—	—	Mirrors DS-03; used by CurrencyConverter – FR-0107	MVP
SD-05	Shared domain	PortfolioHolding	id:Uuid symbol:String quantity:Decimal buyPrice:Decimal?	_added:DateTime	marketValue(Decimal close)	Maps DS-05; rendered in portfolio – FR-0106	MVP
SD-06	Shared domain	CountrySetting	iso2:String lastCurrency:String	_acquired:DateTime _method:GeoMethod	isExpired() → bool	Reflects DS-01; written by LocationService; meets PR-0008	MVP
SD-07	Shared domain	ApiQuotaLedger	apiId:ApiKind rollingCount:int	_windowStart:DateTime	increment() → void • isSafe(int limit) → bool	Singleton row per external API (DS-07); IDs now include newsdata, supabase, stripe; enforced in every Service	MVP
SD-08	Shared domain	UserCredential (local auth + Pro-flag)	email:String created:DateTime isPro:bool	_hash:String _salt:String	fromJson(Map) → UserCredential • verify(String) → bool	Maps DS-06; supports FR-0105 & FR-0108	MVP
SD-09	Shared domain	WatchListItem (cloud-sync row)	id:Uuid symbol:String targetPrice:Decimal? note:String added:DateTime	_synced:bool _syncTs:DateTime?	setTargetPrice(Decimal) → void • toJson()/fromJson()	Stored in DS-09; synced by S-07; rendered in portfolio-watch tab; UC-15 / WF-13	OPT-Later
SD-10	Shared domain	CartItem (server-side checkout line)	itemId:Uuid skuCode:String quantity:int priceCents:int status:CartStatus	_sessionId:String? _added:DateTime	toJson()/fromJson()	Maps DS-10; used by S-08; UC-16 / WF-14; quota ≤ 1 M Edge-Fn inv·mo⁻¹ (LIM-0017)	OPT-Later
SD-11	Shared domain	CmsArticle (editor-authored news)	articleId:Uuid title:String src:String published:DateTime	_bodyHtml:String _editorHash:String _status:ArticleStatus	toJson()/fromJson()	Maps DS-11; published via S-09; consumed by NewsService; UC-17 / WF-15	OPT-Later
SD-12	Shared domain	CheckoutSession (Stripe stub DTO)	id:String url:String status:SessionStatus created:DateTime	_expires:DateTime?	fromJson(Map) → CheckoutSession • toJson() → Map	Transient object: created by CartService, cached by CartRepository; relates to IF-0137 • UC-16	OPT-Later
U-01	Utility	LruCache<K,V> (24 h / 12 h)	capacity:int	_map:<K,V> _expiry:<K,DateTime>	get(K) • put(K,V,Duration)	Used by all Services; honours TTLs LIM-0003/4/16	MVP
U-02	Utility	CurrencyConverter	—	_fxCache:LruCache	convert(amount,currFrom,currTo)	Depends on SD-04; called by UI renderer – FR-0107	MVP
U-03	Utility	ChartJsAdaptor (Dart → Chart.js bridge)	—	—	dataset(OhlcSeries) → Map	Generates JS dataset; referenced by FR-0102, IF-0126	MVP
U-04	Utility	SymbolTrie (10 k-ticker search)	count:int	_root:TrieNode	load(List<String>) → void • search(String,int) → List<String>	Zero API cost; fulfils PF-012 & UC-10	MVP
U-05	Utility	RssParser (RSS → NewsArticle[])	—	—	parse(String) → List<NewsArticle>	Fallback used by NewsService when NewsData quota hit – IF-0130	MVP
U-06	Utility	SupabaseRestClient (generic REST wrapper)	baseUrl:String apiKey:String	_ledger:ApiQuotaLedger _cache:LruCache	get(path) → Map • post(path,Map) → Map	Shared by S-07 & S-09; guards Supabase quota (apiId = supabase); IF-0134/0135	OPT-Later
S-01	Service	MarketstackService	baseUrl apiKey	_cache:LruCache _ledger:ApiQuotaLedger	getIndexQuote(String) → QuoteModel • getSeries(String) → OhlcSeries	Enforces ≤ 100 req·mo⁻¹ (LIM-0003) via _ledger.isSafe(100)	MVP
S-02	Service	FxService	baseUrl	_cache:LruCache _ledger:ApiQuotaLedger	getRate(String,String) → FxRate	Upholds ≤ 100 req·mo⁻¹ (LIM-0004)	MVP
S-03	Service	NewsService	primaryUrl fallbackUrl	_cache:LruCache _ledger:ApiQuotaLedger _rss:RssParser	getDigest(String) → List<NewsArticle>	Caps ≤ 200 req·day⁻¹ (LIM-0016); cascades to RSS on error – IF-0122/0130	MVP
S-04	Service	LocationService	—	_geoPlug:navigator/geolocator	resolveCountry() → CountrySetting	Meets PR-0008 (≤ 0.75 s); writes SD-06	MVP
S-05	Service	AuthService (client-side)	—	_repo:CredentialStore	register(email,pwd) → UserCredential • login(email,pwd) → bool	Uses SD-08; local storage; fulfils FR-0105	MVP
S-06	Service	ProUpgradeService (stripe-mock wrapper)	checkoutUrl:String	_store:CredentialStore	checkout() → Future<bool> (POST → flip isPro)	Talks to stripe-mock (IF-0129); updates SD-08; delegates to CartService when backendMode = remote	MVP
S-07	Service	WatchListSyncService (Supabase)	baseUrl:String enabled:bool	_client:SupabaseRestClient _ledger:ApiQuotaLedger _cache:LruCache	syncUpload(List<WatchListItem>) → Future<bool> • fetchRemote() → List<WatchListItem>	Implements WF-13; talks to SI-11 / DS-09; respects Supabase quota; UC-15	OPT-Later
S-08	Service	CartService (Edge Fn + Stripe test)	endpointUrl:String	_ledger:ApiQuotaLedger	createSession(List<CartItem>) → Future<CheckoutSession> • confirm(String) → Future<bool>	Uses SI-13 (Netlify Edge) & SI-14 (Stripe test); maps DS-10 & SD-12; UC-16	OPT-Later
S-09	Service	AdminNewsService (Supabase CMS)	baseUrl:String	_client:SupabaseRestClient _ledger:ApiQuotaLedger	publish(CmsArticle) → Future<bool> • listDraft() → List<CmsArticle>	Interfaces SI-12; stores DS-11; invalidates DS-04 cache via SSE; UC-17	OPT-Later
R-01	Repository	QuoteRepository	—	_svc:MarketstackService _country:CountrySetting	headline() → QuoteModel • series(String) → OhlcSeries	Supplies data to VMs – FR-0101/0102	MVP
R-02	Repository	PortfolioRepository	—	_store:IndexedDB/SharedPrefs	list() → List<PortfolioHolding> • add() • remove()	CRUD wrapper around DS-05 – FR-0106	MVP
R-03	Repository	CredentialStore	—	_store:IndexedDB/SharedPrefs	save(UserCredential) • find(String)	Persists SD-08; called by AuthService & ProUpgradeService	MVP
R-04	Repository	WatchListRepository	—	_svc:WatchListSyncService _local:IndexedDB	list() • add() • remove(id) • sync()	Maps DS-09; orchestrates local ↔ cloud merge; UC-15	OPT-Later
R-05	Repository	CartRepository	—	_cartSvc:CartService	createSession() → CheckoutSession • addSku() • checkout() → Future<bool>	Uses SD-12; maps DS-10; used by Pro-upgrade flow; UC-16	OPT-Later
R-06	Repository	AdminNewsRepository	—	_svc:AdminNewsService	publishDraft() • deleteArticle() • fetchDrafts()	Maps DS-11; editor-only UI tasks; UC-17	OPT-Later
VM-01	Mobile state (Riverpod)	AppStateNotifier	state:AppState	_quoteRepo _fxSvc _newsSvc _authSvc _trie:SymbolTrie _proSvc:ProUpgradeService _watchRepo?:WatchListRepository	async loadHeadline() • toggleCurrency() • signIn() • search(term) → List<String> • upgradePro() → Future<void> • syncWatchList() → Future<void>†	Connected to six Flutter screens; †syncWatchList() is a no-op when backendMode = local – keeps MVP build side-effect-free; search() uses U-04	MVP
VM-02	Web state (Pinia / Redux)	Store	headline:QuoteModel …	same deps + _trie:SymbolTrie _proSvc _watchRepo?:WatchListRepository	same actions + search(term) + upgradePro() + syncWatchList() → Promise<void>†	Mirrors VM-01; watch-list sync disabled when backendMode = local; suggestions & Pro toggle supplied to web UI	MVP
UI-M-ChartWidget	Mobile Widget	ChartWidget (responsive OHLC)	Stateless props only	—	build(OhlcSeries)	Consumes SD-02; meets FR-0102; frame ≤ 16 ms (LIM-0008)	MVP
UI-M-*	Mobile Widgets	MainPage, NewsPage, DetailPage, AuthPage, PortfolioPage, ProPage (+ AdminPage)	Stateless props only	—	build()	Consume VM-01; includes search bar & Pro button; AdminPage bound to AdminNewsRepository; AppBar + icon per assignment § 1	MVP
UI-W-*	Web Components	same 6 pages (Bootstrap 5) (+ AdminPage)	React/Vue props	—	render()	Consume VM-02; Netlify deploy (FR-0110); search dropdown & “Go Pro” button; AdminPage visible when role = editor	MVP
Heads-up for the team – what is deliberately missing from the class catalogue
Gap	Why it isn’t listed yet	When / how we’ll capture it
Micro-helpers & mix-ins<br/>(RetryDecorator, Json*Mapper, tiny UI widgets)	These pop up while coding and often get renamed/removed; listing them early clutters the doc.	Drop a 1-paragraph ADR once the helper’s name + contract stabilises. If another layer comes to rely on it, add a Utility row in the next catalogue revision.
Concrete remote repos/services<br/>(RemoteQuoteRepository, SupabaseWatchListRepo, …)	They belong to the optional backend path (backendMode == remote), so they’re outside the MVP slice.	Implement after Sprint 2 when we tackle OPT-Later stories WF-13/14/15. Then add rows marked Status = OPT-Later.
Test doubles / mocks<br/>(MockGpsProvider, local stub servers)	Purely for unit/integration tests – they never ship in production builds.	Document in /test/README.md; no catalogue entry needed unless a mock is promoted to a runtime façade.
Cross-cutting infra<br/>(logger, DI bootstrap, global toast bus)	Mostly one-liner wrappers or framework defaults already implied by the “DI + feature-flag” note.	If any wrapper exceeds ≈ 50 LOC or gets reused across ≥ 2 layers, record a single Utility row at the next design review.
Future platform bridges<br/>(iOS shell, desktop PWA tweaks, analytics SDK)	Out of exam scope; postponed until v 1.2.	Add new rows once that work is green-lit after v 1.1 acceptance.
Action for devs – keep it lean
1.	Code freely; log a tiny ADR for every new helper/pattern.
2.	At the end of each sprint run a 5-minute “catalogue sweep”: if a helper now crosses a layer boundary or ships in production, add it to the table and tag it MVP or OPT-Later as appropriate.


3.1.9 Output table – list of users, activities, functional, non-functional requirements and metrics
User ID	User / Role	Activity (WF / UC)	Functional Req. ID (+ key free-tier guard)	Main Non-functional reqs. (ID → target)	Quantified metrics†	Status
UC-000, UC-002	Guest Visitor, Retail Investor	Display headline index (WF-01 / UC-01)	FR-0101 «≤ 100 Marketstack calls·mo⁻¹» (LIM-0003)	PR-0005 LCP ≤ 2.5 s (p75) • PR-0006 CLS < 0.10 • Quota-eff. PR-0009 hit ≥ 95 %	LCP ≤ 2.5 s; CLS < 0.1; cache-hit ≥ 95 % ⇒ ≤ 80 API calls·mo⁻¹	MVP
UC-000, UC-002	Guest Visitor, Retail Investor	View OHLC chart 1 d / 1 m / 3 m / 1 y (WF-02 / UC-02)	FR-0102	LIM-0008 Frame ≤ 16 ms (p95, mobile) • LIM-0009 LCP ≤ 2.5 s (p75, web)	Frame ≤ 16 ms; LCP ≤ 2.5 s; task-succ. ≥ 90 % (UR-0001)	MVP
UC-000, UC-002	Guest Visitor, Retail Investor	List top 5 gainers / losers (WF-03 / UC-03)	FR-0103	LIM-0010 Colour-blind mis-ID ≤ 2 %	Refresh ≤ 5 s; mis-ID ≤ 2 %; contrast ≥ 4.5∶1	MVP
UC-000, UC-002	Guest Visitor, Retail Investor	Show news digest (WF-04 / UC-04)	FR-0104 «≤ 200 NewsData calls·day⁻¹» (LIM-0016)	News RTT ≤ 500 ms (p95)	First headline ≤ 500 ms; task-succ. ≥ 90 % (UR-0012)	MVP
UC-002	Retail Investor (unregistered)	Register / sign-in (WF-05 / UC-05)	FR-0105	LIM-0001/0002 GDPR bcrypt + AES-256	Reg→dash ≤ 90 s (p95); bcrypt 12 rounds; AES-256 client-store	MVP
UC-002	Registered user	Add / remove holding (WF-06 / UC-06)	FR-0106	Hourly totals refresh (no new Marketstack calls)	Add-succ. ≥ 95 % (UR-0005); Σ error ≤ 0.01	MVP
UC-000 – UC-003	Guest → Peer	Toggle currency EUR ↔ USD ↔ local (WF-07 / UC-07)	FR-0107 «≤ 100 FX calls·mo⁻¹» (LIM-0004)	UR-0009 toggle ≤ 2 s (p95)	Round-trip ≤ 2 s; rate err ≤ 0.01	MVP
UC-000 – UC-003	All mobile / web users	Acquire location (first run) (WF-08 / UC-08)	FR-0109	PR-0008 country code ≤ 0.75 s (p95)	Latency ≤ 0.75 s; graceful MANUAL on deny	MVP
UC-002	Retail Investor	“View on Web” detailed chart (WF-09 / UC-09)	FR-0111	AD-D10 TradingView CDN SLA 99.9 %	WebView load ≤ 2 s; task-succ. ≥ 95 % (UR-0011)	MVP
UC-000 – UC-003	Guest / Investor	Global search companies / indices (WF-11 / UC-10)	FR-0112 (0 external calls)	UR-0008 first list ≤ 1 s (p95)	List ≤ 1 s; task-succ. ≥ 90 %	MVP
UC-002 → UC-005	Registered user → Pro	Unlock Pro (mock checkout) (WF-12 / UC-11)	FR-0108	UR-0007 SEQ ≥ 6⁄7; RTT ≤ 4 s (p95)	SEQ ≥ 6; RTT ≤ 4 s; isPro flag true	MVP
UC-001 (Faculty Examiner)‡, DevOps bot	Auto-deploy PWA (WF-10 / UC-12)	FR-0110 «≤ 300 Netlify build-min·mo⁻¹» (LIM-0007)	UR-0002 preview URL ≤ 4 min (p95); Lighthouse ≥ 90 / 100	Build ≤ 4 min; Perf & A11y ≥ 90	MVP	
UC-002	Retail Investor	Display key ratios table (WF-13 / UC-13)	FR-0113 (deferred – API TBD)	WCAG AA reflow	— (feature deferred)	OPT-Later
UC-002	Retail Investor	Sync watch-list to cloud (WF-13 / UC-15)	FR-01xx (to be created) «Supabase 500 MB DB»	Net TTFB ≤ 300 ms	≤ 5 000 watch-list calls·mo⁻¹	OPT-Later
UC-002	Retail Investor	Server-side checkout (WF-14 / UC-16)	FR-01yy «Netlify Edge ≤ 1 M inv·mo⁻¹»	Stripe RTT ≤ 400 ms	Edge cold-start ≤ 300 ms	OPT-Later
UC-006	Editor / Admin	Publish news article (WF-15 / UC-17)	FR-01zz «Supabase 500 MB DB»	Article save RTT ≤ 300 ms	≤ 1 000 posts·mo⁻¹	OPT-Later

 
3.2 Software Interface Design and Architecture
Artifacts
3.2.1 Architecture design
3.2.1.1 Architecture components description
Component ID	Name	Description (incl. key quantitative caps already in SRS)	Responsibilities (main logic only)	Interactions (direction → component / API, incl. call-budget)	Mapped Req. ID(s)	Relationships / Depends on	Status
CMP-UI-M	Flutter Mobile UI	6 Material-3 screens rendered ≤ 16 ms frame (LIM-0008).	Collect input, call View-Model, render charts with fl_chart 0.66 (AD-D08).	← VM-M ↗ GPS sensor 1 call launch⁻¹	PF-001-004, 006-012; FR-0101-0112	VM-M; HW-GPS (IF-0124)	MVP
CMP-UI-W	PWA Web UI	6 Bootstrap-5 pages from Netlify CDN; LCP ≤ 2.5 s (p75) (LIM-0009).	Same duties as CMP-UI-M; charts via Chart.js 4.4.9 (DC-LANG-WEB-1).	← VM-W ↗ Browser Geo 1 call launch⁻¹	PF-001-004, 006-012; FR-0101-0112	VM-W; Browser Geo (IF-0133)	MVP
CMP-VM-M	AppState Notifier	Riverpod state for mobile; caches headline, series, FX.	Invoke repositories; expose async state; throttle currency toggle ≤ 1 live FX call day⁻¹.	↗ Repo-* (≤ 3 Marketstack calls day⁻¹ total — LIM-0003)	PF-001-012; FR-0101-0108, 0112	Repo-Quote / News / FX / Portfolio / Cred	MVP
CMP-VM-W	Pinia / Redux Store	Same responsibilities for web (JavaScript).	Invoke repositories; expose async state to web UI; throttle currency toggle ≤ 1 live FX call day⁻¹.	↗ Same repositories; identical call budgets	Same as mobile	Same repositories	MVP
CMP-Repo-Quote	Quote Repository	24 h LRU cache ⇒ ≤ 100 Marketstack calls mo⁻¹ (LIM-0003).	headline(), series(sym)	↗ MarketstackService (CMP-Svc-MS)	FR-0101-0103	Svc-MS; U-LRU	MVP
CMP-Svc-MS	MarketstackService	Wraps /eod; cache-hit ≥ 95 % (PR-0009).	fetchEoD(), fetchSeries()	→ api.marketstack.com ≤ 3 req day⁻¹	IF-0120; FR-0101-0103	U-LRU; U-Quota	MVP
CMP-Svc-FX	FxService	Wraps Exchangerate.host; ≤ 100 req mo⁻¹ (LIM-0004).	getRate() (24 h cache)	→ api.exchangerate.host 1 req day⁻¹	IF-0121; FR-0107	U-LRU; U-Quota	MVP
CMP-Svc-News	NewsService	Primary = NewsData.io ≤ 200 req day⁻¹ (LIM-0016); RSS fallback.	getDigest(), parseRSS()	→ newsdata.io; → RSS (fallback)	IF-0122, 0130; FR-0104	U-LRU; RssParser; U-Quota	MVP
CMP-Svc-Loc	LocationService	Resolves ISO-3166 country code ≤ 0.75 s (PR-0008).	resolveCountry()	→ GPS / Browser Geo	IF-0124, 0133; FR-0109	—	MVP
CMP-Svc-Auth	AuthService	Pure client-side bcrypt-12 + AES-256 store (LIM-0002).	register(), login()	↗ CredentialStore	FR-0105	Repo-Cred	MVP
CMP-Svc-Pro	ProUpgradeService	Talks to stripe-mock v0.186 (local, no quota).	checkoutMock()	→ localhost:12111	FR-0108	stripe-mock container	MVP
CMP-Repo-Portfolio	PortfolioRepository	CRUD holdings; hourly totals reuse cached quotes (0 extra API calls).	add(), list(), remove(), refreshTotals()	↗ Repo-Quote (read-only)	FR-0106	IndexedDB / SharedPrefs (DS-05)	MVP
CMP-Repo-Cred	CredentialStore	Persist bcrypt hash blob; no PII off-device (LIM-0001).	save(), find(), updateProFlag()	Local storage only	FR-0105, 0108	IndexedDB / SharedPrefs (DS-06)	MVP
CMP-U-LRU	LruCache<K,V>	24 h + 12 h caches, cap = 128 entries.	get(), put()	—	U-01	Used by Svc-MS/FX/News	MVP
CMP-U-Trie	SymbolTrie	In-memory 10 k ticker trie (0 API calls).	load(), search() ≤ 1 s (p95)	—	U-04; FR-0112	Used by both VMs	MVP
CMP-U-Quota	ApiQuotaLedger	Shared rolling counter; guards all external-API quotas, keeps cache-hit ≥ 95 % (PR-0009).	increment(), isSafe(limit)	—	SD-07; PR-0009	Used by all Svc-* components	MVP
CMP-CI-Netlify	GitHub Actions + Netlify Build	Auto-deploy on push; ≤ 300 build-min mo⁻¹ (LIM-0007).	Build, run unit + Lighthouse ≥ 90, publish preview URL.	↔ Netlify REST < 10 calls day⁻¹, GitHub REST	FR-0110	—	MVP
CMP-Host-Netlify	Netlify CDN (PWA)	Static hosting ≤ 100 GB BW mo⁻¹ (LIM-0007).	Serve HTML/CSS/JS; provide HTTPS & TLS 1.3	← UI-W ↔ Netlify REST < 10 calls day⁻¹	SITE-NETLIFY; IF-0123	Output of CMP-CI-Netlify	MVP
CMP-Edge-Fn	Netlify Edge Functions	Needed only for server-side cart / Stripe test; free tier ≤ 1 M inv mo⁻¹ (LIM-0017).	createCheckoutSession(), webhook()	↔ Stripe Test API ≤ 25 req s⁻¹	WF-14 / UC-16 (planned FR-01yy)	Depends on Stripe Test / Supabase	OPT-Later
CMP-Svc-Supabase	SupabaseRestClient + WatchList / CMS	Cloud persistence for watch-list & editor CMS (≤ 500 MB DB).	syncWatchList(), publishNews()	↔ Supabase REST (unlimited on free tier)	WF-13 / 15	SD-09 / SD-11; Edge-Fn optional	OPT-Later


3.2.1.2 Architecture diagram high level
 -- 
---
config:
  flowchart:
    htmlLabels: true
    curve: basis
  look: handDrawn
  layout: fixed
  theme: default
---
flowchart LR
 subgraph CLIENT["Client UIs"]
        UIM["UI-M<br>(Flutter • fl_chart)"]
        UIW["UI-W<br>(PWA)"]
  end
 subgraph VM["View-Model"]
        VMM["VM-M<br>(Riverpod)<br><i>+ SymbolTrie</i>"]
        VMW["VM-W<br>(Pinia / Redux)<br><i>+ SymbolTrie</i>"]
  end
 subgraph REPO["Repositories & Caches"]
        RQUOTE["Repo-Quote"]
        RPORT["Repo-Portfolio"]
        RNEWS["Repo-News"]
        RCRED["Credential Store"]
        LRU["24 h LRU Cache"]
        QLEDGER["ApiQuotaLedger"]
        TRIE["SymbolTrie<br>(10 k tickers)"]
  end
 subgraph SVC["Domain Services"]
        S_MS["MarketstackSvc"]
        S_FX["FxSvc"]
        S_NEWS["NewsSvc"]
        S_LOC["LocationSvc"]
        S_AUTH["AuthSvc"]
        S_PRO["ProUpgradeSvc"]
        S_FUND["FundamentalsSvc"]
  end
 subgraph LOCALDB["Local persistence<br>(IndexedDB / Shared-Prefs)"]
        STORE["Key-Value Store"]
  end
 subgraph ONDEVICE["On-device (mobile app • PWA bundle)"]
    direction TB
        CLIENT
        VM
        REPO
        SVC
        LOCALDB
  end
 subgraph STATIC_CDN["Static CDNs"]
        CDN_JS["jsDelivr<br>(Chart.js)"]
        CDN_TVIEW["TradingView CDN"]
  end
 subgraph EXT["External APIs & Infra"]
    direction TB
        API_MS["Marketstack API"]
        API_FX["Exchangerate.host"]
        API_NEWS["NewsData.io"]
        API_FMP["FMP API"]
        API_GPS["Device GPS / Browser Geo"]
        API_STRIPE["Stripe-test API"]
        STRIPE_MOCK["stripe-mock<br>(localhost)"]
        GHACTIONS["GitHub Actions"]
        CI_NETLIFY["Netlify Build CI"]
        CDN_NETLIFY["Netlify CDN"]
        STATIC_CDN
  end
 subgraph OPT["Optional cloud back-end"]
    direction TB
        EDGE_FN["Netlify Edge Fn"]
        SUPABASE["Supabase REST"]
  end
    UIM --> VMM
    UIW --> VMW & CDN_NETLIFY & CDN_JS & CDN_TVIEW
    UIM -.-> CDN_TVIEW
    VMM --> RQUOTE & RPORT & RNEWS & S_LOC & S_AUTH & S_PRO & S_FX & TRIE
    VMW --> RQUOTE & RPORT & RNEWS & S_LOC & S_AUTH & S_PRO & S_FX & TRIE
    RQUOTE --> S_MS
    RNEWS --> S_NEWS
    RPORT --> RQUOTE
    TRIE -. "in-mem" .- VMM & VMW
    QLEDGER --> S_MS & S_FX & S_NEWS
    S_MS --> LRU & API_MS
    S_FX --> LRU & API_FX
    S_NEWS --> LRU & API_NEWS
    S_FUND --> LRU & API_FMP
    S_LOC --> API_GPS
    S_AUTH --> RCRED
    S_PRO --> RCRED
    S_PRO -.-> STRIPE_MOCK
    GHACTIONS --> CI_NETLIFY
    CI_NETLIFY --> CDN_NETLIFY
    RCRED -. "AES-256 blob" .- STORE
    LRU -. cached JSON .- STORE
    QLEDGER -. rolling 24 h .- STORE
    RPORT -. holdings .- STORE
    RNEWS -. 12 h digest .- STORE
    VMM -.-> SUPABASE
    VMW -.-> SUPABASE
    EDGE_FN -.-> API_STRIPE
     S_FUND:::opt
     S_FUND:::opt
     API_FMP:::opt
     API_FMP:::opt
     EDGE_FN:::opt
     SUPABASE:::opt
    classDef opt stroke-dasharray:5 3,fill:#fffffa
    style STATIC_CDN stroke-dasharray:5 3,fill:#fffffa
    style ONDEVICE stroke-width:1px


3.2.2 Interface design
3.2.2.1 API specifications
API ID (SRS § 9.6.11)	Name / Purpose	Endpoint (Free-tier)	Method	Input parameters †	Output (format)	Mapped Req. ID(s)	Status
IF-0120	Marketstack EoD quotes – latest official close & OHLC series (≤ 100 calls·month⁻¹) LIM-0003	https://api.marketstack.com/v1/eod	GET	• access_key query (32 char) • symbols CSV (DAXX,MSFT) • opt. date (YYYY-MM-DD) • opt. limit = 1-100 (default 100) • opt. sort =ASC|DESC (default DESC)	JSON { data:[{ symbol, date, open, high, low, close, volume }] }	FR-0101 – 0103; PR-0009	MVP
IF-0121	Exchangerate.host FX – spot rate for currency toggle (≤ 100 calls·month⁻¹) LIM-0004	https://api.exchangerate.host/latest	GET	• base (ISO-4217, e.g. EUR) • symbols (CSV list, e.g. USD,GBP) • opt. amount (decimal, default 1)	JSON { base, date, rates:{ USD:1.0867, GBP:0.8571,… } }	FR-0107	MVP
IF-0122	NewsData.io headlines – 3-item digest per symbol (≤ 200 calls·day⁻¹ / 30 credits · 15 min) LIM-0016	https://newsdata.io/api/1/news	GET	• apikey query (32 char) • q (ticker) • language=en (CSV allowed, default all) • opt. country	JSON { results:[{ title, link, source_id, publishedAt }] }	FR-0104	MVP
IF-0130	RSS fallback feed – zero-cost backup when IF-0122 quota/licence fails (no hard limits)	https://rss.theguardian.com/business/markets/index.xml (example)	GET	—	XML RSS 2.0 <item><title>…</title>…</item> (parsed client-side)	FR-0104	MVP
IF-0123	Netlify build hook – CI auto-deploy & preview URL (≤ 300 build-min·month⁻¹ and 100 GB bandwidth · month⁻¹) LIM-0007	https://api.netlify.com/build_hooks/{hook_id}	POST	• (body empty – token in URL)	JSON { id, state:"building", deploy_url,… }	FR-0110	MVP
IF-0124	Browser / Android Geolocation – resolve country code (≈ 1 call·launch⁻¹) LIM-0008	navigator.geolocation (Web) / android.location.LocationManager (Mobile)	GET	• opt. enableHighAccuracy (bool) • opt. timeout (ms)	JSON { latitude, longitude, accuracy } (Web) / { lat, lon, accuracy } (Mobile)	FR-0109	MVP
IF-0127	TradingView Lightweight-Chart embed – deep-dive chart in WebView (≈ 1 call·tap⁻¹, global SLA 99.9 %)	https://cdn.tradingview.com/lightweight-charts/latest/lightweight-charts.js	GET	—	JavaScript UMD bundle ≈ 70 kB	FR-0111	MVP
IF-0129	stripe-mock checkout stub (local) – unlock Pro badge without real billing (un-metered)	http://localhost:12111/v1/checkout/sessions	POST	form-url-encoded:• mode=payment • success_url • cancel_url • line_items[0][price]=pro_demo	JSON { id, url, status:"open", … }	FR-0108	MVP
IF-0134	Supabase / watch-list – cloud CRUD for user holdings (≤ 500 MB DB, unlimited API)	https://{proj}.supabase.co/rest/v1/watchlist	GET / POST / PATCH / DELETE	• Auth: apikey header • JSON body (RFC 8259) • opt. PostgREST filters, e.g.  ?userHash=…&select=watchId,symbol,qty  &order=addedTs.desc&range=0,19	JSON row(s) { watchId, symbol, qty,… }	WF-13, UC-15 (future FR)	OPT-Later
IF-0136	Netlify Edge Fn / api/cart – serverless proxy to Stripe test (≤ 1 M inv·month⁻¹ / 128 MB RAM)	/.netlify/functions/cart	POST	• JSON { skuCode:"PRO01", qty:1 } • Auth: none (public Edge Fn, JWT-free)	JSON { checkoutUrl, sessionId }	WF-14, UC-16 (future FR)	OPT-Later
IF-0137	Stripe test API / checkout_session – create payment intent (25 req·s⁻¹ test limit)	https://api.stripe.com/v1/checkout/sessions	POST	• Auth: Bearer test-key • mode=payment • line_items[] • success_url	JSON { id, url, payment_status }	WF-14, UC-16 (future FR)	OPT-Later

Notes
•	† All endpoints use HTTPS + TLS 1.3 except the local stripe-mock stub (HTTP on localhost), satisfying LIM-0011 protocol constraints.
•	Free-plan ceilings & authorisation schemes are copied verbatim from SRS § 9.6.7 (LIM-0003 / 0004 / 0007 / 0016 / 0017).
•	Seven rows tagged MVP are mandatory for the exam; the four OPT-Later rows are feature-flagged off (backendMode = "local") during the initial three-week sprint.
•	NewsAPI Developer tier remains in code as a disabled stub for unit tests; it is not listed here because its licence forbids production use.


3.2.2.3 interface tables
Interface code<sup>†</sup>	Name	Type	Description (incl. hard free-tier caps + security flags)	Mapped Requirements’ ID	Status
IF-0125	Flutter Mobile UI (6 screens)	UI	Material 3 widgets rendered ≤ 16 ms frame; charts with fl_chart 0.66; GPS-permission dialog, dual ▲▼ cues, in-app WebView; Sign-up / Sign-in flow included.	FR-0101 – 0109, 0111 – 0112, 0110; LIM-0008, LIM-0010	MVP
IF-0126	PWA Web UI (Bootstrap 5)	UI	Six responsive pages served from Netlify CDN; LCP ≤ 2.5 s (p75) & CLS < 0.10; charts via Chart.js 4.4.9 (jsDelivr); includes Sign-up / Sign-in modal.	Same FR set as IF-0125; UR-0002; LIM-0009	MVP
IF-0128	IndexedDB / Android SharedPrefs	MEM	Client-side KV-store for credentials & portfolio; bcrypt-12 hash wrapped in AES-256 blob; ≤ 5 kB record; RW ≤ 10 ms.	FR-0105, 0106, 0108; LIM-0001, LIM-0002	MVP
IF-0120	Marketstack /eod	COM	Official end-of-day quotes; ≤ 100 calls · month⁻¹; TLS 1.3, API-Key header, no PII in payload.	FR-0101 – 0103; LIM-0003	MVP
IF-0121	Exchangerate.host /latest	COM	FX rates for currency toggle; ≤ 100 calls · month⁻¹; TLS 1.3, no-auth (public), no PII.	FR-0107; LIM-0004	MVP
IF-0122	NewsData.io /api/1/news	COM	Primary news feed; ≤ 200 requests · day⁻¹ and 30 credits / 15 min; TLS 1.3, API-Key header, no PII.	FR-0104; LIM-0016	MVP
IF-0130	RSS fallback feed	COM	Zero-cost RSS 2.0 backup if IF-0122 quota/licence fails (no formal limit); HTTPS.	FR-0104	MVP
IF-0127	TradingView Lightweight-Charts CDN	COM	Deep-dive chart loaded in in-app WebView; global 99.9 % SLA; 1 request per tap.	FR-0111; AD-D10	MVP
IF-0123	Netlify build-hook (OPS) + CDN (COM)	COM / OPS	Dual-role (OPS + COM): CI deploy & static hosting; 300 build-min · month⁻¹ and 100 GB bandwidth · month⁻¹; preview URL via HTTPS; Lighthouse JSON over HTTPS.	FR-0110; UR-0002, LIM-0007	MVP
IF-0131	GitHub REST v3 / Actions	COM	Triggers unit tests & Netlify build; 2 000 CI-minutes · month⁻¹ free.	FR-0110	MVP
IF-0132	jsDelivr CDN (Chart.js bundle)	COM	Delivers 201 kB UMD script; global SLA ≥ 99.9 %; 1 GET per page.	FR-0102; AD-D07	MVP
IF-0129	stripe-mock checkout stub (localhost)	COM	Emulated Stripe endpoint that unlocks Pro badge; unlimited local calls (HTTP on localhost; test-tokens only).	FR-0108; AD-D11	MVP
IF-0133	Browser / Android Geolocation API	COM	Resolves lat/lon; secure-context only; country code acquired ≤ 0.75 s (p95).	FR-0109; PR-0008	MVP
IF-0124	Android GPS sensor	HW	Provides WGS-84 coords ± 3 m; country code acquisition ≤ 0.75 s (p95); one acquisition per launch.	FR-0109; IF-0124	MVP
IF-0134	Supabase /watchlist REST	COM	Cloud CRUD for watch-list; 500 MB DB, unlimited calls on free tier.	(future) FR for UC-15 / WF-13	OPT-Later
IF-0135	Supabase /news REST	COM	Editor CMS endpoint; same 500 MB quota.	(future) FR for UC-17 / WF-15	OPT-Later
IF-0136	Netlify Edge Function /api/cart	COM	Serverless proxy to Stripe test; ≤ 1 M invocations · month⁻¹, 128 MB RAM.	(future) FR for UC-16 / WF-14; LIM-0017	OPT-Later
IF-0137	Stripe test API / checkout_session	COM	Test-mode payment intent; 25 requests · s⁻¹ soft cap.	same future FR (UC-16)	OPT-Later
<sup>† Interface codes exactly match SRS § 9.6.11 so that every ISO-29148 requirement traces to one row in this table and in the verification matrix.</sup>

3.2.3 Data design
3.2.3.2 Database schemas
3.2.3.2 Database schemas (local client store + future cloud)
Database ID	DB name / tier	Table	Column(s) → Type (PK ★, FK ◇)<br><sub>• multi-col PK shown “PK(… )”</sub>	Key constraints (excerpt)	Relationships / purpose	Retention / TTL<sup>†</sup>	Encryption / protection	Status
DB-LOC-01	LocalKV (IndexedDB / Android SharedPrefs, on-device, ≤ 50 MB per origin¹)	SchemaVersion	version → smallint ★	starts at 1, ++ on every LIQUIBASE tag	guards migration logic	Indefinite	n/a (metadata)	MVP
		CountrySetting	PK(iso2 char (2)) ★, acquisitionTs datetime, method enum('GPS','HTML5','Manual'), lastCurrency char (3)	ISO-3166 / ISO-4217 codes	drives location & FX workflow WF-01/07	overwrite on new consent	n/a	MVP
		EoDQuoteCache	PK(symbol varchar (8), tradeDate date) ★, open / high / low / close decimal (10,4), seriesJson text (G-ZIPped ≤ 20 kB), currency char (3), fetchedTs datetime	24 h TTL ⇒ ≤ 90 Marketstack calls mo⁻¹ (limit = 100 — LIM-0003)	reused by chart & top-movers	24 h auto-purge ⚙	n/a	MVP
		FXRateCache	PK(base char (3), quote char (3)) ★, rate decimal (12,6), fetchedTs datetime	24 h TTL ⇒ ≤ 30 FX calls mo⁻¹ (limit = 100 — LIM-0004)	powers currency toggle	24 h auto-purge ⚙	n/a	MVP
		NewsDigestCache	PK(cacheKey varchar (32)) ★, articlesJson text, fetchedTs datetime	cacheKey = “{sym}:{view}”; 12 h TTL ⇒ ≤ 200 NewsData calls day⁻¹ — LIM-0016	backs news panel	12 h auto-purge ⚙	n/a	MVP
		PortfolioHolding	holdingId uuid ★, symbol varchar (8) ◇, quantity decimal (18,4), buyPrice decimal (10,2), addedTs datetime	qty > 0 ≤ 1 000 000;
buyPrice ≥ 0;
FK → EoDQuoteCache.symbol	local watch-list & P/L	user delete or uninstall	IndexedDB encryption disabled (no PII)	MVP
		UserCredential	email varchar (254) ★, pwdHash char (60), saltBase64 char (24), isPro boolean, createdTs datetime	bcrypt-12 hash; email RFC 5322	local auth & Pro flag	Indefinite — user may clear via future “Clear credentials” action (backlog UX-CLR-CRED)	bcrypt-12 + AES-256-GCM blob — GDPR Art 32 (LIM-0002)	MVP
		ApiQuotaLedger	PK(apiId enum('marketstack','fx','newsdata','supabase','stripe'), windowStartTs datetime) ★, rollingCount smallint, lastResetTs datetime	one row per API; rolling 24 h	enforces free-tier ceilings	24 h ring buffer	n/a	MVP
DB-CLOUD-01	Supabase (Postgres, free ≤ 500 MB²)	WatchListItem	watchId uuid ★, userHash char (64) ◇, symbol varchar (8), targetPrice decimal (10,2), note varchar (64), addedTs datetime, remoteSyncTs datetime	FK → userHash pseudonym; quota ≤ 5 000 ops mo⁻¹	cloud sync of holdings	Indefinite; user delete	TLS 1.3; RLS; no plaintext PII	OPT-Later
		CartItem	cartItemId uuid ★, userHash char (64) ◇, skuCode varchar (16), quantity smallint, priceCents int, checkoutSessionId varchar (64), status enum, addedTs datetime	status state-machine; Stripe test-mode only	backs server checkout	30 d soft-delete	same as WatchListItem	OPT-Later
		NewsArticleServer	articleId uuid ★, editorHash char (64), title varchar (256), body text ≤ 10 kB, src varchar (64), slug varchar (64) UNIQUE, publishedTs datetime, status enum	slug unique; status draft / published	editor CMS feed	Indefinite; draft purge manual	server-side HTML sanitiser; RLS	OPT-Later
<sub>¹ IndexedDB quota per origin ≈ 50 MB (Chromium, MDN 2025-05).
² Supabase “Free” shared-cluster limit: 500 MB database + 1 GB egress mo⁻¹ (Supabase docs, 2025-05).
† TTL autopurge is performed by a lightweight housekeeping task on app-start and every ≈ 6 h while the app is open; IndexedDB itself does not expire records.</sub>
Legend / implementation notes
•	⚙ auto-purge – housekeeping runs once at app-start (and ≈ every 6 h) to delete stale cache rows, keeping quota hit-ratio ≥ 95 % and preventing silent bloat on devices without OS-level quota reclamation.
•	Composite PK order – ApiQuotaLedger uses (apiId, windowStartTs) to match the dominant lookup pattern and avoid an extra unique index.
•	SharedPrefs encryption helper – the Android implementation wraps the AES-256-GCM credential blob with EncryptedSharedPreferences; the web build uses the Web Crypto API with PBKDF2-derived keys.
•	Supabase RLS – when the cloud tables are enabled, a policy restricts SELECT / INSERT / UPDATE / DELETE to rows whose userHash matches the caller’s JWT claim. No plaintext PII ever leaves the device.
•	seriesJson compression – OHLC series are stored G-ZIPped (average ≈ 8–10 kB) to minimise IndexedDB footprint while remaining under the mobile Blob limit.

3.2.3.3 Data dictionaries
Field ID	Name	Type (logical → physical)	Description / purpose	Allowed values / domain	Example value	Status
SV-version	version	SMALLINT	Current schema-revision guard (bumps once per Liquibase tag) — DS-00	1 … 65 535	2	MVP
CS-countryCode	countryCode	CHAR (2)	ISO-3166-1 alpha-2 of user location (drives index & FX defaults) — DS-01	^[A-Z]{2}$	DE	MVP
CS-acquisitionTs	acquisitionTs	DATETIME (ISO-8601)	Geolocation finishing time (target ≤ 0.75 s p95 — PR-0008)	YYYY-MM-DD hh:mm:ss	2025-05-31 09:14:03	MVP
CS-method	method	ENUM('GPS','HTML5','Manual')	Source of country resolution (audit / fallback). — default 'GPS'	GPS | HTML5 | Manual	HTML5	MVP
CS-lastCurrency	lastCurrency	CHAR (3)	Last FX-toggle value (UI default)	ISO-4217	USD	MVP
EQ-symbol	symbol	VARCHAR (8)	Market symbol / ticker (PK part 1) — DS-02	^[A-Z.]{1,8}$	DAXX	MVP
EQ-tradeDate	tradeDate	DATE	Closing date (PK part 2)	YYYY-MM-DD	2025-05-30	MVP
EQ-open	open	DECIMAL (10,4)	Open price for tradeDate (currency = EQ-currency)	≥ 0	18 750.2300	MVP
EQ-high	high	DECIMAL (10,4)	Session high	≥ 0	18 910.0000	MVP
EQ-low	low	DECIMAL (10,4)	Session low	≥ 0	18 580.1200	MVP
EQ-close	close	DECIMAL (10,4)	Official EoD close (drives Δ %)	≥ 0	18 820.4500	MVP
EQ-seriesJson	seriesJson	TEXT (≤ 20 kB GZIP)	Cached OHLC array for 1 d/1 m/3 m/1 y ranges; avoids extra Marketstack hits (≤ 100 calls·mo⁻¹ — LIM-0003)	JSON blob	[{"d":"2025-05-30","o":…}]	MVP
EQ-currency	currency	CHAR (3)	Pricing currency, supports FX toggle	ISO-4217	EUR	MVP
EQ-fetchedTs	fetchedTs	DATETIME	Ingress time of row into 24 h LRU cache (controls API quota)	ISO-8601	2025-05-30 23:05:11	MVP
FX-base	base	CHAR (3)	Base currency (PK part 1) — DS-03	ISO-4217	EUR	MVP
FX-quote	quote	CHAR (3)	Quote currency (PK part 2)	ISO-4217	USD	MVP
FX-rate	rate	DECIMAL (12,6)	Spot FX rate (base → quote), cached 24 h (≤ 100 calls·mo⁻¹ — LIM-0004)	0 < rate < 10 000	1.086700	MVP
FX-fetchedTs	fetchedTs	DATETIME	Last pull from exchangerate.host. (24 h TTL)	ISO-8601	2025-05-31 02:00:12	MVP
ND-cacheKey	cacheKey	VARCHAR (32)	{symbol}:{view} digest for news panel (PK) — DS-04	free text ≤ 32 chars	AAPL:main	MVP
ND-articlesJson	articlesJson	TEXT (≤ 20 kB)	≤ 20 NewsData.io items, 12 h TTL (≤ 200 req·day⁻¹ — LIM-0016)	JSON blob	[{"title":"…"}]	MVP
ND-fetchedTs	fetchedTs	DATETIME	News-digest pull / refresh time	ISO-8601	2025-05-31 07:00:03	MVP
PH-holdingId	holdingId	UUID (v4)	Primary key of local portfolio row — DS-05	RFC 4122 v4	3fa85f64-…	MVP
PH-symbol	symbol	VARCHAR (8)	FK → EQ-symbol (price lookup)	^[A-Z.]{1,8}$	MSFT	MVP
PH-quantity	quantity	DECIMAL (18,4)	Share count (0 < qty ≤ 1 000 000)	(0, 1e6]	15.2500	MVP
PH-buyPrice	buyPrice	DECIMAL (10,2)	Optional cost basis in lastCurrency	≥ 0	310.50	MVP
PH-addedTs	addedTs	DATETIME	Row-creation timestamp (audit + hourly refresh trigger)	ISO-8601	2025-05-29 18:42:17	MVP
UC-email	email	VARCHAR (254)	RFC 5322 user identifier (PK) — DS-06	valid e-mail	ivan@example.de	MVP
UC-pwdHash	pwdHash	CHAR (60)	bcrypt-12 salted hash of password (GDPR pseudonymisation — LIM-0002)	60-char bcrypt	$2b$12$Ebf…	MVP
UC-saltBase64	saltBase64	CHAR (24)	16-byte salt, Base64-encoded	24-char Base64	uK1lY3RvZkM0Kw==	MVP
UC-isPro	isPro	BOOLEAN	Flag set by mock checkout (FR-0108)	TRUE | FALSE	FALSE	MVP
UC-createdTs	createdTs	DATETIME	Initial registration time (GDPR Art 7 evidence)	ISO-8601	2025-05-28 11:05:40	MVP
AQ-apiId	apiId	ENUM('marketstack','fx','newsdata','supabase','stripe')	External service being tracked — DS-07	fixed set	marketstack	MVP
AQ-windowStartTs	windowStartTs	DATETIME	Rolling-window anchor (PK part 2) for quota ledger	ISO-8601	2025-05-31 00:00:00	MVP
AQ-rollingCount	rollingCount	SMALLINT	Calls since windowStartTs (guards free-tier ceilings, e.g. ≤ 100 mo⁻¹)	0 … 32 767	42	MVP
AQ-lastResetTs	lastResetTs	DATETIME	When nightly cron zeroed the counter (audit)	ISO-8601	2025-05-31 00:00:02	MVP
RS-placeholder	—	—	Reserved to keep DS-ID sequence contiguous for v ≥ 1.2 (DS-08)	—	—	OPT-Later
WL-watchId	watchId	UUID (v4)	PK of cloud watch-list row — DS-09	RFC 4122 v4	123e4567-e89b-12d3-a456-426614174000	OPT-Later
WL-userHash	userHash	CHAR (64)	SHA-256 digest of UC-email; pseudonymised FK (no PII)	64-char hex	af5c1747…	OPT-Later
WL-symbol	symbol	VARCHAR (8)	FK → EQ-symbol (price lookup)	^[A-Z.]{1,8}$	AAPL	OPT-Later
WL-targetPrice	targetPrice	DECIMAL (10,2)	Optional alert threshold in lastCurrency	≥ 0 | NULL	150.00	OPT-Later
WL-note	note	VARCHAR (64)	Free-text memo, client-validated	UTF-8 ≤ 64 chars	"Sell > $150"	OPT-Later
WL-addedTs	addedTs	DATETIME	First local or Supabase creation time	YYYY-MM-DD hh:mm:ss	2025-06-01 14:02:11	OPT-Later
WL-remoteSyncTs	remoteSyncTs	DATETIME	Last successful Supabase sync (NULL ⇒ pending)	ISO-8601 | NULL	2025-06-01 14:02:12	OPT-Later
CT-cartItemId	cartItemId	UUID (v4)	PK of server-side cart line — DS-10	RFC 4122 v4	3fa85f64-5717-4562-b3fc-2c963f66afa6	OPT-Later
CT-userHash	userHash	CHAR (64)	SHA-256 of UC-email; links cart to user without PII	64-char hex	d41d8cd98f00b204…	OPT-Later
CT-skuCode	skuCode	VARCHAR (16)	Product SKU (e.g. Pro plan)	^[A-Z0-9]{3,16}$	PRO01	OPT-Later
CT-quantity	quantity	SMALLINT	Units of skuCode (client-validated)	1 … 10	1	OPT-Later
CT-priceCents	priceCents	INT	Unit price at add-time, cent accuracy	≥ 0	999	OPT-Later
CT-checkoutSessionId	checkoutSessionId	VARCHAR (64)	Stripe test-mode session ID (set by Netlify Edge Fn)	free text ≤ 64	cs_test_a1B2c3…	OPT-Later
CT-status	status	ENUM('OPEN','PAID','CANCELLED')	State machine driven by Stripe webhook	OPEN | PAID | CANCELLED	OPEN	OPT-Later
CT-addedTs	addedTs	DATETIME	Cart-line creation time	ISO-8601	2025-06-01 14:04:01	OPT-Later
NA-articleId	articleId	UUID (v4)	PK of editor-authored news article — DS-11	RFC 4122 v4	9b2c4e3d-…	OPT-Later
NA-editorHash	editorHash	CHAR (64)	SHA-256 digest of editor’s e-mail (RLS, no PII)	64-char hex	7e57d004…	OPT-Later
NA-title	title	VARCHAR (256)	Headline shown in clients	UTF-8 ≤ 256 chars	"ECB raises rates again"	OPT-Later
NA-body	body	TEXT (≤ 10 kB HTML)	Sanitised rich-text article body	HTML blob	<p>…</p>	OPT-Later
NA-src	src	VARCHAR (64)	Display source / desk label	UTF-8 ≤ 64	UE Finance Desk	OPT-Later
NA-slug	slug	VARCHAR (64)	Unique kebab-case URL key	^[a-z0-9-]{1,64}$	ecb-raises-rates	OPT-Later
NA-publishedTs	publishedTs	DATETIME	Article go-live timestamp (NULL while drafting)	ISO-8601 | NULL	2025-06-02 10:00:00	OPT-Later
NA-status	status	ENUM('DRAFT','PUBLISHED')	Publication state toggled in CMS	DRAFT | PUBLISHED	DRAFT	OPT-Later

QA reminder: add unit test ensuring EQ-seriesJson compressed size ≤ 20 kB GZIP (SRS § 9.6.7 LIM-0003).



3.2.4 Component-level design
3.2.4.1 Class-catalogue and relationship matrix
Class ID ✱	Name	Responsibility (≤ 1 line)	Key attrs†	Key ops / side-effects	Extends / Implements	Outgoing assocs ↣ Target (0..*)	Status	Owner / namespace	Trace-reqs
SD-01	QuoteModel	Immutable EoD quote + Δ %	symbol, close, deltaPct, ts	fromJson(), toJson()	–	–	MVP	domain.shared	FR-0101‒0103
SD-02	OhlcSeries	Down-sampled ≤ 350-pt OHLC array	points: List<OhlcPoint>	downSample()	–	↣ UI widgets (read-only)	MVP	domain.shared	FR-0102
SD-03	NewsArticle	Lightweight news DTO	title, url, src, published	fromJson()	–	–	MVP	domain.shared	FR-0104
SD-04	FxRate	Spot FX rate cached 15 min	base, quote, rate, fetched	–	–	–	MVP	domain.shared	FR-0107
SD-05	PortfolioHolding	Local watch-list row	id, symbol, qty, buyPrice	marketValue()	–	↣ QuoteModel (0..1)	MVP	domain.shared	FR-0106
SD-06	CountrySetting	ISO-3166 code + UX prefs	iso2, lastCurrency, acquired	isExpired()	–	–	MVP	domain.shared	FR-0109, PR-0008
SD-07	ApiQuotaLedger	24 h rolling counters guarding free plans	apiId, rollingCount, windowStart	increment(), isSafe()	–	–	MVP	domain.shared	LIM-0003‒0005, PR-0009
SD-08	UserCredential	Local auth blob + Pro-flag	email, hash, salt, isPro	verify()	–	–	MVP	domain.shared	FR-0105, 0108, LIM-0002
U-01	LruCache<K,V>	24 h / 12 h in-memory caches	capacity, _map	get(), put()	MapMixin	–	MVP	util	PR-0009
U-02	CurrencyConverter	Re-use 15 min FX cache to convert UI values	_fxCache: LruCache	convert()	–	↣ FxRate (read-only)	MVP	util	FR-0107
U-04	SymbolTrie	10 k ticker autocompletion	_root, count	load(), search()	–	–	MVP	util	FR-0112
U-05	RssParser	RSS → NewsArticle[] fallback	–	parse()	–	–	MVP	util	FR-0104
S-01	MarketstackService	Wrap /eod; ensure ≤ 100 calls·mo⁻¹	_cache, _ledger	fetchEoD(), fetchSeries()	–	↣ LruCache, ApiQuotaLedger, Marketstack API	MVP	service	LIM-0003
S-02	FxService	Wrap Exchangerate.host; ≤ 96 calls·mo⁻¹ (15 min TTL)	_cache, _ledger	getRate()	–	↣ LruCache, ApiQuotaLedger, FX API	MVP	service	LIM-0004
S-03	NewsService	Headline digest via NewsData.io; RSS backup	_cache, _ledger, _rss	getDigest()	–	↣ LruCache, ApiQuotaLedger, News API, RssParser	MVP	service	LIM-0016
S-04	LocationService	Resolve ISO-3166 code ≤ 0.75 s	–	resolveCountry()	–	↣ GPS / Browser Geo	MVP	service	FR-0109
S-05	AuthService	Local bcrypt-12 sign-up / sign-in	_repo	register(), login()	–	↣ CredentialStore	MVP	service	FR-0105
S-06	ProUpgradeService	Hit local stripe-mock and flip isPro	_store	checkoutMock()	–	↣ UserCredential, stripe-mock	MVP	service	FR-0108
R-01	QuoteRepository	24 h cached access to quotes & series	_svc	headline(), series(sym)	–	↣ MarketstackService (1)	MVP	repo	FR-0101‒0103
R-02	PortfolioRepository	CRUD holdings, hourly totals	_store, _quoteRepo	add(), list(), remove(), refreshTotals()	–	↣ PortfolioHolding, QuoteRepository	MVP	repo	FR-0106
R-03	CredentialStore	AES-256 blob persistence for credentials	_kvStore	save(), find()	–	↣ UserCredential	MVP	repo	FR-0105
VM-01	AppStateNotifier	Single Riverpod store for 6 screens	state	loadHeadline(), toggleCurrency(), search(), upgradePro()	StateNotifier	↣ QuoteRepository, FxService, NewsService, AuthService, ProUpgradeService, SymbolTrie	MVP	vm.mobile	PF-001‒012
VM-02	Store	Pinia / Redux web mirror of VM-01	state	same ops (JS)	Pinia / Redux	↣ same as VM-01	MVP	vm.web	PF-001‒012
SD-09	WatchListItem	Cloud-synced holding row	id, symbol, note, syncTs	–	–	–	OPT-Later	domain.shared	WF-13
S-07	WatchListSyncService	Supabase CRUD (500 MB free)	–	syncUpload(), fetchRemote()	–	↣ Supabase REST	OPT-Later	service	LIM-0017
SD-10	CartItem	Server cart line for Stripe test	–	–	–	–	OPT-Later	domain.shared	WF-14
S-08	CartService	Netlify Edge Fn + Stripe test flow	–	createSession(), confirm()	–	↣ Edge Fn, Stripe API	OPT-Later	service	LIM-0017
† Attrs listed are those relevant to free-tier ceilings, security or exam acceptance. All numeric limits (≤ 100 calls·mo⁻¹ etc.) are enforced through ApiQuotaLedger, satisfying LIM-0003/4/5.
PK / index strategy
Primary key ⇒ Class_ID (short, immutable).
Composite index ⇒ (status , owner) – lets a SCRUM board query “all OPT-Later classes owned by Frontend-Team”.

3.2.4.2 Component-interaction table
PK / index strategy
Primary key ⇒ CMP_ID (mirrors the IDs already used in § 3.2.1).
Secondary indexes:
• (status , owner) – sprint filter.
• (provided_if) and (required_if) – quick join with the interface register.
3.2.4.2 Component-interaction table — SMWA v 1.1 (exam build – updated)
CMP-ID ✱	Provided IF (+ ver)	Required IF (+ ver)	Call-budget / free-tier quota	Sync / Async	Critical NFRs (p95 unless noted)	Lifecycle owner / team	Trace-reqs	Status
CMP-UI-M	UI-01 v1 (Flutter mobile UI)	VM-M v1	n/a – local calls only	Sync	Frame ≤ 16 ms (LIM-0008) • heap ≤ 150 MB	Mobile FE	FR-0101-0112, PR-0007, LIM-0008/0010	MVP
CMP-UI-W	UI-02 v1 (PWA web UI)	VM-W v1	n/a	Sync	LCP ≤ 2.5 s (p75) • CLS < 0.10 (LIM-0009)	Web FE	FR-0101-0112, PR-0005/0006, LIM-0009	MVP
CMP-VM-M	AppState Notifier v1	Repo-, Svc-	≤ 3 Marketstack calls·d⁻¹ • ≤ 1 FX call·d⁻¹ • ≤ 200 News calls·d⁻¹	Async futures	Headline FCP ≤ 3 s • FX-toggle ≤ 2 s	Mobile FE	FR-0101-0108, 0112; PR-0001/0009	MVP
CMP-VM-W	Pinia / Redux Store v1	Repo-, Svc-	≤ 3 Marketstack calls·d⁻¹ • ≤ 1 FX call·d⁻¹ • ≤ 200 News calls·d⁻¹	Async promises	Same perf as mobile; LCP ≤ 2.5 s	Web FE	Same as CMP-VM-M + PR-0005/0006	MVP
CMP-Repo-Quote	Repo-Quote v1	IF-0120 (Marketstack /eod) via Svc-MS	≤ 100 calls·mo⁻¹ (LIM-0003) • cache-hit ≥ 95 %	Sync	TTFB ≤ 200 ms • abs-error ≤ 0.005 % × quote	BE wrapper	FR-0101-0103; PR-0001; LIM-0003	MVP
CMP-Repo-Portfolio	Repo-Portfolio v1	Repo-Quote v1	0 extra external calls (re-uses cache)	Sync	Add-success ≥ 95 % • Σ-error ≤ 0.01	BE wrapper	FR-0106; UR-0005	MVP
CMP-Repo-News	Repo-News v1	IF-0122 (NewsData) via Svc-News	≤ 200 calls·day⁻¹ & 30 credits / 15 min (LIM-0016)	Sync	1st headline ≤ 500 ms	BE wrapper	FR-0104; PR-0001; LIM-0016	MVP
CMP-Repo-Cred	CredentialStore v1	Local KV (IndexedDB / SharedPrefs)	n/a (on-device)	Sync	bcrypt-12 ≤ 300 ms • AES-256 blob	Security / Mobile FE	FR-0105; LIM-0001/0002	MVP
CMP-Svc-MS	SI-01 MarketstackService v1	IF-0120 /v1/eod	≤ 100 req·month⁻¹ (Free plan)	Sync REST	TTFB ≤ 200 ms • cache-hit ≥ 95 %	Back-end svc	FR-0101-0103; PR-0001; LIM-0003	MVP
CMP-Svc-FX	FxService v1	IF-0121 /latest	≤ 100 req·month⁻¹	Sync REST	TTFB ≤ 250 ms • toggle ≤ 2 s	Back-end svc	FR-0107; UR-0009; LIM-0004	MVP
CMP-Svc-News	NewsService v1	IF-0122 (NewsData) → IF-0130 (RSS fallback)	≤ 200 req·day⁻¹ • 30 credits / 15 min	Sync REST	Headline ≤ 500 ms • fallback ≤ 1 s	Back-end svc	FR-0104; LIM-0016; AD-D12	MVP
CMP-Svc-Loc	LocationService v1	IF-0124 (GPS) ∥ IF-0133 (HTML5 Geo)	1 call / launch	Async	Country code ≤ 0.75 s	Mobile FE	FR-0109; PR-0008; LIM-0008	MVP
CMP-Svc-Auth	AuthService v1	CredentialStore v1	n/a	Sync	Register ≤ 90 s • 12 hash rounds	Security FE	FR-0105; UR-0006	MVP
CMP-Svc-Pro	ProUpgradeService v1	IF-0129 (stripe-mock v0.186)	Localhost – unlimited	Sync	Checkout RTT ≤ 4 s • SEQ ≥ 6 / 7	Mobile FE	FR-0108; UR-0007; AD-D11	MVP
CMP-CI-Netlify	CI pipeline v1	IF-0131 (GitHub REST) → IF-0123 (Netlify build-hook)	≤ 300 build-min·mo⁻¹ • ≤ 10 triggers·day⁻¹	Async jobs	Build ≤ 4 min • Lighthouse ≥ 90 / 100	DevOps	FR-0110; UR-0002; LIM-0007	MVP
CMP-Host-Netlify	Static CDN (PWA) v1	—	≤ 100 GB BW·mo⁻¹ (Free)	Async HTTP	Uptime ≥ 99 % mo⁻¹ • LCP ≤ 2.5 s	DevOps	LIM-0007; PR-0003; IF-0123	MVP
CMP-Svc-Supabase	WatchListSyncService v1	IF-0134 /Supabase REST	self-cap ≤ 5 000 calls·mo⁻¹ (500 MB DB)	Async REST	TTFB ≤ 300 ms	Back-end svc	WF-13; DS-09; LIM-0017	OPT-Later
CMP-Edge-Fn	Netlify Edge Fn /api/cart v1	IF-0137 (Stripe test API)	≤ 1 M inv·mo⁻¹, 128 MB RAM • Stripe test ≤ 25 req·s⁻¹	Async REST	Cold-start ≤ 300 ms • RTT ≤ 400 ms	Back-end svc	WF-14; LIM-0017	OPT-Later
Legend (abbrev.): TTFB – Time-to-First-Byte • FCP – First Contentful Paint • LCP – Largest Contentful Paint • CLS – Cumulative Layout Shift
Notes
•	Quotas and latency targets are lifted exactly from the SRS (§ 9.6.7 Limitations, § 9.6.14 Performance).
•	Internal utility components (LruCache, SymbolTrie, ApiQuotaLedger, …) are entirely in-process and expose no system-level interface, so they remain outside this table.
•	“Sync” = blocking call in the same thread / event-loop; “Async” = promise/future or detached job.
•	All MVP rows are mandatory for the three-week demo; OPT-Later rows are feature-flagged off (backendMode = "local").


3.2.4.2 Algorithm / flow specification table
PK / index strategy
Primary key ⇒ Flow_ID (use FR-ID or WF-ID).
Secondary indexes:
• (log_tag) – enables log-grep by flow.
• (status) – hide deferred flows in the test dashboard.
3.2.4.2 Algorithm / flow-specification table — SMWA v 1.1 (updated)
(All IDs, limits and metrics are copied verbatim from the SRS.
“B…” references denote the branch / error codes that are written to the flowTag column in the structured logs.)
PK / index strategy
•	Primary-key ⇒ Flow ID (always an FR-ID or WF-ID).
•	Secondary indexes ⇒
o	(log_tag) – enables grep-by-flow in CI dashboards.
o	(status) – hides every OPT-Later row (currently 4 rows: FR-0113, WF-13, WF-14, WF-15).*
Flow ID ✱	Preconditions / invariants	# / Step (action)	Branch / error ref.	Post-conditions	Worst-case p95 / Big-O	flowTag (in logs)	Status
FR-0101 — Display headline index	• countryCode cached (WF-08)• 24 h LRU may contain the index quote	1 Read cache → B1 if hit2 Miss → GET Marketstack /eod (1 req · d-¹ ≪ 100 mo-¹ cap)3 Compute Δ % and dual cues ▲/▼4 Render widget	B1 = CacheHitB2 = HTTP 429/4xx → show stale-badge, skip step 2	Widget shows value + Δ % + ISO-8601 ts;payload cached ≤ 24 h	≤ 3 s FCP and CLS < 0.10 (PR-0005/0006) • O(1)	IDX_HDR	MVP
FR-0102 — Draw OHLC chart	• Symbol selected; range ∈ {1 d, 1 m, 3 m, 1 y}• Series may already be in cache	1 Read cache2 Miss → GET /eod?symbols={sym}3 Down-sample ≤ 350 pts4 Render with fl_chart (mobile) / Chart.js (web)	B1 = RangeChange (no network)B2 = NetworkErr → toast & reuse last series	Interactive chart visible, fps ≥ 60 (mobile)	Mobile frame ≤ 16 ms (LIM-0008) • Web LCP ≤ 2.5 s (p75) (PR-0005) • O(n) with n ≤ 350	IDX_CHART	MVP
FR-0103 — List gainers / losers	• FR-0101 complete; constituents in cache (≤ 50 symbols)	1 Compute Δ % per constituent2 Sort desc / asc3 Slice top 5 ▲ and top 5 ▼4 Render two colour-safe lists	B1 = OkB2 = CacheStale → show stale-label	Two 5-item lists visible; tap opens FR-0102	Refresh ≤ 5 s • O(n log n) with n ≤ 50	IDX_TOP5	MVP
FR-0104 — Fetch news digest	• Equity / index in focus	1 Read 12 h cache2 Miss → GET NewsData.io (≤ 200 d-¹)3 4xx / quota-hit → B2 RSS fallback4 Take 3 newest; render cards	B1 = OkB2 = FallbackRSSB3 = BothFeedsFail → empty panel	≥ 3 headlines shown (or graceful empty)	≤ 500 ms first headline (PR-0001) • O(1)	NEWS_DIGEST	MVP
FR-0105 — Register / sign-in	• User not registered• Local storage writable	1 Validate e-mail & pwd2 bcrypt-12 hash (~300 ms p95)3 AES-256-GCM encrypt → IndexedDB4 Set isRegistered=true, nav dashboard	B1 = BadInput → inline errB2 = ≥ 3 fails → 30 s lock	Credentials stored, dashboard loaded	≤ 90 s end-to-end (UR-0006) • O(1)	AUTH_REG	MVP
FR-0106 — Add holding	• User registered	1 Client validation {sym, qty, price}2 Persist row (≤ 5 kB)3 Emit AddHolding event (hourly total refresh scheduled)	B1 = BadQtyPrice → toast	New row in portfolio; totals refresh top-of-hour	Add-success ≥ 95 % (UR-0005) • O(1)	PORT_ADD	MVP
FR-0107 — Toggle currency	• Any screen showing monetary values	1 Check 24 h FX cache2 Stale → GET exchangerate.host /latest (≤ 1 d-¹)3 Re-render UI	B1 = CacheHitB2 = HTTP 5xx → keep last-good rate	All prices rendered in new currency	Round-trip ≤ 2 s (UR-0009) • O(m) with m = formatted fields	CUR_TGL	MVP
FR-0108 — Unlock Pro (mock)	• User registered• stripe-mock at localhost:12111 reachable	1 Open checkout URL2 Success callback → set isPro=true, persist3 Show Snackbar & badge	B1 = SuccessB2 = CancelB3 = NetworkErr → retry-link	Pro-flag true; UI shows “Pro unlocked”	Checkout RTT ≤ 4 s • SEQ median ≥ 6 / 7 (UR-0007) • O(1)	PRO_UPG	MVP
FR-0109 — Acquire location	• No countryCode stored	1 Request GPS / Geo permission2 Success → lat/lon → ISO-3166 code3 Store in CountrySetting	B1 = Denied / Timeout → manual selector	countryCode persisted; downstream flows unblocked	≤ 0.75 s p95 (PR-0008) • O(1)	GEO_INIT	MVP
FR-0110 — CI auto-deploy	• Push on main branch	1 GitHub Action spins2 Run unit + widget tests3 POST Netlify build-hook (counts towards 300 build-min · mo-¹)4 Lighthouse ≥ 90 / 100 → B1, else B2	B1 = GreenDeployB2 = PerfFail → build red	Preview URL attached to PR; Slack notice	Netlify build ≤ 4 min p95 • O(1)	CI_BUILD	MVP
FR-0111 — “View on Web”	• Company chart already rendered	1 Open TradingView script (CDN 99.9 % SLA)2 Inject symbol into WebView	B1 = CDN200B2 = CDN404 → load cached PNG	Chart visible inside WebView	Load ≤ 2 s p95 (UR-0011) • O(1)	WEB_CHART	MVP
FR-0112 — Global search	• User types ≥ 3 chars	1 SymbolTrie.search(term) (≤ 10 k nodes)2 Rank Levenshtein, show list3 Select → trigger FR-0102	B1 = NoMatch → empty list	Suggestions in ≤ 1 s; chart opens on pick	≤ 1 s p95 (UR-0008) • O(k + m) (trie)	SRCH_GBL	MVP
FR-0113 — Key-ratios table	• Company-detail screen open	1 Attempt fundamentals fetch (API not in free tier)2 Fail → B1 placeholder	B1 = Deferred	Placeholder “Data not available” row shown	O(1)	KEY_RATIO	OPT-Later
FR-0114 — Rotation-safe assets	• Build artefact produced or device orientation change	1 CI asset-lint / run-time flip × 202 Pass → B13 Fail → B2 placeholder asset	B1 = AssetsOKB2 = Overflow → default icon	Launcher icon visible; no overflow on rotate	20 flips ≤ 3 s total • O(1)	ASSET_ROT	MVP
WF-13 — Sync watch-list (cloud)	• backendMode = remote• User online	1 Detect local CRUD event2 POST /watchlist (Supabase ≤ 5 000 mo-¹)3 200 OK → merge etag	B1 = 409 Conflict → last-write-winsB2 = Offline → queue	Remote DB ↔ device in-sync; local _syncTs updated	TTFB ≤ 300 ms • O(#items)	WL_SYNC	OPT-Later
WF-14 — Server checkout	• backendMode = remote• User Pro-candidate	1 POST /api/cart (Netlify Edge Fn, cold-start ≤ 300 ms)2 Redirect to Stripe test3 Webhook sets isPro=true	B1 = PaidB2 = CancelB3 = EdgeErr → retry	Cloud flag true; device flag flips on next sync	Stripe RTT ≤ 400 ms • O(1)	CART_SRV	OPT-Later
WF-15 — Publish news article	• Admin authenticated• backendMode = remote	1 Fill CMS form2 POST /api/admin/news (Supabase)3 SSE invalidate:news	B1 = SavedB2 = ValidationErr	Article stored; clients refresh on next digest pull	TTFB ≤ 300 ms • O(1)	CMS_PUB	OPT-Later
Sources
• All limits, quotas and p95 targets are taken from the approved SRS: § 9.6.7 (LIM-0003…0017), § 9.6.14 (PR-0001…0008) and usability goals § 9.6.6 (UR-0001…0012).
• Branch / error codes map 1 : 1 to the Verification Matrix (§ 9.6.19) so every path is demonstrably testable.


3.2.5 UI/UX
3.2.5.2 Cross-Platform Style Tokens (v0 . 1 – placeholder)
The table below fixes provisional names/IDs so coders can reference variables today.
A full palette and typography scale will be supplied when the visual-design sprint concludes (see backlog item DES-014). All UI code must use the IDs, never raw hex/rgb strings.
Token ID	Value (Hex unless noted)	Usage guideline
clr-primary-700	#0F3BD9	Brand blue – focus ring / selected tab
clr-primary-600	#1552FF	Brand blue – main CTA buttons / links
clr-primary-500	#3A6BFF	Hover / pressed state
clr-primary-050	#E8EEFF	Extra-light background tint
clr-gain-500	#148A00	Positive delta ▲ (AA on #FFFFFF)
clr-loss-500	#D92D20	Negative delta ▼ (AA on #FFFFFF)
clr-error-500	#D92D20	Form-error highlight – shares hue with loss
clr-neutral-900	#1A1A1A	Primary text on light surfaces
clr-neutral-700	#4D4D4D	Secondary text / captions
clr-neutral-050	#FAFAFA	Default app background
clr-surface-elev-1	#FFFFFF	Card / sheet background, elevation 1 dp
clr-surface-elev-2	rgba(244, 246, 255, 0.96)	Overlay @ 2 dp (4 % brand-tint veil)
rad-sm	4 px	Button & small-card radius
rad-lg	12 px	Dialog / sheet radius
elev-1	0 2 4 0 rgba(0, 0, 0, 0.04)	Flutter BoxShadow / Bootstrap shadow-sm
elev-2	0 4 8 0 rgba(0, 0, 0, 0.06)	Default card / nav-rail shadow
space-grid-1	4 px	Micro-spacing (icon padding, divider gaps)
space-grid-2	8 px	Base spacing unit – every multiple derives from it
space-grid-3	12 px	Compact vertical rhythm
space-grid-4	16 px	Default component gutter
space-grid-6	24 px	Section padding / lg. breakpoint gutter
font-display	Inter 700	H1–H3 headings
font-body	Inter 400	Body copy & table cells
font-mono	JetBrains Mono 400	Code snippets / data labels
dur-swift	120 ms	Button hover / press ripple
dur-normal	240 ms	Navigation transition


3.2.5.3 Screen-element Matrix
Screen / Page	Required element (orig. brief + SRS)	Element-ID	In mobile app?	In web app?	Notes / link to SRS-ID (or assignment §)	Status
Main	Headline index widget	el-idx-headline	✓	✓	FR-0101 • PF-001	MVP
	Top-5 gainers / losers list	el-idx-top5	✓	✓	FR-0103 • WF-03	MVP
	3-way currency toggle (EUR / USD / local)	el-currency-toggle	✓	✓	FR-0107 • PF-007	MVP
	Global search bar + autocomplete	el-global-search	✓	✓	FR-0112 • PF-012	MVP
News + Prices	News digest panel	el-news-digest	✓	✓	FR-0104 • WF-04	MVP
	Snapshot table “hot stocks”	el-snapshot-tbl	✓	✓	brief § 3 (web) / § 1 (mobile)	MVP
Company Detail	Interactive OHLC chart (1 d / 1 m / 3 m / 1 y)	el-chart-ohlc	✓	✓	FR-0102 • PF-002	MVP
	Company-specific news panel	el-company-news	✓	✓	FR-0104 • same feed, filtered	MVP
	“View on Web” button → TradingView	el-viewweb-btn	✓	✗	FR-0111 • PF-011	MVP
	Key-ratios table (PE, EPS …)	el-key-ratios	✗	✗	FR-0113 (data not on free plan)	OPT-Later
Registration / Sign-in	E-mail input	el-auth-email	✓	✓	FR-0105 • UC-05	MVP
	Password input	el-auth-pwd	✓	✓	FR-0105	MVP
	Submit button (register / login)	el-auth-submit	✓	✓	FR-0105	MVP
	Inline / toast error message	el-auth-err	✓	✓	FR-0105 (“BadInput”, “≥ 3 fails”)	MVP
Portfolio	Holdings data-table	el-pf-table	✓	✓	FR-0106 • WF-06	MVP
	“Add holding” dialog / FAB	el-pf-add	✓	✓	FR-0106	MVP
	Total market-value summary	el-pf-total	✓	✓	FR-0106	MVP
	Cloud watch-list sync toggle	el-watch-sync	✓	✓	WF-13 • UC-15	OPT-Later
Pro Upgrade	Mock-checkout CTA button	el-pro-cta	✓	✓	FR-0108 • WF-12	MVP
	“Pro” status badge	el-pro-badge	✓	✓	FR-0108	MVP
	Server-checkout cart panel	el-cart-panel	✓	✓	WF-14 • UC-16	OPT-Later
Admin CMS (editor-only)	News-editor form	el-admin-editor	✗	✓	WF-15 • UC-17	OPT-Later
First-run overlay	Geolocation permission dialog	el-geo-permission	✓	✓	FR-0109 • WF-08	MVP
Global UI	App / Navigation bar (6 routes)	el-nav-bar	✓	✓	assignment § 1 / § 3 “navigation between pages”	MVP
	Launcher icon (unique app icon)	el-launcher-icon	✓	✓	FR-0114 • assignment “unique launcher icon”	MVP
	Rotation-safe hero image (assets test)	el-splash-hero	✓	✓	FR-0114 • assignment “at least 1 asset scales on rotation”	MVP
	Light⁄dark-mode toggle	el-theme-toggle	✓	✓	Optional feature (assignment § 4)	OPT-Later

3.2.5.4 T-3 Widget / Component Hierarchy
Screen / Route	Flutter widget tree†	Web component tree	Status
Main	Scaffold → AppBar → Column 
• GlobalSearchBar (el-global-search) 
• HeadlineIndexCard (el-idx-headline) 
• TopMoversList (el-idx-top5) 
• CurrencyToggle (el-currency-toggle)	MainLayout
•	NavBar
•	GlobalSearch id="el-global-search"
•	HeadlineCard id="el-idx-headline"
•	TopMovers id="el-idx-top5"
•	CurrencyToggle id="el-currency-toggle"	MVP
News + Prices	Scaffold → AppBar → Column 
• NewsDigestPanel (el-news-digest) 
• SnapshotTable (el-snapshot-tbl)	NewsPage
•	NavBar
•	NewsDigest id="el-news-digest"
•	SnapshotTable id="el-snapshot-tbl"	MVP
Company Detail	Scaffold → AppBar → SingleChildScrollView → Column 
• CompanyChart (el-chart-ohlc) 
• CompanyNewsPanel (el-company-news)
• KeyRatiosTable (el-key-ratios) 
• ViewOnWebButton (el-viewweb-btn)	DetailPage
•	NavBar
•	ChartOhlc id="el-chart-ohlc"
•	CompanyNews id="el-company-news"
•	KeyRatiosTable id="el-key-ratios" <!-- OPT-Later -->
•	ViewOnWebBtn id="el-viewweb-btn"	MVP
Registration / Sign-in	Scaffold → AppBar → Column 
• EmailInput (el-auth-email) 
• PasswordInput (el-auth-pwd) 
• SubmitButton (el-auth-submit) 
• ErrorText (el-auth-err)	AuthPage
•	NavBar
•	EmailField id="el-auth-email"
•	PasswordField id="el-auth-pwd"
•	SubmitBtn id="el-auth-submit"
•	InlineErr id="el-auth-err"	MVP
Portfolio	Scaffold → AppBar → Column 
• PortfolioTable (el-pf-table) 
• AddHoldingFab (el-pf-add) 
• TotalMarketValue (el-pf-total) 
• CloudSyncToggle (el-watch-sync) 	PortfolioPage
•	NavBar
•	HoldingsTable id="el-pf-table"
•	AddHoldingBtn id="el-pf-add"
•	PortfolioTotal id="el-pf-total"
•	SyncToggle id="el-watch-sync" <!-- OPT-Later -->	MVP
Pro Upgrade	Scaffold → AppBar → Column 
• ProCtaButton (el-pro-cta) 
• ProBadge (el-pro-badge) 
• CartPanel (el-cart-panel) 	ProPage
•	NavBar
•	ProCta id="el-pro-cta"
•	ProBadge id="el-pro-badge"
•	CartPanel id="el-cart-panel" <!-- OPT-Later -->	MVP
Admin CMS (editor-only)	Scaffold → AppBar → AdminNewsForm (el-admin-editor)	AdminPage
•	NavBar
•	NewsEditor id="el-admin-editor"	OPT-Later
† Indentation depth = 1 per “→” level. el-… IDs map to the element register in § 3.2.5.3 and trace straight back to the functional requirements in the SRS (e.g., el-global-search ⇢ FR-0112). Nodes tagged OPT-Later are optional extensions that stay outside the three-week MVP scope but show the upgrade path.


§ 3.2.6 Kick-off Matrix for MVP
Gor – mobile app Dev A, Roman – web app Dev B.
#	Sub-system / artefact	What to do (plain English, little jargon)	Primary caretaker	Must-have tools ⇢ version	Repo / pkg root†	One-liner to run after a fresh clone*(∗ adjust later if scaffolding changes)	First green test file	Skeleton entry-point (opens IDE)	Widget / component root	Related CMP / FR IDs	Status
0	Start shared-contracts repoempty spec + data-shape folders	• Create an empty Git repo, add a README.• Add empty /spec and /schema folders, commit and push to main so others can pull.	Dev A (day 1)	git ≥ 2.38  •  Node 20	github.com/your-org/shared-contracts	npm init -y && mkdir spec schema && git add . && git commit -m "kick-off" && git push -u origin main	–	–	–	feeds rows 1 & 2	MVP
1	openapi.yaml bundleMarketstack + Exchangerate.host + NewsData	• Inside /spec add openapi.yaml that combines the three public files.• Add an npm script gen:all that runs openapi-generator-cli 7.13.0 and drops code into /generated (npm pkg set scripts.gen:all="openapi-generator-cli generate -i openapi.yaml -g typescript-axios -o generated").• Run npx @redocly/openapi-cli lint until it reports 0 problems.	Dev A	openapi-generator-cli 7.13.0	shared-contracts /spec	npm run gen:all	spec/openapi.spec.test.ts	–	–	S-01 / S-02 / S-03	MVP
2	Shared JSON-shape files(QuoteModel, OhlcSeries, NewsArticle, FxRate, PortfolioHolding, CountrySetting, ApiQuotaLedger, UserCredential)	• In /schema add eight <Model>.schema.json files—one per model.• Next to each file add a tiny sample <Model>.example.json.• Add index.ts that re-exports them all (import * as QuoteModel from './QuoteModel.schema.json', …).• A Jest test loops over every shape, loads its sample, runs jsonschema 1.5 and expects the result to be valid.	Dev A + Dev B	jsonschema 1.5	shared-contracts /schema	npm t	schema/quote.test.ts	–	–	SD-01…08	MVP
3	Design-tokens “single source of truth”tokens.scss + tokens.dart	• Create tokens.json with all colour, spacing and font tokens from § 3.2.5.2.• Add a style-dictionary setup that builds • build/css/tokens.scss like --clr-primary-700:#0F3BD9; • build/dart/tokens.dart like const clrPrimary700 = Color(0xFF0F3BD9);• npm run build should recreate both files.• A test checks that token clr-primary-700 exists in both outputs.	Dev B	style-dictionary 4.0	web-app /design-tokens	npm run build	tests/tokens.test.js	–	used via CSS vars / Dart const	UI-tokens table	MVP
4	Dart package smwa_services(Marketstack, Fx, News, Location, Auth, Pro-upgrade)	• Under mobile-app/packages/services/lib make six files: marketstack_service.dart … pro_upgrade_service.dart.• Each file holds a class stub with the public methods named in the design doc.• Re-export them from lib/services.dart.• Wire in LruCache (in-memory cache) and ApiQuotaLedger once the schemas compile.• Make test/marketstack_service_test.dart pass by returning a hard-coded fake quote.	Dev A	Flutter 3.22 • Dart 3.4	mobile-app /packages/services	git submodule update --init --remote ../../shared-contracts && melos bootstrap && flutter test	test/marketstack_service_test.dart	lib/services.dart	–	CMP-Svc-*	MVP
5	TypeScript package smwa-js-services(same six services)	• Under web-app/packages/services/src create six mirrors: MarketstackService.ts … ProUpgradeService.ts.• Keep the same method names and return shapes as the Dart code.• Export all from src/index.ts.• Wire in LruCache (in-memory cache) and ApiQuotaLedger once the schemas compile.• Jest tests in __tests__/… copy the assertions from the Dart tests.	Dev B	Node 20 • tsc 5.5	web-app /packages/services	git submodule update --init --remote ../../shared-contracts && npm i && npm t	src/marketstackService.spec.ts	src/index.ts	–	CMP-Svc-*	MVP
6	Flutter mobile UI (6 screens)Main, News, Detail, Auth, Portfolio, Pro	• Inside mobile-app/app/lib/screens add six folders: main/, news/, detail/, auth/, portfolio/, pro/.• Each holds a …_screen.dart stub widget.• Connect screens to AppStateNotifier with Riverpod 3 (state-management lib).• Create lib/widgets/headline_card.dart and keep its unit test green.	Dev A	Flutter 3.22 • Riverpod 3	mobile-app /app	flutter run	test/widget/headline_card_test.dart	lib/main.dart	lib/widgets	CMP-UI-M + VM-M	MVP
7	PWA web UI (6 pages)Main, News, Detail, Auth, Portfolio, Pro	• In web-app/pwa/src/components make: MainPage.vue, NewsPage.vue, DetailPage.vue, AuthPage.vue, PortfolioPage.vue, ProPage.vue.• Use Bootstrap 5 classes and Chart.js where needed.• Add the pages to src/router.ts and hook them to the Pinia store (state-management lib).• Write HeadlineCard.vue; its Jest test must pass.	Dev B	Node 20 • Vite 5 • Vue 3.4	web-app /pwa	npm run dev	src/components/__tests__/HeadlineCard.spec.ts	src/main.ts	src/components	CMP-UI-W + VM-W	MVP
8	CI & Netlify pipelineunit ⇒ build ⇒ Lighthouse	• Add .github/workflows/ci.yml that 1. runs npm ci in /pwa and /packages/services, then npm t. 2. calls the Netlify build hook (env var NETLIFY_HOOK_URL). 3. runs npx lhci autorun on the preview URL and fails the job if Lighthouse Performance or Accessibility score is < 90 (Core Web Vitals gate).• Keep total under 300 build-minutes / month.	Dev B	GitHub Actions • Netlify-CLI 17	web-app /.github/workflows	(push-triggered)	.github/workflows/ci.yml	–	–	CMP-CI-Netlify	MVP
9	(optional) Mobile-only CI smoke	• Add .github/workflows/flutter_test.yml that just runs flutter test on every pull-request.• No build or deploy; fail fast if tests turn red.	Dev A	GitHub Actions • Flutter 3.22	mobile-app /.github/workflows	(push-triggered)	.github/workflows/flutter_test.yml	–	–	CMP-CI-Mobile	opt

