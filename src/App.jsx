import {useEffect, useMemo, useRef, useState, useTransition} from 'react';


const Debounce = (cb) => {
	let timerId;

	return (...args) => {
		if (timerId) {
			clearTimeout(timerId)
		}

		timerId = setTimeout(() => {
			cb(...args)
		}, 500)
	}
}

export const App = () => {

	const [productData, setProductData] = useState({});
	const [isPending, startTransition] = useTransition();

	const getProducts = async () => {
		try {
			const rawData = await fetch(`https://dummyjson.com/products?limit=100`)
			const data = await rawData.json();
			setProductData(data);
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		getProducts()
	}, []);

	const filterProducts = (e) => {
		const filter = e.target.value;
		if (!filter || filter === '') {
			startTransition(() => {
				getProducts();
				return;
			})
		}

		startTransition(async () => {
			try {
				const data = await fetch(`https://dummyjson.com/products/search?q=${filter}&limit=0`);
				if (!data.ok) {
					throw new Error('Error filter product')
				}
				const products = await data.json();
				console.log('product', products)
				setProductData(products)
			} catch (err) {
				console.log(err);
			}
		})
	}

	const debouncedSearch = useMemo(() => Debounce(filterProducts), [])


	return (
			<div style={{padding: "24px"}}>
				<div style={{padding: '12px'}}>
					<label htmlFor="filter">Filter products: </label>
					<input type="text" id="filter" onChange={debouncedSearch}/>
					{/* Можно добавить маленький индикатор загрузки рядом с инпутом */}
					{isPending && <span style={{marginLeft: "10px", color: "blue"}}>Updating...</span>}
				</div>

				{/* Оставляем список в DOM, но делаем его полупрозрачным во время поиска */}
				<div style={{opacity: isPending ? 0.4 : 1, transition: "opacity 0.2s"}}>
					{productData?.products?.map((p) => {
						return (
								<div key={p.id}>
									<hr/>
									<h3>{p.title}</h3>
									<p>{p.description}</p>
									<p>{p.category}</p>
								</div>
						);
					})}
				</div>
			</div>
	);
};
