import React from "react";

class LensSelectorComponent extends React.Component {

    getLabelBtn(currentLensDefinition) {
        if(currentLensDefinition.iconClass) {
            return <span>
                    <em className={currentLensDefinition.iconClass + " LensSelector__LensList__Item__Label"} 
                        aria-label={currentLensDefinition.title}/> <span className="cmp-lens-selector__title">{currentLensDefinition.title}</span>
                </span>

        }
        return <span className="cmp-lens-selector__title">{currentLensDefinition.title}</span>
    }

    render() {
        if ( this.props.lenses ) {
            const renderedLenses = this.props.lenses.map( currentLensDefinition =>
                (<li className="cmp-lens-selector__item"
                    data-active={currentLensDefinition.active}
                    key={currentLensDefinition.title}>
                    <button className="cmp-lens-selector__btn"
                        onClick={() => this.props.selectLens(currentLensDefinition)}>
                        { this.getLabelBtn(currentLensDefinition ) }
                    </button>
                </li>))

            return (
                <div className="cmp-lens-selector">
                    {
                        this.props.lenses.length > 1 ?
                            <ul className="cmp-lens-selector__list">
                                {renderedLenses}
                            </ul>:null
                    }
                </div>
            )
        }

        return null;
    }

}

export default LensSelectorComponent;
