const DISMISSED_NOTIFICATIONS_STORAGE_KEY = "example.dismissednotifications";

/**
 * Lookup the stored value of dismissed notifications from local storage.  The value in local storage will be a
 * space delimited string of notification identifiers representing all previously dismissed notifications.
 *
 * If there is no value in local storage an empty array is returned.
 *
 * @returns {string[]}
 */
const getDismissedNotifications = () => {
    const storedValue = window.localStorage.getItem( DISMISSED_NOTIFICATIONS_STORAGE_KEY );

    if ( storedValue ) {
        return storedValue.split( ' ' );
    }

    return [];
};

/**
 * Given an Element, remove the element from the DOM and add the element's notification identifier to the
 * stored list of dismissed notifications.
 *
 * @param notification : Element
 */
const dismissNotification = ( notification ) => {
    console.log( notification );
    const notificationId = notification.getAttribute( 'data-notification' );
    notification.remove();

    window.localStorage.setItem( DISMISSED_NOTIFICATIONS_STORAGE_KEY,
        getDismissedNotifications().concat( [ notificationId ] ).join( ' ' ) );
};

const initNotificationBar = ( notificationBar, dismissedNotifications ) => {

    const notificationId = notificationBar.getAttribute( 'data-notification' );

    console.log( 'Initializing ' + notificationId );
    console.log( dismissedNotifications );

    if ( dismissedNotifications.indexOf( notificationId ) === -1 ) {
        notificationBar.style.display = 'block';
        console.log( 'showing by default ' + notificationId );

        if ( notificationBar.hasAttribute( 'data-dismissible' ) ) {
            console.log( 'is dismissible' );
            const dismissButton = notificationBar.querySelector( '.cmp-notificationbar__dismiss' );

            if ( dismissButton ) {
                console.log( 'registering listener for dismiss button' );
                dismissButton.addEventListener( 'click', ( e ) => {
                    e.preventDefault();
                    dismissNotification( notificationBar );
                } );
            }
        }
    }

};

const initNotificationBars = () => {
    const dismissedNotifications = getDismissedNotifications();
    document.querySelectorAll( '[data-cmp-is="notificationbar"]' )
        .forEach( notificationBar => initNotificationBar( notificationBar, dismissedNotifications ) );
};

export default initNotificationBars;