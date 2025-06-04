ISO/IEC/IEEE 29148-2018
9.6.1 SRS overview
#	Clause (§ 9.6.x)	Essential SRS content (normative headline)	What it is for	Sequence *(authoring order)	Depends on / pre-requisites
1	9.6.1 SRS overview	States this is the baseline SRS and explains its trimmed layout	Helps readers navigate	17	all other clauses complete
2	9.6.2 Purpose	Why the software is needed and who benefits	Gives project context	2	—
3	9.6.3 Scope	What the product will & won’t do (system boundary)	Prevents gold-plating	3	9.6.2
4	9.6.4 Product perspective	Context diagram + list of external actors/APIs	Shows environment fit	4	9.6.3
5	9.6.5 Product functions	5-8 top-level features (PF-xxx)	Anchor IDs for FRs	8	9.6.3, 9.6.7, 9.6.8
6	9.6.6 Users & usability goals(merged 9.6.6 + 9.6.13)	2-3 personas plus measurable UX targets	Grounds quality numbers	5	9.6.4
7	9.6.7 Limitations	Bullet list of hard constraints (VM spec, free tier, policy)	Blocks infeasible reqs	6	9.6.4
8	9.6.8 Assumptions & dependencies	3-5 key externals that must stay true	Keeps risk visible	7	9.6.4 – 9.6.7
9	9.6.11 External interfaces	6-column table: one row per API/UI screen	Formal I/O for dev & test	10	9.6.4
10	9.6.12 Functional requirements	≈ 20 atomic FRs (inputs → processing → outputs)	Core spec to grade	11	9.6.5, 9.6.11
11	9.6.14 Performance requirements	2-3 quantified metrics (latency, RAM, TPS)	Shows NFR fitness	12	9.6.7, 9.6.8, 9.6.12
12	9.6.16 Design constraints	Bullet list of mandated tech / legal limits	Locks non-negotiables	9	9.6.7
13	9.6.18 Software system attributes	4-5 other NFRs (reliability, security, portability …)	Completes quality picture	13	9.6.6, 9.6.14
14	9.6.19 Verification	Matrix mapping every FR/NFR → demo or unit-test	Explains proof path	14	9.6.12, 9.6.14, 9.6.18
16	9.6.26 Packaging & deployment spec	Paragraph with Docker image tag / install artefact	Lets examiner reproduce build	15	9.6.19

 
9.6.2 Purpose
The Stock-Market Mobile & Web Application (SMWA) is being developed to satisfy two complementary needs. First, retail investors increasingly expect real-time, location-aware market data on any device: mobile phones already account for 68.62 % of global web traffic (April 2025) Similarweb, and Germany—the initial launch market—records a 77.9 % smartphone-penetration rate (2024) Wikipedia. Second, SMWA functions as the capstone artefact for the Frontend Programming and IT Agile course, enabling the five-member student team to demonstrate the complete cycle of requirements analysis, SCRUM delivery, and in-class defence mandated by the final-exam brief. Primary beneficiaries are (a) retail investors, who gain free, locale-specific insights; (b) the student developers, who obtain portfolio-grade experience; and (c) faculty examiners, who receive a single, reproducible system for assessment.

SMWA deliberately limits itself to **official end-of-day (EoD)** quotes supplied by the Marketstack **Free Plan** (≤ 100 API calls · month-¹, EoD only).  A timestamp in  ISO 8601 format is rendered beside every quote so users and examiners can judge data freshness.  An upgrade path to intraday data (Marketstack Basic Plan) is documented for post-exam versions.
 
9.6.3 Scope
a) Product identification
This specification applies to Stock-Market Mobile & Web Application (SMWA) v 1.1, comprising
•	Mobile App — Flutter 3.22.0 for Android 13 + , exposing six user-facing screens (main, news + prices, company-detail, auth, portfolio, pro-upgrade)
•	Web App — responsive Progressive Web App (PWA) with the same six pages, built with Bootstrap 5 and Chart.js 4.x, deployed on Netlify free tier
For the MVP, the mobile (Flutter) and web (PWA) front-ends implement all core functionality entirely on-device, calling only the public read-only data APIs; a shared REST back-end is enabled later (when backendMode = remote) to support optional features such as cloud watch-list sync, server-side checkout and the editor CMS..

b) In-scope capabilities
ID	Capability	Notes
SCP 01	Headline index display (EoD)	Shows the most recent official closing price of the location-specific index (e.g., DAX 40 in Germany). A timestamp in ISO 8601 format (e.g., 2025-05-27T22:05:00+02:00) is rendered beside the quote. Quotes may be up to ≈ 15 h behind live trading depending on the market’s time-zone.
SCP 02	Interactive OHLC chart with selectable ranges (1 d / 1 m / 3 m / 1 y) for any listed equity	Rendered with fl_chart (mobile) or Chart.js 4.x (web).
SCP 03	Colour-coded snapshot list of top gainers / losers	Tap / click opens SCP 02. Green ↑ and red ↓ reflect Δ vs. previous close.
SCP 04	News-digest panel (RSS)	Filtered by the equity or index in focus.
SCP 05	User registration / sign-in	E-mail + password with client-side validation.
SCP 06	Local portfolio tracker	Add / remove tickers; holdings table auto-re-totals hourly.
SCP 07	Currency toggle	EUR ↔ USD ↔ local; FX data cached for 15 min.
SCP 08	“Go Pro” pay-wall page	Mock Stripe checkout; flips isPro flag for demo.
SCP 09	Geolocation	GPS on mobile, HTML5 Geolocation API in browsers; graceful fallback prompt.
SCP 10	Public web build auto-deployed	Triggered on every main-branch push (Netlify CI).
SCP 11	“View on Web” action	Opens an external detailed-chart page (e.g., TradingView) inside an in-app WebView from the mobile company-detail screen.
SCP 12	Global search	Filter companies or country indices by name and time-range directly from the main page of both apps.
SCP 13	Key-ratios data table	Company-detail screen (mobile & web) displays a responsive five-column table (metric, TTM, 1-year-ago, Δ %, industry avg.) for PE, EPS, dividend yield, market-cap and β. Implemented with Flutter DataTable and a Bootstrap 5 <table> element.
Out of scope (v 1.1). Derivative or crypto instruments; live order execution; machine-learning price prediction; push notifications; voice control; dark/light theme; persistent local-database watch-list; full shopping-cart / checkout; editor CMS for news.

c) Distinguishing attributes
•	Location-aware: first-run geolocation resolves ISO 3166 country code in ≤ 750 ms (p95).
•	Dual-platform single code-base: shared DTOs, colour tokens and typography across Flutter and Bootstrap 5.
•	Accessible by design: colour palette meets WCAG 2.1 AA contrast (≥ 4.5 ∶ 1) via Material 3 colour-scheme builder; supports dynamic text-scaling.
•	Charting-stack compliant: fl_chart (Flutter) and Chart.js 4.x (PWA) satisfy the tooling constraint of the exam brief.
•	Free-tier data budgeted: Marketstack Free Plan (≤ 100 API calls · month⁻¹, EoD-only endpoint); caching layer targets ≥ 95 % hit ratio to stay within quota.
•	Persistent App Bar: every mobile screen includes AppBar(title: Text(...)) for consistent navigation.
•	Rotation-safe media & unique launcher icon: raster assets supplied in 1× / 2× / 3× densities; no overflow or skew on orientation change; custom launcher icon delivered for Android  asset catalogues.
•	Pedagogical artefact: delivers all mandatory documents (SRS, architecture diagrams, test reports, slide deck) required for the UE Applied Sciences final exam.

