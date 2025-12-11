const users = [];

function findUserByEmail(email){
    return users.find(u => u.email === email)
}

function findUserById(id){
    return users.find(u => u.id === id);
}

function saveUser(user){
    users.push(user)
    return user;
}
module.exports = { users, findUserByEmail, findUserById, saveUser};