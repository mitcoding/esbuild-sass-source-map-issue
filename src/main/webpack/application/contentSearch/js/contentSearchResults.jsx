import React from 'react';
import { createRoot } from 'react-dom/client';
import SearchResultsContainerComponent from "./searchresultscontainer/searchResultsContainerComponent";
import domReady from '../../domReady/domReady';

domReady(() => {

    document.querySelectorAll(
        '[data-component="content-search-results"]'
    ).forEach( container => {
        const context = container.getAttribute( 'data-context' );
        const resultsPerPage = Number( container.getAttribute( 'data-results-per-page' ) ) || 25;
        const queryWithoutConstraint = container.hasAttribute( 'data-query-without-constraint' ) &&
            container.getAttribute( 'data-query-without-constraint' ) !== 'false';
        const priorPageLabel = container.getAttribute( 'data-prior-page-label' ) || 'Prior Page';
        const nextPageLabel = container.getAttribute( 'data-next-page-label' ) || 'Next Page';
        const noResultsMessage = container.getAttribute( 'data-no-results-message' ) || '';
        const resultCountMessage = container.getAttribute( 'data-result-count-message' ) || '{0} Results';
        const singleSelectFilters = container.hasAttribute( 'data-single-select-filters' );
        const useEmbeddedTermInput = container.hasAttribute( 'data-use-embedded-term-input' );
        const root = createRoot(container);

        let sortOptions = [];
        let availableFacetsDictionary = {};
        let enabledLenses = [ 'listing-list', 'listing-grid' ];

        try {
            sortOptions = JSON.parse( container.getAttribute( 'data-sort-options' ) || '[]' );
            availableFacetsDictionary = JSON.parse( container.getAttribute( 'data-available-facet-dictionary' ) || '{}' );
            enabledLenses = container.getAttribute('data-enabled-lenses').replace(/\]|\[/gi,'').split(',');
        } catch( e ) {
            console.log( `Error encountered parsing sort options: ${e}` );
        }

        root.render(
            <SearchResultsContainerComponent 
                resultsPerPage={resultsPerPage}
                queryWithoutConstraint={queryWithoutConstraint}
                priorPageLabel={priorPageLabel}
                nextPageLabel={nextPageLabel}
                sortOptions={sortOptions}
                noResultsMessage={noResultsMessage}
                resultsCountMessage={resultCountMessage}
                availableFacetsDictionary={availableFacetsDictionary}
                enabledLenses={enabledLenses}
                useSingleSelectFilters={singleSelectFilters}
                embedSearchBar={useEmbeddedTermInput}
                context={context}
            />
        );
    } );
});