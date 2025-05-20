
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
      { order: 1, label: "Master statistical analysis fundamentals", estTime: "3 weeks" },
      { order: 2, label: "Learn Python & data science libraries (pandas, numpy)", estTime: "4 weeks" },
      { order: 3, label: "Practice data visualization with matplotlib/seaborn", estTime: "2 weeks" },
      { order: 4, label: "Complete a Kaggle competition (beginner to intermediate)", estTime: "3 weeks" },
      { order: 5, label: "Study machine learning algorithms & implementations", estTime: "4 weeks" },
      { order: 6, label: "Create an end-to-end data science project for portfolio", estTime: "3 weeks" },
      { order: 7, label: "Learn big data technologies (Spark, Hadoop basics)", estTime: "3 weeks" },
      { order: 8, label: "Practice SQL & database optimization", estTime: "2 weeks" }
    ]
  },
  {
    id: "software-developer",
    title: "Software Developer",
    steps: [
      { order: 1, label: "Master a programming language (JavaScript, Python, Java)", estTime: "4 weeks" },
      { order: 2, label: "Learn data structures & algorithms fundamentals", estTime: "3 weeks" },
      { order: 3, label: "Build a simple CRUD application", estTime: "2 weeks" },
      { order: 4, label: "Learn version control with Git & GitHub", estTime: "1 week" },
      { order: 5, label: "Study software design patterns", estTime: "3 weeks" },
      { order: 6, label: "Practice test-driven development", estTime: "2 weeks" },
      { order: 7, label: "Create a portfolio with 3 diverse projects", estTime: "4 weeks" },
      { order: 8, label: "Contribute to an open-source project", estTime: "ongoing" }
    ]
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    steps: [
      { order: 1, label: "Learn networking fundamentals (OSI model, TCP/IP)", estTime: "3 weeks" },
      { order: 2, label: "Study different types of cyber attacks & defenses", estTime: "4 weeks" },
      { order: 3, label: "Practice with security tools (Wireshark, Nmap, etc.)", estTime: "2 weeks" },
      { order: 4, label: "Set up a home lab for security testing", estTime: "1 week" },
      { order: 5, label: "Learn threat intelligence & incident response", estTime: "3 weeks" },
      { order: 6, label: "Study security compliance frameworks (NIST, ISO)", estTime: "2 weeks" },
      { order: 7, label: "Prepare for Security+ or similar certification", estTime: "4 weeks" },
      { order: 8, label: "Complete CTF (Capture The Flag) challenges", estTime: "ongoing" }
    ]
  },
  {
    id: "cloud-architect",
    title: "Cloud Architect",
    steps: [
      { order: 1, label: "Learn cloud computing fundamentals", estTime: "2 weeks" },
      { order: 2, label: "Master one major cloud platform (AWS, Azure, GCP)", estTime: "6 weeks" },
      { order: 3, label: "Study infrastructure as code (Terraform, CloudFormation)", estTime: "3 weeks" },
      { order: 4, label: "Learn container orchestration (Kubernetes)", estTime: "4 weeks" },
      { order: 5, label: "Practice designing scalable cloud architectures", estTime: "3 weeks" },
      { order: 6, label: "Implement cloud security best practices", estTime: "2 weeks" },
      { order: 7, label: "Build a multi-service cloud application", estTime: "4 weeks" },
      { order: 8, label: "Prepare for a cloud certification (AWS SA, Azure Architect)", estTime: "5 weeks" }
    ]
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    steps: [
      { order: 1, label: "Master Linux system administration", estTime: "3 weeks" },
      { order: 2, label: "Learn infrastructure as code (Terraform, Ansible)", estTime: "4 weeks" },
      { order: 3, label: "Set up CI/CD pipelines (Jenkins, GitHub Actions)", estTime: "3 weeks" },
      { order: 4, label: "Study container technologies (Docker, Kubernetes)", estTime: "4 weeks" },
      { order: 5, label: "Learn monitoring & observability tools", estTime: "2 weeks" },
      { order: 6, label: "Practice cloud infrastructure deployment", estTime: "3 weeks" },
      { order: 7, label: "Implement security in the DevOps pipeline", estTime: "2 weeks" },
      { order: 8, label: "Build an end-to-end automated deployment project", estTime: "4 weeks" }
    ]
  },
  {
    id: "full-stack-dev",
    title: "Full-Stack Developer",
    steps: [
      { order: 1, label: "Master HTML, CSS & JavaScript fundamentals", estTime: "4 weeks" },
      { order: 2, label: "Learn a frontend framework (React, Vue, Angular)", estTime: "5 weeks" },
      { order: 3, label: "Study backend development with a language/framework", estTime: "5 weeks" },
      { order: 4, label: "Practice database design & SQL/NoSQL", estTime: "3 weeks" },
      { order: 5, label: "Learn API development & integration", estTime: "2 weeks" },
      { order: 6, label: "Implement authentication & security best practices", estTime: "2 weeks" },
      { order: 7, label: "Build a full-stack web application", estTime: "4 weeks" },
      { order: 8, label: "Deploy & maintain a production application", estTime: "2 weeks" }
    ]
  },
  {
    id: "ui-ux-designer",
    title: "UI / UX Designer",
    steps: [
      { order: 1, label: "Learn design fundamentals & principles", estTime: "3 weeks" },
      { order: 2, label: "Master a design tool (Figma, Sketch, XD)", estTime: "4 weeks" },
      { order: 3, label: "Study user research methodologies", estTime: "2 weeks" },
      { order: 4, label: "Create user personas & journey maps", estTime: "1 week" },
      { order: 5, label: "Practice wireframing & prototyping", estTime: "3 weeks" },
      { order: 6, label: "Learn interaction design & micro-interactions", estTime: "2 weeks" },
      { order: 7, label: "Study accessibility & inclusive design", estTime: "2 weeks" },
      { order: 8, label: "Build a comprehensive UX case study", estTime: "4 weeks" }
    ]
  }
];
