import React from "react"

class ActiveConstraintsComponent extends React.Component {

    formatProperty(facet){
        let type = "";
        const values = []; 
        facet.value.forEach( item => {
            const [itemType, itemValue]= item.split(':')
            type = itemType;
            values.push(itemValue.split('/').slice(-1))
        });
        return {
            type,
            'remove': () => this.props.removeFilter(facet.value),
            value: values.join(' | ') 
        }
    }

    render() {
        const activeConstraints = [... (this.props.constraints || [])];
        const constraints = activeConstraints.map( constraint => {
           return (
                <li key={constraint.type + '-' + constraint.value} className="cmp-active-contraints__item">
                    <button className="cmp-active-contraints__btn" onClick={constraint.remove}>
                        <i 
                            className="cmp-active-contraints__icon fas fa-times"
                            aria-hidden="true"></i>
                        <span className="cmp-active-contraints__content">
                            <span className="cmp-active-contraints__type">{this.props.availableFacetsDictionary[ constraint.type ] || constraint.type}</span>
                            <span className="cmp-active-contraints__value">{this.props.availableFacetsDictionary[ constraint.value ] || constraint.value}</span>
                        </span>
                    </button>
                </li>
            )
        } );

        if ( !activeConstraints || !activeConstraints.length ) {
            return null;
        }

        return (
            <div className="cmp-active-contraints">
                <ul className="cmp-active-contraints__list">
                    {constraints}
                </ul>
            </div>
        );
    }

}

export default ActiveConstraintsComponent