var dbConfig = {
    synchronize: false,
};

switch (process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['dist/**/*.entity.js'],
        });
        break;
    case 'test':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'test.sqlite',
            entities: ['dist/**/*.entity.ts'],
        });
        break;
    case 'production':
        break;
    default:
        throw new Error('unknown environment');
}

module.exports = dbConfig;
