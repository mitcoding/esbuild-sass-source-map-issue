import React, {Fragment} from "react";

import PaginationControl from "../paginationcontrol/paginationControlComponent";
import LensSelectorComponent from "../lensselector/lensSelectorComponent";
import SearchResultsListingComponent from "../searchresultslisting/searchResultsListingComponent";
import FacetSelectionComponent from "../facets/facetSelectionComponent";
import SearchService from "../service/searchService";
import ActiveConstraintsComponent from "../activeconstraints/activeConstraintsComponent";
import ResultCountMessageComponent from "../resultcountmessage/resultCountMessageComponent";
import SortControlComponent from "../sortcontrol/sortControlComponent";
import eventDispatch from "../../../event/eventDispatch";
import FacetSuggestionComponent from "../facetsuggestion/facetSuggestionComponent";
import 'url-search-params-polyfill';
import EmbeddedSearchBar from "../embeddedsearchbar/embeddedSearchBar";

class SearchResultsContainerComponent extends React.Component {

    constructor( props ) {
        super( props );

        this.defaultState = {
            loading: false,
            error: null,
            pagination: {
                currentPage: 0,
                selectedPage: null,
                totalPages: 0
            },
            results: [],
            totalResults: 0,
            appliedFilters: {},
            selectedFilters: {},
            facets: {},
            appliedSearchTerm: null,
            selectedSearchTerm: null,
            noResults: false,
            sort: {},
            selectedSort: null,
            filtersFocused: false,
            activeLens: this.props.enabledLenses[0] || "listing-list",
            resultsCountMessage: ""
        };

        this.state = Object.assign( {}, this.defaultState );

        this.searchService = new SearchService();

        this.availableLenses = {
            "listing-list": {
                "component": SearchResultsListingComponent,
                "title": "List",
                "iconClass": "fas fa-list",
                "attributes": {
                    "displayAs": "list"
                }
            },
            "listing-grid": {
                "component": SearchResultsListingComponent,
                "title": "Grid",
                "iconClass": "fas fa-border-all",
                "attributes": {
                    "displayAs": "grid"
                }
            }
        }
    }

    clearResults() {
        this.setState( Object.assign( {}, this.defaultState ) );
    }

    buildQueryRequest() {
        return {
            context: this.props.context,
            searchTerm: this.state.selectedSearchTerm || this.state.appliedSearchTerm,
            filters: this.state.selectedFilters || {},
            sort: this.state.selectedSort || this.state.sort || {},
            resultsPerPage: this.props.resultsPerPage || 25,
            requestedPage: ( this.state.pagination.selectedPage || 0 ) + 1
        };

    }

    setSearchTerm( term, andSearch ) {
        this.setState( {
            "appliedSearchTerm": term
        }, () => {
            if ( andSearch ) {
                this.executeQuery( true );
            }
        } );
    }

    clearSearchTerm() {
        this.setState( {
            "appliedSearchTerm": null
        }, () => {
            /*
             * TODO: Remove
            const clearedEvent = new CustomEvent( 'atlas.search.searchtermcleared' );
            document.dispatchEvent( clearedEvent );
             */

            eventDispatch( 'atlas.search.searchtermcleared', document );

            if ( this.props.queryWithoutConstraint ) {
                this.executeQuery( true );
            } else {
                this.clearResults();
            }
        } );
    }

    // TODO: How to handle concurrent query execution to avoid blocking of UI
    executeQuery() {
        const query = this.buildQueryRequest();
        this.setState( {
            loading: true
        }, () => {
            return this.searchService.getResults( query )
                .then( results => {
                    this.setState( {
                        loading: false,
                        error: null,
                        appliedSearchTerm: results.searchTerm,
                        selectedSearchTerm: null,
                        /*
                         * When using single select we keep whatever facets we got when the page loaded and we got
                         * our first results.  Otherwise we take the facets from the new results.
                         */
                        facets: ( this.props.useSingleSelectFilters && Object.keys( this.state.facets ).length ) ?
                            this.state.facets :
                            results.facets,
                        //facets: results.facets,
                        appliedFilters: results.filters,
                        sort: results.sort,
                        selectedSort: null,
                        pagination: {
                            ...this.state.pagination,
                            currentPage: results.requestedPage - 1,
                            selectedPage: null,
                            totalPages: Math.ceil(results.totalResults / this.props.resultsPerPage),
                        },
                        totalResults: results.totalResults,
                        results: results.results,
                        noResults: results.totalResults === 0
                    } )
                } )
                .catch(error => {
                    this.setState({
                        loading: false,
                        error: error,
                        pagination: {
                            ...this.state.pagination,
                            selectedPage: null
                        },
                        selectedFilters: null,
                        selectedSearchTerm: null,
                        selectedSort: null
                    } )
                } );
        } );
    }

