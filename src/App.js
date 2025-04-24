import React, { useState, useEffect } from 'react';
import './styles.css';


function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [trash, setTrash] = useState([]);
  const [filter, setFilter] = useState('all');


  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const handleAddTask = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, { text: task, completed: false }]);

      setTask('');
    }
    
  };

  const handleDeleteTask = (indexToDelete) => {
    const deletedTask = tasks[indexToDelete];
    setTrash([...trash, deletedTask]); // la mandamos a la papelera
    setTasks(tasks.filter((_, index) => index !== indexToDelete)); // la quitamos de la lista visible
  };
  
  const toggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const restoreTask = (indexToRestore) => {
    const restoredTask = trash[indexToRestore];
    setTasks([...tasks, restoredTask]);
    setTrash(trash.filter((_, index) => index !== indexToRestore));
  };
  const deleteFromTrash = (indexToDelete) => {
    setTrash(trash.filter((_, index) => index !== indexToDelete));
  };
  
  const restoreAll = () => {
    setTasks([...tasks, ...trash]); // agrega todas las tareas de la papelera a la lista
    setTrash([]); // vacía la papelera
  };
  
 
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });
  

  return (
    <div className="container">
      <h1>ToDo App 📝</h1>

      <input
        type="text"
        placeholder="Escribe una tarea"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAddTask();
          }
        }}
        
      />
      
      <button onClick={handleAddTask}>Agregar</button>
      <div className="filters">
  <button
    className={filter === 'all' ? 'active' : ''}
    onClick={() => setFilter('all')}
  >
    Todos
  </button>
  <button
    className={filter === 'completed' ? 'active' : ''}
    onClick={() => setFilter('completed')}
  >
    Completados
  </button>
  <button
    className={filter === 'pending' ? 'active' : ''}
    onClick={() => setFilter('pending')}
  >
    Pendientes
  </button>
</div>

<ul>
  
  {filteredTasks.map((t, index) => (
    <li
      key={index}
      style={{ textDecoration: t.completed ? 'line-through' : 'none' }}
    >
      <span onClick={() => toggleComplete(index)} style={{ cursor: 'pointer' }}>
        {t.text}
      </span>
      <button onClick={() => handleDeleteTask(index)}>
        ❌ Eliminar
      </button>
    </li>
  ))}
</ul>
<h2>Papelera 🗑️</h2>

{trash.length > 0 && (
  <>
    <button onClick={restoreAll} style={{ marginBottom: '10px', marginRight: '10px' }}>
      ♻️ Restaurar Todas
    </button>
    <button onClick={() => setTrash([])} style={{ marginBottom: '10px' }}>
      🧹 Vaciar Papelera
    </button>
  </>
)}

<ul>
  {trash.map((t, index) => (
    <li key={index} style={{ opacity: 0.6 }}>
      {t.text}
      <button onClick={() => restoreTask(index)} style={{ marginLeft: '10px' }}>
        ♻️ Restaurar
      </button>
      <button onClick={() => deleteFromTrash(index)} style={{ marginLeft: '10px' }}>
        ❌ Borrar
      </button>
    </li>
  ))}
</ul>

    </div>
  );
}

export default App;
