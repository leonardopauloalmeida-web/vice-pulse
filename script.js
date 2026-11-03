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
    const capas = document.querySelectorAll(".timeline-capa img");
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