    selectPage( pageNumber ) {

        if ( pageNumber >= 0 && pageNumber < this.state.pagination.totalPages ) {
            this.setState( {
                loading: true,
                pagination: {
                    ...this.state.pagination,
                    selectedPage: pageNumber
                }
            }, () => this.executeQuery() );

        }
    }

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
     * @param filter
     */
    applyFilter ( filter ) {
        const objectFilter = {};
        console.log('applyFilter ',filter);

        objectFilter[ filter.field ] = {
            value: [ filter.value ]
        };

        if ( this.state.selectedFilters && this.state.selectedFilters[ filter.field ] ) {
            objectFilter[ filter.field ].value = objectFilter[ filter.field ].value.concat( this.state.selectedFilters[ filter.field ].value );
        }

        this.setState( {
            selectedFilters: {
                ...( this.state.appliedFilters || {} ),
                ...objectFilter
            }
        }, () => this.executeQuery( false ) );
    }

    // TODO: Do I need to really pass the whole filter here or just the field identifier?
    removeFilter ( filter ) {
        const selectedFilters = Object.assign( {}, this.state.appliedFilters || {} );
        delete selectedFilters[ filter.field ];
        this.setState( {
            selectedFilters
        }, () => this.executeQuery( false ) );
    }

    selectFilter ( filter ) {
        const selectedFilters = Object.assign( {}, this.state.appliedFilters || {} );
        selectedFilters[ filter.field ] = {
            value: [ filter.value ]
        }

        console.log( filter );

        this.setState( {
            selectedFilters
        }, () => this.executeQuery( false ) );
    }

    clearFilters () {
        this.setState( {
            selectedFilters: {}
        }, () => this.executeQuery( false ) );
    }

    setSortOrder ( sortField, direction ) {
        if ( sortField ) {
            this.setState( {
                selectedSort: {
                    [ sortField ]: {
                        order: direction
                    }
                }
            }, () => this.executeQuery( false ) );
        } else {
            this.setState( {
                selectedSort: {}
            }, () => this.executeQuery( false ) );
        }
    }

    componentDidMount() {
        document.addEventListener( 'atlas.search.newtextsearch', ( e ) => {
            if ( e.detail.text ) {
                this.setSearchTerm( e.detail.text, true );
            } else {
                this.setSearchTerm( null, this.props.queryWithoutConstraint );
            }
        } );

        document.addEventListener( 'atlas.search.setfilter', ( e ) => {
            if ( e.detail.filter ) {
                this.applyFilter( e.detail.filter );
            }
        } );

        const query = window.location.search.substring( 1 );
        const params = new URLSearchParams( query );
        const queriedSearchTerm = params.get( 'searchQuery' );

        if ( queriedSearchTerm ) {
            this.setSearchTerm( queriedSearchTerm, true );
        } else if ( this.props.queryWithoutConstraint ) {
            this.executeQuery();
        }
    }

    /**
     * Transforms selected filters into constraint objects.  A constraint object has the form
     *
     * {
     *     type: "type-id",
     *     value: "for non range",
     *     from: "for range",
     *     to: "for range",
     *     remove: function called to remove the constraint
     * }
     *
     */
    getActiveConstraints() {
        const constraints = [];

        if ( this.state.appliedSearchTerm ) {
            constraints.push( {
                type: "search-term",
                value: this.state.appliedSearchTerm,
                remove: () => {
                    this.clearSearchTerm();
                }
            } );
        }

        Object.keys( this.state.appliedFilters || {} ).forEach( constraintType => constraints.push( {
            type: constraintType,
            value: this.state.appliedFilters[ constraintType ].value,
            from: this.state.appliedFilters[ constraintType ].from,
            to: this.state.appliedFilters[ constraintType ].to,
            remove: () => {
                const filterToRemove = {
                    field: constraintType,
                    ...this.state.appliedFilters[ constraintType ]
                }

                this.removeFilter( filterToRemove )
            }
        } ) );

        return constraints;
    }

