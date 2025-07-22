export interface Experience {
	title: string;
	company: string;
	duration: string;
	achievements: string[];
}

export const experienceData: Experience[] = [
	{
		title: 'Software Engineer',
		company: 'Stealth',
		duration: 'May 2025 - Present',
		achievements: [
			'Building real-time collaborative features using Canvas, React Flow, Yjs, Blocknote',
			'Developed frontend interfaces using React.js with structured state management',
			'Worked on SDK development for reusable modules and integrations',
			'Integrated real-time communication in canvas-based environments',
			'Collaborated with backend systems developed in Golang',
			'Contributing to the development of two separate products: Enterprise Goal & Work Management System and Saas Team Management System',
		],
	},
	{
		title: 'Software Engineer I & Founding Partner',
		company: 'Vaayu Digital',
		duration: 'Sep 2023 - Present',
		achievements: [
			'Reduced chunk size using Code splitting, Lazy loading, Minification, and Compression by 60%',
			'Worked with multiple US and UK based startups to start their business',
			'Implemented modern CI/CD pipelines reducing deployment time by 40%',
		],
	},
	{
		title: 'Software Engineer',
		company: 'Growth Graphers',
		duration: 'May 2022 - Aug 2023',
		achievements: [
			'Engineered high-performance B2B and B2C web applications using React, Redux, and Node.js',
			'Achieved 90+ PageSpeed scores through optimization techniques',
			'Developed custom middleware for CRM-CMS connections',
			'Led multiple full-stack projects from concept to deployment',
		],
	},
	{
		title: 'Product Engineer',
		company: 'TUBBR',
		duration: 'Jun 2019 - Apr 2022',
		achievements: [
			'Led a team of engineers in web and mobile application development',
			'Orchestrated product planning from market research to delivery',
			'Pioneered growth strategy spanning 2 years',
			'Managed stakeholder communications and third-party collaborations',
		],
	},
];
