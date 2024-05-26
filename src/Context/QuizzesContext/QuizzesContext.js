import { useState, createContext, useEffect } from 'react';

const QuizzesContext = createContext();

function QuizzesProvider({ children }) {
    const [updatedQuestions, setUpdatedQuestions] = useState([]);
    const [deletedQuestionIds, setDeletedQuestionIds] = useState([]);
    const [quizInfo, setQuizInfo] = useState({});
    const [newQuestions, setNewQuestions] = useState([]);

    const value = {
        quizInfo,
        setQuizInfo,
        updatedQuestions,
        setUpdatedQuestions,
        deletedQuestionIds,
        setDeletedQuestionIds,
        newQuestions,
        setNewQuestions,
    };

    return <QuizzesContext.Provider value={value}>{children}</QuizzesContext.Provider>;
}

export { QuizzesContext, QuizzesProvider };
