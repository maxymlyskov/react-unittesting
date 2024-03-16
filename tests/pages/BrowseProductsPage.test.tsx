import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import BrowseProductsPage from '../../src/pages/BrowseProductsPage'
import { db } from '../mocks/db'
import { delay, http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { Theme } from '@radix-ui/themes';

describe('BrowseProductsPage.test', () => {
    const productIds: number[] = [];
    const categoryIds: number[] = [];

    // beforeAll(() => {
    //     [1, 2, 3].forEach(() => {
    //         const category = db.category.create()
    //         categoryIds.push(category.id)
    //     });
    //     [1, 2, 3].forEach(() => {
    //         const product = db.product.create()
    //         productIds.push(product.id)
    //     })
    // })

    // afterAll(() => {
    //     db.product.deleteMany({ where: { id: { in: productIds } } })
    //     db.category.deleteMany({ where: { id: { in: categoryIds } } })
    // })

    const renderComponent = () => {
        render(<BrowseProductsPage />, { wrapper: Theme })

    }

    it('should render loading skeletons for categories when data is fetching', () => {
        server.use(http.get('/categories', async () => {
            await delay()

            return HttpResponse.json([])
        }))
        renderComponent()

        expect(screen.getByRole('progressbar', { name: /categories/i })).toBeInTheDocument()
    })
    it('should hide loading skeletons for categories when data is fetched', async () => {
        renderComponent()

        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /categories/i }))
    })

    it('should render loading skeletons for products when data is fetching', () => {
        server.use(http.get('/products', async () => {
            await delay()

            return HttpResponse.json([])
        }))
        renderComponent()

        expect(screen.getByRole('progressbar', { name: /products/i })).toBeInTheDocument()
    })
    it('should hide loading skeletons for products when data is fetched', async () => {
        renderComponent()

        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /products/i }))
    })

    it('should not render an error if categories can`t be fetched', async () => {
        server.use(http.get('/categories', () => HttpResponse.error()))
        renderComponent();

        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /categories/i }))

        expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('combobox', { name: /category/i })).not.toBeInTheDocument()

    })

    it('should not render an error if products can`t be fetched', async () => {
        server.use(http.get('/products', () => HttpResponse.error()))
        renderComponent();

        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /products/i }))

        expect(screen.queryByText(/error/i)).toBeInTheDocument()

    })
})