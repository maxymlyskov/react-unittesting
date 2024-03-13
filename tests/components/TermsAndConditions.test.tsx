import { render, screen } from '@testing-library/react'
import TermsAndConditions from '../../src/components/TermsAndConditions'
import userEvent from '@testing-library/user-event'

describe('TermsAndCondtions', () => {
    const renderComponent = () => {
        render(<TermsAndConditions />)

        const heading = screen.getByRole('heading')
        const checkbox = screen.getByRole('checkbox')
        const button = screen.getByRole('button')

        return { heading, checkbox, button }
    }

    it('should render with correct text & initial state', () => {
        const { heading, checkbox, button } = renderComponent()

        expect(heading).toHaveTextContent('Terms & Conditions')
        expect(checkbox).not.toBeChecked()
        expect(button).toBeDisabled()
    })

    it('should enable button when checkbox checked', async () => {
        const { checkbox, button } = renderComponent()

        const user = userEvent.setup()
        await user.click(checkbox);

        expect(checkbox).toBeChecked()
        expect(button).toBeEnabled()
    })

})