import axios from 'axios';
import { version } from 'react';
import { useEffect, useRef, useState } from 'react';
import '../styles/tasktracker.css'

const TaskTracker = () => {
    let [task, settask] = useState([]);
    let [value, setvalue] = useState(false)

let [kind,setkind]=useState("")
let [status,setstatus]=useState("")

    let tablename = useRef();
    let startdate = useRef();
    let enddate = useRef();
    let search_enddate = useRef();
    let search_startdate = useRef();
    let priority = useRef();

    var cd = new Date();

    const [currentPage, setCurrentPage] = useState(1);
    const [taskPerPage, setTaskPerPage] = useState(10);
    let [query, setquery] = useState('')

    const indexOfLastTask = currentPage * taskPerPage;
    const indexOfFirstTask = indexOfLastTask - taskPerPage;
    const currentvalue = task
        .filter((item) => item.tablename.toLowerCase().includes(query))
        .slice(indexOfFirstTask, indexOfLastTask);

    const pageNumbers = [];
    console.log(pageNumbers);
    for (let i = 1; i <= Math.ceil(task.length / taskPerPage); i++) {
        pageNumbers.push(i);
    }

    //! fetching Data.
    useEffect(() => {
        let fetchdata = async () => {
            let response = await axios.get('http://localhost:4002/home-data')
            let data = await response.data;
            let details = [...data]
            details = details.map((task) => {
                let result = ""
                if (new Date(task.startdate) > cd) {
                    result = "Not Yet"
                } else if (new Date(task.startdate) < new Date(task.enddate) && new Date(task.enddate) > cd) {
                    result = " in progress";
                } else {
                    result = "completed"
                }
                return { ...task, status: result }
            });

            settask(details)
        }
        fetchdata()
    }, [version, task])

    //! Adding Data.
    let Task = () => {
        let data = {
            tablename: tablename.current.value,
            startdate: startdate.current.value,
            enddate: enddate.current.value,
            priority: priority.current.value,
            addedon: new Date().toLocaleString()
        }
        console.log(data);
        axios.post(`http://localhost:4002/add`, data)
            .then(res => {
                alert(res.data.message)
                window.location.reload();
            })
            .catch(err => {
                alert(err.data.message)
            })
    }


    let prior = {
        0: "low",
        1: "medium",
        2: "high"
    }

    //! Here Deleting The Task.
    const deletingtask = (_id) => {
        if (window.confirm("Do you really want to delete it")) {
            axios.delete(`http://localhost:4002/delete-data/${_id}`);
            console.log('deleted');
        }
    }

    //! Here Editing The Data.
    let [number, setNumber] = useState("")
    let edit = (_id) => {
        axios.get(`http://localhost:4002/tasks/${_id}`)
            .then((response) => {
                console.log(response.data)
                tablename.current.value = response.data.tablename;
                startdate.current.value = response.data.startdate;
                enddate.current.value = response.data.enddate;
                priority.current.value = response.data.priority;
            })
        setvalue(true)
        setNumber(_id)
    }

    //! we Are Updating The Data Here.
    let Updating = (number) => {

        let updateTask = {
            tablename: tablename.current.value,
            startdate: startdate.current.value,
            enddate: enddate.current.value,
            priority: priority.current.value,
            addedon: new Date().toLocaleString()
        }
        console.log(updateTask)
        axios.put(`http://localhost:4002/update/${number}`, updateTask)
        alert("Task has been Updated")
        window.location.reload();
        setvalue(false)
    }

    //! Previous & Next Functions
    const displaynext = () => {
        if (currentPage < pageNumbers.length) {
            setCurrentPage(currentPage + 1);
        }
    };


    const displayprevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }
    let filters = () => {
        var selects = document.querySelector("#filter_priority");
        console.log(selects.value);
        let startDate = new Date(document.querySelector("#startdate").value);
        let endDate = new Date(document.querySelector("#enddate").value);
        console.log(startDate);
        console.log(endDate);
      
        if (selects.value === "null") {
          let a = task.filter((task) => {
            return (
              new Date(task.startdate) >= startDate &&
              new Date(task.startdate) <= endDate
            );
          });
          console.log(a);
          settask(a);
        } else {
          let a = task.filter((task) => {
            return (
              new Date(task.startdate) >= startDate &&
              new Date(task.startdate) <= endDate &&
              selects.value === task.priority
            );
          });
          console.log(a);
          settask(a);
        }
      };
      
    // let filters = () => {
    //     var selects = document.querySelector("#filter_priority");
    //     console.log(selects.value);
    //     let startDate = new Date(startdate.current.value);
    //     let endDate = new Date(enddate.current.value);
    //     console.log(startDate);
    //     console.log(endDate)

    //     if (selects.value == "null") {
    //         let a = [...task];
    //         a = a.filter((task) => { return (new Date(task.startdate) >= startDate && new Date(task.startdate) <= endDate) })
    //         console.log(a);
    //         settask(a)
    //     }
    //     else {
    //         let a = [...task];
    //         a = a.filter((task) => { return (new Date(task.startdate) >= startDate && new Date(task.startdate) <= endDate && selects.value == task.priority) })
    //         console.log(a);
    //         settask(a)
    //     }
    // }
    return (
        <section className="Task_Tracker">
            <h1 style={{ fontSize: "40px", margin: "5px", textDecoration: "underLine" }}>Task Tracker</h1>
            <div className="main">
                <div className="Add_Task">
                    <fieldset style={{ width: "500px", height: "250px", backgroundColor: "whitesmoke" }}>
                        <legend>Add New Task</legend>
                        <div className="task">
                            <label htmlFor="">Task Name:</label> <br />
                            <input type="text" name='tablename' ref={tablename} placeholder='Enter you task here ' />
                        </div>
                        <div className="Date_Time">
                            <label htmlFor="">Start Date & Time:</label> <br />
                            <input type="datetime-local" name="startdate" id="startdate" ref={startdate} required /> <br />
                            <label htmlFor="">End Date & Time:</label>  <br />
                            <input type="datetime-local" name="enddate" id="enddate" ref={enddate} required />
                        </div>
                        <div className="Priority">
                            <label htmlFor="">Priority:</label> <br />
                            <select ref={priority}>
                                <option>Select Priority</option>
                                <option value="0">Low</option>
                                <option value="1">Medium</option>
                                <option value="2">High</option>
                            </select> <br />
                        </div> <br />
                        <div className="Add">
                            {
                                value === false ? <button onClick={() => Task()} >Add Task</button> :
                                    <button onClick={() => Updating(number)}  >Update</button>
                            }
                        </div>
                    </fieldset>
                </div>

                <div className="search">

                    <h1 style={{ fontSize: "40px", margin: "5px", textDecoration: "underLine" }}>Search Task</h1>
                    {/* <label htmlFor="">Search:</label> */}
                    <input type="text" placeholder='Search Your Task Here' width="55px" height="55px" value={query} onChange={(e) => setquery(e.target.value)} />
                </div>
                <div className="status">
                <h1 style={{ margin: "0px", fontSize: "40px", textDecoration: "underLine" }}> Select Status</h1>
                <label htmlFor="">Completed</label>
                <input type="radio" id='completed' name='status' onClick={()=>setstatus("completed")} />
                <label htmlFor="">Not Yet</label>
                <input type="radio" id='completed'  name='status' onClick={()=>setstatus("not completed")}/>
                <h1 style={{ margin: "0px", fontSize: "40px", textDecoration: "underLine" }}> Select Priority</h1>
                <label htmlFor="high">High</label>
                <input type="radio"  id='high' name='kind' onClick={()=>{setkind("high")}}/>
                <label htmlFor="medium">Medium</label>
                <input type="radio" id='medium' name='kind' onClick={()=>{setkind("medium")}} />
                <label htmlFor="low">Low</label>
                <input type="radio" id='low'  name='kind' onClick={()=>{setkind("low")}} />
                </div>


                <section className='Filter_Taskk'>

                    {/* <fieldset style={{ width: "500px", height: "250px", backgroundColor: "whitesmoke" }} > */}
                       

                        {/* <p style={{ margin: "0px", textDecorationLine: 'underline' }}> Aplly Filter</p> */}
                        {/* <select name="" id="filter_priority" style={{ width: "150px" }} >
                            <option value="null">Select Priority</option>
                            <option value="0">Low</option>
                            <option value="1">Medium</option>
                            <option value="2">High</option>
                        </select> */}
                        <div className="Date_Time">
                            <label htmlFor="">Start Date & Time:</label>
                            <input type="datetime-local" name="startdate" id="startdate" ref={search_startdate} required /> 
                            <label htmlFor="">End Date & Time:</label>
                            <input type="datetime-local" name="enddate" id="enddate" ref={search_enddate} required />
                        </div> <br />
                        <div className="Button_Tag">
                            <button onClick={()=>filters} >Apply Filter</button>
                        </div>
                    {/* </fieldset> */}
                </section>
            </div>
            <hr />

            <table width="100%" align="center" border="4px">
                <thead>
                    <th>SL NO</th>
                    <th>Task Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Added On</th>
                    <th>Action</th>
                </thead>
                <tbody>
                    {
                    currentvalue.map(({ tablename, startdate, enddate, priority, status, _id, addedon }, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{tablename}</td>
                                <td>{new Date(startdate).toLocaleString()}</td>
                                <td>{new Date(enddate).toLocaleString()}</td>
                                <td>{prior[priority]}</td>
                                <td>{status}</td>
                                <td>{addedon}</td>
                                <td className="but">
                                    {(status !== "completed" || status === "Not Yet" || status === "in progress") && <button onClick={() => edit(_id)} className="edit">Edit</button>}
                                    {(status !== "completed" && status === "Not Yet") && <button style={{ marginLeft: "9px" }} onClick={() => deletingtask(_id)} >Delete</button>}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <div className="Next_Pre">
                <button className='prev' onClick={() => displayprevious()}>&larr;Previous</button>
                <button style={{ marginLeft: "3px" }} className='next' onClick={() => displaynext()}>Next&rarr;</button>
            </div>



        </section>
    );
}

export default TaskTracker;