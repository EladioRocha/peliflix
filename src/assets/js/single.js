(function() {
    ////////// CONSTANTS
    /* ========================= */
    /*           INIT            */           
    /* ========================= */

    const btnAddComment = document.getElementById('add-comment'),
        btnAddFavorite = document.getElementById('add-favorite'),
        btnDelete = document.getElementById('delete-movie');
    
    const stars = document.getElementsByClassName('star')


    /* ========================= */
    /*            END            */           
    /* ========================= */
    
    ////////// FUNCTIONS
    /* ========================= */
    /*           INIT            */           
    /* ========================= */

    /* ========================= */
    /*            END            */           
    /* ========================= */
    function addComment(e) {
        e.preventDefault();
        const formData = new FormData(),
            url = '/peliculas/agregar/comentario';
        formData.append('comment', document.getElementById('comment').value)
        formData.append('idMovie', location.href.split('#')[0].split('/').pop())
        const options = {
            method: 'POST',
            body: formData
        }

        sendAjax(url, options)
        const numComments = document.getElementById('num-comments')
        let value = parseInt(numComments.innerText.split('')[0])
        numComments.innerText = `${value + 1} comentario(s)` 
    }

    function addFavorite(e) {
        e.preventDefault()
        const formData = new FormData(),
            url = '/peliculas/agregar/favorita'

        formData.append('id', location.href.split('/').pop())

        const options = {
            method: 'POST',
            body: formData
        } 
        sendAjax(url, options, e.target)
    }

    async function sendAjax(url, options, target) {
        const resp = await fetch(url, options),
            res = await resp.json()


        return handleResp(res, target)
    }

    function deleteMovie() {
        const formData = new FormData(),
            url = '/peliculas/eliminar'

        formData.append('id', location.href.split('/').pop())

        const options = {
            method: 'delete',
            body: formData
        }  

        sendAjax(url, options)
    }

    function handleResp (resp, target) {
        if(target && resp.status === 'success') {
            target.parentNode.innerText = 'Añadida a favoritos'
        } else if (resp.status !== 'error' && resp.comment){
            document.getElementById('user-comment').innerHTML += `
            <div class="mv-user-review-item">
            <div class="user-infor">
                <div>
                    <h3>Título de la opinión</h3>
                    <p class="time">
                        <a href="#">Tú comentario</a>
                    </p>
                </div>
            </div>
                <p>${document.getElementById('comment').value}.</p>
            </div>
            `
        } else {
            if (resp.alert === 'Película eliminada exitosamente') {
                setTimeout(() => location.replace('/'), 3000)
            }
        }
        alertify.notify(resp.alert, resp.status, 5);
        
        return (resp.status === 'error') ? false : true
    }
    
    async function addStar(e) {
        const formData = new FormData(),
            url = '/peliculas/calificacion'

        formData.append('id', location.href.split('/').pop())
        formData.append('score', e.target.id.split('-').pop())

        const options = {
            method: 'POST',
            body: formData
        }  

        if(await sendAjax(url, options)) {
            fillStars(e.target)
        }
    }

    function fillStars(score) {
        for(star of stars) {
            if(star.classList.value === 'ion-ios-star-outline star') {
                if(star.id <= score.id) {
                    star.classList = 'ion-ios-star star'
                }
            } else {
                if(star.id > score.id) {
                    star.classList = 'ion-ios-star-outline star'
                } 
            }
        }
    }
    ////////// LISTENERS
    /* ========================= */
    /*           INIT            */           
    /* ========================= */
    if(btnAddComment) {
        btnAddComment.addEventListener('click', addComment)
    }
    if(btnAddFavorite) {
        btnAddFavorite.addEventListener('click', addFavorite)
    }
    if(btnDelete) {
        btnDelete.addEventListener('click', deleteMovie)
    }

    document.addEventListener('DOMContentLoaded', () => {
        for(star of stars) {
            star.addEventListener('click', addStar)
        }
    })
    /* ========================= */
    /*            END            */           
    /* ========================= */
    
    })();