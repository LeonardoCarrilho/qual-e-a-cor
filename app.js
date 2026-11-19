const nomes = ["red", "green", "blue", "black", "white", "gold", "tomato", "orchid", "teal",
  "coral", "crimson", "indigo", "khaki", "salmon", "skyblue", "slategray", "turquoise", "violet",
  "lavender", "peachpuff", "thistle", "powderblue", "darkseagreen", "rosybrown", "wheat"];
const HEX = "0123456789ABCDEF";
const aleatorio = (max) => Math.floor(Math.random() * max);

const geradores = {
  nome: () => nomes[aleatorio(nomes.length)],
  hexa: () => "#" + Array.from({ length: 6 }, () => HEX[aleatorio(16)]).join(""),
  rgb: () => `rgb(${aleatorio(256)}, ${aleatorio(256)}, ${aleatorio(256)})`,
};

// Cores de exemplo já no histórico ao abrir a página.
const EXEMPLOS = ["#F2C6B4", "lavender", "rgb(122, 166, 201)", "darkseagreen", "#E8D48B", "thistle", "#5B6C8F"];

let modo = "nome";
const raiz = document.documentElement;
const texto = document.querySelector("#cor");
const historico = document.querySelector("#historico");

// Converte qualquer cor CSS para RGB e escolhe texto escuro ou claro conforme a luminância.
const amostra = document.createElement("canvas").getContext("2d");
function contraste(cor) {
  amostra.fillStyle = "#000";
  amostra.fillStyle = cor;
  const h = amostra.fillStyle;
  const [r, g, b] = h.startsWith("#") ? [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) : h.match(/\d+/g).map(Number);
  const luz = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luz > 0.55 ? "#1d2422" : "#f7f7f4";
}

function mostrar(cor) {
  raiz.style.setProperty("--cor", cor);
  raiz.style.setProperty("--texto", contraste(cor));
  texto.textContent = cor;
}

function guardar(cor) {
  const li = document.createElement("li");
  li.innerHTML = `<button type="button" title="${cor}" aria-label="Voltar para ${cor}" style="background:${cor}"></button>`;
  li.firstChild.addEventListener("click", () => mostrar(cor));
  historico.prepend(li);
  while (historico.children.length > 10) historico.lastChild.remove();
}

function aplicar(cor) {
  mostrar(cor);
  guardar(cor);
}

[...EXEMPLOS].reverse().forEach(guardar);
mostrar(EXEMPLOS[0]);

document.querySelector("#mudar").addEventListener("click", () => aplicar(geradores[modo]()));
document.querySelector("#copiar").addEventListener("click", async (e) => {
  try {
    await navigator.clipboard.writeText(texto.textContent);
    e.target.textContent = "Copiado!";
  } catch { e.target.textContent = "Não foi possível copiar"; }
  setTimeout(() => (e.target.textContent = "Copiar código"), 1200);
});
document.querySelectorAll("[data-modo]").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll("[data-modo]").forEach((x) => x.classList.toggle("ativo", x === b));
    modo = b.dataset.modo;
    aplicar(geradores[modo]());
  })
);
