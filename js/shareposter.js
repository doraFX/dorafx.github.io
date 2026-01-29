// shareposter.js
// Requires global: html2canvas, QRCode

(function(global) {
	async function createSharePoster(opts) {
		const {
			// required
			title,
			desc,
			url,

			// type: article | media | app
			type = "article",

			// media/app optional
			coverUrl = "", // media cover (image)
			appIconUrl = "", // app icon
			appSlogan = "", // app slogan
			appVersion = "", // e.g. "v1.0.0" or "1.0.0"
			appVersionLabel = "",
			appStatusText = "", // e.g. "已发布" / "Developing"

			// ===== IP optional =====
			ipName = "", // IP 名称
			ipDesc = "", // IP 简介
			ipHeroUrl = "", // 竖屏 Hero 图
			ipIconUrl = "", // IP Icon

			// optional copy
			shareLine = "我觉得这篇不错，分享给你 ~",
			leftHint1 = "长按扫描二维码",
			leftHint2 = "查看文章",
			footerLeft = "© 企鹅企企",
			footerRight = url || "",
			fileName = "share-poster.png",
			scale = 2,
			width = 1080,
			padding = 56,
			maxDescLines = 6,
			autoDownload = true,
			footerRightText,
		} = opts || {};

		if (!global.html2canvas)
			throw new Error("Missing html2canvas. Please include it before shareposter.js");
		if (!global.QRCode) throw new Error("Missing QRCode lib. Please include it before shareposter.js");
		if (!title) throw new Error("createSharePoster: missing title");
		if (!url) throw new Error("createSharePoster: missing url");
		if (type === "article" && !desc) throw new Error("createSharePoster: missing desc");

		await ensureGoogleFontsLoaded();

		const qrDataUrl = await global.QRCode.toDataURL(url, {
			errorCorrectionLevel: "M",
			margin: 0,
			width: 240,
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

		poster.innerHTML = buildPosterHTML({
			type,
			title,
			desc,
			qrDataUrl,
			shareLine,
			leftHint1,
			leftHint2,
			footerLeft,
			footerRight: footerRightText || footerRight,
			coverUrl,
			appIconUrl,
			appSlogan,
			appVersion,
			appVersionLabel,
			appStatusText,
			ipHeroUrl,
			ipIconUrl,
			ipName,
			ipDesc,
		});

		mount.appendChild(poster);

		// wait layout & fonts
		await nextFrame();
		await (document.fonts?.ready?.catch(() => {}) || Promise.resolve());

		// wait background image (for media/app) to reduce blank renders
		await waitBgImagesLoaded(poster).catch(() => {});

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

	// ---------- templates ----------
	function buildPosterHTML({
		type,
		title,
		desc,
		qrDataUrl,
		shareLine,
		leftHint1,
		leftHint2,
		footerLeft,
		footerRight,
		coverUrl,
		appIconUrl,
		appSlogan,
		appVersion,
		appVersionLabel,
		appStatusText,
		ipHeroUrl,
		ipIconUrl,
		ipName,
		ipDesc,
	}) {
		if (type === "media") {
			return `
        <div class="multi-gradient-bg"></div>
        <div class="content">
          <div class="glass">
            <div class="inner-border">
              <div class="pad pad-media">

                <div class="cover">
                  ${
                    coverUrl
                      ? `<div class="cover-img" style="background-image:url('${escapeAttr(coverUrl)}')"></div>`
                      : `<div class="cover-ph"></div>`
                  }
                  <div class="cover-vignette"></div>
                </div>

                <div class="title"><div class="up25">${escapeHtml(title)}</div></div>

                <div class="qr-row qr-row-media">
                  <div class="qr-left">
                    <div><div class="up25">${escapeHtml(leftHint1)}</div></div>
                    <div><div class="up25">${escapeHtml(leftHint2 || "查看作品")}</div></div>
                  </div>

                  <div class="qr-card">
                    <img class="qr-img" src="${qrDataUrl}" alt="QR" />
                  </div>
                </div>

                <div class="footer">
                  <div><div class="up25">${escapeHtml(footerLeft)}</div></div>
                  <div><div class="up25">${escapeHtml(footerRight)}</div></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      `;
		}

		if (type === "app") {
			const safeVer = (appVersion || "").trim();
			const verText = safeVer ?
				(safeVer.toLowerCase().startsWith("v") ? safeVer : `v${safeVer}`) :
				"";

			return `
        <div class="multi-gradient-bg"></div>
        <div class="content">
          <div class="glass">
            <div class="inner-border">
              <div class="pad pad-app">

                <div class="shareline"><div class="up25">${escapeHtml(shareLine || "我觉得这个 App 不错，分享给你 ~")}</div></div>

                <div class="app-hero">
                  <div class="app-icon">
                    ${
                      appIconUrl
                        ? `<div class="app-icon-img" style="background-image:url('${escapeAttr(appIconUrl)}')"></div>`
                        : `<div class="app-icon-ph"></div>`
                    }
                  </div>

                  <div class="app-name"><div class="up25">${escapeHtml(title)}</div></div>

                  ${
                    appSlogan
                      ? `<div class="app-slogan"><div class="up25">${escapeHtml(appSlogan)}</div></div>`
                      : ``
                  }

                  <div class="app-badges">
                    ${
                      verText
                        ? `<div class="badge badge-ver"><span class="badge-muted"><div class="up25">${escapeHtml(appVersionLabel)}</div></span><span><div class="up25">${escapeHtml(verText)}</div></span></div>`
                        : ``
                    }

                    ${
                      appStatusText
                        ? `<div class="badge badge-status"><div class="up25">${escapeHtml(appStatusText)}</div></div>`
                        : ``
                    }
                  </div>
                </div>

                <div class="qr-row qr-row-app">
                  <div class="qr-left">
                    <div><div class="up25">${escapeHtml(leftHint1)}</div></div>
                    <div><div class="up25">${escapeHtml(leftHint2 || "查看 App")}</div></div>
                  </div>

                  <div class="qr-card">
                    <img class="qr-img" src="${qrDataUrl}" alt="QR" />
                  </div>
                </div>

                <div class="footer">
                  <div><div class="up25">${escapeHtml(footerLeft)}</div></div>
                  <div><div class="up25">${escapeHtml(footerRight)}</div></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      `;
		}

		if (type === "ip") {
			return `
		    <div class="multi-gradient-bg"></div>
		    <div class="content">
		      <div class="glass">
		        <div class="inner-border">
		          <div class="pad pad-ip">
		
		            <div class="shareline">
		              <div class="up25">${escapeHtml(shareLine || "我发现了一个有趣的 IP，分享给你 ~")}</div>
		            </div>
		
		            <!-- ===== 海报式 IP 信息区（按你给的结构） ===== -->
		            <div class="ip-area">
		              <div class="ip-stage">
		                <div class="ip-hero-sq">
		                  ${
		                    ipHeroUrl
		                      ? `<img class="ip-hero-imgtag" src="${escapeAttr(ipHeroUrl)}" alt="IP Hero" />`
		                      : `<div class="ip-hero-ph"></div>`
		                  }
		                </div>
		
		                <div class="ip-info-sq">
		                  <div class="ip-icon-round">
		                    ${
		                      ipIconUrl
		                        ? `<img class="ip-icon-imgtag" src="${escapeAttr(ipIconUrl)}" alt="IP Icon" />`
		                        : `<div class="ip-icon-ph"></div>`
		                    }
		                  </div>
		
		                  <div class="ip-name-sq">
		                    <div class="up25">${escapeHtml(ipName || title || "IP")}</div>
		                  </div>
		
		                  ${
		                    ipDesc
		                      ? `<div class="ip-desc-sq"><div class="up25">${escapeHtml(ipDesc)}</div></div>`
		                      : ``
		                  }
		                </div>
		              </div>
		            </div>
		
		            <!-- ===== QR ===== -->
		            <div class="qr-row qr-row-ip">
		              <div class="qr-left">
		                <div><div class="up25">${escapeHtml(leftHint1)}</div></div>
		                <div><div class="up25">${escapeHtml(leftHint2 || "查看 IP")}</div></div>
		              </div>
		
		              <div class="qr-card">
		                <img class="qr-img" src="${qrDataUrl}" alt="QR" />
		              </div>
		            </div>
		
		            <div class="footer">
		              <div><div class="up25">${escapeHtml(footerLeft)}</div></div>
		              <div><div class="up25">${escapeHtml(footerRight)}</div></div>
		            </div>
		
		          </div>
		        </div>
		      </div>
		    </div>
		  `;
		}

		// default: article
		return `
      <div class="multi-gradient-bg"></div>
      <div class="content">
        <div class="glass">
          <div class="inner-border">
            <div class="pad">

              <div class="shareline"><div class="up25">${escapeHtml(shareLine)}</div></div>

              <div class="title"><div class="up25">${escapeHtml(title)}</div></div>

              <div class="desc"><div class="up25">${escapeHtml(desc)}</div></div>

              <div class="qr-row">
                <div class="qr-left">
                  <div><div class="up25">${escapeHtml(leftHint1)}</div></div>
                  <div><div class="up25">${escapeHtml(leftHint2)}</div></div>
                </div>

                <div class="qr-card">
                  <img class="qr-img" src="${qrDataUrl}" alt="QR" />
                </div>
              </div>

              <div class="footer">
                <div><div class="up25">${escapeHtml(footerLeft)}</div></div>
                <div><div class="up25">${escapeHtml(footerRight)}</div></div>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;
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
        position:relative;
      }

      /* shared */
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

      /* media */
      .pad-media{ padding:72px 60px 40px 60px; gap:44px; }
      .cover{
        width:100%;
        height:560px;
        border-radius:28px;
        overflow:hidden;
        background:#e5e5e5;
        border:1px solid rgba(255,255,255,0.60);
        box-shadow:0 18px 60px rgba(0,0,0,0.12);
        position:relative;
      }
      .cover-img{
        width:100%;
        height:100%;
        background-repeat:no-repeat;
        background-position:center;
        background-size:cover;
      }
      .cover-ph{ width:100%; height:100%; background:#d4d4d4; }
      .cover-vignette{
        position:absolute; inset:0;
        pointer-events:none;
        background: radial-gradient(1200px 520px at 50% 30%, rgba(0,0,0,0.00), rgba(0,0,0,0.22));
      }
      .qr-row-media{ margin-top:160px; }

      /* app */
      .pad-app{ padding:72px 60px 40px 60px; gap:44px; }
      .app-hero{
        display:flex;
        flex-direction:column;
        align-items:center;
        text-align:center;
        gap:32px;
        padding-top:120px;
      }
      .app-icon{
        width:200px;
        height:200px;
        border-radius:44px;
        overflow:hidden;
        background:rgba(255,255,255,0.70);
        border:1px solid rgba(255,255,255,0.70);
        box-shadow:0 26px 80px rgba(0,0,0,0.18);
      }
      .app-icon-img{
        width:100%;
        height:100%;
        background-repeat:no-repeat;
        background-position:center;
        background-size:cover;
      }
      .app-icon-ph{ width:100%; height:100%; background:#d4d4d4; }
      .app-name{
        font-size:88px;
        line-height:1.06;
        font-weight:800;
        color:#171717;
        font-family:"Noto Sans SC", system-ui, -apple-system, Segoe UI, Roboto, Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
        padding-top:20px;
        word-break:break-word;
      }
      .app-slogan{
        max-width:860px;
        font-size:40px;
        line-height:1.6;
        color:#404040;
        font-weight:600;
        padding-top:10px;
        word-break:break-word;
      }
      .app-badges{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:14px;
        flex-wrap:wrap;
        padding-top:6px;
      }
      .badge{
        display:flex;
        align-items:center;
				justify-content: center;
        gap:10px;
        padding:10px 20px;
        border-radius:999px;
        background:rgba(255,255,255,0.70);
        border:1px solid rgba(229,229,229,0.70);
        font-size:28px;
        font-weight:700;
        color:#404040;
      }
      .badge-muted{ color:#737373; font-weight:600; }
      .badge-status{
        background: #FFFBEB;
        color:#B45309;
        border-color:#FDE68A;
      }
      .qr-row-app{ margin-top:150px; }
			.up25{transform:translateY(-25%);}
			
			/* ====== shareposter.js: buildPosterCSS 末尾追加/替换 IP 这段 ====== */
			
			/* ===== IP (Square hero + floating icon + title/desc) ===== */
			.pad-ip{ padding:72px 60px 40px 60px; gap:44px; }
			
			/* 对齐你给的：flex-col items-center text-center gap-[32px] */
			.ip-area{
			  display:flex;
			  flex-direction:column;
			  align-items:center;
			  text-align:center;
			  gap:32px;
			}
			
			/* 相当于 relative w-[860px] */
			.ip-stage{
			  position:relative;
			  width:860px;
			  max-width:100%;
			}
			
			/* 相当于 w-full aspect-square rounded-[24px] overflow-hidden bg-white/60 border */
			.ip-hero-sq{
			  width:100%;
			  aspect-ratio:1 / 1;
			  border-radius:24px;
			  overflow:hidden;
			  background:rgba(255,255,255,0.60);
			  border:1px solid rgba(255,255,255,0.70);
			}
			
			/* Hero 用 img（更直观），object-cover */
			.ip-hero-imgtag{
			  width:100%;
			  height:100%;
			  display:block;
			  object-fit:cover;
			}
			.ip-hero-ph{ width:100%; height:100%; background:#d4d4d4; }
			
			/* 名字+简介区域：translateY(-100px) */
			.ip-info-sq{
			  position:relative;
			  z-index:20;
			  display:flex;
			  flex-direction:column;
			  align-items:center;
			  text-align:center;
			  gap:18px;
			  transform:translateY(-100px);
			}
			
			/* Icon：w200 h200 圆形 + shadow */
			.ip-icon-round{
			  width:200px;
			  height:200px;
			  border-radius:9999px;
			  overflow:hidden;
			  background:rgba(255,255,255,1);
			  border:2px solid rgba(220, 220, 220, 1);
			  box-shadow:0 26px 80px rgba(0,0,0,0.28);
			}
			.ip-icon-imgtag{
			  width:100%;
			  height:100%;
			  display:block;
			  object-fit:cover;
			}
			.ip-icon-ph{ width:100%; height:100%; background:#d4d4d4; }
			
			/* 名称：text-[88px] leading-[1.06] mt-[40px] font-extrabold */
			.ip-name-sq{
			  margin-top:40px;
			  font-size:88px;
			  line-height:1.06;
			  font-weight:800;
			  color:#171717;
			  word-break:break-word;
			}
			
			/* 简介：text-[40px] leading-[1.6] mt-[20px] */
			.ip-desc-sq{
			  margin-top:20px;
			  max-width:860px;
			  font-size:40px;
			  line-height:1.6;
			  font-weight:600;
			  color:#404040;
			  word-break:break-word;
			}
			
			/* QR 距离：保持你原来的 app 风格 */
			.qr-row-ip{ margin-top:150px; }

    `;
	}

	async function ensureGoogleFontsLoaded() {
		if (document.querySelector('link[data-poster-font="noto-sc"]')) {
			if (document.fonts?.ready) {
				await document.fonts.ready.catch(() => {});
			}
			return;
		}

		const sources = [{
				name: "loli",
				preconnect: [{
						href: "https://fonts.loli.net"
					},
					{
						href: "https://gstatic.loli.net",
						crossOrigin: "anonymous"
					},
				],
				css: "https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@100..900&family=Noto+Serif+SC:wght@200..900&display=swap",
			},
			{
				name: "ustc",
				preconnect: [{
					href: "https://fonts.lug.ustc.edu.cn"
				}, ],
				css: "https://fonts.lug.ustc.edu.cn/css2?family=Noto+Sans+SC:wght@100..900&family=Noto+Serif+SC:wght@200..900&display=swap",
			},
			{
				name: "google",
				preconnect: [{
						href: "https://fonts.googleapis.com"
					},
					{
						href: "https://fonts.gstatic.com",
						crossOrigin: "anonymous"
					},
				],
				css: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&family=Noto+Serif+SC:wght@200..900&display=swap",
			},
		];

		for (const src of sources) {
			try {
				// preconnect
				src.preconnect.forEach((cfg) => {
					const link = document.createElement("link");
					link.rel = "preconnect";
					link.href = cfg.href;
					if (cfg.crossOrigin) link.crossOrigin = cfg.crossOrigin;
					document.head.appendChild(link);
				});

				// stylesheet
				await new Promise((resolve, reject) => {
					const link = document.createElement("link");
					link.rel = "stylesheet";
					link.href = src.css;
					link.setAttribute("data-poster-font", "noto-sc");
					link.onload = resolve;
					link.onerror = reject;
					document.head.appendChild(link);
				});

				// 等字体真正 ready
				if (document.fonts?.ready) {
					await document.fonts.ready;
				}

				console.info(`[Fonts] Loaded via ${src.name}`);
				return;
			} catch (e) {
				console.warn(`[Fonts] Failed via ${src.name}, trying next…`);
			}
		}

		console.error("[Fonts] All font CDNs failed");
	}

	// Preload bg images used in inline styles (background-image:url(...))
	async function waitBgImagesLoaded(root) {
		const nodes = Array.from(root.querySelectorAll("[style*='background-image']"));
		const urls = nodes
			.map((el) => {
				const s = el.getAttribute("style") || "";
				const m = /background-image\s*:\s*url\((['"]?)(.*?)\1\)/i.exec(s);
				return m ? m[2] : "";
			})
			.filter(Boolean);

		if (!urls.length) return;

		await Promise.all(
			urls.map(
				(u) =>
				new Promise((resolve) => {
					const img = new Image();
					img.crossOrigin = "anonymous";
					img.referrerPolicy = "no-referrer";
					img.onload = () => resolve();
					img.onerror = () => resolve();
					img.src = u;
				})
			)
		);
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

	function escapeAttr(str) {
		return String(str ?? "")
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#039;");
	}

	// expose
	global.createSharePoster = createSharePoster;
})(window);