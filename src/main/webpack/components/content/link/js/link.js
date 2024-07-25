const activeLink = {
    setActive: (el) => {
        const locationClass = "cmp-link--location";

        if (el.dataset.bsTarget.split("/")[5] === el.dataset.currentpath.split("/")[5] && !el.classList.contains(locationClass)) {
            el.classList.add(locationClass);
        }
    }
}

export const initializeActiveLink = () => {
    document
        .querySelectorAll('[data-bs-target][data-currentpath]')
        .forEach((el) => {activeLink.setActive(el)})
    ;
}