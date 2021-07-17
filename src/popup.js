function openHqqTVVideo() {
	const
		iframe = document.querySelector('iframe[src*="hqq.tv"]'),
		hash = '#clicknord';

	if (iframe === null || window.location.href.endsWith(hash)) {
		alert('Nu a fost găsit server-ul I.');

		return;
	}

	iframe.style.width = '100%';
	iframe.style.height = '100%';

	document.documentElement.style.height = '100%';
	document.body.style.height = '100%';

	document.body.innerHTML = iframe.outerHTML;

	window.addEventListener('hashchange', function (event) {
		if (event.oldURL.endsWith(hash)) {
			window.location.reload();
		}
	});

	window.history.pushState(null, null, hash);
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

		onServerClick = async function (event) {
			const
				button = event.target,
				[tab] = await chrome.tabs.query({
					active: true,
					currentWindow: true
				});

			let func = null;

			switch (button) {
				case serverI: {
					func = openHqqTVVideo;

					break;
				}
				case serverII: {
					func = openOkRuVideo;

					break;
				}
			}

			if (func === null) {
				alert('A fost întâmpinată o problemă.');

				return;
			}

			chrome.scripting.executeScript({
				target: {
					tabId: tab.id
				},
				function: func
			});
		};

	serverI.addEventListener('click', onServerClick);
	serverII.addEventListener('click', onServerClick);
}

main();
