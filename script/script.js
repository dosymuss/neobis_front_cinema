const API_KEY = "d036e548-d088-4348-a734-1f925560ca91"
const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1"
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword="
const API_URL_MONTH_PREMIER = "https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2023&month=APRIL"
const API_URL_DIGITAL = "https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=2023&month=APRIL&page=1"
const API_URL_EXPECTED = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=ALL&ratingFrom=8&ratingTo=10&yearFrom=2023&yearTo=2024&page=1"

//вызовы функций запросов
getMovies(API_URL_POPULAR)
getMoviesMonth(API_URL_MONTH_PREMIER)
getMoviesDigital(API_URL_DIGITAL)
getMoviesExpected(API_URL_EXPECTED)

async function fetchMovies(url){
    const response = await fetch(url, {
        headers: {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
        }
    })
    const respData = await response.json()
    return respData
}


async function getMovies(url) {
    const response = await fetchMovies(url)
    showMovies("top", response.films)
    // проверка на локалсторадже
    localStorageChek()
    checkHeart()

}

async function getMoviesMonth(url) {
    const response = await fetchMovies(url)
    showMovies("month", response.items)
    // проверка на локалсторадже
    localStorageChek()
    checkHeart()

}

async function getMoviesDigital(url) {
    const response = await fetchMovies(url)
    showMovies("digital", response.releases)
    // проверка на локалсторадже
    localStorageChek()
    checkHeart()

}
async function getMoviesExpected(url) {
    const response = await fetchMovies(url)
    showMovies("expected", response.items)
    // проверка на локалсторадже
    localStorageChek()
    checkHeart()

}






// проверка рэйтинга
function getClassByRating(vote) {
    if (vote >= 7) {
        return "green"
    }
    else if (vote > 5) {
        return "orange"
    }
    else {
        return "red"
    }
}

const form = document.querySelector("form")
const search = document.querySelector(".header__search")
const container = document.querySelector("#movie-container")
form.addEventListener("submit", (event) => {
    event.preventDefault()
    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`
    if (search.value) {
        container.innerHTML=""
        getMoviesSearch(apiSearchUrl)
    }
    search.value = ""
})

async function getMoviesSearch(url) {
    const response = await fetchMovies(url)
    showMovies("container", response.films)
    // проверка на локалсторадже
    localStorageChek()
    checkHeart()

}

function showMovies(section,data) {
    const moviesEl = document.querySelector(`#movie-${section}`)

    // удаление старрых данных на странице
    // document.querySelector(".movies").innerHTML = ``

    // цикл и создание элементов
    const movie = data

    for (let i = 0; i < movie.length; i++) {
        const movieEl = document.createElement("div")
        movieEl.classList.add("movie")
        // создание элемента
        movieEl.innerHTML = `
            <div class="movie__cover-inner">
                        <img src="${movie[i].posterUrlPreview}"
                            alt="${movie[i].nameRu}" class="movie_cover">
                    </div>
                    <div class="movie__cover--darkened"></div>
                    <div class="movie-info">
                        <div class="movie__title">${movie[i].nameRu}</div>
                        <div class="movie__year">${movie[i].year}</div>
                        <div class="movie__category">
                        <p class="movie-category__p">${movie[i].genres.map((genre) => `${genre.genre}`)}</p>
                        </div>
                        <div class="movie__average movie__avarage--${getClassByRating(movie[i].rating)}">${movie[i].rating}</div>
                        <div class="movie__heart"> 
                        <p class="situation">Not</p>
                        <button  class="heart-button-notClick">
                        <img class="movie__heart-img" src="./img/redHeart.png" alt="">
                        </button>
                        </div>
                    </div>`

        moviesEl.appendChild(movieEl)
        // условие для остановки цикла
        if (i == 9) {
            break
        }
    }


}


function checkHeart() {
    // поиск всех кнопок
    const heartBtnsNot = document.querySelectorAll(".heart-button-notClick")

    for (i = 0; i < heartBtnsNot.length; i++) {
        heartBtnsNot[i].addEventListener("click", (event) => {
            // родительский div кнопки
            const parentDivInfo = event.target.closest(".movie-info")

            const situation = parentDivInfo.querySelector(".situation")

            const btn = parentDivInfo.querySelector(".heart-button-notClick")
            // нахождение имени фильма
            const movieName = parentDivInfo.querySelector(".movie__title").textContent


            if (situation.textContent == "Not") {
                situation.textContent = "Yes"
                // удаление кнопки
                btn.remove()
                // создание новой и вызов функции добавления локал
                const btnWrap = parentDivInfo.querySelector(".movie__heart")

                const newBtn = document.createElement("button")
                newBtn.classList.add("heart-button-click")
                const newHeart = document.createElement("img")
                newHeart.setAttribute("src", "./img/redHeart2.png")
                newBtn.insertAdjacentElement("afterbegin", newHeart)
                btnWrap.insertAdjacentElement("beforeend", newBtn)

                saveLocal(movieName)
            }
        })

    }
    // тоже самое для кнопки с изменением и вызова функции удаления локал
    const heartBtns = document.querySelectorAll(".heart-button-click")

    for (i = 0; i < heartBtns.length; i++) {
        heartBtns[i].addEventListener("click", (event) => {
            const parentDivInfo = event.target.closest(".movie-info")

            const situation = parentDivInfo.querySelector(".situation")

            const btn = parentDivInfo.querySelector(".heart-button-click")

            const movieName = parentDivInfo.querySelector(".movie__title").textContent

            if (situation.textContent == "Yes") {
                situation.textContent = "Not"

                btn.remove()

                const btnWrap = parentDivInfo.querySelector(".movie__heart")
                const newBtn = document.createElement("button")
                newBtn.classList.add("heart-button-notClick")
                const newHeart = document.createElement("img")
                newHeart.setAttribute("src", "./img/redHeart.png")
                newBtn.insertAdjacentElement("afterbegin", newHeart)
                btnWrap.insertAdjacentElement("beforeend", newBtn)

                deleteLocal(movieName)
            }
        })

    }
    function saveLocal(name) {
        localStorage.setItem(name, JSON.stringify(name))

    }

    function deleteLocal(name) {
        localStorage.removeItem(name)
    }
}

// функция проверки localStorage
function localStorageChek() {
    const localMovies = []

    // цикл для вывода значений локалсторедж
    const localStorageSize = window.localStorage.length
    for (let i = 0; i < localStorageSize; i++) {
        let localMovie = JSON.parse(localStorage.getItem(localStorage.key(i)))
        localMovies.push(localMovie)
    }

    const movieName = document.querySelectorAll(".movie__title")
    
    for (let i = 0; i < movieName.length; i++) {
        // console.log(movieName[i].textContent)
        if (localMovies.includes(movieName[i].textContent)) {
            const parentDivInfo = movieName[i].closest(".movie-info")
            const btn = parentDivInfo.querySelector(".heart-button-notClick")
            const situation = parentDivInfo.querySelector(".situation")
            // если имя и имя в localStorage совпадают то удаляем кнопку и делаем новую
            btn.remove()
            situation.textContent = "Yes"
            const btnWrap = parentDivInfo.querySelector(".movie__heart")
            const newBtn = document.createElement("button")
            newBtn.classList.add("heart-button-click")
            const newHeart = document.createElement("img")
            newHeart.setAttribute("src", "./img/redHeart2.png")
            newBtn.insertAdjacentElement("afterbegin", newHeart)
            btnWrap.insertAdjacentElement("beforeend", newBtn)
        }

    }

}





























