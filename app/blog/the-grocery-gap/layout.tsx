import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Grocery Gap | Pamimo Akinjide',
    description: 'An interactive exploration of why inflation feels higher than the official numbers say. Calculate your personal inflation rate.',
    alternates: {
        canonical: 'https://pamimoakinjide.com/blog/the-grocery-gap',
    },
    openGraph: {
        title: 'The Grocery Gap',
        description: 'Why your grocery bill feels higher than the CPI says. Interactive data visualization and personal inflation calculator.',
        images: [
            {
                url: 'https://pamimoakinjide.com/images/frequency_bias_meat_meme.jpg',
                width: 1200,
                height: 630,
                alt: 'The Grocery Gap: Frequency Bias Meme',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Grocery Gap',
        description: 'Why your grocery bill feels higher than the CPI says. Interactive data visualization and personal inflation calculator.',
        images: ['https://pamimoakinjide.com/images/frequency_bias_meat_meme.jpg'],
    },
};

export default function GroceryGapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
