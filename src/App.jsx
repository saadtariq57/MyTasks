import { useEffect, useRef, useState } from 'react'
import Button from './components/Button';
import { appwriteServices } from './appwrite/database';

function App() {
  document.body.style.backgroundColor = "#1E1E1E";
  document.body.style.color = "white";

  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])

  const [updateId, setUpdateId] = useState("")
  const [updateBtn, setUpdateBtn] = useState(false)

  const [showCompleted, setShowCompleted] = useState(false)

  const addInputRef = useRef(null)


  const addTask = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (task.trim() === '') return;
      if (updateBtn) {
        updateTask(task)
      }
      else {
        appwriteServices.createTask({ taskContent: task, isCompleted: false }).then((newTask) => {
          setTask("")
          setTasks([...tasks, newTask])
        })
      }
    }
  }

  const deleteTask = async (taskId) => {
    const userConfirmed = confirm("Do you want to delete this task?")
    if (userConfirmed) {
      appwriteServices.deleteTask(taskId).then(() => {
        setTasks(tasks.filter((x) => (
          x.$id !== taskId)))
      })
    }
  }

  const updateStart = (taskId, taskContent) => {
    setUpdateId(taskId)
    setTask(taskContent)
    addInputRef.current.focus()
    setUpdateBtn(true)

  }
  const updateTask = (task) => {
    appwriteServices.updateTask(updateId, { taskContent: task }).then(() => {
      setUpdateBtn(false)
      setTask("")
      setTasks(tasks.map(x => (
        x.$id === updateId ? { ...x, taskContent: task } : x
      )))
      setUpdateId("")
    })
  }

  const toggleComplete = (id) => {
    const stateUpdate = tasks.map(task =>
      task.$id === id ? { ...task, isCompleted: !task.isCompleted } : task
    )
    setTasks(stateUpdate)

    const currentTask = stateUpdate.find(task => task.$id === id)
    appwriteServices.updateIsCompleted(id, { isCompleted: currentTask.isCompleted })
  }

  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted)
  }

  useEffect(() => {
    addInputRef.current.focus()
    appwriteServices.getTasks().then((tasks) => setTasks(tasks.documents))
  }, [])


  return (
    <>
      <nav className='bg-[#6cdbe3] p-3'>
        <span className='text-white font-bold text-2xl ml-6 text-shadow-outline-white'>MyTasks</span>
      </nav>

      <h1 className='text-2xl font-bold text-center mt-10'>Add a task</h1>
      <div className="flex justify-center gap-4 mt-4">
        <input
          type="text"
          placeholder='Enter a task'
          className='bg-white px-2 rounded-md w-3/5 text-black'
          ref={addInputRef}
          onKeyDown={addTask}
          value={task}
          onChange={e => setTask(e.target.value)} />

        {updateBtn ?
          <Button bgColor="#6cdbe3" text="Update" onClick={() => updateTask(task)} /> :
          <Button bgColor="#6cdbe3" text="Add" onClick={addTask} />
        }
      </div>


      <h1 className='text-3xl font-bold text-center mt-16 mb-8'>Your Tasks</h1>
      <div className="flex items-center gap-2 ml-52 mb-4">
        <input type="checkbox" checked={showCompleted} onChange={toggleShowCompleted} />
        <span>Show completed tasks</span>
      </div>

      {
        tasks.length === 0 ? <h1 className='text-center text-3xl font-bold'>No tasks to display</h1> :
          (tasks.map((task) => (
            (showCompleted || !task.isCompleted) &&
            <div key={task.$id} className='flex gap-2 justify-center my-5'>
              <input type="checkbox" className='w-4' checked={task.isCompleted} onChange={() => toggleComplete(task.$id)} />
              <div className={task.isCompleted ?
                "line-through bg-white text-black px-2 rounded-md w-3/5 flex items-center" :
                "bg-white text-black px-2 rounded-md w-3/5 flex items-center"}>{task.taskContent}</div>
              <Button bgColor="#B6C4BF" text="Edit" onClick={() => updateStart(task.$id, task.taskContent)} />
              <Button bgColor="red" text="Delete" onClick={() => deleteTask(task.$id)} />
            </div>
          )))
      }

    </>
  )
}

export default App
