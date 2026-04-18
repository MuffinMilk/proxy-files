function BrowserApp() {
	this.css = `
		--navbar-background-color: rgb(22, 22, 22);
		--header-active-background-color: rgba(140, 0, 255, 0.55);
		--header-hover-background-color: rgba(140, 0, 255, 0.13);
		--hr-background: rgba(160, 160, 160, 0.274);
		--text-color: #ffffff;
		--utility-background-color: rgb(22, 22, 22);

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
			box-shadow: 1px 0 1px 0 rgba(66, 66, 66, 0.86);
			z-index: 2147483641;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 10px;
		}

		.navbar img.logo {
			width: 40px;
			height: 40px;
			margin-left: -5px;
		}

		.navbar hr { width: 40px; height: 1px; background: var(--hr-background); border: none; margin-top: 5px; margin-bottom: 5px; }
		.navbar span, .navbar i { font-size: 24px; padding: 10px; color: var(--text-color); transition: 0.12s; cursor: pointer; }
		.navbar span:hover, .navbar i:hover { background-color: var(--header-hover-background-color); border-radius: 7px; }
		#navactive { background-color: var(--header-active-background-color); border-radius: 7px; }

		/* Utility Bar (Top) */
		.utilityBar {
			position: fixed;
			left: calc(3.5em + 9px); 
			top: 0;
			width: calc(100% - 3.5em - 9px);
			height: 3.633em;
			background-color: var(--utility-background-color);
			z-index: 2147483640;
			box-shadow: 1.5px 1px 1px 0 rgba(0,0,0,0.5);
			display: flex;
			align-items: center;
			padding-left: 5px;
			padding-right: 5px;
		}

		.utilityBar-swoosh {
			position: absolute;
			z-index: 2147483640;
			left: calc(2.5rem + 9.63px);
			top: 3.633em;
		}

		.utilityBar-swoosh-outline {
			position: absolute;
			z-index: 2147483639;
			left: calc(2.5rem + 9.83px);
			top: calc(3.633em + 0.1px);
			filter: blur(0.75px);
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
			padding: 0px;
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
			padding: 8px;
		}

		.utility hr {
			width: 1px;
			height: 35px;
			min-width: 1px;
			background: var(--hr-background);
			border: none;
			margin-left: 10px;
			margin-right: 10px;
		}

		.search-header {
			flex-grow: 1;
			margin-left: 8px;
			margin-right: 8px;
			position: relative;
			display: flex;
			align-items: center;
		}

		.search-header__input {
			font-family: 'DM Sans', sans-serif;
			font-size: 16px;
			background-color: #0a0a0a;
			border: solid 0.5px #525252;
			color: #fff;
			padding: 0.5rem 1rem 0.5rem 40px;
			border-radius: 25px;
			height: 20px;
			min-width: 240px;
			box-sizing: content-box;
			width: 100%;
			transition: ease-in-out 0.2s;
		}

		.search-header__input:focus, .search-header__input:hover {
			outline: none;
			color: rgba(255, 255, 255, 0.81);
		}

		.search-header__button {
			position: absolute;
			left: 7px;
			margin-bottom: -2px;
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
			top: 3.633em;
			left: 3.5em;
			width: calc(100% - 3.5em);
			height: calc(100% - 3.633em);
			background: #252525;
		}

		iframe {
			width: 100%;
			height: 100%;
			border: none;
			background: #252525;
		}
	`;
	this.url = store.url;

	const frame = scramjet.createFrame();

	const handleMessage = (e) => {
		if (e.data && e.data.type === 'scramjet-navigate') {
			this.url = e.data.url;
			handleSubmit();
		}
	};

	this.mount = () => {
		window.addEventListener("message", handleMessage);
		const htmlStart = `<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');
    body, html { margin: 0; padding: 0; height: 100%; font-family: 'DM Sans', sans-serif; background-color: #000; color: #fff; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    
    .glow { position: absolute; bottom: -20vh; left: 50%; transform: translateX(-50%); width: 120vw; height: 50vh; background: radial-gradient(ellipse at bottom, rgba(200, 0, 255, 0.4) 0%, rgba(200, 0, 255, 0.1) 40%, transparent 70%); z-index: 0; }
    .glow2 { position: absolute; bottom: -10vh; left: 50%; transform: translateX(-50%); width: 80vw; height: 30vh; background: radial-gradient(ellipse at bottom, rgba(255, 255, 255, 0.2) 0%, transparent 60%); z-index: 0; }
    
    #particles-js { position: absolute; width: 100%; height: 100%; z-index: 1; }
    
    .container { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; margin-top: -30px; }
    
    .search-bar { display: flex; align-items: center; background: #0a0a0a; border: 1px solid #333; border-radius: 30px; padding: 12px 24px; width: 550px; margin-bottom: 50px; transition: 0.2s; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
    .search-bar:focus-within { border-color: #ae00ff; background: #111; }
    .search-bar img { height: 20px; margin-right: 12px; }
    .search-bar input { background: transparent; border: none; color: #fff; font-size: 16px; outline: none; width: 100%; font-family: 'DM Sans', sans-serif; }
    .search-bar input::placeholder { color: #888; }
    
    .cards { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; width: 880px; }
    
    .card {
      border-radius: 12px; height: 72px; display: flex; align-items: center; justify-content: center; text-decoration: none; color: white; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; border: none; outline: none; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: 'DM Sans', sans-serif;
    }
    .card:hover { transform: scale(1.03) translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.4); }
    .card img { height: 28px; }
    
    .c-google { background: #fff; color: #000; }
    .c-youtube { background: #fff; color: #000; }
    .c-spotify { background: #1DB954; }
    .c-discord { background: #5865F2; }
    .c-chatgpt { background: #10A37F; }
    .c-geforce { background: #76B900; color: #000; }
    .c-github { background: #111; border: 1px solid #333; }
    .c-twitch { background: #9146FF; }
    .c-espn { background: #CC0000; color: #fff; }
    .c-tiktok { background: #111; border: 1px solid #333; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
</head>
<body>
  <div class="glow"></div>
  <div class="glow2"></div>
  <div id="particles-js"></div>
  <div class="container">
    <div class="search-bar">
      <img src="https://api.iconify.design/logos:google-icon.svg">
      <input type="text" placeholder="Search Space..." id="q" onkeydown="if(event.key==='Enter') navigate(this.value);" autocomplete="off" />
    </div>
    
    <div class="cards">
      <button class="card c-google" onclick="navigate('https://google.com')"><img src="https://api.iconify.design/logos:google.svg"></button>
      <button class="card c-youtube" onclick="navigate('https://youtube.com')"><img src="https://api.iconify.design/logos:youtube.svg"></button>
      <button class="card c-spotify" onclick="navigate('https://open.spotify.com')"><img src="https://api.iconify.design/logos:spotify.svg" style="height:30px; filter: brightness(0) invert(1)"></button>
      <button class="card c-discord" onclick="navigate('https://discord.com/app')"><img src="https://api.iconify.design/logos:discord.svg" style="height:22px; filter: brightness(0) invert(1)"></button>
      <button class="card c-chatgpt" onclick="navigate('https://chatgpt.com')"><img src="https://api.iconify.design/logos:openai-icon.svg" style="height:26px; filter: brightness(0) invert(1)"><span style="font-size:22px; font-weight:600">ChatGPT</span></button>

      <button class="card c-geforce" onclick="navigate('https://play.geforcenow.com')"><img src="https://api.iconify.design/simple-icons:nvidia.svg?color=black" style="height:26px"><span style="font-size:18px; font-weight:900; letter-spacing:-0.5px; text-transform:uppercase">GeForce NOW</span></button>
      <button class="card c-github" onclick="navigate('https://github.com')"><img src="https://api.iconify.design/mdi:github.svg?color=white" style="height:32px"><span style="font-size:24px; font-weight:700">GitHub</span></button>
      <button class="card c-twitch" onclick="navigate('https://twitch.tv')"><img src="https://api.iconify.design/mdi:twitch.svg?color=white" style="height:30px"><span style="font-size:24px; font-weight:800; letter-spacing:-1px">Twitch</span></button>
      <button class="card c-espn" onclick="navigate('https://espn.com')"><span style="font-size:36px; font-weight:900; letter-spacing:-2px; font-style:italic; padding-right: 5px;">ESPN</span></button>
      <button class="card c-tiktok" onclick="navigate('https://tiktok.com')"><img src="https://api.iconify.design/logos:tiktok-icon.svg" style="height:24px; filter: brightness(0) invert(1)"><span style="font-size:22px; font-weight:700">TikTok</span></button>
    </div>
  </div>
  
  <script>
    function navigate(url) {
      if(!url.trim()) return;
      if(!url.startsWith('http') && !url.includes('.')) url = 'https://google.com/search?q=' + encodeURIComponent(url);
      else if (!url.startsWith('http')) url = 'https://' + url;
      window.parent.postMessage({ type: 'scramjet-navigate', url: url }, '*');
    }
    document.getElementById('q').focus();
    particlesJS('particles-js', {
      particles: { number: { value: 60, density: { enable: true, value_area: 800 } }, color: { value: '#ffffff' }, size: { value: 2, random: true }, opacity: { value: 0.6, random: true }, line_linked: { enable: false }, move: { enable: true, speed: 0.3, direction: 'top' } }
    });
  </script>
</body>
</html>`;
		const encoded = btoa(unescape(encodeURIComponent(htmlStart)));
		if (!this.url || this.url === "about:space") {
			frame.go(`data:text/html;base64,${encoded}`);
		} else {
			frame.go(this.url);
		}
	};

	frame.addEventListener("urlchange", (e) => {
		if (!e.url) return;
		if (e.url.startsWith("data:text/html")) {
			this.url = ""; 
		} else {
			this.url = e.url;
		}
	});

	const handleSubmit = () => {
		let target = this.url.trim();
		if (!target) {
			this.url = "about:space";
			this.mount();
			return;
		}
		if (!target.startsWith("http") && target.includes(".")) {
			target = "https://" + target;
		} else if (!target.startsWith("http")) {
			target = "https://google.com/search?q=" + encodeURIComponent(target);
		}
		this.url = target;
		return frame.go(target);
	};

	return html`
		<div>
			<ul class="navbar">
				<li style="margin-left: -1px; margin-top: 2px;">
					<img class="logo" src="/assets/logo.webp" alt="Logo" onerror="this.src='https://api.dicebear.com/7.x/initials/png?seed=Space&backgroundColor=111111&textColor=ffffff'" />
				</li>
				<hr style="margin-top: 5px" />
				<li><span class="material-symbols-outlined" on:click=${this.onCloseProxy}>cottage</span></li>
				<li><span class="material-symbols-outlined" on:click=${this.onCloseProxy}>joystick</span></li>
				<li><span class="material-symbols-outlined" on:click=${this.onCloseProxy}>apps</span></li>
				<li><span id="navactive" class="material-symbols-outlined">public</span></li>
				<hr />
				<li><span class="material-symbols-outlined" on:click=${() => document.querySelector(".cfg")?.showModal()}>tune</span></li>
				<li><i class="fa-brands fa-discord"></i></li>
			</ul>

			<!-- SVG Swoosh Decoration mimicking desmos.live structure -->
			<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" class="utilityBar-swoosh">
				<path d="M30 0H0V30C0 30 -1.11468e-05 18.2353 8.86364 9.11765C17.7273 0 30 0 30 0Z" fill="#161616" />
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" class="utilityBar-swoosh-outline">
				<path d="M30 0H0V30C0 30 -1.11468e-05 18.2353 8.86364 9.11765C17.7273 0 30 0 30 0Z" stroke="rgba(66, 66, 66, 0.86)" stroke-width="2" />
			</svg>

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
							<svg fill="none" viewBox="0 0 18 18" height="18" width="18"><path fill="#868686" d="M7.132 0C3.197 0 0 3.124 0 6.97c0 3.844 3.197 6.969 7.132 6.969 1.557 0 2.995-.49 4.169-1.32L16.82 18 18 16.847l-5.454-5.342a6.846 6.846 0 0 0 1.718-4.536C14.264 3.124 11.067 0 7.132 0zm0 .82c3.48 0 6.293 2.748 6.293 6.15 0 3.4-2.813 6.149-6.293 6.149S.839 10.37.839 6.969C.839 3.568 3.651.82 7.132.82z"></path></svg>
						</button>
						<input 
							class="search-header__input"
							type="text"
							placeholder="Enter search or web address"
							id="gointospace2"
							bind:value=${use(this.url)} 
							on:input=${(e) => { this.url = e.target.value; }} 
							on:keydown=${(e) => e.keyCode == 13 && (store.url = this.url) && handleSubmit()}
						/>
					</div>
					<hr style="margin-left: 0; min-width: 1px" />
					<li>
						<div class="utilityIcon" on:click=${this.onCloseProxy}>
							<span class="material-symbols-outlined">cottage</span>
						</div>
					</li>
					<li>
						<div class="utilityIcon">
							<span class="material-symbols-outlined">code</span>
						</div>
					</li>
					<li>
						<div class="utilityIcon" on:click=${() => document.documentElement.requestFullscreen()}>
							<span class="material-symbols-outlined">fullscreen</span>
						</div>
					</li>
					<li>
						<div class="utilityIcon" on:click=${() => window.open(scramjet.encodeUrl(this.url))} style="margin-right: 14px">
							<span class="material-symbols-outlined">instant_mix</span> 
						</div>
					</li>
				</ul>
			</div>

			<div class="proxyWrapper">
				${frame.frame}
			</div>
		</div>
	`;
}
