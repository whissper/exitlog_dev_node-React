import React, { useRef } from 'react';
import './ExitObject.css';
import { Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import DadataSuggestions from 'react-dadata-suggestions';
import "react-dadata-suggestions/dist/styles.css";


function ExitObject(props) {

    const objectNameInput = useRef(null);

    const {
        panelData,
        objectIndex,
        data,
        onObjectUpdate,
        onObjectDelete
    } = props;

    const handleNoteChange = (e) => {
        const value = e.target.value;

        const object = {
            objectIndex: objectIndex,
            fields: {
                note: value
            }
        };

        onObjectUpdate(object);
    };

    const handleObjectBlur = (e) => {
        const value = e.target.value;

        const object = {
            objectIndex: objectIndex,
            fields: {
                name: value
            }
        };

        onObjectUpdate(object);
    };

    const handleChange = (query) => {
        const object = {
            objectIndex: objectIndex,
            fields: {
                name: query
            }
        };

        onObjectUpdate(object);
    };

    const handleObjectChange = (suggestion) => {
        //join strings with separators
        const join = (arr, separatorVal) => {
            const separator = (separatorVal ? separatorVal : ', ');
            return arr.filter((n) => (n)).join(separator);
        };

        const name = suggestion.value.trim();
        const postalindex = suggestion.data.postal_code;
        const region = join([
            join([suggestion.data.region_type, suggestion.data.region], ' '),
            join([suggestion.data.area_type, suggestion.data.area], ' ')
        ]);
        const town = join([
            join([suggestion.data.city_type, suggestion.data.city], ' '),
            join([suggestion.data.settlement_type, suggestion.data.settlement], ' ')
        ]);
        const street = join([suggestion.data.street_type, suggestion.data.street], ' ');
        const building = join([
            join([suggestion.data.house_type, suggestion.data.house], ' '),
            join([suggestion.data.block_type, suggestion.data.block], ' ')
        ]);
        const apartment = join([suggestion.data.flat_type, suggestion.data.flat], ' ');
        const geolat = (suggestion.data.qc_geo !== '5' ? suggestion.data.geo_lat : '');
        const geolon = (suggestion.data.qc_geo !== '5' ? suggestion.data.geo_lon : '');

        const oldformat = ((street.trim() === '' || building.trim() === '') ? '1' : '0');

        const object = {
            objectIndex: objectIndex,
            fields: {
                name: name,
                postalindex: postalindex,
                region: region,
                town: town,
                street: street,
                building: building,
                apartment: apartment,
                geolat: geolat,
                geolon: geolon,
                oldformat: oldformat
            }
        };

        onObjectUpdate(object);
    };

    const handleDel = () => {
        onObjectDelete(objectIndex);
    };

    let objectName = '';
    let objectNote = '';

    data.forEach((object) => {
        if (object.objectIndex === objectIndex) {
            objectName = object.fields.name;
            objectNote = object.fields.note;
        }
    });


    const Syktyvkar     = { "kladr_id": "1100000100000" };
    const Ukhta         = { "kladr_id": "1100000800000" };
    const Sosnogorsk    = { "kladr_id": "1100000600000" };
    const Inta          = { "kladr_id": "1100000400000" };

    const getLocationsBoost = () => {
        let locationsBoost = { "locations_boost": [Syktyvkar] };

        if (panelData.depID === 2) {
            locationsBoost = { "locations_boost": [Ukhta] };
        } else if (panelData.depID === 3) {
            locationsBoost = { "locations_boost": [Sosnogorsk] };
        } else if (panelData.depID === 4) {
            locationsBoost = { "locations_boost": [Inta] };
        }

        return locationsBoost;
    };

    return (
        <Col lg={12}>
            <Form.Group>
                <Form.Label>
                    <FontAwesomeIcon icon={faMapMarkerAlt} size="1x" />
                    &nbsp;Объект выхода :
                </Form.Label>
                <InputGroup>
                    <DadataSuggestions name="objectName" ref={objectNameInput}
                        token="aa87679e3bfbbdaca05a44aa93ad6af10d54045a" count={7} placeholder="Адрес"
                        query={objectName} geolocation={false} specialRequestOptions={getLocationsBoost()}
                        onSelect={handleObjectChange} onBlur={handleObjectBlur} onChange={handleChange} />
                    <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={handleDel}>
                            <FontAwesomeIcon icon={faMinus} />
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form.Group>
            <Form.Control as="input" type="text" placeholder="Примечание" className="mb-3"
                name="objectNote" value={objectNote} onChange={handleNoteChange} />
        </Col>
    );
}

export default ExitObject;
