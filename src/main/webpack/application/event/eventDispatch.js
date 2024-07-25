function eventDispatch( name, target, details ) {

    let event;

    if ( typeof( CustomEvent ) === 'function') {
        if ( details ) {
            event = new CustomEvent( name, {
                "detail": details
            } );
        } else {
            event = new CustomEvent( name );
        }
    }
    else {
        event = document.createEvent( 'CustomEvent' );
        event.initCustomEvent( name, true, true, details );
    }

    target.dispatchEvent( event );
}

export default eventDispatch;
