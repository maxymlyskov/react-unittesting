import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
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
            waitForFormToLoad: () => waitForElementToBeRemoved(() => screen.getByText(/loading/i)),
            getInputs: () => {
                const nameInput = screen.getByPlaceholderText(/name/i)
                const priceInput = screen.getByPlaceholderText(/price/i)
                const categorySelect = screen.getByRole('combobox', { name: /category/i })

                return { nameInput, priceInput, categorySelect }
            }
        }

    }

    it('should render form fields', async () => {
        const { getInputs, waitForFormToLoad } = renderComponent()

        await waitForFormToLoad()

        const { nameInput, priceInput, categorySelect } = getInputs()

        expect(nameInput).toBeInTheDocument()
        expect(priceInput).toBeInTheDocument()
        expect(categorySelect).toBeInTheDocument()
    })

    it('should populate form fields when editing a product', async () => {
        const product: Product = { id: 1, name: 'Product 1', price: 100, categoryId: category.id }
        const { getInputs, waitForFormToLoad } = renderComponent(product)

        await waitForFormToLoad()

        const { nameInput, priceInput, categorySelect } = getInputs()

        expect(nameInput).toHaveValue(product.name)
        expect(priceInput).toHaveValue(product.price.toString())
        expect(categorySelect).toHaveTextContent(category.name)
    })
})