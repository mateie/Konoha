module.exports = class Formulas {
    static determineDamage(currentDamage, level) {
        return currentDamage * level / 1.4;
    }

    static calculateChakra(currentChakra, usedChakra) {
        return currentChakra - usedChakra;
    }

    static paralyzeChance(currentChakra, level) {
        return currentChakra * level % 100;
    }
};