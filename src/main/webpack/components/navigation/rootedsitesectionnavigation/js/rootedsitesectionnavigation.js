const siteSectionDropdown = {
    init: () => {
        let siteSections = document.querySelectorAll(".site-section-navigation");

        siteSections.forEach((siteSection) => {
            const toggleSiteSectionClass = (event) => {
                let siteSection = event.target.closest(".site-section-navigation");
                siteSection.classList.toggle("site-section-navigation--open");

                siteSections.forEach((_siteSection) => {
                    if (_siteSection !== siteSection) {
                        _siteSection.classList.remove( 'site-section-navigation--open' );
                    }
                });
            };

            siteSection.addEventListener("click", toggleSiteSectionClass);
            siteSection.addEventListener("touchstart", toggleSiteSectionClass);
            siteSection.addEventListener("touchEnd", e => e.preventDefault() );
        });
    }
}

export const bindSiteSectionDropdown = () => {
    siteSectionDropdown.init();
}