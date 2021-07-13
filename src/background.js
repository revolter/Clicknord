function fix() {
	const iframe = document.querySelector('iframe[src*="ok.ru"]');

	if (iframe) {
		const url = iframe.src;

		window.open(url, '_blank');
	} else {
		alert('Nu a fost găsit nici un video pe pagina curentă!');
	}
}

chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: {
			tabId: tab.id
		},
		function: fix
	});
});
