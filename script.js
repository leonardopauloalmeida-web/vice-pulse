// DATA DE LANÇAMENTO E INÍCIO DA CONTAGEM
const launch = new Date("2026-11-19T00:00:00-03:00");
const start = new Date("2025-05-06T00:00:00-03:00");
const totalDiff = launch - start;

// ELEMENTOS HTML (verifica se existem)
const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const bar = document.getElementById("bar");
const hero = document.querySelector(".hero");
const subtitle = document.querySelector(".subtitle");

// SÓ EXECUTA SE OS ELEMENTOS EXISTIREM (página principal)
if (days && hours && minutes && seconds && bar) {

    // FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO
    function update() {
        const now = new Date();
        const diff = launch - now;

        if (diff <= 0) {
            days.textContent = "0";
            hours.textContent = "00";
            minutes.textContent = "00";
            seconds.textContent = "00";
            bar.style.width = "100%";
            clearInterval(interval); // para de atualizar, a contagem acabou
            celebrar();              // dispara a animação de lançamento
            return;
        }

        const d = Math.floor(diff / 86400000);
        const h = Math.floor(diff / 3600000) % 24;
        const m = Math.floor(diff / 60000) % 60;
        const s = Math.floor(diff / 1000) % 60;

        // Atualiza com animação
        animateNumber(days, d.toLocaleString("pt-BR"));
        hours.textContent = String(h).padStart(2, "0");
        minutes.textContent = String(m).padStart(2, "0");
        seconds.textContent = String(s).padStart(2, "0");

        // Título da página
        document.title = `${d.toLocaleString("pt-BR")} dias • Vice Pulse`;

        // Barra de progresso
        const progress = Math.min(((now - start) / totalDiff) * 100, 100);
        bar.style.width = progress + "%";

        // Verifica marcos importantes
        checkMilestones(d);
    }

    // ANIMAÇÃO DE MUDANÇA DE NÚMERO
    function animateNumber(element, newValue) {
        if (element.textContent !== newValue) {
            element.style.transform = "scale(0.8)";
            element.style.opacity = "0.5";
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = "scale(1)";
                element.style.opacity = "1";
            }, 100);
        }
    }

    // ============================================
    // ANIMAÇÃO DE LANÇAMENTO: ondas neon nas cores do GTA VI
    // Toca uma vez, quando a contagem chega a zero.
    // ============================================
    let celebrou = false;
    const CORES_GTA = ["#ff2e93", "#ff7a2f", "#ffc247", "#8a3ffc", "#00d1c1"];

    function celebrar() {
        if (celebrou) return;
        celebrou = true;

        // Mensagem "JÁ DISPONÍVEL!" com destaque
        if (subtitle) {
            subtitle.textContent = "🎮 JÁ DISPONÍVEL!";
            subtitle.classList.add("disponivel");
        }

        // Quem prefere menos movimento no sistema vê só a mensagem, sem os anéis
        if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        hero.classList.add("celebrando");
        let total = 0;

        const criarAnel = () => {
            const cor = CORES_GTA[Math.floor(Math.random() * CORES_GTA.length)];
            const anel = document.createElement("div");
            anel.className = "anel-neon";
            anel.style.borderColor = cor;
            anel.style.boxShadow = `0 0 22px ${cor}, inset 0 0 22px ${cor}`;
            hero.appendChild(anel);
            setTimeout(() => anel.remove(), 3000);
            if (++total >= 10) clearInterval(timer);
        };

        const timer = setInterval(criarAnel, 420);
        criarAnel();
    }

    // VERIFICA MARCOS IMPORTANTES
    // Corrigido: marcos em ordem crescente, para achar o MENOR marco
    // que ainda cobre os dias restantes (ex.: 16 dias -> "menos de 30 dias").
    let lastMilestone = parseInt(localStorage.getItem("lastMilestone") || "9999");

    function checkMilestones(daysLeft) {
        const milestones = [1, 7, 30, 90, 180, 365];
        const m = milestones.find(x => daysLeft <= x);

        if (m && m < lastMilestone) {
            lastMilestone = m;
            localStorage.setItem("lastMilestone", String(m));
            showNotification(`🚨 Faltam menos de ${m} dia${m > 1 ? 's' : ''} para GTA VI!`);
        }
    }

    // NOTIFICAÇÃO NA TELA
    function showNotification(msg) {
        const el = document.createElement("div");
        el.textContent = msg;
        el.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(90deg, #ff3cac, #ff8a3d);
            color: white;
            padding: 18px 32px;
            border-radius: 999px;
            font-weight: 700;
            z-index: 9999;
            box-shadow: 0 0 40px rgba(255, 60, 172, 0.5);
            animation: slideUp 0.5s ease;
            font-size: 16px;
            max-width: 90%;
            text-align: center;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(el);
        setTimeout(() => {
            el.style.opacity = "0";
            el.style.transition = "opacity 0.5s";
            setTimeout(() => el.remove(), 500);
        }, 5000);
    }

    // EFEITO PARALLAX (só se existir hero)
    if (hero) {
        let isMoving = false;
        document.addEventListener("mousemove", (e) => {
            if (isMoving) return;
            isMoving = true;
            requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 12;
                const y = (e.clientY / window.innerHeight - 0.5) * 12;
                hero.style.backgroundPosition = `${50 + x * 0.3}% ${50 + y * 0.3}%`;
                isMoving = false;
            });
        });
    }

    // CONTROLE DE VISIBILIDADE DA ABA
    let interval;

    function startCountdown() {
        update();
        interval = setInterval(update, 1000);
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            clearInterval(interval);
        } else {
            startCountdown();
        }
    });

    // INICIA A CONTAGEM
    startCountdown();

    // TESTE: abra o site com ?celebrar no final do endereço (index.html?celebrar)
    // para ver a animação sem esperar o dia 19. Pode apagar essas 3 linhas depois.
    if (new URLSearchParams(location.search).has("celebrar")) {
        celebrar();
    }

    // SALVA A DATA NO LOCALSTORAGE
    localStorage.setItem("launchDate", launch.toISOString());

    // CONSOLE LOG PARA DEBUG
    console.log("🚀 Vice Pulse • GTA VI Countdown");
    console.log(`📅 Lançamento: ${launch.toLocaleString()}`);
    console.log(`📊 Total de dias: ${Math.floor(totalDiff / 86400000)}`);

} else {
    console.log("📄 Página sem cronômetro (personagens, vice-city, etc.)");
}


