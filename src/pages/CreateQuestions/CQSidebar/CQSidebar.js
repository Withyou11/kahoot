import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useState } from 'react';
import CQSidebarItem from './CQSidebarItem/CQSidebarItem';

import classNames from 'classnames/bind';
import styles from './CQSidebar.module.scss';

const cx = classNames.bind(styles);

function CQSidebar({ questions, setQuestions, selectedQuestion, setSelectedQuestion }) {
    const countRealQuestions = (questions) => {
        let count = 1;
        for (const question of questions) {
            if (question.type !== 'exp') {
                count++;
            }
        }
        return count;
    };

    const handleAddQuestionClick = () => {
        const realQuestionsCount = countRealQuestions(questions);
        const newQuestion = {
            idfake: `question${questions.length + 1}`,
            id: `question${questions.length + 1}`,
            sortOrder: realQuestionsCount,
            content: '',
            mediaUrl: '',
            options: [
                {
                    content: '',
                    isCorrect: false,
                },
                {
                    content: '',
                    isCorrect: false,
                },
                {
                    content: '',
                    isCorrect: false,
                },
                {
                    content: '',
                    isCorrect: false,
                },
            ],
            timer: '15',
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleAddExplanationClick = () => {
        const newQuestion = {
            id: `question${questions.length + 1}`,
            explanationContent: '',
            explanationMediaUrl: '',
            type: 'exp',
            options: [],
        };
        setQuestions([...questions, newQuestion]);
    };

    const reorderQuestions = (startIndex, endIndex) => {
        const newQuestions = Array.from(questions);
        const [removed] = newQuestions.splice(startIndex, 1);
        newQuestions.splice(endIndex, 0, removed);

        let order = 1; // Biến này sẽ được sử dụng để tính toán lại order của các phần tử

        // Duyệt qua mảng và cập nhật order chỉ đối với các phần tử có type khác 'exp'
        newQuestions.forEach((question) => {
            if (question.type !== 'exp') {
                question.sortOrder = order;
                order++;
            }
        });

        // Cập nhật state
        setQuestions(newQuestions);
    };
    const onDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination) return;
        if (destination.index === source.index && destination.droppableId === source.droppableId) return;

        reorderQuestions(source.index, destination.index);
    };

    return (
        <div className={cx('wrapper')}>
            <DragDropContext onDragEnd={onDragEnd}>
                <div>
                    <Droppable droppableId="questions">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {questions.map((question, index) => (
                                    <Draggable key={question.id} draggableId={question.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <CQSidebarItem
                                                    question={question}
                                                    index={index}
                                                    questions={questions}
                                                    setQuestions={setQuestions}
                                                    selectedQuestion={selectedQuestion}
                                                    setSelectedQuestion={setSelectedQuestion}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
            <button onClick={handleAddQuestionClick} className={cx('add-button')}>
                Add Question
            </button>
            <button onClick={handleAddExplanationClick} className={cx('add-exp-button')}>
                Add Explanation
            </button>
        </div>
    );
}

export default CQSidebar;
