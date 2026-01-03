import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Grocery Gap | Pamimo Akinjide',
    description: 'An interactive exploration of why inflation feels higher than the official numbers say. Calculate your personal inflation rate.',
    openGraph: {
        title: 'The Grocery Gap',
        description: 'Why your grocery bill feels higher than the CPI says. Interactive data visualization and personal inflation calculator.',
        images: ['/grocery-gap-og.jpg'], // Placeholder, but good to have
    },
};

export default function GroceryGapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
