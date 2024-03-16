import { render, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import ProductDetail from '../../src/components/ProductDetail'
import { db } from '../mocks/db'
import { server } from '../mocks/server'

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
        render(<ProductDetail productId={productId} />)
        const product = db.product.findFirst({ where: { id: { equals: productId } } })

        const name = await screen.findByText(new RegExp(product!.name))
        const price = await screen.findByText(new RegExp(product!.price.toString()))
        expect(name).toBeInTheDocument()
        expect(price).toBeInTheDocument()
    })

    it('should render a loading message', async () => {
        render(<ProductDetail productId={productId} />)

        const loading = await screen.findByText('Loading...')
        expect(loading).toBeInTheDocument()
    })

    it('should render an error message if no product', async () => {
        server.use(http.get('/products/:id', () => HttpResponse.json(undefined)))
        render(<ProductDetail productId={productId} />)

        const error = await screen.findByText(/error/i)
        expect(error).toBeInTheDocument()
    })

    it('should render not found message if no product with this id', async () => {
        render(<ProductDetail productId={0} />)

        const error = await screen.findByText(/invalid/i)
        expect(error).toBeInTheDocument()
    })
})