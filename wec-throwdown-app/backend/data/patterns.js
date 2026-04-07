// Pattern Library for Latte Art Throwdowns
const patternLibrary = [
  // BEGINNER PATTERNS
  {
    id: 'heart',
    name: 'Heart',
    difficulty: 'beginner',
    category: 'heart',
    description: 'Classic heart shape',
    minStacks: 1,
    imageUrl: '/patterns/heart.png'
  },
  {
    id: 'rosetta',
    name: 'Rosetta',
    difficulty: 'beginner',
    category: 'rosetta',
    description: 'Fern or leaf pattern with central stem',
    minStacks: 1,
    imageUrl: '/patterns/rosetta.png'
  },
  {
    id: 'monk_head',
    name: 'Monk\'s Head',
    difficulty: 'beginner',
    category: 'circle',
    description: 'Simple white circle',
    minStacks: 1,
    imageUrl: '/patterns/monk_head.png'
  },
  
  // INTERMEDIATE PATTERNS
  {
    id: 'tulip_2stack',
    name: 'Tulip (2-Stack)',
    difficulty: 'intermediate',
    category: 'tulip',
    description: 'Two stacked circles',
    minStacks: 2,
    imageUrl: '/patterns/tulip_2.png'
  },
  {
    id: 'tulip_3stack',
    name: 'Tulip (3-Stack)',
    difficulty: 'intermediate',
    category: 'tulip',
    description: 'Three stacked circles',
    minStacks: 3,
    imageUrl: '/patterns/tulip_3.png'
  },
  {
    id: 'wrapped_rosetta',
    name: 'Wrapped Rosetta',
    difficulty: 'intermediate',
    category: 'rosetta',
    description: 'Rosetta with wrapped edges',
    minStacks: 1,
    imageUrl: '/patterns/wrapped_rosetta.png'
  },
  
  // ADVANCED PATTERNS
  {
    id: 'tulip_4stack',
    name: 'Tulip (4-Stack)',
    difficulty: 'advanced',
    category: 'tulip',
    description: 'Four stacked circles',
    minStacks: 4,
    imageUrl: '/patterns/tulip_4.png'
  },
  {
    id: 'tulip_5stack',
    name: 'Tulip (5-Stack)',
    difficulty: 'advanced',
    category: 'tulip',
    description: 'Five stacked circles',
    minStacks: 5,
    imageUrl: '/patterns/tulip_5.png'
  },
  {
    id: 'swan',
    name: 'Swan',
    difficulty: 'advanced',
    category: 'swan',
    description: 'Swan with long neck and body',
    minStacks: 1,
    imageUrl: '/patterns/swan.png'
  },
  {
    id: 'winged_tulip',
    name: 'Winged Tulip',
    difficulty: 'advanced',
    category: 'tulip',
    description: 'Tulip with side wings',
    minStacks: 3,
    imageUrl: '/patterns/winged_tulip.png'
  },
  
  // EXPERT PATTERNS
  {
    id: 'phoenix',
    name: 'Phoenix/Rising Tulip',
    difficulty: 'expert',
    category: 'tulip',
    description: 'Complex layered tulip with rising effect',
    minStacks: 4,
    imageUrl: '/patterns/phoenix.png'
  },
  {
    id: 'rosetta_tulip_combo',
    name: 'Rosetta-Tulip Combo',
    difficulty: 'expert',
    category: 'combo',
    description: 'Rosetta base with tulip on top',
    minStacks: 3,
    imageUrl: '/patterns/rosetta_tulip.png'
  },
  {
    id: 'detailed_swan',
    name: 'Detailed Swan',
    difficulty: 'expert',
    category: 'swan',
    description: 'Swan with detailed wings and feathers',
    minStacks: 1,
    imageUrl: '/patterns/detailed_swan.png'
  },
  {
    id: 'bear',
    name: 'Bear',
    difficulty: 'expert',
    category: 'animal',
    description: 'Bear face or full body',
    minStacks: 1,
    imageUrl: '/patterns/bear.png'
  },
  {
    id: 'rabbit',
    name: 'Rabbit',
    difficulty: 'expert',
    category: 'animal',
    description: 'Rabbit with long ears',
    minStacks: 1,
    imageUrl: '/patterns/rabbit.png'
  },
  {
    id: 'seahorse',
    name: 'Seahorse',
    difficulty: 'expert',
    category: 'animal',
    description: 'Curved seahorse shape',
    minStacks: 1,
    imageUrl: '/patterns/seahorse.png'
  }
];

