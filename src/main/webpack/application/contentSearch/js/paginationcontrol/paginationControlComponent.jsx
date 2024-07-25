import React from "react";

function buildPageDefinitionsForPageCount( pages, currentPage ) {
    // 1, 2, ... n
    // 1, 2, 3, ... n
    // 1, ... , 8, 9, 10, ..., n
    // 1, ... , n``, n`, n

    return [ ...Array( pages ).keys() ].reduce( ( accumulator, pageNumber ) => {
        const pageDefinition = {
            page: pageNumber,
            current: pageNumber === currentPage
        };

        if ( pageNumber === 0 ) {
            accumulator.push( pageDefinition );
        } else if ( pageNumber === ( pages - 1 ) ) {
            accumulator.push( pageDefinition );
        } else if ( pageNumber === currentPage ) {
            accumulator.push( pageDefinition );
        } else if ( pageNumber === ( currentPage - 1 ) || pageNumber === ( currentPage + 1 ) ) {
            accumulator.push( pageDefinition );
        } else if ( pageNumber === ( currentPage - 2 ) || pageNumber === ( currentPage + 2 ) ) {
            accumulator.push( {
                placeholder: true,
                page: pageNumber
            } );
        }

        return accumulator;
    }, [] );

}

function PaginationControl( props ) {
    if (props.totalPages) {
        const pageNumberButtons = buildPageDefinitionsForPageCount( props.totalPages, props.currentPage ).map( pageDefinition => {
            if ( pageDefinition.placeholder ) {
                return (
                    <li key={pageDefinition.page} className="placeholder">
                        <button className="cmp-pagination-control-component__list-item-btn"
                                disabled={!props.isActive}>...</button>
                    </li>
                )
            } else {
                return (
                    <li key={pageDefinition.page}>
                        <button className="cmp-pagination-control-component__list-item-btn"
                                data-page={pageDefinition.page}
                                disabled={!props.isActive || pageDefinition.current}
                                data-current={pageDefinition.current}
                                onClick={() => props.onPageChange( pageDefinition.page )}>{pageDefinition.page + 1}</button>
                    </li>
                )
            }
        } );

        return (
            <div className="cmp-pagination-control-component">
                <ul className="cmp-pagination-control-component__list">
                    <li>
                        <button className="cmp-pagination-control-component__list-nav-btn"
                                data-page={props.currentPage - 1}
                                disabled={!props.isActive || props.currentPage === 0}
                                title={props.priorPageLabel}
                                onClick={() => props.onPageChange( props.currentPage - 1 ) } >
                                <i className="fas fa-chevron-left" aria-hidden="true"></i>
                        </button>
                    </li>
                    {pageNumberButtons}
                    <li>
                        <button className="cmp-pagination-control-component__list-nav-btn"
                                data-page={props.currentPage + 1}
                                disabled={!props.isActive || props.currentPage === props.totalPages - 1}
                                title={props.nextPageLabel}
                                onClick={() => props.onPageChange( props.currentPage + 1 ) }>
                                <i className="fas fa-chevron-right" aria-hidden="true"></i>
                        </button>
                    </li>
                </ul>
            </div>
        );
    }
    return null;
}

export default PaginationControl;
