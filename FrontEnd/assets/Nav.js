class Nav {
    loginId = document.querySelector('#login-nav');
    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.cssRules();
        this.js();
    }

    update(event) {
        const switchStatConnected = (elem, testBool) => {
                this.properties.base.introductionId.classList.toggle('hidden', testBool);
                this.properties.base.portfolioId.classList.toggle('hidden', testBool);
                this.properties.base.contactId.classList.toggle('hidden', testBool);
                this.properties.loginForm.loginSection.classList.toggle('hidden', !testBool);

                for (const elm of elem.parentNode.children) {
                    elm.classList.toggle('nav-btn-selected', false);
                }

                elem.classList.toggle('nav-btn-selected', true);
                location.href = `#${elem.id.split('-')[0]}`;
            },

            switchStatModeEdit = (elem, tesstBool, nameString) => {
                this.properties.filter.filterId.classList.toggle('hidden', tesstBool);
                this.properties.modifierBtn.modeEditId.classList.toggle('hidden', !tesstBool);
                document.querySelector('.menu-edit-title').classList.toggle('hidden', !tesstBool);
                elem.textContent = nameString;
            };

        if (event.target.id === 'portfolio-nav' || event.target.id === 'contact-nav') {
            switchStatConnected(event.target, false);
        }
        else if (!localStorage.getItem('sessionUser')) {
            switchStatConnected(this.loginId, true);
            switchStatModeEdit(this.loginId, false, 'Login');
        }
        else {
            switchStatConnected(this.loginId, false);
            if (this.loginId.textContent === 'Logout') {
                switchStatModeEdit(this.loginId, false, 'Login');
                this.loginId.classList.toggle('nav-btn-selected', false);
                localStorage.removeItem('sessionUser');
                document.location.hash = '';
            }
            else {
                switchStatModeEdit(this.loginId, true, 'Logout');
            }
        }
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
