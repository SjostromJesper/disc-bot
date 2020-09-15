class Player {
    health: number;

    armor: number;

    balance: number;
    inventory;
    equipment;
    weapon;

    constructor(health, balance, inventory, equipment, weapon) {
        this.health = health;
        this.balance = balance;
        this.inventory = inventory;
        this.equipment = equipment;
        this.weapon = weapon;
    }

    calculateStats() {
        this.equipment.forEach(eq => {
            this.armor += eq.armorValue;
        })
    }
}
