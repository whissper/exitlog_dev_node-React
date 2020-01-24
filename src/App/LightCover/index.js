import React from 'react';
import './LightCover.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function LightCover(props) {

    const { isLoading } = props;

    const style = {
        visibility: isLoading ? 'visible' : 'hidden',
        opacity: isLoading ? '1' : '0'
    };

    return (
        <div id="light_cover" style={style}>
            <div className="light_cover_info">
                <FontAwesomeIcon icon={faSpinner} size="5x" spin />
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default LightCover;
