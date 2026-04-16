const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
	files: {
		wasm: "/scram/scramjet.wasm.wasm",
		all: "/scram/scramjet.all.js",
		sync: "/scram/scramjet.sync.js",
	},
	flags: {
		rewriterLogs: false,
		scramitize: false,
		cleanErrors: true,
		sourcemaps: true,
	},
});

scramjet.init();
navigator.serviceWorker.register("./sw.js");

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
const flex = css`
	display: flex;
`;
const col = css`
	flex-direction: column;
`;

connection.setTransport(store.transport, [{ wisp: store.wispurl }]);

function Config() {
	this.css = `
    transition: opacity 0.4s ease;
    :modal[open] {
        animation: fade 0.4s ease normal;
    }

    :modal::backdrop {
     backdrop-filter: blur(3px);
    }

    .buttons {
      gap: 0.5em;
    }
    .buttons button {
      border: 1px solid #4c8bf5;
      background-color: #313131;
      border-radius: 0.75em;
      color: #fff;
      padding: 0.45em;
    }
    .input_row input {
      background-color: rgb(18, 18, 18);
      border: 2px solid rgb(49, 49, 49);
      border-radius: 0.75em;
      color: #fff;
      outline: none;
      padding: 0.45em;
    }
    .input_row {
      margin-bottom: 0.5em;
      margin-top: 0.5em;
    }
    .input_row input {
      flex-grow: 1;
    }
    .centered {
      justify-content: center;
      align-items: center;
    }
  `;

	function handleModalClose(modal) {
		modal.style.opacity = 0;
		setTimeout(() => {
			modal.close();
			modal.style.opacity = 1;
		}, 250);
	}

	return html`
      <dialog class="cfg" style="background-color: #121212; color: white; border-radius: 8px;">
        <div style="align-self: end">
          <div class=${[flex, "buttons"]}>
            <button on:click=${() => {
							connection.setTransport("/baremod/index.mjs", [store.bareurl]);
							store.transport = "/baremod/index.mjs";
						}}>use bare server 3</button>
            <button on:click=${() => {
							connection.setTransport("/libcurl/index.mjs", [
								{ wisp: store.wispurl },
							]);
							store.transport = "/libcurl/index.mjs";
						}}>use libcurl.js</button>
              <button on:click=${() => {
								connection.setTransport("/epoxy/index.mjs", [
									{ wisp: store.wispurl },
								]);
								store.transport = "/epoxy/index.mjs";
							}}>use epoxy</button>
          </div>
        </div>
        <div class=${[flex, col, "input_row"]}>
          <label for="wisp_url_input">Wisp URL:</label>
          <input id="wisp_url_input" bind:value=${use(store.wispurl)} spellcheck="false"></input>
        </div>
        <div class=${[flex, col, "input_row"]}>
          <label for="bare_url_input">Bare URL:</label>
          <input id="bare_url_input" bind:value=${use(store.bareurl)} spellcheck="false"></input>
        </div>
        <div>${use(store.transport)}</div>
        <div class=${[flex, "buttons", "centered"]}>
          <button on:click=${() => handleModalClose(this.root)}>close</button>
        </div>
      </dialog>
  `;
}

