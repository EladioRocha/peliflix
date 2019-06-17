(function() {
////////// CONSTANTS
/* ========================= */
/*           INIT            */           
/* ========================= */

// REGISTER
const btnNextModal = document.getElementById('next-modal'),
    btnSignup = document.getElementById('signup'),
    inpRegisterFirstName = document.getElementById('register-first-name'),
    inpRegisterLastName = document.getElementById('register-last-name'),
    inpRegisterEmail = document.getElementById('register-email'),
    inpRegisterPassword = document.getElementById('register-password'),
    inpRetypePassword = document.getElementById('retype-password'),
    inpRegisterAddress = document.getElementById('register-address'),
    inpRegisterTelephone = document.getElementById('register-telephone'),
    inpRegisterBirthdate = document.getElementById('birthdate'),
    selectGender = document.getElementById('gender');

// LOGIN

const btnLogin = document.getElementById('login'),
    inpLoginEmail = document.getElementById('login-email'),
    inpLoginPassword = document.getElementById('login-password');

const inpSearcher = document.getElementById('searcher'),
    totalMovies = document.getElementById('total-movies'),
    content = document.getElementById('content');

/* ========================= */
/*            END            */           
/* ========================= */

////////// FUNCTIONS
/* ========================= */
/*           INIT            */           
/* ========================= */
function generateNewModal (e) {
    const data = {};
    result = emptyFields()
    if(result.newModal) {
        data.firstName = inpRegisterFirstName.value,
        data.lastName = inpRegisterLastName.value,
        data.address = inpRegisterAddress.value,
        data.password = inpRegisterPassword.value
    }

    return data
}

function emptyFields () {
    const data = {
        newModal: true, 
        error: false
    }

    if(inpRegisterFirstName.value.trim('') === '' || inpRegisterLastName.value.trim('') === '' || inpRegisterAddress.value.trim('') === '' || inpRegisterPassword.value.trim('') === '' || inpRetypePassword.value.trim('') === '') {
        data.error = true
        data.newModal = false
    } else {
        inpRegisterFirstName.type = 'hidden'
        inpRegisterLastName.type = 'hidden'
        inpRegisterAddress.type = 'hidden'
        inpRegisterPassword.type = 'hidden'
        inpRetypePassword.parentNode.parentNode.classList = 'hidden'
        btnNextModal.classList = 'hidden'
        inpRegisterEmail.type = 'email'
        inpRegisterTelephone.type = 'text'
        inpRegisterBirthdate.type = 'date'
        selectGender.classList = ''
        btnSignup.classList = ''
        changeTextSpanInput()
    }

    if(data.error) {
        alertify.alert('Aviso', 'Hay campos vacios!');
    }

    return data
}

function changeTextSpanInput () {
    const spanInput = document.getElementsByClassName('span-input')
    const text = ['Correo', 'Telefono', 'Fecha de nacimiento', 'Género']

    for(let i = 0; i < spanInput.length; i++) {
        spanInput[i].innerText = text[i]
    }
}

async function registerUser (e) {
    let data = {}
    const url = '/usuarios/registro'

    if(inpRegisterAddress.value.trim('') === '' || inpRegisterTelephone.value.trim('') === '' || inpRegisterBirthdate.value.trim('') === '') {
        alertify.alert('Aviso', 'Hay campos vacios!');
    } else {
        data = generateNewModal(e)
        data.email = inpRegisterEmail.value
        data.telephone = inpRegisterTelephone.value
        data.birthdate = inpRegisterBirthdate.value
        data.gender = selectGender.value
        options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"}
        }
        const resp = await sendAjax(url, options),
        result = await resp.json();

        if(result.alert === 'Ya existe el correo electronico intente con otro') {
            alertify.alert('Aviso', result.alert);
        } else {
            window.location = '/'
        }
    }
}

async function sendAjax(url, options) {
    const resp = await fetch(url, options);

    return resp
}

async function login() {
    const url = '/usuarios/entrar',
        data = {
            email: inpLoginEmail.value,
            password: inpLoginPassword.value
        },
        options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"}
        }

    const resp = await sendAjax(url, options),
        result = await resp.json();

    if(result.alert === 'Los campos ingresados son invalidos') {
        alertify.alert('Aviso', result.alert)
    } else {
        window.location = '/'
    }
}

async function searchData(e) {
    if(e.key === 'Enter') {
        const url = `${getSelectedValue()}?valor=${e.target.value}&tipo=${document.getElementById('select-searcher').value}`
        console.log(url)
        const data = await sendAjax(url)
        const result = await data.json()
        console.log(result)
        showData(result)
    }
}

