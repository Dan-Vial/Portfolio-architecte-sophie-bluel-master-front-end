'use strict';
// ----------------------------------------------------------------------------------------------------------------
document.addEventListener('securitypolicyviolation', console.error.bind(console));
document.addEventListener('DOMContentLoaded', DOMLoaded, true);
window.addEventListener('load', AllLoaded, true);

async function DOMLoaded(event) {
    console.log('DOMLoaded.');
}

async function AllLoaded(event) {
    console.log('AllLoaded.');
    try {
        const app = new App({
            protocol: 'http',
            host: 'localhost',
            port: '5678',
        });

        app.addModule(Base, Filter, Gallery, LoginNav);
        app.addModule(LoginForm, ContactNav, ProjetsNav, ModifierBtn);
        app.addModule(Modal, ModalGallery, ModalAddPhoto);

        if (localStorage.getItem('sessionUser')) {
            // app.postUsersLogin('', '');
            app.loginNav.update(event);
        }
    } catch (error) {
        console.log('/*** APP error ***/\n', error);
    }
}
// ----------------------------------------------------------------------------------------------------------------
class App {
    constructor({ protocol, host, port }) {
        this.protocol = protocol;
        this.host = host;
        this.port = port;
        this.init();
    }

    init() {
        this.documentFragmentHtml();
        this.rangeHtml();
        this.styleSheetCss();
    }

    documentFragmentHtml() {
        this.fragment = new DocumentFragment();
    }

    rangeHtml() {
        this.range = document.createRange();

        this.sanitizer = trustedTypes.createPolicy("mysanitizer", {
            createHTML: input => input,
        });
    }

    styleSheetCss() {
        this.sheet = new CSSStyleSheet();
        document.adoptedStyleSheets = [this.sheet];
    }

    addModule(...classModule) {
        classModule.forEach(element => {
            if (typeof element === 'undefined') throw 'addModule arg empty.';
            let nameProperties = `${element.name[0].toLowerCase()}${element.name.slice(1)}`;
            if (typeof this[nameProperties] !== 'undefined') throw `classModule ${element.name} exist.`;
            this[nameProperties] = new element(this);
        });
    }

    addHtml(parent, stringHtml) {
        parent.appendChild(this.range.createContextualFragment(this.sanitizer.createHTML(stringHtml)));
    }

