"use client";

import { useState } from "react";
import { Card } from "../client";
import correctConfetti from "@/lib/correctConfetti";

export function ListAnswer({ canClientCheck, quiz, isOrdered }) {
    const [userResponse, setUserResponse] = useState(
        [...Array(quiz.correctResponses.length)].map(() => ""),
    );
    const [responseStatus, setResponseStatus] = useState("empty");
    const [responseCorrect, setResponseCorrect] = useState(false);

    function handleChange(index, value) {
        setResponseStatus("incomplete");
        let array = [...userResponse];
        array[index] = value;
        setUserResponse(array);
    }

    function handleCheckAnswer() {
        setResponseStatus("complete");
        if (isOrdered) {
            // Easier to find right/wrong if only looking for one wrong
            // But ux better if can clarify which ones wrong
            let isIncorrect = userResponse.find((res, index) => {
                return (
                    res.toLowerCase() !==
                    quiz.correctResponses[index].toLowerCase()
                );
            });
            if (isIncorrect == undefined) {
                setResponseCorrect(true);
                correctConfetti();
            }
        }

        if (!isOrdered) {
            // we could just sort first if unordered, then use same logic for both
            const sortLowerCase = (a, b) => {
                let al = a.toLowerCase();
                let bl = b.toLowerCase();
                if (al < bl) return -1;
                if (al > bl) return 1;
                return 0;
            };
            let userAnswers = userResponse.sort(sortLowerCase);
            let correctAnswers = quiz.correctResponses.sort(sortLowerCase);
            let isIncorrect = userAnswers.find((res, index) => {
                return (
                    res.toLowerCase() !== correctAnswers[index].toLowerCase()
                );
            });
            if (isIncorrect == undefined) {
                setResponseCorrect(true);
                correctConfetti();
            }
        }
    }

    return (
        <Card>
            <h4 id="prompt">{quiz.prompt}</h4>
            <ul>
                {quiz.correctResponses.map((ans, index) => {
                    return (
                        <li key={index}>
                            <input
                                type="text"
                                aria-labelledby="prompt"
                                id={"ans_" + index}
                                defaultValue={userResponse[index]}
                                onChange={(e) =>
                                    handleChange(index, e.target.value)
                                }
                            ></input>
                        </li>
                    );
                })}
            </ul>

            <button onClick={handleCheckAnswer} className="button">
                Check Answer
            </button>

            {responseCorrect && responseStatus === "complete" && (
                <div>Correct!</div>
            )}
            {!responseCorrect && responseStatus === "complete" && (
                <div>
                    Incorrect. Acceptable answers are
                    <ul>
                        {quiz.correctResponses.map((ans) => {
                            return <li key={ans}>{ans}</li>;
                        })}
                    </ul>
                </div>
            )}
        </Card>
    );
}