d) Intended use
Retail investors and course examiners access SMWA to obtain locale-specific, end-of-day (EoD) equity data (“latest official close”) with red/green gain-loss cues on any device, while the five-student development team demonstrates end-to-end agile delivery during the oral defence. 
9.6.4 Product perspective
#	Interface Category†	Name / ID	Purpose & Description	Interacting Entity / Component	Data / Protocol	Dir.	Freq. / Vol.	Performance targets	Security / Safety	Assumptions & Dependencies	Trace / Reference
1	System	SMWA-CTX-1	Context boundary – SMWA exchanges EoD quotes, FX, news & UX.	Retail Investor, Faculty Examiner, Marketstack, Exchangerate.host, NewsAPI, Netlify CDN	HTTPS JSON ± HTML 5	Bi	≤ 100 Marketstack calls·mo⁻¹ (hard cap) marketstack.com
LCP ≤ 2.5 s (p75) web.dev; mobile frame ≤ 16 ms docs.flutter.dev	TLS 1.3; only e-mail PII; GDPR	PWA + Flutter 3.22; EoD data only	SCP 01-13	
2.1	User	Guest Visitor	Browses quotes & toggles currency anonymously.	Flutter / Bootstrap UI	Touch / click JSON ≤ 2 kB	Bi	6–8 screens·session⁻¹; 2 sessions·d⁻¹ ⇒ ≤ 16 UI req.	TTI ≤ 100 ms; CLS < 0.1 web.dev	SameSite=Lax session cookie	4 G / Wi-Fi ≥ 5 Mbps	SCP 01-04, 07
2.2	User	Registered-Free	Adds holdings to local portfolio.	as above	as above	Bi	+2 PUTs·d⁻¹	same as above	Local-storage encryption at rest	IndexedDB only	SCP 05-06
2.3	User	Registered-Pro	Demonstrates pay-wall flip.	as above	as above	Bi	1 mock checkout / demo	same	Stripe-mock token only	isPro flag in memory	SCP 08
2.4	User	FacultyExaminer	Opens Netlify preview & runs WCAG audit.	Chrome + Lighthouse	HTTP GET, JSON report	Out	2 page loads / exam	same perf targets	Read-only	Needs Netlify link	SCP 10
3	Hardware	HW-MOBILE	GPS sensor on handset.	Android	Lat/Lon via Geolocator	In	1 request on first run; retry on demand	p95 ≤ 750 ms acquisition	OS permission dialog	ACCESS_FINE_LOCATION	SCP 09
4.1	Software	SW-FL-GEO	geolocator 10.x wrapper.	Android platform channel	MethodChannel JSON	Bi	≤ 1 call·launch⁻¹	inherits HW target	inherits HW constraint	depends on Play Svcs / Core Location	SCP 09
4.2	Software	SW-BOOT-CSS	Bootstrap 5 bundle.	Browser CSS engine	gzip ≈ 130 kB	Out	1 request / page	bundle ≤ 130 kB to meet LCP	CSP blocks inline	tree-shaken build	NFR-XXX (TBD)
5.1	Communications	COM-MK-EoD	Marketstack /eod endpoint.	Marketstack cloud	REST JSON	Bi	3 calls·day⁻¹ ⇒ ≈ 90 mo⁻¹	TTFB ≤ 200 ms; SLA 99.9 % marketstack.com	API-key header; 100 mo⁻¹ cap	24 h LRU cache (hit ≥ 95 %)	SCP 01-04
5.2	Communications	COM-FX-EXR	Exchangerate.host /latest endpoint (SCP 07).	Exchangerate.host	REST JSON	Bi	1 call·day⁻¹ ⇒ ≈ 30 mo⁻¹ (under 100 mo⁻¹ limit) exchangerate.host	TTFB ≤ 250 ms	No API-key; TLS 1.3	24 h cache, same LRU	SCP 07
5.3	Communications	COM-NEWS-NDATA	NewsData.io /api/1/news (SCP 04).	NewsData.io	REST JSON	Bi	200 requests·day⁻¹; 30 credits / 15 min	TTFB ≤ 300 ms	API-key header; 100 d⁻¹ quota	12 h cache per query	SCP 04
6	Memory	MEM-MOBILE-HEAP	Dart heap while charting.	Device RAM	≤ 150 MB; Δ < 5 MB·min⁻¹	—	worst 150 MB	no GC pause > 32 ms	relies on Flutter allocator	NFR-MEM-01	
7	Operations	OPS-CI-PIPE	GitHub Actions – triggered by PR & during demo.	GitHub runner	YAML → Bash	In	~5 runs·d⁻¹	CI ≤ 5 min p90	Secrets in encrypted vars	Free 2 000 min·mo⁻¹ quota	SAP-96-103 backlog
8	Site-adapt.	SITE-NETLIFY	Static deploy to Netlify global edge network (Free/Starter tier).	Netlify CDN	ZIP artefact	—	on push	Cold-start ≤ 300 ms; edge-function mem ≤ 512 MB	TLS 1.3; no server-side PII	Netlify Free plan limits 300 build-min / 100 GB BW	SCP 10
9.1	Service	SaaS-NETLIFY-API	Netlify build-hook & edge functions.	Netlify REST JSON	Bi	1 trigger·push; ≤ 10 d⁻¹	Queue SLA 99.9 %; 300 build-min mo⁻¹	OAuth 2.0 PAT	web-hook reachability	NFR-AVAIL-01	
9.2	Service	SaaS-TRADINGVIEW	TradingView Lightweight-Chart embed (SCP 11).	public CDN	HTTPS JS & iFrame	Out	client-side only; ≤ 1 load·tap⁻¹	CDN global SLA ≥ 99.9 %	CORS-isolated iFrame sandbox	relies on TradingView uptime	SCP 11

Sources (unchanged numbers where possible)
1.	Marketstack Pricing – Free plan 100 requests·mo⁻¹
2.	Netlify Free plan – 300 build-min & 100 GB bandwidth (no regional pin)
3.	Netlify Functions memory limits – 512 MB
4.	Largest Contentful Paint ≤ 2.5 s (Core Web Vitals)
5.	Cumulative Layout Shift < 0.1 (Core Web Vitals)
6.	Flutter 16 ms frame budget
7.	NewsAPI Free – 100 requests·day⁻¹
8.	Exchangerate.host Free – 100 requests·mo⁻¹
<sub>† Interface categories follow ISO 42010: System, User, Hardware, Software, Communications, Memory, Operations, Site-adaptation, Service.</sub>
 
9.6.5 Product functions
#	Function ID	Function name (verb-noun)	Brief description / value delivered	Primary stakeholder / source	Priority	Acceptance criterion (objective “fit” test)	Linked reqs / stories	Comments / open issues
1	PF-001	Display headline index	Show location-specific closing value of the main index (e.g. DAX 40) with ± % delta and ISO-8601 timestamp.	UC-002, Assignment §1, SCP-01	M	Value and Δ % exactly equal latest Marketstack EoD JSON for user country; first contentful paint ≤ 3 s (p95, 4 G) — UR-0001.	SCP-01; SAP-8, 48	24 h cache keeps ≤ 100 API calls · month⁻¹ (LIM-0003).
2	PF-002	Render interactive chart	Interactive OHLC chart (1 d / 1 m / 3 m / 1 y) for any equity.	UC-002, SCP-02	M	a) Mobile: range-change renders next frame without jank (≤ 16 ms per Flutter frame, LIM-0008). b) Web: chart redraw keeps page LCP ≤ 2.5 s (Core Web Vitals, LIM-0009). c) Task-success “Locate local index & open 1-y chart” ≥ 90 % — UR-0001.	SCP-02; SAP-22, 52	Interactive latency now tied to existing performance limits — no new metric introduced.
3	PF-003	List gainers & losers	Top-5 movers with green ▲ / red ▼ and ± % delta; tap opens PF-002.	UC-000, UC-002, SCP-03	M	Colour-blind mis-ID ≤ 2 % (UR-0004); list refresh ≤ 5 s after API poll.	SCP-03; SAP-20, 50	Dual cues & WCAG AA contrast.
4	PF-004	Present news digest	Show ≥ 3 headlines filtered for current equity / index.	UC-002, SCP-04	M	Task-success “Open first headline” ≥ 90 % (UR-0012); NewsAPI ≤ 90 requests · day⁻¹ (LIM-0005).	SCP-04; SAP-21, 51	RSS fallback covers NewsAPI ToS risk (AD-D02).
5	PF-005	Register / sign-in user	E-mail + password with client-side bcrypt-12 hashing.	UC-001, SCP-05	M	Register → dashboard ≤ 90 s (p95, UR-0006); hash verified 12 rounds.	SCP-05; SAP-24, 54	GDPR localisation (LIM-0001), no server DB.
6	PF-006	Track local portfolio	Add / remove holdings; totals auto-refresh hourly in selected currency.	UC-002, SCP-06	M	“Add first holding” success ≥ 95 % (UR-0005); hourly refresh passes unit test.	SCP-06; SAP-26, 56	IndexedDB / Shared-prefs only (no quota hit).
7	PF-007	Toggle currency	Switch EUR ↔ USD ↔ local with latest FX rate.	UC-002, SCP-07	M	EUR→USD→EUR round-trip ≤ 2 s (p95, UR-0009); ≤ 100 FX calls · month⁻¹ (LIM-0004).	SCP-07; SAP-62, 76	Pre-warm EUR/USD in 24 h cache.
8	PF-008	Show pro-upgrade page	Mock checkout flips isPro flag and unlocks badge.	UC-005, SCP-08	S	SEQ ≥ 6 / 7 (UR-0007); no real card data stored; stripe-mock passes contract tests.	SCP-08; SAP-28, 58	stripe-mock Docker SHA pinned (AD-D11).
9	PF-009	Detect user location	Resolve ISO-3166 country via GPS (mobile) or HTML5 Geolocation (web); fallback manual selector.	UC-003, SCP-09	M	Country code acquisition ≤ 0.75 s (p95, UR-0010); secure-context enforced.	SCP-09; SAP-34, 64	Insecure origin → prompt (AD-A05).
10	PF-010	Auto-deploy web build	Push to main triggers Netlify build & preview URL.	UC-001, SCP-10	M	Build visible within 4 min (p95); Lighthouse score ≥ 90 / 100 (SAP-120).	SCP-10; SAP-66-67	Free tier 300 build-min · month⁻¹ (LIM-0007).
11	PF-011	Open detailed chart on web	“View on Web” opens TradingView chart in in-app WebView.	UC-002, SCP-11	S	Task-success ≥ 95 % (UR-0011); WebView load ≤ 2 s (timer in integration test).	SCP-11; SAP-22	CDN 404 → cached PNG fallback (AD-D10).
12	PF-012	Execute global search	Find companies / indices and filter by range from any main page.	UC-002, SCP-12	M	“Find ‘Apple Inc.’” success ≥ 90 % (UR-0008); first result list ≤ 1 s.	SCP-12; SAP-60-61	Autocomplete backed by 10 k-item trie in memory.
13	PF-013	Display key-ratios table	Show PE, EPS, yield, cap, β with Δ % and industry avg.	UC-002, SCP-13	C	Each metric matches Marketstack fundamentals within ± 0.01; table passes WCAG AA reflow test.	SCP-13; SAP-22, 52	De-scope if API remains unstable (flag in backlog).
14	PF-014 	Ensure exam-UI assets						
† Priority scheme: M = Must (required for exam pass), S = Should (nice-to-have but graded), C = Could (exam extra-credit). Defined once in § 9.6.1.
‡ Every criterion is objectively verifiable (time-budget, success %, hash-round count, etc.) — meeting ISO 29148 “necessary, verifiable, traceable”. 
9.6.6 Users and usability goals

