import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { HttpResponse, delay, http } from 'msw'
import ProductDetail from '../../src/components/ProductDetail'
import { db } from '../mocks/db'
import { server } from '../mocks/server'
import AllProviders from '../AllProviders'

describe('ProductDetail', () => {
    let productId: number;
    beforeAll(() => {
        const product = db.product.create()
        productId = product.id
    })

    afterAll(() => {
        db.product.delete({ where: { id: { equals: productId } } })
    })

    it('should render the product details', async () => {
        render(<ProductDetail productId={productId} />, { wrapper: AllProviders })
        const product = db.product.findFirst({ where: { id: { equals: productId } } })

        const name = await screen.findByText(new RegExp(product!.name))
        const price = await screen.findByText(new RegExp(product!.price.toString()))
        expect(name).toBeInTheDocument()
        expect(price).toBeInTheDocument()
    })

    it('should render a loading message when fetching data', async () => {
        server.use(http.get('/products/:id', async () => {
            await delay()

            return HttpResponse.json([])
        }))
        render(<ProductDetail productId={productId} />, { wrapper: AllProviders })

        const loading = await screen.findByText('Loading...')
        expect(loading).toBeInTheDocument()
    })

    it('should remove the loading message after products fetched', async () => {
        render(<ProductDetail productId={productId} />, { wrapper: AllProviders })
        await waitForElementToBeRemoved(() => screen.queryByText('Loading...'))
    })
    it('should remove the loading if data fetching failed', async () => {
        server.use(http.get('/products/:id', () => HttpResponse.error()))
        render(<ProductDetail productId={productId} />, { wrapper: AllProviders })
        await waitForElementToBeRemoved(() => screen.queryByText('Loading...'))
    })

    it('should render an error message if request fails', async () => {
        server.use(http.get('/products/:id', () => HttpResponse.error()))
        render(<ProductDetail productId={productId} />, { wrapper: AllProviders })

        const error = await screen.findByText(/error/i)
        expect(error).toBeInTheDocument()
    })

    it('should render not found message if no product with this id', async () => {
        render(<ProductDetail productId={0} />, { wrapper: AllProviders })

        const error = await screen.findByText(/invalid/i)
        expect(error).toBeInTheDocument()
    })
})