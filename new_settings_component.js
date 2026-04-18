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
	`;

	this.activeTab = 'cloaking';

	const changeTab = (tabId) => {
		this.activeTab = tabId;
		this.mount();
	};

	let transportOutput = store.transport;

	return html`
		<div style="height: 100%; width: 100%; display: flex; justify-content: center; align-items: center; position: relative;">
			<ul class="navbar" style="z-index: 2000;">
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
					
					<li class="settingItem ${this.activeTab === 'cloaking' ? 'active' : ''}" on:click=${() => changeTab('cloaking')}>
						<span class="material-symbols-outlined" style="margin-right: 8px;">ad_group_off</span>Cloaking
					</li>
					<li class="settingItem ${this.activeTab === 'performance' ? 'active' : ''}" on:click=${() => changeTab('performance')}>
						<span class="material-symbols-outlined" style="margin-right: 8px;">speed</span>Performance
					</li>
					<li class="settingItem ${this.activeTab === 'themes' ? 'active' : ''}" on:click=${() => changeTab('themes')}>
						<span class="material-symbols-outlined" style="margin-right: 8px;">palette</span>Themes
					</li>
					<li class="settingItem ${this.activeTab === 'proxy' ? 'active' : ''}" on:click=${() => changeTab('proxy')}>
						<span class="material-symbols-outlined" style="margin-right: 8px;">public</span>Proxy & Browser
					</li>
					
					<hr style="margin: 10px 0; border: none; border-bottom: 1px solid rgba(255,255,255,0.05);" />
					
					<li class="settingItem ${this.activeTab === 'account' ? 'active' : ''}" on:click=${() => changeTab('account')}>
						<span class="material-symbols-outlined" style="margin-right: 8px;">account_circle</span>Account
					</li>
					<li class="settingItem ${this.activeTab === 'about' ? 'active' : ''}" on:click=${() => changeTab('about')}>
						<span class="material-symbols-outlined" style="margin-right: 8px;">help</span>About & Statistics
					</li>
					
					<hr style="margin: 10px 0; border: none; border-bottom: 1px solid rgba(255,255,255,0.05);" />
					
					<li class="settingItem ${this.activeTab === 'news' ? 'active' : ''}" on:click=${() => changeTab('news')}>
						<span class="material-symbols-outlined" style="margin-right: 8px;">rocket_launch</span>News & Updates
					</li>
					<li class="settingItem ${this.activeTab === 'faq' ? 'active' : ''}" on:click=${() => changeTab('faq')}>
						<span class="material-symbols-outlined" style="margin-right: 8px;">contact_support</span>FAQ
					</li>
				</ul>
				
				<div class="scontent">
					${this.activeTab === 'cloaking' ? html`
						<h1 class="tab-title">Cloaking</h1>
						<div class="settingsection">
							<h1>About:Blank & Blob Cloaking</h1>
							<p>About:Blank allows you to hide your tab history, and blockers such as GoGuardian by appearing that you are on a blank tab. If About:Blank doesn't work, then you can try using the blob cloaking which uses temporary data.</p>
							<div style="display: flex; gap: 10px; width: 100%;">
								<button class="splitbutton">Launch About:Blank</button>
								<button class="splitbutton">Launch Blob</button>
							</div>
						</div>

						<div class="settingsection">
							<h1>Automatic cloaking</h1>
							<p>This toggles automatic cloaking when the site first loads which hides the site from entering your history.</p>
							<p><b>Note: Only one automatic cloaking toggle is allowed at a time.</b></p>
							<hr />
							<p style="margin-bottom: 5px;">Auto-Launch About:Blank</p>
							<label class="switch"><input type="checkbox" /><span class="slider round"></span></label>
							<p style="margin-bottom: 5px;">Auto-Launch Blob</p>
							<label class="switch"><input type="checkbox" checked /><span class="slider round"></span></label>
						</div>

						<div class="settingsection">
							<h1>Tab Cloaking</h1>
							<p>Tab Cloaking cloaks the name of the tab & icon, so your tab stays hidden from sight. Select a cloak down below to activate it.</p>
							<div class="dropdown">
								<button class="dropdown-button">
									<span>None (Default)</span>
									<span class="material-symbols-outlined">chevron_right</span>
								</button>
							</div>
						</div>
						
						<div class="settingsection">
							<h1>Panic Key</h1>
							<p>Press the selected keybind to go to another site quickly. You can set multiple keybinds by seperating them with a comma.</p>
							<div class="pgroup">
								<span class="material-symbols-outlined picon">keyboard</span>
								<input placeholder="Set a keybind. Backtick by default" value="\`" />
							</div>
							<button class="buttonreg" style="max-width: 200px;">Save</button>
						</div>
					` : ''}

					${this.activeTab === 'performance' ? html`
						<h1 class="tab-title">Performance</h1>
						<div class="settingsection">
							<h1>Background Particles</h1>
							<p>This enables the background star particle effects, this is on by default. <b>Performance Impact:</b> High on low-end devices</p>
							<label class="switch" style="margin-top: 10px;"><input type="checkbox" checked /><span class="slider round"></span></label>
						</div>
					` : ''}

					${this.activeTab === 'themes' ? html`
						<h1 class="tab-title">Themes</h1>
						<div class="settingsection">
							<h1>Default Themes</h1>
							<p>Here's some themes for you to choose from. You can also join our Discord for theme submissions, under suggestions.</p>
							<div class="dropdown">
								<button class="dropdown-button">
									<span>Default</span>
									<span class="material-symbols-outlined">chevron_right</span>
								</button>
							</div>
						</div>
					` : ''}

					${this.activeTab === 'proxy' ? html`
						<h1 class="tab-title">Proxy & Browser</h1>
						<div class="settingsection">
							<h1>Proxy</h1>
							<p>Proxies are what run the unblocking backend for you to enjoy the games and apps that we display.</p>
							<p>Changing the proxy may make some games perform better, run sites faster, and may make your overall experience better. For more information, join our Discord.</p>
							<div class="dropdown">
								<button class="dropdown-button"><span>Scramjet</span><span class="material-symbols-outlined">chevron_right</span></button>
							</div>
						</div>

						<div class="settingsection">
							<h1>Transport</h1>
							<p>Transport is the method of how the proxy will transport information</p>
							<p>Changing the transport may make some proxies perform better, but may also cause issues for others. Transport switching is an advanced feature, not recommended if you dont know what your doing.</p>
							<div class="dropdown">
								<button class="dropdown-button"><span>Libcurl</span><span class="material-symbols-outlined">chevron_right</span></button>
							</div>
							
							<div style="display: flex; gap: 10px; margin-top: 15px;">
								<button class="buttonreg" on:click=${() => { connection.setTransport("/baremod/index.mjs", [store.bareurl]); store.transport = "/baremod/index.mjs"; this.mount(); }}>bare server 3</button>
								<button class="buttonreg" on:click=${() => { connection.setTransport("/libcurl/index.mjs", [{ wisp: store.wispurl }]); store.transport = "/libcurl/index.mjs"; this.mount(); }}>libcurl.js</button>
								<button class="buttonreg" on:click=${() => { connection.setTransport("/epoxy/index.mjs", [{ wisp: store.wispurl }]); store.transport = "/epoxy/index.mjs"; this.mount(); }}>epoxy</button>
							</div>
							<p style="margin-top: 15px;"><b>Active configuration:</b> ${store.transport}</p>
						</div>

						<div class="settingsection">
							<h1>Wisp Server</h1>
							<p>Enter an Alternative Wisp Server to connect to. This url must start with a ws(s):// and end with a /</p>
							<div class="pgroup">
								<span class="material-symbols-outlined picon">dns</span>
								<input value=${use(store.wispurl)} on:input=${(e) => store.wispurl = e.target.value} spellcheck="false" />
							</div>
							
							<p>Enter an Alternative Bare Server to connect to.</p>
							<div class="pgroup">
								<span class="material-symbols-outlined picon">dns</span>
								<input value=${use(store.bareurl)} on:input=${(e) => store.bareurl = e.target.value} spellcheck="false" />
							</div>
							
							<div style="display: flex; gap: 10px; width: 100%; margin-top: 10px;">
							    <button class="buttonreg">Save</button>
							    <button class="buttonreg">Reset</button>
							</div>
						</div>

						<div class="settingsection">
							<h1>Browser</h1>
							<p>This allows you to change settings about the browser and the elements within it. You can change the search engine or add/remove the utility bar.</p>
							<hr />
							<p>Search Engine</p>
							<div class="dropdown">
								<button class="dropdown-button"><span>DuckDuckGo (default)</span><span class="material-symbols-outlined">chevron_right</span></button>
							</div>
							<p style="margin-top: 15px;">Enable Utility Bar</p>
							<p>This enables the basic top bar that you see when using the proxy. (Recommended)</p>
							<label class="switch"><input type="checkbox" checked /><span class="slider round"></span></label>
						</div>
					` : ''}

					${this.activeTab === 'account' ? html`
						<h1 class="tab-title">Account Settings</h1>
						<div class="settingsection">
							<h1>Password Protection</h1>
							<p>Protect your account with a password that way only you can view the site.</p>
							<label class="switch"><input type="checkbox" /><span class="slider round"></span></label>
							<p>Please remember that when setting your password, set it to something only you can remember, that way you do not get locked out of your account.</p>
							<div class="pgroup">
								<span class="material-symbols-outlined picon">lock</span>
								<input type="password" placeholder="Set Password" />
							</div>
							<button class="buttonreg" style="max-width: 300px;">Save</button>
						</div>
						
						<div class="settingsection">
							<h1>Password Keybind</h1>
							<p>Set the keybind to toggle the password appearing on screen. By default you will need to hold shift an then press <code style="background: rgba(255,255,255,0.1); padding: 2px 5px; border-radius: 4px;">~</code> (left of the 1 key).</p>
							<div class="pgroup">
							    <span class="material-symbols-outlined picon">keyboard</span>
							    <input placeholder="Set a keybind. Tilda by default" />
							</div>
							<button class="buttonreg" style="max-width: 300px;">Save</button>
						</div>
						
						<div class="settingsection">
							<h1>Import & Export Data</h1>
							<p>Import simply loads your current userData and boots most of your user settings and data from the last site.</p>
							<div style="display: flex; gap: 10px; width: 100%;">
								<button class="splitbutton"><span class="material-symbols-outlined" style="font-size: 16px; margin-right: 5px; vertical-align: middle;">upload</span>Export Data</button>
								<button class="splitbutton"><span class="material-symbols-outlined" style="font-size: 16px; margin-right: 5px; vertical-align: middle;">download</span>Import Data</button>
							</div>
						</div>

						<div class="settingsection">
							<h1>Wipe all Data</h1>
							<p>Pressing this button will completely wipe all data, making it as if you never used this site. It is recommended that you export your data before doing this.</p>
							<button class="buttonreg" style="background: rgba(255, 0, 0, 0.2); border-color: rgba(255, 0, 0, 0.5); width: 100%;">Wipe all Data</button>
						</div>
					` : ''}

					${this.activeTab === 'about' ? html`
						<h1 class="tab-title">About & Statistics</h1>
						<div class="settingsection">
							<h1>Development Team</h1>
							<p>Space is completely open-source and is owned, maintained, and managed by the Twilight Development Group (TDG) at Night Network.</p>
						</div>
						<div class="settingsection">
							<h1>Version & Analytics</h1>
							<p style="margin-bottom: 5px;">You are currently on: <span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">v1.1.0</span></p>
							<p style="margin-bottom: 5px;">Server Status: <span style="background: rgba(0, 255, 0, 0.2); color: lightgreen; padding: 2px 6px; border-radius: 4px;">Running</span></p>
							<p>Load Times: <span style="background: rgba(255, 255, 0, 0.2); color: yellow; padding: 2px 6px; border-radius: 4px;">Medium</span></p>
						</div>
					` : ''}

					${this.activeTab === 'news' ? html`
						<h1 class="tab-title">News & Updates</h1>
						<div class="settingsection">
							<h1>Space has Updated! <span style="font-size: 12px; opacity: 0.7;">(Version release v1.1.0)</span></h1>
							<p>Added more fixes! Join our Discord to get more updates and changes.</p>
							<ul style="color: #aaa; font-size: 14px; padding-left: 20px;">
								<li style="margin-bottom: 5px;">Themes</li>
								<li style="margin-bottom: 5px;">Dropped support for Bare</li>
								<li>Fixed Cloaking</li>
							</ul>
						</div>
						
						<div class="settingsection">
							<h1>Space has released! <span style="font-size: 12px; opacity: 0.7;">(Version release v1.0.0)</span></h1>
							<p>Enjoy using all of the fun and exciting features we have packed into this site!</p>
							<ul style="color: #aaa; font-size: 14px; padding-left: 20px;">
								<li style="margin-bottom: 5px;">Out of this world UI</li>
								<li style="margin-bottom: 5px;">Games</li>
								<li style="margin-bottom: 5px;">Apps</li>
								<li style="margin-bottom: 5px;">Proxy</li>
								<li>Cloaking</li>
							</ul>
						</div>
					` : ''}

					${this.activeTab === 'faq' ? html`
						<h1 class="tab-title">Frequently asked questions</h1>
						<div class="settingsection">
							<h1>Where can I find links?</h1>
							<p>You can find links by joining our Discord. We have a community links channel, a link bot for dispensing links, and weekly links.</p>
						</div>
						<div class="settingsection">
							<h1>Why do some sites not load/work?</h1>
							<p>There can be a number of reason a site doesnt load but some of the common ones are listed below.</p>
							<ul style="color: #aaa; font-size: 14px; padding-left: 20px;">
								<li style="margin-bottom: 5px;">Proxy Server doesn't support the site(s)</li>
								<li style="margin-bottom: 5px;">Our servers are either down or experiencing high loads</li>
								<li style="margin-bottom: 5px;">Issue with the actual site you are visiting</li>
								<li>Security flaggers!</li>
							</ul>
						</div>
					` : ''}
				</div>
			</div>
			
			<div style="display: block; position: absolute; bottom: 10px; width: 100%; text-align: center; color: #888; z-index: 100;">
				<p class="banner" style="margin: 0; background: rgba(0,0,0,0.5); padding: 5px 15px; display: inline-block; border-radius: 20px; font-size: 14px;">Hosted by <span style="color: rgba(200, 50, 255, 1); text-decoration: none;">Billiger</span> <i style="margin-left: 10px; cursor: pointer;" class="fa-solid fa-xmark"></i></p>
			</div>
		</div>
	`;
}
