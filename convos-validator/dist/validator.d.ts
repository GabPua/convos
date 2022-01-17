export declare function isBlank(str: string): boolean;
export declare function isValidPassword(password: string): boolean;
export declare function isValidGroupName(name: string): boolean;
export declare function isValidName(name: string): boolean;
export declare function isValidEmail(email: string): boolean;
export declare const passwordErrorMessage = "Password must be at least 5 characters long with at least one letter and at least one special character/digit";
export declare const usernameErrorMessage = "Username must not be blank nor exceed 15 characters";
export declare const groupNameErrorMessage = "Group name must not be blank nor exceed 20 characters";
