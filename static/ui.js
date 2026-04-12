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
    width: 100%;
    height: 100%;
    color: #e0def4;
    display: flex;
    flex-direction: column;
    padding: 0.5em;
    padding-top: 0;
    box-sizing: border-box;

    a {
      color: #e0def4;
    }

    input,
    button {
      font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont,
        sans-serif;
    }
    .version {
    }
    h1 {
      font-family: "Inter Tight", "Inter", system-ui, -apple-system, BlinkMacSystemFont,
      sans-serif;
      margin-bottom: 0;
    }
    iframe {
      background-color: #fff;
      border: none;
      border-radius: 0.3em;
      flex: 1;
      width: 100%;
    }

    input.bar {
      font-family: "Inter";
      padding: 0.1em;
      padding-left: 0.3em;
      border: none;
      outline: none;
      color: #fff;
      height: 1.5em;
      border-radius: 0.3em;
      flex: 1;

      background-color: #121212;
      border: 1px solid #313131;
    }
    .input_row > label {
      font-size: 0.7rem;
      color: gray;
    }
    p {
      margin: 0;
      margin-top: 0.2em;
    }

    .nav {
      padding-top: 0.3em;
      padding-bottom: 0.3em;
      gap: 0.3em;
    }
    spacer {
      margin-left: 10em;
    }

    .nav button {
      color: #fff;
      outline: none;
      border: none;
      border-radius: 0.30em;
      background-color: #121212;
      border: 1px solid #313131;
    }
  `;
	this.url = store.url;

	const frame = scramjet.createFrame();

	this.mount = () => {
		let body = btoa(
			`<body style="background: #000; color: #fff">Welcome to <i>Scramjet</i>! Type in a URL in the omnibox above and press enter to get started.</body>`
		);
		frame.go(`data:text/html;base64,${body}`);
	};

	frame.addEventListener("urlchange", (e) => {
		if (!e.url) return;
		this.url = e.url;
	});

	const handleSubmit = () => {
		this.url = this.url.trim();
		//  frame.go(this.url)
		if (!this.url.startsWith("http")) {
			this.url = "https://" + this.url;
		}

		return frame.go(this.url);
	};

	const cfg = h(Config);
	document.body.appendChild(cfg);
	this.githubURL = `https://github.com/MercuryWorkshop/scramjet/commit/${$scramjetVersion.build}`;

	return html`
      <div>
      <div class=${[flex, "nav"]}>

        <button on:click=${this.onCloseProxy}>home</button>
        <button on:click=${() => cfg.showModal()}>config</button>
        <button on:click=${() => frame.back()}>&lt;-</button>
        <button on:click=${() => frame.forward()}>-&gt;</button>
        <button on:click=${() => frame.reload()}>&#x21bb;</button>

        <input class="bar" autocomplete="off" autocapitalize="off" autocorrect="off" 
        bind:value=${use(this.url)} on:input=${(e) => {
					this.url = e.target.value;
				}} on:keyup=${(e) => e.keyCode == 13 && (store.url = this.url) && handleSubmit()}></input>

        <button on:click=${() => window.open(scramjet.encodeUrl(this.url))}>open</button>

        <p class="version">
          <b>scramjet</b> ${$scramjetVersion.version} <a href=${use(this.githubURL)}>${$scramjetVersion.build}</a>
        </p>
      </div>
      ${frame.frame}
    </div>
    `;
}
function HomeScreen() {
	this.css = `
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		background: radial-gradient(circle at center, #2a2f3a 0%, #17191f 100%);
		color: white;
		font-family: "Inter", system-ui, sans-serif;
		position: relative;

		.clock {
			position: absolute;
			top: 2em;
			color: #a0a5b5;
			font-size: 1.1em;
			letter-spacing: 0.05em;
		}

		.title-container {
			display: flex;
			align-items: baseline;
			gap: 0.3em;
			cursor: pointer;
			user-select: none;
			transition: transform 0.2s;
		}

		.title-container:hover {
			transform: scale(1.02);
		}

		h1 {
			font-family: "Inter Tight", sans-serif;
			font-size: 7em;
			margin: 0;
			font-weight: 900;
			background: linear-gradient(to right, #4a5265, #a5b3ce);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			letter-spacing: -0.02em;
		}

		.v4 {
			font-family: "Inter Tight", sans-serif;
			font-size: 5.5em;
			font-weight: 900;
			color: #a5b3ce;
		}

		.subtitle {
			color: #a0a5b5;
			font-size: 1.2em;
			margin-top: 0.5em;
			letter-spacing: 0.02em;
		}

		.bottom-text {
			position: absolute;
			bottom: 2em;
			color: #a0a5b5;
			font-size: 1.1em;
		}

		.home-btn {
			position: absolute;
			bottom: 2em;
			left: 2em;
			background: #252932;
			border: none;
			border-radius: 0.5em;
			width: 3em;
			height: 3em;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: background 0.2s;
		}

		.home-btn:hover {
			background: #2f3440;
		}

		.home-btn svg {
			width: 1.5em;
			height: 1.5em;
			fill: #a0a5b5;
		}

		.proxy-btn {
			margin-top: 2.5em;
			padding: 0.8em 2.5em;
			font-size: 1.2em;
			background-color: #252932;
			color: #a5b3ce;
			border: 1px solid #3a4154;
			border-radius: 0.5em;
			cursor: pointer;
			transition: all 0.2s;
			font-family: inherit;
		}

		.proxy-btn:hover {
			background-color: #2f3440;
			color: white;
		}
	`;

	this.time = "";
	
	this.updateTime = () => {
		const now = new Date();
		const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
		const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
		this.time = `${timeStr} | ${dateStr}`;
	};

	this.mount = () => {
		this.updateTime();
		this.interval = setInterval(this.updateTime, 1000);
	};

	return html`
		<div>
			<div class="clock">${use(this.time)}</div>
			
			<div class="title-container" on:click=${this.onOpenProxy}>
				<h1>VAPOR</h1>
				<span class="v4">v4</span>
			</div>
			<div class="subtitle">erahs htiw sdneirf</div>
			
			<button class="proxy-btn" on:click=${this.onOpenProxy}>Proxy</button>

			<button class="home-btn">
				<svg viewBox="0 0 24 24">
					<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
				</svg>
			</button>

			<div class="bottom-text">v4.4</div>
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
