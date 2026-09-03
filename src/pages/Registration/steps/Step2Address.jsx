import React from 'react';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const secondStepSchema = yup.object().shape({
	country: yup.string().required('Country is required'),
	city: yup.string().required().min(2),
	street: yup.string().required(),
	apartment: yup.string().required(),
	zip: yup.string().required(),
})

export const Step2Address = () => {
	const getInitialValues = () => {
		const step2Data = localStorage.getItem("step2Data");
		if (!step2Data) {
			return {country: "", city: "", street: "", apartment: "", zip: ""};
		}

		const parsedData = JSON.parse(step2Data);
		return {
			country: parsedData.step2?.country || "",
			city: parsedData.step2?.city || "",
			street: parsedData.step2?.street || "",
			apartment: parsedData.step2?.apartment || "",
			zip: parsedData.step2?.zip || "",
		};
	};

	const {
		register,
		handleSubmit,
		formState: {errors, isSubmitting, isValid, isDirty},
	} = useForm({
		resolver: yupResolver(secondStepSchema),
		mode: "onChange",
		defaultValues: getInitialValues(),
	});

	const onSubmit = (data) => {
		const step2Data = {step2: {...data}};
		localStorage.setItem("step2Data", JSON.stringify(step2Data));
		const step1Data = localStorage.getItem("step1Data");
		if (step1Data) {
			const parsedData = JSON.parse(step1Data);
			const resultData = {
				...parsedData.step1,
				address: {...data}
			}
			localStorage.setItem("resultData", JSON.stringify(resultData));
		}
	}

	return (
			<div className={'step-wrapper'}>
				<h2>Address:</h2>
				<form className={'form'} onSubmit={handleSubmit(onSubmit)}>
					<div className={'input-wrapper'}>
						<label htmlFor="country">Country:</label>
						<input type="text" id="country" {...register('country')} />
					</div>
					{errors.country && <span className={'error'}>{errors.country.message}</span>}
					<div className={'input-wrapper'}>
						<label htmlFor="city">City:</label>
						<select id="city" {...register('city')} >
							{" "}
							<option value="">Select city</option>
							<option value="Kyiv">Kyiv</option>
							<option value="Odessa">Odessa</option>
							<option value="Ivano Frankivsk">Ivano Frankivsk</option>
						</select>
					</div>
					{errors.city && <span className={'error'}>{errors.city.message}</span>}
					<div className={'input-wrapper'}>
						<label htmlFor="street">Street:</label>
						<input type="text" id="street" {...register('street')} />
					</div>
					{errors.street && <span className={'error'}>{errors.street.message}</span>}
					<div className={'input-wrapper'}>
						<label htmlFor="apartment">Apartment:</label>
						<input type="text" id="apartment" {...register('apartment')} />
					</div>
					{errors.apartment && <span className={'error'}>{errors.apartment.message}</span>}
					<div className={'input-wrapper'}>
						<label htmlFor="zip">Zip:</label>
						<input type="text" id="zip" {...register('zip')} />
					</div>
					{errors.zip && <span className={'error'}>{errors.zip.message}</span>}

					<button type={'submit'} className={'btn-form submit'} disabled={!isValid || !isDirty || isSubmitting}>{isSubmitting ? "Saving..." : "Submit this step"}</button>
				</form>
			</div>
	);
};
