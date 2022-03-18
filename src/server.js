import { createServer } from "miragejs"

let tasks = [
  { id: 1, text: "Buy wheat", done: false },
  { id: 2, text: "Make bread", done: false },
]

createServer({
  routes() {
    this.namespace = "api"
     this.post("/tasks", (schema, request) => {
      let attrs = JSON.parse(request.requestBody)
      attrs.id = Math.floor(Math.random() * 100)
      tasks.push(attrs)
      return { task: attrs }
    })
    this.get("/tasks", () => {
      return {
        tasks
      }
    })
     
    this.get("/task/:search", (schema, request) => {
      try {
        const searchString = request.params.search;
        let filteredTasks = tasks.filter(item => item.text.toLowerCase().includes(searchString.toLowerCase())) 
        return filteredTasks
      }catch (err) {
        } 
    })

    this.patch("/tasks/:id", (schema, request) => {
      try { 
        let newAttrs = JSON.parse(request.requestBody)
        let id = request.params.id
        let task = tasks.find(item=>item.id==parseInt(id));
        if (task.done === true) {
          task.done = false
      } else {
        task.done = true 
      }
        return task
      }catch (err) {
        }  
    })
    
    this.delete("/tasks/:id", (schema, request) => {
      let id = request.params.id
      let index = tasks.findIndex(task => task.id === parseInt(id))     
      return delete tasks[index];     
    })
  },
})