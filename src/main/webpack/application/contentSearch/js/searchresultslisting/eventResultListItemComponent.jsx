import React from "react";

class EventResultListItemComponent extends React.Component {

    render() {
        const item = this.props.item;

        function renderDateDetails( item ) {
            if ( item.startDate ) {
                if ( item.endDate ) {
                    return (
                        <div className="EventResultListItem__EventDetails__EventDuration">
                            <div className="EventResultListItem__EventDetails__EventDuration__StartsAt">
                                <h5>Starts At:</h5>
                                <span className="EventResultListItem__Details__EventDuration__StartsAt__Date">
                                    {item.startDate}
                                </span>
                            </div>
                            <div className="EventResultListItem__EventDetails__EventDuration__EndsAt">
                                <h5>Ends At:</h5>
                                <span className="EventResultListItem__EventDetails__EventDuration__EndsAt__Date">
                                    {item.endDate}
                                </span>
                            </div>
                        </div>
                    )
                }

                return (
                    <div className="EventResultListItem__EventDetails__EventDate">
                        <h5>Event Date:</h5>
                        <span className="EventResultListItem__EventDetails__EventDate__Date">
                            {item.startDate}
                        </span>
                    </div>
                )
            }

            return null;
        }

        function renderUrl( item ) {

            if ( item.locationUrl ) {
                return (
                    <div className="EventResultListItem__EventDetails__Link">
                        <h5>
                            <a href={item.locationUrl} title="Learn more and Register">Learn More and Register</a>
                        </h5>
                    </div>
                )
            } else if ( item.url ) {
                return (
                    <div className="EventResultListItem__EventDetails__Link">
                        <h5>
                            <a href={item.url} title="Learn more">Learn More</a>
                        </h5>
                    </div>
                )
            }

            return null;
        }

        return (
            <div className="cmp-content-search-result-list-item EventResultListItem">
                {( !!( item.image && item.image.src ) ) &&
                <div className="cmp-content-search-result-list-item__img-container">
                    <img loading="lazy" className="cmp-content-search-result-list-item__img" src={item.image.src} alt={item.image.altText}/>
                </div>
                }
                <div className="cmp-content-search-result-list-item__Details">
                    <h4 className="cmp-content-search-result-list-item__Details__Name"><a href={item.url} title={item.name}>{item.name}</a></h4>
                    {item.description &&
                    <p className="cmp-content-search-result-list-item__Details__Description">{item.description}</p>
                    }
                    <div className="EventResultListItem__EventDetails">
                        {renderDateDetails( item )}
                        {renderUrl( item )}
                    </div>
                    {item.contentType &&
                    <span className="cmp-content-search-result-list-item__Details__ContentType">{item.contentType}</span>
                    }
                </div>
            </div>
        )
    }
}

export default EventResultListItemComponent;
