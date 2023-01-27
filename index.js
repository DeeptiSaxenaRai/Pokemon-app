const appElement = document.getElementById("pokemonApp");
appElement.innerHTML = `
	<nav>
		<button id="back-button">Back</button>
		<button id="home-button">Pokemon Dek</button>
		<button id="next-button">Next</button>
		<input type="text" name="" id="search-input" placeholder="search">
		<button id="search-button">Search</button>
	</nav>`;
// make the new div element to keep all pokemon
const pokeListContainer = document.createElement("div");
pokeListContainer.setAttribute("class", "poke-list");

let pokemonPageData = {
  next: null,
  previous: null,
};

const backButton = document.getElementById("back-button");
backButton.addEventListener("click", () =>
  displayPokemonIndex(pokemonPageData.previous)
);

const nextButton = document.getElementById("next-button");
nextButton.addEventListener("click", () =>
  displayPokemonIndex(pokemonPageData.next)
);

const homeButton = document.getElementById("home-button");
homeButton.addEventListener("click", () => displayPokemonIndex());

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", function () {
  displayPokemonSearchResults(searchInput);
});

async function getApi(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function displayPokemonSearchResults(searchInput) {
  let pokemonDataSearch = searchInput.value;
  if (!pokemonDataSearch) return; //can't work if search inputis blank
  if (pokemonDataSearch.length < 3) return; //Set the minimum value of search input
  pokeListContainer.innerHTML = "";
  const pokemonData = await getApi(
    "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=2000"
  );

  pokemonData.results.forEach(async (pokemon) => {
    if (pokemon.name.includes(searchInput.value)) {
      const pokemonDetailData = await getApi(pokemon.url);

      const pokeCardEl = document.createElement("div");
      pokeCardEl.className = "card";

      const pokeCardTitle = document.createElement("h2");
      pokeCardTitle.textContent = pokemon.name;

      const pokeCardImage = document.createElement("img");
      pokeCardImage.src =
        pokemonDetailData.sprites.other["official-artwork"].front_default;

      pokeCardEl.append(pokeCardTitle, pokeCardImage);
      searchInput.value = ""; //clear the search input

      pokeCardEl.addEventListener("click", () =>
        displayPokemonDetails(pokemonDetailData)
      );

      pokeListContainer.append(pokeCardEl);
    }
  });
}

// Make the function to display pokemon
async function displayPokemonIndex(
  url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10"
) {
  pokeListContainer.innerHTML = "";
  const pokemonData = await getApi(url);

  pokemonPageData.next =
    pokemonData.next || "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10";
  pokemonPageData.previous =
    pokemonData.previous ||
    `https://pokeapi.co/api/v2/pokemon/?offset=${
      Math.floor(pokemonData.count / 20) * 20
    }&limit=10`;

  pokemonData.results.forEach(async (pokemon) => {
    const pokemonDetailData = await getApi(pokemon.url);
    const pokeCardEl = document.createElement("div");
    pokeCardEl.className = "card";

    const pokeCardTitle = document.createElement("h2");
    pokeCardTitle.textContent = pokemon.name;
    const pokeCardImage = document.createElement("img");
    pokeCardImage.src =
      pokemonDetailData.sprites.other["official-artwork"].front_default;

    pokeCardEl.append(pokeCardTitle, pokeCardImage);

    pokeCardEl.addEventListener("click", () =>
      displayPokemonDetails(pokemonDetailData)
    );

    pokeListContainer.append(pokeCardEl);
  });

  appElement.appendChild(pokeListContainer);
}

// Make the function to display the pokemon details
function displayPokemonDetails(pokemonData) {
  let { name, height, weight, base_experience, types, stats } = pokemonData;

  height = height / 10 + "m";
  weight = weight / 10 + "kg";

  types = types.map((type) => `<h3>${type.type.name}</h3>`).join("");
  stats = stats
    .map((stat) => `<h3>${stat.stat.name}</h3><h3>${stat.base_stat}</h3>`)
    .join("<hr>");

  pokeListContainer.innerHTML = `
	<div class="poke-list">
		<div class="card card-big">
			<h2>${name}</h2>
			<img src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="">

			<div class="card-stats">
				<div class="info">
					<h3 class="height">${height}</h3>
					<h3 class="weight">${weight}</h3>
					<h3 class="xp">${base_experience}</h3>
				</div>

				<div class="types">
					${types}
				</div>
				<div class="stats">
					${stats}
				</div>
			</div>
		</div>
	</div>`;
}

// displayPokemonIndex();
