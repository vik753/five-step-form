import "./App.css";
import {RegistrationForm} from "@/pages/Registration/RegistrationForm.jsx";
import {BrowserRouter, Routes, Route} from "react-router";
import {Step1Personal} from "@/pages/Registration/steps/Step1Personal.jsx";
import {Step2Address} from "@/pages/Registration/steps/Step2Address.jsx";
import {Step3Additional} from "@/pages/Registration/steps/Step3Additional.jsx";
import {Step4Review} from "@/pages/Registration/steps/Step4Review.jsx";


function App() {


	return (
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<RegistrationForm/>}>
						<Route path="step1" element={<Step1Personal/>}/>
						<Route path="step2" element={<Step2Address/>}/>
						<Route path="step3" element={<Step3Additional/>}/>
						<Route path="step4" element={<Step4Review/>}/>
					</Route>

				</Routes>
			</BrowserRouter>
	);
}

export default App;
