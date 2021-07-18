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

		anchors = Array.from(document.getElementsByTagName('a')).filter(shouldAnchorBeRemoved),
		scripts = Array.from(document.getElementsByTagName('script')),

		craps = anchors.concat(scripts);

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
