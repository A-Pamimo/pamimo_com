import { Metadata } from 'next';
import GroceryGapApp from '@/components/apps/grocery-gap/GroceryGapApp';
import { RegionProvider } from '@/components/apps/grocery-gap/context/RegionContext';

// Import the scoped theme
import '@/components/apps/grocery-gap/theme.css';

export const metadata: Metadata = {
    title: 'The Grocery Gap | The Cost You Feel',
    description: 'An interactive exploration of why inflation feels higher than the official numbers say.',
};

export default function GroceryGapPage() {
    return (
        <div className="grocery-gap-app-theme">
            <RegionProvider>
                <GroceryGapApp />
            </RegionProvider>
        </div>
    );
}
