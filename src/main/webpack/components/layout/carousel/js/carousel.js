const 
    toggleCarouselClasses = (carouselButton, addClass, removeClass) => {
        let carouselContentClassList = carouselButton.parentElement.parentElement.classList;
        
        carouselContentClassList.add(addClass);
        carouselContentClassList.remove(removeClass);
    },
    handleCarouselClasses = (event) => {
        let carouselButton = event.target;

        if (carouselButton.classList.contains("cmp-carousel__action--next") ) {
            event.preventDefault();

            toggleCarouselClasses(
                carouselButton,
                "cmp-carousel__content--forwards",
                "cmp-carousel__content--backwards"
            );
        }

        if (carouselButton.classList.contains("cmp-carousel__action--previous") ) {
            event.preventDefault();
            
            toggleCarouselClasses(
                carouselButton,
                "cmp-carousel__content--backwards",
                "cmp-carousel__content--forwards"
            );
        }
    }
;

document.addEventListener("click", handleCarouselClasses);
document.addEventListener("touchstart", handleCarouselClasses);