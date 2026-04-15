const store = $store(
	{
		url: "https://google.com",
		wispurl:
			_CONFIG?.wispurl ||
			"wss://wisp.mercurywork.shop",
		bareurl:
			_CONFIG?.bareurl ||
			(location.protocol === "https:" ? "https" : "http") +
				"://" +
				location.host +
				"/bare/",
		proxy: "",
		transport: "/epoxy/index.mjs",
	},
	{ ident: "settings", backing: "localstorage", autosave: "auto" }
);
self.store = store;
