import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBox from '../../src/components/SearchBox'

describe('SearchBox', () => {
    const renderComponent = () => {
        const onChange = vi.fn()
        render(<SearchBox onChange={onChange} />)
        const input = screen.getByPlaceholderText(/search/i)

        return { onChange, input }
    }
    it('should call onChange func when user clicks enter & there is text in input', async () => {
        const { onChange, input } = renderComponent()
        const user = userEvent.setup()
        const searchTerm = 'search term'

        await user.type(input, `${searchTerm}{enter}`)

        expect(onChange).toHaveBeenCalledWith(searchTerm)
    })
    it('should not call onChange func when user clicks enter & there is no text in input', async () => {
        const { onChange, input } = renderComponent()
        const user = userEvent.setup()

        await user.type(input, '{enter}')

        expect(onChange).not.toHaveBeenCalled()
    })
})