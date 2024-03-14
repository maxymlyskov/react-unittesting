import { render, screen } from '@testing-library/react'
import OrderStatusSelector from '../../src/components/OrderStatusSelector'
import { Theme } from '@radix-ui/themes'
import userEvent from '@testing-library/user-event'

describe('OrderStatusSelector', () => {
    const renderComponent = () => {
        render(<Theme><OrderStatusSelector onChange={vi.fn()} /></Theme>)
        const button = screen.getByRole('combobox')

        return {
            trigger: button, getOptions: () => screen.findAllByRole('option')
        }
    }
    it('should render New as the default value', () => {
        const { trigger } = renderComponent()

        expect(trigger).toHaveTextContent(/new/i)
    })

    it('should render correct statuses', async () => {
        const { trigger, getOptions } = renderComponent()

        const user = userEvent.setup()
        await user.click(trigger)

        const items = await getOptions()
        expect(items).toHaveLength(3)
        const correctLabels = ['New', 'Processed', 'Fulfilled']
        const labels = items.map(item => item.textContent)
        expect(labels).toEqual(correctLabels)
    })
})