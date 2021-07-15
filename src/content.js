function removeNode(node) {
	node.parentNode.removeChild(node);
}

function main() {
	const scripts = document.getElementsByTagName('script');

	Array.from(scripts).forEach((script) => {
		removeNode(script);
	});

	new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				const tagName = node.tagName;

				if (tagName && tagName.toLowerCase() === 'script') {
					removeNode(node);
				}
			});
		});
	}).observe(document, {
		'childList': true,
		'subtree': true
	});
}

main();
