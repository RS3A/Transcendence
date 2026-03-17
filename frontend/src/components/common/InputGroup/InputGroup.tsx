// InputGroup.tsx
import './InputGroup.css';

interface InputGroupProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  isEditing: boolean;
  isNumeric?: boolean;
  isTextArea?: boolean;
  placeholder?: string;
}

const InputGroup = ({ label, value, onChange, isEditing, isNumeric, isTextArea, placeholder }: InputGroupProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let val = e.target.value;
    if (isNumeric) {
      val = val.replace(/\D/g, ''); // Remove tudo que não é número
    }
    onChange(val);
  };

  return (
  /* Adicionamos a classe 'editing-mode' apenas quando isEditing for true */
  <div className={`input-group-container ${isEditing ? 'editing-mode' : ''}`}>
    {label && <label className="input-label">{label}</label>}
    
    {isEditing ? (
      isTextArea ? (
        <textarea 
          className="custom-input custom-textarea" 
          value={value} 
          onChange={handleChange}
          placeholder={placeholder}
        />
      ) : (
        <input 
          type="text" 
          className="custom-input" 
          value={value} 
          onChange={handleChange}
          placeholder={placeholder}
        />
      )
    ) : (
      <div className={`view-box ${isTextArea ? 'view-textarea' : ''}`}>
        {value || <span className="placeholder-text">{placeholder}</span>}
      </div>
    )}
  </div>
);
};

export default InputGroup;