/**
 * Agent utility functions
 */

export interface AgentJsonData {
  name: string;
  title: string;
  languages: string[];
  nationality: string;
  experience: number;
  profileUrl: string;
  whatsappNumber: string;
  role: string;
  imageUrl: string;
  services: string[];
  profileImg: string;
  bannerImg: string;
  bio: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

export interface Agent {
  id: number;
  name: string;
  position: string;
  languages: string[];
  experience: number;
  nationality: string;
  image: string;
  whatsapp: string;
  email: string;
  specialties: string[];
  bio: string;
  profileUrl?: string;
}

/**
 * Transform JSON agent data to the expected Agent interface
 */
export const transformAgentData = (jsonAgent: AgentJsonData, index: number): Agent => ({
  id: index + 1,
  name: jsonAgent.name,
  position: jsonAgent.title || jsonAgent.role,
  languages: jsonAgent.languages || [],
  experience: jsonAgent.experience || 0,
  nationality: jsonAgent.nationality || '',
  image: jsonAgent.imageUrl || jsonAgent.profileImg || '/img/default-agent.jpg',
  whatsapp: jsonAgent.whatsappNumber || jsonAgent.phone || '',
  email: jsonAgent.email || '',
  specialties: jsonAgent.services || [],
  bio: jsonAgent.bio || `${jsonAgent.name} is a professional real estate agent with ${jsonAgent.experience || 0} years of experience.`,
  profileUrl: jsonAgent.profileUrl || `/agents/${index + 1}`
});

/**
 * Get agent URL slug from profileUrl
 */
export const getAgentSlug = (agent: AgentJsonData): string => {
  if (agent.profileUrl) {
    // Extract the slug from the profileUrl (e.g., "/dubai-real-estate-agents/khaled" -> "khaled")
    const parts = agent.profileUrl.split('/');
    return parts[parts.length - 1];
  }
  // Fallback: create slug from name
  return agent.name.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Find agent by slug
 */
export const findAgentBySlug = (agents: AgentJsonData[], slug: string): { agent: AgentJsonData; index: number } | null => {
  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    const agentSlug = getAgentSlug(agent);
    if (agentSlug === slug) {
      return { agent, index: i };
    }
  }
  return null;
};
