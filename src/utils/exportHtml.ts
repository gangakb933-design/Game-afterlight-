export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Afterlight: Recovery</title>
    <style>
        * { box-sizing: border-box; user-select: none; -webkit-user-select: none; margin: 0; padding: 0; }
        body, html { width: 100%; height: 100%; overflow: hidden; background-color: #07090e; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #ffffff; }
        #game-container { position: relative; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; }
        canvas { display: block; background: #000; touch-action: none; }
        .glass-panel { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6); color: #fff; }
        .modal { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: none; justify-content: center; align-items: center; z-index: 100; background: rgba(0, 0, 0, 0.75); }
        .modal-content { width: 90%; max-width: 480px; padding: 24px; text-align: center; position: relative; }
        .btn { background: linear-gradient(135deg, #3b82f6, #1d4ed8); border: none; color: white; padding: 12px 24px; font-size: 15px; font-weight: 600; border-radius: 30px; cursor: pointer; margin-top: 15px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); transition: all 0.2s ease; }
        .btn:active { transform: scale(0.96); }
        #hud-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10; }
        #progress-bar-container { position: absolute; top: 16px; left: 50%; transform: translateX(-50%); width: 60%; max-width: 300px; height: 12px; background: rgba(255, 255, 255, 0.15); border-radius: 6px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2); }
        #progress-fill { width: 0%; height: 100%; background: linear-gradient(90deg, #60a5fa, #3b82f6); transition: width 0.4s ease; }
        #use-btn { position: absolute; bottom: 40px; right: 40px; width: 80px; height: 80px; border-radius: 50%; background: radial-gradient(circle, #3b82f6, #1e40af); border: 3px solid rgba(255, 255, 255, 0.8); color: white; font-weight: bold; font-size: 18px; display: flex; flex-direction: column; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease, transform 0.2s ease; box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
        #use-btn.active { opacity: 1; pointer-events: auto; animation: pulse 1.5s infinite alternate; }
        @keyframes pulse { 0% { transform: scale(1); } 100% { transform: scale(1.08); box-shadow: 0 0 25px rgba(96, 165, 250, 0.9); } }
        input[type="text"] { width: 85%; padding: 10px; margin: 10px 0; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.3); background: rgba(0, 0, 0, 0.5); color: #fff; text-align: center; font-size: 16px; }
    </style>
</head>
<body>
<div id="game-container">
    <canvas id="gameCanvas"></canvas>
    <div id="hud-container">
        <div id="progress-bar-container"><div id="progress-fill"></div></div>
        <div id="use-btn">USE<span style="font-size: 10px; opacity: 0.8;">[E]</span></div>
    </div>
    <!-- Comic Modal -->
    <div id="comic-modal" class="modal" style="display: flex;">
        <div class="modal-content glass-panel">
            <h2 id="comic-title">Chapter 1: The Moon</h2>
            <p id="comic-text" style="margin: 15px 0; color: #93c5fd; font-style: italic;">"Someone left the lights on."</p>
            <p style="font-size: 14px; opacity: 0.85; margin-bottom: 20px;">Explore the lunar surface, locate historic NASA relics, and restore telemetry links.</p>
            <button class="btn" id="start-chapter-btn">Begin Recovery</button>
        </div>
    </div>
    <!-- Mini-Game Modal -->
    <div id="minigame-modal" class="modal">
        <div class="modal-content glass-panel">
            <button id="minigame-reset" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: #aaa; cursor: pointer;">↺ Reset</button>
            <h3 id="minigame-title">Relic Task</h3>
            <p id="minigame-desc" style="font-size: 14px; color: #94a3b8; margin: 10px 0;">Complete the task to wake the relic.</p>
            <div id="minigame-area" style="width: 100%; height: 210px; background: rgba(0,0,0,0.5); border-radius: 12px; margin: 15px 0; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px;"></div>
            <button class="btn" id="minigame-submit" style="display: none;">Complete Task</button>
        </div>
    </div>
    <!-- Fact Card Modal -->
    <div id="fact-modal" class="modal">
        <div class="modal-content glass-panel">
            <h3 id="fact-relic-name">Relic Recovered!</h3>
            <div style="background: #fff; padding: 12px; border-radius: 8px; margin: 15px 0; color: #000;">
                <p id="fact-photo" style="height: 110px; background: #0f172a; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 4px; font-weight: bold; color: #38bdf8; font-size: 28px;">⚡</p>
                <p id="fact-sub" style="font-size: 12px; font-weight: bold; margin-top: 6px; color: #334155;"></p>
            </div>
            <p id="fact-text" style="font-size: 13px; text-align: left; margin-bottom: 12px; line-height: 1.4; color: #e2e8f0;"></p>
            <a id="fact-link" href="#" target="_blank" style="color: #60a5fa; font-size: 12px; text-decoration: underline;">Source: NASA Official Archives</a>
            <br>
            <button class="btn" id="fact-continue-btn">Continue</button>
        </div>
    </div>
    <!-- Certificate Modal -->
    <div id="certificate-modal" class="modal">
        <div class="modal-content glass-panel">
            <h2>Mission Accomplished</h2>
            <p style="margin: 10px 0; font-size: 14px; color: #93c5fd;">You recovered all historical relics!</p>
            <input type="text" id="player-name" placeholder="Enter Your Name" maxlength="20" value="Commander Neil">
            <br>
            <button class="btn" id="download-cert-btn">Download Certificate (PNG)</button>
        </div>
    </div>
</div>
<script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let currentChapter = 1;
    let footprints = [];
    let floatingTexts = [];
    let isTaskActive = false;
    let activeRelic = null;
    let startTime = Date.now();

    const player = { x: 300, y: 300, radius: 18, vx: 0, vy: 0, speed: 3.8, angle: 0, idleTimer: 0 };
    const drone = { x: 270, y: 270, targetAngle: 0, angle: 0 };
    const joystick = { active: false, startX: 0, startY: 0, currX: 0, currY: 0, maxRadius: 50, dx: 0, dy: 0 };

    const relics = [
        { id: 1, chapter: 1, name: 'Apollo Science Station', x: 650, y: 450, recovered: false, icon: '⚡', facts: 'Powered by SNAP-27 RTG radioisotope generators providing continuous warmth through 14-day lunar nights.', link: 'https://curator.jsc.nasa.gov/lunar/alsep.cfm' },
        { id: 2, chapter: 1, name: 'Lunar Rover (LRV)', x: 1250, y: 700, recovered: false, icon: '🚜', facts: 'Driven 35.7 km across Apollo 17 with woven steel wire-mesh tires and titanium chevrons.', link: 'https://www.nasa.gov/history/alsj/lrv.html' },
        { id: 3, chapter: 1, name: 'Surveyor 3', x: 500, y: 1200, recovered: false, icon: '📡', facts: 'First craft to dig lunar soil with robotic scoop; inspected 2.5 years later by Apollo 12.', link: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A' },
        { id: 4, chapter: 2, name: 'Viking 1 Lander', x: 600, y: 550, recovered: false, icon: '🛰️', facts: 'Operated for 2,245 Martian sols in Chryse Planitia, sending the first color Mars photos.', link: 'https://mars.nasa.gov/mars-exploration/missions/viking-1-2/' },
        { id: 5, chapter: 2, name: 'Phoenix Lander', x: 1300, y: 650, recovered: false, icon: '⛏️', facts: 'Confirmed Martian arctic subsurface water-ice after trenching into permafrost.', link: 'https://mars.nasa.gov/missions/phoenix/' },
        { id: 6, chapter: 2, name: 'Ingenuity Helicopter', x: 900, y: 1250, recovered: false, icon: '🚁', facts: 'First powered flight on another planet; completed 72 flights carrying Wright Flyer fabric.', link: 'https://mars.nasa.gov/technology/helicopter/' }
    ];

    const bonusCards = [
        { id: 1, chapter: 1, x: 800, y: 250, collected: false },
        { id: 2, chapter: 1, x: 250, y: 900, collected: false },
        { id: 3, chapter: 2, x: 950, y: 350, collected: false },
        { id: 4, chapter: 2, x: 350, y: 1100, collected: false }
    ];

    const obstacles = [
        { x: 500, y: 700, radius: 45 }, { x: 950, y: 400, radius: 65 }, { x: 1200, y: 1100, radius: 75 }
    ];

    // Inputs
    window.addEventListener('touchstart', e => {
        if (isTaskActive) return;
        const touch = e.touches[0];
        if (touch.clientX < window.innerWidth / 2) {
            joystick.active = true;
            joystick.startX = touch.clientX; joystick.startY = touch.clientY;
            joystick.currX = touch.clientX; joystick.currY = touch.clientY;
        }
    });
    window.addEventListener('touchmove', e => {
        if (!joystick.active) return;
        const touch = e.touches[0];
        joystick.currX = touch.clientX; joystick.currY = touch.clientY;
        const dx = joystick.currX - joystick.startX, dy = joystick.currY - joystick.startY;
        const dist = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
        const moveDist = Math.min(dist, joystick.maxRadius);
        joystick.dx = Math.cos(angle) * (moveDist / joystick.maxRadius);
        joystick.dy = Math.sin(angle) * (moveDist / joystick.maxRadius);
    });
    const stopJoy = () => { joystick.active = false; joystick.dx = 0; joystick.dy = 0; };
    window.addEventListener('touchend', stopJoy); window.addEventListener('touchcancel', stopJoy);

    const keys = {};
    window.addEventListener('keydown', e => {
        keys[e.key.toLowerCase()] = true;
        if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && activeRelic && !isTaskActive) {
            openMiniGame(activeRelic);
        }
    });
    window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

    document.getElementById('use-btn').addEventListener('click', () => {
        if (activeRelic && !isTaskActive) openMiniGame(activeRelic);
    });

    document.getElementById('start-chapter-btn').addEventListener('click', () => {
        document.getElementById('comic-modal').style.display = 'none';
        isTaskActive = false;
    });

    function update() {
        if (isTaskActive) return;
        let moveX = joystick.dx, moveY = joystick.dy;
        if (keys['arrowleft'] || keys['a']) moveX = -1;
        if (keys['arrowright'] || keys['d']) moveX = 1;
        if (keys['arrowup'] || keys['w']) moveY = -1;
        if (keys['arrowdown'] || keys['s']) moveY = 1;

        if (moveX !== 0 || moveY !== 0) {
            const mag = Math.hypot(moveX, moveY);
            player.vx = (moveX / mag) * player.speed;
            player.vy = (moveY / mag) * player.speed;
            player.angle = Math.atan2(player.vy, player.vx);
            player.idleTimer = 0;
            if (Math.random() < 0.15) footprints.push({ x: player.x, y: player.y, angle: player.angle });
            if (footprints.length > 200) footprints.shift();
        } else {
            player.vx = 0; player.vy = 0; player.idleTimer += 0.05;
        }

        let nextX = player.x + player.vx, nextY = player.y + player.vy;
        for (let obs of obstacles) {
            const dist = Math.hypot(nextX - obs.x, nextY - obs.y);
            if (dist < player.radius + obs.radius) {
                const angle = Math.atan2(nextY - obs.y, nextX - obs.x);
                nextX = obs.x + Math.cos(angle) * (player.radius + obs.radius);
                nextY = obs.y + Math.sin(angle) * (player.radius + obs.radius);
            }
        }
        player.x = Math.max(40, Math.min(1800, nextX));
        player.y = Math.max(40, Math.min(1800, nextY));

        drone.x += (player.x - 30 - drone.x) * 0.08;
        drone.y += (player.y - 30 - drone.y) * 0.08;

        const activeChapRelics = relics.filter(r => r.chapter === currentChapter && !r.recovered);
        let near = null;
        if (activeChapRelics.length > 0) {
            drone.targetAngle = Math.atan2(activeChapRelics[0].y - drone.y, activeChapRelics[0].x - drone.x);
            for (let r of activeChapRelics) {
                if (Math.hypot(player.x - r.x, player.y - r.y) < 65) { near = r; break; }
            }
        }
        drone.angle += (drone.targetAngle - drone.angle) * 0.1;

        const useBtn = document.getElementById('use-btn');
        if (near) { useBtn.classList.add('active'); activeRelic = near; }
        else { useBtn.classList.remove('active'); activeRelic = null; }

        bonusCards.filter(b => b.chapter === currentChapter && !b.collected).forEach(bonus => {
            if (Math.hypot(player.x - bonus.x, player.y - bonus.y) < 36) {
                bonus.collected = true;
                floatingTexts.push({ x: bonus.x, y: bonus.y, text: '+1 Secret Archive Card!', alpha: 1.0 });
            }
        });

        floatingTexts.forEach((ft, idx) => {
            ft.y -= 0.6; ft.alpha -= 0.012;
            if (ft.alpha <= 0) floatingTexts.splice(idx, 1);
        });

        const recoveredCount = relics.filter(r => r.chapter === currentChapter && r.recovered).length;
        document.getElementById('progress-fill').style.width = (recoveredCount / 3 * 100) + '%';
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const camX = canvas.width / 2 - player.x, camY = canvas.height / 2 - player.y;
        ctx.save();
        ctx.translate(camX, camY);

        ctx.fillStyle = currentChapter === 1 ? '#0f121a' : '#26120b';
        ctx.fillRect(-200, -200, 2200, 2200);

        ctx.fillStyle = currentChapter === 1 ? 'rgba(0,0,0,0.3)' : 'rgba(40,10,5,0.4)';
        footprints.forEach(fp => {
            ctx.beginPath(); ctx.arc(fp.x, fp.y, 3, 0, Math.PI * 2); ctx.fill();
        });

        obstacles.forEach(obs => {
            ctx.fillStyle = currentChapter === 1 ? '#1a202c' : '#451a03';
            ctx.beginPath(); ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.stroke();
        });

        bonusCards.filter(b => b.chapter === currentChapter && !b.collected).forEach(b => {
            ctx.strokeStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(b.x, b.y, 20, 0, Math.PI * 2); ctx.stroke();
            ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('✨', b.x, b.y + 5);
        });

        relics.filter(r => r.chapter === currentChapter).forEach(r => {
            ctx.save();
            ctx.font = '30px sans-serif'; ctx.textAlign = 'center';
            if (r.recovered) {
                ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
                ctx.beginPath(); ctx.arc(r.x, r.y, 35, 0, Math.PI * 2); ctx.fill();
                ctx.fillText(r.icon, r.x, r.y + 10);
                ctx.fillStyle = '#10b981'; ctx.fillText('✓', r.x + 20, r.y - 10);
            } else {
                ctx.globalAlpha = 0.45; ctx.fillText(r.icon, r.x, r.y + 10); ctx.globalAlpha = 1.0;
                ctx.font = '14px sans-serif'; ctx.fillText('🔒', r.x + 16, r.y - 12);
            }
            ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.fillText(r.name, r.x, r.y + 45);
            ctx.restore();
        });

        // Drone
        ctx.save();
        ctx.translate(drone.x, drone.y); ctx.rotate(drone.angle);
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(6, 0, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Player
        ctx.save();
        ctx.translate(player.x, player.y); ctx.rotate(player.angle);
        ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(0, 0, player.radius, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(5, 0, 7, -Math.PI/2, Math.PI/2); ctx.fill();
        ctx.restore();

        // Floating texts
        floatingTexts.forEach(ft => {
            ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
            ctx.globalAlpha = ft.alpha; ctx.fillText(ft.text, ft.x, ft.y); ctx.globalAlpha = 1.0;
        });

        ctx.restore();

        if (joystick.active) {
            ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath();
            ctx.arc(joystick.startX, joystick.startY, joystick.maxRadius, 0, Math.PI*2); ctx.stroke();
            ctx.fillStyle = '#38bdf8'; ctx.beginPath();
            ctx.arc(joystick.startX + joystick.dx * joystick.maxRadius, joystick.startY + joystick.dy * joystick.maxRadius, 20, 0, Math.PI*2); ctx.fill();
        }

        requestAnimationFrame(() => { update(); render(); });
    }

    function openMiniGame(relic) {
        isTaskActive = true;
        const modal = document.getElementById('minigame-modal');
        const title = document.getElementById('minigame-title');
        const desc = document.getElementById('minigame-desc');
        const area = document.getElementById('minigame-area');
        title.innerText = relic.name;
        modal.style.display = 'flex';

        if (relic.id === 1) {
            desc.innerText = 'Drag and connect the 12V SNAP-27 power coupler!';
            area.innerHTML = '<button id="solve-btn" class="btn">Connect 12V SNAP-27 RTG Line</button>';
        } else if (relic.id === 2) {
            desc.innerText = 'Tap rapidly to clean lunar dust off the Lunar Rover wheels!';
            let taps = 5;
            area.innerHTML = '<button id="solve-btn" class="btn">Clean Dust (' + taps + ' taps left)</button>';
            const b = document.getElementById('solve-btn');
            b.onclick = () => { taps--; if (taps <= 0) completeMiniGame(relic); else b.innerText = 'Clean Dust (' + taps + ' taps left)'; };
            return;
        } else if (relic.id === 3) {
            desc.innerText = 'Lock telemetry alignment frequency for Surveyor 3!';
            area.innerHTML = '<button id="solve-btn" class="btn">Align Antenna</button>';
        } else if (relic.id === 4) {
            desc.innerText = 'Scoop Martian soil with Viking 1 robotic sample arm!';
            area.innerHTML = '<button id="solve-btn" class="btn">Scoop Soil Sample</button>';
        } else if (relic.id === 5) {
            desc.innerText = 'Dig through Vastitas permafrost to expose Phoenix water-ice!';
            area.innerHTML = '<button id="solve-btn" class="btn">Excavate Ice Trench</button>';
        } else {
            desc.innerText = 'Engage Ingenuity counter-rotating carbon rotors!';
            area.innerHTML = '<button id="solve-btn" class="btn">Stabilize Flight Altitude</button>';
        }

        document.getElementById('solve-btn').onclick = () => completeMiniGame(relic);
    }

    function completeMiniGame(relic) {
        relic.recovered = true;
        document.getElementById('minigame-modal').style.display = 'none';

        const factModal = document.getElementById('fact-modal');
        document.getElementById('fact-relic-name').innerText = relic.name + ' Restored!';
        document.getElementById('fact-photo').innerText = relic.icon;
        document.getElementById('fact-sub').innerText = relic.name;
        document.getElementById('fact-text').innerText = relic.facts;
        document.getElementById('fact-link').href = relic.link;
        factModal.style.display = 'flex';
    }

    document.getElementById('fact-continue-btn').addEventListener('click', () => {
        document.getElementById('fact-modal').style.display = 'none';
        const chapRelics = relics.filter(r => r.chapter === currentChapter);
        if (chapRelics.every(r => r.recovered)) {
            if (currentChapter === 1) {
                currentChapter = 2;
                player.x = 300; player.y = 300;
                document.getElementById('comic-title').innerText = 'Chapter 2: Mars';
                document.getElementById('comic-text').innerText = '"The Red Plains of Chryse."';
                document.getElementById('comic-modal').style.display = 'flex';
            } else {
                document.getElementById('certificate-modal').style.display = 'flex';
            }
        } else {
            isTaskActive = false;
        }
    });

    document.getElementById('download-cert-btn').addEventListener('click', () => {
        const certCanvas = document.createElement('canvas');
        certCanvas.width = 1200; certCanvas.height = 800;
        const c = certCanvas.getContext('2d');
        c.fillStyle = '#0b0f19'; c.fillRect(0, 0, 1200, 800);
        c.strokeStyle = '#d4af37'; c.lineWidth = 8; c.strokeRect(30, 30, 1140, 740);
        c.fillStyle = '#ffffff'; c.font = 'bold 36px sans-serif'; c.textAlign = 'center';
        c.fillText('OFFICIAL CERTIFICATE OF RECOVERY', 600, 150);
        c.font = 'italic 20px sans-serif'; c.fillStyle = '#94a3b8';
        c.fillText('Awarded to Historical Recovery Specialist:', 600, 220);
        c.font = 'bold 42px sans-serif'; c.fillStyle = '#38bdf8';
        c.fillText((document.getElementById('player-name').value || 'Commander Explorer').toUpperCase(), 600, 300);
        c.font = '22px sans-serif'; c.fillStyle = '#cbd5e1';
        c.fillText('All Lunar and Martian NASA Relics Successfully Restored & Preserved.', 600, 420);
        const link = document.createElement('a');
        link.download = 'Afterlight_Recovery_Certificate.png';
        link.href = certCanvas.toDataURL('image/png');
        link.click();
    });

    requestAnimationFrame(() => { update(); render(); });
</script>
</body>
</html>`;
}
