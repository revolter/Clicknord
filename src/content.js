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
		]);

	Array
		.from(removalsMap.entries())
		.flatMap((entry) => {
			return entry.reduce((tagName, filter) => {
				const nodes = Array.from(document.getElementsByTagName(tagName));

				return nodes.filter(filter);
			});
		})
		.forEach((crap) => {
			crap.remove();
		});

	new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (node.tagName == null) {
					return;
				}

				const removeIfNeeded = (testNode) => {
					const
						tagName = testNode.tagName.toLowerCase(),
						shouldBeRemoved = removalsMap.get(tagName);

					if (shouldBeRemoved === undefined) {
						return;
					}

					if (!shouldBeRemoved(testNode)) {
						return;
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
