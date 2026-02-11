export const featureGroups = [
  {
    id: 'search',
    titleKey: 'features.groups.search.title',
    descriptionKey: 'features.groups.search.description',
    icon: 'Search',
    items: [
      'features.items.search.universal',
      'features.items.search.instant',
      'features.items.search.frecency',
    ],
  },
  {
    id: 'actions',
    titleKey: 'features.groups.actions.title',
    descriptionKey: 'features.groups.actions.description',
    icon: 'Zap',
    items: [
      'features.items.actions.shortcuts',
      'features.items.actions.system',
      'features.items.actions.workflow',
    ],
  },
  {
    id: 'files',
    titleKey: 'features.groups.files.title',
    descriptionKey: 'features.groups.files.description',
    icon: 'FolderSearch',
    items: [
      'features.items.files.documents',
      'features.items.files.media',
      'features.items.files.filters',
    ],
  },
  {
    id: 'contacts',
    titleKey: 'features.groups.contacts.title',
    descriptionKey: 'features.groups.contacts.description',
    icon: 'Users',
    items: [
      'features.items.contacts.smart',
      'features.items.contacts.actions',
      'features.items.contacts.permissions',
    ],
  },
  {
    id: 'calculator',
    titleKey: 'features.groups.calculator.title',
    descriptionKey: 'features.groups.calculator.description',
    icon: 'Calculator',
    items: [
      'features.items.calculator.inline',
      'features.items.calculator.precision',
      'features.items.calculator.copy',
    ],
  },
  {
    id: 'customization',
    titleKey: 'features.groups.customization.title',
    descriptionKey: 'features.groups.customization.description',
    icon: 'Palette',
    items: [
      'features.items.customization.themes',
      'features.items.customization.layout',
      'features.items.customization.sections',
    ],
  },
  {
    id: 'ai',
    titleKey: 'features.groups.ai.title',
    descriptionKey: 'features.groups.ai.description',
    icon: 'Sparkles',
    items: [
      'features.items.ai.prompts',
      'features.items.ai.safe',
      'features.items.ai.optional',
    ],
  },
] as const;
