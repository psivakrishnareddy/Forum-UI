import { stat } from 'fs/promises';
import React, { ChangeEvent, useContext, useEffect, useRef } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import GlobalContext from "../../../src/store/context/global-context";


declare type FilterProps = {
    sortValue: number,
    type?: string,
    categoryValue?: number,
    statusValue?: number,
    showAskButton?: boolean,
    ShowAdminStatusFilter?: boolean,
    onInputSort?: (event: ChangeEvent<HTMLSelectElement>) => void,
    onInputCategory?: (event: ChangeEvent<HTMLSelectElement>) => void,
    onInputStatus?: (event: ChangeEvent<HTMLSelectElement>) => void
}

const FilterBar: React.FC<FilterProps> = ({ sortValue, categoryValue, statusValue, type, showAskButton, ShowAdminStatusFilter, onInputSort, onInputCategory, onInputStatus }) => {
    const navigate = useNavigate();
    const handleCreateQuestion = () => {
        navigate("/forum/create")
    }
    const sortRef = useRef<HTMLSelectElement>(null);
    const catRef = useRef<HTMLSelectElement>(null);
    const statusRef = useRef<HTMLSelectElement>(null);
    const { state } = useContext(GlobalContext);
    useEffect(() => {
        if (sortRef.current) {
            sortRef.current.value = sortValue.toString();
        }
    }, [sortValue])

    return (
        <div className="filter-container w-100 d-flex align-items-center justify-content-between">
            <div className="filter-items w-75 border-bottom border-1 py-3 d-flex align-items-center">
                <span className='text-dark-gray'>Sort: </span>
                <select ref={sortRef} className="form-select w-20 ms-3" aria-label="Sort Select" defaultValue={sortValue} onInput={onInputSort}>
                    <option value="0">Recent</option>
                    <option value="1">Oldest</option>
                </select>

                {type === 'faqs' && (
                    <>
                        <span className='text-dark-gray ms-3'>Category: </span>
          <select ref={catRef} className="form-select category-select w-25 ms-3" aria-label="Sort Select" defaultValue={categoryValue} onInput={onInputCategory}>
              {state?.category?.map((item : any, i : any) => {
                return (
                    <option value={item.id}>{item.name}</option>
                )
                })}
              </select>
                    </>)}

             
            </div>

            {showAskButton && <Button variant='primary' className='fw-bold w-20 rounded-4' onClick={handleCreateQuestion}>Ask</Button>}
        </div >
    )
}
FilterBar.defaultProps = {
    type: 'default',
    ShowAdminStatusFilter: false,
    showAskButton: false
}

export default FilterBar