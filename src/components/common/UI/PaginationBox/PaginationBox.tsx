import './PaginationBox.scss';

import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Pagination } from 'react-bootstrap';

interface IPaginationBoxProps {
    activePage: number,
    totalPageNumbers: number,
    pageChange: (pageNumber: number) => void
}


const PaginationBox: React.FC<IPaginationBoxProps> = (props: IPaginationBoxProps) => {

    const [pageArray, setPageArray] = useState([]);
    useEffect(() => {
        setPageArray(getPageArray(props.totalPageNumbers, props.activePage));
    }
        , [props.activePage, props.totalPageNumbers]);
    const getPageArray = (totPages: number, currentPage: number) => {
        var pageArr: any = [];
        if (totPages > 1) {
            if (totPages <= 9) {
                var i = 1;
                while (i <= totPages) {
                    pageArr.push(i);
                    i++;
                }
            } else {
                if (currentPage <= 5) pageArr = [1, 2, 3, 4, 5, 6, 7, 8, "", totPages];
                else if (totPages - currentPage <= 4)
                    pageArr = [
                        1,
                        "",
                        totPages - 7,
                        totPages - 6,
                        totPages - 5,
                        totPages - 4,
                        totPages - 3,
                        totPages - 2,
                        totPages - 1,
                        totPages
                    ];
                else
                    pageArr = [
                        1,
                        "",
                        currentPage - 3,
                        currentPage - 2,
                        currentPage - 1,
                        currentPage,
                        currentPage + 1,
                        currentPage + 2,
                        currentPage + 3,
                        "",
                        totPages
                    ];
            }
        } else {
            pageArr = [1]
        }
        return pageArr;
    }
    if (props.totalPageNumbers) {
        return <div className='pagination-wrap'>
            <Pagination>
                <Pagination.First onClick={() => { if (props.activePage - 1 >= 1) props.pageChange(1); }} />
                <Pagination.Prev onClick={() => { if (props.activePage - 1 >= 1) props.pageChange(props.activePage - 1); }} />
                {pageArray.map((pageElement: number | string) => {
                    if (typeof pageElement == 'number') {
                        return <Pagination.Item key={pageElement} onClick={() => props.pageChange(pageElement)} active={pageElement === props.activePage}>{pageElement}</Pagination.Item>
                    } else {
                        return <Pagination.Ellipsis key={pageElement} disabled />
                    }
                })}
                <Pagination.Next onClick={() => { if (props.activePage + 1 <= props.totalPageNumbers) props.pageChange(props.activePage + 1) }} />
                <Pagination.Last onClick={() => { if (props.activePage + 1 <= props.totalPageNumbers) props.pageChange(props.totalPageNumbers) }} />
            </Pagination>
        </div>;
    } else
        return <span className="p-3">No Data Available</span>
}

export default PaginationBox;
PaginationBox.defaultProps = {
    activePage: 1,
    totalPageNumbers: 1,
    pageChange: () => { }
}