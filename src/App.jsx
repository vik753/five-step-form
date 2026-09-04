import {useState, useTransition} from 'react';

// Имитация тяжелого массива данных
const heavyList = Array.from({length: 10000}, (_, i) => `Item ${i + 1} uuid: ${crypto.randomUUID()}`);

export const App = () => {
	const [query, setQuery] = useState('');
	const [filteredList, setFilteredList] = useState(heavyList);

	const [isPending, startTransition] = useTransition();

	const handleChange = (e) => {
		const value = e.target.value;

		// 1. СРОЧНОЕ ОБНОВЛЕНИЕ
		// Инпут обновится мгновенно, без задержек
		setQuery(value);

		// 2. НЕСРОЧНОЕ ОБНОВЛЕНИЕ (Transition)
		// React начнет фильтрацию в фоне. Если пользователь напечатает
		// следующую букву до окончания фильтрации, React прервет старую работу
		// и начнет новую.
		startTransition(() => {
			const filtered = heavyList.filter((item) => item.toLowerCase().includes(value.toLowerCase()));
			setFilteredList(filtered);
		});
	};

	return (
			<div>
				<input
						type="text"
						value={query}
						onChange={handleChange}
						placeholder="Поиск..."
				/>

				{/* Пока список фильтруется, показываем индикатор загрузки */}
				{isPending && <p>Фильтрация результатов...</p>}

				{filteredList?.length > 0 ? <ul style={{opacity: isPending ? 0.5 : 1}}>
							{filteredList.map(item => (
									<li key={item}>{item}</li>
							))}
						</ul>
						: <p>No results</p>}
			</div>
	);
};
