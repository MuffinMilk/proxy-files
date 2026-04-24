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

async function registerSW() {
	if (!("serviceWorker" in navigator)) return;
	try {
		await navigator.serviceWorker.register("/sw.js", { scope: "/" });
	} catch (e) {
		console.error("SW Registration failed:", e);
	}
}
registerSW();

try {
	scramjet.init();
} catch (e) {
	console.error("Scramjet init failed:", e);
}

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

    .cfg-iframe {
      width: 800px;
      height: 600px;
      border: none;
      border-radius: 8px;
    }
    
    .close-cfg-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      z-index: 1000;
    }
    
    .close-cfg-btn:hover {
      background: rgba(255, 0, 0, 0.5);
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
		<dialog
			class="cfg"
			style="background-color: #121212; color: white; border-radius: 8px; padding: 0; position: relative; overflow: hidden; border: 1px solid #333;"
		>
			<button
				class="close-cfg-btn"
				on:click=${() => handleModalClose(this.root)}
			>
				<i class="fa-solid fa-xmark"></i>
			</button>
			<iframe
				class="cfg-iframe"
				src="about:blank"
			></iframe>
		</dialog>
	`;
}
function BrowserApp() {
	this.css = `
		--navbar-background-color: #0b0b0b;
		--header-active-background-color: rgba(140, 0, 255, 0.55);
		--header-hover-background-color: rgba(140, 0, 255, 0.13);
		--hr-background: rgba(160, 160, 160, 0.274);
		--text-color: #ffffff;
		--utility-background-color: #0b0b0b;

		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		position: relative;
		background: #000;
		font-family: 'DM Sans', sans-serif;

		/* Global Navbar */
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
			box-shadow: 1px 0 1px 0 rgba(0,0,0,0.86);
			z-index: 2147483641;
		}

		.navbar img.logo {
			width: 40px;
			height: 40px;
			border-radius: 10px;
		}

		.navbar hr { width: 40px; height: 1px; background: var(--hr-background); border: none; margin-top: 5px; margin-bottom: 5px; display: inline-block; }
		.navbar span, .navbar i { font-size: 24px; padding: 10px; color: var(--text-color); transition: 0.12s; cursor: pointer; display: inline-block; }
		.navbar span:hover, .navbar i:hover { background-color: var(--header-hover-background-color); border-radius: 7px; }
		#navactive { background-color: var(--header-active-background-color); border-radius: 7px; color: white !important; }

		/* Utility Bar (Top) */
		.utilityBar {
			position: fixed;
			left: 3.5em; 
			top: 0;
			width: calc(100% - 3.5em);
			height: 58px;
			background-color: var(--utility-background-color);
			z-index: 2147483640;
			display: flex;
			align-items: center;
			padding-left: 5px;
			padding-right: 15px;
		}

		.utilityBar::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 1px;
			background: rgba(255, 255, 255, 0.05); /* thin divider */
		}

		.utility {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			align-items: center;
			width: 100%;
		}

		.utility li {
			display: inline-block;
			margin-left: 2px;
			margin-right: 2px;
		}

		.utilityIcon {
			cursor: pointer;
			color: var(--text-color);
			padding: 6px;
			border-radius: 7px;
			transition: 0.2s;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.utilityIcon:hover {
			background-color: var(--header-hover-background-color);
		}

		.utilityIcon span {
			font-size: 20px;
		}

		.utility hr {
			width: 1px;
			height: 20px;
			min-width: 1px;
			background: var(--hr-background);
			border: none;
			margin-left: 10px;
			margin-right: 10px;
		}

		.search-header {
			flex-grow: 1;
			margin-left: 10px;
			margin-right: 10px;
			position: relative;
			display: flex;
			align-items: center;
		}

		.search-header__input {
			font-family: 'DM Sans', sans-serif;
			font-size: 14px;
			background-color: #121212;
			border: solid 1px #333;
			color: #fff;
			padding: 0.5rem 1rem 0.5rem 40px;
			border-radius: 25px;
			height: 24px;
			min-width: 240px;
			box-sizing: content-box;
			width: 100%;
			transition: ease-in-out 0.2s;
		}

		.search-header__input:focus, .search-header__input:hover {
			outline: none;
			border-color: #ae00ff;
			color: rgba(255, 255, 255, 0.9);
		}

		.search-header__button {
			position: absolute;
			left: 12px;
			margin-top: 1px;
			background: none;
			border: none;
			color: var(--text-color);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			pointer-events: none;
		}

		.proxyWrapper {
			position: absolute;
			top: 58px;
			left: 3.5em;
			width: calc(100% - 3.5em);
			height: calc(100% - 58px);
			background: #000;
		}

		iframe {
			width: 100%;
			height: 100%;
			border: none;
			background: #000;
		}
	`;
	this.url = store.url;

	this.mount = () => {
		const isUv = store.proxy === "ultraviolet";
		let frame;
		if (isUv) {
			const iframeElement = document.createElement("iframe");
			iframeElement.style.cssText = "width:100%;height:100%;border:none;background:#000;";
			frame = {
				frame: iframeElement,
				go: (targetUrl) => {
					if (targetUrl.startsWith("data:text/html")) {
						iframeElement.src = targetUrl;
					} else {
						if (typeof __uv$config === "undefined") {
							console.error("Ultraviolet config missing, attempting reload...");
							location.reload();
							return;
						}
						iframeElement.src = __uv$config.prefix + __uv$config.encodeUrl(targetUrl);
					}
				},
				back: () => { try { iframeElement.contentWindow?.history.back() } catch(e){} },
				forward: () => { try { iframeElement.contentWindow?.history.forward() } catch(e){} },
				reload: () => { try { iframeElement.contentWindow?.location.reload() } catch(e){} },
				addEventListener: (event, cb) => {
					if (event === "urlchange") {
						// Simple polling fallback for UV iframe
						setInterval(() => {
							try {
								const currentUrl = iframeElement.contentWindow?.location.href;
								// We can't easily sync this.url for cross-origin UV URLs without decoder
							} catch (e) {}
						}, 2000);
					}
				}
			};
		} else {
			frame = scramjet.createFrame();
		}

		const handleMessage = (e) => {
			if (e.data && e.data.type === "scramjet-navigate") {
				this.url = e.data.url;
				handleSubmit();
			}
		};

		if (window._scramjetMsgHandler) window.removeEventListener("message", window._scramjetMsgHandler);
		window._scramjetMsgHandler = handleMessage;
		window.addEventListener("message", handleMessage);

		const htmlStart = `<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');
    body, html { margin: 0; padding: 0; height: 100%; font-family: 'DM Sans', sans-serif; background-color: #000; color: #fff; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    
    .blob { box-shadow: 0 0 150px 100px #ae00ff; border-radius: 50%; height: 290px; width: 290px; background-image: radial-gradient(farthest-corner at 50% 50%, #ffffff, #ff00d4); background-blend-mode: multiply; filter: blur(50px) contrast(1.1); position: fixed; transform: translate(-50%, -50%); left: 47vw; top: 100vh; position: absolute; z-index: 0; }
    .blobbig { box-shadow: 0 0 150px 100px #4400ff; border-radius: 100%; height: 45vh; width: 75vw; opacity: 0.15; background-image: radial-gradient(farthest-corner at 50% 50%, #ffffff, #8400ff); background-blend-mode: multiply; filter: blur(50px) contrast(1.1); position: fixed; transform: translate(-50%, -35%); left: 47vw; top: 100vh; position: absolute; z-index: 0; }
    .blobsmall { box-shadow: 0 0 150px 50px #8400ff; border-radius: 50%; height: 50px; width: 340px; background-image: radial-gradient(farthest-corner at 50% 50%, #ffffff, #ff00d4); background-blend-mode: multiply; filter: blur(50px) contrast(1.1); position: fixed; transform: translate(-50%, -50%); left: 47vw; top: 100vh; position: absolute; z-index: 0; }
    
    #particles-js { position: absolute; width: 100%; height: 100%; z-index: 1; }
    
    .container { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; margin-top: -50px; }
    
    .search-bar { display: flex; align-items: center; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.08); border-radius: 30px; padding: 12px 24px; width: 650px; margin-bottom: 50px; transition: 0.2s; box-shadow: 0 4px 20px rgba(0,0,0,0.3); backdrop-filter: blur(5px); }
    .search-bar:focus-within { border-color: rgba(255,255,255,0.2); }
    .search-bar img { height: 24px; margin-right: 12px; }
    .search-bar input { background: transparent; border: none; color: #fff; font-size: 18px; outline: none; width: 100%; font-family: 'DM Sans', sans-serif; }
    .search-bar input::placeholder { color: #888; }
    .search-bar svg { width: 22px; height: 22px; fill: #666; margin-left: auto; cursor: pointer; }

    .cards { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; width: 880px; }
    
    .card {
      border-radius: 14px; height: 75px; display: flex; align-items: center; justify-content: center; text-decoration: none; color: white; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; border: none; outline: none; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: 'DM Sans', sans-serif;
    }
    .card:hover { transform: scale(1.03) translateY(-2px); }
    .card img { height: 32px; flex-shrink: 0; }
    
    .c-google { background: #fff; color: #000; }
    .c-google img { height: 28px; }
    .c-youtube { background: #fff; color: #000; }
    .c-youtube img { height: 28px; }
    .c-spotify { background: #1DB954; }
    .c-spotify img { height: 36px; filter: brightness(0) invert(1); }
    .c-discord { background: #5865F2; }
    .c-discord img { height: 24px; filter: brightness(0) invert(1); }
    .c-chatgpt { background: #10A37F; }
    .c-chatgpt img { height: 26px; filter: brightness(0) invert(1); }
    .c-geforce { background: #76B900; color: #000; }
    .c-geforce img { height: 28px; }
    .c-github { background: #111; border: 1px solid #333; }
    .c-github img { height: 36px; }
    .c-twitch { background: #9146FF; }
    .c-twitch img { height: 32px; }
    .c-espn { background: #CC0000; color: #fff; }
    .c-tiktok { background: #111; border: 1px solid #333; }
    .c-tiktok img { height: 28px; filter: brightness(0) invert(1); }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
</head>
<body>
  <div class="blobbig"></div>
  <div class="blob"></div>
  <div class="blobsmall"></div>
  <div id="particles-js"></div>
  <div class="container">
    <div class="search-bar">
      <img src="https://api.iconify.design/logos:google-icon.svg">
      <input type="text" placeholder="Search the web or enter URL" id="q" onkeydown="if(event.key==='Enter') navigate(this.value);" autocomplete="off" />
      <svg viewBox="0 0 18 18"><path d="M7.132 0C3.197 0 0 3.124 0 6.97c0 3.844 3.197 6.969 7.132 6.969 1.557 0 2.995-.49 4.169-1.32L16.82 18 18 16.847l-5.454-5.342a6.846 6.846 0 0 0 1.718-4.536C14.264 3.124 11.067 0 7.132 0zm0 .82c3.48 0 6.293 2.748 6.293 6.15 0 3.4-2.813 6.149-6.293 6.149S.839 10.37.839 6.969C.839 3.568 3.651.82 7.132.82z"></path></svg>
    </div>
    
    <div class="cards">
      <button class="card c-google" onclick="navigate('https://google.com')"><img src="https://api.iconify.design/logos:google.svg"></button>
      <button class="card c-youtube" onclick="navigate('https://youtube.com')"><img src="https://api.iconify.design/logos:youtube.svg"></button>
      <button class="card c-spotify" onclick="navigate('https://open.spotify.com')"><img src="https://api.iconify.design/logos:spotify.svg"></button>
      <button class="card c-discord" onclick="navigate('https://discord.com/app')"><img src="https://api.iconify.design/logos:discord.svg"></button>
      <button class="card c-chatgpt" onclick="navigate('https://chatgpt.com')"><img src="https://api.iconify.design/logos:openai-icon.svg"><span style="font-size:20px; font-weight:600">ChatGPT</span></button>

      <button class="card c-geforce" onclick="navigate('https://play.geforcenow.com')"><img src="https://api.iconify.design/simple-icons:nvidia.svg?color=black"><span style="font-size:16px; font-weight:900; letter-spacing:-0.5px; text-transform:uppercase">NVIDIA<br/>GEFORCE NOW</span></button>
      <button class="card c-github" onclick="navigate('https://github.com')"><img src="https://api.iconify.design/mdi:github.svg?color=white"><span style="font-size:22px; font-weight:700">GitHub</span></button>
      <button class="card c-twitch" onclick="navigate('https://twitch.tv')"><img src="https://api.iconify.design/logos:twitch.svg" style="height:35px"></button>
      <button class="card c-espn" onclick="navigate('https://espn.com')"><span style="font-size:38px; font-weight:900; letter-spacing:-2.5px; font-style:italic">ESPN</span></button>
      <button class="card c-tiktok" onclick="navigate('https://tiktok.com')"><img src="https://api.iconify.design/logos:tiktok-icon.svg"><span style="font-size:22px; font-weight:700">TikTok</span></button>
    </div>
  </div>
  
  <script>
    function navigate(url) {
      if(!url.trim()) return;
      if(!url.startsWith('http') && !url.includes('.')) url = 'https://duckduckgo.com/?q=' + encodeURIComponent(url);
      else if (!url.startsWith('http')) url = 'https://' + url;
      window.parent.postMessage({ type: 'scramjet-navigate', url: url }, '*');
    }
    document.getElementById('q').focus();
    particlesJS('particles-js', {
      particles: { number: { value: 86, density: { enable: true, value_area: 800 } }, color: { value: '#ffffff' }, size: { value: 2, random: true }, opacity: { value: 1, random: true }, line_linked: { enable: false }, move: { enable: true, speed: 0.5, direction: 'top' } }
    });
  </script>
</body>
</html>`;
		const encoded = btoa(unescape(encodeURIComponent(htmlStart)));
		if (!this.url || this.url === "") {
			frame.go(`data:text/html;base64,${encoded}`);
		} else {
			frame.go(this.url);
		}

		return html`
			<div>
				<ul class="navbar">
					<li style="margin-left: 0px; margin-top: 10px; margin-bottom: 5px;">
						<img
							class="logo"
							src="/assets/logo.webp"
							alt="Logo"
							onerror="this.src='https://api.dicebear.com/7.x/initials/png?seed=D&backgroundColor=111111&textColor=ffffff'"
						/>
					</li>
					<hr style="margin-top: 5px" />
					<li>
						<span class="material-symbols-outlined" on:click=${this.onCloseProxy}>cottage</span>
					</li>
					<li>
						<span class="material-symbols-outlined" on:click=${this.onCloseProxy}>joystick</span>
					</li>
					<li>
						<span class="material-symbols-outlined" on:click=${this.onCloseProxy}>apps</span>
					</li>
					<li>
						<span id="navactive" class="material-symbols-outlined">public</span>
					</li>
					<hr />
					<li>
						<span class="material-symbols-outlined" on:click=${this.onSettings}>tune</span>
					</li>
				</ul>

				<div class="utilityBar">
					<ul class="utility">
						<li>
							<div class="utilityIcon" on:click=${() => frame.back()}>
								<span class="material-symbols-outlined">arrow_back</span>
							</div>
						</li>
						<li>
							<div class="utilityIcon" on:click=${() => frame.reload()}>
								<span class="material-symbols-outlined">refresh</span>
							</div>
						</li>
						<li>
							<div class="utilityIcon" on:click=${() => frame.forward()}>
								<span class="material-symbols-outlined">arrow_forward</span>
							</div>
						</li>
						<hr />
						<div class="search-header">
							<button class="search-header__button">
								<span class="material-symbols-outlined" style="font-size: 18px; color: #888;">public</span>
							</button>
							<input
								class="search-header__input"
								placeholder="Search the web or enter URL"
								value=${use(this.url)}
								on:input=${(e) => (this.url = e.target.value)}
								on:keydown=${(e) => e.key === "Enter" && handleSubmit()}
							/>
						</div>
						<hr style="margin-left: 0; min-width: 1px" />
						<li>
							<div
								class="utilityIcon"
								on:click=${() => {
									this.url = "";
									store.url = "";
									this.mount();
								}}
							>
								<span class="material-symbols-outlined">cottage</span>
							</div>
						</li>
						<li>
							<div
								class="utilityIcon"
								on:click=${() => document.documentElement.requestFullscreen()}
							>
								<span class="material-symbols-outlined">fullscreen</span>
							</div>
						</li>
					</ul>
				</div>

				<div class="proxyWrapper">${frame.frame}</div>
			</div>
		`;
	};

	const handleSubmit = () => {
		let target = this.url.trim();
		if (!target) {
			this.mount();
			return;
		}
		if (!target.startsWith("http") && (target.includes(".") && !target.includes(" "))) {
			target = "https://" + target;
		} else if (!target.startsWith("http")) {
			target = "https://www.google.com/search?q=" + encodeURIComponent(target);
		}
		this.url = target;
		store.url = target;
		return frame.go(target);
	};

	return html`${use(this.mount)}`;
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
		}

		.navbar hr {
			width: 40px;
			height: 1px;
			background: var(--hr-background);
			border: none;
			margin-top: 10px;
			margin-bottom: 5px;
			display: inline-block;
		}

		.navbar span, .navbar i {
			font-size: 24px;
			padding: 10px;
			color: var(--text-color);
			transition: 0.12s;
			cursor: pointer;
			display: inline-block;
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

		.info-widget {
			position: absolute;
			top: 20px;
			right: 20px;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			gap: 5px;
			z-index: 100;
			background: rgba(22, 22, 22, 0.4);
			backdrop-filter: blur(10px);
			padding: 15px 20px;
			border-radius: 20px;
			border: 1px solid rgba(255, 255, 255, 0.1);
			color: rgba(255, 255, 255, 0.8);
			font-family: 'DM Sans', sans-serif;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
			animation: fade-in-top 0.6s ease-in-out;
		}

		.info-widget .time {
			font-size: 32px;
			font-weight: 700;
			color: #fff;
			line-height: 1;
		}

		.info-widget .date {
			font-size: 14px;
			opacity: 0.8;
			margin-bottom: 5px;
		}

		.info-widget .row {
			display: flex;
			gap: 15px;
			font-size: 14px;
			font-weight: 500;
			margin-top: 5px;
		}

		.info-widget .item {
			display: flex;
			align-items: center;
			gap: 6px;
		}
	`;

	this.searchQuery = "";

	this.handleSearch = (e) => {
		if (e.key === "Enter" && this.searchQuery.trim()) {
			let url = this.searchQuery.trim();
			if (!url.startsWith("http") && !url.includes(".")) {
				url = "https://duckduckgo.com/?q=" + encodeURIComponent(url);
			} else if (!url.startsWith("http")) {
				url = "https://" + url;
			}
			store.url = url;
			this.onOpenProxy();
		}
	};

	// Initialize particles and lucide icons after render
	setTimeout(() => {
		if (window.lucide) window.lucide.createIcons();
		if (window.particlesJS) {
			window.particlesJS("particles-js", {
				particles: {
					number: { value: 86, density: { enable: true, value_area: 800 } },
					color: { value: "#ffffff" },
					shape: { type: "circle" },
					opacity: { value: 1, random: true, anim: { enable: false } },
					size: { value: 2, random: true, anim: { enable: false } },
					line_linked: { enable: false },
					move: {
						enable: true,
						speed: 0.5,
						direction: "top",
						random: false,
						straight: false,
						out_mode: "out",
						bounce: false,
					},
				},
				interactivity: {
					detect_on: "window",
					events: {
						onhover: { enable: false },
						onclick: { enable: true, mode: "push" },
						resize: true,
					},
					modes: { push: { particles_nb: 10 } },
				},
				retina_detect: true,
			});
		}

		// Widget Logic
		const updateTime = () => {
			const timeEl = document.getElementById("widget-time");
			const dateEl = document.getElementById("widget-date");
			if (!timeEl || !dateEl) return;
			const now = new Date();
			timeEl.innerText = now.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
			dateEl.innerText = now.toLocaleDateString([], {
				weekday: "long",
				month: "short",
				day: "numeric",
			});
		};
		updateTime();
		setInterval(updateTime, 1000);

		const batteryEl = document.getElementById("widget-battery");
		if (navigator.getBattery && batteryEl) {
			navigator.getBattery().then((battery) => {
				const updateBattery = () => {
					let icon = "fa-battery-full";
					if (battery.level <= 0.2) icon = "fa-battery-empty";
					else if (battery.level <= 0.5) icon = "fa-battery-quarter";
					else if (battery.level <= 0.8) icon = "fa-battery-half";
					if (battery.charging) icon = "fa-bolt";
					batteryEl.innerHTML =
						'<i class="fas ' +
						icon +
						'"></i> ' +
						Math.round(battery.level * 100) +
						"%";
				};
				updateBattery();
				battery.addEventListener("levelchange", updateBattery);
				battery.addEventListener("chargingchange", updateBattery);
			});
		} else if (batteryEl) {
			batteryEl.style.display = "none";
		}

		const weatherEl = document.getElementById("widget-weather");
		if (weatherEl) {
			fetch("https://get.geojs.io/v1/ip/geo.json")
				.then((res) => res.json())
				.then((geo) =>
					fetch(
						"https://api.open-meteo.com/v1/forecast?latitude=" +
							geo.latitude +
							"&longitude=" +
							geo.longitude +
							"&current_weather=true&temperature_unit=fahrenheit"
					)
				)
				.then((res) => res.json())
				.then((data) => {
					if (data.current_weather) {
						const temp = Math.round(data.current_weather.temperature);
						let icon = "fa-cloud";
						const code = data.current_weather.weathercode;
						if (code === 0) icon = "fa-sun";
						else if (code >= 1 && code <= 3) icon = "fa-cloud-sun";
						else if (code >= 51 && code <= 67) icon = "fa-cloud-rain";
						else if (code >= 71 && code <= 77) icon = "fa-snowflake";
						else if (code >= 95) icon = "fa-bolt";
						weatherEl.innerHTML =
							'<i class="fas ' + icon + '"></i> ' + temp + "°F";
					}
				})
				.catch((e) => {
					weatherEl.innerHTML = '<i class="fas fa-cloud-slash"></i> N/A';
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
		"shi idk-awdre",
	];
	const splashText =
		randomMessages[Math.floor(Math.random() * randomMessages.length)];

	return html`
		<div style="height: 100%; width: 100%;">
			<div class="info-widget">
				<div class="time" id="widget-time">--:--</div>
				<div class="date" id="widget-date">---</div>
				<div class="row">
					<div class="item" id="widget-weather">
						<i class="fas fa-spinner fa-spin"></i>
					</div>
					<div class="item" id="widget-battery">
						<i class="fas fa-battery-half"></i> --%
					</div>
				</div>
			</div>

			<ul class="navbar">
				<li style="margin-top: 10px;"></li>
				<hr />
				<li>
					<span id="navactive" class="material-symbols-outlined">cottage</span>
				</li>
				<li>
					<span class="material-symbols-outlined" on:click=${this.onGames}
						>joystick</span
					>
				</li>
				<li>
					<span class="material-symbols-outlined" on:click=${this.onApps}
						>apps</span
					>
				</li>
				<li>
					<span class="material-symbols-outlined" on:click=${this.onOpenProxy}
						>public</span
					>
				</li>
				<hr />
				<li>
					<span class="material-symbols-outlined" on:click=${this.onSettings}
						>tune</span
					>
				</li>
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
							on:input=${(e) => (this.searchQuery = e.target.value)}
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

function GamesScreen() {
	this.css = `
		--background-color: #000;
		--header-active-background-color: rgba(140, 0, 255, 0.55);
		--header-hover-background-color: rgba(140, 0, 255, 0.13);
		--navbar-background-color: rgb(22, 22, 22);
		--hr-background: rgba(160, 160, 160, 0.274);
		--text-color: #ffffff;
		--link-hover-color: #7d2ae8;

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
		.navbar hr { width: 40px; height: 1px; background: var(--hr-background); border: none; margin-top: 10px; margin-bottom: 5px; }
		.navbar span, .navbar i { font-size: 24px; padding: 10px; color: var(--text-color); transition: 0.12s; cursor: pointer; }
		.navbar span:hover, .navbar i:hover { background-color: var(--header-hover-background-color); border-radius: 7px; }
		#navactive { background-color: var(--header-active-background-color); border-radius: 7px; }

		.games-container {
			margin-left: 4.5em; /* past navbar */
			padding: 40px;
			height: 100vh;
			overflow-y: auto;
			box-sizing: border-box;
			position: relative;
			z-index: 10;
		}

		.search-header {
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			border-radius: 30px;
			margin-bottom: 40px;
		}

		.search-header__input {
			font-family: 'DM Sans';
			font-size: 16px;
			background-color: #0a0a0a;
			border: solid 0.5px #525252;
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
			box-shadow: 10px 5px 40px -10px #ae00ff, -14px -4px 40px -10px #4400ff;
			width: 350px;
			outline: none;
			background-color: #0a0a0af0;
		}

		.search-header__input::-webkit-input-placeholder {
			font-weight: 200;
			color: #868686;
		}

		.games-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
			gap: 20px;
			margin-top: 20px;
		}

		.game-card {
			background: #121212;
			border-radius: 12px;
			overflow: hidden;
			cursor: pointer;
			transition: transform 0.2s, box-shadow 0.2s;
			border: 1px solid rgba(255,255,255,0.05);
			display: flex;
			flex-direction: column;
			content-visibility: auto;
			contain-intrinsic-size: 232px;
			will-change: transform, box-shadow;
		}

		.game-card:hover {
			transform: translateY(-5px);
			box-shadow: 0 10px 20px rgba(140, 0, 255, 0.3);
			border-color: rgba(140, 0, 255, 0.5);
		}

		.game-cover {
			width: 100%;
			height: 180px;
			object-fit: cover;
			background: #1a1a1a;
		}

		.game-title {
			padding: 15px;
			font-size: 15px;
			font-weight: 600;
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.games-header {
			font-size: 40px;
			font-weight: 700;
			color: #fff;
			text-shadow: 0 0 20px rgba(140, 0, 255, 0.5);
			margin-bottom: 30px;
		}

		.loading {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-top: 100px;
			gap: 20px;
		}

		.loading-spinner {
			width: 50px;
			height: 50px;
			border: 4px solid rgba(255,255,255,0.1);
			border-top-color: #7d2ae8;
			border-radius: 50%;
			animation: games-spin 1s linear infinite;
		}

		.loading-text-container {
			display: flex;
			align-items: baseline;
			gap: 12px;
			background: rgba(0, 0, 0, 0.4);
			padding: 10px 20px;
			border-radius: 30px;
			border: 1px solid rgba(140, 0, 255, 0.2);
		}

		.loading-text {
			font-size: 20px;
			font-weight: 500;
			color: #fff;
			text-shadow: 0 0 10px rgba(140, 0, 255, 0.3);
		}

		.loading-count {
			font-size: 16px;
			color: #aaa;
			font-variant-numeric: tabular-nums;
		}

		@keyframes games-spin {
			to { transform: rotate(360deg); }
		}

		.blobbig {
			box-shadow: 0 0 150px 100px var(--link-hover-color);
			border-radius: 100%;
			height: 45vh;
			width: 75vw;
			opacity: 0.15;
			background-image: radial-gradient(farthest-corner at 50% 50%, #ffffff, #8400ff);
			background-blend-mode: multiply;
			filter: blur(50px) contrast(1.1);
			position: absolute;
			transform: translate(-50%, -35%);
			left: 47vw;
			top: 100vh;
			z-index: 1;
		}

		.game-overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background: #000;
			z-index: 1000;
			display: flex;
			flex-direction: column;
		}

		.game-overlay-header {
			height: 50px;
			background: #111;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding: 0 20px;
			border-bottom: 1px solid rgba(255,255,255,0.05);
		}

		.game-overlay-header button {
			background: rgba(255,255,255,0.1);
			border: none;
			color: white;
			padding: 8px 15px;
			border-radius: 6px;
			cursor: pointer;
			font-family: 'DM Sans', sans-serif;
			font-size: 14px;
			display: flex;
			align-items: center;
			gap: 8px;
			transition: 0.2s;
		}

		.game-overlay-header button:hover {
			background: rgba(255,255,255,0.2);
			transform: scale(1.05);
		}

		.game-overlay-content {
			flex: 1;
			width: 100%;
			background: #000;
		}
		
		#game-content-frame {
			width: 100%;
			height: 100%;
			border: none;
			background: #fff;
		}
	`;

	this.games = [];
	this.loading = true;
	this.searchQuery = "";
	this.activeGameUrl = null;

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 15000);

	fetch("/api/games.json", { signal: controller.signal })
		.then((r) => {
			clearTimeout(timeoutId);
			if (!r.ok) throw new Error("Failed response from proxy API");
			return r.json();
		})
		.then((data) => {
			console.log("Games loaded:", data);
			if (Array.isArray(data) && data.length > 0) {
				let total = data.length;
				let current = 0;
				let maxStep = Math.max(1, Math.floor(total / 12));
				
				let timer = setInterval(() => {
					current += Math.floor(Math.random() * maxStep * 2) + 1;
					if (current >= total) current = total;
					
					const textEl = document.getElementById("loading-count-text");
					if (textEl) {
						textEl.innerText = current + " / " + total;
					}
					
					if (current === total) {
						clearInterval(timer);
						setTimeout(() => {
							this.games = data;
							this.loading = false;
						}, 150);
					}
				}, 40);
			} else {
				this.loading = false;
			}
		})
		.catch((e) => {
			clearTimeout(timeoutId);
			console.error("Failed to load games: ", e);
			this.loading = false;
		});

	this.openGame = (gameObj) => {
		let finalUrl = gameObj.url;

		if (finalUrl.includes("cdn.jsdelivr.net/gh/")) {
			finalUrl = finalUrl
				.replace(
					"https://cdn.jsdelivr.net/gh/",
					"https://raw.githack.com/"
				)
				.replace("@", "/");
		}
		if (finalUrl.includes("raw.githubusercontent.com")) {
			finalUrl = finalUrl.replace("raw.githubusercontent.com", "raw.githack.com");
		}

		this.activeGameUrl = finalUrl;
		this.mount();

		setTimeout(async () => {
			const container = document.querySelector(".game-overlay-content");
			if (!container) return;

			container.innerHTML = '<iframe id="game-content-frame"></iframe>';
			let iframe = document.getElementById("game-content-frame");

			const attemptLoad = async (urlToLoad) => {
				const isUv = store.proxy === "ultraviolet";
				let frameElement;
				
				if (isUv) {
					if (typeof __uv$config === "undefined") {
						iframe.src = urlToLoad;
						frameElement = iframe;
					} else {
						const newIframe = document.createElement("iframe");
						newIframe.id = "game-content-frame";
						newIframe.style.cssText = "width:100%;height:100%;border:none;background:#fff;";
						newIframe.src = __uv$config.prefix + __uv$config.encodeUrl(urlToLoad);
						iframe.replaceWith(newIframe);
						frameElement = newIframe;
					}
				} else {
					const scramFrame = scramjet.createFrame();
					scramFrame.frame.id = "game-content-frame";
					scramFrame.frame.style.cssText = "width:100%;height:100%;border:none;background:#fff;";
					iframe.replaceWith(scramFrame.frame);
					scramFrame.go(urlToLoad);
					frameElement = scramFrame.frame;
				}
			};

			try {
				await attemptLoad(finalUrl);
			} catch (e) {
				console.error("Failed to load game:", e);
				let frame = document.getElementById("game-content-frame");
				if (frame && frame.contentDocument) {
					frame.contentDocument.open();
					frame.contentDocument.write(
						`<h2>Sorry, this game's file is broken or missing!</h2><p>Something went wrong while loading ${gameObj.name}.</p>`
					);
					frame.contentDocument.close();
				}
			}
		}, 100);
	};

	this.closeGame = () => {
		this.activeGameUrl = null;
	};

	return html`
		<div style="height: 100%; width: 100%;">
			${use(this.activeGameUrl, (active) =>
				active
					? html`
							<div class="game-overlay">
								<div class="game-overlay-header">
									<button on:click=${this.closeGame}>
										<i class="fa-solid fa-arrow-left"></i> Back to Games
									</button>
								</div>
								<div class="game-overlay-content">
									<iframe id="game-content-frame"></iframe>
								</div>
							</div>
						`
					: ""
			)}

			<ul class="navbar">
				<li style="margin-top: 10px;"></li>
				<hr />
				<li>
					<span class="material-symbols-outlined" on:click=${this.onHome}
						>cottage</span
					>
				</li>
				<li>
					<span id="navactive" class="material-symbols-outlined">joystick</span>
				</li>
				<li>
					<span class="material-symbols-outlined" on:click=${this.onApps}
						>apps</span
					>
				</li>
				<li>
					<span class="material-symbols-outlined" on:click=${this.onOpenProxy}
						>public</span
					>
				</li>
				<hr />
				<li>
					<span class="material-symbols-outlined" on:click=${this.onSettings}
						>tune</span
					>
				</li>
			</ul>

			<div class="blobbig"></div>

			<div class="games-container">
				<div class="games-header" style="display: flex; justify-content: space-between; align-items: center;">
					<span>Vortex Games</span>
					<a href="/games_list.html" style="font-size: 14px; color: #888; text-decoration: none; font-weight: normal; background: rgba(255,255,255,0.05); padding: 5px 15px; border-radius: 20px;">
						Switch to HTML List
					</a>
				</div>

				<div class="search-header">
					<input
						class="search-header__input"
						type="text"
						placeholder="search up a game..."
						bind:value=${use(this.searchQuery)}
						on:input=${(e) => (this.searchQuery = e.target.value)}
					/>
				</div>

				${use(this.loading, (l) =>
					l ? html`<div class="loading">
						<div class="loading-spinner"></div>
						<div class="loading-text-container">
							<div class="loading-text">Loading assets...</div>
							<div class="loading-count" id="loading-count-text">0 / 0</div>
						</div>
					</div>` : ""
				)}

				<div class="games-grid">
					${use(this.games, (games) => use(this.searchQuery, (query) => {
						const filteredGames = games.filter((g) =>
							g.name.toLowerCase().includes(query.toLowerCase())
						);
						return filteredGames.map(
							(game) => html`
								<div class="game-card" on:click=${() => this.openGame(game)}>
									<img
										class="game-cover"
										src=${game.cover || "https://api.dicebear.com/7.x/initials/png?seed=" + encodeURIComponent(game.name) + "&backgroundColor=111111&textColor=ffffff"}
										on:error=${(e) => {
											e.target.onerror = null;
											e.target.src = "https://api.dicebear.com/7.x/initials/png?seed=" + encodeURIComponent(game.name) + "&backgroundColor=111111&textColor=ffffff";
										}}
										loading="lazy"
										alt=${game.name}
									/>
									<div class="game-title">${game.name}</div>
								</div>
							`
						);
					}))}
				</div>
			</div>
		</div>
	`;
}

function AppsScreen() {
	this.searchQuery = "";
	this.css = `
		--background-color: #000;
		--header-active-background-color: rgba(140, 0, 255, 0.55);
		--header-hover-background-color: rgba(140, 0, 255, 0.13);
		--navbar-background-color: rgb(22, 22, 22);
		--hr-background: rgba(160, 160, 160, 0.274);
		--text-color: #ffffff;
		--input-background-color: #0a0a0a;
		--border-color: #525252;
		--dshadow1: #ae00ff;
		--dshadow2: #4400ff;
		
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

		.navbar hr { width: 40px; height: 1px; background: var(--hr-background); border: none; margin-top: 10px; margin-bottom: 5px; }
		.navbar span, .navbar i { font-size: 24px; padding: 10px; color: var(--text-color); transition: 0.12s; cursor: pointer; }
		.navbar span:hover, .navbar i:hover { background-color: var(--header-hover-background-color); border-radius: 7px; }
		#navactive { background-color: var(--header-active-background-color); border-radius: 7px; }

		.apps-container {
			margin-left: 4.5em; /* past navbar */
			padding: 40px;
			height: 100vh;
			overflow-y: auto;
			box-sizing: border-box;
			position: relative;
			z-index: 10;
		}

		.search-header {
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			border-radius: 30px;
			margin-bottom: 40px;
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

		.apps-grid {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			gap: 15px;
			max-width: 1100px;
			margin: 0 auto;
		}

		@media (max-width: 1200px) {
			.apps-grid { grid-template-columns: repeat(4, 1fr); }
		}

		@media (max-width: 900px) {
			.apps-grid { grid-template-columns: repeat(3, 1fr); }
		}

		@media (max-width: 600px) {
			.apps-grid { grid-template-columns: repeat(2, 1fr); }
		}

		.app-card {
			background: #111;
			border-radius: 12px;
			height: 120px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 12px;
			cursor: pointer;
			transition: transform 0.2s, box-shadow 0.2s;
			text-decoration: none;
			color: #fff;
			overflow: hidden;
			position: relative;
			border: 1px solid rgba(255,255,255,0.05);
		}

		.app-card.gradient {
			background: linear-gradient(135deg, #1e003b 0%, #4400ff 100%);
		}

		.app-card:hover {
			transform: scale(1.03);
			box-shadow: 0 10px 20px rgba(140, 0, 255, 0.2);
			border-color: rgba(140, 0, 255, 0.4);
		}

		.app-card img {
			width: 64px;
			height: 64px;
			border-radius: 12px;
			object-fit: contain;
			background: transparent;
		}

		.app-card span {
			font-size: 14px;
			font-weight: 600;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 90%;
			text-align: center;
		}
		
		#particles-apps {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 1;
		}
	`;

	const appsList = [
		{
			name: "Request a app",
			url: "https://docs.google.com/forms",
			customImg:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Google_Forms_icon_2014.png/640px-Google_Forms_icon_2014.png",
			gradient: true,
		},
		{ name: "Amazon", url: "https://amazon.com", domain: "amazon.com" },
		{ name: "Luna", url: "https://luna.amazon.com", domain: "luna.amazon.com" },
		{
			name: "Character.ai",
			url: "https://character.ai",
			domain: "character.ai",
		},
		{ name: "Chess.com", url: "https://chess.com", domain: "chess.com" },
		{
			name: "Coolmath Games",
			url: "https://coolmathgames.com",
			domain: "coolmathgames.com",
		},
		{ name: "Discord", url: "https://discord.com/app", domain: "discord.com" },
		{ name: "ESPN", url: "https://espn.com", domain: "espn.com" },
		{ name: "FlixHQ", url: "https://flixhq.to", domain: "flixhq.to" },
		{
			name: "GeForce NOW",
			url: "https://play.geforcenow.com",
			domain: "geforcenow.com",
		},
		{ name: "GitHub", url: "https://github.com", domain: "github.com" },
		{ name: "HBO Max", url: "https://max.com", domain: "max.com" },
		{
			name: "Newgrounds",
			url: "https://newgrounds.com",
			domain: "newgrounds.com",
		},
		{ name: "OpenAI", url: "https://chat.openai.com", domain: "openai.com" },
		{
			name: "Paramount+",
			url: "https://paramountplus.com",
			domain: "paramountplus.com",
		},
		{
			name: "Pinterest",
			url: "https://pinterest.com",
			domain: "pinterest.com",
		},
		{ name: "Pixlr", url: "https://pixlr.com", domain: "pixlr.com" },
		{ name: "Poki", url: "https://poki.com", domain: "poki.com" },
		{
			name: "CrazyGames",
			url: "https://crazygames.com",
			domain: "crazygames.com",
		},
		{ name: "SnapChat", url: "https://snapchat.com", domain: "snapchat.com" },
		{
			name: "SoundCloud",
			url: "https://soundcloud.com",
			domain: "soundcloud.com",
		},
		{
			name: "Telegram",
			url: "https://web.telegram.org",
			domain: "telegram.org",
		},
		{ name: "Temu", url: "https://temu.com", domain: "temu.com" },
		{ name: "TikTok", url: "https://tiktok.com", domain: "tiktok.com" },
		{ name: "Tumblr", url: "https://tumblr.com", domain: "tumblr.com" },
		{ name: "Twitch", url: "https://twitch.tv", domain: "twitch.tv" },
		{
			name: "X",
			url: "https://x.com",
			domain: "x.com",
			customImg:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/1200px-X_logo_2023.svg.png",
		},
		{ name: "VS Code", url: "https://vscode.dev", domain: "vscode.dev" },
		{ name: "Wattpad", url: "https://wattpad.com", domain: "wattpad.com" },
		{
			name: "RetroArch",
			url: "https://retroarch.com",
			domain: "retroarch.com",
		},
		{ name: "Y8", url: "https://y8.com", domain: "y8.com" },
		{ name: "YouTube", url: "https://youtube.com", domain: "youtube.com" },
	];

	this.openApp = (app) => {
		store.url = app.url;
		this.onOpenProxy();
	};

	setTimeout(() => {
		if (window.particlesJS) {
			window.particlesJS("particles-apps", {
				particles: {
					number: { value: 86, density: { enable: true, value_area: 800 } },
					color: { value: "#ffffff" },
					shape: { type: "circle" },
					opacity: { value: 0.5, random: false, anim: { enable: false } },
					size: { value: 3, random: true, anim: { enable: false } },
					line_linked: {
						enable: true,
						distance: 150,
						color: "#ffffff",
						opacity: 0.4,
						width: 1,
					},
					move: {
						enable: true,
						speed: 2,
						direction: "none",
						random: false,
						straight: false,
						out_mode: "out",
						bounce: false,
					},
				},
				interactivity: {
					detect_on: "window",
					events: {
						onhover: { enable: false },
						onclick: { enable: true, mode: "push" },
						resize: true,
					},
					modes: { push: { particles_nb: 10 } },
				},
				retina_detect: true,
			});
		}
	}, 100);

	return html`
		<div style="height: 100%; width: 100%;">
			<div id="particles-apps"></div>
			<ul class="navbar">
				<li style="margin-top: 10px;"></li>
				<hr />
				<li>
					<span class="material-symbols-outlined" on:click=${this.onHome}
						>cottage</span
					>
				</li>
				<li>
					<span class="material-symbols-outlined" on:click=${this.onGames}
						>joystick</span
					>
				</li>
				<li>
					<span id="navactive" class="material-symbols-outlined">apps</span>
				</li>
				<li>
					<span class="material-symbols-outlined" on:click=${this.onOpenProxy}
						>public</span
					>
				</li>
				<hr />
				<li>
					<span class="material-symbols-outlined" on:click=${this.onSettings}
						>tune</span
					>
				</li>
			</ul>

			<div class="apps-container">
				<div class="search-header">
					<input
						class="search-header__input"
						type="text"
						placeholder="Search the web or enter URL"
						bind:value=${use(this.searchQuery)}
						on:input=${(e) => (this.searchQuery = e.target.value)}
					/>
				</div>

				<div class="apps-grid">
					${use(this.searchQuery, (query) => {
						const filtered = appsList.filter((a) =>
							a.name.toLowerCase().includes(query.toLowerCase())
						);
						return filtered.map((app) => {
							const rawUrl =
								app.customImg ||
								`https://www.google.com/s2/favicons?domain=${app.domain}&sz=128`;
							let proxiedUrl = `https://wsrv.nl/?url=${encodeURIComponent(rawUrl)}`;
							// Request a app and X use wikimedia which wsrv might block, use dicebear as direct fallback wrapped too
							if (app.domain && !app.customImg)
								proxiedUrl +=
									"&default=" +
									encodeURIComponent(
										`https://api.dicebear.com/7.x/initials/png?seed=${app.name}&backgroundColor=111111&textColor=ffffff`
									);

							return html`
								<div
									class="app-card ${app.gradient ? "gradient" : ""}"
									on:click=${() => this.openApp(app)}
								>
									<img
										referrerpolicy="no-referrer"
										crossorigin="anonymous"
										src=${proxiedUrl}
										on:error=${(e) => {
											e.target.onerror = null;
											e.target.src = `https://wsrv.nl/?url=${encodeURIComponent("https://api.dicebear.com/7.x/initials/png?seed=" + app.name + "&backgroundColor=111111&textColor=ffffff")}`;
										}}
										alt=${app.name}
									/>
									<span>${app.name}</span>
								</div>
							`;
						});
					})}
				</div>
			</div>
		</div>
	`;
}

window.applyTabCloak = function(cloak) {
	const CLOAKS = {
		none: { title: "Scramjet", icon: "/favicon.webp" },
		desmos: { title: "Desmos | Graphing Calculator", icon: "https://www.desmos.com/favicon.ico" },
		classroom: { title: "Classes", icon: "https://ssl.gstatic.com/classroom/favicon.png" },
		drive: { title: "My Drive - Google Drive", icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png" },
		khan: { title: "Khan Academy | Free Online Courses, Lessons & Practice", icon: "https://cdn.kastatic.org/images/favicon.ico" },
		quizlet: { title: "Flashcards, learning tools and textbook solutions | Quizlet", icon: "https://assets.quizlet.com/a/j/favicon.bf2138ad3ccb42b.ico" },
		schoology: { title: "Home | Schoology", icon: "https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico" }
	};
	const data = CLOAKS[cloak] || CLOAKS.none;
	document.title = data.title;
	
	let link = document.querySelector("link[rel~='icon']");
	if (!link) {
		link = document.createElement('link');
		link.rel = 'icon';
		document.getElementsByTagName('head')[0].appendChild(link);
	}
	link.href = data.icon;
};

if (store.tabCloak) {
	window.applyTabCloak(store.tabCloak);
}

window.addEventListener("keydown", (e) => {
	if (!store.panicKeys) return;
	const keys = store.panicKeys.split(",").map((k) => k.trim().toLowerCase());
	const pressedKey = e.key.toLowerCase();
	
	// Support common names like "backtick" for "`"
	const aliases = {
		"backtick": "`",
		"grave": "`",
		"tilde": "~",
		"escape": "escape",
		"space": " "
	};

	if (keys.includes(pressedKey) || (aliases[pressedKey] && keys.includes(aliases[pressedKey]))) {
		location.replace(store.panicUrl || "https://classroom.google.com");
	}
});

function SettingsScreen() {
	this.css = `
		--background-color: #000;
		--header-active-background-color: rgba(140, 0, 255, 0.55);
		--header-hover-background-color: rgba(140, 0, 255, 0.13);
		--text-color: #ffffff;
		--navbar-background-color: rgb(22, 22, 22);
		--hr-background: rgba(160, 160, 160, 0.274);
		--link-hover-color: #7d2ae8;
		--dshadow3: #ff00d4;
		--dshadow4: #8400ff;

		background-color: var(--background-color);
		height: 100%;
		width: 100%;
		position: relative;
		overflow: hidden;

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
			box-shadow: 1px 0 1px 0 rgba(0,0,0,0.86);
			z-index: 2147483641;
		}

		.navbar img.logo {
			width: 40px;
			height: 40px;
			border-radius: 10px;
		}

		.navbar hr { width: 40px; height: 1px; background: var(--hr-background); border: none; margin-top: 5px; margin-bottom: 5px; display: inline-block; }
		.navbar span, .navbar i { font-size: 24px; padding: 10px; color: var(--text-color); transition: 0.12s; cursor: pointer; display: inline-block; }
		.navbar span:hover, .navbar i:hover { background-color: var(--header-hover-background-color); border-radius: 7px; }
		#navactive { background-color: var(--header-active-background-color); border-radius: 7px; color: white !important; }

		#settingsShape {
			background: radial-gradient(circle, rgba(140,0,255,0.4) 0%, rgba(0,0,0,0) 70%);
			position: absolute;
			width: 600px;
			height: 600px;
			z-index: -1;
			left: -300px;
			top: -300px;
			opacity: 0.5;
			pointer-events: none;
		}

		ul.sideSnav {
			width: 250px; 
			border-right: 1px solid rgba(255,255,255,0.05); 
			padding: 20px; 
			list-style: none; 
			margin: 0; 
			box-sizing: border-box; 
			display: flex; 
			flex-direction: column; 
			gap: 5px;
		}

		ul.sideSnav h1 {
			font-size: 24px; margin-top: 0; text-align: left; margin-bottom: 15px; color: white;
		}

		.settingItem {
			padding: 10px;
			border-radius: 8px;
			transition: 0.2s;
			display: flex;
			align-items: center;
			font-size: 14px;
            cursor: pointer;
            color: #aaa;
		}
		
		.settingItem:hover {
		    background-color: var(--header-hover-background-color);
		}

		.settingItem.active {
			color: rgba(200, 50, 255, 1);
			font-weight: bold;
		}

		.scontent {
			flex: 1; 
			padding: 40px; 
			overflow-y: auto; 
			text-align: left;
			color: white;
			font-family: inherit;
		}

		.scontent h1.tab-title {
		    font-size: 22px;
		    margin-bottom: 25px;
		    margin-top: 0;
		}

		.settingsection {
			background: rgba(255, 255, 255, 0.03);
			border: 1px solid rgba(255, 255, 255, 0.05);
			border-radius: 12px;
			padding: 20px;
			margin-bottom: 20px;
		}

		.settingsection h1 {
			font-size: 18px;
			margin-top: 0;
			margin-bottom: 10px;
			color: white;
		}

		.settingsection p {
			color: #aaa;
			font-size: 14px;
			margin-bottom: 15px;
			line-height: 1.5;
		}

		.dropdown {
		    position: relative;
		    display: inline-block;
		    width: 100%;
		    max-width: 400px;
		}
		
		.dropdown-button {
		    width: 100%;
		    display: flex;
		    justify-content: space-between;
		    align-items: center;
		    background: rgba(255, 255, 255, 0.05);
		    border: 1px solid rgba(255, 255, 255, 0.1);
		    color: white;
		    padding: 10px 15px;
		    border-radius: 8px;
		    cursor: pointer;
		}

		.pgroup {
			display: flex;
			align-items: center;
			background: rgba(0,0,0,0.5);
			border: 1px solid rgba(255,255,255,0.1);
			border-radius: 8px;
			padding: 5px 10px;
			margin-bottom: 15px;
			max-width: 400px;
		}
		.picon { width: 20px; height: 20px; color: #888; margin-right: 10px; }
		.pgroup input { background: transparent; border: none; color: white; outline: none; width: 100%; }

		.splitbutton, .buttonreg {
			background: rgba(255, 255, 255, 0.05);
			border: 1px solid rgba(255, 255, 255, 0.1);
			color: white;
			padding: 10px 20px;
			border-radius: 8px;
			cursor: pointer;
			transition: 0.2s;
			flex: 1;
		}
		.splitbutton:hover, .buttonreg:hover { background: rgba(255, 255, 255, 0.1); }

		/* Toggle switch */
		.switch { position: relative; display: inline-block; width: 40px; height: 20px; margin-bottom: 15px; }
		.switch input { opacity: 0; width: 0; height: 0; }
		.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.1); transition: .4s; border-radius: 20px; }
		.slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: #aaa; transition: .4s; border-radius: 50%; }
		input:checked + .slider { background-color: rgba(200, 50, 255, 0.5); }
		input:checked + .slider:before { transform: translateX(20px); background-color: white; }

		hr { border: none; border-top: 1px solid rgba(255,255,255,0.05); margin: 15px 0; }

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

		#particles-settings {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 2;
		}
	`;

	this.activeTab = "cloaking";

	const changeTab = (tabId) => {
		this.activeTab = tabId;
	};

	setTimeout(() => {
		if (window.particlesJS) {
			window.particlesJS("particles-settings", {
				particles: {
					number: { value: 86, density: { enable: true, value_area: 800 } },
					color: { value: "#ffffff" },
					shape: { type: "circle" },
					opacity: { value: 1, random: true, anim: { enable: false } },
					size: { value: 2, random: true, anim: { enable: false } },
					line_linked: { enable: false },
					move: {
						enable: true,
						speed: 0.5,
						direction: "top",
						random: false,
						straight: false,
						out_mode: "out",
						bounce: false,
					},
				},
				interactivity: {
					detect_on: "window",
					events: {
						onhover: { enable: false },
						onclick: { enable: false },
						resize: true,
					},
					modes: { push: { particles_nb: 10 } },
				},
				retina_detect: true,
			});
		}
	}, 100);

	this.launchAboutBlank = () => {
		let win = window.open('about:blank', '_blank');
		if (!win) {
			alert('Please allow popups to launch About:Blank.');
			return;
		}
		let iframe = win.document.createElement('iframe');
		iframe.src = location.href;
		iframe.style.width = '100vw';
		iframe.style.height = '100vh';
		iframe.style.border = 'none';
		iframe.style.margin = '0';
		win.document.body.style.margin = '0';
		win.document.body.appendChild(iframe);
		location.replace('https://classroom.google.com/');
	};

	this.launchBlob = () => {
		const blob = new Blob(
			[`<!DOCTYPE html><html><head><title>Tasks</title><link rel="icon" href="https://ssl.gstatic.com/images/branding/product/1x/tasks_2021_32dp.png"></head><body style="margin:0;"><iframe src="${location.href}" style="width:100vw;height:100vh;border:none;margin:0;"></iframe></body></html>`],
			{ type: "text/html" }
		);
		const url = URL.createObjectURL(blob);
		let win = window.open(url, '_blank');
		if (!win) {
			alert('Please allow popups to launch Blob.');
			return;
		}
		location.replace('https://classroom.google.com/');
	};

	return html`
		<div
			style="height: 100%; width: 100%; display: flex; justify-content: center; align-items: center; position: relative;"
		>
			<div style="z-index: 1;">
				<div class="blob"></div>
				<div class="blobbig"></div>
				<div class="blobsmall"></div>
				<div class="blobtop"></div>
				<div id="particles-settings"></div>
			</div>
			
			<ul class="navbar" style="z-index: 2000;">
				<li style="margin-left: 0px; margin-top: 10px; margin-bottom: 5px;">
					<img
						class="logo"
						src="/assets/logo.webp"
						alt="Logo"
						onerror="this.src='https://api.dicebear.com/7.x/initials/png?seed=D&backgroundColor=111111&textColor=ffffff'"
					/>
				</li>
				<hr style="margin-top: 5px" />
				<li>
					<span class="material-symbols-outlined" on:click=${this.onHome}
						>cottage</span
					>
				</li>
				<li>
					<span class="material-symbols-outlined" on:click=${this.onGames}
						>joystick</span
					>
				</li>
				<li>
					<span class="material-symbols-outlined" on:click=${this.onApps}
						>apps</span
					>
				</li>
				<li>
					<span class="material-symbols-outlined" on:click=${this.onOpenProxy}
						>public</span
					>
				</li>
				<hr />
				<li>
					<span id="navactive" class="material-symbols-outlined">tune</span>
				</li>
			</ul>

			<div
				class="header"
				style="
					display: inline-flex;
					width: 1000px;
					height: 650px;
					backdrop-filter: blur(8px);
					background-color: rgba(21, 21, 21, 0.4);
					z-index: 10;
					box-shadow: 0 0 15px -10px #fff;
					border-radius: 27px;
					position: relative;
					overflow: hidden;
					border: 1px solid rgba(255,255,255,0.05);
				"
			>
				<ul class="sideSnav">
					<h1>Settings</h1>
					<div id="settingsShape" class="settingsShape"></div>

					<li
						class="settingItem ${use(this.activeTab, (tab) =>
							tab === "cloaking" ? "active" : ""
						)}"
						on:click=${() => changeTab("cloaking")}
					>
						<span class="material-symbols-outlined" style="margin-right: 8px;"
							>ad_group_off</span
						>Cloaking
					</li>
					<li
						class="settingItem ${use(this.activeTab, (tab) =>
							tab === "performance" ? "active" : ""
						)}"
						on:click=${() => changeTab("performance")}
					>
						<span class="material-symbols-outlined" style="margin-right: 8px;"
							>speed</span
						>Performance
					</li>
					<li
						class="settingItem ${use(this.activeTab, (tab) =>
							tab === "themes" ? "active" : ""
						)}"
						on:click=${() => changeTab("themes")}
					>
						<span class="material-symbols-outlined" style="margin-right: 8px;"
							>palette</span
						>Themes
					</li>
					<li
						class="settingItem ${use(this.activeTab, (tab) =>
							tab === "proxy" ? "active" : ""
						)}"
						on:click=${() => changeTab("proxy")}
					>
						<span class="material-symbols-outlined" style="margin-right: 8px;"
							>public</span
						>Proxy & Browser
					</li>

					<hr
						style="margin: 10px 0; border: none; border-bottom: 1px solid rgba(255,255,255,0.05);"
					/>

					<li
						class="settingItem ${use(this.activeTab, (tab) =>
							tab === "account" ? "active" : ""
						)}"
						on:click=${() => changeTab("account")}
					>
						<span class="material-symbols-outlined" style="margin-right: 8px;"
							>account_circle</span
						>Account
					</li>
					<li
						class="settingItem ${use(this.activeTab, (tab) =>
							tab === "about" ? "active" : ""
						)}"
						on:click=${() => changeTab("about")}
					>
						<span class="material-symbols-outlined" style="margin-right: 8px;"
							>help</span
						>About & Statistics
					</li>

					<hr
						style="margin: 10px 0; border: none; border-bottom: 1px solid rgba(255,255,255,0.05);"
					/>

					<li
						class="settingItem ${use(this.activeTab, (tab) =>
							tab === "news" ? "active" : ""
						)}"
						on:click=${() => changeTab("news")}
					>
						<span class="material-symbols-outlined" style="margin-right: 8px;"
							>rocket_launch</span
						>News & Updates
					</li>
					<li
						class="settingItem ${use(this.activeTab, (tab) =>
							tab === "faq" ? "active" : ""
						)}"
						on:click=${() => changeTab("faq")}
					>
						<span class="material-symbols-outlined" style="margin-right: 8px;"
							>contact_support</span
						>FAQ
					</li>
				</ul>

				<div class="scontent">
					${use(this.activeTab, (tab) => {
						if (tab === "cloaking")
							return html`
								<div class="tabbed-content">
									<h1 class="tab-title">Cloaking</h1>
									<div class="settingsection">
										<h1>About:Blank & Blob Cloaking</h1>
										<p>
											About:Blank allows you to hide your tab history, and
											blockers such as GoGuardian by appearing that you are on a
											blank tab. If About:Blank doesn't work, then you can try
											using the blob cloaking which uses temporary data.
										</p>
										<div style="display: flex; gap: 10px; width: 100%;">
											<button class="splitbutton" on:click=${this.launchAboutBlank}>Launch About:Blank</button>
											<button class="splitbutton" on:click=${this.launchBlob}>Launch Blob</button>
										</div>
									</div>

									<div class="settingsection">
										<h1>Automatic cloaking</h1>
										<p>
											This toggles automatic cloaking when the site first loads
											which hides the site from entering your history.
										</p>
										<p>
											<b
												>Note: Only one automatic cloaking toggle is allowed at
												a time.</b
											>
										</p>
										<hr />
										<p style="margin-bottom: 5px;">Auto-Launch About:Blank</p>
										<label class="switch"
											><input 
												type="checkbox" 
												checked=${use(store.autoCloak, v => v === 'aboutBlank')}
												on:change=${(e) => { store.autoCloak = e.target.checked ? 'aboutBlank' : 'none'; }}
											/><span
												class="slider round"
											></span
										></label>
										<p style="margin-bottom: 5px;">Auto-Launch Blob</p>
										<label class="switch"
											><input 
												type="checkbox" 
												checked=${use(store.autoCloak, v => v === 'blob')}
												on:change=${(e) => { store.autoCloak = e.target.checked ? 'blob' : 'none'; }}
											/><span
												class="slider round"
											></span
										></label>
									</div>

									<div class="settingsection">
										<h1>Tab Cloaking</h1>
										<p>
											Tab Cloaking cloaks the name of the tab & icon, so your
											tab stays hidden from sight. Select a cloak down below to
											activate it.
										</p>
										<div class="dropdown">
											<select
												class="dropdown-button"
												style="appearance: auto; background: rgba(255, 255, 255, 0.05); color: white; border: 1px solid rgba(255, 255, 255, 0.1); width: 100%; padding: 10px 15px; border-radius: 8px; cursor: pointer; outline: none;"
												value=${use(store.tabCloak)}
												on:change=${(e) => { store.tabCloak = e.target.value; window.applyTabCloak(e.target.value); }}
											>
												<option value="none" style="background: #111; color: white;">None (Default)</option>
												<option value="desmos" style="background: #111; color: white;">Desmos</option>
												<option value="classroom" style="background: #111; color: white;">Google Classroom</option>
												<option value="drive" style="background: #111; color: white;">Google Drive</option>
												<option value="khan" style="background: #111; color: white;">Khan Academy</option>
												<option value="quizlet" style="background: #111; color: white;">Quizlet</option>
												<option value="schoology" style="background: #111; color: white;">Schoology</option>
											</select>
										</div>
									</div>

									<div class="settingsection">
										<h1>Panic Key</h1>
										<p>
											Press the selected keybind to go to another site quickly.
											You can set multiple keybinds (e.g. 'backtick, escape') by seperating them with a
											comma.
										</p>
										<div class="pgroup">
											<span class="material-symbols-outlined picon"
												>keyboard</span
											>
											<input
												placeholder="Set a keybind. Backtick (&#96;) by default"
												bind:value=${use(store.panicKeys)}
											/>
										</div>
										<p style="margin-top: 10px; margin-bottom: 5px;">Panic URL</p>
										<div class="pgroup">
											<span class="material-symbols-outlined picon"
												>link</span
											>
											<input
												placeholder="https://classroom.google.com"
												bind:value=${use(store.panicUrl)}
											/>
										</div>
										<div style="display: flex; gap: 10px; margin-top: 10px;">
											<button class="buttonreg" style="max-width: 150px;" on:click=${(e) => { 
												const btn = e.target;
												const oldText = btn.innerText;
												btn.innerText = "Saved!";
												setTimeout(() => btn.innerText = oldText, 2000);
											}}>
												Save Settings
											</button>
											<button class="buttonreg" style="max-width: 150px; background: rgba(255, 50, 50, 0.2);" on:click=${() => location.replace(store.panicUrl || "https://classroom.google.com")}>
												Panic Now
											</button>
										</div>
									</div>
								</div>
							`;

						if (tab === "performance")
							return html`
								<div class="tabbed-content">
									<h1 class="tab-title">Performance</h1>
									<div class="settingsection">
										<h1>Background Particles</h1>
										<p>
											This enables the background star particle effects, this is
											on by default. <b>Performance Impact:</b> High on low-end
											devices
										</p>
										<label class="switch" style="margin-top: 10px;"
											><input type="checkbox" checked /><span
												class="slider round"
											></span
										></label>
									</div>
								</div>
							`;

						if (tab === "themes")
							return html`
								<div class="tabbed-content">
									<h1 class="tab-title">Themes</h1>
									<div class="settingsection">
										<h1>Default Themes</h1>
										<p>
											Here's some themes for you to choose from. You can also
											join our Discord for theme submissions, under suggestions.
										</p>
										<div class="dropdown">
											<button class="dropdown-button">
												<span>Default</span>
												<span class="material-symbols-outlined"
													>chevron_right</span
												>
											</button>
										</div>
									</div>
								</div>
							`;

						if (tab === "proxy")
							return html`
								<div class="tabbed-content">
									<h1 class="tab-title">Proxy & Browser</h1>
									<div class="settingsection">
										<h1>Proxy</h1>
										<p>
											Proxies are what run the unblocking backend for you to
											enjoy the games and apps that we display.
										</p>
										<p>
											Changing the proxy may make some games perform better, run
											sites faster, and may make your overall experience better.
											For more information, join our Discord.
										</p>
										<div class="dropdown">
											<select value=${store.proxy} on:change=${e => store.proxy = e.target.value} class="dropdown-button" style="appearance: auto; background: rgba(255, 255, 255, 0.05); color: white; border: 1px solid rgba(255, 255, 255, 0.1); width: 100%; padding: 10px 15px; border-radius: 8px; cursor: pointer; outline: none;">
												<option value="scramjet" style="background: #111; color: white;">Scramjet</option>
												<option value="ultraviolet" style="background: #111; color: white;">Ultraviolet</option>
											</select>
										</div>
									</div>

									<div class="settingsection">
										<h1>Transport</h1>
										<p>
											Transport is the method of how the proxy will transport
											information
										</p>
										<p>
											Changing the transport may make some proxies perform
											better, but may also cause issues for others. Transport
											switching is an advanced feature, not recommended if you
											dont know what your doing.
										</p>
										<div class="dropdown">
											<button class="dropdown-button">
												<span>Libcurl</span
												><span class="material-symbols-outlined"
													>chevron_right</span
												>
											</button>
										</div>

										<div style="display: flex; gap: 10px; margin-top: 15px;">
											<button
												class="buttonreg"
												on:click=${() => {
													connection.setTransport("/baremod/index.mjs", [
														store.bareurl,
													]);
													store.transport = "/baremod/index.mjs";
												}}
											>
												bare server 3
											</button>
											<button
												class="buttonreg"
												on:click=${() => {
													connection.setTransport("/libcurl/index.mjs", [
														{ wisp: store.wispurl },
													]);
													store.transport = "/libcurl/index.mjs";
												}}
											>
												libcurl.js
											</button>
											<button
												class="buttonreg"
												on:click=${() => {
													connection.setTransport("/epoxy/index.mjs", [
														{ wisp: store.wispurl },
													]);
													store.transport = "/epoxy/index.mjs";
												}}
											>
												epoxy
											</button>
										</div>
										<p style="margin-top: 15px;">
											<b>Active configuration:</b> ${store.transport}
										</p>
									</div>

									<div class="settingsection">
										<h1>Wisp Server</h1>
										<p>
											Enter an Alternative Wisp Server to connect to. This url
											must start with a ws(s):// and end with a /
										</p>
										<div class="pgroup">
											<span class="material-symbols-outlined picon">dns</span>
											<input
												bind:value=${use(store.wispurl)}
												on:input=${(e) => (store.wispurl = e.target.value)}
												spellcheck="false"
											/>
										</div>

										<p>Enter an Alternative Bare Server to connect to.</p>
										<div class="pgroup">
											<span class="material-symbols-outlined picon">dns</span>
											<input
												bind:value=${use(store.bareurl)}
												on:input=${(e) => (store.bareurl = e.target.value)}
												spellcheck="false"
											/>
										</div>

										<div
											style="display: flex; gap: 10px; width: 100%; margin-top: 10px;"
										>
											<button class="buttonreg">Save</button>
											<button class="buttonreg">Reset</button>
										</div>
									</div>

									<div class="settingsection">
										<h1>Browser</h1>
										<p>
											This allows you to change settings about the browser and
											the elements within it. You can change the search engine
											or add/remove the utility bar.
										</p>
										<hr />
										<p>Search Engine</p>
										<div class="dropdown">
											<button class="dropdown-button">
												<span>DuckDuckGo (default)</span
												><span class="material-symbols-outlined"
													>chevron_right</span
												>
											</button>
										</div>
										<p style="margin-top: 15px;">Enable Utility Bar</p>
										<p>
											This enables the basic top bar that you see when using the
											proxy. (Recommended)
										</p>
										<label class="switch"
											><input type="checkbox" checked /><span
												class="slider round"
											></span
										></label>
									</div>
								</div>
							`;

						if (tab === "account")
							return html`
								<div class="tabbed-content">
									<h1 class="tab-title">Account Settings</h1>
									<div class="settingsection">
										<h1>Password Protection</h1>
										<p>
											Protect your account with a password that way only you can
											view the site.
										</p>
										<label class="switch"
											><input type="checkbox" /><span
												class="slider round"
											></span
										></label>
										<p>
											Please remember that when setting your password, set it to
											something only you can remember, that way you do not get
											locked out of your account.
										</p>
										<div class="pgroup">
											<span class="material-symbols-outlined picon">lock</span>
											<input type="password" placeholder="Set Password" />
										</div>
										<button class="buttonreg" style="max-width: 300px;">
											Save
										</button>
									</div>

									<div class="settingsection">
										<h1>Password Keybind</h1>
										<p>
											Set the keybind to toggle the password appearing on
											screen. By default you will need to hold shift an then
											press
											<code
												style="background: rgba(255,255,255,0.1); padding: 2px 5px; border-radius: 4px;"
												>~</code
											>
											(left of the 1 key).
										</p>
										<div class="pgroup">
											<span class="material-symbols-outlined picon"
												>keyboard</span
											>
											<input
												placeholder="Set a keybind. Tilda by default"
												value="~"
											/>
										</div>
										<button class="buttonreg" style="max-width: 300px;">
											Save
										</button>
									</div>

									<div class="settingsection">
										<h1>Import & Export Data</h1>
										<p>
											Import simply loads your current userData and boots most
											of your user settings and data from the last site.
										</p>
										<div style="display: flex; gap: 10px; width: 100%;">
											<button class="splitbutton">
												<span
													class="material-symbols-outlined"
													style="font-size: 16px; margin-right: 5px; vertical-align: middle;"
													>upload</span
												>Export Data
											</button>
											<button class="splitbutton">
												<span
													class="material-symbols-outlined"
													style="font-size: 16px; margin-right: 5px; vertical-align: middle;"
													>download</span
												>Import Data
											</button>
										</div>
									</div>

									<div class="settingsection">
										<h1>Wipe all Data</h1>
										<p>
											Pressing this button will completely wipe all data, making
											it as if you never used this site. It is recommended that
											you export your data before doing this.
										</p>
										<button
											class="buttonreg"
											style="background: rgba(255, 0, 0, 0.2); border-color: rgba(255, 0, 0, 0.5); width: 100%;"
										>
											Wipe all Data
										</button>
									</div>
								</div>
							`;

						if (tab === "about")
							return html`
								<div class="tabbed-content">
									<h1 class="tab-title">About & Statistics</h1>
									<div class="settingsection">
										<h1>Development Team</h1>
										<p>
											Space is completely open-source and is owned, maintained,
											and managed by the Twilight Development Group (TDG) at
											Night Network.
										</p>
									</div>
									<div class="settingsection">
										<h1>Version & Analytics</h1>
										<p style="margin-bottom: 5px;">
											You are currently on:
											<span
												style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;"
												>v1.1.0</span
											>
										</p>
										<p style="margin-bottom: 5px;">
											Server Status:
											<span
												style="background: rgba(0, 255, 0, 0.2); color: lightgreen; padding: 2px 6px; border-radius: 4px;"
												>Running</span
											>
										</p>
										<p>
											Load Times:
											<span
												style="background: rgba(255, 255, 0, 0.2); color: yellow; padding: 2px 6px; border-radius: 4px;"
												>Medium</span
											>
										</p>
									</div>
								</div>
							`;

						if (tab === "news")
							return html`
								<div class="tabbed-content">
									<h1 class="tab-title">News & Updates</h1>
									<div class="settingsection">
										<h1>
											Space has Updated!
											<span style="font-size: 12px; opacity: 0.7;"
												>(Version release v1.1.0)</span
											>
										</h1>
										<p>
											Added more fixes! Join our Discord to get more updates and
											changes.
										</p>
										<ul
											style="color: #aaa; font-size: 14px; padding-left: 20px;"
										>
											<li style="margin-bottom: 5px;">Themes</li>
											<li style="margin-bottom: 5px;">
												Dropped support for Bare
											</li>
											<li>Fixed Cloaking</li>
										</ul>
									</div>

									<div class="settingsection">
										<h1>
											Space has released!
											<span style="font-size: 12px; opacity: 0.7;"
												>(Version release v1.0.0)</span
											>
										</h1>
										<p>
											Enjoy using all of the fun and exciting features we have
											packed into this site!
										</p>
										<ul
											style="color: #aaa; font-size: 14px; padding-left: 20px;"
										>
											<li style="margin-bottom: 5px;">Out of this world UI</li>
											<li style="margin-bottom: 5px;">Games</li>
											<li style="margin-bottom: 5px;">Apps</li>
											<li style="margin-bottom: 5px;">Proxy</li>
											<li>Cloaking</li>
										</ul>
									</div>
								</div>
							`;

						if (tab === "faq")
							return html`
								<div class="tabbed-content">
									<h1 class="tab-title">Frequently asked questions</h1>
									<div class="settingsection">
										<h1>Where can I find links?</h1>
										<p>
											You can find links by joining our Discord. We have a
											community links channel, a link bot for dispensing links,
											and weekly links.
										</p>
									</div>
									<div class="settingsection">
										<h1>Why do some sites not load/work?</h1>
										<p>
											There can be a number of reason a site doesnt load but
											some of the common ones are listed below.
										</p>
										<ul
											style="color: #aaa; font-size: 14px; padding-left: 20px;"
										>
											<li style="margin-bottom: 5px;">
												Proxy Server doesn't support the site(s)
											</li>
											<li style="margin-bottom: 5px;">
												Our servers are either down or experiencing high loads
											</li>
											<li style="margin-bottom: 5px;">
												Issue with the actual site you are visiting
											</li>
											<li>Security flaggers!</li>
										</ul>
									</div>
								</div>
							`;

						return "";
					})}
				</div>
			</div>

			<div
				style="display: block; position: absolute; bottom: 10px; width: 100%; text-align: center; color: #888; z-index: 100;"
			>
				<p
					class="banner"
					style="margin: 0; background: rgba(0,0,0,0.5); padding: 5px 15px; display: inline-block; border-radius: 20px; font-size: 14px;"
				>
					Hosted by
					<span style="color: rgba(200, 50, 255, 1); text-decoration: none;"
						>Billiger</span
					>
					<i
						style="margin-left: 10px; cursor: pointer;"
						class="fa-solid fa-xmark"
					></i>
				</p>
			</div>
		</div>
	`;
}


function AppContainer() {
	this.currentView = "home";
	this.css = `
		width: 100%;
		height: 100%;
	`;

	return html`
		<div>
			${use([this.currentView, store.proxy], ([view, proxy]) => {
				if (view === "proxy")
					return h(BrowserApp, {
						onCloseProxy: () => (this.currentView = "home"),
						onSettings: () => (this.currentView = "settings"),
					});
				if (view === "games")
					return h(GamesScreen, {
						onOpenProxy: () => (this.currentView = "proxy"),
						onHome: () => (this.currentView = "home"),
						onApps: () => (this.currentView = "apps"),
						onSettings: () => (this.currentView = "settings"),
					});
				if (view === "apps")
					return h(AppsScreen, {
						onOpenProxy: () => (this.currentView = "proxy"),
						onHome: () => (this.currentView = "home"),
						onGames: () => (this.currentView = "games"),
						onSettings: () => (this.currentView = "settings"),
					});
				if (view === "settings")
					return h(SettingsScreen, {
						onOpenProxy: () => (this.currentView = "proxy"),
						onHome: () => (this.currentView = "home"),
						onGames: () => (this.currentView = "games"),
						onApps: () => (this.currentView = "apps"),
					});
				return h(HomeScreen, {
					onOpenProxy: () => (this.currentView = "proxy"),
					onGames: () => (this.currentView = "games"),
					onApps: () => (this.currentView = "apps"),
					onSettings: () => (this.currentView = "settings"),
				});
			})}
		</div>
	`;
}

window.addEventListener("load", async () => {
	const attemptCloak = () => {
		if (window.self !== window.top || !store.autoCloak || store.autoCloak === 'none') {
			return true; // We don't need to cloak
		}
		
		let win = null;
		if (store.autoCloak === 'aboutBlank') {
			win = window.open('about:blank', '_blank');
			if (win) {
				let iframe = win.document.createElement('iframe');
				iframe.src = location.href;
				iframe.style.width = '100vw';
				iframe.style.height = '100vh';
				iframe.style.border = 'none';
				iframe.style.margin = '0';
				win.document.body.style.margin = '0';
				win.document.body.appendChild(iframe);
				location.replace('https://classroom.google.com/');
				return true;
			}
		} else if (store.autoCloak === 'blob') {
			const blob = new Blob(
				[`<!DOCTYPE html><html><head><title>Tasks</title><link rel="icon" href="https://ssl.gstatic.com/images/branding/product/1x/tasks_2021_32dp.png"></head><body style="margin:0;"><iframe src="${location.href}" style="width:100vw;height:100vh;border:none;margin:0;"></iframe></body></html>`],
				{ type: "text/html" }
			);
			const url = URL.createObjectURL(blob);
			win = window.open(url, '_blank');
			if (win) {
				location.replace('https://classroom.google.com/');
				return true;
			}
		}
		
		return false; // Cloak was requested but failed (popup blocked)
	};

	if (!attemptCloak()) {
		// If popups are blocked on load, wait for ANY user interaction on the entire document to bypass it
		const triggerCloakOnInteraction = () => {
			if (attemptCloak()) {
				// Clean up listeners if successful
				window.removeEventListener('click', triggerCloakOnInteraction);
				window.removeEventListener('keydown', triggerCloakOnInteraction);
				window.removeEventListener('touchstart', triggerCloakOnInteraction);
			}
		};
		window.addEventListener('click', triggerCloakOnInteraction);
		window.addEventListener('keydown', triggerCloakOnInteraction);
		window.addEventListener('touchstart', triggerCloakOnInteraction);
	}

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
	try {
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
	} catch (e) {
		console.warn("Logo failed to load:", e);
	}
});
