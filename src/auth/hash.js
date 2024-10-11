export function hashPassword(password) {
    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(password);
    var hash = shaObj.getHash("HEX");
    return hash;
}

window.hashPassword = hashPassword;