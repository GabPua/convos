const { isBlank, isValidEmail, isValidName, isValidPassword } = require('convos-validator');

describe('Tests for isBlank', () => {
    it('Input string is null', () => {
        const input = null;
        const result = isBlank(input);
        expect(result).toBe(true);
    });

    it('Input string is empty', () => {
        const input = '';
        const result = isBlank(input);
        expect(result).toBe(true);
    });

    it('Input string is just whitespace', () => {
        const input = '    ';
        const result = isBlank(input);
        expect(result).toBe(true);
    });

    it('Input string has at least one character that is not whitespace', () => {
        const input = 'testing';
        const result = isBlank(input);
        expect(result).toBe(false);
    });
});

// describe('Tests for isValidEmail', () => {
//     it();
// });

describe('Tests for isValidName', () => {
    it('Input name is null', () => {
        const input = null;
        const result = isValidName(input);
        expect(result).toBe(false);
    });

    it('Input name is empty', () => {
        const input = '';
        const result = isValidName(input);
        expect(result).toBe(false);
    });

    it('Input name is just whitespace', () => {
        const input = '    ';
        const result = isValidName(input);
        expect(result).toBe(false);
    });

    it('Input name has at least one character that is not whitespace', () => {
        const input = 'name';
        const result = isValidName(input);
        expect(result).toBe(true);
    });
});

describe('Tests for isValidPassword', () => {
    describe('Invalid Passwords', () => {
        it('Password is blank', () => {
            const input = '  ';
            const result = isValidPassword(input);
            expect(result).toBe(false);
        });

        it('Password is less than 5 characters long', () => {
            const input = 'p4ss';
            const result = isValidPassword(input);
            expect(result).toBe(false);
        });

        it('Password does not have a special character', () => {
            const input = 'letters';
            const result = isValidPassword(input);
            expect(result).toBe(false);
        });

        it('Password does not have a letter', () => {
            const input = '1@3$5^7890';
            const result = isValidPassword(input);
            expect(result).toBe(false);
        });
    });

    describe('Valid Passwords', () => {
        it('Password is exactly 5 characters long', () => {
            const input = 'pass1';
            const result = isValidPassword(input);
            expect(result).toBe(true);
        });

        it('Password is more than 5 characters long', () => {
            const input = 'pass1234';
            const result = isValidPassword(input);
            expect(result).toBe(true);
        });

        it('Password has letters, digits, and symbols', () => {
            const input = 'pAsS123$';
            const result = isValidPassword(input);
            expect(result).toBe(true);
        });

        it('Password has letters and digits only', () => {
            const input = '1A2b3C4d5E';
            const result = isValidPassword(input);
            expect(result).toBe(true);
        });

        it('Password has letters and symbols only', () => {
            const input = '!A@b#C$d%E';
            const result = isValidPassword(input);
            expect(result).toBe(true);
        });
    });
});