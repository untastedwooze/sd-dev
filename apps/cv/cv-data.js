export const resumeData = {
  name: "Sam Duffy",
  contact: {
    email: "samuel.duffy.work@gmail.com",
  },

  skills: [
    { label: "Languages",           value: "Python, Q, SQL, KDB, MATLAB" },
    { label: "Data & Tools",        value: "Tableau, Azure Blob Storage, Bloomberg Data License" },
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
            "Analyzed $60B+ in annual transaction flow to identify performance drivers, presenting findings and recommendations directly to senior leadership",
            "Built and maintained dashboards used by leadership and stakeholders globally to track KPIs and make faster, better-informed operational calls",
            "Built pre-trade market impact forecasts using statistical regression and industry research, work that translates directly to forecasting marketing performance and campaign impact",
            "Used KNN clustering and multivariate statistical methods to segment counterparties and identify the best matches, the same core skillset used in audience segmentation and targeting",
            "Designed a closed-form optimization algorithm that improved monthly order allocation accuracy by roughly $80M",
            "Built ETL pipelines and data models from scratch to handle high-volume datasets that previously had no structured pipeline",
            "Wrote Python libraries (bootstrapping, bagging, stratified sampling) so the team could prototype statistical models in days instead of weeks",
            "Set up automated job scheduling that cut down on manual, repetitive reporting work",
            "Led the build-out of a time-series database on Azure and Kubernetes, replacing a system that kept falling over under load",
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
            "Completed root-cause analysis of defects spanning all parts of the PATRIOT Surveillance systems.",
            "Led the test team of an internal Radar & Missile Simulation project, designing and executing the functional requirement test plans.",
            "Automated the annual verification process of complex functional requirements, reducing weeks of analysis to under a minute.",
            "Led a team of engineers to integrate several custom machine learning models to detect anomalous flight patterns for air traffic controllers.",
            "Used TensorFlow and Keras to develop a custom TadGAN machine learning model and training functions for each of its networks.",
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
