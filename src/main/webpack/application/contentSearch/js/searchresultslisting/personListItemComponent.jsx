import React from "react";

class PersonListItemComponent extends React.Component {

  //https://www.google.ca/maps/place/68154+Omaha+11404+West+Dodge+Road
  getGoogleMapsLocation(city, address, postalCode) {
    return [
      this.preventNullString(city).split(' ').join('+'),
      this.preventNullString(address).split(' ').join('+'),
      this.preventNullString(postalCode).split(' ').join('+')
    ].join('+');
  }

  preventNullString(string) {
    return string == null ? '' : string;
  }

  getPersonLocation(person) {
    const addresses = [ person.address1, person.address2 ]
        .filter( a => a )
        .join( ' ' );

    const mapUrl =
        `https://www.google.ca/maps/place/${this.getGoogleMapsLocation( person.city, addresses, person.postalCode )}`;

    return (
        <a href={mapUrl} className="cmp-content-search-person-list-item__address-link">
          {person.address1 &&
            <span className="cmp-content-search-person-list-item__address-link__address-segment">{person.address1}</span>
          }
          {person.address2 &&
            <span className="cmp-content-search-person-list-item__address-link__address-segment">{person.address2}</span>
          }
          <span className="cmp-content-search-person-list-item__address-link__address-segment">{person.city}, {person.state} {person.postalCode}</span>
        </a>
    );
    /*
    const ADDRESSES = [person.address1, person.address2,]
      .filter(a => a)
      .map(address => {
        const GOOGLE_MAPS_URL =
          `https://www.google.ca/maps/place/${this.getGoogleMapsLocation(person.city, address, person.postalCode)}`;
        return <a href={GOOGLE_MAPS_URL}>{address}</a>
      }
      )
    const PERSON_LOCAL_INFO = [
      person.city,
      person.state,
      person.postalCode].filter(p => p)
    const PERSON_LOCATION_ARRAY = [...ADDRESSES, ...PERSON_LOCAL_INFO]
    const PERSON_LOCATION_LENGHT = PERSON_LOCATION_ARRAY.length - 1;
    return PERSON_LOCATION_ARRAY.map(
      (localinfo, index) => {
        if (index < PERSON_LOCATION_LENGHT) {
          return <>{localinfo}, </>
        }
        return <>{localinfo}</>
      });
      */
  }

  render() {
    const person = this.props.item;
    return (
      <section className="cmp-content-search-person-list-item">
        <div className="cmp-content-search-person-list-item__wrap">
          {(!!person.backgroundImage) &&
            <div className="cmp-content-search-person-list-item__background-image banner"
                style= {{backgroundImage: `url(${person.backgroundImage.src})`}}>
            </div>
          }

          {(!!(person.image && person.image.src)) &&
            <article className={'cmp-content-search-person-list-item__img-wrap' + ( person.backgroundImage ? ' has-background' : '' )}>
              <img loading="lazy" className="cmp-content-search-person-list-item__img headshot" src={person.image.src} alt={person.image.altText} />
            </article>
          }
          <article className="cmp-content-search-person-list-item__description-wrap">
            <h3 className="cmp-content-search-person-list-item__description-title">
              {person.name}
            </h3>
            <div className="cmp-content-search-person-list-item__details">
              <div className="cmp-content-search-person-list-item__details__position">
                <div className="cmp-content-search-person-list-item__detail cmp-content-search-person-list-item__detail--job-title">
                  <p className="cmp-content-search-person-list-item__description-txt">
                    {person.jobTitle}
                  </p>
                </div>
                <div className="cmp-content-search-person-list-item__detail cmp-content-search-person-list-item__detail--markets">
                  <p className="cmp-content-search-person-list-item__description-txt">
                    {person.markets}
                  </p>
                </div>
                <div className="cmp-content-search-person-list-item__detail cmp-content-search-person-list-item__detail--nmls">
                  <p className="cmp-content-search-person-list-item__description-txt">
                    {person.nmls}
                  </p>
                </div>
              </div>
              <div className="cmp-content-search-person-list-item__details__location">
                <div className="cmp-content-search-person-list-item__detail cmp-content-search-person-list-item__detail--location">
                  <p className="cmp-content-search-person-list-item__description-txt">
                    {this.getPersonLocation(person)}
                  </p>
                </div>
                <div className="cmp-content-search-person-list-item__detail cmp-content-search-person-list-item__detail--phone">
                  <a href={`tel:${person.phone}`} className="cmp-content-search-person-list-item__description-txt">
                    {person.phone}
                  </a>
                </div>
                <div className="cmp-content-search-person-list-item__detail cmp-content-search-person-list-item__detail--email">
                  <a href={`mailto:${person.email}`} className="cmp-content-search-person-list-item__description-txt">
                    {person.email}
                  </a>
                </div>
              </div>
            </div>
          </article>
          <div className="cmp-content-search-person-list-item__btn-wrap">
            <a href={person.referrerUrl} className={`cmp-content-search-person-list-item__btn cmp-content-search-person-list-item__start-btn 
                                                    ${person.referrerUrl?'':'cmp-content-search-person-list-item__btn--disabled'}`}>
              Start the Process
            </a>
            {person.url &&
              <a href={person.url} className={`cmp-content-search-person-list-item__btn cmp-content-search-person-list-item__btn--low-emphasis cmp-content-search-person-list-item__learn-more-btn
                                                      ${person.url ? '' : 'cmp-content-search-person-list-item__btn-low-emphasis--disabled'}`}>
                Learn More
              </a>
            }
          </div>
        </div>
      </section>
    )
  }
}

export default PersonListItemComponent; 