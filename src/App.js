import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import{
	AppBanner,
    LoginScreen,
    RegisterScreen,
} from './components'

const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>              
                    <AppBanner />
                    <Switch>
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                    </Switch>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App
// import React, {useState, useEffect} from 'react'
// import axios from 'axios';



// const App = function () {
// 	const [users, setUsers] = useState([]);

// 	const [username, setUsername] = useState("");
// 	const [email, setEmail] = useState("");
// 	useEffect(() => {
// 		axios
// 			.get("https://blankmap-server-6de6d45e4291.herokuapp.com/api/users")
// 			.then((users) => setUsers(users.data))
// 			.catch((err) => console.log(err));
// 	}, []);

// 	function submitForm(event) {
//     event.preventDefault();
// 		if (username === "") {
// 			alert("Please fill the username field");
// 			return;
// 		}
// 		if (email === "") {
// 			alert("Please fill the email field");
// 			return;
// 		}
//     // https://blankmap-server-6de6d45e4291.herokuapp.com:5000/api/users // http://localhost:8000/api/users
// 		axios
// 			.post("https://blankmap-server-6de6d45e4291.herokuapp.com/api/users", {
// 				name: username,
// 				email: email,
// 			})
// 			.then(function () {
// 				alert("Account created successfully");
//         window.location.reload();
// 				// window.location.reload();
// 			})
// 			.catch(function () {
// 				alert("Could not creat account. Please try again");
// 			});
// 	}
// 	return (
// 		<>
// 			<h1>My Project</h1>
// 			{users === null ? (
// 				<p>Loading...</p>
// 			) : users.length === 0 ? (
// 				<p>No user available</p>
// 			) : (
// 				<>
// 					<h2>Available Users</h2>
// 					<ol>
// 						{users.map((user, index) => (
// 							<li key={index}>
// 								Name: {user.name} - Email: {user.email}
// 							</li>
// 						))}
// 					</ol>
// 				</>
// 			)}

// 			<form onSubmit={submitForm}>
// 				<input
// 					onChange={(e) => setUsername(e.target.value)}
// 					type="text"
// 					placeholder="Enter your username"
// 				/>
// 				<input
// 					onChange={(e) => setEmail(e.target.value)}
// 					type="text"
// 					placeholder="Enter your email address"
// 				/>
// 				<input type="submit" />
// 			</form>
// 		</>
// 	);
// };
// export default App