// Throwdown Styles Configuration
const throwdownStyles = {
  freestyle: {
    id: 'freestyle',
    name: 'Freestyle',
    description: 'Competitors pour their choice of pattern',
    requiresPatternDeclaration: false,
    hasDefenderChallenger: false,
    patternSource: 'competitor_choice',
    judgingCriteria: ['execution', 'difficulty', 'contrast', 'symmetry', 'creativity'],
    defaultTimeLimit: 240,
    difficultyWeight: 0.25
  },
  
  match_pattern: {
    id: 'match_pattern',
    name: 'Match the Pattern',
    description: 'Challenger chooses pattern, both must replicate it',
    requiresPatternDeclaration: true,
    hasDefenderChallenger: true,
    patternSource: 'challenger',
    judgingCriteria: ['replication', 'contrast', 'symmetry', 'definition', 'execution'],
    defaultTimeLimit: 240,
    replicationWeight: 0.40
  },
  
  assigned: {
    id: 'assigned',
    name: 'Assigned Pattern',
    description: 'Organizer assigns the same pattern for all competitors',
    requiresPatternDeclaration: true,
    hasDefenderChallenger: false,
    patternSource: 'organizer',
    judgingCriteria: ['execution', 'contrast', 'symmetry', 'definition', 'overall'],
    defaultTimeLimit: 240,
    patternAssignedPerRound: false
  },
  
  progressive: {
    id: 'progressive',
    name: 'Progressive Difficulty',
    description: 'Pattern difficulty increases each round',
    requiresPatternDeclaration: true,
    hasDefenderChallenger: false,
    patternSource: 'organizer_by_round',
    judgingCriteria: ['execution', 'contrast', 'symmetry', 'definition', 'overall'],
    defaultTimeLimit: 240,
    patternAssignedPerRound: true
  },
  
  speed: {
    id: 'speed',
    name: 'Speed Pour',
    description: 'Competitors have limited time to complete their best pour',
    requiresPatternDeclaration: false,
    hasDefenderChallenger: false,
    patternSource: 'competitor_choice',
    judgingCriteria: ['completion', 'execution', 'difficulty'],
    defaultTimeLimit: 120,
    completionWeight: 0.40
  },
  
  team: {
    id: 'team',
    name: 'Team/Relay',
    description: 'Teams of baristas compete together',
    requiresPatternDeclaration: false,
    hasDefenderChallenger: false,
    patternSource: 'team_choice',
    judgingCriteria: ['execution', 'difficulty', 'contrast', 'symmetry', 'teamwork'],
    defaultTimeLimit: 300,
    isTeamFormat: true
  }
};

// Judging Criteria Definitions
const judgingCriteria = {
  contrast: {
    name: 'Contrast',
    description: 'Definition between milk and espresso',
    maxPoints: 10,
    weight: 1.0
  },
  symmetry: {
    name: 'Symmetry',
    description: 'Balance of pattern',
    maxPoints: 10,
    weight: 1.0
  },
  difficulty: {
    name: 'Difficulty',
    description: 'Complexity of pattern',
    maxPoints: 10,
    weight: 1.0
  },
  definition: {
    name: 'Definition',
    description: 'Sharpness and clarity of pattern edges',
    maxPoints: 10,
    weight: 1.0
  },
  position: {
    name: 'Position',
    description: 'Centering in cup',
    maxPoints: 10,
    weight: 1.0
  },
  execution: {
    name: 'Execution',
    description: 'Overall technical quality',
    maxPoints: 10,
    weight: 1.5
  },
  replication: {
    name: 'Replication Success',
    description: 'Did competitor successfully match the pattern?',
    maxPoints: 10,
    weight: 2.0,
    isBinary: true
  },
  completion: {
    name: 'Completion Within Time',
    description: 'Successfully finished pour within time limit',
    maxPoints: 10,
    weight: 2.0,
    isBinary: true
  },
  creativity: {
    name: 'Creativity',
    description: 'Artistic interpretation and originality',
    maxPoints: 10,
    weight: 0.5
  },
  overall: {
    name: 'Overall Appeal',
    description: 'Holistic impression',
    maxPoints: 20,
    weight: 2.0
  }
};

// Match Flow Steps by Style
const matchFlows = {
  freestyle: [
    { step: 1, name: 'Setup', description: 'Competitors enter match area' },
    { step: 2, name: 'Coin Toss', description: 'Winner chooses pour order' },
    { step: 3, name: 'Pour A', description: 'Competitor A pours their choice' },
    { step: 4, name: 'Pour B', description: 'Competitor B pours their choice' },
    { step: 5, name: 'Judging', description: 'Judge evaluates both pours' }
  ],
  
  match_pattern: [
    { step: 1, name: 'Setup', description: 'Competitors enter match area' },
    { step: 2, name: 'Coin Toss', description: 'Winner is Defender, Loser is Challenger' },
    { step: 3, name: 'Pattern Declaration', description: 'Challenger declares pattern from library' },
    { step: 4, name: 'Confirmation', description: 'Both competitors confirm pattern' },
    { step: 5, name: 'Defender Pour', description: 'Defender pours first (sets standard)' },
    { step: 6, name: 'Challenger Pour', description: 'Challenger pours (must replicate)' },
    { step: 7, name: 'Judging', description: 'Judge evaluates replication and execution' }
  ],
  
  assigned: [
    { step: 1, name: 'Setup', description: 'Competitors enter match area' },
    { step: 2, name: 'Pattern Reveal', description: 'Organizer announces assigned pattern' },
    { step: 3, name: 'Pour A', description: 'Competitor A pours assigned pattern' },
    { step: 4, name: 'Pour B', description: 'Competitor B pours assigned pattern' },
    { step: 5, name: 'Judging', description: 'Judge evaluates both pours' }
  ]
};

module.exports = {
  patternLibrary,
  throwdownStyles,
  judgingCriteria,
  matchFlows
};
