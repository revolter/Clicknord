function main() {
	const
		domain = 'clicksud.org',

		scripts = Array.from(document.getElementsByTagName('script')),
		anchors = Array.from(document.getElementsByTagName('a')).filter((anchor) => {
			return !anchor.hostname.includes(domain);
		}),

		craps = scripts.concat(anchors);

	craps.forEach((crap) => {
		crap.remove();
	});

	new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				const tagName = node.tagName;

				if (tagName == null) {
					return;
				}

				switch (tagName.toLowerCase()) {
					case 'a': {
						if (node.hostname.includes(domain)) {
							// Internal links shouldn't be removed.

							return;
						}

						break;
					}
					case 'script': {
						// All `script`s need to be removed.

						break;
					}
					default: {
						return;
					}
				}

				node.remove();
			});
		});
	}).observe(document, {
		'childList': true,
		'subtree': true
	});
}

main();
