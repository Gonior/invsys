import App from './App.svelte';
import TimeAgo from 'javascript-time-ago'
import id from 'javascript-time-ago/locale/id.json'

TimeAgo.addDefaultLocale(id)

const app = new App({
	target: document.body,
	props: {
	}
});

export default app;