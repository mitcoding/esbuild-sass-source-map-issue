import React from 'react';

class LoadingSpinnerComponent extends React.Component {

    render() {

        if ( this.props.loading ) {
            return (
                <div className="LoadingSpinner">
                    <i className="fas fa-spinner fa-pulse searchResults_loading_icon" aria-hidden="true"></i>
                </div>
            );
        } else {
            return null;
        }

    }

}

export default LoadingSpinnerComponent;
