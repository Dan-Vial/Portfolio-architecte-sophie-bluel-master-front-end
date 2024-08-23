import { RouteAchitectApi as route } from './RouteArchitectApi.js';

class Gallery {
    galleryId = document.getElementById('gallery');

    constructor(properties) {
        this.properties = properties;
        this.init();
    }

    init() {
        this.update({ target: { id: 'tous' } });
    }

    async update(ev) {
        this.clear();

        const buttonList = this.properties.filter.filterId.childNodes;

        buttonList.forEach((element) => {
            if (element.id === ev.target.id) {
                element.classList.toggle('filter-btn-selected', true);
            }
            else {
                element.classList.toggle('filter-btn-selected', false);
            }
        });

        this.works = await route.getWorks();
        this.properties.filter.category.forEach((element) => {
            if (element.id === 0) {
                this.filterWorks[element.name.toLowerCase()] = [...this.works];
            }
            else {
                this.filterWorks[element.name.toLowerCase()] = this.works.filter((elem) => {
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
        data.forEach((element) => {
            const figure = document.createElement('figure'),
                img = document.createElement('img'),
                figcaption = document.createElement('figcaption');

            figcaption.textContent = element.title;
            img.setAttribute('src', element.imageUrl);
            img.setAttribute('alt', element.title);

            figure.appendChild(img);
            figure.appendChild(figcaption);
            this.properties.fragment.appendChild(figure);
        });
        this.galleryId.appendChild(this.properties.fragment);
    }
}

export {
    Gallery,
};
