import {useEffect, useState, useOptimistic, useTransition, useRef} from 'react';

export const App = () => {
	// 1. Реальный стейт (база правды)
	const [comments, setComments] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// 2. Хук useTransition для ручного управления асинхронной транзакцией
	const [isPending, startTransition] = useTransition();

	const formRef = useRef(null);

	// Первоначальная загрузка данных
	useEffect(() => {
		fetch('https://dummyjson.com/comments?limit=5')
				.then((res) => res.json())
				.then((data) => {
					setComments(data.comments);
					setIsLoading(false);
				});
	}, []);

	// 3. Настраиваем оптимистичный UI
	const [optimisticComments, addOptimisticComment] = useOptimistic(
			comments,
			(currentComments, newText) => [
				...currentComments,
				{
					id: Math.random().toString(),
					body: newText,
					user: {username: 'Вы (отправка...)'},
					isSending: true,
				},
			]
	);

	// Функция для реального запроса на сервер
	const handleAddComment = async (text) => {
		const response = await fetch('https://dummyjson.com/comments/add', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				body: text,
				postId: 3,
				userId: 5,
			}),
		});

		if (!response.ok || Math.random() > 0.3) throw new Error('Ошибка сервера');

		const newComment = await response.json();

		// Искусственная пауза, чтобы разглядеть процесс в UI
		await new Promise(resolve => setTimeout(resolve, 1000));

		setComments((prev) => [...prev, newComment]);
	};

	// 4. Классический обработчик onSubmit
	const handleSubmit = (e) => {
		e.preventDefault(); // Отменяем перезагрузку страницы

		// Достаем данные из формы
		const formData = new FormData(e.target);
		const text = formData.get('body');

		if (!text || text.trim() === '') return;

		// Очищаем форму мгновенно, чтобы пользователь мог писать дальше
		formRef.current.reset();

		// 5. Оборачиваем весь процесс в startTransition
		startTransition(async () => {
			// Оптимистичное обновление UI ДОЛЖНО быть внутри startTransition
			addOptimisticComment(text);

			try {
				await handleAddComment(text);
			} catch (error) {
				console.error('Ошибка:', error);
				alert('Не удалось отправить комментарий!');
			}
		});
	};

	if (isLoading) return <p style={{padding: '24px'}}>Загрузка комментариев...</p>;

	return (
			<div style={{padding: '24px', maxWidth: '600px'}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
					<h2>Комментарии</h2>
					{/* Используем isPending из useTransition для показа глобального статуса */}
					{isPending && <span style={{color: 'blue', fontSize: '14px'}}>Синхронизация...</span>}
				</div>

				<div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px'}}>
					{optimisticComments.map((comment) => (
							<div
									key={comment.id}
									style={{
										padding: '12px',
										border: '1px solid #ccc',
										borderRadius: '8px',
										opacity: comment.isSending ? 0.5 : 1,
										transition: 'opacity 0.3s',
									}}
							>
								<p style={{margin: '0 0 8px 0', fontWeight: 'bold'}}>
									{comment.user?.username}
								</p>
								<p style={{margin: 0}}>{comment.body}</p>
							</div>
					))}
				</div>

				{/* Используем onSubmit вместо action */}
				<form onSubmit={handleSubmit} ref={formRef} style={{display: 'flex', gap: '8px'}}>
					<input
							type="text"
							name="body"
							placeholder="Написать комментарий..."
							style={{flexGrow: 1, padding: '8px'}}
							// Блокируем инпут, пока идет запрос (хотя для Оптимистичного UI
							// часто оставляют разблокированным, чтобы писать несколько комментариев подряд)
							disabled={isPending}
					/>
					<button type="submit" style={{padding: '8px 16px'}} disabled={isPending}>
						{isPending ? 'Летит...' : 'Отправить'}
					</button>
				</form>
			</div>
	);
};