function BrowserApp() {
	this.css = `
		--bg: #000000;
		--bg-2: #0a0a0a;
		--bg-3: #121212;
		--bg-4: #1a1a1a;
		--bg-5: rgba(0, 0, 0, 0.8);
		--browser-controls-height: 98px;
		--browser-bookmarks-height: 38px;
		--browser-toolbar-height: 40px;
		--browser-button-size: 40px;
		--browser-tab-height: 40px;

		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		position: relative;
		background: var(--bg);

		iframe {
			height: calc(100vh - var(--browser-controls-height) - var(--browser-bookmarks-height) - 15px);
			width: calc(100vw - 10px);
			background: #fff;
			position: absolute;
			left: calc(50% - 1px);
			transform: translateX(-50%);
			bottom: 7.5px;
			border: none;
			border-radius: 20px;
			z-index: 2;
		}

		.controls {
			height: calc(var(--browser-controls-height) + var(--browser-bookmarks-height));
			background: var(--bg);
			width: 100vw;
			position: fixed;
			left: 0;
			top: 0;
			padding: 5px;
			box-sizing: border-box;
			transition: height 0.2s ease;
			z-index: 3;
		}

		.tabs {
			position: absolute;
			left: 0;
			top: 2.5px;
			padding: 4px 10px;
			width: 100%;
			height: 44px;
			display: flex;
			gap: 5px;
		}

		.tab {
			background: var(--bg-3);
			width: 200px;
			height: var(--browser-tab-height);
			border-radius: 16px;
			padding: 6px 10px;
			box-sizing: border-box;
			position: relative;
			color: white;
			display: flex;
			align-items: center;
			overflow: hidden;
			white-space: nowrap;
			cursor: default;
			transition: 0.2s;
		}

		.closetab {
			position: absolute;
			right: 12px;
			cursor: pointer;
			font-size: 13px;
		}

		.tab span {
			font-weight: 500;
			width: max-content;
			text-wrap: unset;
			overflow: hidden;
			width: 100%;
			mask-image: linear-gradient(to right, black 60%, transparent 85%);
			-webkit-mask-image: linear-gradient(to right, black 60%, transparent 85%);
		}

		.toolbar {
			position: absolute;
			top: 52px;
			left: -5px;
			justify-items: center;
			justify-content: center;
			box-sizing: border-box;
			height: var(--browser-toolbar-height);
			display: flex;
			width: 100%;
			gap: 8px;
			padding: 0 6px;
		}

		#bar {
			flex: 0.97;
			box-sizing: border-box;
			border-radius: 16px;
			border: none;
			background: var(--bg-2);
			padding: 8px 16px;
			outline: none;
			color: white;
			font-size: 15px;
			transition: 0.2s;
			height: var(--browser-toolbar-height);
		}

		#bar:focus {
			background: var(--bg-3);
		}

		.toolbar button {
			width: var(--browser-button-size);
			height: var(--browser-button-size);
			border-radius: 16px;
			border: none;
			background: var(--bg-2);
			color: white;
			transition: 0.2s;
			cursor: pointer;
			font-size: 15px;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.toolbar button:hover {
			background: var(--bg-3);
		}

		#newtab {
			width: var(--browser-button-size);
			height: var(--browser-button-size);
			border-radius: 16px;
			border: none;
			background: var(--bg-2);
			color: white;
			transition: 0.2s;
			cursor: pointer;
			font-size: 15px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		#newtab:hover {
			background: var(--bg-3);
		}

		.bookmarks {
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			width: 100%;
			height: var(--browser-bookmarks-height);
			padding: 0 6px;
			position: absolute;
			top: 94px;
			gap: 5px;
			overflow: hidden;
			opacity: 1;
		}

		.bookmark {
			border-radius: 100px;
			width: auto;
			height: 100%;
			padding: 2px 11px;
			height: 38px;
			box-sizing: border-box;
			font-size: 13px;
			background: var(--bg-2);
			display: flex;
			align-items: center;
			gap: 5px;
			cursor: pointer;
			transition: 0.2s;
			justify-content: center;
		}

		.bookmark:hover {
			background: var(--bg-3);
		}

		.bookmark span {
			color: white;
			font-weight: 500;
		}
	`;
	this.url = store.url;

	const frame = scramjet.createFrame();

	this.mount = () => {
		let body = btoa(
			`<body style="background: #000; color: #fff; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">Welcome to <i>Scramjet</i>! Type in a URL in the omnibox above and press enter to get started.</body>`
		);
		frame.go(`data:text/html;base64,${body}`);
	};

	frame.addEventListener("urlchange", (e) => {
		if (!e.url) return;
		this.url = e.url;
	});

	const handleSubmit = () => {
		this.url = this.url.trim();
		if (!this.url.startsWith("http")) {
			this.url = "https://" + this.url;
		}

		return frame.go(this.url);
	};

	const cfg = h(Config);
	document.body.appendChild(cfg);

	return html`
		<div>
			<div class="controls">
				<div class="tabs">
					<div class="tab active">
						<span>${use(this.url)}</span>
						<i class="fas fa-times closetab" on:click=${this.onCloseProxy}></i>
					</div>
					<button id="newtab" on:click=${this.onCloseProxy}>
						<i class="fas fa-plus"></i>
					</button>
				</div>
				<div class="toolbar">
					<button on:click=${() => frame.back()}>
						<i class="fas fa-arrow-left"></i>
					</button>
					<button on:click=${() => frame.forward()}>
						<i class="fas fa-arrow-right"></i>
					</button>
					<button on:click=${() => frame.reload()}>
						<i class="fas fa-rotate-right"></i>
					</button>
					<input
						type="text"
						placeholder="Search for something or enter a URL here..."
						id="bar"
						bind:value=${use(this.url)} 
						on:input=${(e) => { this.url = e.target.value; }} 
						on:keyup=${(e) => e.keyCode == 13 && (store.url = this.url) && handleSubmit()}
					/>
					<button on:click=${() => window.open(scramjet.encodeUrl(this.url))}>
						<i class="fas fa-external-link-alt"></i>
					</button>
					<button on:click=${() => document.documentElement.requestFullscreen()}>
						<i class="fas fa-expand"></i>
					</button>
					<button on:click=${() => cfg.showModal()}>
						<i class="fas fa-cog"></i>
					</button>
				</div>
				<div class="bookmarks">
					<div class="bookmark">
						<i class="fas fa-plus" style="color: white"></i>
						<span>New Bookmark</span>
					</div>
				</div>
			</div>
			${frame.frame}
		</div>
	`;
}
function HomeScreen() {
	this.css = `
		--background-color: #000;
		--header-active-background-color: rgba(140, 0, 255, 0.55);
		--header-hover-background-color: rgba(140, 0, 255, 0.13);
		--input-background-color: #0a0a0a;
		--border-color: #525252;
		--text-color: #ffffff;
		--hover-text-color: rgba(255, 255, 255, 0.49);
		--active-text-color: rgba(255, 255, 255, 0.81);
		--navbar-background-color: rgb(22, 22, 22);
		--hr-background: rgba(160, 160, 160, 0.274);
		--button-background-color: #4400ff;
		--button-gradient-color: linear-gradient(304deg, rgb(204, 0, 245) 0%, #4400ff 100%);
		--link-hover-color: #7d2ae8;
		--image-outline-color: #4400ff;
		--dshadow1: #ae00ff;
		--dshadow2: #4400ff;
		--dshadow3: #ff00d4;
		--dshadow4: #8400ff;

		background-color: var(--background-color);
		font-family: 'DM Sans', sans-serif;
		height: 100%;
		width: 100%;
		position: relative;
		overflow: hidden;
		color: var(--text-color);

		.navbar {
			list-style-type: none;
			padding-left: 5px;
			padding-right: 5px;
			padding-top: 5px;
			margin: 0;
			direction: ltr;
			width: 3.5em;
			height: 100%;
			background-color: var(--navbar-background-color);
			position: fixed;
			left: 0;
			top: 0;
			text-align: center;
			box-shadow: 1px 0 1px 0 rgba(66, 66, 66, 0.86);
			z-index: 100;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 10px;
		}

		.navbar hr {
			width: 40px;
			height: 1px;
			background: var(--hr-background);
			border: none;
			margin-top: 10px;
			margin-bottom: 5px;
		}

		.navbar span, .navbar i {
			font-size: 24px;
			padding: 10px;
			color: var(--text-color);
			transition: 0.12s;
			cursor: pointer;
		}

		.navbar span:hover, .navbar i:hover {
			background-color: var(--header-hover-background-color);
			border-radius: 7px;
		}

		#navactive {
			background-color: var(--header-active-background-color);
			border-radius: 7px;
		}

		.header {
			position: absolute;
			transform: translate(-50%, -50%);
			left: 50%;
			top: 50%;
			justify-content: center;
			z-index: 10;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 800px;
		}

		h1 {
			font-size: 50px;
			color: var(--text-color);
			text-align: center;
			margin: -10px;
			animation: fade-in-top 0.6s ease-in-out;
		}

		.typewrite {
			color: var(--link-hover-color);
			filter: drop-shadow(0 0 2px var(--image-outline-color)) drop-shadow(0 0 20px var(--image-outline-color));
		}

		.header p {
			font-size: 20px;
			color: var(--text-color);
			font-weight: 200;
			animation: fade-in-top 0.6s ease-in-out forwards;
			animation-delay: 0.5s;
		}

		.search-header {
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			border-radius: 30px;
			margin-top: 30px;
			animation: fade-in-bottom 0.6s ease-in-out forwards;
			animation-delay: 0.8s;
		}

		.search-header__input {
			font-family: 'DM Sans';
			font-size: 16px;
			background-color: var(--input-background-color);
			border: solid 0.5px var(--border-color);
			color: var(--text-color);
			padding: 0.7rem 1.5rem;
			border-radius: 25px;
			width: 300px;
			height: 45px;
			transition: all ease-in-out 0.5s;
			text-align: center;
			box-sizing: border-box;
		}

		.search-header__input:hover,
		.search-header__input:focus {
			box-shadow: 10px 5px 40px -10px var(--dshadow1), -14px -4px 40px -10px var(--dshadow2);
			width: 350px;
			outline: none;
			background-color: #0a0a0af0;
		}

		.search-header__input::-webkit-input-placeholder {
			font-weight: 200;
			color: #868686;
		}

		.blob {
			box-shadow: 0 0 150px 100px var(--link-hover-color);
			border-radius: 50%;
			height: 290px;
			width: 290px;
			background-image: radial-gradient(farthest-corner at 50% 50%, #ffffff, var(--dshadow3));
			background-blend-mode: multiply;
			filter: blur(50px) contrast(1.1);
			position: absolute;
			transform: translate(-50%, -50%);
			left: 47vw;
			top: 100vh;
			z-index: 1;
		}

		.blobbig {
			box-shadow: 0 0 150px 100px var(--link-hover-color);
			border-radius: 100%;
			height: 45vh;
			width: 75vw;
			opacity: 0.15;
			background-image: radial-gradient(farthest-corner at 50% 50%, #ffffff, var(--dshadow4));
			background-blend-mode: multiply;
			filter: blur(50px) contrast(1.1);
			position: absolute;
			transform: translate(-50%, -35%);
			left: 47vw;
			top: 100vh;
			z-index: 1;
		}

		.blobsmall {
			box-shadow: 0 0 150px 50px var(--dshadow4);
			border-radius: 50%;
			height: 50px;
			width: 340px;
			background-image: radial-gradient(farthest-corner at 50% 50%, #ffffff, var(--dshadow3));
			background-blend-mode: multiply;
			filter: blur(50px) contrast(1.2);
			position: absolute;
			transform: translate(-50%, -50%);
			left: 60vw;
			top: 100vh;
			z-index: 1;
		}

		.blobtop {
			box-shadow: 0 0 1px 20px var(--dshadow4);
			border-radius: 50%;
			height: 230px;
			width: 20px;
			background-image: radial-gradient(farthest-corner at 50% 50%, #ffffff, var(--dshadow3));
			background-blend-mode: multiply;
			filter: blur(50px) contrast(1.1);
			position: absolute;
			transform: translate(-50%, -50%);
			rotate: -20deg;
			left: 41.6vw;
			top: calc(89vh - 200px);
			z-index: 1;
		}

		#particles-js {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 2;
		}

		@keyframes fade-in-top {
			0% { transform: translateY(-50px); opacity: 0; }
			100% { transform: translateY(0); opacity: 1; }
		}

		@keyframes fade-in-bottom {
			0% { transform: translateY(50px); opacity: 0; }
			100% { transform: translateY(0); opacity: 1; }
		}
	`;

	this.searchQuery = "";

	this.handleSearch = (e) => {
		if (e.key === 'Enter' && this.searchQuery.trim()) {
			let url = this.searchQuery.trim();
			if (!url.startsWith('http') && !url.includes('.')) {
				url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
			} else if (!url.startsWith('http')) {
				url = 'https://' + url;
			}
			store.url = url;
			this.onOpenProxy();
		}
	};

	// Initialize particles and lucide icons after render
	setTimeout(() => {
		if (window.lucide) window.lucide.createIcons();
		if (window.particlesJS) {
			window.particlesJS('particles-js', {
				particles: {
					number: { value: 86, density: { enable: true, value_area: 800 } },
					color: { value: '#ffffff' },
					shape: { type: 'circle' },
					opacity: { value: 1, random: true, anim: { enable: false } },
					size: { value: 2, random: true, anim: { enable: false } },
					line_linked: { enable: false },
					move: { enable: true, speed: 0.5, direction: 'top', random: false, straight: false, out_mode: 'out', bounce: false }
				},
				interactivity: {
					detect_on: 'window',
					events: { onhover: { enable: false }, onclick: { enable: true, mode: 'push' }, resize: true },
					modes: { push: { particles_nb: 10 } }
				},
				retina_detect: true
			});
		}
	}, 100);

	const randomMessages = [
		"work gng 🥀",
		"this website took long af ngl",
		"homeless robert is fat ngl",
		"i have 14 homegirls",
		"just do your work gng",
		"lamar is mid",
		"WHO HAS THE FIGHT",
		"shi idk-awdre"
	];
	const splashText = randomMessages[Math.floor(Math.random() * randomMessages.length)];

	return html`
		<div style="height: 100%; width: 100%;">
			<ul class="navbar">
				<li style="margin-top: 10px;"></li>
				<hr />
				<li><span id="navactive" class="material-symbols-outlined">cottage</span></li>
				<li><span class="material-symbols-outlined">joystick</span></li>
				<li><span class="material-symbols-outlined">apps</span></li>
				<li><span class="material-symbols-outlined">public</span></li>
				<hr />
				<li><span class="material-symbols-outlined">tune</span></li>
				<li><i class="fa-brands fa-discord"></i></li>
			</ul>

			<div class="header">
				<h1>
					Welcome to
					<span style="cursor: text">
						<span class="typewrite">awdres proxy biga</span>
					</span>
				</h1>
				<div style="text-align: center">
					<p>${splashText}</p>
					
					<div class="search-header">
						<input 
							class="search-header__input"
							type="text"
							placeholder="Search the web freely..." 
							bind:value=${use(this.searchQuery)}
							on:input=${(e) => this.searchQuery = e.target.value}
							on:keydown=${this.handleSearch}
						/>
					</div>
				</div>
			</div>

			<div style="z-index: 1">
				<div class="blob"></div>
				<div class="blobbig"></div>
				<div class="blobsmall"></div>
				<div class="blobtop"></div>
				<div id="particles-js"></div>
			</div>
		</div>
	`;
}

function AppContainer() {
	this.showProxy = false;
	this.css = `
		width: 100%;
		height: 100%;
	`;

	return html`
		<div>
			${use(this.showProxy, show => show ? h(BrowserApp, { onCloseProxy: () => this.showProxy = false }) : h(HomeScreen, { onOpenProxy: () => this.showProxy = true }))}
		</div>
	`;
}

window.addEventListener("load", async () => {
	const root = document.getElementById("app");
	try {
		root.replaceWith(h(AppContainer));
	} catch (e) {
		root.replaceWith(document.createTextNode("" + e));
		throw e;
	}
	function b64(buffer) {
		let binary = "";
		const bytes = new Uint8Array(buffer);
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}

		return btoa(binary);
	}
	const arraybuffer = await (await fetch("/assets/scramjet.png")).arrayBuffer();
	console.log(
		"%cb",
		`
      background-image: url(data:image/png;base64,${b64(arraybuffer)});
      color: transparent;
      padding-left: 200px;
      padding-bottom: 100px;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
  `
	);
});
