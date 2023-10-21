// @ts-check

/** @template T
 * @typedef { import('./types.ts').WithResolvers<T> } WithResolvers
 */

// Re: https://github.com/tc39/proposal-promise-with-resolvers
/** @template T */
function withResolvers() {
	let resolve = /** @type {(value: T | PromiseLike<T>) => void} */ (
		/** @type {unknown} */ (undefined)
	);
	let reject = /** @type {(reason?: any) => void} */ (
		/** @type {unknown} */ (undefined)
	);
	/** @type {WithResolvers<T>} */
	const holder = {
		promise: new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		}),
		resolve,
		reject,
	};

	return holder;
}

/** @param { Element } element */
function ensureTextNode(element) {
	const first = element.firstChild;
	if (first instanceof Text) return first;

	const text = new Text('');
	if (first) {
		element.replaceChild(text, first);
	} else {
		element.appendChild(text);
	}
	return text;
}

/** @param { string } lockName
 * @param { (name: string) => void } onLeader
 */
function requestLead(lockName, onLeader) {
	// prettier-ignore
	const { resolve: retire, promise: seal } = 
		/** @type {WithResolvers<void>} */(withResolvers());

	navigator.locks.request(lockName, () => {
		onLeader(lockName);
		// retains leadership
		// over `name`
		// is resolved (retired)
		return seal;
	});

	return retire;
}

const LEADER_STATUS = /** @type {const} */ ({
	down: 0,
	requested: 1,
	leading: 2,
});

/** @typedef {(typeof LEADER_STATUS)[keyof (typeof LEADER_STATUS)]} LeaderStatus */

const VISIBILITY_CHANGE = 'visibilitychange';

/**
 * @param {() => DocumentVisibilityState} visibilityState
 * @param {string} name
 * @param {(id: string) => void} onLeader
 * @param {((id: string) => void)=} onRetire
 */
function makeLeaderHandler(visibilityState, name, onLeader, onRetire) {
	/**	@type {(() => void) | undefined } */
	let retire;

	/** @type {EventListenerObject & {
	 *		name: string,
	 * 	status: LeaderStatus;
	 * 	requestLead: () => void;
	 * 	retire: () => void;
	 * }} */
	const handler = {
		name,
		status: LEADER_STATUS.down,
		requestLead() {
			if (this.status !== LEADER_STATUS.down) return;

			retire = requestLead(name, onLeader);
		},
		retire() {
			if (this.status !== LEADER_STATUS.leading) return;

			onRetire?.(name);
			retire?.();
			retire = undefined;
			this.status = LEADER_STATUS.down;
		},
		handleEvent(event) {
			if (event.type !== VISIBILITY_CHANGE) return;

			if (visibilityState() === 'hidden') {
				this.retire();
				return;
			}

			this.requestLead();
		},
	};

	return handler;
}

/** @param {string} title
 * @param {string} name
 * @param {Text=} text
 */
function setTitle(title, name, text) {
	document.title = title;
	if (text) text.nodeValue = `${title} of “${name}”`;
}

// --- script ---
const LEADER_TITLE = '♕ I am the Leader';
const content = document.querySelector('p:first-of-type') ?? undefined;
const text = content ? ensureTextNode(content) : undefined;

const handler = makeLeaderHandler(
	() => document.visibilityState,
	'mpa-hub',
	(name) => setTitle(LEADER_TITLE, name, text),
	(_name) => setTitle('Bye', 'bye', text)
);

handler.requestLead();
document.addEventListener(VISIBILITY_CHANGE, handler);
