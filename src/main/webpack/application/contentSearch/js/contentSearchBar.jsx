import React from 'react';
import { createRoot } from 'react-dom/client';
import SearchBarComponent from "./searchbar/searchBarComponent";
import domReady from '../../domReady/domReady';

domReady(() => {
    document.querySelectorAll(
        '[data-component="content-search-bar"]'
    ).forEach( container => {
        const context = container.getAttribute( 'data-context' );
        const message = container.getAttribute( 'data-results-for-message' );
        const inputPlaceholder = container.getAttribute( 'data-input-placeholder' );
        const searchPage = container.getAttribute( 'data-search-page' );
        const root = createRoot(container);

        root.render(
            <SearchBarComponent hasFacetSuggestions={false} message={message} inputPlaceholder={inputPlaceholder} searchPage={searchPage}/>
        );
    } );
});