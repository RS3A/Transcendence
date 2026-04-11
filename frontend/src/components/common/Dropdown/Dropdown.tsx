import React, { useState, useRef, useEffect } from "react";
import styles from './Dropdown.module.css'; 

interface DropdownListProps {
  label?: string;
  options: string[]; 
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DropdownList: React.FC<DropdownListProps> = ({
  label,
  options,
  value,
  isEditing,
  onChange,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtra as opções conforme a busca
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`dropdown-container ${isEditing ? "editing-mode" : ""}`} ref={dropdownRef}>
      {label && <label className={styles.dropdownLabel}>{label}</label>}
      
      {!isEditing ? (
        <div className={styles.dropdownStaticValue}>{value || "Não informado"}</div>
      ) : (
        <div className={styles.searchableDropdown}>
          <input
            type="text"
            className={`${styles.customInput} ${styles.dropdownSelect}`}
            placeholder={value || placeholder || "Selecione..."}
            value={isOpen ? searchTerm : value}
            onFocus={() => { setIsOpen(true); setSearchTerm(""); }}
            onChange={(e) => setSearchTerm(e.target.value)}
            readOnly={!isOpen} 
          />
          
          {isOpen && (
            <ul className={styles.dropdownOptionsList}>
              <li className={`${styles.optionItem} ${styles.resetOption}`} onClick={() => { onChange(""); setIsOpen(false); }}>
                -- Limpar Seleção --
              </li>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, i) => (
                  <li 
                    key={i} 
                    className={`option-item ${value === option ? 'selected' : ''}`}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    {option}
                  </li>
                ))
              ) : (
                <li className={styles.optionNoResults}>Nenhum resultado</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownList;