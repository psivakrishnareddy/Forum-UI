import React from 'react'
import { Link } from 'react-router-dom'
import QuestionForm from '../../../components/QuestionForm/QuestionForm'

const CreateQuestion = () => {
    return (
        <>
            <Link to={"/forum/threads"}>Back</Link>
            <div className='create-question-container mt-2'>
                <QuestionForm />
            </div>
        </>
    )
}

export default CreateQuestion