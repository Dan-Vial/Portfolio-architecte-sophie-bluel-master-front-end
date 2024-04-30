import { RouteAchitectApi as route } from './RouteArchitectApi.js';

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

    async update(event) {
        if (this.properties.isSessionUser()) {
            this.filterId.classList.toggle('hidden', true);
        }
        else {
            this.filterId.classList.toggle('hidden', false);
        }

        this.clear();
        this.category.push({ id: 0, name: 'Tous' });

        [...await route.getCategories()].forEach((element) => {
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
            buttonList.forEach((elm) => {
                elm.removeEventListener('click', this.properties.gallery.update.bind(this.properties.gallery));
            });
        }

        buttonList.forEach((elm) => {
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

export {
    Filter,
};
