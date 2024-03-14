import { render, screen } from '@testing-library/react'
import ToastDemo from '../../src/components/ToastDemo'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'react-hot-toast'

describe('ToastDemo', () => {
    it('should render toast on clicking button', async () => {
        render(
            <>
                <ToastDemo />
                <Toaster />
            </>
        )
        const user = userEvent.setup()

        const button = screen.getByRole('button')
        await user.click(button)

        const toast = await screen.findByText(/success/i)

        expect(toast).toBeInTheDocument()

    })
})