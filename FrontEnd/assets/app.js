import { Base } from './Base.js';
import { Filter } from './Filter.js';
import { Gallery } from './Gallery.js';
import { LoginForm } from './LoginForm.js';
import { Modal, ModalAddPhoto, ModalGallery } from './Modal.js';
import { ModifierBtn } from './ModifierBtn.js';
import { Nav } from './Nav.js';
import { RouteAchitectApi as route } from './RouteArchitectApi.js';

window.addEventListener('load', AllLoaded, true);

async function AllLoaded(event) {
    console.log(`AllLoaded: ${event.type}`);
    try {
        route.setApiUrl('http://localhost:5678/api');
        const app = new App();

        app.addModule(Base, Filter, Gallery);
        app.addModule(LoginForm, Nav, ModifierBtn);
        app.addModule(Modal, ModalGallery, ModalAddPhoto);

        const observer = new MutationObserver(observerCb);
        observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
        function observerCb(mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.target.id === 'gallery') {
                    if (location.hash) {
                        document.querySelector(`${location.hash}-nav`).dispatchEvent(new MouseEvent('click'));
                    }
                    observer.disconnect();
                }
            }
        }
    }
    catch (error) {
        console.log('/*** APP error ***/\n', error);
    }
}

class App {
    expired = 86400000;
    constructor() {
        this.init();
    }

    init() {
        this.fragment = new DocumentFragment();
        this.range = document.createRange();
        this.styleSheetCss();
    }

    styleSheetCss() {
        this.sheet = new CSSStyleSheet();
        document.adoptedStyleSheets = [this.sheet];
    }

    addModule(...classModule) {
        classModule.forEach((element) => {
            if (typeof element === 'undefined') { throw 'addModule arg empty.'; }
            const nameProperties = `${element.name[0].toLowerCase()}${element.name.slice(1)}`;
            if (typeof this[nameProperties] !== 'undefined') { throw `classModule ${element.name} exist.`; }
            this[nameProperties] = new element(this);
        });
    }

    addHtml(parent, stringHtml) {
        parent.appendChild(this.range.createContextualFragment(stringHtml));
    }

    reportValidityInForm(elementForm) {
        let valid = true;
        for (const input of elementForm) {
            valid = input.reportValidity();
            if (!valid) {
                break;
            }
        }
        return valid;
    }

    isSessionUser() {
        const sessionUser = localStorage.getItem('sessionUser');
        if (!sessionUser) { return false; }
        if ((Date.now() - JSON.parse(sessionUser).timestamp) < this.expired) { return true; }
        localStorage.removeItem('sessionUser');
        return false;
    }
}
