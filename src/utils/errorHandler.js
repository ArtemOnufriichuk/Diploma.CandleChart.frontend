export const errorHandler = (e) => {
	console.error(e.response);
	if (e.response?.errors) {
		alert(e.response.data.errors[0].msg || 'Ошибка');
		console.log(e.response.data.errors[0].msg || 'Ошибка');
	} else {
		alert(e.response?.data.error || 'Ошибка');
		console.log(e.response?.data.error || 'Ошибка');
	}
};
