// Dev server imports
import { createBareServer } from "@nebula-services/bare-server-node";
import { createServer } from "http";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { join } from "node:path";
import rspackConfig from "./rspack.config.js";
import { rspack } from "@rspack/core";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

//transports
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { chmodSync, mkdirSync, writeFileSync } from "fs";

import { uvPath } from "@titaniumnetwork-dev/ultraviolet";

const bare = createBareServer("/bare/", {
	logErrors: true,
	blockLocal: false,
});

wisp.options.allow_loopback_ips = true;
wisp.options.allow_private_ips = true;

const fastify = Fastify({
	serverFactory: (handler) => {
		return createServer()
			.on("request", (req, res) => {
				if (bare.shouldRoute(req)) {
					bare.routeRequest(req, res);
				} else {
					handler(req, res);
				}
			})
			.on("upgrade", (req, socket, head) => {
				if (bare.shouldRoute(req)) {
					bare.routeUpgrade(req, socket, head);
				} else {
					wisp.routeRequest(req, socket, head);
				}
			});
	},
});

fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "./static"),
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: uvPath,
	prefix: "/uv/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "./dist"),
	prefix: "/scram/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "./assets"),
	prefix: "/assets/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "./public/baremux"),
	prefix: "/baremux/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "./public/epoxy"),
	prefix: "/epoxy/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "./public/libcurl"),
	prefix: "/libcurl/",
	decorateReply: false,
});
fastify.register(fastifyStatic, {
	root: join(fileURLToPath(new URL(".", import.meta.url)), "./public/baremod"),
	prefix: "/baremod/",
	decorateReply: false,
});

fastify.get("/api/games.json", async (request, reply) => {
	try {
		const sources = [
			{ name: "gnmath", url: "https://raw.githubusercontent.com/Green-Network/gn-math/main/asset/json/zones/gnmath.json" },
			{ name: "gnports", url: "https://raw.githubusercontent.com/Green-Network/gn-math/main/asset/json/zones/gnports.json" },
			{ name: "truffled", url: "https://raw.githubusercontent.com/Green-Network/gn-math/main/asset/json/zones/truffled.json" }
		];
		
		const results = await Promise.all(
			sources.map((s) =>
				fetch(s.url)
					.then((r) => r.json())
					.catch((err) => {
						console.error(`Failed to fetch source ${s.name}:`, err);
						return [];
					})
			)
		);
		const allGames = [];
		const seen = new Set();
		for (const list of results) {
			if (!Array.isArray(list)) continue;
			for (const g of list) {
				if (g && g.name && !seen.has(g.name)) {
					seen.add(g.name);
					// Ensure URL is absolute or fix it if it's from GN-Math
					if (g.url && g.url.startsWith("/") && !g.url.startsWith("//")) {
						g.url = "https://raw.githack.com/Green-Network/gn-math/main" + g.url;
					}
					allGames.push(g);
				}
			}
		}
		reply.send(allGames);
	} catch (e) {
		console.error("Games fetch error:", e);
		reply.status(500).send({ error: "Failed to fetch games" });
	}
});

const PORT = 3000;

fastify.listen({
	port: PORT,
	host: "0.0.0.0",
});


fastify.setNotFoundHandler((request, reply) => {
	console.error("PAGE PUNCHED THROUGH SW - " + request.url);
	reply.code(593).send("punch through");
});
console.log(`Listening on http://localhost:${PORT}/`);
if (!process.env.CI) {
	try {
		writeFileSync(
			".git/hooks/pre-commit",
			"pnpm format\ngit update-index --again"
		);
		chmodSync(".git/hooks/pre-commit", 0o755);
	} catch {}

	const compiler = rspack(rspackConfig);
	compiler.watch({}, (err, stats) => {
		console.log(
			stats
				? stats.toString({
						preset: "minimal",
						colors: true,
						version: false,
					})
				: ""
		);
	});
}