9.6.6 .a User-group / persona catalogue
#	User-group ID	Role / persona	Size of population *	Domain knowledge (yrs)**	Tech-proficiency (1–5)	Typical usage intensity	Primary goals & tasks	Accessibility / disability factors	Training need	Usability / UX implication ***	Linked reqs / use-cases	Notes / open issues
0	UC-000	Guest Visitor (anonymous)	Same addressable market as UC-002 → 12.1 million sessions · yr⁻¹ (DE 2024) dai.de
0 – 5	3	1–2 sessions · week⁻¹ (mobile & web)	• Read headline index & movers 
• Browse news snapshot 
• Change time-range & currency 
• Open detailed chart (read-only)	8 % of males colour-blind Colour Blind Awareness
none	On-boarding must never block content; sign-up CTA may appear but is skippable	SCP 01-04, 07, 09, 11, 12	Captures 100 % first-time traffic; bounce mitigation
1	UC-001	Faculty Examiner (lecturer / TA panel)	3 persons (exam board 2025)	10 – 20	4	≈ 6 demo sessions on exam day	• Verify every mandatory function 
• Run WCAG & Lighthouse audits	Presbyopia → needs ≥ 14 pt base font	30-min PDF quick-start	Global navigation & keyboard shortcuts must work instantly	SCP 01-04, 06, 09, 10	—
2	UC-002	Retail Investor (public release)	12.1 million private investors in DE (2024) dai.de
0 – 5	3	≈ 3 sessions · week⁻¹ (mobile & web)	• Search companies / indices 
• Check headline index & movers 
• Add shares to portfolio 
• Toggle currency 
• Read news snapshot 
• Open external detailed chart	8 % of males colour-blind Colour Blind Awareness
2-min in-app tour	Dual colour + ▲/▼ cues; ≥ 4.5∶1 contrast	SCP 01-04, 06, 07, 11, 12	Extend beyond exam scope
3	UC-003	Peer “Retail-Investor” surrogate (class-mates)	12 volunteer peers (2 rounds × 6)	0 – 2	3	1–2 sessions · day⁻¹ during assignment	• Same primary tasks as UC-002	1 in 12 males colour-blind ≈ 8 % Colour Blind Awareness
15-min hallway-test brief	Provide Ishihara-safe palette	SCP 01-04, 06, 07, 11, 12	Classroom test pool
4	UC-004	Accessibility Auditor (designated peer)	1	3 – 5	4	2 dedicated a11y reviews · sprint⁻¹	• Run NVDA / TalkBack passes 
• Verify keyboard reachability	Low-vision emulation (screen-reader)	Self-study WCAG 2.1 (2 h)	ARIA labels & focus order critical	NFR-xxx	Share test scripts
5	UC-005	Registered-Pro subscriber	≈ 3 % of UC-002 → 0.36 million (DE 2024) dai.de
2 – 7	4	Weekly portfolio check + monthly report	• Purchase Pro plan 
• Export PDF report 
• Deep-dive company charts	Same CVD prevalence as population avg.	5-min pay-wall walkthrough	Payment flow must be friction-free; reassure on data privacy	SCP 06, 08	Monitor real conversion post-launch
<sub>* 2024/25 figures unless noted  ** Years actively using stock-market information  *** Design consequences traceable to usability requirements</sub>


9.6.6 .b Measurable usability goals (updated) (formerly 9.6.13)
UR-ID	User-group(s)	Attribute†	Metric (ISO 9241-11 / 25062)	Context of use	Baseline (mean ± SD, n)	Target / acceptance criterion ‡	Test method & sample	Linked reqs / risks	Status / notes
UR-0001	UC-003	E	Task-success % for “Locate local index & open 1-year chart”	Mobile app, Android 13 emulator	73 % (n = 5)	≥ 90 % (95 % CI)	Summative TP-A1, n = 10	SCP 01, 02	Draft
UR-0002	UC-001	F	Time (s) Generate report → Lighthouse results	Chrome, 24″ monitor	48 ± 9 s (n = 3)	≤ 60 s @ p95	Observation TP-A2, n = 3	SCP 10, NFR-xxx	—
UR-0003	UC-003	S	SUS (0 – 100)	Mobile, standing desk	Industry median 68	≥ 80 (one-sided t, α = 0.05)	SUS survey TP-A3, n = 10	All SCP core	Draft
UR-0004	UC-003 (colour-blind subset)	H	Presence of dual cues ▲/▼ and ± sign on every gain/loss element	Ishihara simulator	Literature 12 %	All cues present and WCAG contrast ≥ 4.5 : 1 (static inspection)	Static UI walkthrough; no A/B test.	SCP 03, NFR-xxx	Dual cues enforced
UR-0005	UC-003, UC-002	E	Task-success % “Add first holding”	Mobile app, API stub	67 % (n = 3)	≥ 95 % (95 % CI)	Summative TP-A5, n = 10	SCP 06	Draft
UR-0006	UC-002	F	Time (s) Register → dashboard	Mobile, 4 G	110 ± 20 s (n = 3)	≤ 90 s @ p95	Observation TP-A6, n = 10	SCP 05	Draft
UR-0007	UC-005	S	SEQ (1 – 7) for Pro-upgrade	Mobile, Wi-Fi	—	Median ≥ 6 (Wilcoxon, α = 0.05)	Post-task TP-A7, n = 10	SCP 08	Draft
UR-0008	UC-002, UC-003	E	Task-success % “Find ‘Apple Inc.’ via global search”	Mobile & web	—	≥ 90 % (95 % CI)	Summative TP-A8, n = 10	SCP 12	Draft
UR-0009	UC-002, UC-003	F	Time (s) toggle EUR → USD → EUR	Mobile, live FX API	3.8 ± 0.6 s (n = 3)	≤ 2.0 s @ p95 (1 s cognitive limit)	Observation TP-A9, n = 10	SCP 07	Draft
UR-0010	UC-002	F	Time (s) acquire country code after permission	Mobile GPS, 4 G	1.2 ± 0.4 s (n = 5)	≤ 0.75 s @ p95 (matches SRS § 9.6.3 c)	Observation TP-A10, n = 10	SCP 09	Draft
UR-0011	UC-002	E	Task-success % “Open external detailed chart”	Mobile WebView	80 % (n = 5)	≥ 95 % (95 % CI)	Summative TP-A11, n = 10	SCP 11	Draft
UR-0012	UC-002, UC-003	E	Task-success % “Open first news headline”	Mobile & web	—	≥ 90 % (95 % CI)	Summative TP-A12, n = 10	SCP 04	Draft
UR-0013	UC-004	E	Task-success % for full keyboard navigation across six screens	Desktop PWA, Chrome 119 + screen reader (NVDA)	—	≥ 95 % (95 % CI); Fisher’s exact α = 0.05	Summative TP-A13, n = 8	NFR-xxx; WCAG 2.1 SC 2.1.1 W3C
Draft
<sub>† E = Effectiveness F = Efficiency S = Satisfaction H = Harm-avoidance / safety
‡ Each acceptance rule specifies an objective statistical threshold (confidence interval, percentile, or p-value).</sub>
 
