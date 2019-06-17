(function() {
    ////////// CONSTANTS
    /* ========================= */
    /*           INIT            */           
    /* ========================= */

    const btnAddMovie = document.getElementById('add_movie'),
        btnEditMovie = document.getElementById('edit-movie');

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
    function addMovie(e) {
        e.preventDefault();
        const formData = new FormData(),
            url = '/peliculas/agregar';
        formData.append('title', document.getElementById('title').value)
        formData.append('category', document.getElementById('categories').value)
        formData.append('director', document.getElementById('directors').value)
        formData.append('actor', document.getElementById('actors').value)
        formData.append('productor', document.getElementById('productors').value)
        formData.append('summary', document.getElementById('summary').value)
        formData.append('poster', document.getElementById('poster').files[0], 'poster.png')

        const options = {
            method: 'POST',
            body: formData
        };
        sendAjax(url, options)
    }

    function editMovie(e) {
        e.preventDefault();
        const formData = new FormData(),
            url = '/peliculas/editar';
        formData.append('title', document.getElementById('title').value)
        formData.append('category', document.getElementById('categories').value)
        formData.append('director', document.getElementById('directors').value)
        formData.append('actor', document.getElementById('actors').value)
        formData.append('productor', document.getElementById('productors').value)
        formData.append('summary', document.getElementById('summary').value)
        formData.append('poster', document.getElementById('poster').files[0], 'poster.png')
        formData.append('id', location.href.split('/').pop())
        const options = {
            method: 'PUT',
            body: formData
        };
        sendAjax(url, options)

    }

    async function sendAjax(url, options) {
        const resp = await fetch(url, options)
        const result = await resp.json()

        alertify.notify(result.alert, result.status)
    }
    
    ////////// LISTENERS
    /* ========================= */
    /*           INIT            */           
    /* ========================= */
    if(btnAddMovie) {
        btnAddMovie.addEventListener('click', addMovie)
    }
    if(btnEditMovie) {
        btnEditMovie.addEventListener('click', editMovie)
    }
    /* ========================= */
    /*            END            */           
    /* ========================= */
    
    })();