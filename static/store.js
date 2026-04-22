const store = $store(
	{
		url: "https://google.com",
		wispurl:
			_CONFIG?.wispurl ||
			(location.protocol === "https:" ? "wss" : "ws") +
				"://" +
				location.host +
				"/wisp/",
		bareurl:
			_CONFIG?.bareurl ||
			(location.protocol === "https:" ? "https" : "http") +
				"://" +
				location.host +
				"/bare/",
		proxy: "",
		transport: "/epoxy/index.mjs",
		autoCloak: "none",
		tabCloak: "none",
		panicKeys: "`",
		panicUrl: "https://classroom.google.com",
	},
	{ ident: "settings", backing: "localstorage", autosave: "auto" }
);

if (store.wispurl === "wss://wisp.mercurywork.shop") {
	store.wispurl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
}

self.store = store;
