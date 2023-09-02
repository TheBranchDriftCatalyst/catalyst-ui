import React, { MouseEventHandler } from 'react';
import { SynthesizedComment } from 'typescript';

export interface ButtonProps {
  label: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label} XXXX</button>;
};

export default Button;
