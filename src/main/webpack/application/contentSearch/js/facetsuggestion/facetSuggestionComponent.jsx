import React from 'react';

class FacetSuggestionComponent extends React.Component {

    render() {

        const suggestions = this.props.suggestions.map( currentSuggestion => {
            return (
                <li className="FacetSelection__SuggestionList__SuggestionItem"
                    key={currentSuggestion.field + currentSuggestion.value}
                    onClick={() => this.props.onSelectSuggestion( currentSuggestion )}
                    data-field={currentSuggestion.field}
                    data-value={currentSuggestion.value}>
                    <span className="FacetSelection__SuggestionList__SuggestionItem__FieldLabel">{currentSuggestion.field}</span><span className="FacetSelection__SuggestionList__SuggestionItem__FieldValue">{currentSuggestion.value}</span>
                </li>
            );
        } );

        return (
            <div className="FacetSuggestion">
                <ul className="FacetSuggestion__SuggestionList">
                    {suggestions}
                </ul>
            </div>
        )
    }

}

export default FacetSuggestionComponent;
