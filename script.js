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
            if (subtitle) subtitle.textContent = "🎮 JÁ DISPONÍVEL!";
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

    // VERIFICA MARCOS IMPORTANTES
    let lastMilestone = parseInt(localStorage.getItem("lastMilestone") || "9999");

    function checkMilestones(daysLeft) {
        const milestones = [365, 180, 90, 30, 7, 1];
        
        for (const m of milestones) {
            if (daysLeft <= m && m < lastMilestone) {
                lastMilestone = m;
                localStorage.setItem("lastMilestone", String(m));
                showNotification(`🚨 Faltam apenas ${m} dia${m > 1 ? 's' : ''} para GTA VI!`);
                break;
            }
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

    // EFFECT PARALLAX (só se existir hero)
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

    // SALVA A DATA NO LOCALSTORAGE
    localStorage.setItem("launchDate", launch.toISOString());

    // CONSOLE LOG PARA DEBUG
    console.log("🚀 Vice Pulse • GTA VI Countdown");
    console.log(`📅 Lançamento: ${launch.toLocaleString()}`);
    console.log(`📊 Total de dias: ${Math.floor(totalDiff / 86400000)}`);

} else {
    console.log("📄 Página sem cronômetro (personagens, vice-city, etc.)");
}