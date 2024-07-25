function toggleClosedClass (el, className){
    el.classList.toggle(`${className}--closed`);
}

function bindHeaderSearch ({menu, toggleMenuButton, SEARCH_INPUT_CLASS}) {
    const handleClosedClass = () => toggleClosedClass(menu, SEARCH_INPUT_CLASS);

    toggleMenuButton.addEventListener("click", handleClosedClass);
    toggleMenuButton.addEventListener("touchstart", handleClosedClass);
    toggleMenuButton.addEventListener("touchEnd", e => e.preventDefault() );
}

function initSearchHeader (el) {
    const 
        SEARCH_INPUT_CLASS = "js-header-search-form", 
        toggleMenuButton = document.querySelectorAll(".js-header-search-btn")[0],
        menu = document.querySelectorAll(`.${SEARCH_INPUT_CLASS}`)[0],
        CONFIG_SEARCH = {
            menu,
            toggleMenuButton,
            SEARCH_INPUT_CLASS
        }
    ;

    bindHeaderSearch(CONFIG_SEARCH);
}

function initializeSearchHeaders(){
    document.querySelectorAll( '[data-cmp-is="headersearch"]' )
            .forEach( initSearchHeader );
}

export default initializeSearchHeaders;