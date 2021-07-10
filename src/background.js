function fix() {
	const
		iframe = document.querySelector('iframe[src*="ok.ru"]'),
		url = iframe.src;

	window.open(url, '_blank');
}

chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: {
			tabId: tab.id
		},
		function: fix
	});
});
