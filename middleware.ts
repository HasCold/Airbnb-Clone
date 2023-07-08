export {default} from 'next-auth/middleware';

export const config = {
    matcher: [
        '/trips',
        '/reservations',
        '/properties',
        '/favorites',
    ]
}

// The export { default } syntax allows you to use a shorter and more convenient import syntax when importing the default export from this module. For example, instead of writing import middleware from 'next-auth/middleware';, you can now write import middleware from '@/app/middleware'; (assuming the snippet is part of a module located in the @/app directory).