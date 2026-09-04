import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import {Eye, EyeOff} from 'lucide-react';
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useNavigate} from "react-router";

const firstStepSchema = yup.object().shape({
	firstname: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters').matches(/^[\p{L}\s]/u, "Only letters are allowed"),
	lastname: yup.string().required().min(2).matches(/^[\p{L}\s]/u, "Only letters are allowed"),
	email: yup.string().required().email(),
	password: yup.string().required().min(8).matches(
			/^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[^\p{L}\p{N}\s])[\s\S]*$/u,
			"The password must contain uppercase, lowercase letters, a number and any special character."
	),
	confirmPassword: yup.string().required().oneOf([yup.ref("password"), null], "Passwords must match"),
})


export const Step1Personal = () => {
	const navigate = useNavigate();

	const getInitialValues = () => {
		const step1Data = localStorage.getItem("step1Data");
		if (!step1Data) {
			return {firstname: "", lastname: "", email: ""};
		}

		const parsedData = JSON.parse(step1Data);
		return {
			firstname: parsedData.step1?.firstname || "",
			lastname: parsedData.step1?.lastname || "",
			email: parsedData.step1?.email || "",
			password: "",
			confirmPassword: "",
		};
	};

	const {
		register,
		handleSubmit,
		setError,
		formState: {errors, isSubmitting, isValid, isDirty},
	} = useForm({
		resolver: yupResolver(firstStepSchema),
		mode: "onChange",
		defaultValues: getInitialValues(),
	});


	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	const onSubmit = async (data) => {
		try {
			const formData = {...data};

			const isPassCorrect = await new Promise((resolve) => {
				setTimeout(() => {
					resolve(formData.password === formData.confirmPassword);
				}, 1000)
			})

			if (!isPassCorrect) {
				setError("confirmPassword", {type: "manual", message: "Passwords do not match"});
				return;
			}

			delete formData.confirmPassword;
			const step1Data = {step1: formData};
			localStorage.setItem("step1Data", JSON.stringify(step1Data));

			navigate("/step2");
		} catch (err) {
			console.log(err);
		}
	}

	return (
			<div className={'step-wrapper'}>
				<h2>Personal information: </h2>
				<form className={'form'} onSubmit={handleSubmit(onSubmit)}>
					<div className={'input-wrapper'}>
						<label htmlFor="firstname">First name:</label>
						<input type="text" id="firstname" {...register('firstname')} />
					</div>
					{errors.firstname && <span className={'error'}>{errors.firstname.message}</span>}
					<div className={'input-wrapper'}>
						<label htmlFor="lasttname">Last name:</label>
						<input type="text" id="lasttname" {...register('lastname')} />
					</div>
					{errors.lastname && <span className={'error'}>{errors.lastname.message}</span>}
					<div className={'input-wrapper'}>
						<label htmlFor="email">Email:</label>
						<input type="text" id="email" {...register('email')} />
					</div>
					{errors.email && <span className={'error'}>{errors.email.message}</span>}
					<div className={'input-wrapper'}>
						<label htmlFor="password">Password:</label>
						<span>
							<input className={'pass-input'} type={showPassword ? "text" : "password"} id="password" {...register('password')} />
							<button title={'show password'} type="button" className={'btn-eye'} onClick={togglePasswordVisibility} aria-label={showPassword ? 'Hide password' : 'Show password'}>
								{showPassword ? <EyeOff size={10}/> : <Eye size={10}/>}
							</button>
						</span>
					</div>
					{errors.password && <span className={'error'}>{errors.password.message}</span>}
					<div className={'input-wrapper'}>
						<label htmlFor="confirmPassword">Confirm password:</label>
						<input type={showPassword ? "text" : "password"} id="confirmPassword" {...register('confirmPassword')} />
					</div>
					{errors.confirmPassword && <span className={'error'}>{errors.confirmPassword.message}</span>}

					<button type={'submit'} className={'btn-form submit'} disabled={!isValid || !isDirty || isSubmitting}>{isSubmitting ? "Saving..." : "Submit this step"}</button>
				</form>
			</div>
	)
};
