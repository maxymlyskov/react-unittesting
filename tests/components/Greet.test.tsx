import { render, screen } from '@testing-library/react'
import { it, expect, describe } from 'vitest'
import Greet from '../../src/components/Greet'
import '@testing-library/jest-dom/vitest'

describe('Greet', () => {
    it('should render Hello when render provided', () => {
        render(<Greet name='Max' />)

        const heading = screen.getByRole('heading')
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveTextContent(/max/i)
    })

    it('should render Login button when no name provided', () => {
        render(<Greet />)

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
        expect(button).toHaveTextContent(/login/i)
    })
}) 