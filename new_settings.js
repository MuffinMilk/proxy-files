function SettingsScreen() {
	this.css = `
		--background-color: #000;
		--header-active-background-color: rgba(140, 0, 255, 0.55);
		--header-hover-background-color: rgba(140, 0, 255, 0.13);
		--text-color: #ffffff;
		--navbar-background-color: rgb(22, 22, 22);
		--hr-background: rgba(160, 160, 160, 0.274);

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

		.settings-container {
			position: absolute;
			left: 3.5em;
			top: 0;
			width: calc(100% - 3.5em);
			height: 100%;
			background: transparent;
			padding: 0;
			box-sizing: border-box;
		}

		iframe.settings-frame {
			width: 100%;
			height: 100%;
			border: none;
			background: transparent;
		}
	`;

	return html`
		<div style="height: 100%; width: 100%;">
			<ul class="navbar">
				<li style="margin-left: 0px; margin-top: 10px; margin-bottom: 5px;">
					<img class="logo" src="https://dev.desmos.live.cdn.cloudflare.net/assets/logo.webp" alt="Logo" onerror="this.src='https://api.dicebear.com/7.x/initials/png?seed=D&backgroundColor=111111&textColor=ffffff'" />
				</li>
				<hr style="margin-top: 5px" />
				<li><span class="material-symbols-outlined" on:click=${this.onHome}>cottage</span></li>
				<li><span class="material-symbols-outlined" on:click=${this.onGames}>joystick</span></li>
				<li><span class="material-symbols-outlined" on:click=${this.onApps}>apps</span></li>
				<li><span class="material-symbols-outlined" on:click=${this.onOpenProxy}>public</span></li>
				<hr />
				<li><span id="navactive" class="material-symbols-outlined">tune</span></li>
				<li><i class="fa-brands fa-discord" style="margin-top: 10px; font-size: 22px;"></i></li>
			</ul>

			<div class="settings-container">
				<iframe class="settings-frame" src="https://dev.desmos.live.cdn.cloudflare.net/~"></iframe>
			</div>
		</div>
	`;
}
