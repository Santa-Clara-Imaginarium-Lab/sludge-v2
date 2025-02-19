import React, { useState } from 'react';
import '../postTestSurvey/PostTestSurvey.css'; 
import { useNavigate } from 'react-router-dom';
import { questions } from './constants'; // Importing questions from constants.js

function PopQuiz() {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [showError, setShowError] = useState(false);
    const [answers, setAnswers] = useState([]); // Array to store answers
    const userId = localStorage.getItem('userId'); 
    const [score, setScore] = useState(0); // Counter for the score

    const handleOptionChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);
        setShowError(false); 
    };

    const handleClick = async () => {
        if (!selectedOption) {
            setShowError(true);
            return;
        }

        // Save the selected option to the answers array
        setAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers, selectedOption];
            return updatedAnswers;
        });

        // Check if the selected option is correct and update the score
        if (selectedOption === questions[currentQuestionIndex].correct) {
            setScore(score + 1); // Increase score if the answer is correct
        }

        // Move to the next question
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(''); // Reset selected option for the next question
            setShowError(false); // Reset error message
        } else {
            // Handle the end of the quiz, e.g., submit data
            const finalScore = score + (selectedOption === questions[currentQuestionIndex].correct ? 1 : 0); // Calculate final score
            const dataToSend = {
                userId,
                answers: [...answers, selectedOption], // Include the last selected option
                score: finalScore, 
            };
            console.log("Data to send:", dataToSend); 

            try {
                const response = await fetch(`https://sludge-v2.onrender.com/popquiz`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });

                if (!response.ok) {
                    throw new Error('Failed to save quiz data');
                }

                console.log("Quiz data saved successfully");
                navigate('/popquiz2'); 
            } catch (error) {
                console.error('Error saving quiz data:', error);
                setShowError(true); 
            }
        }
    };

    return (
        <div className="container">
            {/* Display the current score */}
            <h3>Score: {score}</h3>
            <div className='demographic-container'>
                {/* Displaying the current question and options */}
                <h2 className='question' style={{ textAlign: 'left' }}>{questions[currentQuestionIndex].question}</h2>
                <div className="demographic-options">
                    {questions[currentQuestionIndex].options.map((option, idx) => (
                        <label className="demographic-option" key={idx}>
                            <input
                                type="radio"
                                value={option}
                                checked={selectedOption === option}
                                onChange={handleOptionChange}
                            />
                            <span className="demographic-circle"></span>
                            <p>{option}</p>
                        </label>
                    ))}
                </div>
                {showError && <p className="error-message">Please select an option before proceeding.</p>}
                <button className="submit-button" onClick={handleClick}>Submit</button>
            </div>
        </div>
    );
}

export default PopQuiz;