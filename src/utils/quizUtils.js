import { useContext } from 'react';
import { QuizzesContext } from '~/Context/QuizzesContext/QuizzesContext';

export const useQuizContext = () => {
    const quizzesContext = useContext(QuizzesContext);
    const {
        quizInfo,
        setQuizInfo,
        updatedQuestions,
        setUpdatedQuestions,
        deletedQuestionIds,
        setDeletedQuestionIds,
        newQuestions,
        setNewQuestions,
    } = quizzesContext;
    return {
        quizInfo,
        setQuizInfo,
        updatedQuestions,
        setUpdatedQuestions,
        deletedQuestionIds,
        setDeletedQuestionIds,
        newQuestions,
        setNewQuestions,
    };
};

export const handleSetUpdatedQuestions = (selectedQuestion, key, value, updatedQuestions, setUpdatedQuestions) => {
    const updatingQuestionIndex = updatedQuestions.findIndex((question) => question.id === selectedQuestion.id);
    if (updatingQuestionIndex === -1) {
        const updatingQuestionData = {
            id: selectedQuestion.id,
            [key]: value,
        };
        setUpdatedQuestions((prev) => [...prev, updatingQuestionData]);
    } else {
        const tempUpdatedQuestions = [...updatedQuestions];
        tempUpdatedQuestions[updatingQuestionIndex] = {
            ...tempUpdatedQuestions[updatingQuestionIndex],
            [key]: value,
        };
        setUpdatedQuestions(tempUpdatedQuestions);
    }
};
