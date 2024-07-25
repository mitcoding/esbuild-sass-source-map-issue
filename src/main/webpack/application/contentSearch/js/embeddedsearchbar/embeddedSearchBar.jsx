import React from 'react';

class EmbeddedSearchBar extends React.Component {

    constructor( props ) {
        super( props );
    }

    render() {
        return (
            <div className="cmp-embedded-search-bar">
                <label>{this.props.embeddedSearchBarLabel || 'Search'}</label>
                <input type="text" value={this.props.searchTerm} onChange={e => this.props.onSearchTermChange( e.target.value )} name="term" />
            </div>
        )
    }

}

export default EmbeddedSearchBar;
