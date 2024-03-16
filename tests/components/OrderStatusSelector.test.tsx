import { render, screen } from '@testing-library/react'
import OrderStatusSelector from '../../src/components/OrderStatusSelector'
import { Theme } from '@radix-ui/themes'
import userEvent from '@testing-library/user-event'

describe('OrderStatusSelector', () => {
    const renderComponent = () => {
        const onChange = vi.fn()
        render(<Theme><OrderStatusSelector onChange={onChange} /></Theme>)
        const button = screen.getByRole('combobox')

        return {
            trigger: button,
            getOptions: () => screen.findAllByRole('option'),
            onChange,
            user: userEvent.setup(),
            getOption: (label: RegExp) => screen.findByRole('option', { name: label })
        }
    }
    it('should render New as the default value', () => {
        const { trigger } = renderComponent()

        expect(trigger).toHaveTextContent(/new/i)
    })

    it('should render correct statuses', async () => {
        const { trigger, getOptions, user } = renderComponent()

        await user.click(trigger)

        const items = await getOptions()
        expect(items).toHaveLength(3)
        const correctLabels = ['New', 'Processed', 'Fulfilled']
        const labels = items.map(item => item.textContent)
        expect(labels).toEqual(correctLabels)
    })

    it.each([
        { status: 'processed', label: /processed/i },
        { status: 'fulfilled', label: /fulfilled/i }
    ])('should call onChange with $status when the option is $label', async ({ label, status }) => {
        const { trigger, onChange, user, getOption } = renderComponent()

        await user.click(trigger)

        const option = await getOption(label)
        await user.click(option)
        expect(onChange).toHaveBeenCalledWith(status)
    })

    it("should call onChange with 'new' when the option is New", async () => {
        const { trigger, onChange, user, getOption } = renderComponent()
        await user.click(trigger)

        const processedOption = await getOption(/processed/i)
        await user.click(processedOption)

        await user.click(trigger)

        const newOption = await getOption(/new/i)
        await user.click(newOption)

        expect(onChange).toHaveBeenCalledWith('new')
    })

})