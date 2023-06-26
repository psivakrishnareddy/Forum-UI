import './TextFilesInputSection.scss';
import { useEffect, useState } from 'react';
import Chips from '../Chips/Chips';
import AttachmentIcon from '../../../../assets/icons/attachment.svg';
import React from 'react';


interface ITextFilesInputSection {
    textInput: string,
    files: any[],
    placeholder?: string,
    exportTextInput: (data: string) => void,
    exportFiles: (data: any[]) => void
}


/**
 * 
 * @param props React props
 *      textInput: input on the text area element,
        files: Attachments Array,
        placeholder?: PLaceholder for the text area input,
        exportTextInput: export the text input to the parent component,
        exportFiles: epxort the attachment files to the parent component
 * @returns Text Files and inputs section functional component
 */
const TextFilesInputSection: React.FC<ITextFilesInputSection> = (props) => {
    const [textInput, setTextInput] = useState(props.textInput);
    const [files, setFiles] = useState(props.files);


    /**
     * Accepts Input Event, from which the input value is obtained and after input box value change,
     *  the value is binded to the TagInput state value
     * 
     * Also increase the height of the text area once the input height grows
     * @param e Input Text Area Element
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.currentTarget.style.height = `${(((e.target.value as string).split('\n').length <= 2 ? 2 : (e.currentTarget.value as string).split('\n').length) * 25)}px`;
        e.currentTarget.style.resize = 'none';
        setTextInput(e.target.value);
    };

    /**
     * Accepts file input and adds it to the files state array
     * @param e Input File Element
     */
    const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.files && files.push(e.target.files[0]);
        setFiles([...files]);
    };

    /**
     * Accepts changes from chips, if any changes, current files array is compared with chips file names
     *  and the file state array is updated if any changes is made.
     * @param fileNames srting of filenames from chips
     */
    const handleInputFileUpdation = (fileNames: string[]) => {
        if (fileNames.length !== files.length) {
            setFiles([...files.filter((file: any) => fileNames.includes(file.name))]);
        }
    }

    useEffect(() => {
        props.exportTextInput(textInput);
    }, [textInput])

    useEffect(() => {
        props.exportFiles(files);
    }, [files])

    return <div className="h-100 w-auto ms-5 bg-secondary rounded fs-7">
        <textarea placeholder={props.placeholder} className={`w-100 bg-secondary border-0 p-3 text-area-reply bg-transparent`} value={textInput} onChange={(event) => handleInputChange(event)}></textarea>
        {files.length > 0 && <small className='text-muted px-3'>Attachments</small>}
        <div className='d-flex justify-content-end px-2 pb-2 position-relative'>
            <Chips key={`files-length-${files.length}`} labels={files.map((file) => file.name)} exportChips={handleInputFileUpdation} acceptInputs={false} readOnly={false}></Chips>
            <span className='position-absolute bottom-0 end-1 pb-2'>
                <img className="pointer-cursor attachment-icon" height="24" width="24" title="Attach files" src={AttachmentIcon} alt="Attach" onClick={() => document.getElementById('TextFilesInputSection_FILE')?.click()} />
            </span>
        </div>
        <input id="TextFilesInputSection_FILE" type="file" className={`d-none`} name="file" onChange={handleInputFileChange} />
    </div>;
}


TextFilesInputSection.defaultProps = {
    textInput: '',
    files: [],
    placeholder: '',
    exportTextInput: (data: string) => { },
    exportFiles: (data: any[]) => { }
}
export default TextFilesInputSection;

/**
 * Use this for component usage inputs
 
    textInput={''},
    files={[]},
    placeholder={''},
    exportTextInput={(data: string) => { }}
    exportFiles={(data: any[]) => { }}
 */