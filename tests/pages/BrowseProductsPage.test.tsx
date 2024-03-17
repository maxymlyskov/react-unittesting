import { Theme } from '@radix-ui/themes';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Category, Product } from '../../src/entities';
import BrowseProductsPage from '../../src/pages/BrowseProductsPage';
import { CartProvider } from '../../src/providers/CartProvider';
import { db } from '../mocks/db';
import { simulateDelay, simulateError } from '../utils';

describe('BrowseProductsPage', () => {
    const products: Product[] = [];
    const categories: Category[] = [];

    beforeAll(() => {
        [1, 2].forEach((item) => {
            const category = db.category.create({ name: `Category ${item}` })
            categories.push(category)
            const product = db.product.create()
            products.push(product)
        });
    })

    afterAll(() => {
        const categoryIds = categories.map(category => category.id)
        const productIds = products.map(product => product.id)

        db.product.deleteMany({ where: { id: { in: productIds } } })
        db.category.deleteMany({ where: { id: { in: categoryIds } } })
    })

    const renderComponent = () => {
        render(<Theme>
            <CartProvider>
                <BrowseProductsPage />
            </CartProvider>
        </Theme>)

        return {
            getProductsSkeleton: () => screen.queryByRole('progressbar', { name: /products/i }),
            getCategoriesSkeleton: () => screen.queryByRole('progressbar', { name: /categories/i }),
            getCategoriesCombobox: () => screen.queryByRole('combobox')
        }

    }

    it('should render loading skeletons for categories when data is fetching', () => {
        simulateDelay('/categories')

        const { getCategoriesSkeleton } = renderComponent()

        expect(getCategoriesSkeleton()).toBeInTheDocument()
    })
    it('should hide loading skeletons for categories when data is fetched', async () => {
        const { getCategoriesSkeleton } = renderComponent()

        await waitForElementToBeRemoved(getCategoriesSkeleton)
    })

    it('should render loading skeletons for products when data is fetching', () => {
        simulateDelay('/products')
        const { getProductsSkeleton } = renderComponent()

        expect(getProductsSkeleton()).toBeInTheDocument()
    })
    it('should hide loading skeletons for products when data is fetched', async () => {
        const { getProductsSkeleton } = renderComponent()

        await waitForElementToBeRemoved(getProductsSkeleton)
    })

    it('should not render an error if categories can`t be fetched', async () => {
        simulateError('/categories')
        const { getProductsSkeleton, getCategoriesCombobox } = renderComponent();

        await waitForElementToBeRemoved(getProductsSkeleton)

        expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
        expect(getCategoriesCombobox()).not.toBeInTheDocument()

    })

    it('should not render an error if products can`t be fetched', async () => {
        simulateError('/products')
        const { getProductsSkeleton } = renderComponent();

        await waitForElementToBeRemoved(getProductsSkeleton)

        expect(screen.queryByText(/error/i)).toBeInTheDocument()

    })

    it('should render categories', async () => {
        const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

        await waitForElementToBeRemoved(getCategoriesSkeleton)

        const combobox = getCategoriesCombobox()

        expect(combobox).toBeInTheDocument()
        const user = userEvent.setup()

        await user.click(combobox!)
        expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument()
        categories.forEach(category => {
            expect(screen.getByRole('option', { name: category.name })).toBeInTheDocument()
        })
    })

    it('should render products', async () => {
        const { getProductsSkeleton } = renderComponent();

        await waitForElementToBeRemoved(getProductsSkeleton)
        products.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument()
        })
    })
})