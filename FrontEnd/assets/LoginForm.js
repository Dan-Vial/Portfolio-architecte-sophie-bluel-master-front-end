import { RouteAchitectApi as route } from './RouteArchitectApi.js';

class LoginForm {
    mainId = document.getElementById('main');

    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.cssRules();
        this.html();
        this.js();
    }

    update(event) {
        this.properties.base.update(event);

        let testBool = false;
        if (event.type === 'load' || event.type === 'submit' || event.target.id === 'portfolio-nav' || event.target.id === 'contact-nav') {
            testBool = true;
        }

        this.properties.filter.update(event);
        this.loginSection.classList.toggle('hidden', testBool);
    }

    html() {
        this.loginSection = document.createElement('section');
        this.loginSection.setAttribute('class', 'login-form');

        this.loginForm = document.createElement('form');

        const title = document.createElement('h2');
        title.textContent = 'Log In';
        this.loginForm.appendChild(title);

        const emailLabel = document.createElement('label');
        emailLabel.setAttribute('for', 'email');
        emailLabel.textContent = 'E-mail';
        this.loginForm.appendChild(emailLabel);

        const emailInput = document.createElement('input');
        emailInput.setAttribute('type', 'email');
        emailInput.setAttribute('id', 'email-login');
        emailInput.setAttribute('name', 'email');
        // EmailInput.setAttribute('pattern', '');
        emailInput.setAttribute('required', '');
        emailInput.setAttribute('autocomplete', 'email');
        this.loginForm.appendChild(emailInput);

        const passwordLabel = document.createElement('label');
        passwordLabel.setAttribute('for', 'password-login');
        passwordLabel.textContent = 'Mot de passe';
        this.loginForm.appendChild(passwordLabel);

        const passwordInput = document.createElement('input');
        passwordInput.setAttribute('type', 'password');
        passwordInput.setAttribute('id', 'password-login');
        passwordInput.setAttribute('name', 'password');
        passwordInput.setAttribute('required', '');
        passwordInput.setAttribute('autocomplete', 'current-password');
        this.loginForm.appendChild(passwordInput);

        this.submit = document.createElement('input');
        this.submit.setAttribute('type', 'submit');
        this.submit.setAttribute('value', 'Se connecter');
        this.submit.setAttribute('class', 'filter-btn');

        this.loginForm.appendChild(this.submit);

        const mdpo = document.createElement('a');
        mdpo.setAttribute('href', '#');
        mdpo.textContent = 'Mot de passe oublié';
        this.loginForm.appendChild(mdpo);

        this.loginSection.classList.toggle('hidden');
        this.loginSection.classList.add('login');

        this.loginSection.appendChild(this.loginForm);
        this.properties.fragment.appendChild(this.loginSection);
        this.mainId.appendChild(this.properties.fragment);
    }

    js() {
        const emailId = this.loginForm.querySelector('#email-login');
        const passwordId = this.loginForm.querySelector('#password-login');
        emailId.addEventListener('change', () => {
            this.submit.setCustomValidity('');
        });
        passwordId.addEventListener('change', () => { this.submit.setCustomValidity(''); });

        this.loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (this.properties.reportValidityInForm(event.target)) {
                const response = await route.postUsersLogin(emailId.value, passwordId.value),
                    repJs = await response.json();

                if (typeof repJs.message === 'undefined' && typeof repJs.error === 'undefined') {
                    repJs.timestamp = Date.now();
                    delete repJs.userId;
                    localStorage.setItem('sessionUser', JSON.stringify(repJs));
                    this.update(event);
                    this.properties.nav.update(event);

                    document.location.hash = '';
                    const url = new URL(location);
                    history.replaceState({}, '', url);
                }
                else {
                    this.submit.setCustomValidity('error: e-mail and password');
                    this.submit.reportValidity();
                }
            }
        });
    }

    cssRules() {
        this.properties.sheet.insertRule(`.login-form form { 
            display: flex;
            flex-direction: column;
            width: 33.33%;
            margin: auto;
        }`);

        this.properties.sheet.insertRule(`.login-form input, 
        #form-project input,
        #form-project select { 
            height: 50px;
            font-size: 1.2em;
            border: none;
            box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.09);
        }`);

        this.properties.sheet.insertRule(`.login-form label, #form-project label { 
            margin: 2em 0 1em 0;
        }`);

        this.properties.sheet.insertRule(`.login-form h2, .login-form a { 
            margin-bottom: 20px;
            text-align: center;
        }`);
    }
}

export {
    LoginForm,
};
