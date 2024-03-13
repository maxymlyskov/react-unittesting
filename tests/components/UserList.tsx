import { render, screen } from '@testing-library/react'
import UserList from '../../src/components/UserList'
import { User } from '../../src/entities'

describe('UserList', () => {
    it('should render no users when users array is empty', () => {
        render(<UserList users={[]} />)

        expect(screen.queryByRole('list')).not.toBeInTheDocument()
        expect(screen.queryByText(/no users/i)).toBeInTheDocument()
    })

    it('should render list of users', () => {
        const users: User[] = [{ name: 'Max', id: 1 }, { name: 'John', id: 2 }]
        render(<UserList users={users} />)

        const list = screen.getByRole('list')
        expect(list).toBeInTheDocument()

        users.forEach(user => {
            const link = screen.getByRole('link', { name: user.name })
            expect(link).toBeInTheDocument()
            expect(link).toHaveAttribute('href', `/users/${user.id}`)
        })
    })
})