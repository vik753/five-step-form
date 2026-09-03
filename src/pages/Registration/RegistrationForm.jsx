import "../../styles/registration.css"
import {Outlet, useLocation, useNavigate} from "react-router";

export const RegistrationForm = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const steps = ["/", "/step1", "/step2", "/step3", "/step4"]
	const isRootPage = location.pathname === "/";

	const handleNextPage = () => {
		const currentPath = location.pathname;
		navigate(steps[steps.indexOf(currentPath) + 1]);
	}

	const handlePrevPage = () => {
		const currentPath = location.pathname;
		navigate(steps[steps.indexOf(currentPath) - 1]);
	}

	return (
			<div className="registration-form wrapper">
				<header className="header container">
					<h1>Registration Form:</h1>
				</header>
				{isRootPage ? <div>
					<p>If you are not registered, fill the registration form, please.</p>
					<button onClick={handleNextPage}>"Fill the form"</button>
				</div> : <>
					<Outlet/>
					<footer className="footer container">
						<button className={isRootPage && "hidden"} onClick={handlePrevPage} disabled={location.pathname === steps[0]}>Prev page</button>
						<button className={location.pathname === steps[steps.length - 1] && "hidden"} onClick={handleNextPage}>{isRootPage ? "Fill the form" : "Next page"}</button>
					</footer>
				</>}

			</div>
	);
};
