import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import ProductForm from '../../src/components/ProductForm'
import AllProviders from '../AllProviders'

describe('ProductForm', () => {
    it('should render form fields', async () => {
        render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders })

        await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

        expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument()
        expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument()
    })
})