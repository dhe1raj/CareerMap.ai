
export interface RoadmapStep {
  order: number;
  label: string;
  estTime: string;
  completed?: boolean;
}

export interface RoadmapTemplate {
  id: string;
  title: string;
  steps: RoadmapStep[];
  category?: string; // Added category property as optional
}

export const roadmapTemplates: RoadmapTemplate[] = [
  {
    id: "ai-ml-engineer",
    title: "AI / ML Engineer",
    steps: [
      { order: 1, label: "Learn Python foundations", estTime: "2 weeks" },
      { order: 2, label: "Master linear algebra & stats", estTime: "3 weeks" },
      { order: 3, label: "Finish 'Machine Learning' by Andrew Ng (Coursera)", estTime: "4 weeks" },
      { order: 4, label: "Build & deploy a small image-classifier project", estTime: "2 weeks" },
      { order: 5, label: "Study deep-learning (fast.ai or Deeplearning.ai)", estTime: "4 weeks" },
      { order: 6, label: "Contribute to an open-source ML repo on GitHub", estTime: "ongoing" },
      { order: 7, label: "Create a portfolio on Hugging Face Spaces", estTime: "1 week" }
    ]
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    steps: [
      { order: 1, label: "Master Python or R programming", estTime: "3 weeks" },
      { order: 2, label: "Learn statistics & probability theory", estTime: "4 weeks" },
      { order: 3, label: "Study data manipulation (pandas, dplyr)", estTime: "2 weeks" },
      { order: 4, label: "Learn data visualization techniques", estTime: "2 weeks" },
      { order: 5, label: "Study machine learning algorithms", estTime: "4 weeks" },
      { order: 6, label: "Complete a data science bootcamp or course", estTime: "8 weeks" },
      { order: 7, label: "Build a portfolio with 3 end-to-end projects", estTime: "4 weeks" },
      { order: 8, label: "Contribute to a public dataset analysis", estTime: "ongoing" }
    ]
  },
  {
    id: "software-developer",
    title: "Software Developer",
    steps: [
      { order: 1, label: "Learn a programming language (Python, JavaScript, Java)", estTime: "4 weeks" },
      { order: 2, label: "Master data structures & algorithms", estTime: "6 weeks" },
      { order: 3, label: "Learn version control with Git & GitHub", estTime: "1 week" },
      { order: 4, label: "Study a web framework (React, Django, etc.)", estTime: "4 weeks" },
      { order: 5, label: "Learn database concepts & SQL", estTime: "3 weeks" },
      { order: 6, label: "Build a full-stack project from scratch", estTime: "4 weeks" },
      { order: 7, label: "Learn testing & debugging practices", estTime: "2 weeks" },
      { order: 8, label: "Contribute to open source projects", estTime: "ongoing" }
    ]
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    steps: [
      { order: 1, label: "Learn networking fundamentals", estTime: "3 weeks" },
      { order: 2, label: "Study operating system security", estTime: "4 weeks" },
      { order: 3, label: "Master security tools & techniques", estTime: "5 weeks" },
      { order: 4, label: "Learn ethical hacking principles", estTime: "4 weeks" },
      { order: 5, label: "Get CompTIA Security+ certification", estTime: "6 weeks" },
      { order: 6, label: "Study incident response procedures", estTime: "2 weeks" },
      { order: 7, label: "Practice with CTF competitions", estTime: "ongoing" },
      { order: 8, label: "Build a home security lab", estTime: "3 weeks" }
    ]
  },
  {
    id: "cloud-architect",
    title: "Cloud Architect",
    steps: [
      { order: 1, label: "Learn cloud fundamentals (AWS/Azure/GCP)", estTime: "4 weeks" },
      { order: 2, label: "Master virtualization & containers", estTime: "3 weeks" },
      { order: 3, label: "Study networking in cloud environments", estTime: "3 weeks" },
      { order: 4, label: "Learn infrastructure as code", estTime: "4 weeks" },
      { order: 5, label: "Get a cloud certification", estTime: "8 weeks" },
      { order: 6, label: "Study cloud security principles", estTime: "3 weeks" },
      { order: 7, label: "Build multi-service cloud architecture", estTime: "4 weeks" },
      { order: 8, label: "Learn cost optimization strategies", estTime: "2 weeks" }
    ]
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    steps: [
      { order: 1, label: "Learn Linux system administration", estTime: "4 weeks" },
      { order: 2, label: "Master Git & GitHub workflows", estTime: "2 weeks" },
      { order: 3, label: "Study containerization with Docker", estTime: "3 weeks" },
      { order: 4, label: "Learn container orchestration (Kubernetes)", estTime: "4 weeks" },
      { order: 5, label: "Master CI/CD pipelines", estTime: "3 weeks" },
      { order: 6, label: "Study Infrastructure as Code (Terraform, Ansible)", estTime: "4 weeks" },
      { order: 7, label: "Learn monitoring and logging solutions", estTime: "2 weeks" },
      { order: 8, label: "Implement a complete DevOps pipeline project", estTime: "4 weeks" }
    ]
  },
  {
    id: "full-stack-dev",
    title: "Full-Stack Developer",
    steps: [
      { order: 1, label: "Master HTML, CSS & JavaScript fundamentals", estTime: "4 weeks" },
      { order: 2, label: "Learn a frontend framework (React, Vue, Angular)", estTime: "6 weeks" },
      { order: 3, label: "Study a backend language (Node.js, Python, Ruby)", estTime: "5 weeks" },
      { order: 4, label: "Learn database concepts & ORM", estTime: "3 weeks" },
      { order: 5, label: "Master API design & implementation", estTime: "3 weeks" },
      { order: 6, label: "Study authentication & security", estTime: "2 weeks" },
      { order: 7, label: "Build a complete full-stack application", estTime: "6 weeks" },
      { order: 8, label: "Learn deployment & DevOps basics", estTime: "3 weeks" }
    ]
  },
  {
    id: "ui-ux-designer",
    title: "UI / UX Designer",
    steps: [
      { order: 1, label: "Learn design fundamentals & principles", estTime: "3 weeks" },
      { order: 2, label: "Master a design tool (Figma, Sketch, XD)", estTime: "4 weeks" },
      { order: 3, label: "Study user research methods", estTime: "2 weeks" },
      { order: 4, label: "Learn information architecture", estTime: "2 weeks" },
      { order: 5, label: "Practice wireframing & prototyping", estTime: "3 weeks" },
      { order: 6, label: "Study interaction design patterns", estTime: "3 weeks" },
      { order: 7, label: "Build a design system from scratch", estTime: "4 weeks" },
      { order: 8, label: "Create a UX case study portfolio", estTime: "4 weeks" }
    ]
  }
];