    toggleFilterFocus() {
        this.setState( {
            filtersFocused: !this.state.filtersFocused
        } );
    }

    setActiveLens( lens ) {
        if ( this.availableLenses[ lens ] && lens !== this.state.activeLens ) {
            this.setState({
                activeLens: lens
            });
        }
    }

    getEnabledLenses() {
        return ( this.props.enabledLenses || [] )
            .map( currentLensId => {
                if ( this.availableLenses[ currentLensId ] ) {
                    return {
                        ...this.availableLenses[ currentLensId ],
                        active: currentLensId === this.state.activeLens,
                        id: currentLensId
                    };
                }

                return null;
            } )
            .filter( lensDefinition => lensDefinition );
    }

    render() {
        const ResultListingComponent = this.availableLenses[ this.state.activeLens ].component;
        const resultListingLensAttributes = this.availableLenses[ this.state.activeLens ].attributes || {};
        const activeConstraints = this.getActiveConstraints() || [];

        return <div className="cmp-search-results-container">
                <ActiveConstraintsComponent 
                    facets={this.state.selectedFilters}
                    constraints={activeConstraints} 
                    availableFacetsDictionary={this.props.availableFacetsDictionary}
                    removeFilter={filter => this.removeFilter(filter)}
                />
                {!!this.state.totalResults && <div className="cmp-search-results-container__toolbar">
                    <ResultCountMessageComponent message={this.props.resultsCountMessage} resultCount={this.state.totalResults}/>
                    <SortControlComponent sortOptions={this.props.sortOptions}
                                          setSortOrder={( property, order ) => this.setSortOrder( property, order )}
                                          activeSort={this.state.selectedSort || this.state.sort || {}}/>
                    <LensSelectorComponent lenses={this.getEnabledLenses()} selectLens={lens => this.setActiveLens( lens.id )}/>
                </div>}

                <div className={`cmp-search-results-container__results-layout ${this.state.activeLens}`}>

                    {Object.keys( this.state.facets ).length > 0 &&
                        <div className="cmp-search-results-container__facets-wrap">
                            <h4 className="cmp-search-results-container__title-facets" 
                                onClick={() => this.toggleFilterFocus()}>Filter by:</h4>
                            <div data-focused={this.state.filtersFocused}>
                                <FacetSelectionComponent facets={this.state.facets}
                                                    filters={this.state.selectedFilters || this.state.appliedFilters || {}}
                                                    onApplyFilter={filter => this.applyFilter( filter )}
                                                    onRemoveFilter={filter => this.removeFilter( filter )}
                                                    onSelectFilter={filter => this.selectFilter( filter )}
                                                    onClearFilters={() => this.clearFilters()}
                                                    availableFacetsDictionary={this.props.availableFacetsDictionary}
                                                    isActive={!this.state.loading}
                                                    useSingleSelectFilters={this.props.useSingleSelectFilters}/>
                            </div>
                            {this.props.embedSearchBar &&
                                <EmbeddedSearchBar searchTerm={this.state.selectedSearchTerm || this.state.appliedSearchTerm}
                                                   onSearchTermChange={term => this.setSearchTerm( term, true )}
                                                   embeddedSearchBarLabel="By Name"/>
                            }
                        </div>
                    }
                    <ResultListingComponent items={this.state.results} 
                                            lens={this.state.activeLens}
                                            loading={this.state.loading} { ...resultListingLensAttributes } />
                    {this.state.noResults &&
                        <div className="cmp-search-results-container__no-results">
                            <p className="cmp-search-results-container__no-results-txt">{this.props.noResultsMessage}</p>
                        </div>}
                    </div>
                    <PaginationControl
                        isActive={!this.state.loading}
                        totalPages={this.state.pagination.totalPages}
                        currentPage={this.state.pagination.selectedPage !== null ? this.state.pagination.selectedPage : this.state.pagination.currentPage}
                        priorPageLabel={this.props.priorPageLabel || 'Prior Page'}
                        nextPageLabel={this.props.nextPageLabel || 'Next Page'}
                        onPageChange={page => this.selectPage( page )}/>
            </div>
    }
}

export default SearchResultsContainerComponent;
