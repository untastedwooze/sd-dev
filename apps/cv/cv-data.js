export const resumeData = {
  name: "Sam Duffy",
  contact: {
    email: "samuel.duffy.work@gmail.com",
  },

  skills: [
    { label: "Languages",           value: "Python, SQL, Q, KDB, MATLAB" },
    { label: "Tools",        value: "Claude Code, Github Copilot, Tableau, Azure Blob Storage, Snowflake" },
    { label: "Platforms & Methods", value: "Linux, Kubernetes, Optimization, Statistics, Applied Machine Learning" },
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
            "Identified optimization opportunities in $60B+ worth of annual order flow, presented findings and recommendations directly to senior leadership",
            "Leveraged Claude Skills to automate system issue diagnosis and triage resolution, significantly increasing time spent on building analytics rather than troubleshooting",
            "Presented first time insights into the quality of large liquidity events by creating an AI-assisted parser that normalized unstructured emails",
            "Built and maintained dashboards used by leadership and global stakeholders to track KPIs and make faster, better-informed decisions",
            "Ran segmentation studies using various clustering and multivariate statistical methods to identify which counterparties were best suited for specific order characteristics",
            "Improved monthly order allocation accuracy by roughly $80M by deriving a closed-form optimization algorithm for our automated order router",
            "Built most of our end-to-end ETL pipelines and data models",
            "Reduced statistical model prototyping time by writing libraries to handle statistical methods such as bootstrapping, bagging, and stratified sampling",
            "Created a full stack job scheduler that handles all of our automated jobs and complex dependency management",
            "Led the build-out of KX Insights, a specialized time-series database deployed on Azure and Kubernetes, enabling us to run more advanced analytics",
            "Worked closely with engineering to set data standards and catch integrity issues before they hit downstream reports",
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
            "Developed a suite of tools for rapid data extraction, display, and analysis using OOP techniques.",
            "Completed root-cause analysis of defects spanning all systems in the PATRIOT Surveillance Radar.",
            "Led a team of engineers to integrate several custom machine learning models to detect anomalous flight patterns for air traffic controllers.",
            "Used TensorFlow and Keras to develop a custom TadGAN machine learning model and training functions for each of its networks.",
            "Led the test team of an internal Radar & Missile Simulation project, designing and executing the functional requirement test plans.",
            "Automated the annual verification process of complex functional requirements, reducing weeks of analysis to under a minute.",
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
            "Completed a thesis on applied swarm intelligence, documenting multi-modular neural network architectures, meta-heuristic optimization algorithms, and multi-agent systems.",
            "Developed an original algorithm to model the stalk-and-ambush hunting behavior of lions for multi-predator, single-prey scenarios.",
          ],
        },
      ],
    },
  ],

  education: [
    {
      institution: "The Pennsylvania State University",
      date:        "Spring 2020",
      degree:      "B.S. in Mechanical Engineering — University Park, PA",
    },
  ],
};
