export const resumeData = {
  name: "Sam Duffy",
  contact: {
    email: "samuel.duffy.work@gmail.com",
    website: "samuelduffy.dev",
  },

  skills: [
    { label: "Data Science",        value: "Optimization, Statistics, Applied Machine Learning" },
    { label: "Languages & Infrastructure", value: "Python, SQL, Q, KDB, Linux, Kubernetes" },
    { label: "Tools & Platforms",          value: "Claude Code, GitHub Copilot, Tableau, Azure Blob Storage, Snowflake" },
  ],
  experience: [
    {
      company: "MFS Investment Management — Boston, MA",
      roles: [
        { title: "Quantitative Trading Specialist — Systematic Execution Team", dates: "Apr 2023 – Present" },
        { title: "Senior Software Engineer — Systematic Execution Team",        dates: "Dec 2021 – Apr 2023" },
      ],
      bullets: [
        {
          items: [
            "Identified improvement opportunities in $60B+ worth of annual order flow and presented recommendations to traders, portfolio managers, and senior leadership",
            "Presented to an audience of ~30 external attendees at a KX Meetup on applying Claude Skills",
            "Used optimization techniques to improve our automated order router allocation accuracy by ~$80M/month",
            "Led the deployment of KX Insights, a specialized time-series database deployed on Azure and Kubernetes, that enabled more scalable and advanced analytics",
            "Built and maintained end-to-end ETL pipelines, data models, and a full-stack job scheduler that handled automated jobs and complex dependency management",
            // "Leveraged Claude Skills to automate system issue diagnosis and triage resolution, which significantly increased time spent on building analytics rather than troubleshooting",
            "Presented first-time insights into the quality of large liquidity events by creating an AI-assisted email parser",
            "Ran segmentation studies using clustering and multivariate statistical methods to identify which counterparties were best suited for specific order characteristics",
          ],
        },
      ],
    },

    {
      company: "Raytheon Missile & Defense — Tewksbury, MA",
      roles: [
        { title: "Systems Engineer — PATRIOT Surveillance Radar", dates: "Jun 2020 – Dec 2021" },
      ],
      bullets: [
        {
          items: [
            "Led a team of engineers to integrate custom machine learning models to detect anomalous flight patterns for air traffic controllers",
            "Completed root-cause analysis of system failures spanning all components in the PATRIOT Surveillance Radar",
            "Reduced weeks of analysis to under a minute by automating verification of hundreds of requirements",
          ],
        },
      ],
    },

    {
      company: "The Applied Research Lab — State College, PA",
      roles: [
        { title: "Distinguished Undergraduate Researcher", dates: "May 2018 – May 2020" },
      ],
      bullets: [
        {
          items: [
            "Completed a thesis on applied swarm intelligence, documenting multi-modular neural network architectures, optimization algorithms, and multi-agent systems",
            // "Developed an original algorithm to model the stalk-and-ambush hunting behavior of lions for multi-predator, single-prey scenarios",
          ],
        },
      ],
    },
  ],

  projects: [
    {
      name: "Bandit2Business",
      url: "",
      dates: "",
      description: "Multi-Armed Bandit Simulator applied to B2B advertising campaigns",
    },
    {
      name: "Personal Meal Planner",
      url: "",
      dates: "",
      description: "Full-stack meal planner, shopping list aggregator, and database of 10k recipes",
    },
  ],

  education: [
    {
      institution: "The Pennsylvania State University",
      date:        "Spring 2020",
      gpa:         "3.5",
      degree:      "BS in Mechanical Engineering — University Park, PA",
    },
  ],
};