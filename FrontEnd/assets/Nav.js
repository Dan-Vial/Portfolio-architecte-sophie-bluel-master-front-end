class Nav {
    loginId = document.querySelector('#login-nav');
    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.cssRules();
        this.js();

        if (this.properties.isSessionUser()) {
            this.loginId.textContent = 'logout';
        }
        else {
            this.loginId.textContent = 'login';
        }
    }

    update(event) {
        if (event.target.id === 'login-nav' && event.target.textContent === 'logout') {
            this.loginId.classList.toggle('nav-btn-selected', false);
            localStorage.removeItem('sessionUser');
        }

        if (this.properties.isSessionUser()) {
            this.loginId.textContent = 'logout';
        }
        else {
            this.loginId.textContent = 'login';
        }

        for (const elm of event.target.parentNode.children) {
            elm.classList.toggle('nav-btn-selected', false);
        }

        event.target.classList.toggle('nav-btn-selected', true);

        location.href = `#${event.target.id.split('-')[0]}`;
        const url = new URL(location);
        history.replaceState({}, '', url);

        this.properties.base.update(event);
        this.properties.loginForm.update(event);
        this.properties.modifierBtn.update(event);
    }

    js() {
        [...document.querySelector('#nav').children].forEach((value) => {
            if (value.id !== '') {
                value.addEventListener('click', this.update.bind(this));
            };
        });
    }

    cssRules() {
        this.properties.sheet.insertRule(`.nav-btn-selected { 
            font-weight: 600;
        }`);
    }
}

export {
    Nav,
};
