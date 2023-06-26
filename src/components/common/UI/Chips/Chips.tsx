import "./Chips.scss";
import { useState, useEffect } from 'react';

interface IChipsProps {
    labels: string[],
    acceptInputs?: boolean,
    readOnly?: boolean
    exportChips: (data: string[]) => void
}

/**
 * @param props React Props 
 *      labels: Array of chip labels
 *      exportChips: callback function after actions on chip label array
 * @returns Chips Fucntions Component
 */
const Chips: React.FC<IChipsProps> = (props) => {
    const [tagInput, setTagInput] = useState('');
    const [labels, setLabels] = useState(props.labels);
    const [lastChipDelettionIndex, setLastChipDelettionIndex] = useState(false);

    /**
     * Accepts Input Event, from which the input value is obtained and after input box value change,
     *  the value is binded to the TagInput state value
     * @param e Input Element
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };
    /**
     * After every keypress, keypress is checked if it is a enter key, if it is then the value is added to
     *      the chips array and the input field is made blank ready to accept further input.
     * @param event Keyboard Input Event
     */
    const addChipHandler = (event: React.KeyboardEvent) => {
        if (event.keyCode === 13) {
            setLabels([...labels, tagInput]);
            setTagInput('');
            props.exportChips(labels);
        } else if (event.keyCode === 8 && tagInput === '' && !props.readOnly) {
            setTagInput('');
            lastChipDelettionIndex && setLabels(labels.filter((label, i) => i !== (labels.length - 1)));
            setLastChipDelettionIndex(!lastChipDelettionIndex);
        } else {
            setLastChipDelettionIndex(false);
        }
    }
    /**
     * Removed a chip label from the labels state
     * @param index the index postion of the chip to be removed
     */
    const removeChipHandler = (index: number) => {
        setLabels(labels.filter((label, i) => i !== index));
        props.exportChips(labels);
    }

    /**
     * Once label state updates, the values are export to Parent
     */
    useEffect(() => {
        props.exportChips(labels);
    }, [labels, props]);


    return <div className="chip-container w-100 d-flex align-items-center justify-content-start flex-wrap bg-secondary form-control">
        {labels.map((label, index) => (
            <span key={index} className={`chip me-1 ${lastChipDelettionIndex && index === labels.length - 1 ? 'darken-chip' : ''}`}>
                <span>{label}</span>
                {!props.readOnly && <span className="px-1 chip-remove pointer-cursor" onClick={(event) => removeChipHandler(index)}>x</span>}
            </span>
        ))}
        {props.acceptInputs && <input className="tag-input" value={tagInput} onChange={(event) => handleInputChange(event)} onKeyDown={(event) => addChipHandler(event)} placeholder="Add a Tag" />}
    </div>
}


Chips.defaultProps = {
    labels: [],
    acceptInputs: true,
    readOnly: true,
    exportChips: (data: string[]) => { }
}
export default Chips;

/**
 * Use this for component usage inputs
 
    labels={[]}
    acceptInputs={true}
    readOnly={true}
    exportChips={(data: string[]) => { }}
 */