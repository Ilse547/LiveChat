const { ref } = require('vue');
const Gun = require('gun');

function useChat(channelKey) {
	let activeKey = channelKey;
	const username = ref('');
	const groups = ref([]);
	const messages = ref([]);
	const NewMessage = ref('');
	let gun = null;

	async function VerifyAuth() {
		const token = localStorage.getItem('token');
		if(!token) { redirect('/login'); return null;}

		const response = await fetch('/verify', {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		});

		if(!response.ok) {
			localStorage.removeItem('token');
			redirect('/login');
			return null;
		}
		return response.json()
		
	}


	function initGun(AppUrl, keyOverride) {
		activeKey = keyOverride || channelKey;
		gun = Gun({ peers: [`${AppUrl}/gun`] });

		gun.get(activeKey).map().on((message) => {
			if(!message?.text) return;
			const exists = messages.value.find(m => m.id === message.id);
			if (!exists) {
				messages.value.push(message);
				messages.value.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
			}
		});
	}

	function sendMessage() {
		if (!NewMessage.value.trim()) return;
		const message = {
	      id: Date.now().toString(),
	      username: username.value,
	      text: NewMessage.value,
	      timestamp: new Date().toISOString()
		};
		gun.get(activeKey).get(message.id).put(message);
	    NewMessage.value = '';
	};
	function deleteMessage(id) {
		gun.get(activeKey).get(id).put(null);
		messages.value = messages.value.filter(m => m.id !== id);
	}
	async function fetchGroups(){
		const token = localStorage.getItem('token');
		const response = await fetch('/groups', {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
    	});
    	const data = await response.json();
    	if (response.ok) groups.value = data.groups;
	}
	function goToProfile() { redirect(`/user/${username.value}`); }
	function goToGroup(groupName) { redirect(`/group/${groupName}`); }
	function goToCreateGroup() { redirect('/creategroup'); }
	function redirect(path) { window.location.href = path; }

	return {
	    username, groups, messages, NewMessage, VerifyAuth, initGun, sendMessage, deleteMessage, fetchGroups, goToProfile, goToGroup, goToCreateGroup
	};

}
module.exports = { useChat };
