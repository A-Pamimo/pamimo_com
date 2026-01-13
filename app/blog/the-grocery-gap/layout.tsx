import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Grocery Gap | Pamimo Akinjide',
    description: 'An interactive exploration of why inflation feels higher than the official numbers say. Calculate your personal inflation rate.',
    openGraph: {
        title: 'The Grocery Gap',
        description: 'Why your grocery bill feels higher than the CPI says. Interactive data visualization and personal inflation calculator.',
        images: [
            {
                url: '/grocery-gap-og.jpg',
                width: 1200,
                height: 900,
                alt: 'The Grocery Gap: Frequency Bias Meme',
            },
        ],
    },
};

export default function GroceryGapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
