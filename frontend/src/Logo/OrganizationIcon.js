import React from 'react';
import SvgAims from './SvgAims';
import SvgCreighton from './SvgCreighton';
import SvgUno from './SvgUno';

const OrganizationIcon = (props) => {
    switch(props.logo.toLowerCase()) {
        case 'unomaha.ico':
            return <SvgUno {...props}/>;
        case 'creighton.ico':
            return <SvgCreighton {...props}/>;
        default: 
            return <SvgAims />;
    }
}

export default OrganizationIcon;