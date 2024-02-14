import React, { useState, useEffect } from 'react';

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  options: string[];
}

const TriviaGame: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
  const [redirectToResults, setRedirectToResults] = useState<boolean>(false);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10');
      const data = await response.json();

      const shuffledQuestions = data.results.map((question) => ({
        ...question,
        options: shuffleOptions([...question.incorrect_answers, question.correct_answer]),
      }));

      setQuestions(shuffledQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

//   useEffect(() => {
//     const delay = 2000; // 2 seconds delay between API calls
//     const timer = setTimeout(() => {
//       fetchQuestions();
//     }, delay);
  useEffect(() => {
      fetchQuestions();
    });

  const handleAnswerSelection = (answer: string) => {
    setUserAnswer(answer);
  };

  const checkAnswer = () => {
    const correctAnswer = questions[currentQuestion]?.correct_answer;
    if (userAnswer === correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
    }
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setUserAnswer('');
      setShowResult(false);
    } else {
      setRedirectToResults(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setUserAnswer('');
    setShowResult(false);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setRedirectToResults(false);
    fetchQuestions();
  };

  if (redirectToResults) {
    return (
      <div>
        <h2>Results</h2>
        <p>Total Questions Served: {questions.length}</p>
        <p>Total Correct Questions: {correctAnswers}</p>
        <p>Total Incorrect Questions: {incorrectAnswers}</p>
        <button onClick={resetGame}>Restart</button>
      </div>
    );
  }
  const shuffleOptions = (options: string[]) => {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  };

  return (
    <div>
      {questions && questions.length > 0 && currentQuestion < questions.length && (
        <div>
          <h2>Question {currentQuestion + 1}</h2>
          <p>{questions[currentQuestion]?.question}</p>
          <form>
            {questions[currentQuestion]?.options.map((option, index) => (
              <div key={index}>
                <label>
                {String.fromCharCode(65 + index)}.
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={userAnswer === option}
                    className='mr-2'
                    onChange={() => handleAnswerSelection(option)}
                  />
                   {option}
                </label>
              </div>
            ))}
          </form>
          {showResult && (
            <div>
              <p>Your answer is {userAnswer === questions[currentQuestion]?.correct_answer ? 'correct' : 'incorrect'}.</p>
              {userAnswer !== questions[currentQuestion]?.correct_answer && (
                <div>
                  <p>Correct Answer: {questions[currentQuestion]?.correct_answer}</p>
                </div>
              )}
            </div>
          )}
          <button onClick={checkAnswer} className='mr-2'>Submit</button>
          <button onClick={nextQuestion}>Next</button>
        </div>
      )}
    </div>
  );
};

export default TriviaGame;
