class UserInfo {
    constructor(name) {
        this._name = name;
        this.isInParty = false;
    }

    get name() {
        return this._name;
    }
}

module.exports = UserInfo;
