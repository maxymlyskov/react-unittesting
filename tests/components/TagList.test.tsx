import { render, screen } from '@testing-library/react'
import TagList from '../../src/components/TagList'

describe('TagList', () => {
    it('should render tags', async () => {
        render(<TagList />)

        // await waitFor(() => {
        //     const listItem = screen.getAllByRole('listitem')
        //     expect(listItem).to
        // })

        const listItems = await screen.findAllByRole('listitem')
        expect(listItems.length).toBeGreaterThan(0)
    })
})