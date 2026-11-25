// Mots reconnus (anglais + français)
const PUBLIC_WORDS = ["public", "publique", "publiques"];
const PRIVATE_WORDS = ["private", "privé", "privée", "privés"];

// - span.Label                      : ancien rendu (liste des dépôts du profil)
// - [data-component="Label"]        : nouveau rendu React/Primer (page d'un dépôt)
// - [data-testid="repo-visibility-label"] : label de visibilité sur la page d'un dépôt
const LABEL_SELECTOR = [
	"span.Label",
	'[data-component="Label"]',
	'[data-testid="repo-visibility-label"]',
].join(",");

function colorLabels(root = document) {
	root.querySelectorAll(LABEL_SELECTOR).forEach((el) => {
		const firstWord = el.textContent.trim().toLowerCase().split(/\s+/)[0];

		el.classList.remove("gh-vis-public", "gh-vis-private");

		if (PUBLIC_WORDS.includes(firstWord)) {
			el.classList.add("gh-vis-public");
		} else if (PRIVATE_WORDS.includes(firstWord)) {
			el.classList.add("gh-vis-private");
		}
	});
}

colorLabels();

// GitHub charge le contenu dynamiquement (Turbo / React) : on observe le DOM.
// React peut aussi réécrire les classes d'un élément : on observe les attributs.
let scheduled = false;
new MutationObserver(() => {
	if (scheduled) return;
	scheduled = true;
	requestAnimationFrame(() => {
		scheduled = false;
		colorLabels();
	});
}).observe(document.body, {
	childList: true,
	subtree: true,
	characterData: true,
	attributes: true,
	attributeFilter: ["class"],
});
