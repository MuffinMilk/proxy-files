function BrowserApp() {
	this.css = `
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		background: #000;

		/* Top Bar */
		.omm-bar {
			height: 48px;
			background: #0a0a0a;
			display: flex;
			align-items: center;
			padding: 0 16px;
			box-shadow: 0 1px 3px rgba(0,0,0,0.5);
			z-index: 1001;
			border-bottom: 1px solid #222;
		}

		.omm-bar svg {
			fill: #888;
			width: 18px;
			height: 18px;
			margin-right: 12px;
			margin-bottom: 2px;
		}

		.omm-bar input {
			background: transparent;
			border: none;
			color: #fff;
			font-family: 'DM Sans', sans-serif;
			font-size: 14px;
			width: 100%;
			outline: none;
		}

		.omm-bar input:focus {
			color: #ae00ff;
		}

		.close-btn {
			background: transparent;
			border: none;
			color: #888;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 8px;
			border-radius: 50%;
			transition: 0.2s;
			margin-left: 8px;
		}

		.close-btn:hover {
			background: #222;
			color: #fff;
		}

		/* Frame container */
		.proxyWrapper {
			flex: 1;
			position: relative;
		}

		iframe {
			width: 100%;
			height: 100%;
			border: none;
			background: #000;
		}
	`;
	this.url = store.url;

	const frame = scramjet.createFrame();

	this.mount = () => {
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
      window.location.href = url;
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
			<div class="omm-bar">
				<svg fill="none" viewBox="0 0 18 18"><path fill="#868686" d="M7.132 0C3.197 0 0 3.124 0 6.97c0 3.844 3.197 6.969 7.132 6.969 1.557 0 2.995-.49 4.169-1.32L16.82 18 18 16.847l-5.454-5.342a6.846 6.846 0 0 0 1.718-4.536C14.264 3.124 11.067 0 7.132 0zm0 .82c3.48 0 6.293 2.748 6.293 6.15 0 3.4-2.813 6.149-6.293 6.149S.839 10.37.839 6.969C.839 3.568 3.651.82 7.132.82z"></path></svg>
				<input 
					type="text" 
					placeholder="Enter search or web address"
					bind:value=${use(this.url)}
					on:input=${(e) => { this.url = e.target.value; }} 
					on:keydown=${(e) => e.keyCode == 13 && (store.url = this.url) && handleSubmit()}
				/>
				<button class="close-btn" on:click=${this.onCloseProxy}>
					<i class="fas fa-times"></i>
				</button>
			</div>

			<div class="proxyWrapper">
				${frame.frame}
			</div>
		</div>
	`;
}
