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
        this.update();
    }

    update(_event) {
        if (this.properties.isSessionUser()) {
            this.modeEditId.classList.toggle('hidden', false);
            document.querySelector('.menu-edit-title').classList.toggle('hidden', false);
        }
        else {
            this.modeEditId.classList.toggle('hidden', true);
            document.querySelector('.menu-edit-title').classList.toggle('hidden', true);
        }
    }

    html() {
        this.modeEditId.classList.toggle('hidden', true);

        this.properties.addHtml(document.querySelector('header'), `<div class="menu-edit-title hidden">
            <i class="fa-regular fa-pen-to-square"></i> Mode édition
        </div>`);
    }

    js() {
        this.modeEditId.addEventListener('click', async (event) => {
            await this.properties.modal.update(event);
        });
    }

    cssRules() {
        this.properties.sheet.insertRule(`.menu-edit { 
            display: flex;
            justify-content: center;
            gap: 2em;
            align-items: baseline;
        }`);

        this.properties.sheet.insertRule(`.menu-edit-title { 
            position: absolute;
            top: 0;
            left: 0;
            display: grid;
            grid-template-columns: auto auto;
            justify-content: center;
            gap: 1em;
            width: 100%;
            background-color: rgb(0, 0, 0);
            color: rgb(255, 255, 255);
            padding: 1em 0;
        }`);
    }
}

export {
    ModifierBtn,
};
