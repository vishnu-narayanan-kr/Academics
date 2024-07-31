const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const errorMessage = document.getElementById("error-message");

// to be done from the back-end
const user = {
    username: 'batman@gotham.com',
    password: '123456789'
}

window.onLogin = () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if(!isValidInputs()) {
        return;
    }

    if (username === user.username && password === user.password) {
        window.location.href = "main.html";
    } else {
        errorMessage.innerText = "Wrong username or password!";
    }
}

const isValidInputs = () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidUsername = emailRegex.test(username);

    if(!isValidUsername) {
        errorMessage.innerText = "Invalid username syntax!";
        return false;
    }

    if(password.length < 8) {
        errorMessage.innerText = "Passwords must be minimum 8 characters long!";
        return false;
    }

    return true;
}
