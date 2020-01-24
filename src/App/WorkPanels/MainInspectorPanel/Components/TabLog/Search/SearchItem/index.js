import React, { useRef, useEffect } from 'react';
import './SearchItem.css';
import { Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Inputmask from 'inputmask';

function SearchItem(props) {

    const inputField = useRef(null);

    const {
        size,
        label,
        mask,
        handleSearch,
        name,
        currentVal
    } = props;

    //Date-Picker -- start --
    //EventListener settings
    useEffect(() => {
        if (mask && mask.type === 'datepicker') {
            const inputElement = inputField.current;

            window.jQuery(inputElement).on('change', handleChange);

            return () => {
                window.jQuery(inputElement).off('change', handleChange);
            };
        }//eslint-disable-next-line
    }, []);
    //Datepicker settings
    useEffect(() => {
        if (mask && mask.type === 'datepicker') {
            const inputElement = inputField.current;

            window.jQuery(inputElement).datepicker(mask.params);

            return () => {
                window.jQuery(inputElement).datepicker('destroy');
            };
        }//eslint-disable-next-line
    }, []);
    //Date-Picker -- end --

    //Input-Mask -- start --
    useEffect(() => {
        if (mask && mask.type === 'inputmask') {
            const inputElement = inputField.current;

            Inputmask(mask.params).mask(inputElement);

            return () => {
                Inputmask.remove(inputElement);
            };
        }//eslint-disable-next-line
    }, []);
    //Input-Mask -- end --

    //EventListener for default (without mask property) search-item
    /* useEffect(() => {
        if (!mask) {
            const inputElement = inputField.current;
            inputElement.addEventListener('change', handleChange);

            return () => {
                inputElement.removeEventListener('change', handleChange);
            };
        }
    }, []); */

    const searchLatency = 1000;
    let delayTimer = null;

    const handleChange = () => {
        clearTimeout(delayTimer);

        delayTimer = setTimeout(function() {
            handleSearch({[name]: inputField.current.value.trim()});
        }, searchLatency);
    };

    const handleClick = () => {
        const inputElement = inputField.current;
        if (inputElement.value !== '') {
            inputElement.value = '';
            //const ev = new Event('change', { bubbles: true });
            //inputElement.dispatchEvent(ev);
            handleSearch({ [name]: inputElement.value });
        }
    };

    return (
        <Col lg={size} className="sav2-mt-1">
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>{label}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl className="no-placeholder" 
                    ref={inputField} 
                    onChange={handleChange}
                    defaultValue={currentVal} />
                <InputGroup.Append>
                    <Button variant="secondary" onClick={handleClick}>
                        <FontAwesomeIcon icon={faTimes} size="1x" />
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Col>
    );
}

export default SearchItem;
