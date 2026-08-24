const loggedOut = document.getElementById('logged-out');
const loggedIn = document.getElementById('logged-in');
const userEmail = document.getElementById('user-email');

const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const logoutButton = document.getElementById('logout-button');

const dialog = document.getElementById('auth-dialog');
const form = document.getElementById('auth-form');
const title = document.getElementById('auth-title');
const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const error = document.getElementById('auth-error');
const cancelButton = document.getElementById('auth-cancel');

let authMode = 'login';

function openAuthDialog(mode) {
    authMode = mode;

    title.textContent = mode === 'login'
        ? 'Log in'
        : 'Sign up';

    error.textContent = '';

    emailInput.value = '';
    passwordInput.value = '';

    dialog.showModal();
}

loginButton.addEventListener('click', () => {
    openAuthDialog('login');
});

signupButton.addEventListener('click', () => {
    openAuthDialog('signup');
});

cancelButton.addEventListener('click', () => {
    dialog.close();
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    error.textContent = '';

    const email = emailInput.value;
    const password = passwordInput.value;

    let result;

    if (authMode === 'login') {
        result = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
    } else {
        result = await supabaseClient.auth.signUp({
            email,
            password
        });
    }

    if (result.error) {
        error.textContent = result.error.message;
        return;
    }

    dialog.close();
    updateUserControl();
});

logoutButton.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    updateUserControl();
});

async function updateUserControl() {
    const { data: { user } } =
        await supabaseClient.auth.getUser();

    if (user) {
        loggedOut.style.display = 'none';
        loggedIn.style.display = 'flex';

        userEmail.textContent = user.email;
    } else {
        loggedOut.style.display = 'flex';
        loggedIn.style.display = 'none';
    }
}

updateUserControl();