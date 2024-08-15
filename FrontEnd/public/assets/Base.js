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

    update(event) {
        let testBool = true;
        if (this.properties.isSessionUser() || event.type === 'load' || event.type === 'submit' || event.target.id === 'portfolio-nav' || event.target.id === 'contact-nav') {
            testBool = false;
        }

        this.introductionId.classList.toggle('hidden', testBool);
        this.portfolioId.classList.toggle('hidden', testBool);
        this.contactId.classList.toggle('hidden', testBool);
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

export {
    Base,
};