9.6.7 Limitations
#	Limitation ID	Cat.†	Description / quantitative limit	Source / authority (doc & clause)	Impacted SRS §§ / components	Sev.‡	Mitigation / design response	Verification method	Notes / open issues
1	LIM-0001	a, k	Personal-data localisation. Any user PII (e-mail) must remain protected under GDPR Art 32.	GDPR Art 44; Recital 28	SCP 05–08; COM-MK-EoD	H	Store only bcrypt-12 salted hashes encrypted with AES-256 in client storage; no plaintext PII leaves the EEA. Static assets may be cached on Netlify’s global CDN as they contain no personal data ⇒ residual risk acceptable. Privacy notice discloses possibility of third-country caching.	Static-code scan confirms no plaintext PII transmission; privacy-notice review checklist	Netlify Free plan has global PoPs.
2	LIM-0002	k	Data-at-rest protection. Client-side PII must be stored as bcrypt-12 salted hash (meets GDPR pseudonymisation, Recital 28). AES-256 encryption becomes mandatory only if server storage is introduced.	GDPR Art 32 (1)(a); ENISA “Hashing 2024”	Same scope as LIM-0001	M	Implement bcryptjs (web) / crypto (Flutter); store only salted hashes.	Unit test validates 12-round hash; OWASP MASVS L1 checklist	Revisit AES if server DB added (owner = Ivan, due 14 Jun)
3	LIM-0003	c, m	Marketstack free quota ≤ 100 requests·month⁻¹; EoD only.	Marketstack pricing (2025-05-08)	SCP 01–04, 11; COM-MK-EoD	H	24 h LRU cache; block > 4 req·h⁻¹	CI injects 101 st call ⇒ expect HTTP 429 & user toast	Premium-key upgrade backlog (SAP-68)
4	LIM-0004	c, m	Exchangerate.host free quota ≤ 100 requests·month⁻¹.	exchangerate.host pricing (2025-05-27)	SCP 07; COM-FX-EXR	M	Same cache as LIM-0003; preload EUR↔USD	Unit test + quota dashboard	—
5	LIM-0005	c, m	NewsAPI Developer plan limit 100 requests·day⁻¹; dev-only licence (fallback).	NewsAPI pricing (2025-05-27)	SCP 04; COM-NEWS-NDATA	M	Query once per hour; 12 h cache per symbol	Unit test + quota monitor	—
6	LIM-0006	g	Technology lock-in. Mobile must be Flutter 3.22 / Dart; web must be HTML5 + Bootstrap 5 + Chart.js; CMSs forbidden.	Assignment brief pp 2–8	Entire code base	L	Lint CI blocks other stacks; README lists allowed libs	CI pipeline (SAP-96)	—
7	LIM-0007	m	Netlify Free tier: 300 build-min·month⁻¹, 100 GB bandwidth, 1 concurrent build.	Netlify pricing (2025-05-08)	SCP 10; OPS-CI-PIPE	L	Throttle CI to pull_request; gzip assets ≤ 130 kB	Netlify usage dashboard	Watch bandwidth week 20 Jun
8	LIM-0008	b	Mobile heap ≤ 150 MB; frame time ≤ 16 ms.	Flutter perf guide (2025-05)	MEM-MOBILE-HEAP; SCP 02	M	Stream charts; reuse widgets; profile with DevTools	DevTools snapshot	Profiling task SAP-32
9	LIM-0009	i	Web performance – Core Web Vitals: LCP ≤ 2.5 s (p75); CLS < 0.10.	Google Web-Vitals docs	§ 9.6.3 c; SCP 01	M	Lazy-load imgs; reserve chart height; pre-connect CDN	Lighthouse CI (SAP-120)	—
10	LIM-0010	l	Colour-blind safety: mis-ID of gain/loss cue ≤ 2 % (8 % CVD prevalence).	Colour Blind Awareness 2024	UR-0004; SCP 03	M	Dual cues ▲/▼ and ± sign; WCAG contrast ≥ 4.5 : 1	Ishihara A/B test TP-A4	Plates procured
11	LIM-0011	h	Protocol constraint: HTTPS + JSON only; no GraphQL/WebSockets.	Marketstack docs; assignment brief	All COM interfaces	L	REST wrapper; lint disallows websocket libs	Code inspection	—
12	LIM-0012	d	Parallel builds: GitHub & Netlify allow 1 concurrent build → queue risk near deadline.	GitHub free usage notes	OPS-CI-PIPE	L	Stagger builds; run flutter test locally pre-push	Build-time histogram	Re-assess 20 Jun
13	LIM-0013	e	Audit trail – N/A v 1.1. Demo stores no regulated records needing immutable logs.	ISO 29148 Annex E (cat e)	—	L	Document “not applicable”; flag for v 2.0	Design review	Owner = Adiya
14	LIM-0014	f	Supervisory control – N/A v 1.1. App is read-only, no remote control.	ISO 29148 Annex E (cat f)	—	L	Note “not applicable”; revisit if trade execution added	Design review	Owner = Gor
15	LIM-0015	j	Criticality class. SMWA is non-safety-critical (Class C0): read-only market data, no life/mission impact.	SRS § 9.6.3 c distinguishing attributes; ISO 29148 Annex E (cat j)	Risk & safety docs	L	State “Class C0” in SRS; generic crash-recovery acceptable	Risk analysis review	Owner = Irina, due 07 Jun-25
16	LIM-0016	c, m	NewsData.io Free tier ≤ 200 requests·day⁻¹; licence permits production demo.	NewsData.io pricing (2025-05-27)	SCP 04; COM-NEWS-NDATA	M	30‑min cache; switch to RSS fallback if > 90 % quota	Unit test + quota monitor	New primary provider

??: “LIM-0016 – placeholder limitation to be added to § 9.6.7: “NewsData.io Free tier ≤ 200 requests · day⁻¹ (JSON API v1)”.”
LIM-0017 “Netlify Edge-Function free quota ≤ 1 M inv·mo⁻¹; memory ≤ 128 MB”

† Category letters follow ISO 29148 Annex E list: a Regulatory, b Hardware, c External interfaces, d Parallel operation, e Audit, f Control, g Language/tech, h Protocols, i Quality/reliability, j Criticality, k Safety/security, l Human factors, m Up/down-stream limits.
‡ Severity scale: H High (legal / blocking), M Medium (material risk / cost), L Low (nuisance).
 
9.6.8 Assumptions & Dependencies
#	A/D ID	Type†	Statement (condition that must remain true)	Rationale / why it matters	Source / authority	Prob-of-change*	Impact-if-false*	Mitigation / contingency	Monitoring / verification trigger	Linked reqs / components	Owner • review date
1	AD-A01	Assumption	≥ 95 % of German mobile sessions deliver ≥ 10 Mb/s downlink (O₂ 40.4 Mb/s, Vodafone 57.2 Mb/s, Telekom 65.2 Mb/s; 96–97 % 4G/5G coverage).	Enables cloud-only delivery; offline DB would exceed API quota.	Opensignal DE report Jul–Sep 2024	L	H	Offline toast; cache last payload; asset compression.	Mixpanel KPI < 90 % “online” sessions	SCP 01-07, COM-MK-EoD, COM-FX-EXR, COM-NEWS-NAPI	—
2	AD-A02	Assumption	UE exam-room Wi-Fi provides ≥ 20 Mb/s on 24 Jun 25.	Supports live demo & Netlify deploy.	UE IT memo 20-May-25	M	H	4 G router fallback; offline ZIP in slides.	Manual speed test (T-1 day)	SCP 01-04, SCP 10, SITE-NETLIFY	—
3	AD-D01	Dependency	Marketstack V1 endpoints deprecated 30 Jun 25; free quota ≤ 100 req·mo⁻¹ unchanged.	Core quotes; V1 shutdown → blank data.	Marketstack deprecation banner	H	H	Migrate to V2 by 10 Jun; 24 h LRU cache; mock JSON fallback.	Canary schema test + status API	COM-MK-EoD, SCP 01-04	—
4	AD-D04	Dependency	Netlify Free (“Starter”) plan keeps 300 build-min & 100 GB bandwidth on its global edge network through 30 Jun 2025.	CI deploy & demo rely on those limits.	Netlify pricing page (28 May 2025)	L	M	Limit CI to pull_request; gzip assets; fallback GitHub Pages if quota hit.	Usage e-mail ≥ 80 % quota	OPS-CI-PIPE; SITE-NETLIFY; SCP 10	—
5	AD-D02	Dependency	NewsAPI Developer tier (100 req·day⁻¹) is dev-only; ToS forbids production use.	News snapshot; licence breach → empty feed.	NewsAPI FAQ	M	M	12 h cache; RSS fallback; switch to NewsData.io if revoked.	4xx rate & quota dashboard	COM-NEWS-NAPI, SCP 04	—
6	AD-D03	Dependency	Exchangerate.host free tier ≤ 100 req·mo⁻¹; /latest schema stable ≥ 30 Jun 25.	FX toggle; schema drift breaks parser.	Pricing page	L	M	Pre-warm EUR↔USD; 24 h cache; disable toggle if > 90 % 5xx.	Status RSS alerts	COM-FX-EXR, SCP 07	—
7	AD-D07	Dependency	Chart.js 4.4.9 UMD bundle remains on jsDelivr CDN & API stable ≥ 30 Jun 25.	Required for web OHLC charts.	jsDelivr package page	M	M	Pin 4.4.9 with SRI; local fallback bundle; auto-switch CDN if 404.	Sentry “Chart is undefined” > 1 %	LIB-CHARTJS, SCP 02 (Web)	—
8	AD-D08	Dependency	fl_chart 0.66.* locked; 1.0.0 is breaking → keep ≤ 0.66.	Mobile charts; API change ⇒ compile fail.	Pub.dev changelog	M	H	Pin exact version; golden tests on CI.	flutter pub get error	LIB-FL-CHART, SCP 02 (Mobile)	—
9	AD-D09	Dependency	Geolocator 10.x API unchanged; v 14.0 released → stay on 10.x.	Mandatory GPS lookup; break ⇒ location fails.	Pub.dev page header	H	M	Lock ^10.0.0; fallback manual country selector.	CI pub outdated alert	SW-FL-GEO, SCP 09	—
10	AD-D10	Dependency	TradingView Lightweight-Charts CDN reachable & API stable ≥ 30 Jun 25.	External “View on Web” deep-dive.	TradingView docs	L	M	Cache last 7-day PNG; toast on 4xx.	404 on script load	SaaS-TRADINGVIEW, SCP 11	—
11	AD-D11	Dependency	stripe-mock v0.186.0 Docker tag pullable & schema unchanged for demo.	Pay-wall upgrade flow.	stripe-mock releases	L	L	Pin Docker SHA; CI contract tests.	CI contract test fail	LIB-STRIPE-MOCK, SCP 08	—
12	AD-A03	Assumption	Team of five contributes ≥ 15 h/week until 24 Jun 25.	Maintains sprint velocity & demo roles.	Course timetable SS 2025	M	H	Re-plan backlog; enlist standby peers.	Velocity < 80 % baseline	PM-TEAM-CAP (placeholder)	—
13	AD-A04	Assumption	Play Store submission not required; APK sideload accepted.	Saves 5–7 day review buffer.	Exam brief p 2	L	L	If policy shifts → internal-test track.	Exam notice update	LIM-0006	—
14	AD-D06	Dependency	Combined uptime ≥ 99 % for Marketstack & Exchangerate.host during 30-min demo (self-reported 99.9-100 %).	Prevents live-data outage during defence.	Provider FAQs (self-report)	L	M	Pre-cache demo JSON; local mock server.	Pingdom check < 99 % (24 h)	COM-MK-EoD, COM-FX-EXR, SCP 01-04, SCP 07	—
15	AD-A05	Assumption	Exam PC browser runs Chrome ≥ 119 and accesses SMWA over HTTPS, fulfilling the Geolocation API secure-context requirement.	Geolocation fails on insecure origin; manual country entry would slow UX.	MDN Geolocation secure-context note	M	M	Fallback manual country selector; prompt user if navigator.geolocation rejects.	JS error callback PERMISSION_DENIED or insecure-context	SCP 09	—
16	AD-D12	Dependency	NewsData.io Free tier (200 API credits/day) permits production use & remains active ≥ 30 Jun 25.	Fallback news source if NewsAPI quota/licence fails.	NewsData.io pricing page	L	M	Wrapper integration behind feature flag; 15 min cache; double rate-limit guard.	4xx error spikes from NewsAPI	COM-NEWS-DATA (placeholder), SCP 04	—
<sub>† Type – Assumption = belief outside control; Dependency = external service/tool relied upon.
*Probability bands: H ≥ 0.7, M 0.3–0.7, L < 0.3. Impact: H = blocks exam pass, M = degraded feature, L = cosmetic.</sub>
 
