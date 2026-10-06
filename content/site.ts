/**
 * All copy for the home page lives here, taken from the personal website brief.
 * Writing rules: no em dashes, no sentences under five words, first person,
 * Canadian spelling, and every abbreviation spelled out on first use on the page.
 * A value of null means the brief marks it [ADD]; the page hides it until filled.
 */

export interface Link {
    label: string;
    href: string;
}

export interface Role {
    id: string;
    title: string;
    org: string;
    place: string | null;
    dates: string;
    points: string[];
}

export interface Photo {
    src: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
}

export interface Entry {
    id: string;
    title: string;
    meta?: string;
    body: string[];
}

export const site = {
    name: 'Pamimo Akinjide',

    hero: {
        positioning: 'My work sits where economics, Asia and Africa trade, and applied artificial intelligence meet.',
        intro: [
            "These days I'm a Product Manager on the Hybrid Cloud team at the Royal Bank of Canada (RBC) in Toronto, and the founder of World's Edge Group, an economics consulting and artificial intelligence (AI) advisory firm.",
            'Originally from Nigeria, I moved to Canada for university in 2022 and studied Economics at the University of Saskatchewan, graduating with First Class Honours and a Computer Science minor.',
        ],
        portrait: {
            // [CONFIRM] headshot: reusing the photo from the current site
            src: '/slide-assets/header-smile.png',
            alt: 'Portrait of Pamimo Akinjide smiling',
        },
    },

    experience: [
        {
            id: 'rbc-hybrid-cloud',
            title: 'Product Manager, Hybrid Cloud',
            org: 'RBC',
            place: 'Toronto',
            dates: 'September 2026 to present',
            points: [
                "Own product direction for the bank's enterprise Kubernetes platform portfolio: on-premises OpenShift, Azure Kubernetes Service (AKS), Amazon Elastic Kubernetes Service (EKS), and an Argo CD control plane that manages deployments through Git (GitOps).",
                'Sit between internal application teams and platform engineering, translating what those teams need into platform priorities.',
                "Drive the use of AI within the team's own work, including an AI-driven software development lifecycle (AI SDLC), the end-to-end process of planning, building, testing and releasing software.",
            ],
        },
        {
            id: 'rbc-amplify',
            title: 'Business Analyst (Product Manager)',
            org: 'RBC Amplify',
            place: null,
            dates: 'Summer 2025',
            points: [
                'Product Owner on NOVA, an agentic AI automation platform projected to save around 40,000 hours of work a year across the bank.',
                'Our team won the Best Business Value Award, which came with a $20,000 prize.',
                'The work now has a patent pending.',
            ],
        },
        {
            id: 'city-of-saskatoon',
            title: 'Strategy Analyst (Intern)',
            org: 'City of Saskatoon',
            place: null,
            dates: 'July 2024 to April 2025',
            points: [
                "Worked on strategic planning, strategy execution, research, mapping and stakeholder engagement for the City's organizational strategy function.",
                'Wrote a white paper on aligning strategy with municipal budgeting and business planning, drawing on practice in Toronto, Vancouver, Edmonton and Calgary.',
                // [ADD] any other City of Saskatoon deliverables
            ],
        },
    ] as Role[],

    research: {
        entries: [
            {
                id: 'cansbridge',
                title: 'Cansbridge Fellow, 2026 cohort',
                meta: 'Peking University, Beijing',
                body: [
                    "My fellowship placed me at Peking University's Institute of New Structural Economics (INSE) in Beijing for a research placement. Only one University of Saskatchewan student had been selected for it before me.",
                    'My main project compared the patent filing rates of Chinese innovators before and after they returned to China.',
                ],
            },
            {
                id: 'thesis',
                title: 'Measuring Food Security: Does Survey Mode Matter? Evidence from Randomized Controlled Experiments in Burkina Faso and Ecuador',
                meta: 'Honours thesis',
                body: [
                    'My thesis tests whether phone surveys measure food insecurity the same way face-to-face interviews do, using experimental data from the World Food Programme (WFP).',
                    'Dr. Sabine Liebenehm of the University of Saskatchewan supervised the thesis, and Dr. Alirah Weyori of the WFP co-supervised it.',
                    'At the Canadian Economics Association (CEA) 2026 Undergraduate Poster Competition, I presented the paper as one of ten undergraduates selected nationally.',
                ],
            },
            {
                id: 'assistant',
                title: 'Research assistant and teaching assistant',
                meta: 'University of Saskatchewan, 2025',
                body: ['In 2025, I also worked as both a research assistant and a teaching assistant at the University of Saskatchewan.'],
            },
        ] as Entry[],
        interests:
            'My research interests are development economics, domestic value-added in African exports, New Structural Economics, and Africa and Asia trade corridors.',
    },

    building: {
        body: "World's Edge Group is the economics consulting and AI advisory firm I founded. Its own website covers the firm's work in more detail.",
        link: { label: "Visit World's Edge Group", href: 'https://worldsedgegroup.com' } as Link,
    },

    leadership: [
        {
            id: 'ess',
            title: 'Co-founder and first President, Economics Students Society',
            meta: 'University of Saskatchewan',
            body: ['Less than nine months after moving to Canada, I co-founded the society, served as its first President, and later stayed on as an advisor.'],
        },
        {
            id: 'pasa',
            title: 'President, Pan-African Students Association (PASA)',
            meta: 'University of Saskatchewan',
            body: ['After a term as Vice President Finance, I became President, holding the role at the same time as the Economics Students Society presidency.'],
        },
        {
            id: 'nigeria',
            title: 'Software engineer and community service team lead',
            meta: 'Nigeria, before university',
            body: ['Before university, I spent roughly two to three years working in Nigeria as a software engineer and as a community service team lead managing people.'],
        },
    ] as Entry[],

    education: {
        degree: 'Bachelor of Arts (Honours) in Economics',
        details: 'First Class Honours, with a minor in Computer Science',
        school: 'University of Saskatchewan',
    },

    beyond: {
        // [ADD] any other interests
        interests: 'Outside of work, my time goes to mentorship, economics and agriculture.',
        writing: {
            text: 'My longer pieces of writing all live on my writing page.',
            link: { label: 'Read my writing', href: '/blog' } as Link,
        },
        video: {
            text: 'A short video documents my Cansbridge summer travelling through Asia.',
            // [ADD] YouTube or Vimeo link for the Cansbridge video recap
            url: null as string | null,
            title: 'My Cansbridge summer in Asia',
        },
        watches: 'And on a lighter note, watches are a real soft spot of mine.',
        // Carried over from the old site's About section
        askMe: 'Ask me about why I hate American milk or my Chinese language progress.',
        photos: [
            { src: '/slide-assets/travel-falls.jpg', width: 768, height: 1024, alt: 'Pamimo smiling in a red rain poncho on a boat in a waterfall gorge', caption: 'A very wet boat tour' },
            { src: '/slide-assets/group-ess.jpg', width: 1024, height: 835, alt: 'Pamimo with five members of the Economics Students Society in front of a University of Saskatchewan sign', caption: 'Economics Students Society, University of Saskatchewan' },
            { src: '/slide-assets/group-cup.jpg', width: 1024, height: 659, alt: 'Pamimo and three teammates holding a second-place trophy in front of a $1.5K prize screen', caption: 'Second place, with the team' },
            { src: '/slide-assets/ramen.jpg', width: 768, height: 1024, alt: 'A bowl of spicy ramen with chashu, a soft egg and fish cake', caption: 'Ramen research' },
            { src: '/slide-assets/food-kbbq.jpg', width: 1024, height: 768, alt: 'A Korean barbecue spread with cold noodles on a red table', caption: 'Korean barbecue night' },
        ] as Photo[],
    },

    contact: {
        text: "Email is the best way to reach me, and LinkedIn works well too.",
        // [CONFIRM] email and LinkedIn: reusing the values from the current site
        email: 'oluwapamimoakinjide@gmail.com',
        linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pamimo' } as Link,
        newsletter: {
            text: 'Leave your email below to hear about new writing when it comes out.',
            label: 'Email address',
            button: 'Subscribe',
            loading: 'Subscribing you now',
            success: "Thanks, you're now subscribed to new writing.",
            error: "That didn't go through, so please check the address and try again.",
        },
        // [ADD] CV file, if you want one downloadable
        cv: null as Link | null,
    },

    footer: '© 2026 Pamimo Akinjide, Toronto',
};

export const NAV = [
    { id: 'experience', label: 'Experience' },
    { id: 'research', label: 'Research' },
    { id: 'building', label: 'Building' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'education', label: 'Education' },
    { id: 'beyond', label: 'Beyond work' },
    { id: 'contact', label: 'Contact' },
];
