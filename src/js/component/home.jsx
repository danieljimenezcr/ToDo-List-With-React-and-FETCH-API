import React, { useState, useEffect } from "react";

//create your first component

const Home = () => {

	const [toDos, setTodos] = useState([]);
	const [inputTask, setInputTask] = useState("");


	//Component DId Mount
	useEffect(async () => {

			//Si la lista no esta definida, se debe cargar
			try {
				let response = await fetch("https://assets.breatheco.de/apis/fake/todos/user/danieljimenezcr");
				if (response.status == 404) {
					//Ocurre si la lista no existe o fue eliminada	
					console.info("lista vacia")
					return
				} else if (!response.ok) {
				  throw response.status == 404
				}
				let data = await response.json()
				setTodos(data)
			} catch (error) {
				console.log("error")
			}
			return
		}, []);

	//componentDidUpdate	
	useEffect(async () => {
		//Actualizacion de Lista, se deberia actualizar la API
		if (toDos.length > 0){
			try {
				let response = await fetch("https://assets.breatheco.de/apis/fake/todos/user/danieljimenezcr", {
					method: "PUT",
					body: JSON.stringify(toDos),
					headers: {
						"Content-Type": "application/json",
					},
				}
				);
				if (!response.ok) {
					throw response.statusText
				}
			} catch (error) {
				console.log("error")
			}
			//De lo contrario se actualiza
		}
	}, [inputTask])

	async function addNewTask(e) {
		if (e.key == "Enter" && inputTask != "") {

			//Si la lista esta vacia, hay que iniciarlizarla 
			if (toDos.length == 0) {
				try {
					let response = await fetch("https://assets.breatheco.de/apis/fake/todos/user/danieljimenezcr", {
						method: "POST",
						body: JSON.stringify([{label:inputTask, done:false}]),
						headers: {
							"Content-Type": "application/json",
						}
					})
					if (!response.ok) {
						throw response.statusText
					}
				} catch (error) {
					console.log("error")
				}
			}
			setTodos([...toDos, {label:inputTask, done:false}]);
			setInputTask("");
		}
	}

	async function deleteTask(i) {

		let newTodos = [...toDos]
		newTodos.splice(i, 1)
		setTodos(newTodos)
		// setTodos(toDos.filter((i, selectedIndex) => index != selectedIndex));
	if (toDos.length == 0) {
			try {
				let response = await fetch("https://assets.breatheco.de/apis/fake/todos/user/danieljimenezcr",
					{
						method: "DELETE",
					});
				if (!response.ok) {
					throw response.statusText;
				}
				console.info("Item eliminado")
			} catch (error) {
				console.error("Error CS")
			}
		} 
	}


	return (

		<div className="container main-container">
			<div className="todo-container">
				<h1 className="text-center app-title"> <i className="fa-solid fa-circle-check"></i> to-do list</h1>
				<div className="input-container">
					<input
						className="input-task"
						type="text"
						onChange={(e) => setInputTask(e.target.value)}
						value={inputTask}
						onKeyDown={addNewTask}
						placeholder="Add your new task" />

				</div>
				<ul className="task-list">

					{toDos.map((task, i) => (
						<li key={i} className="task-item">
							{task.label}

							<i onClick={deleteTask} className="fa-regular fa-trash-can trash-icon"> </i>
						</li>

					))}
				</ul>

			</div>
		</div>
	);
};

export default Home;
