/* Config Sample
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	address: "localhost",	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/",	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
									// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],	// Set [] to allow all IP addresses
									// or add a specific IPv4 of 192.168.1.5 :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
									// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false,			// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true

	language: "bn",
	locale: "bn-BD",   // this variable is provided as a consistent location
			   // it is currently only used by 3rd party modules. no MagicMirror code uses this value
			   // as we have no usage, we  have no constraints on what this field holds
			   // see https://en.wikipedia.org/wiki/Locale_(computer_software) for the possibilities

	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "calendar",
			header: "বাংলাদেশের ছুটির দিন",
			position: "top_left",
			config: {
				calendars: [
					{
						fetchInterval: 7 * 24 * 60 * 60 * 1000,
						symbol: "calendar-check",
						url: "https://www.officeholidays.com/ics/bangladesh"
					}
				],
				customEvents: [
					// Remove "Bangladesh: " prefix
					{ keyword: ".*", transform: { search: "Bangladesh: ", replace: "" } },
					// Translate holidays to Bengali
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
				mptMethod: 1,  // University of Islamic Sciences, Karachi (used in Bangladesh)
				mptOffset: "0,0,0,0,0,0,0,0,0",
				showSunrise: true,
				showSunset: true,
				showMidnight: false,
				showImsak: true,
				show24Clock: true
			}
		},
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
			header: "আবহাওয়ার পূর্বাভাস",
			config: {
				weatherProvider: "openmeteo",
				type: "forecast",
				lat: 23.8103,
				lon: 90.4125
			}
		},
		{
			module: "MMM-GitHubProfile",
			position: "bottom_right",
			header: "GitHub",
			config: {
				username: "arafatahmedtanimcsedu57",
				showAvatar: true,
				showStats: true,
				showBio: false
			}
		},
		{
			module: "MMM-BanglaQuotes",
			position: "bottom_left",
			header: "আজকের বাণী",
			config: {
				updateInterval: 30 * 60 * 1000  // Change quote every 30 minutes
			}
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "Prothom Alo",
						url: "https://www.prothomalo.com/feed"
					},
					{
						title: "BBC Bangla",
						url: "https://feeds.bbci.co.uk/bengali/rss.xml"
					}
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
