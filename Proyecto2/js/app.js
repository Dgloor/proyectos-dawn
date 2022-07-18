async function getInfo(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data["info"];
}

async function getTotalPersonajes(personajesURL) {
    let response = await fetch(personajesURL);
    let data = await response.json();
    return data["info"]["count"];
}

async function setTotales(infoPersonajes, infoEpisodios, infoUbicaciones) {
    document.querySelector(".total-personajes").innerHTML =
        infoPersonajes["count"];
    document.querySelector(".total-episodios").innerHTML =
        infoEpisodios["count"];
    document.querySelector(".total-ubicaciones").innerHTML =
        infoUbicaciones["count"];
}

async function setUltimosEpisodios(episodiosURL, temporada, infoEpisodios) {
    let episodiosTemporada = [];

    for (let i = 1; i < infoEpisodios["pages"] + 1; i++) {
        const response = await fetch(`${episodiosURL}?page=${i}`);
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

    document.querySelector(".ultimos-episodios").innerHTML = "";

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

async function setChartPersonajes(personajesURL) {
    const personajesVivosURL = personajesURL + "/?status=alive";
    const personajesMuertosURL = personajesURL + "/?status=dead";
    const personajesDesconocidoURL = personajesURL + "/?status=unknown";

    const totalPersonajesVivos = await getTotalPersonajes(personajesVivosURL);
    const totalPersonajesMuertos = await getTotalPersonajes(
        personajesMuertosURL
    );
    const totalPersonajesDesconocido = await getTotalPersonajes(
        personajesDesconocidoURL
    );
    
    const data = {
        series: [
            totalPersonajesVivos,
            totalPersonajesMuertos,
            totalPersonajesDesconocido,
        ],
    };

    const sum = function (a, b) {
        return a + b;
    };

    const options = {
        labelInterpolationFnc: function (value) {
            return Math.round((value / data.series.reduce(sum)) * 100) + "%";
        },
        width: "450px",
        height: "350px",
    };

    new Chartist.Pie(".ct-estado-personajes", data, options);
}

async function loadData() {
    const apiURL = "https://rickandmortyapi.com/api/";
    const personajesURL = apiURL + "character";
    const episodiosURL = apiURL + "episode";
    const ubicacionesURL = apiURL + "location";
    const temporadaActual = 1;

    const infoPersonajes = await getInfo(personajesURL);
    const infoEpisodios = await getInfo(episodiosURL);
    const infoUbicaciones = await getInfo(ubicacionesURL);

    setTotales(infoPersonajes, infoEpisodios, infoUbicaciones);
    setUltimosEpisodios(episodiosURL, temporadaActual, infoEpisodios);
    setChartPersonajes(personajesURL);

    // Events
    // Temporadas
    const selectTemporadas = document.querySelector(".select-temporadas");
    selectTemporadas.addEventListener("change", () => {
        const temporadas = document.querySelector(".select-temporadas").options;
        const temporadaActual =
            temporadas[temporadas.selectedIndex].textContent.slice(-1);

        setUltimosEpisodios(episodiosURL, temporadaActual, infoEpisodios);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    loadData();
});
