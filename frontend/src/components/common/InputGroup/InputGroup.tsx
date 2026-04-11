// InputGroup.tsx
import styles from './InputGroup.module.css';

interface InputGroupProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  isEditing: boolean;
  isNumeric?: boolean;
  isTextArea?: boolean;
  placeholder?: string;
}

export const InputGroup = ({ label, value, onChange, isEditing, isNumeric, isTextArea, placeholder }: InputGroupProps) => {
  
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
    {label && <label className={styles["input-label"]}>{label}</label>}
    
    {isEditing ? (
      isTextArea ? (
        <textarea 
          className={`${styles["custom-input"]} ${styles["custom-textarea"]}`} 
          value={value} 
          onChange={handleChange}
          placeholder={placeholder}
        />
      ) : (
        <input 
          type="text" 
          className={styles["custom-input"]} 
          value={value} 
          onChange={handleChange}
          placeholder={placeholder}
        />
      )
    ) : (
      <div className={`view-box ${isTextArea ? 'view-textarea' : ''}`}>
        {value || <span className={styles["placeholder-text"]}>{placeholder}</span>}
      </div>
    )}
  </div>
);
};

export default InputGroup;