import { render, screen } from '@testing-library/react'
import ExpandableText from '../../src/components/ExpandableText'
import userEvent from '@testing-library/user-event'

describe('ExpandableText', () => {
    const shortText = 'A'
    const longText = 'A'.repeat(256)
    const truncatedText = longText.substring(0, 255) + '...'

    it('should render without show more on short text', () => {
        render(<ExpandableText text={shortText} />)

        const article = screen.getByRole('article')
        expect(article).toBeInTheDocument()
        expect(article).toHaveTextContent(shortText)

        const button = screen.queryByRole('button')
        expect(button).not.toBeInTheDocument()
    })

    it('should expand when show more clicked', async () => {
        render(<ExpandableText text={longText} />)

        const button = screen.getByRole('button')
        const user = userEvent.setup()
        await user.click(button)

        expect(button).toHaveTextContent(/less/i)
    })

    it('should render truncated text on longer than 256 characters', () => {
        render(<ExpandableText text={longText} />)

        const article = screen.getByRole('article')
        const button = screen.getByRole('button')

        expect(article).toBeInTheDocument()
        expect(article).toHaveTextContent(longText.substring(0, 255) + '...')
        expect(button).toHaveTextContent(/more/i)
    })

    it('should collapse text when Show Less button clicked', async () => {
        render(<ExpandableText text={longText} />)

        const showMoreButton = screen.getByRole('button', { name: /more/i })
        const user = userEvent.setup()
        await user.click(showMoreButton)

        const showLessButton = screen.getByRole('button', { name: /less/i })
        await user.click(showLessButton)

        expect(showMoreButton).toHaveTextContent(/more/i)
        expect(screen.getByText(truncatedText)).toBeInTheDocument()

    })

})