9.6.11 External interfaces
#	IF-ID	Interface type†	Interface name	Dir.	Source ↔ Destination	Data / Signal items & format	Protocol / UI spec	Timing / perf. limits	Error & exception handling	Security / privacy reqs.	Ref. doc & clause	Verification method	Linked reqs / comps	Notes / open issues
1	IF-0120	COM	Marketstack /eod	Bi	SMWA API ↔ api.marketstack.com	JSON (~2 kB) closing quotes; ISO-8601 ts	REST + JSON v1	≤ 3 calls·d⁻¹ (≈ 90 mo⁻¹); TTFB ≤ 200 ms	HTTP 429 throttle toast; 24 h LRU cache	TLS 1.3; API-Key hdr; no PII	Marketstack Pricing (08 May 25) • SRS COM-MK-EoD	CI stub injects 101-st call ⇒ expect 429	SCP 01-04, PF-001–003, LIM-0003, SAP-72-73	V2 migration due 10 Jun (AD-D01)
2	IF-0121	COM	Exchangerate.host /latest	Bi	SMWA API ↔ api.exchangerate.host	JSON rates; base, symbols, ts	REST + JSON v1	1 call·d⁻¹ (≈ 30 mo⁻¹); TTFB ≤ 250 ms	5xx → fallback last-good cache	TLS 1.3; access_key query-param; no PII (ExchangeRate Host)
Exchangerate.host Pricing (27 May 25)	Contract test mocks 401 when key missing	SCP 07, PF-007, LIM-0004, SAP-76-77	Pre-warm EUR / -USD
3	IF-0122	COM	NewsData.io /api/1/news	Bi	SMWA API ↔ newsdata.io	JSON articles (≤ 20)	REST + JSON v2	200 requests·day⁻¹; 30 credits / 15 min; TTFB ≤ 300 ms	4xx → RSS fallback (IF-0130)	TLS 1.3; API-Key hdr	NewsData.io pricing (27 May 25)	Driver test validates 100 → 101 req limit	SCP 04, PF-004, LIM-0016, SAP-50-51	Production licence free (see LIM-0016)
4	IF-0123	COM	Netlify build-hook & CDN	Bi	GitHub CI ↔ api.netlify.com & edge CDN	ZIP artefact (~3 MB) → HTTPS HTML/CSS/JS	REST v2 + HTTP/2	≤ 10 triggers·d⁻¹; build ≤ 4 min p95	4xx web-hook retry, Slack alert	TLS 1.3; OAuth 2 PAT; no PII	Netlify Free plan (28 May 25) • SITE-NETLIFY	Netlify status API + Lighthouse CI	SCP 10, OPS-CI-PIPE, LIM-0007, SAP-66-67	300 build-min·mo⁻¹ quota monitor (avg build ≈ 2 min)(Netlify)

