(function() {
    ////////// CONSTANTS
    /* ========================= */
    /*           INIT            */           
    /* ========================= */
    
    const btnChangePassword = document.getElementById('change'),
        btnChangeProfile = document.getElementById('change-profile'),
        inpCurrentPassword = document.getElementById('current-password'),
        inpNewPassword = document.getElementById('new-password'),
        inpConfirmNewPassword = document.getElementById('confirm-new-password');

    let btnPrivacity = null 
    if (document.getElementById('privacity')) {
        btnPrivacity = document.getElementById('privacity').children[0];
    }

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
    function changePassword (e) {
        e.preventDefault();
        if(validFieldsPassword()) {
            const formData = new FormData(),
                url = '/usuarios/contrasenia'

            formData.append('currentPassword', inpCurrentPassword.value)
            formData.append('newPassword', inpNewPassword.value)
            const options = {
                method: 'POST',
                body: formData
            }
            sendAjax(url, options)
        }
    }

    function changeProfile (e) {
        e.preventDefault()
        const formData = new FormData(),
        url = '/usuarios/editar';

        formData.append('email', document.getElementById('email').value)
        formData.append('address', document.getElementById('address').value)
        formData.append('telephone', document.getElementById('telephone').value)
        formData.append('gender', document.getElementById('gender').value)

        const options = {
            method: 'PUT',
            body: formData
        }
        sendAjax(url, options)
    }

    function validFieldsPassword () {
        if(inpCurrentPassword.value.trim() === '' && inpNewPassword.value.trim() === '' && inpConfirmNewPassword.value.trim() === '') {
            alertify.alert('Aviso', 'Hay campos vacios!')
            return false
        } else if(inpNewPassword.value !== inpConfirmNewPassword.value) {
            alertify.alert('Aviso', 'Las contraseñas no coinciden')
            return false
        }
        return true
    }

    async function sendAjax(url, options) {
        const resp = await fetch(url, options),
            res = await resp.json()
        
        handleResp(res)
    }

    function setPrivacity (e) {
        const formData = new FormData(),
        url = '/usuarios/editar/favoritas';
        formData.append('id', e.target.id)
        if(e.target.nextElementSibling.innerText === 'Pública') {
            formData.append('privacity', false)
            e.target.classList = 'ion-eye-disabled cursor'
            e.target.nextElementSibling.innerText = 'Privada'
        } else {
            formData.append('privacity', true)
            e.target.classList = 'ion-eye cursor'
            e.target.nextElementSibling.innerText = 'Pública'
        }
        
        const options = {
            method: 'PUT',
            body: formData
        }
        sendAjax(url, options)
    }

    function handleResp(res) {
        alertify.alert(res.alert)
    }
    
    ////////// LISTENERS
    /* ========================= */
    /*           INIT            */           
    /* ========================= */
    if(btnChangePassword) {
        btnChangePassword.addEventListener('click', changePassword)
    }
    if(btnChangeProfile) {
        btnChangeProfile.addEventListener('click', changeProfile)
    }
    if(btnPrivacity) {
        btnPrivacity.addEventListener('click', setPrivacity)
    }
    /* ========================= */
    /*            END            */           
    /* ========================= */
    
    })();