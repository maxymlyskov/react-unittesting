import { render, screen } from '@testing-library/react'

import ProductImageGallery from '../../src/components/ProductImageGallery'

describe('ProductImageGallery', () => {
    it('should render image gallery', () => {
        const imageUrls = ['image1', 'image2']
        render(<ProductImageGallery imageUrls={imageUrls} />)

        const images = screen.getAllByRole('img')

        expect(images).toHaveLength(2)
        images.forEach((image, index) => {
            expect(images[index]).toHaveAttribute('src', imageUrls[index])
        })
    })

    it('should render nothing when no images provided', () => {
        const { container } = render(<ProductImageGallery imageUrls={[]} />)
        expect(container).toBeEmptyDOMElement()
    })
})