5	IF-0124	HW	Mobile GPS sensor	In	Handset GPS → Flutter Geolocator	Lat/Lon WGS-84, ±3 m, JSON	Android LocationSvc	≤ 0.75 s p95 acquisition	PERMISSION_DENIED → country-picker	OS-level prompt; no storage	SRS § 9.6.3c (“≤ 750 ms”)	Emulator mock-location test	SCP 09, PF-009, LIM-0008, SAP-34-35	Needs Play Svcs/Core Location
6	IF-0125	UI	Flutter mobile screens	Bi	User ↔ Mobile UI	Touch/gesture, txt-input, 24 sp fonts	Material 3 Guidelines	Frame time ≤ 16 ms; CLS = 0	Widget-error → Snackbar; assert() in dev	No PII until PF-005; bcrypt-12 hash	Google M3 docs; LIM-0008	UX tests UR-0001…0006 (n=10)	All mobile SAP-18-33	Dynamic-type safe
7	IF-0126	UI	PWA web pages	Bi	User ↔ Browser UI	Mouse/touch, HTML5, 1 rem base	WCAG 2.1 AA + Bootstrap 5.3	LCP ≤ 2.5 s p75; CLS < 0.10	JS try/catch; toast on fetch-fail	SameSite=Lax cookie; TLS only	Google Web-Vitals; LIM-0009	Lighthouse CI + SUS UR-0003	SAP-38-61, PF-001…013	keyboard-only nav UR-0013
8	IF-0127	COM	TradingView chart embed	Out	SMWA mobile ↔ cdn.tradingview.com	<script>, iFrame, PNG fallback	HTTPS JS UMD 4.0	Load ≤ 2 s p95; 1 call·tap⁻¹	404 → PNG snapshot; toast	TLS 1.3; iFrame sandbox	TradingView docs (24 May 25)	Integration test TP-A11	SCP 11, PF-011, AD-D10	CDN SLA 99.9 %
9	IF-0128	MEM	Local storage (IndexedDB / SharedPrefs)	Bi	SMWA ↔ Device storage	Holdings JSON, bcrypt-hash, flags	IndexedDB v3; Android SharedPrefs	RW ≤ 10 ms p95; ≤ 5 kB / record	try/catch; schema-ver migrate	AES-256 at rest; no PII plaintext	W3C IndexedDB; LIM-0002	Unit test encrypt-decrypt	PF-005-006, LIM-0002	Quota 50 MB (browser)
10	IF-0129	COM	Stripe-mock v0.186 API	Bi	SMWA ↔ localhost:12111	JSON payment-intent stub	REST + JSON v2020-08-27	1 checkout·demo⁻¹; RTT ≤ 400 ms	HTTP 400 on bad token; retry-disabled	TLS off (local); test-tokens only, no PII	stripe-mock README, AD-D11	Contract test in CI, docker SHA pin	SCP 08, PF-008, SAP-28, 58	Ensure port open on demo laptop
11	IF-0130	COM	RSS fallback feed	Out	SMWA ↔ rss.theguardian.com (example)	XML ≤ 25 kB; UTF-8	HTTP GET + RSS 2.0	2 pulls·h⁻¹; TTFB ≤ 300 ms	Parse-fail → skip; cache 12 h	TLS 1.3; no auth; no PII	W3C RSS 2.0; AD-D02	Parser unit test + quota monitor	PF-004, SAP-50-51	Activates only if IF-0122 4xx
12	IF-0131	COM	GitHub REST v3 / Actions	Bi	Dev IDE / CI ↔ api.github.com	JSON web-hook evt; ZIP artefact	HTTPS REST v3; YAML runner	≤ 5 runs·d⁻¹; build ≤ 5 min p90	Job-fail → Slack alert; retry-2	TLS 1.3; PAT secrets, OIDC; no PII	GitHub docs (24 May 25) • OPS-CI-PIPE	Pipeline green-build proof (SAP-103)	SAP-96-103, SCP 10	2 000 CI-min·mo⁻¹ limit
13	IF-0132	COM	Chart.js jsDelivr CDN	Out	Browser ↔ cdn.jsdelivr.net	chart.umd.js 201.83 kB (jsDelivr)
HTTPS GET + HTTP/2	1 request·page⁻¹; TTFB ≤ 150 ms; fits LCP budget	404 → local fallback bundle; toast	TLS 1.3; SRI hash pinned; no PII	Chart.js install docs (28 May 25) • LIB-CHARTJS	Integration test stubs script load; Sentry 404 alert	SCP 02, PF-002, LIM-0009	Version 4.4.9 locked; CDN SLA 99.9 %
14	IF-0133	UI	Browser Geolocation API (navigator.geolocation)	Out	PWA ↔ OS location service	{lat, lon, accuracy} JSON; error codes	W3C Geolocation API Lv 1	Country code acquisition ≤ 0.75 s p95	PERMISSION_DENIED, TIMEOUT → manual selector	HTTPS secure-context required (MDN Web Docs); user-consent; no storage	W3C Geolocation API; SRS PF-009	Integration test stubs coords & times	SCP 09, PF-009, LIM-0008	Fallback prompt if insecure origin
<sub>† Interface-type legend: UI = User interface, HW = hardware sensor, COM = network / IPC communication, MEM = file-system or shared memory.</sub> 
9.6.12 Functional requirements
#	FR ID	Linked Function ID(s) § 9.6.5	Trigger / Inputs (format · units · range)	Processing / business rules (incl. state changes)	Outputs & destinations (format · units)	Error / exception / fault handling	Performance / quality target (p95 unless stated)	Pre- & post-conditions	Prio	Trace-up refs (LIM / UC / AD / UR / DC / SEC / OPS …)	Verification & acceptance criterion	Status / notes
1	FR-0101	PF-001	App landing or manual refresh; countryCode ISO-3166-1 alpha-2	GET / eod?symbols={index} (Marketstack Free) → 24 h LRU cache (≤ 1 call·day⁻¹). Compute Δ % via ALG-001; indicate gain/loss with dual cues (arrow ± colour meeting WCAG AA); ISO-8601 ts.	Widget {index,value,delta,ts}	API 4xx/429 ⇒ use cache ≤ 24 h; toast “stale”	FCP ≤ 3 s (p95, 4 G); absolute error ≤ max(0.01, 0.005 % × quote); cache-hit ≥ 95 % (≤ 100 calls·month⁻¹)	Internet up → headline visible	M	UC-000, UC-002 · LIM-0003 · UR-0001 · DC-COTS-MARKET-1 · SEC-001, SEC-002	100 cold loads: values within tolerance; Lighthouse FCP p95 ≤ 3 s	Draft
2	FR-0102	PF-002	Range-select 1 d / 1 m / 3 m / 1 y; symbol [A-Z.]{1,6}	Retrieve EoD OHLC from shared 24 h cache. If range = 1 d → draw sparkline; else down-sample ≤ 350 pts & redraw interactive chart; preserve zoom.	Interactive chart (lib chosen in design)	Symbol miss ⇒ toast; quota-breach ⇒ cached series	Mobile frame ≤ 16 ms (p95); Web LCP ≤ 2.5 s (p75); CLS < 0.10	OHLC cached → chart displayed	M	UC-002 · PF-002 · LIM-0008/0009/0003 · UR-0001 · DC-COTS-MARKET-1 · SEC-001, SEC-002	“Open 1-y chart” success ≥ 90 % (Clopper–Pearson 95 % CI, n = 10)	Draft
3	FR-0103	PF-003	24 h timer (02:00 local ± 5 min) or manual	Fetch index constituents (≤ 50 symbols / request) → Δ % via ALG-001; sort; top-5 gainers & losers; colours meet WCAG 2.1 AA contrast.	List {symbol,name,Δ %}; tap → FR-0102	API fail ⇒ stale label; grey list	List refresh ≤ 5 s (p95); colour-blind mis-ID ≤ 2 % (Fisher, n = 8)	Valid data → list visible	M	PF-003 · UR-0004 · DC-STD-WCAG-1 · LIM-0003 · SEC-001, SEC-002	30 refreshes: p95 ≤ 5 s; mis-ID ≤ 2 %	Draft
4	FR-0104	PF-004	symbol change or 24 h timer	Call NewsAPI /v2/everything?q={symbol}&language=en&sortBy=publishedAt → 12 h cache; pick 3 newest. 4xx/quota/licence-fail ⇒ fallback NewsData.io /api/1/news?q={symbol}&country={ISO2}; if still failing, RSS fallback (IF-0130).	Card list {title,source,url}	API limit ⇒ fallback; fallback fail ⇒ empty; toast	First headline fetch ≤ 500 ms (p95, Wi-Fi); ≤ 200 NewsData req·day⁻¹ (LIM-0016)	Cache ready → headlines visible	M	PF-004 · LIM-0016 · AD-D12 · IF-0122 · AD-D02 (fallback) · SEC-001, SEC-002	“Open headline” success ≥ 90 % (Clopper–Pearson 95 % CI, n = 10)	Draft – NewsData.io primary (free prod licence); NewsAPI fallback (dev-only)
5	FR-0105	PF-005	Sign-up {email ≤ 254, pwd 8–72 UTF-8 printable}	Regex validate; bcrypt-12 hash; AES-256 encrypt; store in IndexedDB/SharedPrefs; set isRegistered = true	Navigate dashboard	Invalid email/pwd ⇒ inline; > 3 fails ⇒ 30 s cool-down	Register→dashboard ≤ 90 s (p95); 12 hash rounds; no PII in transit	Not registered → flag true	M	LIM-0001/0002 · UC-001 · UR-0006 · DC-REG-GDPR-1 · SEC-001, SEC-003	20 sign-ups: vector ok; p95 ≤ 90 s	Draft
6	FR-0106	PF-006	“Add holding” {symbol, qty > 0 ≤ 1 000 000, price > 0}	Validate symbol; store; schedule totals refresh top-of-hour ± 5 min: reuse EoD prices already in 24 h cache – no additional /eod calls; Σ(qty × lastClose); persist	Portfolio table + totals	Bad qty/price ⇒ toast; lookup fail ⇒ error row	Add success ≥ 95 % (Clopper–Pearson 95 % CI); hourly refresh unit-test pass	Holdings exist → row added	M	PF-006 · UR-0005	30 adds: success ≥ 95 %; totals ± 0.01	Draft
7	FR-0107	PF-007	Currency toggle enum {EUR, USD, local}	If FX cache > 24 h → /latest; convert; repaint UI	Updated UI values	API 5xx ⇒ last-good rate; toast	Toggle round-trip ≤ 2 s (p95)	Rate cached → UI converted	M	PF-007 · LIM-0004 · DC-COTS-FX-1 · UR-0009 · SEC-001	30 toggles: p95 ≤ 2 s; rate ± 0.01	Draft
8	FR-0108	PF-008	Tap “Go Pro”	Open stripe-mock checkout; on success isPro = true; show badge	Snackbar “Pro unlocked”	Cancel ⇒ stay free; mock 4xx ⇒ retry link	SEQ median ≥ 6 / 7; checkout RTT ≤ 4 s (p95)	User free → flag true	S	PF-008 · UR-0007 · AD-D11 · SEC-003	10 checkouts: flag true; SEQ ≥ 6; RTT p95 ≤ 4 s	Draft
9	FR-0109	PF-009	App launch; HTML5 Geo; accuracy ≤ 100 m	Permission prompt; map coords → ISO-3166; else manual selector	Store countryCode	Denied/timeout ⇒ selector; toast	Acquire code ≤ 0.75 s (p95)	No code → code set	M	PF-009 · UR-0010 · LIM-0008 · AD-A05 · SEC-004	20 emulator runs: p95 ≤ 0.75 s	Draft
10	FR-0110	PF-010	git push main	Netlify build-hook → build → publish preview URL	Build log + preview URL	Fail ⇒ Slack alert; retry 1×	Preview URL visible ≤ 4 min (p95); Lighthouse Perf ≥ 90 & a11y ≥ 90	CI green → URL posted	M	PF-010 · LIM-0007 · UR-0002 · DC-CLOUD-NETLIFY-1 · OPS-001 · SEC-001	30 pushes: p95 build ≤ 4 min; scores ≥ 90	Draft
11	FR-0111	PF-011	Tap “View on Web”	Open TradingView chart in WebView; inject symbol	WebView chart	CDN 404 ⇒ PNG snapshot; toast	Load ≤ 2 s (p95) when TradingView status green; task success ≥ 95 % (Clopper–Pearson 95 % CI)	Internet → chart visible	S	PF-011 · UR-0011 · AD-D10 · SEC-005, SEC-006	20 taps: success ≥ 95 %; p95 ≤ 2 s	Draft
12	FR-0112	PF-012	Search ≥ 3 UTF-8 chars	Trie filter; Levenshtein rank; show suggestions	Drop-down; Enter → FR-0102	No match ⇒ empty list	First list ≤ 1 s (p95); success ≥ 90 % (Clopper–Pearson 95 % CI)	Company list cached → list shown	M	PF-012 · UR-0008	30 searches: success ≥ 90 %; p95 ≤ 1 s	Draft
13	FR-0113	PF-013	Company-detail load	— Deferred — Fundamentals API not available on free Marketstack plan; feature postponed until free provider identified (see AD-open-item).	—	—	—	—	C	PF-013 · AD-D03	Deferred – will return in v 1.2 once free FMP Basic (250 req·day⁻¹) or similar is integrated.	Deferred
14	FR-0114	PF-014	Build-time asset scan & orientation-change events	Package rotation-safe raster assets (1× / 2× / 3×) and unique launcher icon; ensure assets auto-scale to viewport	Assets render; launcher icon visible on OS home/app list	Missing/overflow ⇒ CI asset-lint fails; runtime placeholder used	Rotation: 20 × flip test no overflow; launcher-icon RAM ≤ 3 MB	Assets compiled → icon visible	M	EXAM-REQ-ASSET · DC-PLAT-MOBILE-1	Rotate device 20 ×: no overflow; icon visible; CI asset-lint passes	Draft
 
