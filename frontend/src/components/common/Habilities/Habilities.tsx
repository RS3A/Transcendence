import React, { useState, useEffect } from 'react';
import skillsData from './Habilities.json';
import styles from './Habilities.module.css';

interface Skill {
  id: string;
  name: string;
}

interface HabilitiesProps {
  selectedSkills: Skill[];
  onSkillsChange?: (skills: Skill[]) => void;
  isEditable?: boolean;
  title?: string;
}

const Habilities: React.FC<HabilitiesProps> = ({
  selectedSkills,
  onSkillsChange,
  isEditable = false,
  title = "Habilidades"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Skill[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }
    const filtered = skillsData.skills.filter(skill =>
      skill.name.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
      !selectedSkills.find(s => s.id === skill.id)
    );
    setSuggestions(filtered);
  }, [searchTerm, selectedSkills]);

  const addSkill = (skill: Skill) => {
    if (selectedSkills.length >= 15) return;
    const updated = [...selectedSkills, skill];
    onSkillsChange?.(updated);
    setSearchTerm(''); // Limpa o campo e fecha o dropdown
  };

  const removeSkill = (id: string) => {
    if (!isEditable) return;
    const updated = selectedSkills.filter(s => s.id !== id);
    onSkillsChange?.(updated);
  };

  return (
    <div className={styles.perfilHabilidades}>
      <h3 className={styles.perfilHabilidadesTitulo}>{title}</h3>

      {isEditable && (
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Adicionar habilidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.perfilHabilidadesInput}
          />
          {suggestions.length > 0 && (
            <ul className={styles.perfilHabilidadesSugestoes}>
              {suggestions.map(skill => (
                <li key={skill.id} onClick={() => addSkill(skill)}>
                  {skill.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className={styles.perfilHabilidadesLista}>
        {selectedSkills.map((skill) => (
          <span 
            key={skill.id} 
            className={`perfil-habilidade-tag ${isEditable ? 'clicavel' : ''}`}
            onClick={() => removeSkill(skill.id)}
          >
            {skill.name}
            {isEditable && <span className={styles.tagRemover}>×</span>}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Habilities;