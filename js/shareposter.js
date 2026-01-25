// shareposter.js
// Requires global: html2canvas, QRCode

(function(global) {
	async function createSharePoster(opts) {
		const {
			// 必填（由你的 Vue 传进来）
			title,
			desc,
			url, // 用来生成二维码 & 显示在右下角

			// 可选（你可按需传）
			shareLine = "我觉得这篇不错，分享给你 ~",
			leftHint1 = "长按扫描二维码",
			leftHint2 = "查看文章",
			footerLeft = "© 企鹅企企",
			footerRight = url || "",
			fileName = "share-poster.png",
			scale = 2, // 2 清晰且体积适中，3 更清晰更大
			width = 1080, // 海报宽度
			padding = 56, // 外边距
			maxDescLines = 6, // 简介最多显示几行（避免太长撑爆）
			// 是否自动下载（否则只返回 blob 给你自己处理）
			autoDownload = true,
			// 额外：如果你想把 footerRight 显示成站点而不是完整 url
			footerRightText,
		} = (opts || {});

		if (!global.html2canvas) throw new Error(
			"Missing html2canvas. Please include it before shareposter.js");
		if (!global.QRCode) throw new Error("Missing QRCode lib. Please include it before shareposter.js");
		if (!title) throw new Error("createSharePoster: missing title");
		if (!desc) throw new Error("createSharePoster: missing desc");
		if (!url) throw new Error("createSharePoster: missing url");

		await ensureGoogleFontsLoaded();

		const qrDataUrl = await global.QRCode.toDataURL(url, {
			errorCorrectionLevel: "M",
			margin: 0,
			width: 240, // 生成更大再缩小，边缘更利落
			color: {
				dark: "#000000",
				light: "#FFFFFF"
			},
		});

		const mount = document.createElement("div");
		mount.style.position = "fixed";
		mount.style.left = "-100000px";
		mount.style.top = "0";
		mount.style.zIndex = "-1";
		mount.style.pointerEvents = "none";
		document.body.appendChild(mount);

		const style = document.createElement("style");
		style.textContent = buildPosterCSS(width, padding, maxDescLines);
		mount.appendChild(style);

		const poster = document.createElement("div");
		poster.className = "poster-wrap";
		poster.innerHTML = `
      <div class="multi-gradient-bg"></div>
      <div class="content">
        <div class="glass">
          <div class="inner-border">
            <div class="pad">

              <div class="shareline">${escapeHtml(shareLine)}</div>

              <div class="title">${escapeHtml(title)}</div>

              <div class="desc">${escapeHtml(desc)}</div>

              <div class="qr-row">
                <div class="qr-left">
                  <div>${escapeHtml(leftHint1)}</div>
                  <div>${escapeHtml(leftHint2)}</div>
                </div>

                <div class="qr-card">
                  <img class="qr-img" src="${qrDataUrl}" alt="QR" />
                </div>
              </div>

              <div class="footer">
                <div>${escapeHtml(footerLeft)}</div>
                <div>${escapeHtml(footerRightText || footerRight)}</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;
		mount.appendChild(poster);

		// 等排版 & 字体
		await nextFrame();
		await (document.fonts?.ready?.catch(() => {}) || Promise.resolve());

		const canvas = await global.html2canvas(poster, {
			backgroundColor: null,
			scale,
			useCORS: true,
			allowTaint: false,
			logging: false,
		});

		const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1));
		if (!blob) {
			mount.remove();
			throw new Error("createSharePoster: canvas.toBlob returned null");
		}

		if (autoDownload) downloadBlob(blob, fileName);

		mount.remove();
		return {
			blob,
			canvas
		};
	}

	// ---------- helpers ----------
	function buildPosterCSS(width, padding, maxDescLines) {
		return `
      .poster-wrap{
        width:${width}px;
        height:auto;
        position:relative;
        overflow:hidden;
        background:#fff;
        font-family:"Noto Sans SC", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale;
      }
      .multi-gradient-bg{
        position:absolute; inset:0;
        background-image:
          radial-gradient(1600px circle at 15% 8%, rgba(92, 160, 241, 0.10) 0%, transparent 100%),
          radial-gradient(900px circle at 85% 18%, rgba(65, 247, 123, 0.05) 0%, transparent 100%),
          radial-gradient(1500px circle at 50% 120%, rgba(148, 163, 184, 0.30) 0%, transparent 100%),
          linear-gradient(180deg, rgba(238, 242, 255, 1) 0%, rgba(248, 250, 252, 1) 100%);
      }
      .content{ position:relative; padding:${padding}px; }
      .glass{
        background:rgba(255,255,255,0.80);
        backdrop-filter:blur(24px);
        border:1px solid rgba(229,229,229,0.80);
        box-shadow:0 30px 90px rgba(0,0,0,0.12);
      }
      .inner-border{
        border:1px solid rgba(229,229,229,0.70);
        margin:16px;
      }
      .pad{
        padding:80px 60px 40px 60px;
        display:flex;
        flex-direction:column;
        gap:56px;
      }
      .shareline{
        font-size:36px;
        color:#737373;
        font-weight:400;
      }
      .title{
        font-family:"Noto Serif SC","Noto Sans SC", Georgia, serif;
        font-size:80px;
        line-height:1.14;
        font-weight:800;
        color:#171717;
        letter-spacing:0.5px;
        word-break:break-word;
      }
      .desc{
        max-width:880px;
        font-size:42px;
        line-height:1.75;
        color:#404040;
        font-weight:600;
        word-break:break-word;

        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:${maxDescLines};
        overflow:hidden;
      }
      .qr-row{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:48px;
        margin-top:240px;
      }
      .qr-left{
        display:flex;
        flex-direction:column;
        gap:6px;
        color:#525252;
        font-size:32px;
        line-height:1.3;
        font-weight:500;
      }
      .qr-card{
        background:rgba(255,255,255,0.95);
        backdrop-filter:blur(12px);
        border:1px solid rgba(229,229,229,0.80);
        border-radius:16px;
        box-shadow:0 18px 50px rgba(0,0,0,0.10);
        padding:12px;
      }
      .qr-img{
        width:120px;
        height:120px;
        display:block;
        background:#fff;
				border-radius:0px;
      }
      .footer{
        display:flex;
        justify-content:space-between;
        align-items:center;
        font-size:24px;
        font-weight:600;
        color:#a3a3a3;
      }
    `;
	}

	async function ensureGoogleFontsLoaded() {
		if (!document.querySelector('link[data-poster-font="noto-sc"]')) {
			const pre1 = document.createElement("link");
			pre1.rel = "preconnect";
			pre1.href = "https://fonts.googleapis.com";
			pre1.setAttribute("data-poster-font", "noto-sc");
			document.head.appendChild(pre1);

			const pre2 = document.createElement("link");
			pre2.rel = "preconnect";
			pre2.href = "https://fonts.gstatic.com";
			pre2.crossOrigin = "anonymous";
			document.head.appendChild(pre2);

			const css = document.createElement("link");
			css.rel = "stylesheet";
			css.href =
				"https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&family=Noto+Serif+SC:wght@200..900&display=swap";
			document.head.appendChild(css);
		}

		if (document.fonts && document.fonts.ready) {
			await document.fonts.ready.catch(() => {});
		} else {
			await new Promise((r) => setTimeout(r, 200));
		}
	}

	function downloadBlob(blob, fileName) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName || "poster.png";
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	function nextFrame() {
		return new Promise((r) => requestAnimationFrame(() => r()));
	}

	function escapeHtml(str) {
		return String(str ?? "")
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#039;");
	}

	// 暴露到全局
	global.createSharePoster = createSharePoster;
})(window);