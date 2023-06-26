import { InputHTMLAttributes, KeyboardEvent, useState, } from "react"
import "./InputField.scss"

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string,
    name?: string,
    // ref?: Ref<HTMLInputElement>
}

const InputField: React.FC<IInputProps> = ({ label, name, maxLength, ...rest }) => {
    const [wordCount, setwordCount] = useState(0);

    const onKeyUpHandle = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.currentTarget.value.length !== 0)
            setwordCount(event.currentTarget.value.length)
        else
            setwordCount(0)
    }
    return (
        <div className="input-field-wrapper mb-3">
            <label className="form-label fs-7 fw-bold">{label}*</label>
            <div className="dash-input-field-wrapper rounded d-flex align-items-center position-relative">
                <input className="form-control bg-secondary text-dark" maxLength={maxLength} onKeyUp={onKeyUpHandle} name={name} {...rest} />
                {maxLength && (<span className="fs-10 fw-light text-dark-gray position-absolute bottom-0 end-0 pe-2 pb-1">{wordCount}/{maxLength}</span>)}
            </div>
        </div>
    )
}

export default InputField