9.6.14 Performance requirements
9.6.14 Performance requirements
ID	Metric category †	Workload / scenario (load profile & mix)	Operating environment (HW / OS / network)	Baseline (mean ± SD, n, source)	Target / acceptance criterion ‡	Verification method (test ID, sample size ≤ 50 unless noted, α / β / period)	Linked reqs / comps	Rationale / source	Status / notes
PR-0001	Latency (p95)	Synthetic burst: 30 read-only API calls spread across 60 min; JSON ≤ 2 kB (≤ 30 symbols)	End-user device (Android 13,  Chrome ≥ 119) on 4 G / 100 ms RTT	280 ms ± 40 (n = 30, Pilot T-23)	≤ 200 ms @ p95 (Mann–Whitney U, α = 0.05, n = 50)	Load-test LT-05 (k6), 50 calls routed to stubbed Marketstack payload, 5-min window	FR-0101, LIM-0003, LIM-0009	Keeps ≤ 100 Marketstack calls·mo⁻¹ & meets Core Web Vitals	Draft
PR-0002	Capacity / concurrency	Peak demo: 10 simultaneous users, think-time 3 s, 3 req s⁻¹ user⁻¹ for 5 min (first call hits network, rest served from cache)	Mid-range handset / laptop, Netlify Starter edge (static hosting, no Edge Functions)	8 users ± 2 (n = 30, Proto T-31)	≥ 10 users with median latency ≤ 250 ms (95 % CI)	Scalability SC-01, ramp 1 → 12 users, 3 iterations, α = 0.05	FR-0120 (placeholder), LIM-0008	Fits 125 k Netlify-invocation cap; reflects exam audience	Draft
PR-0003	Availability	Calendar month, static PWA on Netlify CDN	Netlify Starter (no SLA)	99.2 % (rolling 14 d log)	Rolling 30 d uptime ≥ 99 % for https://smwa.netlify.app and total downtime < 8 h mo⁻¹; no outage 24 – 30 Jun 25	Status-scrape MON-02, ping every 60 s, rolling 30 d sample	NFR-AVAIL-01	Free-tier verifiable; avoids paid probe	Planned
PR-0004	Resource utilisation (JS heap)	Workload = PR-0002	Chrome 119 mobile-sim; Netlify static site (Edge Functions disabled)	90 MiB ± 10 (n = 30, Prof P-09)	≤ 150 MiB @ p95 (30 min, 1 Hz)	Profiler PF-01, 1 800 heap snapshots (1 Hz, 30 min)	LIM-0008	Aligns with LIM-0008 150 MB mobile budget; long run catches leaks	Draft
PR-0005	Web-perf – LCP	First page load over 4 G (cold cache)	Chrome 119 Lighthouse mobile-sim	3.1 s ± 0.4 (n = 20)	LCP ≤ 2.5 s @ p75 (50 runs, 95 % CI)	Web-perf WP-01, 50 loads, α = 0.05	FR-0101, LIM-0009	Core Web-Vitals rubric	Draft
PR-0006	Web-perf – CLS	Same as PR-0005	Same	0.16 ± 0.03 (n = 20)	CLS < 0.10 (50 runs, 95 % CI)	Web-perf WP-01 (same run-set)	FR-0101, LIM-0009	Core Web-Vitals rubric	Draft
PR-0007	Mobile frame-time	Interactive chart pan / zoom (1-y range)	Flutter 3.22, Android 13 emulator	21 ms ± 4 (n = 1 200 frames)	≤ 16 ms @ p95 (n = 2 000 frames, α = 0.05)	Perf-trace FT-01	FR-0102, LIM-0008	Meets 60 fps budget	Draft
PR-0008	Geo-perf – GPS acquisition	Cold-start geolocation	Android 13 GPS, 4 G	1.2 s ± 0.4 (n = 30)	≤ 0.75 s @ p95 (n = 30, α = 0.05)	Geo-test GEO-01	FR-0109, LIM-0008	Aligns with SRS § 9.6.3 c	Draft
PR-0009	Quota-efficiency	Aggregate API usage (Marketstack, Exchangerate.host, NewsAPI) over 30 d	Same runtime env.	Hit-ratio 92 % (1-month CI logs)	Cache hit ≥ 95 % (Wilson 95 % CI) ⇒ ≤ 80 calls·mo⁻¹ (Marketstack & FX) & ≤ 80 calls·d⁻¹ (NewsAPI)	Log-audit QE-01, 30 d window (α = 0.05)	LIM-0003 / 4 / 5	Prevents free-plan suspension	Planned
† Metric-category legend — Latency, Capacity / concurrency, Availability, Resource utilisation, Web performance, Mobile frame-time, Geolocation performance, Quota-efficiency.  
‡ Each target states statistic + hypothesis or CI, ensuring objective verification (ISO 29148). 
9.6.16 Design constraints
#	DC ID	Constraint category†	Constraint statement / quantitative limit	Rationale / authoritative source (doc & date)	Impacted SRS §§ / elements	Critical-ity	Negoti-ability	Verification evidence (inspection / test / cert.)	Linked risks / reqs	Status
1	DC-LANG-FLUTTER-1	Language / framework	Mobile app shall be built with Flutter 3.22.0 stable (2025-04-03) and Dart 3.3; CI fails on any other tool-chain version.	Assignment pp 2-3; Flutter release notes 03 Apr 2025	SAP-1; SCP 02; CI pipeline	H	Fixed	flutter --version in CI; gradle-wrapper hash	LIM-0006; AD-D08	Draft
2	DC-LANG-WEB-1	Language / framework	Web app shall use HTML5, Bootstrap 5.3.x and Chart.js 4.4.9 (UMD bundle, SRI-pinned).	Assignment p 6; jsDelivr pkg page 24 May 2025	SAP-2; SCP 02 (web)	H	Fixed	ESLint rule bootstrap@^5.3; Netlify CI SRI-check	AD-D07; LIM-0006	Draft
3	DC-COTS-MARKET-1	COTS / external service	End-of-day quotes must use Marketstack Free plan; ≤ 100 requests · month⁻¹; endpoint / eod.	Marketstack ToS 08 May 2025	COM-MK-EoD; SCP 01-04	H	Fixed	Quota dashboard ≥ 90 % hit; CI test 101 st call ⇒ HTTP 429	LIM-0003; AD-D01	Draft
4	DC-COTS-FX-1	COTS / external service	FX data shall come from Exchangerate.host Free plan; ≤ 100 requests · month⁻¹; endpoint / latest.	exchangerate.host pricing 27 May 2025	COM-FX-EXR; SCP 07	M	Fixed	Quota monitor; integration-test mocks 429	LIM-0004	Draft
5	DC-COTS-NEWS-1	COTS / external service	News feed shall use NewsAPI Developer tier; ≤ 100 requests · day⁻¹.	NewsAPI pricing 27 May 2025	COM-NEWS-NAPI; SCP 04	M	Fixed	Quota dash; 101 st-call integration test	LIM-0005; AD-D02	Draft
6	DC-CLOUD-NETLIFY-1	Platform / OS	Production PWA shall be deployed on Netlify Free (“Starter”) plan – global edge network, 300 build-minutes · month⁻¹ and 100 GB bandwidth · month⁻¹. Edge Functions remain disabled.	Netlify pricing page, retrieved 28 May 2025 – Free plan limits 100 GB / 300 min(Netlify); region selection only on paid tiers(Netlify Support Forums)
SITE-NETLIFY; OPS-CI-PIPE; SCP 10	M	Fixed	netlify status --json shows plan:starter, usage ≤ 90 % quota; CI fails on plan drift	LIM-0007; AD-D04	Updated
7	DC-REG-GDPR-1	Regulatory / privacy	Client-side PII (e-mail) shall be stored only as bcrypt-12 salted hashes and AES-256-encrypted at rest (GDPR Art 32 § 1).	GDPR 2016/679; retrieved 24 May 2025	SCP 05-08; IndexedDB & Shared-prefs	H	Fixed	Static-scan for bcrypt.hashSync(...,12); pen-test report; key-vault log	LIM-0002; UR-0006	Draft
8	DC-STD-CWV-1	Standard / quality	Web build shall satisfy Core Web Vitals: LCP ≤ 2.5 s (p75) and CLS < 0.10.	Google web.dev, 24 May 2025	LIM-0009; SCP 01-03	M	Review	Lighthouse-CI JSON ≥ 90 / 100; perf-budget file	UR-0002; SAP-120	Draft
9	DC-STD-WCAG-1	Standard / accessibility	UI must meet WCAG 2.1 AA colour-contrast ≥ 4.5∶1 & focus-order SC 2.1.1; mis-ID of gain/loss cue ≤ 2 %.	W3C WCAG 2.1 (05 Jun 2018); Colour Blind Awareness 2024	SCP 03; UR-0004; LIM-0010	M	Review	Lighthouse-a11y ≥ 90; Ishihara TP-A4 results	SAP-92	Draft
10	DC-SCHED-SPRINT-1	Project limitation	Project shall run exactly four sprints of ≈ 1 week; submission 24 Jun 2025 23:59 CEST.	Course timetable SS-2025 memo 20 Apr 2025	Jira boards; SAP-97	L	Fixed	Jira sprint calendar; CI tag rc3 on 23 Jun	—	Draft
11	DC-PLAT-MOBILE-1	Platform / OS	Mobile app shall support Android 13 (API 33).	Android 13 release notes 15 Aug 2022	SCP 02; SW-FL-GEO; LIM-0008	M	Review	minSdkVersion 33	AD-A05	Draft


 
9.6.18 Software system attributes
#	QA ID	ISO 25010 quality attribute	Sub-characteristic / metric	Operating scenario & environment	Baseline (mean ± SD, n, year, source)	Target / acceptance criterion †	Measurement & evidence (free-tier / OSS)	Verification plan & sample (ID, n, α)	Linked reqs / comps / risks	Status / notes
2	QA-P1	Performance efficiency	p95 server response time (ms)	Same env. as QA-A1, load = 30 VU, 5 req/s (80 % GET / 20 % POST)	320 ms ± 40 (n = 1 000 req, 2025-05 k6 prototype)	≤ 300 ms @ p95 over 1 h (95 % CI)	k6 OSS script in CI; JSON summary archived	TEST-PERF-xx, n = 10 000 req, α = 0.05	FR-PERF-xx, COMP-BE-xx, RIS-PERF-xx	Draft — retest after perf sprint
3	QA-S1	Security	High-severity vulnerability density (CVSS ≥ 7 / KLoC)	Main branch, release candidate	0.42 / KLoC (2025-05 SonarQube CE + OWASP DC)	≤ 0.10 / KLoC (whole repo)	SAST via SonarQube CE + Dependency-Check; manual triage	TEST-SEC-xx, n = all files	SEC-xx, RIS-SEC-xx	Draft — drops after dep-upgrade
 
