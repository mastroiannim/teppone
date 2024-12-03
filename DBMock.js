class DBMock {
    constructor() {
        // Inizializza il "database" come un array in memoria
        this.users = [
            { id: 1, username: 'jdoe', nome: 'John Doe', ruolo: 'admin', password: '123456' },
            { id: 2, username: 'asmith', nome: 'Alice Smith', ruolo: 'user', password: 'abcdef' },
        ];
        this.nextId = this.users.length ? this.users[this.users.length - 1].id + 1 : 1; // Generatore ID
    }

    // Ottieni tutti gli utenti
    getAllUsers() {
        return this.users.map(user => ({ ...user, password: undefined })); // Escludi la password
    }

    // Ottieni un utente per ID
    getUserById(id) {
        const user = this.users.find(user => user.id === id);
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    getUserByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    // Crea un nuovo utente
    createUser({ username, nome, ruolo, password }) {
        if (!username || !nome || !ruolo || !password) {
            throw new Error('Tutti i campi sono obbligatori: username, nome, ruolo, password');
        }
        const newUser = {
            id: this.nextId++,
            username,
            nome,
            ruolo,
            password,
        };
        this.users.push(newUser);
        return newUser;
    }

    // Aggiorna un utente esistente
    updateUser(id, updates) {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            return null;
        }
        if (updates.username) user.username = updates.username;
        if (updates.nome) user.nome = updates.nome;
        if (updates.ruolo) user.ruolo = updates.ruolo;
        if (updates.password) user.password = updates.password;
        return user;
    }

    // Elimina un utente
    deleteUser(id) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return false;
        }
        this.users.splice(userIndex, 1);
        return true;
    }
}

module.exports = DBMock;
