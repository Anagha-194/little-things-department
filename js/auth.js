
// =============================================
// THE LITTLE THINGS DEPARTMENT
// USER AUTHENTICATION
// =============================================


// GET HTML ELEMENTS

const authScreen = document.getElementById("authScreen");

const loginForm = document.getElementById("loginForm");

const signupForm = document.getElementById("signupForm");

const showSignupButton = document.getElementById("showSignup");

const showLoginButton = document.getElementById("showLogin");

const authMessage = document.getElementById("authMessage");


// SHOW LOGIN FORM

showLoginButton.addEventListener("click", function () {

    signupForm.hidden = true;
    loginForm.hidden = false;

    authMessage.textContent = "";

});


// SHOW SIGNUP FORM

showSignupButton.addEventListener("click", function () {

    loginForm.hidden = true;
    signupForm.hidden = false;

    authMessage.textContent = "";

});


// SHOW THE CORRECT SCREEN BASED ON LOGIN STATUS

function updateAuthenticationScreen(session) {

    if (session) {
        authScreen.style.display = "none";
    } else {
        authScreen.style.display = "flex";
    }

}


// CHECK EXISTING LOGIN SESSION

async function checkSession() {

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        authMessage.textContent = error.message;
        return;
    }

    updateAuthenticationScreen(data.session);

}


// LISTEN FOR LOGIN AND LOGOUT CHANGES

supabaseClient.auth.onAuthStateChange(function (event, session) {

    updateAuthenticationScreen(session);

});


// SIGN UP

signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("signupEmail").value.trim();

    const password = document.getElementById("signupPassword").value;

    authMessage.textContent = "Creating your account...";

    const { data, error } = await supabaseClient.auth.signUp({

        email: email,

        password: password,

        options: {
            emailRedirectTo: "window.location.origin" // Change this to your app's URL
        }

    });


    if (error) {

        authMessage.textContent = error.message;

        return;

    }


    if (data.session) {

        authMessage.textContent = "Account created successfully!";

    } else {

        authMessage.textContent =
            "Check your email to confirm your account before signing in.";

    }

});


// LOG IN

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    const password = document.getElementById("loginPassword").value;

    authMessage.textContent = "Signing you in...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({

        email: email,

        password: password

    });


    if (error) {

        authMessage.textContent = error.message;

        return;

    }


    authMessage.textContent = "Welcome back!";

    updateAuthenticationScreen(data.session);

});


// INITIALIZE AUTHENTICATION

checkSession();
