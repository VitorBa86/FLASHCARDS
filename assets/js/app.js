const PARTS = {
  1: "P1",
  2: "P1",
  3: "P1",
  4: "P1",
  5: "P2",
  6: "P2",
  7: "P2",
  8: "P2",
  9: "P2",
  10: "P3",
  11: "P3",
  12: "P3",
  13: "P3",
  14: "P3",
};
const PART_NAMES = {
  P1: "Conhecimentos Básicos",
  P2: "Conhecimentos Complementares",
  P3: "Conhecimentos Específicos",
};
const PART_LABEL = { P1: "Parte 1", P2: "Parte 2", P3: "Parte 3" };
const sel = new Set();
let deck = [],
  idx = 0,
  okN = 0,
  errN = 0,
  wrong = [];
let reviewMode = false,
  lastWrong = [],
  flipped = false;

const $ = (id) => document.getElementById(id);
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}
const pad = (n) => String(n).padStart(2, "0");

/* ---------- setup ---------- */
function buildGrid() {
  const parts = ["P1", "P2", "P3"];
  $("mgrid").innerHTML = parts
    .map((p) => {
      const mods = DATA.filter((m) => PARTS[m.n] === p);
      const total = mods.reduce((s, m) => s + m.cards.length, 0);
      return `
    <div class="part">
      <div class="parthead">
        <span class="pn">${PART_LABEL[p]}</span>
        <span class="pt">${PART_NAMES[p]}</span>
        <span class="pc">${mods.length} módulos · ${total} cartões</span>
        <button class="btn link" id="pb${p}" onclick="selPart('${p}')">Selecionar parte</button>
      </div>
      <div class="mlist">
        ${mods
          .map(
            (m) => `
        <label class="mrow" id="mc${m.n}" onclick="toggleMod(event,${m.n});return false;">
          <input type="checkbox" id="chk${m.n}">
          <span class="chk"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5 10 18 20 6"/></svg></span>
          <span class="num">${pad(m.n)}</span>
          <span class="mt">${esc(m.name)}</span>
          <span class="mc">${m.cards.length}</span>
        </label>`,
          )
          .join("")}
      </div>
    </div>`;
    })
    .join("");
}
function toggleMod(ev, n) {
  ev.stopPropagation();
  sel.has(n) ? sel.delete(n) : sel.add(n);
  updModUI();
}
function updModUI() {
  let cards = 0;
  DATA.forEach((m) => {
    const on = sel.has(m.n);
    if (on) cards += m.cards.length;
    $("mc" + m.n).classList.toggle("on", on);
    $("chk" + m.n).checked = on;
  });
  ["P1", "P2", "P3"].forEach((p) => {
    const mods = DATA.filter((m) => PARTS[m.n] === p);
    const all = mods.every((m) => sel.has(m.n));
    $("pb" + p).textContent = all ? "Desmarcar parte" : "Selecionar parte";
  });
  const allOn = sel.size === DATA.length;
  $("btnAll").classList.toggle("on", allOn);
  $("btnAllTx").textContent = allOn
    ? "Todos os 14 módulos marcados"
    : "Marcar todos os 14 módulos";
  $("selCount").innerHTML = sel.size
    ? `<b>${sel.size}</b> módulo${sel.size > 1 ? "s" : ""} · <b>${cards}</b> cartões`
    : "Nenhum módulo selecionado";
  $("btnStart").disabled = sel.size === 0;
  $("btnReviewErr").style.display = lastWrong.length ? "" : "none";
}
function toggleAll() {
  if (sel.size === DATA.length) sel.clear();
  else DATA.forEach((m) => sel.add(m.n));
  updModUI();
}
function selPart(p) {
  const mods = DATA.filter((m) => PARTS[m.n] === p);
  const all = mods.every((m) => sel.has(m.n));
  mods.forEach((m) => (all ? sel.delete(m.n) : sel.add(m.n)));
  updModUI();
}
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 1900);
}

