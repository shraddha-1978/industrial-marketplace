// Product categories for the B2B industrial marketplace.
// `accent` drives the SVG illustration + UI colour for each category.
// `icon` is a Lucide icon name consumed by the Icon renderer.

export const categories = [
  {
    id: 'industrial-machinery',
    name: 'Industrial Machinery',
    icon: 'Factory',
    accent: '#1a5dc9',
    accentLight: '#eff5ff',
    productCount: 1840,
    description:
      'Heavy-duty machinery, CNC machines, lathe machines, presses and production line equipment.',
    keywords: ['machine', 'cnc', 'lathe', 'press', 'milling', 'grinder', 'plant'],
  },
  {
    id: 'electrical-equipment',
    name: 'Electrical Equipment',
    icon: 'Zap',
    accent: '#d97706',
    accentLight: '#fffbeb',
    productCount: 2310,
    description:
      'Transformers, switchgear, generators, circuit breakers, cables and electrical panels.',
    keywords: ['transformer', 'generator', 'panel', 'cable', 'switchgear', 'motor', 'electrical'],
  },
  {
    id: 'hardware-tools',
    name: 'Hardware Tools',
    icon: 'Wrench',
    accent: '#0d9488',
    accentLight: '#f0fdfa',
    productCount: 3570,
    description:
      'Hand tools, power tools, fasteners, abrasives, cutting and measuring instruments.',
    keywords: ['tool', 'drill', 'wrench', 'spanner', 'bolt', 'fastener', 'grinder'],
  },
  {
    id: 'construction-materials',
    name: 'Construction Materials',
    icon: 'Building2',
    accent: '#7c3aed',
    accentLight: '#f5f3ff',
    productCount: 2940,
    description:
      'Cement, steel, TMT bars, aggregates, structural sections and building materials.',
    keywords: ['cement', 'steel', 'tmt', 'bar', 'aggregate', 'brick', 'concrete', 'construction'],
  },
  {
    id: 'safety-equipment',
    name: 'Safety Equipment',
    icon: 'ShieldCheck',
    accent: '#dc2626',
    accentLight: '#fef2f2',
    productCount: 1560,
    description:
      'PPE kits, helmets, gloves, safety shoes, harnesses and fire protection gear.',
    keywords: ['safety', 'helmet', 'glove', 'ppe', 'shoe', 'harness', 'fire', 'goggles'],
  },
  {
    id: 'pipes-fittings',
    name: 'Pipes and Fittings',
    icon: 'GitFork',
    accent: '#0891b2',
    accentLight: '#ecfeff',
    productCount: 2110,
    description:
      'Steel pipes, PVC pipes, valves, flanges, elbows and plumbing fittings.',
    keywords: ['pipe', 'fitting', 'valve', 'flange', 'elbow', 'pvc', 'tube'],
  },
  {
    id: 'pumps-motors',
    name: 'Pumps and Motors',
    icon: 'Fan',
    accent: '#2563eb',
    accentLight: '#eff6ff',
    productCount: 1280,
    description:
      'Centrifugal pumps, submersible pumps, electric motors, gearboxes and drives.',
    keywords: ['pump', 'motor', 'submersible', 'centrifugal', 'gearbox', 'drive', 'impeller'],
  },
  {
    id: 'industrial-supplies',
    name: 'Industrial Supplies',
    icon: 'Package',
    accent: '#475569',
    accentLight: '#f8fafc',
    productCount: 4020,
    description:
      'Lubricants, adhesives, packaging, consumables, bearings and maintenance supplies.',
    keywords: ['lubricant', 'adhesive', 'bearing', 'grease', 'oil', 'consumable', 'supply', 'packaging'],
  },
]

export const getCategoryById = (id) => categories.find((c) => c.id === id)
