import { useState } from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', onClear }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{
      position: 'relative',
      display: 'flex', alignItems: 'center',
    }}>
      <div className="input-wrapper" style={{ width: '100%' }}>
        <span className="material-symbols-outlined input-icon" style={{ fontSize: 22 }}>search</span>
        <input
          type="text"
          className="input-field"
          style={{
            borderRadius: 'var(--radius-full)',
            paddingLeft: 48,
            paddingRight: value ? 44 : 20,
            boxShadow: focused ? '0 0 0 3px rgba(53,37,205,0.10)' : 'var(--glass-shadow)',
          }}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {value && (
          <button
            className="btn-icon"
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32 }}
            onClick={() => { onChange(''); onClear?.(); }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        )}
      </div>
    </div>
  );
}
