export interface VendorSkillMeta {
  official?: boolean
  source: string
  skillsPath?: string // Optional custom path to skills directory (default: 'skills')
  skills: Record<string, string> // sourceSkillName -> outputSkillName
}

/**
 * Repositories to clone as submodules and generate skills from source
 */
export const submodules: Record<string, string> = {}

/**
 * Already generated skills, sync with their `skills/` directory
 */
export const vendors: Record<string, VendorSkillMeta> = {
  'vuejs-ai': {
    source: 'https://github.com/vuejs-ai/skills',
    skills: {
      'vue-best-practices': 'vue-best-practices',
    },
  },
  'vercel-labs': {
    source: 'https://github.com/vercel-labs/agent-skills',
    skills: {
      'react-best-practices': 'react-best-practices',
    },
  },
  'antfu': {
    source: 'https://github.com/antfu/skills',
    skills: {
      'antfu': 'antfu',
      'antfu-design': 'antfu-design',
    },
  },
}

/**
 * Hand-written skills
 */
export const manual = ['reform']
