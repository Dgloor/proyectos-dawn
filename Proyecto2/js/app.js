async function getInfo(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data["info"];
}

async function setTotales(infoPersonajes, infoEpisodios, infoUbicaciones) {
    document.querySelector(".total-personajes").innerHTML =
        infoPersonajes["count"];
    document.querySelector(".total-episodios").innerHTML =
        infoEpisodios["count"];
    document.querySelector(".total-ubicaciones").innerHTML =
        infoUbicaciones["count"];
}

async function setUltimosEpisodios(url, temporada, infoEpisodios) {
    let episodiosTemporada = [];

    for (let i = 1; i < infoEpisodios["pages"] + 1; i++) {
        const response = await fetch(`${url}?page=${i}`);
        const data = await response.json();
        const episodios = data["results"];

        for (let i = 0; i < episodios.length; i++) {
            const episodio = episodios[i];
            const temporadaEpisodio = episodio["episode"].substring(2, 3);

            if (temporada == temporadaEpisodio) {
                episodiosTemporada.push(episodio);
            }
        }
    }

    episodiosTemporada = episodiosTemporada.slice(-5);

    for (let i = 0; i < episodiosTemporada.length; i++) {
        const episodio = episodiosTemporada[i];

        document.querySelector(".ultimos-episodios").innerHTML += `
        <tr>
            <td>${i + 1}</td>
            <td class="txt-oflo">${episodio["name"]}</td>
            <td>${episodio["episode"]}</td>
            <td class="txt-oflo">${episodio["air_date"]}</td>
            <td><span>${episodio["characters"].length}</span></td>
        </tr>`;
    }
}

async function loadData() {
    const apiURL = "https://rickandmortyapi.com/api/";
    const personajesURL = apiURL + "character";
    const episodiosURL = apiURL + "episode";
    const ubicacionesURL = apiURL + "location";

    const temporadaActual = 2;

    const infoPersonajes = await getInfo(personajesURL);
    const infoEpisodios = await getInfo(episodiosURL);
    const infoUbicaciones = await getInfo(ubicacionesURL);

    setTotales(infoPersonajes, infoEpisodios, infoUbicaciones);
    setUltimosEpisodios(episodiosURL, temporadaActual, infoEpisodios);
}

window.addEventListener("DOMContentLoaded", () => {
    loadData();
});
