import React, {useState, useEffect} from 'react';
import logo from './starstable.png';
import './App.css';
//{tasks.filter(item => item.text.toLowerCase().includes(param.toLowerCase()))





function App() {
  const [tasks, setTasks] = useState(null);
  const [text, setText] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [param, setParam] = useState('');
  const [searchedTask, setSearchedTask] = useState('');
  const [filter, setFilter] = useState('All');

  //const FILTER_NAMES = Object.keys(FILTER_MAP);

  const FILTER_MAP = {
    All: () => true,
    Active: task => !task.done,
    Completed: task => task.done,
    Searchstring: task => task.text.toLowerCase().includes(param.toLowerCase()) 
  };

  /*const filterList = FILTER_NAMES.map(name => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));*/
 
  

  useEffect(() =>{
    fetch('/api/tasks')
    .then(res => res.json())
    .then(json => setTasks(json.tasks))
    .catch(err => console.log(err))
  }, [])

  const submitParamForm = async (event) => {
    console.log("inside submitparamform")
    event.preventDefault()
    try {
      const res = await fetch(`/api/task/${param}`)
      const json = await res.json()
      console.log(json)

      setParam('')
    }catch (err) {

    }
  }

  const submitForm = async (event) => {
    event.preventDefault()
    try {
      const res = await fetch('/api/tasks', { method: 'POST', body: JSON.stringify({"text": text, "done": false })})
      const json = await res.json()

      setTasks([...tasks, json.task])
      setText('')
    
    }catch (err) {

    }
  }

  const deleteTask = async (id) => {
    console.log("inside deleteTasks")
    console.log(id)
    try {
     await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      console.log(id)
      setTasks(tasks.filter((task) => task.id !== id))
      
    }catch (err) {
    console.log(err)
    }

  }

  const upDateBolean = async (id) => {
    console.log("inside upDateBolean...")
    console.log(id)
    const task = tasks.find((task) => task.id === id)
    if(!task) return
    try {
     const res = await fetch(`/api/tasks/${id}`, { method: 'PATCH' })
      console.log({id})
      const json = await res.json()
      console.log(res)
      console.log(json)
      const tasksCopy = [...tasks]
      const index = tasks.findIndex(task => task.id === id)
      tasksCopy[index] = json
      console.log(tasksCopy)
      setTasks(tasksCopy)
     
      console.log("done with updating")
    }catch (err) {
    console.log(err)
    }

  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <div className="to-do-background">
          <div className="form-container">
             
            {tasks?.length > 0 ? (
            <ul>
              <div className="form-header">
                <div>
                  <h1>To do</h1>
                  <div>
                <form className="form" onSubmit={submitForm}>
                  <div>
                    <input type="text" placeholder="add new task" value={text} onChange={e => setText(e.target.value)}></input>
                  </div>
                  <div>
                    <button type="submit">Add</button>
                  </div>
                </form>
              </div>
                </div>
                <form className="paramForm" onSubmit={submitParamForm}>
                  <div>
                      <input type="text" placeholder="search by text" value={param} onChange={e => {setParam(e.target.value);setFilter("Searchstring")}}></input>
                      {console.log(param)}
                  </div>
                  <form className="checkboxes">
                    <input type="checkbox" id="allTodos" name="allTodos" value="all" onClick={() => setFilter("All")}></input>
                    {console.log(filter)}
                    <label> Show all tasks</label><br></br>
                    <input type="checkbox" id="doneTodos" name="doneTodos" value="done" onClick={() => setFilter("Completed")}></input>
                    <label> Show done tasks</label><br></br>
                    <input type="checkbox" id="todo" name="todo" value="todo" onClick={() => setFilter("Active")}></input>
                    <label> Show tasks to do</label><br></br>
                  </form>
                </form>
              </div>
                {tasks.filter(FILTER_MAP[filter]).map(({id, text, done}) =>(
                  <li key={id}>
                    <div>
                      {text}
                      {done}
                    </div>
                    <div className="list-btn-container">
                      <button className="list-btn"onClick={() => deleteTask(id)}>&#10060;</button>
                      <button className="list-btn" onClick={() => upDateBolean(id)}>&#9989;</button>
                    </div>
                  </li>
                ))}
            </ul>
             ) : (
            <p> No tasks</p>
            )}
            </div>
          </div>
      </header>
    </div>
  );
}

export default App;
