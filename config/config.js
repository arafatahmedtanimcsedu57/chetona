/* MagicMirror Config - Bangla Edition */
let config = {
	address: "localhost",
	port: 8080,
	basePath: "/",
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],

	useHttps: false,
	httpsPrivateKey: "",
	httpsCertificate: "",

	language: "bn",
	locale: "bn-BD",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"],
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "alert",
		},
		// ===== TOP LEFT: Clock + Calendar =====
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "calendar",
			header: "আসন্ন ছুটি",
			position: "top_left",
			config: {
				maximumEntries: 5,
				calendars: [
					{
						symbol: "calendar-check",
						url: "https://www.officeholidays.com/ics/bangladesh"
					}
				],
				customEvents: [
					{ keyword: ".*", transform: { search: "Bangladesh: ", replace: "" } },
					{ keyword: "Shab e-Barat", transform: { search: "Shab e-Barat", replace: "শবে বরাত" } },
					{ keyword: "Language Martyrs' Day", transform: { search: "Language Martyrs' Day", replace: "শহীদ দিবস" } },
					{ keyword: "Shab-e-Qadr", transform: { search: "Shab-e-Qadr", replace: "শবে কদর" } },
					{ keyword: "Eid al-Fitr", transform: { search: "Eid al-Fitr", replace: "ঈদুল ফিতর" } },
					{ keyword: "Jumatul Bidah", transform: { search: "Jumatul Bidah", replace: "জুমাতুল বিদা" } },
					{ keyword: "Independence Day", transform: { search: "Independence Day", replace: "স্বাধীনতা দিবস" } },
					{ keyword: "Bengali New Year", transform: { search: "Bengali New Year", replace: "পহেলা বৈশাখ" } },
					{ keyword: "May Day", transform: { search: "May Day", replace: "মে দিবস" } },
					{ keyword: "Buddha Purnima", transform: { search: "Buddha Purnima", replace: "বুদ্ধ পূর্ণিমা" } },
					{ keyword: "Eid al-Adha", transform: { search: "Eid al-Adha", replace: "ঈদুল আযহা" } },
					{ keyword: "Ashura", transform: { search: "Ashura", replace: "আশুরা" } },
					{ keyword: "National Mourning Day", transform: { search: "National Mourning Day", replace: "জাতীয় শোক দিবস" } },
					{ keyword: "Janmashtami", transform: { search: "Janmashtami", replace: "জন্মাষ্টমী" } },
					{ keyword: "Eid-e-Miladunnabi", transform: { search: "Eid-e-Miladunnabi", replace: "ঈদে মিলাদুন্নবী" } },
					{ keyword: "Durga Puja", transform: { search: "Durga Puja", replace: "দুর্গা পূজা" } },
					{ keyword: "Victory Day", transform: { search: "Victory Day", replace: "বিজয় দিবস" } },
					{ keyword: "Christmas Day", transform: { search: "Christmas Day", replace: "বড়দিন" } },
					{ keyword: "New Year's Day", transform: { search: "New Year's Day", replace: "নববর্ষ" } },
					{ keyword: "Holiday", transform: { search: "Holiday", replace: "ছুটি" } }
				]
			}
		},
		{
			module: "MMM-MyPrayerTimes",
			position: "top_left",
			header: "নামাযের সময়",
			config: {
				mptLat: 23.8103,
				mptLon: 90.4125,
				mptMethod: 1,
				mptOffset: "0,0,0,0,0,0,0,0,0",
				showSunrise: false,
				showSunset: false,
				showMidnight: false,
				showImsak: false,
				show24Clock: true
			}
		},

		// ===== TOP RIGHT: Weather =====
		{
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				lat: 23.8103,
				lon: 90.4125
			}
		},
		{
			module: "weather",
			position: "top_right",
			header: "পূর্বাভাস",
			config: {
				weatherProvider: "openmeteo",
				type: "forecast",
				lat: 23.8103,
				lon: 90.4125
			}
		},

		// ===== CENTER: Compliments =====
		{
			module: "compliments",
			position: "lower_third",
			config: {
				compliments: {
					anytime: ["তুমি দারুণ!", "চমৎকার দিন কাটাও!"],
					morning: ["সুপ্রভাত!", "শুভ সকাল!", "নতুন দিনের শুভেচ্ছা!"],
					afternoon: ["শুভ দুপুর!", "কেমন চলছে?", "ভালো থাকো!"],
					evening: ["শুভ সন্ধ্যা!", "দিনটা কেমন ছিল?", "বিশ্রাম নাও!"],
					"....-01-01": ["শুভ নববর্ষ!"],
					"....-02-21": ["শহীদ দিবসের শ্রদ্ধাঞ্জলি"],
					"....-03-26": ["স্বাধীনতা দিবসের শুভেচ্ছা!"],
					"....-12-16": ["বিজয় দিবসের শুভেচ্ছা!"]
				}
			}
		},

		// ===== BOTTOM LEFT: Quotes =====
		{
			module: "MMM-BanglaQuotes",
			position: "bottom_left",
			config: {
				updateInterval: 30 * 60 * 1000
			}
		},

		// ===== BOTTOM RIGHT: GitHub =====
		{
			module: "MMM-GitHubProfile",
			position: "bottom_right",
			config: {
				username: "arafatahmedtanimcsedu57",
				showAvatar: true,
				showStats: true,
				showBio: false,
				showCommits: true,
				maxCommits: 3
			}
		},

		// ===== BOTTOM BAR: News =====
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{ title: "Prothom Alo", url: "https://www.prothomalo.com/feed" },
					{ title: "BBC Bangla", url: "https://feeds.bbci.co.uk/bengali/rss.xml" }
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true
			}
		},
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
