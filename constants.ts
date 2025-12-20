
import { Project } from './types';

export const PROJECT_DATA: Record<string, Project> = {
  nova: {
      id: "nova",
      title: "NOVA: Agentic AI for Banking",
      subtitle: "Product Lead // RBC Amplify",
      tag: "Product Innovation",
      context: "RBC Amplify is one of Canada's most competitive innovation programs. Selected to lead product strategy for a cross-functional squad tackling complex banking operations.",
      stack: ["Agentic AI", "Product Strategy", "Roadmapping", "Stakeholder Mgmt"],
      what: "Conceptualized NOVA, a first-of-its-kind agentic AI concept for RBC’s Advice Centre. Built the roadmap from MVP to scaled deployment, defining value proposition and operational mechanics.",
      how: "Identified key administrative bottlenecks and translated them into agent workflows. Built the business case for AI adoption, focusing on operational velocity, reduced friction, and scalable advisor efficiency.",
      impact: "Won the $20,000 Prize for 'Best Business Value'. The solution demonstrated forward-looking leadership at the intersection of AI and Operations, directly influencing senior leadership decisions.",
      category: ['product', 'tech'],
      year: 2025,
      stats: { strategy: 90, tech: 85, product: 100, leadership: 80 }
  },
  wfp: {
      id: "wfp",
      title: "Global Research Co-Author",
      subtitle: "Researcher // World Food Programme",
      tag: "Research & Strategy",
      context: "A multi-country empirical study evaluating data quality and cost-efficiency tradeoffs in fragile contexts (Myanmar, Ecuador, CAR).",
      stack: ["Python", "R", "Stata", "Econometrics"],
      what: "Analyzed 150K+ records to determine how humanitarian organizations can collect data at scale under cost constraints. Co-authored a critical study on data quality tradeoffs.",
      how: "Built predictive models to forecast program demand and executed econometric analysis using rCARI indicators. Navigated complex non-random selection bias to ensure validity across 200+ operational metrics.",
      impact: "Work directly affects program targeting and funding allocation for the WFP. Established new methodological standards for food security measurement in crisis settings.",
      category: ['strategy', 'tech'],
      year: 2025,
      stats: { strategy: 95, tech: 90, product: 40, leadership: 30 }
  },
  weg: {
      id: "weg",
      title: "World's Edge Group",
      subtitle: "Founder // Advisory Platform",
      tag: "Entrepreneurship",
      context: "Founded an independent economic advisory platform to deliver institutional-grade strategy independent of large firms.",
      stack: ["Economic Valuation", "Impact Modeling", "Brand Systems"],
      what: "Designed the operating infrastructure, pricing models, and evaluation frameworks. Created the 'Impact 100' methodology for the Western Canada Economic Forum.",
      how: "Authored comprehensive economic valuation reports and board-ready briefs. Translated technical data into clear strategic narratives for clients like Project HAIRitage.",
      impact: "Established standing evidence of market trust, delivering high-quality impact reports and strategic briefs that rival top-tier consultancies.",
      category: ['strategy', 'tech'],
      year: 2024,
      stats: { strategy: 100, tech: 60, product: 70, leadership: 100 }
  },
  city: {
      id: "city",
      title: "Municipal Performance System",
      subtitle: "Strategy Analyst // City of Saskatoon",
      tag: "Strategy",
      context: "Contributor to a city-wide strategic plan for a municipality of 300,000+ citizens, moving from high-level policy goals to execution readiness.",
      stack: ["Power BI", "SQL", "Strategic Planning", "Variance Analysis"],
      what: "Developed 6 scalable financial dashboards using Power BI and SQL to analyze $1B+ in municipal budget data, translating ambiguous policy into structured performance systems.",
      how: "Performed rigorous variance analysis to identify $1M+ in budget optimizations. Automating monthly reporting processes reduced manual cycle time by 30%.",
      impact: "City leadership gained real-time visibility into strategic priorities. Decisions affecting nearly 300,000 residents were grounded in measurable progress rather than static reports.",
      category: ['strategy', 'tech'],
      year: 2025,
      stats: { strategy: 85, tech: 75, product: 50, leadership: 40 }
  },
  sctc: {
      id: "sctc",
      title: "Saskatoon Summer Players",
      subtitle: "Lead Analyst // WEG",
      tag: "Data Analysis",
      context: "A local arts organization struggled to justify its funding requests to donors who prioritized 'hard' economic metrics over cultural value.",
      stack: ["Capital Fundraising", "Economic Impact", "Reporting"],
      what: "Authored a comprehensive economic valuation report contributing to a $11M fundraising strategy.",
      how: "Quantified community impact to secure major capital infrastructure. Translated technical findings into clear language for funders and policymakers.",
      impact: "Arts organizations gained credible, quantitative evidence to unlock funding ($11M strategy) and defend cultural infrastructure as economic infrastructure.",
      category: ['tech', 'strategy'],
      year: 2025,
      stats: { strategy: 90, tech: 60, product: 20, leadership: 50 }
  },
  pasa: {
      id: "pasa",
      title: "Pan-African Students Association",
      subtitle: "President // PASA",
      tag: "Leadership",
      context: "Pan-African students were operating in silos, lacking a unified community or professional support network.",
      stack: ["Governance", "Financial Planning", "Community Growth"],
      what: "Orchestrated a growth strategy that increased annual events from 2 to 10. Led the association to create a durable institutional community.",
      how: "Secured $10K in external funding through strategic financial planning. Positioned PASA as a legitimate stakeholder within the university ecosystem.",
      impact: "Achieved 40% YoY membership growth and created lasting professional access. PASA outlives my tenure—the marker of real leadership.",
      category: ['strategy'],
      year: 2023,
      stats: { strategy: 80, tech: 10, product: 60, leadership: 95 }
  },
  ess: {
      id: "ess",
      title: "Economics Students Society",
      subtitle: "Co-Founder & President",
      tag: "Leadership",
      context: "Recognized a gap in professional development and community for Economics students at the university level.",
      stack: ["Community Building", "Partnerships", "Career Dev"],
      what: "Founded and scaled the first dedicated society for Economics students, filling a critical gap in professional development and academic support.",
      how: "Scaled organization to 40+ members from ground zero. Built collaborative relationships with faculty and industry partners to launch career development programming.",
      impact: "Created a sustainable institution that provides students with mentorship, industry access, and a sense of belonging within the department.",
      category: ['strategy'],
      year: 2023,
      stats: { strategy: 70, tech: 10, product: 50, leadership: 90 }
  }
};