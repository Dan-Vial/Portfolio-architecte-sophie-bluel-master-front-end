import { RouteAchitectApi as route } from './RouteArchitectApi.js';

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

    html(_data) {
        this.properties.addHtml(this.mainId,
            `<section class="modal-bg">
                <div class="modal">
                    <div class="modal-bar">
                        <div class="modal-back modal-btn"><i class="fa-solid fa-arrow-left"></i></div>
                        <div class="modal-close modal-btn"><i class="fa-solid fa-xmark"></i></div>
                    </div>
                    <div id="modal-content"></div>
                </div>
            </section>`,
        );
    }

    js() {
        this.modalBg = document.querySelector('.modal-bg');
        this.controller = new AbortController();

        document.querySelector('.modal-close').addEventListener('click', (_event) => {
            this.modalBg.remove();
            this.controller.abort();
        }, { signal: this.controller.signal });

        document.querySelector('.modal-bg').addEventListener('click', (ev) => {
            if (ev.target.className === 'modal-bg') {
                document.querySelector('.modal-close').dispatchEvent(new MouseEvent('click'));
            }
        }, { signal: this.controller.signal });
    }

    cssRules() {
        this.properties.sheet.insertRule(`.modal-bg { 
            display: grid;
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

    async update(_event) {
        this.html(await route.getWorks());
        this.js();
    }

    html(data) {
        this.modalContentId = document.querySelector('#modal-content');
        this.properties.addHtml(this.modalContentId,
            `<h2>Galerie photo</h2>
            <div id="modal-gallery">
                ${data.map(value => `<div data-id="${value.id}">
                        <figure>
                            <img src="${value.imageUrl}" alt="${value.title}">
                        
                        </figure>
                        <form>         
                            <button class="trash-btn" type='submit'><i class="fa-solid fa-trash-can"></i></button>
                            <input type="hidden" name="id" value="${value.id}" />
                        </form>
                    </div>`).join('')}
            </div>
            <button id="add-project" class="filter-btn filter-btn-selected">Ajouter une photo</button>`,
        );
    }

    js() {
        const modalGalleryChilds = document.querySelector('#modal-gallery').children,

            modalGalleryChildsCb = async (event) => {
                event.preventDefault();
                const data = new FormData(event.target),
                    idImg = [...data][0][1];
                await route.deleteWorksId(idImg);
                document.querySelector(`[data-id="${idImg}"]`).remove();

                this.properties.gallery.update({ target: { id: 'tous' } });
            };
        [...modalGalleryChilds].forEach((element) => {
            element.addEventListener('submit', modalGalleryChildsCb, { signal: this.properties.modal.controller.signal });
        });

        const addProjetCb = (ev) => {
            document.querySelector('#add-project').removeEventListener('click', addProjetCb);

            [...modalGalleryChilds].forEach((element) => {
                element.removeEventListener('submit', modalGalleryChildsCb);
            });

            this.modalContentId.replaceChildren();
            this.properties.modalAddPhoto.update(ev);
        };
        document.querySelector('#add-project').addEventListener('click', addProjetCb, { signal: this.properties.modal.controller.signal });
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

    async update(_event) {
        this.html(await route.getCategories());
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
                    <input type="file" id="image" name="image" value="+ Ajouter photo" accept="image/png, image/jpg" required>

                    <div>jpg, png : 4mo max</div>
                </div>
                
                <label for="title">Title</label>
                <input type="text" name="title" id="title" required>

                <label for="category">Category</label>
                <select name="category" id="category" required>
                    <option value=""></option>

                    ${data.map(value => `<option value="${value.id}">${value.name}</option>`).join('')}

                </select>

            </form>
            </div>
            <input type="submit" form="form-project" id="valider-project" class="filter-btn filter-btn-selected" disabled value="Valider">`,
        );
    }

    js() {
        this.backmodal = document.querySelector('.modal-back');
        const addImage = document.querySelector('#image'),
            validerProject = document.querySelector('#valider-project'),
            formProject = document.querySelector('#form-project'),

            addImageCb = (ev) => {
                const file = ev.target.files[0],

                    img = document.createElement('img');
                img.setAttribute('src', URL.createObjectURL(file));
                [...addImage.parentElement.children].forEach((element) => {
                    element.classList.toggle('hidden');
                });
                addImage.parentElement.insertBefore(img, addImage.parentElement.firstElementChild);

                document.querySelector('.input-img').classList.toggle('zeropadding');
            },

            backmodalCB = (ev) => {
                this.backmodal.classList.toggle('modal-back');
                addImage.removeEventListener('change', addImageCb);
                this.backmodal.removeEventListener('click', backmodalCB);

                this.modalContentId.replaceChildren();
                this.properties.modalGallery.update(ev);
            };
        this.backmodal.addEventListener('click', backmodalCB, { signal: this.properties.modal.controller.signal });

        addImage.addEventListener('change', addImageCb, { signal: this.properties.modal.controller.signal });
        this.backmodal.classList.toggle('modal-back');

        formProject.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (this.properties.reportValidityInForm(event.target)) {
                const data = new FormData(event.target), // ??
                    res = await route.postWorks(data); // ??

                this.properties.gallery.update({ target: { id: 'tous' } });
                document.querySelector('.modal-close').dispatchEvent(new MouseEvent('click'));
            }
        }, { signal: this.properties.modal.controller.signal });

        for (const input of formProject) {
            input.addEventListener('change', (_event) => {
                let valid = true;
                for (const input of formProject) {
                    if (input.value === '') {
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    validerProject.removeAttribute('disabled');
                }
                else {
                    validerProject.setAttribute('disabled', '');
                }
            }, { signal: this.properties.modal.controller.signal });
        }
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
            padding: 1em 3em;
            border-radius: 2em;
            font-weight: 700;
            font-family: Syne;
        }`);

        this.properties.sheet.insertRule(`#form-project input[type=file] {
            height: 1px;
            padding: 0;
            opacity: 0;
        }`);

        this.properties.sheet.insertRule(`#form-project img {
            width: 33.33%;
            object-fit: cover;
            align-self: center;
        }`);

        this.properties.sheet.insertRule(`.zeropadding {
            padding: 0 !important;
        }`);
    }
}

export {
    Modal,
    ModalGallery,
    ModalAddPhoto,
};
