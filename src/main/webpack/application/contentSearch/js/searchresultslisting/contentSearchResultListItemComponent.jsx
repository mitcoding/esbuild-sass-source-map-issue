import React from "react";

class ContentSearchResultListItemComponent  extends React.Component {

    render() {
        const item = this.props.item;
        return (
            <div className="cmp-content-search-result-list-item">
                {( !!( item.image && item.image.src ) ) &&
                    <div className="cmp-content-search-result-list-item__img-container">
                        <img loading="lazy" className="cmp-content-search-result-list-item__img" src={item.image.src} alt={item.image.altText}/>
                    </div>
                }
                <div className="cmp-content-search-result-list-item__details">
                    <h3 className="cmp-content-search-result-list-item__details-name h5">{item.name}</h3>
                    {item.datePublished &&
                        <span className="cmp-content-search-result-list-item__details-date-published">{item.datePublished}</span>
                    }
                    {item.description &&
                        <p className="cmp-content-search-result-list-item__details-description">{item.description}</p>
                    }

                    {item.url &&
                        <a className="btn btn-primary cmp-content-search-result-list-item__details-cta" href={item.url} title={item.name}>
                            {/* ToDo: Get I18n {Granite.I18n.get("Read More")} */}
                            Read More
                        </a>
                    }
                    <div className="cmp-content-search-result-list-item__footer-item">
                        {item.contentType &&
                            <span className="cmp-content-search-result-list-item__details-contentType">{item.contentType}</span>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default ContentSearchResultListItemComponent
