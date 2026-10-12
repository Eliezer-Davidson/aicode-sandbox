// A ball (or several) bouncing off the walls of a canvas. No libraries.
const canvas = document.getElementById("court");
const ctx = canvas.getContext("2d");
const balls = [];
const COLORS = ["#f97316", "#22d3ee", "#a3e635", "#f472b6", "#facc15", "#60a5fa"];

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function makeBall(x, y) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  const r = 14 + Math.random() * 14;
  const speed = 180 + Math.random() * 220;            // px per second
  const angle = Math.random() * Math.PI * 2;
  return {
    x: x ?? r + Math.random() * (w - 2 * r),
    y: y ?? r + Math.random() * (h - 2 * r),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r,
    color: COLORS[balls.length % COLORS.length],
  };
}

function step(ball, dt) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  // Reflect off each wall and push the ball back inside so it never sticks.
  if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
  if (ball.x + ball.r > w) { ball.x = w - ball.r; ball.vx = -Math.abs(ball.vx); }
  if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); }
  if (ball.y + ball.r > h) { ball.y = h - ball.r; ball.vy = -Math.abs(ball.vy); }
}

function draw(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  // small highlight so it reads as a sphere
  ctx.beginPath();
  ctx.arc(ball.x - ball.r * 0.35, ball.y - ball.r * 0.35, ball.r * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fill();
}

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);     // clamp after tab switches
  last = now;
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  for (const b of balls) { step(b, dt); draw(b); }
  requestAnimationFrame(frame);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  balls.push(makeBall(e.clientX - rect.left, e.clientY - rect.top));
});
window.addEventListener("resize", resize);

resize();
balls.push(makeBall());
requestAnimationFrame(frame);
