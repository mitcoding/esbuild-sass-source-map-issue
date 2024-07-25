import React from "react";

class SortControlComponent extends React.Component {

    render() {

        const activeSortOption = Object.keys( this.props.activeSort ).length ?
            Object.keys( this.props.activeSort )[ 0 ] :
            null;

        function renderOptions( options ) {
            return options.map( currentOption => {
                return (
                    <option value={currentOption.value} key={currentOption.value} selected={activeSortOption && currentOption.value === activeSortOption}>{currentOption.label}</option>
                )
            } );
        }

        if ( this.props.sortOptions && this.props.sortOptions.length ) {
            return (
                <div className="SortControl">
                    <select name="sort" onChange={(e) => {
                        this.props.setSortOrder( e.target.value, 'DESC' ); // TODO: allow for different directions
                    }}>
                        {renderOptions( this.props.sortOptions )}
                    </select>
                </div>
            )
        }

        return null;
    }

}

export default SortControlComponent;
