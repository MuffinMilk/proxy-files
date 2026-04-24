/// <reference path="../lib/index.d.ts" />

// dumb hack to allow firefox to work (please dont do this in prod)
if (navigator.userAgent.includes("Firefox")) {
	Object.defineProperty(globalThis, "crossOriginIsolated", {
		value: true,
		writable: false,
	});
}

importScripts("/scram/scramjet.all.js");
const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

importScripts("/uv/uv.bundle.js");
importScripts("/uv.config.js");
importScripts("/uv/uv.sw.js");
importScripts("/baremux/index.js");

const uv = new UVServiceWorker();
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

async function handleRequest(event) {
	try {
		await scramjet.loadConfig();
	} catch (e) {
		console.error("Scramjet loadConfig failed:", e);
	}
	
	try {
		if (scramjet && typeof scramjet.route === 'function' && scramjet.route(event)) {
			return scramjet.fetch(event);
		}
	} catch (e) {
		// Scramjet might not be fully loaded
	}

	try {
		if (uv.route(event)) {
			return await uv.fetch(event);
		}
	} catch (e) {
		console.error("Ultraviolet fetch failed:", e);
	}

	return fetch(event.request);
}

self.addEventListener("install", (event) => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event));
});

let playgroundData;
self.addEventListener("message", ({ data }) => {
	if (data.type === "playgroundData") {
		playgroundData = data;
	}
});

scramjet.addEventListener("request", (e) => {
	if (playgroundData && e.url.href.startsWith(playgroundData.origin)) {
		const headers = {};
		const origin = playgroundData.origin;
		if (e.url.href === origin + "/") {
			headers["content-type"] = "text/html";
			e.response = new Response(playgroundData.html, {
				headers,
			});
		} else if (e.url.href === origin + "/style.css") {
			headers["content-type"] = "text/css";
			e.response = new Response(playgroundData.css, {
				headers,
			});
		} else if (e.url.href === origin + "/script.js") {
			headers["content-type"] = "application/javascript";
			e.response = new Response(playgroundData.js, {
				headers,
			});
		} else {
			e.response = new Response("empty response", {
				headers,
			});
		}
		e.response.rawHeaders = headers;
		e.response.rawResponse = {
			body: e.response.body,
			headers: headers,
			status: e.response.status,
			statusText: e.response.statusText,
		};
		e.response.finalURL = e.url.toString();
	} else {
		return;
	}
});
