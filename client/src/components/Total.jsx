import React from 'react';

const Total = ({text, number}) => {
    return (
        <div className="statistic">
        <h3>{text}</h3>
        <p>{number}</p>
    </div>
    );
};

export default Total;