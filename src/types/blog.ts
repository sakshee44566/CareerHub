export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'job' | 'internship' | 'startup';
  company: string;
  location: string;
  salary?: string;
  experience: 'fresher' | 'experienced' | 'all';
  publishedAt: string;
  image?: string;
  tags: string[];
  isRemote: boolean;
  applicationDeadline?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}