9.6.19 Verification
#	Req ID<br/>(parent)	V-method†	Verification activity – what & why	Pass / fail rule (objective)	Test environment	Tool / technique	Sample ( n, stats )	Responsible	Milestone / date	Evidence ID	Status / notes
<!-- backlog after exam --> 1	FR-0101	T + I	Headline-index widget accuracy, quota safety & Core Web Vitals on Android  / Desktop	Δ % error ≤ 0.005 % × quote; LCP ≤ 2.5 s (p75, 4 G)	Android 13 emu · · Chrome 119 PWA	Cypress 13 + MSW stubs; Lighthouse CLI	10 cold loads / platform (95 % CI)	QA Eng.	Sprint-2 feature-verif.	TR-FR0101.pdf	Planned
<!-- backlog after exam --> 2	FR-0102	T	1-year OHLC chart pan – prove 60 fps & no jank	Frame-time p95 ≤ 16 ms; pan latency ≤ 100 ms	Android 13 emu	Flutter DevTools timeline	10 traces × 500 frames	Mobile Dev	Perf-verification	TR-FR0102.pdf	Planned
<!-- backlog after exam --> 3	FR-0103	T	Top gainers/losers list – refresh time, WCAG contrast & colour-blind cues	Refresh ≤ 5 s (p95); Axe violations = 0; mis-ID ≤ 2 % (Fisher α 0.05)	Chrome 119 PWA + NVDA CVD sim	Jest + axe-core + DaltonLens	10 refreshes; n = 8 CVD pilot	FE Dev	Usability-verif.	TR-FR0103.pdf	Planned
<!-- backlog after exam --> 4	FR-0104	T	News digest via NewsData.io (cache & RSS fallback)	1st headline ≤ 500 ms (p95); task-success ≥ 90 % (95 % CI); ≤ 10 live req/day	Chrome desktop	Cypress + VCR-JS stubs	10 refreshes	QA Eng.	Feature-verif.	TR-FR0104.pdf	Planned
<!-- backlog after exam --> 5	FR-0105 / SEC-0003*	T + I	Sign-up flow – regex, bcrypt-12 & timing	Register → dashboard ≤ 90 s (p95); 12 hash rounds; hash t ≤ 300 ms (p95)	Android emu & CI	Espresso; bcrypt-tester	n = 10	BE Dev	Security-verif.	TR-FR0105.pdf	Planned
<!-- backlog after exam --> 6	FR-0106	T	Portfolio add & hourly totals	Add success ≥ 95 %; Σ error ≤ 0.01	Chrome IndexedDB	Jest + msw-cache	10 adds	FE Dev	Feature-verif.	TR-FR0106.pdf	Planned
<!-- backlog after exam --> 7	FR-0107	T	Currency toggle with 24 h FX cache	RTT ≤ 2 s (p95); conv. err ≤ 0.01; live FX calls ≤ 5	Android emu (4 G) & Chrome	Cypress; fx-stub	10 toggles (5 live + 5 stub)	Mobile Dev	Feature-verif.	TR-FR0107.pdf	Planned
<!-- backlog after exam --> 8	FR-0108	D + T	stripe-mock checkout – unlock Pro	SEQ median ≥ 6 / 7; checkout RTT ≤ 4 s (p95); isPro flag == true	stripe-mock 0.186 local · Android emu (4 G)	Cypress + screen-capture	n = 5	QA Eng.	Demo-day (T-24 h)	TR-FR0108.mp4	Planned
<!-- backlog after exam --> 9	FR-0109	T	GPS / HTML5 geo – country code latency	Country-code ≤ 0.75 s (p95)	Android 13 emu GPS · Chrome	Detox; geo-stub	n = 10	Mobile Dev	Feature-verif.	TR-FR0109.csv	Planned
<!-- backlog after exam --> 10	FR-0110	D + I	Netlify build speed & Lighthouse regression	Preview URL ≤ 4 min (p95); Perf ≥ 90 / 100; A11y ≥ 90 / 100	GitHub Actions + Netlify Free	Lighthouse-CI cassette	3 builds / week	DevOps	Weekly CI	TR-FR0110.pdf	Planned
<!-- backlog after exam --> 11	UR-0013	T	Full keyboard navigation & WCAG scan (desktop PWA)	Task-success ≥ 95 % (95 % CI); Axe violations = 0	Chrome 119 + NVDA	Cypress + axe-core + tab-script	10 tasks · 5 users	A11y Aud.	Usability window	TR-UR0013.pdf	Planned
<!-- backlog after exam --> 12	PR-0009 / LIM-0003-5	A	10-day rolling quota audit (Marketstack + FX + NewsData)	Cache-hit ≥ 95 % ⇒ ≤ 70 calls / 10 d / API	Netlify logs → GitHub	Python parser (cron 1 min)	10-d window (CI α 0.05)	DevOps	Weekly CI	TR-QEFF.pdf	Planned
ADD later: check that app runs on iOS.
† Method legend — I Inspection • A Analysis/Simulation • D Demonstration • T Test (ISO/IEC/IEEE 29148 § 9.6.19).
* SEC-0003 (new) = “Client-side credential hygiene – bcrypt-12, AES-256, no plaintext PII”.
 
9.6.26 Packaging & deployment specification
Package ID	Version / build tag	Variant / target platform	Build artefact URI	Hash / signature	Installation prerequisites	Licensing & notice	Rollback / removal	Verification evidence
PKG-0001	v 1.1.0 + 20250605.g3509b4f	Android 13 + APK (sideload)	sandbox:/build/app-release.apk	SHA-256 3c7b…e1fcosign sig k8s://smwa-ci.pub	Device ≥ Android 13, 100 MB free, “Install unknown apps” enabled, Internet	SPDX: MIT AND CC-BY-4.0/LICENSES/NOTICE.txt	adb uninstall com.ue.smwa or Settings ▸ Apps ▸ SMWA ▸ Uninstall	SBOM-0001TR-INSTALL-APK-01.pdf (placeholder; see § 9.6.19)
PKG-0002	v 1.1.0 + 20250605.g3509b4f	PWA build (all modern browsers)	https://smwa.netlify.apphttps://github.com/ue-smwa/releases/download/v1.1.0/smwa-web-1.1.0.zip	ZIP SHA-256 5c1d…9abNetlify deploy ID 65bfa1a	Chromium 119 +, Firefox 126 +, Safari 17 +; JS enabled; TLS 1.3	SPDX: MIT AND CC-BY-4.0/LICENSES/NOTICE.txt	netlify deploy --rollback 65bfa1a or Git revert previous commit	TR-FR0110.pdf (Netlify build & Lighthouse pass)
PKG-0003	v 1.1.0 (ghcr.io/ue-smwa/smwa-web:1.1.0)	OCI container – Nginx-served static PWA	ghcr.io/ue-smwa/smwa-web@sha256:da7e0b…35b	Image digest SHA-256 abovecosign sig k8s://smwa-ci.pub	Docker ≥ 20.10, 150 MB free, port 80 exposed	SPDX: MIT AND CC-BY-4.0/LICENSES/NOTICE.txt embedded in /usr/share/nginx/html	docker image rm da7e0b…35b or Helm rollback previous release	SBOM-0001TR-CONTAINER-01.txt (placeholder smoke-test)
PKG-0004	v 1.1.0 SBOM	SPDX 2.3 JSON (complete dependency graph)	sandbox:/build/smwa-1.1.0.spdx.json	SHA-256 af02…c77	n/a (metadata file)	SPDX document licence: CC0-1.0	n/a	TR-SBOM-01.json (cyclonedx → spdx conversion check)

 

