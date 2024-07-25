import React from "react";

import ContentSearchResultListItemComponent from "./contentSearchResultListItemComponent";
import LoadingSpinnerComponent from "../loadingspinner/loadingSpinnerComponent";
import EventResultListItemComponent from "./eventResultListItemComponent";
import PersonListItemComponent from "./personListItemComponent";
class SearchResultsListingComponent extends React.Component {

    constructor( props ) {
        super( props );

        this.componentsForTypes = {
            "content": ContentSearchResultListItemComponent,
            "event": EventResultListItemComponent,
            "person": PersonListItemComponent
        }
    }

    render() {
        const items = this.props.items;

        if ( items && items.length ) {
            const renderedItems = items.filter( item => this.componentsForTypes[ item.type ] )
                .map( item => {
                    const ItemType = this.componentsForTypes[ item.type ];
                    return (
                        <li className={`cmp-search-results-listing__item cmp-search-results-listing__item-${item.type}`} 
                            key={item.id}>
                            <ItemType item={item}/>
                        </li>
                    )
                } );

            return (
                <div className={`cmp-search-results-listing`}>
                    <LoadingSpinnerComponent loading={this.props.loading}/>
                    <ul className="cmp-search-results-listing__list">
                        {renderedItems}
                    </ul>
                </div>
            )
        } else if ( this.props.loading ) {
            return (
                <div className="cmp-search-results-listing empty">
                    <LoadingSpinnerComponent loading={ this.props.loading }/>
                </div>
            )
        } else {
            return null;
        }
    }
}

export default SearchResultsListingComponent