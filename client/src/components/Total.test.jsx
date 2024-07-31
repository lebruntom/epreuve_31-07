import React from 'react';
import { render, screen } from '@testing-library/react';
import Total from './Total';

test('renders the text in Total component ex 5', () => {
    const number = 5;
    const text = "Nombre de clients inscrits";
    render(<Total number={number} text={text} />);

    const textElement = screen.getByText(text);
    const numberElement = screen.getByText(number.toString());

    expect(textElement).toBeInTheDocument();
    expect(numberElement).toBeInTheDocument();
});


test('renders the text in Total component ex 0', () => {
    const number = 0;
    const text = "Nombre de livres";
    render(<Total number={number} text={text} />);

    const textElement = screen.getByText(text);
    const numberElement = screen.getByText(number.toString());

    expect(textElement).toBeInTheDocument();
    expect(numberElement).toBeInTheDocument();
});
