import mockContent from "./mockContent";
import facets from "./mockFacets";

/**
 * Filter expects to have the form:
 *
 * {
 *     field: "field to filter on",
 *     value: "for a non range",
 *     from: "for a range",
 *     to: "for a range"
 * }
 *
 * @param term
 */
const constructFilterSuggestions = function( term ) {
    return Object.keys( facets ).reduce( ( accumulator, facetName ) => {
        return accumulator.concat( facets[ facetName ]
            .filter( currentFacetValue => currentFacetValue.value.indexOf( term ) !== -1 )
            .map( currentFacetValue => {
                return {
                    field: facetName,
                    value: currentFacetValue.value
                }
            } ) );
    }, [] );
};

const isMatchFilter = function( item, filterName, filter ) {
    return item[ filterName ] &&
        Array.isArray( item[ filterName ] ) ?
            filter.value.reduce( ( accumulator, currentFilterValue ) => {
                return accumulator || item[ filterName ].indexOf( currentFilterValue ) !== -1;
            }, false ) :
            filter.value.reduce( ( accumulator, currentFilterValue ) => {
                return accumulator || item[ filterName ] === currentFilterValue;
            }, false );
            //item[ filterName ].indexOf( filter.value ) !== -1 :
            //item[ filterName ] === filter.value;
};

const makeFacetsForQueryAndResults = function( query, results ) {

    return Object.keys( facets ).reduce( ( accumulator, facetName ) => {
        accumulator[ facetName ] = facets[ facetName ].map( facetValue => {
            return {
                ...facetValue,
                count: results.filter( item => isMatchFilter( item, facetName, {
                    value: [ facetValue.value ]
                } ) ).length
            };
        } ).filter( facetValue => facetValue.count );

        return accumulator;
    }, {} );

};

const getResultsForQuery = function( query ) {

    return mockContent.filter( item => {
        return ( !query.searchTerm || item.name.indexOf( query.searchTerm ) !== -1 || item.description.indexOf( query.searchTerm ) !== -1 ) &&
            ( !query.filters || Object.keys( query.filters ).reduce( ( accumulator, currentFilterKey ) => {
                return ( accumulator && isMatchFilter( item, currentFilterKey, query.filters[ currentFilterKey ] ) );
            }, true ) );
    } );

}

const mockQuery = function( query ) {

    const results = getResultsForQuery( query );

    return {
        searchTerm: query.searchTerm,
        facets: makeFacetsForQueryAndResults( query, results ),
        filters: query.filters || {},
        sort: query.sort, // TODO: Actually implement some sorting
        resultsPerPage: query.resultsPerPage,
        requestedPage: query.requestedPage,
        results: results.slice( ( query.requestedPage - 1 ) * query.resultsPerPage, query.requestedPage * query.resultsPerPage ),
        totalResults: results.length
    }

};

class SearchService {

    getResults( query ) {
        return new Promise( ( resolve, reject ) => {
            setTimeout( () => {
                resolve( mockQuery( query ) );
                //reject( 'oops' );
            }, 2000 );
        });
    }

    getFilterSuggestions( term ) {
        return new Promise( ( resolve, reject ) => {
            setTimeout( () => {
                resolve( constructFilterSuggestions( term ) );
            }, 1000 );
        } );
    }

}

export default SearchService;
