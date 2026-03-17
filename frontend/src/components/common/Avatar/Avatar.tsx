import React, { useRef } from 'react';
import { User, Pencil } from 'lucide-react';
import './Avatar.css';

interface AvatarProps {
  avatarUrl?: string;
  size?: number; // Tamanho em pixels (ex: 128)
  isEditable?: boolean;
  onImageChange?: (file: File) => void;
}

const Avatar: React.FC<AvatarProps> = ({ 
  avatarUrl, 
  size = 128, 
  isEditable = false, 
  onImageChange 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePencilClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  return (
    <div 
      className="avatar-wrapper" 
      style={{ width: size, height: size }}
    >
      <div className="perfil-avatar-base">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="Foto de perfil" 
            className="avatar-img" 
          />
        ) : (
          <User size={size / 2} color="#e5e7eb" />
        )}
      </div>

      {isEditable && (
        <>
          <button className="avatar-edit-button" onClick={handlePencilClick}>
            <Pencil size={size / 6} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};

export default Avatar;