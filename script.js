// DATA DE LANÇAMENTO
const launch = new Date("2026-11-19T00:00:00-03:00");

// ============================================
// CONTADOR DE DIAS DESDE O LANÇAMENTO (PÁGINA INICIAL)
// ============================================
const daysSinceEl = document.getElementById("days-since");

function updateDaysSince() {
    if (!daysSinceEl) return;

    const now = new Date();
    const diff = now - launch;

    if (diff < 0) {
        daysSinceEl.textContent = "0";
        return;
    }

    const days = Math.floor(diff / 86400000);
    daysSinceEl.textContent = days.toLocaleString("pt-BR");
}

updateDaysSince();
setInterval(updateDaysSince, 3600000); // atualiza a cada hora

// ============================================
// LIGHTBOX: clicar na capa para ver ela grande
// ============================================
(function () {
    const capas = document.querySelectorAll([
        ".card img", ".personagem-imagem img", ".character-card img", ".galeria-grid img",
        ".vice-intro-imagem img", ".vice-game-imagem img", ".map-card img",
        ".diretor-imagem img", ".timeline-capa img", ".revista-capa img"
    ].join(", "));
    if (capas.length === 0) return;

    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.innerHTML = `
        <button class="lightbox-fechar" aria-label="Fechar">&times;</button>
        <img class="lightbox-img" alt="">
    `;
    document.body.appendChild(overlay);

    const imgGrande = overlay.querySelector(".lightbox-img");
    const btnFechar = overlay.querySelector(".lightbox-fechar");

    function abrir(img) {
        imgGrande.src = img.src;
        imgGrande.alt = img.alt;
        overlay.classList.add("aberto");
        document.body.style.overflow = "hidden";
        btnFechar.focus();
    }

    function fechar() {
        overlay.classList.remove("aberto");
        document.body.style.overflow = "";
    }

    capas.forEach((img) => {
        img.tabIndex = 0;
        img.setAttribute("role", "button");
        img.addEventListener("click", () => abrir(img));
        img.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                abrir(img);
            }
        });
    });

    overlay.addEventListener("click", (e) => {
        if (e.target !== imgGrande) fechar();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") fechar();
    });
})();

// ============================================
// ABERTURA DO SITE: botão ENTRAR
// ============================================
(function () {
    const abertura = document.getElementById("abertura");
    const entrar = document.getElementById("ab-entrar");
    if (!abertura || !entrar) return;

    entrar.addEventListener("click", () => {
        abertura.classList.add("saindo");
        try { sessionStorage.setItem("viceAbertura", "1"); } catch (e) {}
        setTimeout(() => document.documentElement.classList.remove("com-abertura"), 800);
    });
})();

