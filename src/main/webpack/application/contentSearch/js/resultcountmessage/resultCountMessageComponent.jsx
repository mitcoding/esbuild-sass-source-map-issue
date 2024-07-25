import React from "react";

class ResultCountMessageComponent extends React.Component {

    render() {
        if ( this.props.resultCount ) {
            return (
                <div className="cmp-result-count-message">
                    <span className="cmp-result-count-message__message">{this.props.message.replace( '{0}', this.props.resultCount )}</span>
                </div>
            )
        }
    }

}

export default ResultCountMessageComponent;
