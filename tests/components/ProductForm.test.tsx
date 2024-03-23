/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'react-hot-toast'
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
        const onSubmit = vi.fn()
        render(<>
            <ProductForm product={product} onSubmit={onSubmit} />
            <Toaster />
        </>, { wrapper: AllProviders })


        return {
            onSubmit,
            expectErrorToBeInTheDocument: async (message: RegExp) => {
                const error = await screen.findByRole('alert')

                expect(error).toBeInTheDocument()
                expect(error).toHaveTextContent(message)
            },
            waitForFormToLoad: async () => {
                await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
                const nameInput = screen.getByPlaceholderText(/name/i)
                const priceInput = screen.getByPlaceholderText(/price/i)
                const categorySelect = screen.getByRole('combobox', { name: /category/i })
                const submitButton = screen.getByRole('button', { name: /submit/i })

                type FormData = {
                    [K in keyof Product]: any
                }

                const validData: FormData = {
                    id: 1,
                    name: 'Product 1',
                    price: 100,
                    categoryId: category.id
                }

                const fill = async (product: FormData) => {
                    const user = userEvent.setup()

                    if (product.name) await user.type(nameInput, product.name)
                    if (product.price) await user.type(priceInput, product.price.toString())

                    await user.tab()
                    await user.click(categorySelect)
                    const options = screen.getAllByRole('option')
                    await user.click(options[0])
                    await user.click(submitButton)
                }

                return { nameInput, priceInput, categorySelect, submitButton, fill, validData }
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
        const { waitForFormToLoad, expectErrorToBeInTheDocument } = renderComponent()

        const form = await waitForFormToLoad()
        await form.fill({ ...form.validData, name })

        await expectErrorToBeInTheDocument(errorMessage)
    })

    it.each([{
        scenario: 'missing',
        errorMessage: /required/i,
    },
    {
        scenario: '0',
        price: '0',
        errorMessage: /1/i,
    },
    {
        scenario: 'negative',
        price: '-1',
        errorMessage: /1/i,
    },
    {
        scenario: 'greater than 1000',
        price: '1001',
        errorMessage: /less/i,
    },
    {
        scenario: 'not a number',
        price: 'a',
        errorMessage: /required/i,
    },
    ])('should display an error when price is $scenario', async ({ price, errorMessage }) => {
        const { waitForFormToLoad, expectErrorToBeInTheDocument } = renderComponent()

        const form = await waitForFormToLoad()
        await form.fill({ ...form.validData, price })

        await expectErrorToBeInTheDocument(errorMessage)
    })

    it('should sumbit form with the right data', async () => {
        const { waitForFormToLoad, onSubmit } = renderComponent()

        const form = await waitForFormToLoad()

        await form.fill(form.validData)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...expectedData } = form.validData
        expect(onSubmit).toHaveBeenCalledWith(expectedData)

    })

    it('should diplay toast error if submission data is wrong', async () => {
        const { waitForFormToLoad, onSubmit } = renderComponent()
        onSubmit.mockRejectedValueOnce(new Error('An unexpected error occurred'))

        const form = await waitForFormToLoad()

        await form.fill(form.validData)

        const toast = await screen.findByRole('status')

        expect(toast).toBeInTheDocument()
        expect(toast).toHaveTextContent(/error/i)


    })
})