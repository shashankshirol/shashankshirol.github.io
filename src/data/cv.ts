// Everything on the home page comes from this file. Edit it to update the site.
// `body` strings may contain HTML links.

export const profile = {
  name: 'Shashank Shirol',
  summary: 'Software engineer, Optimizing Basis Risk at OSTTRA.',
  about: [
    'Developer, runner, avid reader. Off the clock I am usually gaming, watching anime, or talking about outer space.',
    'I hike when I can and have recently taken up bouldering. Tips are welcome.',
  ],
  email: 'shashank.shirol1@gmail.com',
};

export interface Entry {
  dates: string;
  title: string;
  place?: string;
  body?: string[];
  points?: string[];
}

export const experience: Entry[] = [
  {
    dates: 'Aug 2024 – Present',
    title: 'Software Engineer',
    place: 'OSTTRA',
    body: [
      'I build the software behind <a href="https://osttra.com/services/optimisation/basis-risk-optimisation/">Osttra Reset</a>. The state-of-the-art optimization engine, the data-intensive application that ingests their portfolios, and the trade reporting service.',
      'Stack: C#, .NET, Python, React, Docker, Kubernetes, Google Cloud.',
    ],
  },
  {
    dates: 'Aug 2021 – Aug 2022',
    title: 'IBD Strats Analyst',
    place: 'Goldman Sachs',
    body: [
      'Solved business problems with data and machine learning on the division’s Analytics team.',
      'On my own, I built, documented and pitched a PDF parser that automated a manual documentation process, and presented it to stakeholders across the firm.',
    ],
  },
  {
    dates: 'Jan 2021 – Jun 2021',
    title: 'Research Intern',
    place: 'Nanyang Technological University, Singapore',
    body: [
      'Taught a GAN to turn clean speech into noisy speech, as a way to augment speech data. Working in the frequency domain with <a href="https://personal.ntu.edu.sg/aseschng/default.html">Prof. Chng Eng Siong</a>, we got the model learning from under five minutes of audio.',
      '<a href="/assets/pdfs/shan-bachelor-thesis.pdf">Read my bachelor’s thesis (PDF)</a>',
    ],
  },
  {
    dates: 'May 2020 – Jun 2020',
    title: 'Summer Analyst',
    place: 'Goldman Sachs',
    body: [
      'Built an ESG daily digest for the Investment Banking Division’s Data Intelligence group. It scans company filings, pulls out the relevant passages, and flags the important signals with NLP.',
    ],
  },
  {
    dates: 'May 2019 – Jul 2019',
    title: 'Summer Research Intern',
    place: 'Manipal Institute of Technology',
    body: [
      'Researched crowd counting under Prof. Dr. Karunakar A Kotegar and Abhilash K Pai. I tuned a patch-based crowd classifier across patch sizes, models and feature descriptors (SIFT, SURF, ORB, KAZE) to 92% validation accuracy.',
    ],
  },
];

export const education: Entry[] = [
  {
    dates: '2022 – 2024',
    title: 'MSc in Computer Science, Interaction Design track',
    place: 'KTH Royal Institute of Technology, Stockholm',
    body: [
      'Master’s thesis: I gave Husqvarna’s robotic lawn mowers social behaviors, using light and movement to show what a mower is about to do. <a href="https://github.com/shashankshirol/husq-interaction">The code is on GitHub</a>.',
    ],
    points: [
      'GPA 4.78/5.00',
      'KTH Scholarship, offered to 75 of 564 applicants in 2022',
      'KTH-India Scholarship, offered to up to two applicants each year',
    ],
  },
  {
    dates: '2017 – 2021',
    title: 'BTech in Computer Science',
    place: 'Manipal Institute of Technology, Manipal',
    points: [
      'Cumulative GPA 9.56/10',
      'Certificate of Merit and a medal for academic excellence (Dean’s List)',
    ],
  },
  {
    dates: '2015 – 2017',
    title: 'High School Diploma (CBSE)',
    place: 'Bharati Vidyapeeth Higher Secondary School, Pune',
    points: [
      '93.6%, first in the graduating class',
      'Certificate of Merit and a cash prize as best outgoing student',
    ],
  },
];

// The "Languages" row is not here: it is generated from the GitHub repositories
// of the account set in src/data/projects.ts.
export const skills = [
  { name: 'At work', items: 'C#, .NET, Python, React, Docker, Kubernetes, Google Cloud' },
  { name: 'Libraries', items: 'Scikit-learn, Pandas, SciPy, PyTorch, TensorFlow, Keras, OpenCV' },
  { name: 'Tools', items: 'LaTeX, Obsidian' },
  {
    name: 'Spoken',
    items: 'English (advanced), Hindi, Marathi and Kannada (fluent), German (beginner)',
  },
];

export const links = [
  { name: 'GitHub', href: 'https://github.com/shashankshirol' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/shashankshirol/' },
  { name: 'Instagram', href: 'https://www.instagram.com/ponderful_woop/' },
  { name: 'Facebook', href: 'https://www.facebook.com/shashank.shirol.1' },
  { name: 'Steam', href: 'https://steamcommunity.com/id/ponderful_woop' },
];
