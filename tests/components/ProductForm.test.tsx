import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductForm from '../../src/components/ProductForm'
import { Category, Product } from '../../src/entities'
import AllProviders from '../AllProviders'
import { db } from '../mocks/db'


describe('ProductForm', () => {
    let category: Category
    beforeAll(() => {
        category = db.category.create()
    })

    afterAll(() => {
        db.category.delete({ where: { id: { equals: category.id } } })
    })

    const renderComponent = (product?: Product) => {
        render(<ProductForm product={product} onSubmit={vi.fn()} />, { wrapper: AllProviders })


        return {
            waitForFormToLoad: async () => {
                await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
                const nameInput = screen.getByPlaceholderText(/name/i)
                const priceInput = screen.getByPlaceholderText(/price/i)
                const categorySelect = screen.getByRole('combobox', { name: /category/i })
                const submitButton = screen.getByRole('button', { name: /submit/i })

                return { nameInput, priceInput, categorySelect, submitButton }
            },

        }

    }

    it('should render form fields', async () => {
        const { waitForFormToLoad } = renderComponent()

        const inputs = await waitForFormToLoad()

        const { nameInput, priceInput, categorySelect } = inputs

        expect(nameInput).toBeInTheDocument()
        expect(priceInput).toBeInTheDocument()
        expect(categorySelect).toBeInTheDocument()
    })

    it('should populate form fields when editing a product', async () => {
        const product: Product = { id: 1, name: 'Product 1', price: 100, categoryId: category.id }
        const { waitForFormToLoad } = renderComponent(product)

        const inputs = await waitForFormToLoad()

        const { nameInput, priceInput, categorySelect } = inputs

        expect(nameInput).toHaveValue(product.name)
        expect(priceInput).toHaveValue(product.price.toString())
        expect(categorySelect).toHaveTextContent(category.name)
    })

    it('should focus on name field on first load', async () => {
        const { waitForFormToLoad } = renderComponent()

        const inputs = await waitForFormToLoad()

        const { nameInput } = inputs

        expect(nameInput).toHaveFocus()
    })

    it.each([{
        scenario: 'missing',
        errorMessage: /required/i,
    },
    {
        scenario: 'longer than 255 characters',
        name: 'a'.repeat(256),
        errorMessage: /255/i,
    },
    ])('should display an error when name is $scenario', async ({ name, errorMessage }) => {
        const { waitForFormToLoad } = renderComponent()

        const form = await waitForFormToLoad()

        const user = userEvent.setup()
        if (name) await user.type(form.nameInput, name)
        await user.type(form.priceInput, '10')
        await user.click(form.categorySelect)
        const options = screen.getAllByRole('option')
        await user.click(options[0])
        await user.click(form.submitButton)
        const error = await screen.findByRole('alert')

        expect(error).toBeInTheDocument()
        expect(error).toHaveTextContent(errorMessage)
    })
})