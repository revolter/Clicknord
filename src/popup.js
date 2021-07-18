function openHqqTVVideo() {
	const
		hash = '#clicknord',

		iframe = document.querySelector('iframe[src*="hqq.tv"]'),
		isVideoAlreadyOpened = document.body.firstElementChild.tagName.toLowerCase() === 'iframe';

	if (iframe === null || isVideoAlreadyOpened) {
		alert('Nu a fost găsit server-ul I.');

		return;
	}

	iframe.style.width = '100%';
	iframe.style.height = '100%';

	document.documentElement.style.height = '100%';
	document.body.style.height = '100%';

	document.body.innerHTML = iframe.outerHTML;

	window.addEventListener('hashchange', (event) => {
		if (event.oldURL.endsWith(hash)) {
			window.location.reload();
		}
	});

	if (!window.location.href.endsWith(hash)) {
		window.history.pushState(null, null, hash);
	}
}

function openOkRuVideo() {
	const iframe = document.querySelector('iframe[src*="ok.ru"]');

	if (iframe === null) {
		alert('Nu a fost găsit server-ul II.');

		return;
	}

	const url = iframe.src;

	window.location = url;
}

function main() {
	const
		serverI = document.getElementById('server-i'),
		serverII = document.getElementById('server-ii'),

		onServerClick = async (event) => {
			const
				button = event.target,
				[tab] = await chrome.tabs.query({
					active: true,
					currentWindow: true
				});

			let openFunction = null;

			switch (button) {
				case serverI: {
					openFunction = openHqqTVVideo;

					break;
				}
				case serverII: {
					openFunction = openOkRuVideo;

					break;
				}
			}

			if (openFunction === null) {
				alert('A fost întâmpinată o problemă.');

				return;
			}

			chrome.scripting.executeScript({
				target: {
					tabId: tab.id
				},
				function: openFunction
			});
		};

	serverI.addEventListener('click', onServerClick);
	serverII.addEventListener('click', onServerClick);
}

main();
