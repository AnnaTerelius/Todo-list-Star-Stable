import { createServer } from "miragejs"

let tasks = [
  { id: 1, text: "Buy ... wheat", done: false },
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
        console.log("hejsan!")
        console.log(request)
        const searchString = request.params.search;
        console.log(searchString)
        let filteredTasks = tasks.filter(item => item.text.toLowerCase().includes(searchString.toLowerCase())) 
        console.log(filteredTasks)
        return filteredTasks
      }catch (err) {
        console.log(err)
        } 
    })

    /*this.get("/task/:search", (req, res) => {
      console.log("hejsan!")
      const searchString = req.query.search;
      let filteredTask = tasks.filter(item => {
        const itemText = item.text.toString();
        return itemText.toLowerCase().includes(filteredTask.toLowerCase())
      });
      res.json(itemText)
    });*/


    //PATCH = PUT?
    this.patch("/tasks/:id", (schema, request) => {
      try { 
        let newAttrs = JSON.parse(request.requestBody)
        let id = request.params.id
        console.log(id)
        console.log(tasks)
        let task = tasks.find(item=>item.id==id);
        if (task.done === true) {
          task.done = false
      } else {
        task.done = true 
      }
        return task
      }catch (err) {
        console.log(err)
        }  
    })
    

    this.delete("/tasks/:id", (schema, request) => {
      let id = request.params.id
      console.log(id)
      let index = tasks.findIndex(task => task.id === id)
      
      return delete tasks[index];
      
    })
  },
})