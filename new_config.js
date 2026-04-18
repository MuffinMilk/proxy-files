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
      <dialog class="cfg" style="background-color: #121212; color: white; border-radius: 8px; padding: 0; position: relative; overflow: hidden; border: 1px solid #333;">
        <button class="close-cfg-btn" on:click=${() => handleModalClose(this.root)}>
            <i class="fa-solid fa-xmark"></i>
        </button>
        <iframe class="cfg-iframe" src="https://dev.desmos.live.cdn.cloudflare.net/~"></iframe>
      </dialog>
  `;
}
