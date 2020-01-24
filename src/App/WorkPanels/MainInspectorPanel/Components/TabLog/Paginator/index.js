import React from 'react';
import './Paginator.css';
import { Pagination } from 'react-bootstrap';

function Paginator(props) {
    
    const { 
        curPage, 
        perPage, 
        countRows,
        onItemClick,
        onPrevClick,
        onNextClick,
        onFirstClick,
        onLastClick 
    } = props;

    const amoutOfItems = 7;

    const offset = Math.floor(7 / 2);

    const numberOfPages = (Math.ceil(countRows / perPage) < 1) ? 1 : Math.ceil(countRows / perPage);
    
    const itemClick = (e) => {
        const pageValue = e.target.attributes.pagenum.value
        onItemClick(parseInt(pageValue));
    };

    const prevClick = () => {
        const pageNumber = (curPage - 1 < 1) ? 1 : curPage - 1;
        onPrevClick(pageNumber);
    };

    const nextClick = () => {
        const pageNumber = ((curPage + 1) > numberOfPages) ? numberOfPages : curPage + 1;
        onNextClick(pageNumber);
    };
    
    const firstClick = () => {
        onFirstClick(1);
    };

    const lastClick = () => {
        onLastClick(numberOfPages);
    };

    let items = [];

    const getStartItem = () => {
        if (curPage - offset <= 1) {
            return 1;
        } else {
            if (curPage + amoutOfItems - offset > numberOfPages) {
            /**
             * let 
             *  curPage = x,
             *  offset = y,
             *  numberOfPages = z
             * 
             * previous items:                   constant previous items at the end:
             * 5 6 7 (8) 9 10 11  ==> 8-3        5 6 7 (8) 9 10 11  ==> 8-3 = 8-3-(3-(11-8))
             * 6 7 8 (9) 10 11    ==> 9-3   >>>  5 6 7 8 (9) 10 11  ==> 9-4 = 9-3-(3-(11-9))
             * 7 8 9 (10) 11      ==> 10-3  >>>  5 6 7 8 9 (10) 11  ==> 10-5 = 10-3-(3-(11-10))
             * 8 9 10 (11)        ==> 11-3       5 6 7 8 9 10 (11)  ==> 11-6 = 11-3-(3-(11-11))
             * 
             * the first expression was:
             * x - y - (y - (z - x))
             * 
             * modified expression:
             * x - y - y + (z - x)
             * x - 2y + z - x
             * -2y + z
             * z - 2y
             * 
             * i.e. numberOfPages - (2 * offset)
             */
                //return numberOfPages - (2 * offset);
                const startItemValue = numberOfPages - (2 * offset);
                return (startItemValue > 0 ? startItemValue : 1);
            } else { 
                return curPage - offset;
            }
        }
    };

    const getEndItem = () => {
        if (curPage - offset <= 1) {
            if (numberOfPages < amoutOfItems) {
                return numberOfPages + 1;
            } else {
                return amoutOfItems + 1;
            }
        } else {
            if (curPage + amoutOfItems - offset > numberOfPages) {
                return numberOfPages + 1;
            } else {
                return curPage + amoutOfItems - offset;
            }
        }
    };

    const startItem = getStartItem();
    const endItem = getEndItem();

    for (let i = startItem; i < endItem; i++) {
        items.push(
            <Pagination.Item active={i === curPage}
                key={i}
                onClick={itemClick}
                pagenum={i}>
                {i}
            </Pagination.Item>
        );
    }

    return (
        <Pagination>
            <Pagination.First onClick={firstClick} disabled={curPage === 1} />
            <Pagination.Prev onClick={prevClick} disabled={curPage === 1} />
            {items}
            <Pagination.Next onClick={nextClick} disabled={curPage === numberOfPages} />
            <Pagination.Last onClick={lastClick} disabled={curPage === numberOfPages} />
        </Pagination>
    );
}

export default Paginator;
