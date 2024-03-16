import { render, screen } from '@testing-library/react'
import ProductList from '../../src/components/ProductList'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

describe('ProductList', () => {
    it('should render the list of products', async () => {
        render(<ProductList />)

        const items = await screen.findAllByRole('listitem')
        expect(items.length).toBeGreaterThan(0)
    })

    it('should render a loading message', async () => {
        render(<ProductList />)

        const loading = await screen.findByText('Loading...')
        expect(loading).toBeInTheDocument()
    })

    it('should render an error message if no products', async () => {
        server.use(http.get('/products', () => HttpResponse.json([])))
        render(<ProductList />)

        const error = await screen.findByText(/no products/i)
        expect(error).toBeInTheDocument()
    })


})