    /**
     * Architect API 1.0.0 default
     */
    async #get(routeName, opts = {}) {
        return await fetch(`${this.protocol}://${this.host}:${this.port}/api/${routeName}`, opts);
        // const reponse = await fetch(`${this.protocol}://${this.host}:${this.port}/api/${routeName}`, opts);
        // return await reponse.json();
    }

    async getCategories() {
        return await ((await this.#get('categories')).json());
        // return await this.#get('categories');
    }

    async getWorks() {
        return await ((await this.#get('works')).json());
        // return await  this.#get('works');
    }

    async postUsersLogin(email, password) {
        const sessionUser = localStorage.getItem('sessionUser');
        if (!sessionUser) {
            return await this.#get('users/login', {
                method: 'post',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
        } else {
            return await this.#get('users/login', {
                method: 'post',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(sessionUser).token}`
                }
            });
        }
    }

    // protected with token 
    async postWorks(data) {
        const sessionUser = localStorage.getItem('sessionUser');
        if (!sessionUser) throw 'Unauthorized post works.';
        return await this.#get('works', {
            method: 'post',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${sessionUser.token}`,
                'Content-Type': 'multipart/form-data'
            },
            body: JSON.stringify({
                data
            })
        });
        //data
        //   -F 'image=' \
        //   -F 'title=' \
        //   -F 'category='
    }

    // protected with token 
    async deleteWorksId(id) {
        const sessionUser = localStorage.getItem('sessionUser');
        if (!sessionUser) throw 'Unauthorized delete works.';
        return await this.#get(`works/${id}`, {
            method: 'delete',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${JSON.parse(sessionUser).token}`
            }
        });
    }
}

class Base {
    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.introductionId = document.getElementById('introduction');
        this.portfolioId = document.getElementById('portfolio');
        this.contactId = document.getElementById('contact');
        this.cssRules();
    }

    update() {

    }

    clear() {

    }

    html() {

    }

    js() {

    }

    cssRules() {
        this.color1 = '#1D6154';
        this.color2 = '#0E2F28';

        this.properties.sheet.insertRule(`html { 
            height: 100vh;
        }`);

        this.properties.sheet.insertRule(`body { 
            display: grid;
            grid-template-rows: auto 1fr auto;
            height: 100%;
        }`);

        this.properties.sheet.insertRule(`.hidden { 
            display: none !important;
        }`);
    }
}

class Filter {
    filterId = document.getElementById('menu-filter');

    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.cssRules();
        this.update();
    }


    async update() {
        this.clear();
        this.category.push({ id: 0, name: 'Tous' });

        [...await this.properties.getCategories()].forEach(element => {
            this.category.push(element);
        });

        this.html();
        this.js();
    }

    clear() {
        this.category = [];
        this.filterId.replaceChildren();
    }

    html() {
        this.category.forEach((element, index) => {
            const button = document.createElement('button');

            button.setAttribute('class', 'filter-btn');
            button.setAttribute('id', element.name.toLowerCase());

            if (index === 0) {
                button.classList.toggle('filter-btn-selected');
            }

            button.textContent = element.name;
            this.properties.fragment.appendChild(button);
        });
        this.filterId.appendChild(this.properties.fragment);
    }

    js() {
        const buttonList = this.filterId.childNodes;
        if (buttonList.length > 0) {
            buttonList.forEach(elm => {
                elm.removeEventListener('click', this.properties.gallery.update.bind(this.properties.gallery));
            });
        }

        buttonList.forEach(elm => {
            elm.addEventListener('click', this.properties.gallery.update.bind(this.properties.gallery));
        });
    }

    cssRules() {
        this.properties.sheet.insertRule(`#menu-filter { 
            display: flex;
            justify-content: center;
            margin-top: 2em;
            margin-bottom: 3em;
        }`);

        this.properties.sheet.insertRule(`.filter-btn { 
            padding: 0.5em;
            margin: 0.5em;
            border: 1px solid ${this.properties.base.color1};
            border-radius: 2em;
            color: ${this.properties.base.color1};
            font-size: 1.2em;
            font-weight: 700;
            font-family: Syne;
            background-color: white;
        }`);

        this.properties.sheet.insertRule(`.filter-btn-selected { 
            background-color: ${this.properties.base.color1} !important;
            color: white !important;
        }`);
    }
}

class Gallery {
    galleryId = document.getElementById('gallery');

    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.cssRules();
        this.update({ target: { id: 'tous' } });
    }

    async update(ev) {
        this.clear();

        // this.#updateFilterCss(ev);
        const buttonList = this.properties.filter.filterId.childNodes;

        buttonList.forEach(element => {
            if (element.id === ev.target.id) {
                element.classList.toggle('filter-btn-selected', true);
            } else {
                element.classList.toggle('filter-btn-selected', false);
            }
        });

        this.works = await this.properties.getWorks();
        // this.filterGallery();
        this.properties.filter.category.forEach(element => {
            if (element.id === 0) {
                this.filterWorks[element.name.toLowerCase()] = [...this.works];
            } else {
                this.filterWorks[element.name.toLowerCase()] = this.works.filter(elem => {
                    if (elem.categoryId === element.id) {
                        return elem;
                    }
                });
            }
        });

        this.html(this.filterWorks[ev.target.id]);
    }

    clear() {
        this.works = [];
        this.filterWorks = {};
        this.galleryId.replaceChildren();
    }

    html(data) {
        data.forEach(element => {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            const figcaption = document.createElement('figcaption');

            figcaption.textContent = element.title;
            img.setAttribute('src', element.imageUrl);
            img.setAttribute('alt', element.title);

            figure.appendChild(img);
            figure.appendChild(figcaption);
            this.properties.fragment.appendChild(figure);
        });
        this.galleryId.appendChild(this.properties.fragment);
    }

    js() {

    }

    cssRules() {

    }
}

class LoginNav {
    loginId = document.getElementById('login-nav');

    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.cssRules();
        // this.html();
        this.js();
    }

    update(ev) {
        if (!localStorage.getItem('sessionUser')) {
            // if (typeof this.properties.sessionUser === 'undefined') {
            this.properties.base.introductionId.classList.toggle('hidden', true);
            this.properties.base.portfolioId.classList.toggle('hidden', true);
            this.properties.base.contactId.classList.toggle('hidden', true);
            this.properties.loginForm.loginSection.classList.toggle('hidden', false);

            for (const elm of this.loginId.parentNode.children) {
                elm.classList.toggle('nav-btn-selected', false);
            }

            this.loginId.classList.toggle('nav-btn-selected', true);

            location.href = '#login';
        } else {
            if (ev.target.id === this.loginId.id) {
                // delete this.properties.sessionUser;
                localStorage.removeItem('sessionUser');
                this.properties.filter.filterId.classList.toggle('hidden', false);
                this.properties.modifierBtn.modeEditId.classList.toggle('hidden', true);
                this.loginId.textContent = 'Login';
            } else {
                this.properties.base.introductionId.classList.toggle('hidden', false);
                this.properties.base.portfolioId.classList.toggle('hidden', false);
                this.properties.base.contactId.classList.toggle('hidden', false);
                this.properties.loginForm.loginSection.classList.toggle('hidden', true);

                for (const elm of this.loginId.parentNode.children) {
                    elm.classList.toggle('nav-btn-selected', false);
                }

                this.properties.filter.filterId.classList.toggle('hidden', true);
                this.properties.modifierBtn.modeEditId.classList.toggle('hidden', false);

                this.loginId.textContent = 'Logout';
                location.href = '#';
            }
        }
    }

    js() {
        this.loginId.addEventListener('click', this.update.bind(this));
    }

    cssRules() {
        this.properties.sheet.insertRule(`.nav-btn-selected { 
            font-weight: 600;
        }`);
    }

}

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

    update(ev) {
        this.properties.loginNav.update(ev);
    }

    html() {
        this.loginSection = document.createElement('section');
        this.loginSection.setAttribute('class', 'login-form');

        this.loginForm = document.createElement('form');

        //title
        const title = document.createElement('h2');
        title.textContent = 'Log In';
        this.loginForm.appendChild(title);

        //email
        const emailLabel = document.createElement('label');
        emailLabel.setAttribute('for', 'email');
        emailLabel.textContent = 'E-mail';
        this.loginForm.appendChild(emailLabel);

        const emailInput = document.createElement('input');
        emailInput.setAttribute('type', 'email');
        emailInput.setAttribute('id', 'email-login');
        emailInput.setAttribute('name', 'email');
        // emailInput.setAttribute('pattern', '');
        emailInput.setAttribute('required', '');
        emailInput.setAttribute('autocomplete', 'email');
        this.loginForm.appendChild(emailInput);

        //password
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

        //submit
        const submit = document.createElement('input');
        submit.setAttribute('type', 'submit');
        submit.setAttribute('value', 'Se connecter');
        submit.setAttribute('class', 'filter-btn');

        this.loginForm.appendChild(submit);

        //mdpo
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
        let emailId = this.loginForm.querySelector('#email-login');
        let passwordId = this.loginForm.querySelector('#password-login');
        emailId.addEventListener('change', ev => { emailId.setCustomValidity(''); });
        passwordId.addEventListener('change', ev => { passwordId.setCustomValidity(''); });

        this.loginForm.addEventListener('submit', async event => {
            event.preventDefault();

            let valid = true;
            for (const input of event.target) {
                valid = input.reportValidity();
                if (!valid) {
                    break;
                }
            }

            if (valid) {
                const response = await this.properties.postUsersLogin(emailId.value, passwordId.value);
                const repJs = await response.json();

                if (typeof repJs.message === 'undefined' && typeof repJs.error === 'undefined') {
                    localStorage.setItem('sessionUser', JSON.stringify(repJs));
                    // this.properties.sessionUser = repJs;// localstorage timestam
                    this.update(event);
                } else if (typeof repJs.message !== 'undefined') {
                    emailId.setCustomValidity(repJs.message);
                    emailId.reportValidity();
                } else if (typeof repJs.error !== 'undefined') {
                    passwordId.setCustomValidity('Unauthorized');
                    passwordId.reportValidity();
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

class ContactNav {
    contactId = document.getElementById('contact-nav');

    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.js();
    }

    update(ev) {
        this.properties.base.introductionId.classList.toggle('hidden', false);
        this.properties.base.portfolioId.classList.toggle('hidden', false);
        this.properties.base.contactId.classList.toggle('hidden', false);
        this.properties.loginForm.loginSection.classList.toggle('hidden', true);

        for (const elm of this.contactId.parentNode.children) {
            elm.classList.toggle('nav-btn-selected', false);
        }

        this.contactId.classList.toggle('nav-btn-selected', true);

        location.href = '#contact';
    }

    js() {
        this.contactId.addEventListener('click', this.update.bind(this));
    }
}

class ProjetsNav {
    projetsId = document.getElementById('projets-nav');

    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.js();
    }

    update(ev) {
        this.properties.base.introductionId.classList.toggle('hidden', false);
        this.properties.base.portfolioId.classList.toggle('hidden', false);
        this.properties.base.contactId.classList.toggle('hidden', false);
        this.properties.loginForm.loginSection.classList.toggle('hidden', true);

        for (const elm of this.projetsId.parentNode.children) {
            elm.classList.toggle('nav-btn-selected', false);
        }

        this.projetsId.classList.toggle('nav-btn-selected', true);

        location.href = '#portfolio';
    }

    js() {
        this.projetsId.addEventListener('click', this.update.bind(this));
    }
}

class ModifierBtn {
    modeEditId = document.getElementById('mode-edit');

    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.cssRules();
        this.html();
        this.js();
    }

    update(ev) {
        this.properties.modal.update(ev);
    }

    html() {
        this.modeEditId.classList.toggle('hidden', true);
    }

    js() {
        this.modeEditId.addEventListener('click', this.update.bind(this));
    }

    cssRules() {
        this.properties.sheet.insertRule(`.menu-edit { 
            display: flex;
            justify-content: center;
            gap: 2em;
            align-items: baseline;
        }`);
    }
}

class Modal {
    mainId = document.querySelector('#main');

    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.cssRules();
    }

    update(ev) {
        this.html();
        this.js();
        this.properties.modalGallery.update(ev);
    }

    html(data) {
        this.properties.addHtml(this.mainId,
            `<section class="modal-bg">
                <div class="modal-title"><i class="fa-regular fa-pen-to-square"></i> Mode édition</div>
                <div class="modal">
                    <div class="modal-bar">
                        <div class="modal-back modal-btn"><i class="fa-solid fa-arrow-left"></i></div>
                        <div class="modal-close modal-btn"><i class="fa-solid fa-xmark"></i></div>
                    </div>
                    <div id="modal-content"></div>
                </div>
            </section>`
        );
    }

    js() {
        this.modalBg = document.querySelector('.modal-bg');
        this.controller = new AbortController();

        document.querySelector('.modal-close').addEventListener('click', ev => {
            this.modalBg.remove();
            this.controller.abort();
        }, { signal: this.controller.signal });     
    }

    cssRules() {
        this.properties.sheet.insertRule(`.modal-bg { 
            display: grid;
            grid-template-rows: auto 1fr;
            justify-items: center;
            position: fixed;
            z-index: 1;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.3333);
            margin: 0;
            width: 100vw;
            height: 100vh;   
            overflow: auto;         
        }`);

        this.properties.sheet.insertRule(`.modal { 
            display: grid;
            grid-template-rows: auto 1fr;
            background-color: rgb(255, 255, 255);
            width: 55%;
            margin: auto;
            border-radius: 10px;
        }`);

        this.properties.sheet.insertRule(`.modal-title { 
            display: grid;
            grid-template-columns: auto auto;
            justify-content: center;
            gap: 1em;
            width: 100%;
            background-color: rgb(0, 0, 0);
            color: rgb(255, 255, 255);
            padding: 1em 0;
        }`);

        this.properties.sheet.insertRule(`.modal-close {

        }`);

        this.properties.sheet.insertRule(`.modal-bar {
            display: flex;
            justify-content: space-between;
        }`);

        this.properties.sheet.insertRule(`.modal-back {
            visibility: hidden;
        }`);

        this.properties.sheet.insertRule(`.modal-btn {
            padding: 1em;
            font-size: 2em;
        }`);
    }
}

class ModalGallery {
    modalContentId = document.querySelector('#modal-content');

    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.cssRules();
    }

    async update(ev) {
        // this.html(this.properties.gallery.filterWorks['tous']);
        this.html(await this.properties.getWorks());
        this.js();
    }

    html(data) {
        this.modalContentId = document.querySelector('#modal-content');
        this.properties.addHtml(this.modalContentId,
            `<h2>Galerie photo</h2>
            <div id="modal-gallery">
                ${ data.map(value => {
                    return `<div data-id="${value.id}">
                        <figure>
                            <img src="${value.imageUrl}" alt="${value.title}">
                        
                        </figure>
                        <form>         
                            <button class="trash-btn" type='submit'><i class="fa-solid fa-trash-can"></i></button>
                            <input type="hidden" name="id" value="${value.id}" />
                        </form>
                    </div>`;

                    
                }).join('') }
            </div>
            <button id="add-project" class="filter-btn filter-btn-selected">Ajouter une photo</button>`
        );
    }

    js() {
        const modalGalleryChilds = document.querySelector('#modal-gallery').children;

        [...modalGalleryChilds].forEach(element => {
            element.addEventListener('submit', async event => {
                event.preventDefault();
                let data = new FormData(event.target);
                this.properties.deleteWorksId([...data][0][1]);
                element.remove();
    
                //update gallery
                this.properties.gallery.update({ target: { id: 'tous' } });

            }, { signal: this.properties.modal.controller.signal });
        });

        document.querySelector('#add-project').addEventListener('click', ev => {
            this.modalContentId.replaceChildren();
            this.properties.modalAddPhoto.update(ev);
            document.querySelector('.input-img').classList.toggle('hidden');
        }, { signal: this.properties.modal.controller.signal });
    }  
    
    cssRules() {
        this.properties.sheet.insertRule(`.trash-btn {
            border: inherit;
            background-color: black;
            color: white;
            border-radius: 2px;
            width: 2em;
            height: 2em;
            font-size: 1em;
            position: absolute;
            top: 0.5em;
            right: 0.5em;
        }`);

        this.properties.sheet.insertRule(`#modal-gallery div {
            position: relative;
        }`);

        this.properties.sheet.insertRule(`#modal-content {
            display: grid;
        }`);

        this.properties.sheet.insertRule(`#modal-gallery {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
            gap: 1em;
            padding: 3em 0;
            border-bottom: #B3B3B3 solid 1px;
            width: 65%;
            justify-self: center;
        }`);

        this.properties.sheet.insertRule(`#modal-gallery img{
            width: 100%;
        }`);

        this.properties.sheet.insertRule(`.modal h2{
            color: inherit;
            justify-self: center;
            font-weight: 400 !important;
        }`);

        this.properties.sheet.insertRule(`#add-project, #valider-project {
            justify-self: center;
            margin: 2em;
            width: 30%;
        }`);
    }

}

class ModalAddPhoto {
    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.cssRules();
    }

    async update(ev) {
        this.html(await this.properties.getCategories());
        this.js();
    }

    html(data) {
        this.modalContentId = document.querySelector('#modal-content');
        this.properties.addHtml(this.modalContentId,
            `<h2>Ajout photo</h2>
            <div id="modal-project">
            <form id="form-project">

                <div class="input-img">
                    <i class="fa-regular fa-image"></i>

                    <label for="image">+ Ajouter photo</label>
                    <input type="file" id="image" name="image" value="+ Ajouter photo" accept="image/png, image/jpg">

                    <div>jpg, png : 4mo max</div>
                </div>
                
                <label for="title">Title</label>
                <input type="text" name="title" id="title">

                <label for="category">Category</label>
                <select name="category" id="category">
                    <option value=""></option>

                    ${ data.map(value => {
                        return `<option value="${value.name.toLowerCase()}">${value.name}</option>`;
                    }).join('') }

                </select>

            </form>
            </div>
            <input type="submit" form="form-project" id="valider-project" class="filter-btn filter-btn-selected" disabled value="Valider">`
        );
    }

    js() {
        this.backmodal = document.querySelector('.modal-back');
        this.backmodal.classList.toggle('modal-bachttp://localhost:3000/#k');

        const bm = ev => {
            this.modalContentId.replaceChildren();
            this.properties.modalGallery.update(ev);
            this.backmodal.classList.toggle('modal-back');
            this.backmodal.removeEventListener('click', bm);
        };
        this.backmodal.addEventListener('click', bm, { signal: this.properties.modal.controller.signal });

        let addImage = document.querySelector('#image');
        let ai = ev => {
            let file = ev.target.files[0];
            console.log(file);
            var reader = new FileReader();
            reader.onload = function (evt) {
                let img = document.createElement('img');
                img.setAttribute('src', `data:${file.type};base64,${btoa(evt.target.result)}`);
                console.log(addImage.parentElement.children);
                [...addImage.parentElement.children].forEach(element => {
                    element.classList.toggle('hidden');
                });
                addImage.parentElement.insertBefore(img, addImage.parentElement.firstElementChild);
                // document.querySelector('.input-img').classList.toggle('hidden');
                // document.querySelector('#form-project').innerHTML += `<img src="data:${file.type};base64,${btoa(evt.target.result)}">`;
            };
            reader.readAsBinaryString(file);

        };
        // addImage.addEventListener('click', ai, { signal: this.properties.modal.controller.signal });
        addImage.addEventListener('change', ai, { signal: this.properties.modal.controller.signal });
    }

    cssRules() {
        this.properties.sheet.insertRule(`#modal-project {
            display: grid;
            padding: 3em 0px;
            border-bottom: 1px solid rgb(179, 179, 179);
            width: 65%;
            justify-self: center;
        }`);

        this.properties.sheet.insertRule(`#form-project {
            display: grid;
        }`);

        this.properties.sheet.insertRule(`input[disabled] {
            background-color : #A7A7A7 !important;
            border-color: #A7A7A7 !important;
        }`);

        this.properties.sheet.insertRule(`.input-img {
            display: flex;
            text-align: center;
            flex-direction: column;
            background-color: #E8F1F6;
            padding: 2em;
        }`);

        this.properties.sheet.insertRule(`.input-img i {
            font-size: 5em;
            color: #B9C5CC;
        }`);

        this.properties.sheet.insertRule(`.input-img label {
            align-self: center;
            height: inherit !important;
            box-shadow: inherit !important;
            background-color: rgb(203, 214, 220) !important;
            color: rgb(48, 102, 133) !important;
            padding: 1em;
            border-radius: 2em;
            font-weight: 700;
            font-family: Syne;
        }`); 


        this.properties.sheet.insertRule(`#form-project input[type=file] {
            height: 0;
            padding: 0;
            opacity: 0;
        }`);

        this.properties.sheet.insertRule(`#form-project img {
            width: 33.33%;
            object-fit: cover;
            align-self: center;
        }`);
    }
}