// ============================================
// LIGHTBOX: clicar na capa para ver ela grande
// (funciona em qualquer página que tenha capas na linha do tempo)
// ============================================
(function () {
    const capas = document.querySelectorAll([
        ".card img", ".personagem-imagem img", ".character-card img", ".galeria-grid img",
        ".vice-intro-imagem img", ".vice-game-imagem img", ".map-card img",
        ".diretor-imagem img", ".timeline-capa img", ".revista-capa img"
    ].join(", "));
    if (capas.length === 0) return;

    // Cria a tela escura com a imagem grande (fica escondida até clicar)
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
        document.body.style.overflow = "hidden"; // trava a rolagem da página
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

    // Fecha clicando fora da imagem ou no X
    overlay.addEventListener("click", (e) => {
        if (e.target !== imgGrande) fechar();
    });

    // Fecha com a tecla Esc
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") fechar();
    });
})();

// ============================================
// ABERTURA DO SITE: botão ENTRAR
// (a tela em si está no index.html; a classe "com-abertura"
// é ligada no <head> só na primeira visita de cada sessão)
// Para rever a abertura: index.html?abertura
// ============================================
(function () {
    const abertura = document.getElementById("abertura");
    const entrar = document.getElementById("ab-entrar");
    if (!abertura || !entrar) return;

    entrar.addEventListener("click", () => {
        abertura.classList.add("saindo");
        try { sessionStorage.setItem("viceAbertura", "1"); } catch (e) {}
        // espera a animação de saída terminar e libera a página
        setTimeout(() => document.documentElement.classList.remove("com-abertura"), 800);
    });
})();

// ============================================
// MENU: adiciona a aba "Revistas" em TODAS as páginas
// (assim não precisa editar o menu de cada .html)
// ============================================
(function () {
    const nav = document.querySelector(".navbar nav");
    if (!nav || nav.querySelector('a[href="revistas.html"]')) return;

    const link = document.createElement("a");
    link.href = "revistas.html";
    link.textContent = "Revistas";

    const diretor = nav.querySelector('a[href="diretor.html"]');
    if (diretor) {
        diretor.after(link);
    } else {
        nav.appendChild(link);
    }
})();


