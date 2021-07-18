function main() {
	const
		domain = window.location.hostname.replace('www.', ''),

		shouldAnchorBeRemoved = (node) => {
			if (node.getAttribute('href') === '#') {
				// Hash only links should be removed.
				return true;
			}

			if (!node.hostname.includes(domain)) {
				// External links should be removed.
				return true;
			}

			return false;
		},

		shouldIFrameBeRemoved = (node) => {
			if (node.getAttribute('src') === null) {
				// `iframe`s without sources should be removed.
				return true;
			}

			return false;
		},

		shouldScriptBeRemoved = (node) => {
			// All `script`s should be removed.`
			return true;
		},

		removalsMap = new Map([
			['a', shouldAnchorBeRemoved],
			['iframe', shouldIFrameBeRemoved],
			['script', shouldScriptBeRemoved]
		]),

		craps = Array
			.from(removalsMap.entries())
			.flatMap((entry) => {
				return entry.reduce((tagName, filter) => {
					const nodes = Array.from(document.getElementsByTagName(tagName));

					return nodes.filter(filter);
				});
			});

	craps.forEach((crap) => {
		crap.remove();
	});

	new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (node.tagName == null) {
					return;
				}

				const removeIfNeeded = (testNode) => {
					switch (testNode.tagName.toLowerCase()) {
						case 'a': {
							if (!shouldAnchorBeRemoved(testNode)) {
								return;
							}

							break;
						}
						case 'iframe': {
							if (!shouldIFrameBeRemoved(testNode)) {
								return;
							}

							break;
						}
						case 'script': {
							if (!shouldScriptBeRemoved(testNode)) {
								return;
							}

							break;
						}
						default: {
							return;
						}
					}

					testNode.remove();
				}

				removeIfNeeded(node);
				Array.from(node.getElementsByTagName('a')).forEach(removeIfNeeded);
				Array.from(node.getElementsByTagName('iframe')).forEach(removeIfNeeded);
				Array.from(node.getElementsByTagName('script')).forEach(removeIfNeeded);
			});
		});
	}).observe(document, {
		'childList': true,
		'subtree': true
	});
}

main();
