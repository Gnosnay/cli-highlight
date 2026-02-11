/* eslint-disable no-sync */
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { highlight, listLanguages, supportsLanguage } from '../index.js'

function test(language: string, code: string): void {
    it(`should color ${language} correctly`, () => {
        const highlighted = highlight(code)

        if (process.env.OUTPUT_CODE_SAMPLES) {
            console.log(language + ':\n\n' + highlighted)
        }

        expect(highlighted).toMatchSnapshot()
    })
}

describe('highlight()', () => {
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const fixtureDir = path.join(dirname, '__fixtures__')
    const fixtures = fs.readdirSync(fixtureDir)

    for (const fixture of fixtures) {
        const fixturePath = path.join(fixtureDir, fixture)

        if (fs.statSync(fixturePath).isFile()) {
            const [language] = fixture.split('.')

            test(language, fs.readFileSync(fixturePath, 'utf8'))
        }
    }
})

describe('listLanguages()', () => {
    it('should list the supported languages', () => {
        const languages = listLanguages()
        expect(languages).toBeInstanceOf(Array)
        expect(languages.length).toBeGreaterThan(0)
    })
})

describe('supportsLanguage()', () => {
    it('should return true if the language is supported', () => {
        const supports = supportsLanguage('json')
        expect(supports).toBe(true)
    })
    it('should return false if the language is not supported', () => {
        const supports = supportsLanguage('notsupported')
        expect(supports).toBe(false)
    })
})
