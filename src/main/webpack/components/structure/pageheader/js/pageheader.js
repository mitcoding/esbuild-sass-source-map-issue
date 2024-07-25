function fixModals(modals) {
    const previousModalIds = [];

    modals.forEach((modal) => {
        const isUnique = !previousModalIds.includes(modal.id);
        
        if (isUnique) {
            const 
                parent = modal.parentElement,
                parentClasses = parent.classList,
                grandParentClasses = parent.parentElement.classList,
                newParent = document.createElement("div"),
                newGrandParent = document.createElement("div")
            ;

            newParent.classList = parentClasses;
            newGrandParent.classList = grandParentClasses;
            newGrandParent.appendChild(newParent);
            newParent.appendChild(modal);
            
            document.body.appendChild(newGrandParent);
            previousModalIds.push(modal.id);
            return;
        } 
            
        modal.parentElement.removeChild(modal);
    });
}

function initPageHeader(el) {
    fixModals(el.querySelectorAll(".modal") );
}

function initializeHeaders() {
    document.querySelectorAll('header[class~="pageheader"]')
            .forEach( initPageHeader );
        
}

export default initializeHeaders;