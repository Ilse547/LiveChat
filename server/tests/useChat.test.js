jest.mock('gun', () => {
    const mockOn = jest.fn();
    const mockMap = jest.fn(() => ({ on: mockOn }));
    const mockPut = jest.fn();
    const mockGet = jest.fn(() => ({ map: mockMap, get: jest.fn(() => ({ put: mockPut })), put: mockPut }));
    return jest.fn(() => ({ get: mockGet }));
});

jest.mock('vue', () => ({
    ref: (val) => ({ value: val })
}));

global.localStorage = {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn()
};

global.fetch = jest.fn();
global.window = { location: { href: '' } };

const { useChat } = require('../../src/composable/useChat.js');

describe('useChat composable', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        window.location.href = '';
    });

    describe('VerifyAuth', () => {
        it('should redirect to /login if no token is found', async () => {
            localStorage.getItem.mockReturnValue(null);
            const { VerifyAuth } = useChat('chat');
            const result = await VerifyAuth();
            expect(result).toBeNull();
            expect(window.location.href).toBe('/login');
        });

        it('should redirect to /login if token is invalid', async () => {
            localStorage.getItem.mockReturnValue('badtoken');
            global.fetch.mockResolvedValue({ ok: false });
            const { VerifyAuth } = useChat('chat');
            const result = await VerifyAuth();
            expect(result).toBeNull();
            expect(localStorage.removeItem).toHaveBeenCalledWith('token');
            expect(window.location.href).toBe('/login');
        });

        it('should return user data if token is valid', async () => {
            localStorage.getItem.mockReturnValue('validtoken');
            global.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({ user: { username: 'alice' } })
            });
            const { VerifyAuth } = useChat('chat');
            const result = await VerifyAuth();
            expect(result).toEqual({ user: { username: 'alice' } });
        });
    });

    describe('sendMessage', () => {
		it('should not send if message is empty', () => {
		    const { sendMessage, NewMessage, initGun } = useChat('chat');
		    initGun('http://localhost:3000');
		    NewMessage.value = '   ';
		    sendMessage();
		    const Gun = require('gun');
		    const gunInstance = Gun.mock.results[0].value;
		    expect(gunInstance.get).toHaveBeenCalledTimes(1);
		});

        it('should clear NewMessage after sending', () => {
            const { sendMessage, NewMessage, initGun } = useChat('chat');
            initGun('http://localhost:3000');
            NewMessage.value = 'Hello!';
            sendMessage();
            expect(NewMessage.value).toBe('');
        });
    });

    describe('deleteMessage', () => {
        it('should remove the message from the messages array', () => {
            const { deleteMessage, messages, initGun } = useChat('chat');
            initGun('http://localhost:3000');
            messages.value = [
                { id: '1', text: 'hello', username: 'alice' },
                { id: '2', text: 'world', username: 'bob' }
            ];
            deleteMessage('1');
            expect(messages.value).toHaveLength(1);
            expect(messages.value[0].id).toBe('2');
        });
    });

    describe('fetchGroups', () => {
        it('should populate groups on success', async () => {
            localStorage.getItem.mockReturnValue('validtoken');
            global.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({ groups: [{ GroupName: 'testgroup' }] })
            });
            const { fetchGroups, groups } = useChat('chat');
            await fetchGroups();
            expect(groups.value).toHaveLength(1);
            expect(groups.value[0].GroupName).toBe('testgroup');
        });

        it('should not populate groups if request fails', async () => {
            localStorage.getItem.mockReturnValue('validtoken');
            global.fetch.mockResolvedValue({ ok: false, json: jest.fn().mockResolvedValue({}) });
            const { fetchGroups, groups } = useChat('chat');
            await fetchGroups();
            expect(groups.value).toHaveLength(0);
        });
    });

    describe('navigation', () => {
        it('goToGroup should redirect to the correct group URL', () => {
            const { goToGroup } = useChat('chat');
            goToGroup('testgroup');
            expect(window.location.href).toBe('/group/testgroup');
        });

        it('goToCreateGroup should redirect to /creategroup', () => {
            const { goToCreateGroup } = useChat('chat');
            goToCreateGroup();
            expect(window.location.href).toBe('/creategroup');
        });

        it('goToProfile should redirect to the user profile URL', () => {
            const { goToProfile, username } = useChat('chat');
            username.value = 'alice';
            goToProfile();
            expect(window.location.href).toBe('/user/alice');
        });
    });
});
