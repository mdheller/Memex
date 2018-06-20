/* eslint-env jest */
import { StorageManager } from './manager'
import { getDexieHistory } from './dexie-schema'

describe('StorageManager', () => {
    describe('Dexie schema generation', () => {
        test('it should work', () => {
            const storageManager = new StorageManager()
            storageManager.registerCollection('spam', {
                version: new Date(2018, 5, 20),
                fields: {
                    slug: { type: 'string' },
                    field1: { type: 'string' },
                },
                indices: ['slug'],
            })

            const migrateEggs = () => Promise.resolve()
            storageManager.registerCollection('eggs', [
                {
                    version: new Date(2018, 5, 20),
                    fields: {
                        slug: { type: 'string' },
                        field1: { type: 'string' },
                    },
                    indices: ['slug'],
                },
                {
                    version: new Date(2018, 5, 25),
                    fields: {
                        slug: { type: 'string' },
                        field1: { type: 'string' },
                        field2: { type: 'text' },
                    },
                    indices: ['slug', 'field2'],
                    migrate: migrateEggs,
                },
            ])

            storageManager.registerCollection('foo', {
                version: new Date(2018, 5, 28),
                fields: {
                    slug: { type: 'string' },
                    field1: { type: 'string' },
                },
                indices: ['slug'],
            })

            storageManager.registerCollection('ham', {
                version: new Date(2018, 6, 20),
                fields: {
                    nameFirst: { type: 'string' },
                    nameLast: { type: 'string' },
                },
                indices: [['nameLast', 'nameFirst'], 'nameLast'],
            })

            const dexieSchemas = getDexieHistory(storageManager.registry)

            expect(dexieSchemas[0]).toEqual({
                version: 1,
                schema: {
                    eggs: 'slug',
                    spam: 'slug',
                },
                migrations: [],
            })

            expect(dexieSchemas[1]).toEqual({
                version: 2,
                schema: {
                    eggs: 'slug, *field2',
                    spam: 'slug',
                },
                migrations: [migrateEggs],
            })

            expect(dexieSchemas[2]).toEqual({
                version: 3,
                schema: {
                    eggs: 'slug, *field2',
                    foo: 'slug',
                    spam: 'slug',
                },
                migrations: [],
            })

            expect(dexieSchemas[3]).toEqual({
                version: 4,
                schema: {
                    eggs: 'slug, *field2',
                    foo: 'slug',
                    spam: 'slug',
                    ham: '[nameLast+nameFirst], nameLast',
                },
                migrations: [],
            })
        })
    })
})
