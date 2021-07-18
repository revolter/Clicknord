function main() {
	const
		domain = 'clicksud.org',

		shouldAnchorBeRemoved = (node) => {
			if (!node.hostname.includes(domain)) {
				// External links should be removed.
				return true;
			}

			return false;
		},

		scripts = Array.from(document.getElementsByTagName('script')),
		anchors = Array.from(document.getElementsByTagName('a')).filter(shouldAnchorBeRemoved),

		craps = scripts.concat(anchors);

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
						case 'script': {
							// All `script`s need to be removed.

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
				Array.from(node.getElementsByTagName('script')).forEach(removeIfNeeded);
			});
		});
	}).observe(document, {
		'childList': true,
		'subtree': true
	});
}

main();
