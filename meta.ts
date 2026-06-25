export interface VendorSkillMeta {
  official?: boolean
  source: string
  skillsPath?: string // Optional custom path to skills directory (default: 'skills')
  skills: Record<string, string> // sourceSkillName -> outputSkillName
}

export interface SourceMeta {
  url: string
  skills: string[] // output skill names generated from this source
}

/**
 * Repositories to clone as submodules and generate skills from source
 */
export const submodules: Record<string, SourceMeta> = {
  'rust-best-practices': {
    url: 'https://github.com/apollographql/rust-best-practices',
    skills: ['rust-best-practices'],
  },
  'styleguide': {
    url: 'https://github.com/google/styleguide',
    skills: [
      'cpp-best-practices',
      'typescript-best-practices',
      'go-best-practices',
      'python-best-practices',
    ],
  },
}

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
