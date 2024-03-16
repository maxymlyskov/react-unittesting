import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { HttpResponse, delay, http } from 'msw'
import ProductList from '../../src/components/ProductList'
import AllProviders from '../AllProviders'
import { db } from '../mocks/db'
import { server } from '../mocks/server'

describe('ProductList', () => {

    const productIds: number[] = []

    beforeAll(() => {
        [1, 2, 3].forEach(() => {
            const product = db.product.create()
            productIds.push(product.id)
        })
    })

    afterAll(() => {
        db.product.deleteMany({ where: { id: { in: productIds } } })
    })

    it('should render the list of products', async () => {
        render(<ProductList />, { wrapper: AllProviders })

        const items = await screen.findAllByRole('listitem')
        expect(items.length).toBeGreaterThan(0)
    })

    it('should render a loading message on', async () => {
        server.use(http.get('/products/:id', async () => {
            await delay()

            return HttpResponse.json([])
        }))
        render(<ProductList />, { wrapper: AllProviders })

        const loading = await screen.findByText('Loading...')
        expect(loading).toBeInTheDocument()
    })

    it('should remove the loading message after products fetched', async () => {
        render(<ProductList />, { wrapper: AllProviders })
        await waitForElementToBeRemoved(() => screen.queryByText('Loading...'))
    })

    it('should remove the loading if data fetching failed', async () => {
        server.use(http.get('/products', () => HttpResponse.error()))
        render(<ProductList />, { wrapper: AllProviders })
        await waitForElementToBeRemoved(() => screen.queryByText('Loading...'))
    })

    it('should render an error message if no products', async () => {
        server.use(http.get('/products', () => HttpResponse.json([])))
        render(<ProductList />, { wrapper: AllProviders })

        const error = await screen.findByText(/no products/i)
        expect(error).toBeInTheDocument()
    })

    it('should render an error message if the request fails', async () => {
        server.use(http.get('/products', () => HttpResponse.error()))
        render(<ProductList />, { wrapper: AllProviders })

        const error = await screen.findByText(/error/i)
        expect(error).toBeInTheDocument()
    })


})