function showData(data) {
    switch(data.type) {
        case 'Pelicula':
            addMovieToScreen(data.rows)
        break;
        case 'Actor':
            addActorToScreen(data.rows)
        break;
        case 'Productor':
            addProductorToScreen(data.rows)
        break;
        case 'Director':
            addDirectorToScreen(data.rows)
        break;
        case 'peliculas_favoritas':
            addFavoriteMovies(data.rows)
        break;
    }
}

function addMovieToScreen(data) {
    content.innerHTML = ''
    totalMovies.innerHTML = `${data.length} película(s)` 
    for(info of data) {
        content.innerHTML += `
            <div class="movie-item-style-2 movie-item-style-1">
                <img src="/static/img/posters/${info.fotoPoster}" alt="Poster de asd">
                <div class="hvr-inner">
                    <a href="/peliculas/${info.idPelicula}"> Leer más <i class="ion-android-arrow-dropright"></i> </a>
                </div>
                <div class="mv-item-infor">
                    <h6><a href="#">${info.nombrePelicula}</a></h6>
                </div>
            </div>
        `
    }
}

function addActorToScreen(data) {
    content.innerHTML = ''
    totalMovies.innerHTML = `${data.length} actor(es)` 
    for(info of data) {
        content.innerHTML += 
        `<div class="col-md-4">
            <div class="ceb-item-style-2">
                <div class="ceb-infor">
                    <h2><a>${info.nombreActor} ${info.apellidoActor}</a></h2>
                    <p>${info.Biografia}</p>
                </div>
            </div>
        </div>`
    }
}

function addProductorToScreen(data) {
    content.innerHTML = ''
    totalMovies.innerHTML = `${data.length} productor(es)`
    for(info of data) {
        content.innerHTML += 
        `<div class="col-md-4">
            <div class="ceb-item-style-2">
                <div class="ceb-infor">
                    <h2><a>${info.nombreProductor}</a></h2>
                </div>
            </div>
        </div>`
    }
}

function addDirectorToScreen(data) {
    content.innerHTML = ''
    totalMovies.innerHTML = `${data.length} director(es)` 
    for(info of data) {
        content.innerHTML += 
        `<div class="col-md-4">
            <div class="ceb-item-style-2">
                <div class="ceb-infor">
                    <h2><a>${info.nombreDirector} ${info.apellidoDirector}</a></h2>
                </div>
            </div>
        </div>`
    }
}

function addFavoriteMovies(data) {
   content.innerHTML = ''
    totalMovies.innerHTML = `${data.length} película(s)` 
    for(info of data) {
        content.innerHTML += `
            <div class="movie-item-style-2 movie-item-style-1">
                <img src="/static/img/posters/${info.fotoPoster}" alt="Poster de asd">
                <div class="hvr-inner">
                    <a href="/peliculas/${info.idPelicula}"> Leer más <i class="ion-android-arrow-dropright"></i> </a>
                </div>
                <div class="mv-item-infor">
                    <h6><a href="#">${info.nombrePelicula}</a></h6>
                </div>
            </div>
        `
    }
}

function getSelectedValue() {
    const selectSearcher = document.getElementById('select-searcher').value
    let url = ''
    switch(selectSearcher) {
        case 'Pelicula':
            url = '/peliculas/buscar/titulo'
        break
        case 'Actor':
            url = '/peliculas/buscar/actor'
        break
        case 'Productor':
            url = '/peliculas/buscar/productor'
        break
        case 'Director':
            url = '/peliculas/buscar/director'
        break
        case 'peliculas_favoritas':
            url = '/peliculas/buscar/favorita'
        break
    }

    return url
}

function hideSearcher() {
    if(location.href.split('/').filter(el => el != '').length > 2) {
        document.getElementById('select-searcher').parentNode.classList += ' hide'
    }
}
/* ========================= */
/*            END            */           
/* ========================= */


////////// LISTENERS
/* ========================= */
/*           INIT            */           
/* ========================= */
if(btnNextModal) {
    btnNextModal.addEventListener('click', generateNewModal)
}
if(btnSignup) {
    btnSignup.addEventListener('click', registerUser)
}
if(btnLogin) {
    btnLogin.addEventListener('click', login)
}
inpSearcher.addEventListener('keydown', searchData)
document.addEventListener('DOMContentLoaded', hideSearcher)
/* ========================= */
/*            END            */           
/* ========================= */

})();