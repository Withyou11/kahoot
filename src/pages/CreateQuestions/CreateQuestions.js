import React, { useState } from 'react';

import classNames from 'classnames/bind';
import styles from './CreateQuestions.module.scss';
import CQSidebar from './CQSidebar/CQSidebar';
import CreateQuestionsHeader from '~/components/CreateQuestionsHeader/CreateQuestionsHeader';
import QuestionContent from './QuestionContent/QuestionContent';

const cx = classNames.bind(styles);

function CreateQuestion() {
    // Đây chỉ là dữ liệu tạm thời,
    //  sau có API sẽ dựa vào kết quả trả về để khởi tạo question
    const [questions, setQuestions] = useState([
        {
            id: 'question1',
            order: 1,
            content: '',
            type: 'quiz',
            answers: ['test', '', '', ''],
            correctAnswers: [0],
            imageUrl: '',
        },
    ]);
    const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);

    return (
        <div className={cx('wrapper')}>
            <CreateQuestionsHeader questions={questions} />
            <div className={cx('container gx-0', 'question-content')}>
                <div className={cx('row')}>
                    <div className={cx('col-2')}>
                        <CQSidebar
                            questions={questions}
                            setQuestions={setQuestions}
                            selectedQuestion={selectedQuestion}
                            setSelectedQuestion={setSelectedQuestion}
                        />
                    </div>
                    <div className={cx('col-10')}>
                        <QuestionContent selectedQuestion={selectedQuestion} setQuestions={setQuestions} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateQuestion;
