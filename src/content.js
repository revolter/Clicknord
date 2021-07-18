class RemovalsMap {
	constructor(tagName, shouldBeRemovedFunction, removeFunction) {
		this.tagName = tagName;
		this.shouldBeRemovedFunction = shouldBeRemovedFunction;
		this.removeFunction = removeFunction;
	}
}

function main() {
	const
		domain = window.location.hostname.replace('www.', ''),

		removalsMaps = [
			new RemovalsMap('a', (node) => {
				if (node.getAttribute('href') === '#') {
					// Hash only links should be removed.
					return true;
				}

				if (!node.hostname.includes(domain)) {
					// External links should be removed.
					return true;
				}

				return false;
			}, (node) => {
				node.remove();
			}),

			new RemovalsMap('iframe', (node) => {
				if (node.getAttribute('src') === null) {
					// `iframe`s without sources should be removed.
					return true;
				}

				return false;
			}, (node) => {
				node.remove();
			}),

			new RemovalsMap('script', (node) => {
				// All `script`s should be removed.`
				return true;
			}, (node) => {
				node.remove();
			})
		];

	removalsMaps.forEach((removalsMap) => {
		const nodes = Array.from(document.getElementsByTagName(removalsMap.tagName));

		nodes
			.filter(removalsMap.shouldBeRemovedFunction)
			.forEach(removalsMap.removeFunction);
	});

	new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (node.tagName == null) {
					return;
				}

				removalsMaps.forEach((removalsMap) => {
					const tagName = removalsMap.tagName;

					let nodes = Array.from(document.getElementsByTagName(tagName));

					if (node.tagName.toLowerCase() === tagName) {
						nodes.push(node);
					}

					nodes
						.filter(removalsMap.shouldBeRemovedFunction)
						.forEach(removalsMap.removeFunction);
				});
			});
		});
	}).observe(document, {
		'childList': true,
		'subtree': true
	});
}

main();
