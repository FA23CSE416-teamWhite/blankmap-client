import './App.css';
import { React } from 'react'
import { BrowserRouter,Router,Routes, Route} from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import{
	AppBanner,
    HomeScreen,
    LoginScreen,
    RegisterScreen,
    PasswordRecovery,
    MapCreationPage,
    MapDetailScreen,
    MyMapScreen,
    MyInfoScreen,
    MessageCenter,
    MapEdit,
    MapEditHeat,
    RegionalEdit,
} from './components'
import IconBanner from './components/IconBanner';
const sampleMapDetails = {
    "1": {
      title: "Cat's Masterpiece",
      description: "Through the combined knowledge of all the felines in the world, we have created a masterpiece for the public",
      author: "Cat",
      tags: ["tag1", "tag2", "tag3"],
      mapImage: './components/images/temp_map.png',
      comments: ["Comment 1", "Comment 2"],
      createdDate: "10/25/2015",
    },
    "2": {
      title: "Map 2",
      description: "Description for Map 2",
      author: "Author 2",
      tags: ["tag4", "tag5", "tag6"],
      mapImage: "url-to-map-image-2.jpg",
      comments: ["Comment 3", "Comment 4"],
    },
    // Add more map details as needed
  };
const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider> 
                    <IconBanner/>           
                    <AppBanner />
						{/* <Router> */}
							<Routes>
                                <Route index element={<LoginScreen />} />
								<Route path="/login" element={<LoginScreen />} />
								<Route path="/register" element={<RegisterScreen />} />
                                <Route path="/home" element={<HomeScreen />} />
                                <Route path="/create" element={<MapCreationPage />} />
                                <Route path="/detail" element={<MapDetailScreen mapDetails={sampleMapDetails["1"]} />} />
                                <Route path="/profile" element={<MyInfoScreen />} />
                                <Route path="/profile/my-maps" element={<MyMapScreen />} />
                                <Route path="/profile/personal-information" element ={<MyInfoScreen />} />
                                <Route path="/profile/message-center" element ={<MessageCenter />} />
                                <Route path="/edit" element ={<MapEdit />} />
                                <Route path="/forgot" element={<PasswordRecovery />} />
                                <Route path="/sign-out" element={<LoginScreen />} />
                                <Route path="/edit-heat" element={<MapEditHeat />} />
                                <Route path="/regional-edit" element={<RegionalEdit />} />
							</Routes>
						{/* </Router> */}
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