// ============================================
// MENU LATERAL (vidro + seções + contagem + busca)
// Entra sozinho em TODAS as páginas que carregam o script.js.
// O menu antigo do topo (.navbar) fica escondido.
// ============================================
(function () {
    if (document.getElementById("vpMenu")) return;

    // ---------- estilo (injetado aqui, não precisa mexer no style.css) ----------
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
        '#vpMenu .vp-cc{margin:0 4px 10px;padding:12px;border-radius:14px;border:1px solid #ff3cac;background:linear-gradient(135deg,rgba(255,60,172,.3),rgba(138,63,252,.1));display:flex;gap:10px;align-items:center}',
        '#vpMenu .vp-cc .n{font-family:"Anton",sans-serif;font-size:34px;line-height:1;color:#ff00ff;text-shadow:0 0 14px rgba(255,0,255,.6);min-width:30px;text-align:center}',
        '#vpMenu .vp-cc small{display:block;font-size:9px;letter-spacing:2px;color:#ff3cac;font-weight:800}',
        '#vpMenu .vp-cc b{font-size:13px;color:#fff;font-variant-numeric:tabular-nums;white-space:nowrap}',
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
        /* recolhido */
        'html.vp-rec #vpMenu .vp-tx,html.vp-rec #vpMenu .vp-logo,html.vp-rec #vpMenu .vp-bs,html.vp-rec #vpMenu .vp-cc div,html.vp-rec #vpMenu .vp-nw{display:none}',
        'html.vp-rec #vpMenu .vp-hd{justify-content:center}',
        'html.vp-rec #vpMenu .vp-a{justify-content:center;padding:0}',
        'html.vp-rec #vpMenu .vp-cc{justify-content:center;padding:8px}html.vp-rec #vpMenu .vp-cc .n{font-size:24px}',
        'html.vp-rec #vpMenu .vp-sec{font-size:0;padding:8px 14px}html.vp-rec #vpMenu .vp-sec::after{content:"";display:block;height:1px;background:rgba(255,255,255,.2)}',
        'html.vp-rec #vpMenu{overflow:visible}',
        'html.vp-rec #vpMenu .vp-a:hover::after{content:attr(data-tip);position:absolute;left:calc(100% + 14px);top:50%;transform:translateY(-50%);background:#000;color:#fff;border:1px solid #333;padding:6px 10px;border-radius:8px;font-size:12px;pointer-events:none}',
        /* celular: gaveta */
        /* marca fixa: aparece quando o menu está recolhido (e no celular) */
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

    // ---------- lembra se estava recolhido ----------
    var html = document.documentElement;
    try { if (localStorage.getItem('vpRecolhido') === '1') html.classList.add('vp-rec'); } catch (e) {}

    // ---------- itens do menu ----------
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
        item('📖', 'Revistas', 'revistas.html', 'revistas.html', '', '<span class="vp-nw">NOVO</span>') +
        item('▶️', 'Trailers', 'index.html#trailers', 'index.html', '#trailers') +
        sec('Bastidores') +
        item('🎬', 'Diretor', 'diretor.html', 'diretor.html', '');

    var menu = document.createElement('nav');
    menu.id = 'vpMenu';
    menu.setAttribute('aria-label', 'Menu principal');
    menu.innerHTML =
        '<div class="vp-hd"><a class="vp-logo" href="index.html">VICE PULSE</a>' +
        '<button class="vp-rec" id="vpRec" aria-label="Recolher ou expandir o menu" title="Recolher menu">⇔</button></div>' +
        '<div class="vp-cc"><div class="n" id="vpDias">--</div><div><small id="vpCcPeq">FALTAM</small><b id="vpCcTxt">dias para GTA VI</b></div></div>' +
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

    // ---------- contagem de dias ----------
    var alvo = new Date('2026-11-19T00:00:00-03:00');
    function dois(n) { return (n < 10 ? '0' : '') + n; }
    function atualizarDias() {
        var diff = alvo - new Date();
        var n = document.getElementById('vpDias');
        if (diff > 0) {
            // mesma conta do relógio da página inicial: dias inteiros + horas, minutos e segundos
            var d = Math.floor(diff / 86400000);
            var h = Math.floor(diff / 3600000) % 24;
            var m = Math.floor(diff / 60000) % 60;
            var seg = Math.floor(diff / 1000) % 60;
            n.textContent = d;
            document.getElementById('vpCcPeq').textContent = 'FALTAM';
            document.getElementById('vpCcTxt').textContent = (d === 1 ? 'dia' : 'dias') + ' • ' + dois(h) + ':' + dois(m) + ':' + dois(seg);
        } else {
            n.textContent = '🎮';
            document.getElementById('vpCcPeq').textContent = 'LANÇADO';
            document.getElementById('vpCcTxt').textContent = 'Já disponível!';
        }
    }
    atualizarDias();
    setInterval(atualizarDias, 1000);

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
            // endereço com outra âncora (ex.: #news): marca a própria página
            links.forEach(function (a) { a.classList.toggle('at', a.dataset.arq === arq && !a.dataset.hash); });
        }
    }
    marcar(arq === 'index.html' ? location.hash : '');
    window.addEventListener('hashchange', function () { if (arq === 'index.html') marcar(location.hash); });

    // na página inicial, o item muda conforme você rola (Início, Trailers, Mapa)
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

    // ---------- recolher / expandir ----------
    document.getElementById('vpRec').addEventListener('click', function () {
        html.classList.toggle('vp-rec');
        try { localStorage.setItem('vpRecolhido', html.classList.contains('vp-rec') ? '1' : '0'); } catch (e) {}
    });

    // ---------- busca ----------
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

    // ---------- celular: gaveta ----------
    botao.addEventListener('click', function () { html.classList.add('vp-aberto'); });
    cortina.addEventListener('click', function () { html.classList.remove('vp-aberto'); });
    links.forEach(function (a) { a.addEventListener('click', function () { html.classList.remove('vp-aberto'); }); });
})();