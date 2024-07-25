import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
    getProductsComponentController,
    PRODUCT_EVENTS
} from "../../../../application/products/productsComponentsController";

/*
[
  {
    account: "Title",
    asOfDate: Date,
    displayRate: "Rate",
    description: "Description",
    term: "Term",
    minimumDepositToOpen: "Amount",
    minimumBalanceForApy: "Amount",
    productApplication: {
      existingCustomerUrl: "",
      newCustomerUrl: ""
    }
  }
]
 */
function ProductCards( props ) {

    const [ accounts, setAccounts ] = useState( [] );

    const handleProductCoverageUpdated = ( e ) => {
        if ( e.detail && e.detail.accounts ) {
            setAccounts( e.detail.accounts );
        } else {
            setAccounts( [] );
        }
    }

    useEffect( () => {
        // Listen for product data updates
        document.addEventListener( PRODUCT_EVENTS.productCoverageUpdated, handleProductCoverageUpdated );

        getProductsComponentController().getUserMarketProductData( props.product, props.context, true );

        // Unregister event listener on unload
        return () => {
            document.removeEventListener( PRODUCT_EVENTS.productCoverageUpdated, handleProductCoverageUpdated );
        }
    }, [] );

    function emitApplyNowRequest( e, forAccount ) {
        e.preventDefault();

        if ( forAccount.productApplication ) {
            if ( props.applicationRequiresExistingCustomerCheck ) {
                getProductsComponentController().handleRequestProductApplication( forAccount.productApplication );
            } else {
                window.open( forAccount.productApplication.newCustomerUrl, '_blank' );
            }
        }
    }

    function handleRateClick( e, forAccount ) {
        e.preventDefault();

        getProductsComponentController().handleRequestRateDetails( forAccount );
    }

    function createAccountCard( forAccount ) {
        console.log( forAccount );

        return (
            <div className="cmp-productcards__cards__item">
                <div className="cmp-productcards__card">
                    <div className="cmp-productcards__card__header">
                        <h4 className="cmp-productcards__card__title" dangerouslySetInnerHTML={ { __html: forAccount.account } }>
                        </h4>
                    </div>
                    <div className="cmp-productcards__card__content">
                        {forAccount.asOfDate &&
                            <span className="cmp-productcards__card__asofdate">{forAccount.type === 'ApyProduct' ? 'APY' : 'APR'} as of {forAccount.asOfDate}</span>
                        }
                        {forAccount.popupContent &&
                            <a href="#" className="cmp-productcards__card__rate" onClick={ ( e ) => handleRateClick( e, forAccount ) } dangerouslySetInnerHTML={ { __html: forAccount.displayRate } }>
                            </a>
                        }
                        {!forAccount.popupContent &&
                            <span className="cmp-productcards__card__rate" dangerouslySetInnerHTML={ { __html: forAccount.displayRate } }>
                            </span>
                        }
                        <div className="cmp-productcards__card__description" dangerouslySetInnerHTML={ { __html: forAccount.description } }>
                        </div>
                        <div className="cmp-productcards__card__terms">
                            {forAccount.term &&
                                <span className="cmp-productcards__card__term cmp-productcards__card__terms__item">
                                <span className="cmp-productcards__card__terms__term__label cmp-productcards__card__terms__label">Term:</span>
                                <span className="cmp-productcards__card__terms__term__value cmp-productcards__card__terms__value">{forAccount.term}</span>
                                </span>
                            }
                            {forAccount.minimumDepositToOpen &&
                                <span className="cmp-productcards__card__minimumdeposit cmp-productcards__card__terms__item">
                                    <span className="cmp-productcards__card__terms__minimumdeposit__label cmp-productcards__card__terms__label">Minimum Deposit to Open:</span>
                                    <span className="cmp-productcards__card__terms__minimumdeposit__value cmp-productcards__card__terms__value">{forAccount.minimumDepositToOpen}</span>
                                </span>
                            }
                            {forAccount.minimumBalanceForApy &&
                                <span className="cmp-productcards__card__minimumapybalance cmp-productcards__card__terms__item">
                                    <span className="cmp-productcards__card__terms__minimumdeposit__label cmp-productcards__card__terms__label">Minimum Balance for APY:</span>
                                    <span className="cmp-productcards__card__terms__minimumdeposit__value cmp-productcards__card__terms__value">{forAccount.minimumBalanceForApy}</span>
                                </span>
                            }
                        </div>

                    </div>
                    { forAccount.productApplication &&
                    <div className="cmp-productcards__card__footer">
                        <a href="#" className="cmp-productcards__card__actionbutton" onClick={ ( e ) => emitApplyNowRequest( e, forAccount ) }>Apply Now</a>
                    </div>
                    }
                    { props.inquirePage &&
                    <div className="cmp-productcards__card__footer">
                        <a href={props.inquirePage} className="cmp-productcards__card__actionbutton">{props.inquireNowLinkLabel}</a>
                    </div>
                    }
                </div>
            </div>
        )
    }

    if ( accounts && accounts.length ) {
        return (
            <div className="cmp-productcards__cards">
                { accounts.map( createAccountCard ) }
            </div>
        )
    } else {
        return null;
    }

}

function initializeProductCardsComponent( cardElement ) {

    const product = cardElement.getAttribute( 'data-product' );
    const context = cardElement.getAttribute( 'data-context' );
    const applicationRequiresExistingCustomerCheck = cardElement.hasAttribute( 'data-application-requires-existing-customer-check' );
    const inquireNowUrl = cardElement.getAttribute( 'data-inquire-now-url' );
    const inquireNowLinkLabel = cardElement.getAttribute( 'data-inquire-now-link-label' );
    const root = createRoot(cardElement);

    root.render(
        <ProductCards
            product={product}
            inquirePage={inquireNowUrl}
            applicationRequiresExistingCustomerCheck={applicationRequiresExistingCustomerCheck}
            inquireNowLinkLabel={inquireNowLinkLabel}
            context={context} 
        />
    );

}

function initProductCardsComponents() {
    document.querySelectorAll( '[data-cmp-is="productcards"][data-live]' )
        .forEach( initializeProductCardsComponent );
}
export default initProductCardsComponents;
