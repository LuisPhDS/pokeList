const lista = document.querySelector(".listagem-pokemon");
const loadingContainer = document.querySelector(".loading");
const logo = document.querySelector("#logo");
var offset = 0;
var limit = 0;


function handleImageError(imgElement) {
    imgElement.onerror = null;
    imgElement.src = "#";
    imgElement.alt = "Sem Imagem";
}


const carregaLista = async (json) => {
    lista.innerHTML = '';
    if (json.results == 'False') {
        alert(json.Error = "pokémon não encontrado :(");
        return;
    }

    for (const element of json.results) {
        const item = document.createElement("li");
        item.classList.add("cartao-pokemon", "skeleton-loading");

        try {
            const speciesData = await fetch(element.url)
            .then(responsta => responsta.json())
            .then(data => data)
            
            const descriptionData = await fetch(speciesData.species.url)
                .then(response => response.json());

            const description = descriptionData.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text;

            const gifUrl = speciesData.sprites.versions['generation-v']['black-white'].animated.front_default || speciesData.sprites.front_default;

            item.innerHTML = `
                <div class="informacoes">
                    <span>${element.name}</span>
                    <span>#${speciesData.id}</span>
                </div>
                <img src="${gifUrl}" alt="${speciesData.name}" class="gif" onerror="handleImageError(this)" />
                <ul class="tipos">
                    ${speciesData.types.map(type => `
                        <li class="tipo ${type.type.name} ">${type.type.name}</li>
                    `).join('')}
                </ul>
                <p class="descricao">${description}</p>
            `;

            item.addEventListener("click", async () => {
                const modalContent = document.querySelector(".modal-content");

                modalContent.innerHTML = '';

                const speciesData = await fetch(element.url)
                    .then(response => response.json());

                const descriptionData = await fetch(speciesData.species.url)
                    .then(response => response.json());

                const modalTitle = document.createElement("h2");
                modalTitle.textContent = speciesData.name;

                const pokemonNumber = document.createElement("p");
                pokemonNumber.textContent = `Number: #${speciesData.id}`;

                const pokemonImage = document.createElement("img");
                const gifUrl = speciesData.sprites.front_default;
                pokemonImage.src = gifUrl;
                pokemonImage.alt = speciesData.name;
                pokemonImage.innerHTML = `onerror="handleImageError(this)"`;

                const typesList = document.createElement("ul");
                //
                speciesData.types.forEach(type => {
                    const typeItem = document.createElement("li");
                    typeItem.classList.add(`${type.type.name}`);
                    typeItem.textContent = type.type.name;
                    typesList.appendChild(typeItem);
                });

                const description = document.createElement("p");
                description.innerHTML = descriptionData.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text;

                const abilitiesList = document.createElement("ul");
                abilitiesList.innerHTML = `<strong>Abilities:</strong>`
                speciesData.abilities.forEach(ability => {
                    const abilityItem = document.createElement("li");
                    abilityItem.classList.add("tipo-habilidade");
                    abilityItem.textContent = ability.ability.name;
                    abilitiesList.appendChild(abilityItem);
                });

                const heightMale = (speciesData.height / 10).toFixed(2);
                const weightMale = (speciesData.weight / 10).toFixed(2); 

                const heightFemale = ((speciesData.height / 10) * 0.9).toFixed(2); 
                const weightFemale = ((speciesData.weight / 10) * 0.9).toFixed(2); 

                const heightAndWeight = document.createElement("p");
                heightAndWeight.innerHTML = `<strong>Male height:</strong> ${heightMale} m <br> <strong>Male weight:</strong> ${weightMale} kg<br><strong>Female height:</strong> ${heightFemale} m <br> <strong>Female weight:</strong> ${weightFemale} kg`;

                modalContent.appendChild(modalTitle);
                modalContent.appendChild(pokemonNumber);
                modalContent.appendChild(pokemonImage);
                modalContent.appendChild(typesList);
                modalContent.appendChild(description);
                modalContent.appendChild(abilitiesList);
                modalContent.appendChild(heightAndWeight);

                modal.style.display = "block";
            });

            lista.appendChild(item);
        } catch (error) {
            console.error(error);
        }
    }
}

window.addEventListener('load', ()=> {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=10")
    .then(response => response.json())
    .then(json => {
        console.log(json);
        carregaLista(json);
    })
    .catch(error => {console.error(error)});

    setTimeout(function () {
        var loading = document.querySelectorAll('.skeleton-loading');
        loading.forEach(function (container) {
            container.classList.remove('skeleton-loading');
            loadingContainer.classList.remove('loading');
        });
    }, 7000);
});

logo.addEventListener('click', () => {
    limit = 10;
    offset += 10;

    if (limit >= 1281 || offset >= 1281) {
        limit = 10;
        offset = 0;
    }
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    fetch(url)
        .then(response => response.json())
        .then(json => {
            console.log("limit: "+ limit);
            console.log("offset: "+ offset);
            console.log(json);
            carregaLista(json);
        })
        .catch(error => {
            console.error(error);
        });

    setTimeout(function () {
        var loading = document.querySelectorAll('.skeleton-loading');
        loading.forEach(function (container) {
            container.classList.remove('skeleton-loading');
            loadingContainer.classList.remove('loading');
        });
    }, 7000);
})

const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal");

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", event => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});