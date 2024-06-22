import React, { useState, useEffect } from 'react';

const CheckboxGridQuestion = ({ question }) => {
    const [checkedCount, setCheckedCount] = useState(0);

    const handleCheckboxChange = (e) => {
        if (e.target.checked) {
            setCheckedCount(checkedCount + 1);
        } else {
            setCheckedCount(checkedCount - 1);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            // Logique de calcul des points après 30 secondes
            let points = 0;
            if (checkedCount >= question.points.minCoches) {
                points = question.points.maxPoints;
            } else if (checkedCount >= 1) {
                points = question.points.minPoints;
            }
            alert(`Temps écoulé ! Vous avez obtenu ${points} points.`);
        }, 30000);

        return () => clearTimeout(timer);
    }, [checkedCount, question.points.minCoches, question.points.maxPoints, question.points.minPoints]);

    return (
        <div>
            <p>{question.question}</p>
            <div className="checkbox-grid">
                {Array.from({ length: question.totalBoxes }, (_, index) => (
                    <label key={index}>
                        <input type="checkbox" onChange={handleCheckboxChange} />
                        O
                    </label>
                ))}
            </div>
        </div>
    );
};

export default CheckboxGridQuestion;
