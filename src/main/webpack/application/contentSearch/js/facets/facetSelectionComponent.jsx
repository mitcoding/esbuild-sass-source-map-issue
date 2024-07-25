import React from "react";

/**
 * Facets are expected to be in an object such as the following:
 *
 * {
 *     "field name": [{
 *         "value": "for non ranges",
 *         "from": "for ranges",
 *         "to": "for ranges",
 *         "count": n
 *     }]
 * }
 *
 * Filters are expected to be in an object such as the following:
 *
 * {
 *     "field name": {
 *         "value": "for non ranges",
 *         "from": "for ranges",
 *         "to": "for ranges"
 *     }
 * }
 */
class FacetSelectionComponent extends React.Component {
    toggleMenu() {
        let listClassName = "cmp-facet-selection__list--closed";
        if (this.state.listClassName){
            listClassName = "";
        }
        this.setState({ listClassName })
    }

    constructor( props ) {
        super( props );
        this.defaultState = {
            listClassName: "cmp-facet-selection__list--closed"
        };
        this.state = Object.assign( {}, this.defaultState );
    }

    render() {
        const facets = JSON.parse(JSON.stringify(this.props.facets || {}) );
        
        if ( Object.keys( facets ).length ) {
            const filters = JSON.parse(JSON.stringify(this.props.filters || {}) );
            const availableFacetsDictionary = JSON.parse(JSON.stringify(this.props.availableFacetsDictionary || {}) );

            const handleSelectionChange = ( facetName, facetValue ) => {
                this.props.onSelectFilter( {
                    field: facetName,
                    value: facetValue
                } );
            };

            const renderFacetOptions = ( facetName, facetValues ) => {
                const sortedFacetValues = this.props.useSingleSelectFilters ?
                    [ ...facetValues ].sort( ( a, b ) => {
                        return ( availableFacetsDictionary[ a.value ] || a.value ).localeCompare(
                            ( availableFacetsDictionary[ b.value ] || b.value )
                        );
                    } ) :
                    [ ...facetValues ];

                return sortedFacetValues.map( currentFacetValue => {
                    const selected = filters[ facetName ] && filters[ facetName ].value.indexOf( currentFacetValue.value ) !== -1;

                    return (
                        <option value={currentFacetValue.value} selected={selected}>
                            {availableFacetsDictionary[ currentFacetValue.value ] || currentFacetValue.value}
                        </option>
                    );
                } );
            };

            const renderFacetSelection = ( facetName, facetValues ) => {

                // find the selected value
                console.log( facetValues );

                const selected = filters[ facetName ] && filters[ facetName ].value.length && filters[ facetName ].value[ 0 ];

                console.log( selected );

                return (
                    <select className="cmp-facet-selection__selection" value={selected} onChange={ e => handleSelectionChange( facetName, e.target.value ) }>
                        <option value=""> </option>
                        {renderFacetOptions(facetName, facetValues)}
                    </select>
                );
            }

            const renderFacetValue = ( facetName, facetValues ) => {
                return facetValues.map( currentFacetValue => {
                    const checked = filters[ facetName ] && filters[ facetName ].value.indexOf( currentFacetValue.value ) !== -1;

                    // TODO: This won't work for ranges
                    return (
                        <li className="cmp-facet-selection__list-facet-item" key={currentFacetValue.value}>
                            <input id={'facet-' + currentFacetValue.value}
                                   className="cmp-facet-selection__checkbox"
                                   type="checkbox"
                                   name={facetName}
                                   value={currentFacetValue.value}
                                   title={currentFacetValue.value}
                                   checked={checked}
                                   disabled={this.props.loading}
                                   onChange={( e ) => {
                                       //e.preventDefault();
                                       if ( checked ) {
                                           this.props.onRemoveFilter( {
                                               field: facetName,
                                               value: currentFacetValue.value
                                           } );
                                       } else {
                                           this.props.onApplyFilter( {
                                               field: facetName,
                                               value: currentFacetValue.value
                                           } );
                                       }
                                   }}/>
                            <label 
                                className="cmp-facet-selection__facet-label"
                                htmlFor={'facet-' + currentFacetValue.value}>{availableFacetsDictionary[ currentFacetValue.value ] || currentFacetValue.value}
                                {currentFacetValue.count >= 0 &&
                                    <span className="FacetSelection__GroupList__Item__ValueList__Item__Label__Count">&nbsp;({currentFacetValue.count})</span>
                                }
                            </label>
                        </li>
                    )
                } );
            }

            // TODO: Walk through this from back to front
            const renderedFacets = Object.keys(facets).map( currentFacetName => {
                return (
                    <li className="cmp-facet-selection__list-item" key={currentFacetName}>
                        <h4 className="cmp-facet-selection__field">
                            {availableFacetsDictionary[ currentFacetName ] || currentFacetName}
                        </h4>
                        {this.props.useSingleSelectFilters && renderFacetSelection( currentFacetName, facets[ currentFacetName ] )}
                        {!this.props.useSingleSelectFilters &&
                            <ul className="cmp-facet-selection__facet-values">
                                {renderFacetValue( currentFacetName, facets[ currentFacetName ])}
                            </ul>
                        }
                    </li>
                );
            } );

            return (
                <div className="cmp-facet-selection">
                    <div className="cmp-facet-selection__mobile-btn-wrap">
                        <button className="cmp-facet-selection__mobile-btn" onClick={() => this.toggleMenu()}>
                            Filter by
                        </button> 
                    </div>
                    <ul className={`cmp-facet-selection__list ${this.state.listClassName}`}>
                        {renderedFacets}
                    </ul>
                </div>
            )
        } else {
            return (
                <div className="FacetSelection empty"></div>
            )
        }
    }
}

export default FacetSelectionComponent;
