import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { HttpResponse, delay, http } from 'msw'
import ProductList from '../../src/components/ProductList'
import { db } from '../mocks/db'
import { server } from '../mocks/server'
import { QueryClient, QueryClientProvider } from 'react-query'

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

    const renderComponent = () => {
        const client = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false
                }
            }
        })

        render(<QueryClientProvider client={client}><ProductList /></QueryClientProvider>)
    }

    it('should render the list of products', async () => {
        renderComponent()

        const items = await screen.findAllByRole('listitem')
        expect(items.length).toBeGreaterThan(0)
    })

    it('should render a loading message on', async () => {
        server.use(http.get('/products/:id', async () => {
            await delay()

            return HttpResponse.json([])
        }))
        renderComponent()

        const loading = await screen.findByText('Loading...')
        expect(loading).toBeInTheDocument()
    })

    it('should remove the loading message after products fetched', async () => {
        renderComponent()
        await waitForElementToBeRemoved(() => screen.queryByText('Loading...'))
    })

    it('should remove the loading if data fetching failed', async () => {
        server.use(http.get('/products', () => HttpResponse.error()))
        renderComponent()
        await waitForElementToBeRemoved(() => screen.queryByText('Loading...'))
    })

    it('should render an error message if no products', async () => {
        server.use(http.get('/products', () => HttpResponse.json([])))
        renderComponent()

        const error = await screen.findByText(/no products/i)
        expect(error).toBeInTheDocument()
    })

    it('should render an error message if the request fails', async () => {
        server.use(http.get('/products', () => HttpResponse.error()))
        renderComponent()

        const error = await screen.findByText(/error/i)
        expect(error).toBeInTheDocument()
    })


})