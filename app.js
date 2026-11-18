const nomes = ["red", "green", "blue", "black", "white", "gold", "tomato", "orchid", "teal",
  "coral", "crimson", "indigo", "khaki", "salmon", "skyblue", "slategray", "turquoise", "violet"];
const HEX = "0123456789ABCDEF";
const aleatorio = (max) => Math.floor(Math.random() * max);

const geradores = {
  nome: () => nomes[aleatorio(nomes.length)],
  hexa: () => "#" + Array.from({ length: 6 }, () => HEX[aleatorio(16)]).join(""),
  rgb: () => `rgb(${aleatorio(256)}, ${aleatorio(256)}, ${aleatorio(256)})`,
};

let modo = "nome";
const span = document.querySelector("#cor");
const historico = document.querySelector("#historico");

function aplicar(cor) {
  document.body.style.backgroundColor = cor;
  span.textContent = cor;
  const li = document.createElement("li");
  li.className = "list-inline-item";
  li.innerHTML = `<span class="d-inline-block rounded-circle border" title="${cor}" style="width:24px;height:24px;background:${cor}"></span>`;
  historico.prepend(li);
  while (historico.children.length > 8) historico.lastChild.remove();
}

document.querySelector("#mudar").addEventListener("click", () => aplicar(geradores[modo]()));
document.querySelector("#copiar").addEventListener("click", async (e) => {
  try {
    await navigator.clipboard.writeText(span.textContent);
    e.target.textContent = "Copiado!";
  } catch { e.target.textContent = "Não foi possível copiar"; }
  setTimeout(() => (e.target.textContent = "Copiar código"), 1200);
});
document.querySelectorAll("[data-modo]").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll("[data-modo]").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    modo = b.dataset.modo;
    aplicar(geradores[modo]());
  })
);