/* ---------- study ---------- */
function collectCards(revOnly) {
  if (revOnly) {
    const byCode = {};
    DATA.forEach((m) =>
      m.cards.forEach((c) => {
        byCode[c.code] = {
          m: m.n,
          mname: m.name,
          code: c.code,
          q: c.f,
          a: c.v,
        };
      }),
    );
    return shuffle(lastWrong.map((w) => byCode[w.c]).filter(Boolean));
  }
  let out = [];
  DATA.filter((m) => sel.has(m.n)).forEach((m) => {
    m.cards.forEach((c) => {
      out.push({ m: m.n, mname: m.name, code: c.code, q: c.f, a: c.v });
    });
  });
  return shuffle(out);
}
function startStudy(fromReview) {
  reviewMode = fromReview;
  deck = collectCards(fromReview);
  if (!deck.length) {
    toast("Selecione pelo menos um módulo");
    return;
  }
  idx = 0;
  okN = 0;
  errN = 0;
  flipped = false;
  wrong = [];
  $("setup").style.display = "none";
  $("result").style.display = "none";
  $("study").style.display = "flex";
  updScore();
  showCard();
  window.scrollTo(0, 0);
}
function showCard() {
  const c = deck[idx];
  if (!c) return;
  flipped = false;
  $("flipEl").classList.remove("flipped");
  $("badgeF").textContent = c.code;
  $("badgeB").textContent = c.code;
  $("modF").textContent = "Módulo " + c.m + " · " + c.mname;
  $("modB").textContent = "Módulo " + c.m + " · " + c.mname;
  $("qText").textContent = c.q;
  $("aText").textContent = c.a;
  $("posPill").innerHTML = `Cartão <b>${idx + 1}</b> de <b>${deck.length}</b>`;
  $("pbarFill").style.width = (idx / deck.length) * 100 + "%";
}
function toggleFlip() {
  flipped = !flipped;
  $("flipEl").classList.toggle("flipped", flipped);
}
function answer(kind) {
  const c = deck[idx];
  if (!c) return;
  if (kind === "hit") {
    okN++;
  } else {
    errN++;
    wrong.push({ m: c.m, name: c.mname, c: c.code, q: c.q, a: c.a });
  }
  updScore();
  idx++;
  idx >= deck.length ? finish() : showCard();
}
function updScore() {
  $("okN").textContent = okN;
  $("errN").textContent = errN;
  $("pbarFill").style.width =
    (deck.length ? (idx / deck.length) * 100 : 0) + "%";
}
function finish() {
  $("study").style.display = "none";
  $("result").style.display = "flex";
  lastWrong = wrong.slice();
  $("rErr").textContent = errN;
  $("rOk").textContent = okN;
  const tot = errN + okN;
  $("rAcc").textContent = tot ? Math.round((okN / tot) * 100) + "%" : "—";
  $("resSub").textContent = reviewMode
    ? "Sessão de revisão · " + tot + " cartões revisados"
    : tot + " cartões respondidos";
  $("resTitle").textContent =
    errN === 0 ? "Gabarito limpo" : "Sessão concluída";
  $("btnRetake").disabled = errN === 0;
  buildReview();
  window.scrollTo(0, 0);
}
function buildReview() {
  $("reviewPanel").innerHTML = wrong.length
    ? `<h3>Gabarito de revisão <span class="nred">${wrong.length} errada${wrong.length > 1 ? "s" : ""}</span></h3>` +
      wrong
        .map(
          (w) => `<div class="ritem">
        <div class="rc">${w.c} · Módulo ${w.m} – ${esc(w.name)}</div>
        <div class="rf">${esc(w.q)}</div>
        <div class="rv">${esc(w.a)}</div>
      </div>`,
        )
        .join("")
    : `<div class="rnone">Nenhum erro nesta sessão.</div>`;
}
function retakeWrong() {
  if (!lastWrong.length) return;
  startStudy(true);
}
function backToSetup() {
  deck = [];
  $("result").style.display = "none";
  $("setup").style.display = "flex";
  updModUI();
}
function quitStudy() {
  deck = [];
  $("study").style.display = "none";
  $("setup").style.display = "flex";
  updModUI();
}

/* ---------- 3D tilt on hover ---------- */
(function () {
  const zone = $("cardzone"),
    tilt = $("tiltEl");
  if (window.matchMedia("(hover: none)").matches) return;
  zone.addEventListener("mousemove", (e) => {
    const r = zone.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`;
  });
  zone.addEventListener("mouseleave", () => {
    tilt.style.transform = "";
  });
})();

document.addEventListener("keydown", (e) => {
  if ($("study").style.display !== "flex" || !deck.length) return;
  const k = e.key.toLowerCase();
  if (k === "e") answer("miss");
  else if (k === "a") answer("hit");
  else if (k === "r") toggleFlip();
});
buildGrid();
updModUI();
