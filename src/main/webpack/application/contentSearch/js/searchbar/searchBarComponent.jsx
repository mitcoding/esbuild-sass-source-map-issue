import React from 'react';
import FacetSuggestionComponent from "../facetsuggestion/facetSuggestionComponent";
import SearchService from "../service/mockSearchService";
import eventDispatch from "../../../event/eventDispatch";
import 'url-search-params-polyfill';

class SearchBarComponent extends React.Component {

    constructor( props ) {
        super( props );

        this.state = {
            text: "",
            tempText: "",
            facetSuggestions: []
        };
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.searchService = new SearchService();
    }

    componentDidMount() {
        document.addEventListener( 'atlas.search.searchtermcleared', () => {
            this.setState( {
                text: "",
                tempText: "",
                facetSuggestions: []
            } );
        } );

        const query = window.location.search.substring( 1 );
        const params = new URLSearchParams( query );
        const queriedSearchTerm = params.get( 'searchQuery' );

        if ( queriedSearchTerm ) {
            this.setState( {
                text: queriedSearchTerm
            } );
        }

    }

    handleTextChange( event ) {
        this.setState( {
            tempText: event.target.value || ''
        })
        event.preventDefault();
    }

    handleSubmit( event ) {
        event.preventDefault();
        this.setState( {
            "text": this.state.tempText
        }, () => {
            if ( this.props.hasFacetSuggestions ) {
                this.updateFacetSuggestions();
            }
            if ( this.props.searchPage ) {
                window.location = `${this.props.searchPage}?searchQuery=${this.state.text}`;
            } else {
                eventDispatch('atlas.search.newtextsearch', document, {text: '' === this.state.text ? null : this.state.text});
            }
        })
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
    updateFacetSuggestions() {
        if ( !this.state.text || this.state.text.length < 3 ) {
            this.setState( {
                facetSuggestions: []
            } );
        } else {
            this.searchService.getFilterSuggestions( this.state.text )
                .then( suggestions => {
                    this.setState( {
                        facetSuggestions: suggestions
                    } );
                } );
        }
    }

    handleFacetSuggestionSelection( suggestion ) {
        this.setState( {
            text: "",
            facetSuggestions: []
        } );

        eventDispatch( 'atlas.search.setfilter', document, { filter: suggestion } );
    }

    getFacetSuggestions() {
        if( this.state.facetSuggestions && this.state.facetSuggestions.length) {
            return <FacetSuggestionComponent suggestions={this.state.facetSuggestions} 
                        onSelectSuggestion={( suggestion ) => this.handleFacetSuggestionSelection( suggestion ) }
                    />;
        }
    }

    getMessage(){
        const showMessage = this.state.text && !this.props.searchPage;
        if(showMessage){
            return <span className="cmp-searchbar__result-txt">{this.props.message.replace( '{0}', this.state.text )}</span>
        }
    }

    render() {
        return (
            <div className="cmp-searchbar">
                <div className="cmp-searchbar__form-wrap">
                    <form className="cmp-searchbar__form" onSubmit={this.handleSubmit}>
                        <button className="cmp-searchbar__btn" type="submit">
                            <i className="fas fa-search" aria-hidden="true" />
                        </button>
                        <label className="cmp-searchbar__label"> 
                            <span className="cmp-searchbar__label-txt">
                                Search
                            </span>
                            <input type="text" name="text" 
                                value={this.state.tempText} 
                                onChange={this.handleTextChange} 
                                autoComplete="off" 
                                placeholder={this.props.inputPlaceholder} 
                            />
                        </label>
                    </form>
                </div>
                { this.getFacetSuggestions() }
                { this.getMessage() }
            </div>
        )
    }
}

export default SearchBarComponent;
