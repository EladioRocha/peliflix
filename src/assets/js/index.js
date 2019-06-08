(function() {
////////// CONSTANTS
/* ========================= */
/*           INIT            */           
/* ========================= */
const btnSignup = document.getElementById('signup'),
    inpRegisterFirstName = document.getElementById('register-first-name'),
    inpRegisterLastName = document.getElementById('register-last-name'),
    inpRegisterEmail = document.getElementById('register-email'),
    inpRegisterPassword = document.getElementById('register-password'),
    inpRetypePassword = document.getElementById('retype-password')
/* ========================= */
/*            END            */           
/* ========================= */

////////// FUNCTIONS
/* ========================= */
/*           INIT            */           
/* ========================= */
function generateNewModal (e) {
    if(inpRegisterFirstName.value.trim('') === '' || inpRegisterLastName.value.trim('') === '' || inpRegisterEmail.value.trim('') === '' || inpRegisterPassword.value.trim('') === '' || inpRetypePassword.value.trim('') === '') {
        alertify.alert('Hay campos vacios!');
    }
}
/* ========================= */
/*            END            */           
/* ========================= */


////////// LISTENERS
/* ========================= */
/*           INIT            */           
/* ========================= */
btnSignup.addEventListener('click', generateNewModal);
/* ========================= */
/*            END            */           
/* ========================= */
})();