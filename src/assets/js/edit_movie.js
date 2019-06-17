(function() {
    ////////// CONSTANTS
    /* ========================= */
    /*           INIT            */           
    /* ========================= */

    const btnAddComment = document.getElementById('add-comment');


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
        formData.append('idMovie', location.href.split('/').pop())
        const options = {
            method: 'POST',
            body: formData
        }

        sendAjax(url, options)
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

        handleResp(res, target)
    }

    function editMovie() {

    }

    function dataMovie() {
        const url = `/peliculas/editar/${location.href.split('/').pop()}`

        sendAjax(url)
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
    }
    
    ////////// LISTENERS
    /* ========================= */
    /*           INIT            */           
    /* ========================= */

    /* ========================= */
    /*            END            */           
    /* ========================= */
    
    })();