// ============================================
// MENU LATERAL
// ============================================
(function () {
    if (document.getElementById("vpMenu")) return;

    var css = [
        'html{--mw:250px}html.vp-rec{--mw:72px}',
        'body{padding-left:var(--mw)!important;transition:padding-left .28s}',
        '.navbar{display:none!important}',
        '#vpMenu{position:fixed;left:0;top:0;bottom:0;width:var(--mw);z-index:1000;display:flex;flex-direction:column;gap:2px;padding:14px 10px;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;font-family:"Montserrat",sans-serif;',
        'background:linear-gradient(160deg,rgba(255,60,172,.28),rgba(138,63,252,.22)),rgba(12,6,26,.86);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-right:1px solid rgba(255,255,255,.14);transition:width .28s}',
        '#vpMenu::-webkit-scrollbar{display:none}',
        '#vpMenu .vp-hd{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:12px;padding:0 4px}',
        '#vpMenu .vp-logo{font-family:"Anton",sans-serif;font-size:22px;letter-spacing:1px;color:#ff3cac;text-decoration:none;white-space:nowrap;text-shadow:0 0 14px rgba(255,60,172,.6)}',
        '#vpMenu .vp-rec{background:none;border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:8px;width:34px;height:34px;cursor:pointer;flex:none}',
        '#vpMenu .vp-rec:hover{background:rgba(255,255,255,.12)}',
        '#vpMenu .vp-cc{margin:0 4px 10px;padding:10px;border-radius:14px;border:1px solid #ff3cac;background:linear-gradient(135deg,rgba(255,60,172,.3),rgba(138,63,252,.1));display:flex;gap:8px;align-items:center;overflow:hidden}',
        '#vpMenu .vp-cc .n{font-size:24px;line-height:1;min-width:30px;text-align:center;display:flex;justify-content:center;align-items:center;}',
        '#vpMenu .vp-cc small{display:block;font-size:9px;letter-spacing:2px;color:#ff3cac;font-weight:800;margin-bottom:2px;}',
        '#vpMenu .vp-cc b{font-size:13px;color:#fff;white-space:normal;line-height:1.2}',
        '#vpMenu .vp-bs{margin:0 4px 8px}',
        '#vpMenu .vp-bs input{width:100%;height:40px;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:rgba(0,0,0,.3);color:#fff;padding:0 12px;font:inherit;font-size:13px}',
        '#vpMenu .vp-bs input::placeholder{color:rgba(255,255,255,.5)}',
        '#vpMenu .vp-bs input:focus{outline:2px solid #ff3cac;outline-offset:1px}',
        '#vpMenu .vp-sec{font-size:10px;letter-spacing:2px;color:rgba(255,255,255,.5);font-weight:700;padding:14px 12px 4px;text-transform:uppercase}',
        '#vpMenu .vp-a{position:relative;display:flex;align-items:center;gap:12px;height:44px;padding:0 12px;border-radius:10px;color:rgba(255,255,255,.72);font-size:14px;font-weight:500;text-decoration:none;white-space:nowrap;transition:.2s;flex:none}',
        '#vpMenu .vp-a .vp-i{font-size:18px;width:22px;text-align:center;flex:none}',
        '#vpMenu .vp-a:hover{color:#fff;background:rgba(255,255,255,.08)}',
        '#vpMenu .vp-a.at{color:#fff;font-weight:700;background:linear-gradient(90deg,rgba(255,60,172,.35),rgba(138,63,252,.2));box-shadow:inset 3px 0 0 #ff3cac}',
        '#vpMenu .vp-a::before{content:"";position:absolute;left:12px;right:12px;bottom:3px;height:3px;border-radius:3px;background:linear-gradient(90deg,#8a3ffc,#c084fc);box-shadow:0 0 10px rgba(138,63,252,.9);transform:scaleX(0);transform-origin:left;transition:transform .3s}',
        '#vpMenu .vp-a:hover::before,#vpMenu .vp-a.at::before{transform:scaleX(1)}',
        'html.vp-rec #vpMenu .vp-a::before{left:10px;right:10px}',
        '#vpMenu .vp-nw{margin-left:auto;font-size:9px;font-weight:800;letter-spacing:1px;background:#ff3cac;color:#fff;border-radius:999px;padding:2px 7px}',
        '#vpMenu .vp-vz{display:none;padding:14px;color:rgba(255,255,255,.6);font-size:13px}',
        'html.vp-rec #vpMenu .vp-tx,html.vp-rec #vpMenu .vp-logo,html.vp-rec #vpMenu .vp-bs,html.vp-rec #vpMenu .vp-cc div,html.vp-rec #vpMenu .vp-nw{display:none}',
        'html.vp-rec #vpMenu .vp-hd{justify-content:center}',
        'html.vp-rec #vpMenu .vp-a{justify-content:center;padding:0}',
        'html.vp-rec #vpMenu .vp-cc{justify-content:center;padding:8px}html.vp-rec #vpMenu .vp-cc .n{font-size:20px}',
        'html.vp-rec #vpMenu .vp-sec{font-size:0;padding:8px 14px}html.vp-rec #vpMenu .vp-sec::after{content:"";display:block;height:1px;background:rgba(255,255,255,.2)}',
        'html.vp-rec #vpMenu{overflow:visible}',
        'html.vp-rec #vpMenu .vp-a:hover::after{content:attr(data-tip);position:absolute;left:calc(100% + 14px);top:50%;transform:translateY(-50%);background:#000;color:#fff;border:1px solid #333;padding:6px 10px;border-radius:8px;font-size:12px;pointer-events:none}',
        '.vp-brand{position:fixed;top:14px;left:calc(var(--mw) + 18px);z-index:900;font-family:"Anton",sans-serif;font-size:22px;letter-spacing:1px;color:#ff3cac;text-decoration:none;padding:6px 16px;border-radius:999px;background:rgba(12,6,26,.55);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.14);text-shadow:0 0 14px rgba(255,60,172,.6);transition:left .28s,opacity .25s}',
        'html:not(.vp-rec) .vp-brand{opacity:0;pointer-events:none}',
        '.vp-mob,#vpScrim{display:none}',
        '@media(max-width:900px){',
        'body{padding-left:0!important;padding-top:64px!important}',
        '#vpMenu{width:270px;transform:translateX(-100%);transition:transform .3s}',
        'html.vp-aberto #vpMenu{transform:none}',
        'html.vp-rec #vpMenu .vp-tx,html.vp-rec #vpMenu .vp-logo,html.vp-rec #vpMenu .vp-bs,html.vp-rec #vpMenu .vp-cc div{display:revert}',
        'html.vp-rec #vpMenu .vp-a{justify-content:flex-start;padding:0 12px}html.vp-rec #vpMenu .vp-a:hover::after{display:none}',
        'html.vp-rec #vpMenu .vp-hd{justify-content:space-between}html.vp-rec #vpMenu .vp-sec{font-size:10px;padding:14px 12px 4px}html.vp-rec #vpMenu .vp-sec::after{display:none}',
        '#vpMenu .vp-rec{display:none}',
        '.vp-brand{left:68px!important;top:14px;opacity:1!important;pointer-events:auto!important}',
        '.vp-mob{display:flex;position:fixed;top:12px;left:12px;z-index:1001;width:44px;height:44px;align-items:center;justify-content:center;border-radius:12px;border:1px solid rgba(255,255,255,.25);background:rgba(12,6,26,.88);color:#fff;font-size:20px;cursor:pointer}',
        '#vpScrim{display:block;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:999;opacity:0;pointer-events:none;transition:.3s}',
        'html.vp-aberto #vpScrim{opacity:1;pointer-events:auto}',
        '}',
        '@media(prefers-reduced-motion:reduce){#vpMenu,body{transition:none}}'
    ].join('');
    var st = document.createElement('style');
    st.id = 'vpMenuCss';
    st.textContent = css;
    document.head.appendChild(st);

    var html = document.documentElement;
    try { if (localStorage.getItem('vpRecolhido') === '1') html.classList.add('vp-rec'); } catch (e) {}

    function item(ico, nome, href, arq, hash, extra) {
        return '<a class="vp-a" href="' + href + '" data-arq="' + arq + '" data-hash="' + hash + '" data-tip="' + nome + '">' +
               '<span class="vp-i">' + ico + '</span><span class="vp-tx">' + nome + '</span>' + (extra || '') + '</a>';
    }
    function sec(t) { return '<div class="vp-sec">' + t + '</div>'; }

    var lista =
        item('🏠', 'Início', 'index.html', 'index.html', '') +
        sec('O jogo') +
        item('🧑‍🤝‍🧑', 'Personagens', 'personagens.html', 'personagens.html', '') +
        item('🌴', 'GTA Vice City', 'vice-city.html', 'vice-city.html', '') +
        item('🗺️', 'Mapa', 'index.html#map', 'index.html', '#map') +
        sec('Novidades') +
        item('📰', 'Notícias', 'noticias.html', 'noticias.html', '') +
        item('📖', 'Revistas', 'revistas.html', 'revistas.html', '') + // Aviso NOVO removido daqui
        item('▶️', 'Trailers', 'index.html#trailers', 'index.html', '#trailers') +
        sec('Bastidores') +
        item('🎬', 'Diretor', 'diretor.html', 'diretor.html', '');

    var menu = document.createElement('nav');
    menu.id = 'vpMenu';
    menu.setAttribute('aria-label', 'Menu principal');
    
    // Caixa de status com as plataformas adicionadas
    menu.innerHTML =
        '<div class="vp-hd"><a class="vp-logo" href="index.html">VICE PULSE</a>' +
        '<button class="vp-rec" id="vpRec" aria-label="Recolher ou expandir o menu" title="Recolher menu">⇔</button></div>' +
        '<div class="vp-cc"><div class="n" id="vpDias">--</div><div><small id="vpCcPeq">STATUS</small><b id="vpCcTxt">Já disponível!</b><span style="display:block; font-size:9px; opacity:0.6; margin-top:2px; white-space:nowrap;">PS5 & XBOX SERIES X|S</span></div></div>' +
        '<div class="vp-bs"><input type="search" id="vpBusca" placeholder="Buscar página..." aria-label="Buscar página" autocomplete="off"></div>' +
        '<div id="vpLista">' + lista + '</div>' +
        '<div class="vp-vz" id="vpVz">Nenhuma página encontrada</div>';

    var botao = document.createElement('button');
    botao.className = 'vp-mob';
    botao.id = 'vpMob';
    botao.setAttribute('aria-label', 'Abrir menu');
    botao.textContent = '☰';
    var cortina = document.createElement('div');
    cortina.id = 'vpScrim';

    var marca = document.createElement('a');
    marca.className = 'vp-brand';
    marca.href = 'index.html';
    marca.textContent = 'VICE PULSE';
    document.body.insertBefore(marca, document.body.firstChild);
    document.body.insertBefore(cortina, document.body.firstChild);
    document.body.insertBefore(botao, document.body.firstChild);
    document.body.insertBefore(menu, document.body.firstChild);

    var links = [].slice.call(menu.querySelectorAll('.vp-a'));

    // ---------- Status no menu lateral: Já Disponível ----------
    function atualizarDiasMenu() {
        var n = document.getElementById('vpDias');
        var txt = document.getElementById('vpCcTxt');
        
        if (n && txt) {
            n.textContent = '🎮';
            txt.textContent = 'Já disponível!';
        }
    }
    atualizarDiasMenu();

    // ---------- página atual ----------
    var arq = location.pathname.split('/').pop() || 'index.html';
    function marcar(hash) {
        var alvoLink = null;
        links.forEach(function (a) {
            var certo = a.dataset.arq === arq && (arq !== 'index.html' ? true : a.dataset.hash === (hash || ''));
            a.classList.toggle('at', certo);
            if (certo) alvoLink = a;
        });
        if (!alvoLink) {
            links.forEach(function (a) { a.classList.toggle('at', a.dataset.arq === arq && !a.dataset.hash); });
        }
    }
    marcar(arq === 'index.html' ? location.hash : '');
    window.addEventListener('hashchange', function () { if (arq === 'index.html') marcar(location.hash); });

    if (arq === 'index.html' && 'IntersectionObserver' in window) {
        var marcas = [['.hero', ''], ['#trailers', '#trailers'], ['#map', '#map']];
        var obs = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (e) {
                if (e.isIntersecting) marcar(e.target.dataset.vpHash);
            });
        }, { rootMargin: '-40% 0px -50% 0px' });
        marcas.forEach(function (m) {
            var el = document.querySelector(m[0]);
            if (el) { el.dataset.vpHash = m[1]; obs.observe(el); }
        });
    }

    document.getElementById('vpRec').addEventListener('click', function () {
        html.classList.toggle('vp-rec');
        try { localStorage.setItem('vpRecolhido', html.classList.contains('vp-rec') ? '1' : '0'); } catch (e) {}
    });

    var busca = document.getElementById('vpBusca');
    function filtrar() {
        var q = busca.value.toLowerCase().trim(), n = 0;
        [].slice.call(menu.querySelectorAll('#vpLista > *')).forEach(function (el) {
            if (el.classList.contains('vp-sec')) { el.style.display = q ? 'none' : ''; return; }
            var ok = el.textContent.toLowerCase().indexOf(q) !== -1;
            el.style.display = ok ? '' : 'none';
            if (ok) n++;
        });
        document.getElementById('vpVz').style.display = n ? 'none' : 'block';
    }
    busca.addEventListener('input', filtrar);
    document.addEventListener('keydown', function (e) {
        var tag = (document.activeElement && document.activeElement.tagName) || '';
        if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
            html.classList.remove('vp-rec');
            e.preventDefault();
            busca.focus();
        }
        if (e.key === 'Escape') { busca.value = ''; filtrar(); busca.blur(); html.classList.remove('vp-aberto'); }
        if (e.key === 'Enter' && document.activeElement === busca) {
            var primeiro = links.filter(function (a) { return a.style.display !== 'none'; })[0];
            if (primeiro) location.href = primeiro.getAttribute('href');
        }
    });

    botao.addEventListener('click', function () { html.classList.add('vp-aberto'); });
    cortina.addEventListener('click', function () { html.classList.remove('vp-aberto'); });
    links.forEach(function (a) { a.addEventListener('click', function () { html.classList.remove('vp-aberto'); }); });
})();

// ============================================
// CAPÍTULOS: entrada suave dos blocos e pontinhos de navegação
// ============================================
(function () {
    var caps = [].slice.call(document.querySelectorAll('.hero[data-titulo], .capitulo'));
    if (caps.length < 3 || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('cap-anim');

    caps[0].classList.add('visivel');

    var rail = document.createElement('div');
    rail.className = 'cap-rail';
    rail.setAttribute('aria-label', 'Capítulos da página');
    var botoes = caps.map(function (c, i) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', c.getAttribute('data-titulo') || 'Capítulo ' + (i + 1));
        b.className = i === 0 ? 'on' : '';
        b.addEventListener('click', function () { c.scrollIntoView({ behavior: 'smooth' }); });
        rail.appendChild(b);
        return b;
    });
    document.body.appendChild(rail);

    var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.classList.add('visivel');
            var i = caps.indexOf(e.target);
            botoes.forEach(function (b, j) { b.classList.toggle('on', j === i); });
        });
    }, { threshold: 0.35 });

    caps.forEach(function (c) { obs.observe(c); });
})();