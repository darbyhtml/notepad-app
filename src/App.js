import React, { useState } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);          // Массив заметок: каждая заметка — объект {id, text}
  const [selectedNoteId, setSelectedNoteId] = useState(null); // id выбранной заметки
  const [searchTerm, setSearchTerm] = useState(''); // Строка поиска
  const [newNoteText, setNewNoteText] = useState(''); // Текст для создания новой заметки

  // Фильтрованные заметки для отображения (на основе поиска)
  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Найдём текущую выбранную заметку
  const selectedNote = notes.find(note => note.id === selectedNoteId);

  // Создание новой заметки
  const addNote = () => {
    const trimmed = newNoteText.trim();
    if (trimmed !== '') {
      const newNote = {
        id: Date.now(), // уникальный id на основе времени
        text: trimmed
      };
      setNotes([...notes, newNote]);
      setNewNoteText('');
      setSelectedNoteId(newNote.id); // сразу выбрать новую заметку
    }
  };

  // Удаление заметки
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    // Если удаляем выбранную заметку, сбросим выбор
    if (id === selectedNoteId) {
      setSelectedNoteId(null);
    }
  };

  // Обновление текста выбранной заметки при редактировании в textarea
  const updateSelectedNoteText = (newText) => {
    if (selectedNote) {
      const updatedNotes = notes.map(note =>
        note.id === selectedNoteId ? { ...note, text: newText } : note
      );
      setNotes(updatedNotes);
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Мои записи</h2>
        {/* Поле поиска */}
        <input
          className="search-input"
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Список заметок */}
        <ul className="notes-list">
          {filteredNotes.map(note => (
            <li
              key={note.id}
              className={`note-item ${note.id === selectedNoteId ? 'selected' : ''}`}
              onClick={() => setSelectedNoteId(note.id)}
            >
              {/* Отображаем первые несколько символов или всю заметку */}
              <span className="note-text">{note.text.slice(0, 20) + (note.text.length > 20 ? '...' : '')}</span>
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); // чтобы не срабатывало выделение при нажатии на удаление
                  deleteNote(note.id);
                }}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>

        {/* Поле для создания новой заметки */}
        <div className="new-note-section">
          <textarea
            className="new-note-textarea"
            placeholder="Новый текст заметки..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
          />
          <button className="add-note-btn" onClick={addNote}>Добавить заметку</button>
        </div>
      </div>

      <div className="main-area">
        {selectedNote ? (
          <>
            <h2>Текущая заметка</h2>
            <textarea
              className="note-textarea"
              value={selectedNote.text}
              onChange={(e) => updateSelectedNoteText(e.target.value)}
            />
          </>
        ) : (
          <div className="no-note-selected">
            Выберите заметку слева или создайте новую.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
