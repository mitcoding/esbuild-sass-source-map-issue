import axios from 'axios';

class SearchService {

    constructor( endpoint ) {
        this.endpoint = endpoint || '/bin/fooeller/sitesearch.json';
    }

    getResults( query ) {

        return axios( '/libs/granite/csrf/token.json' )
            .then( response => response.data.token)
            .then( token => axios( {
                method: "POST",
                url: this.endpoint,
                data: query,
                headers: {
                    "CSRF-Token": token
                }
            } ) )
            .then( response => {
                return response.data;
            } );
    }

    // TODO: Implement
    getFilterSuggestions( term ) {
        return new Promise( ( resolve, reject ) => {
            setTimeout( () => {
                resolve( [] );
            }, 1000 );
        } );
    }

}

export default SearchService;
