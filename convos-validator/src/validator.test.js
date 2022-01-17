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

describe('Tests for isValidEmail', () => {
    describe('Invalid Emails', () => {
        it('Email is blank', () => {
            const input = '  ';
            const result = isValidEmail(input);
            expect(result).toBe(false);
        });

        it('Email does not have @ or domain name', () => {
            const input = 'email';
            const result = isValidEmail(input);
            expect(result).toBe(false);
        });

        it('Email does not have @', () => {
            const input = 'email.example.com';
            const result = isValidEmail(input);
            expect(result).toBe(false);
        });

        it('Email does not have domain name', () => {
            const input = 'email@';
            const result = isValidEmail(input);
            expect(result).toBe(false);
        });

        it('Email has multiple @', () => {
            const input = 'email@example@example.com';
            const result = isValidEmail(input);
            expect(result).toBe(false);
        });

        it('Email has invalid username', () => {
            const input = 'email..@example.com';
            const result = isValidEmail(input);
            expect(result).toBe(false);
        });

        it('Email has invalid domain', () => {
            const input = 'email@$example.com';
            const result = isValidEmail(input);
            expect(result).toBe(false);
        });

        it('Email has invalid domain', () => {
            const input = 'email@111.222.333.44444';
            const result = isValidEmail(input);
            expect(result).toBe(false);
        });
    });

    describe('Valid Emails', () => {
        it('Email has only letters in userame', () => {
            const input = 'email@example.com';
            const result = isValidEmail(input);
            expect(result).toBe(true);
        });

        it('Email has only numbers in userame', () => {
            const input = '1234@example.com';
            const result = isValidEmail(input);
            expect(result).toBe(true);
        });

        it('Email has dots in userame', () => {
            const input = 'first.middle.last@example.com';
            const result = isValidEmail(input);
            expect(result).toBe(true);
        });

        it('Email has IP address as domain', () => {
            const input = 'email@[123.123.123.123]';
            const result = isValidEmail(input);
            expect(result).toBe(true);
        });
    });
});

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

    it('Input name is more than 15 characters in length', () => {
        const input = '12345678901234567890';
        const result = isValidName(input);
        expect(result).toBe(false);
    });

    it('Input name is 15 characters in length', () => {
        const input = '123456789012345';
        const result = isValidName(input);
        expect(result).toBe(true);
    });

    it('Input name is less than 15 characters in length', () => {
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