
import { Modal } from 'bootstrap';

function initSpeedBumpLink( link ) {

    const 
        speedbump = document.querySelector( '[data-cmp-is="speedbump"]' ),
        dataHref = link.getAttribute("data-href"),
        handleSpeedBump = (event) => {
            event.preventDefault();
            
            if ( speedbump && dataHref ) {
                let 
                    speedBumpModal = new Modal(speedbump),
                    okButton = speedbump.querySelector( '[data-option="ok"]' )
                ;

                okButton.href = dataHref;

                document.body.appendChild(speedbump);
                speedBumpModal.show();
            }
        }
    ;

    link.addEventListener("click",  handleSpeedBump);
    link.addEventListener("touchstart",  handleSpeedBump);
    link.addEventListener("touchEnd", e => e.preventDefault() );
}

function initSpeedBumpLinks() {
    document.querySelectorAll( '[data-requires-speedbump]' )
            .forEach( initSpeedBumpLink );
}

export { initSpeedBumpLinks, initSpeedBumpLink} ;