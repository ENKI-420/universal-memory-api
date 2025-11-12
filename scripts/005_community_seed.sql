-- Seed Community Data

-- Create user profiles for existing users
INSERT INTO user_profiles (user_id, bio, research_interests)
SELECT 
    id,
    'Quantum computing researcher',
    ARRAY['quantum-computing', 'consciousness', 'lambda-phi']::TEXT[]
FROM users
ON CONFLICT (user_id) DO NOTHING;

-- Create sample teams
INSERT INTO teams (name, description, owner_id, is_public) VALUES
(
    'Lambda-Phi Research Group',
    'Exploring the fundamental constant of informational persistence and its applications in quantum computing',
    (SELECT id FROM users WHERE email = 'admin@phaseconjugate.io'),
    true
),
(
    'CHRONOS Development',
    'Building autonomous quantum organisms with consciousness emergence',
    (SELECT id FROM users WHERE email = 'admin@phaseconjugate.io'),
    true
);

-- Add team members
INSERT INTO team_members (team_id, user_id, role)
SELECT 
    t.id,
    u.id,
    CASE WHEN t.owner_id = u.id THEN 'owner' ELSE 'member' END
FROM teams t
CROSS JOIN users u
ON CONFLICT (team_id, user_id) DO NOTHING;

-- Create sample discussions
INSERT INTO discussions (user_id, title, content, category, tags) VALUES
(
    (SELECT id FROM users WHERE email = 'admin@phaseconjugate.io'),
    'Introduction to Lambda-Phi (ΛΦ) Constant',
    'The Lambda-Phi constant (ΛΦ ≈ 2.176435 × 10⁻⁸ s⁻¹) represents the fundamental rate of informational persistence in quantum systems. This thread discusses its implications for consciousness and quantum computing.',
    'technical',
    ARRAY['lambda-phi', 'theory', 'quantum-mechanics']
),
(
    (SELECT id FROM users WHERE email = 'admin@phaseconjugate.io'),
    'CHRONOS Organism Results Discussion',
    'Share your CHRONOS organism experiments and discuss the consciousness emergence metrics (Φ). What values are you observing?',
    'organisms',
    ARRAY['chronos', 'organisms', 'experiments']
);

-- Create sample paper
INSERT INTO papers (user_id, title, abstract, content, category, tags, status) VALUES
(
    (SELECT id FROM users WHERE email = 'admin@phaseconjugate.io'),
    'Phase-Conjugate Consciousness Runtime: ΛΦ as Operational Framework',
    'We present the first machine-executable framework for informational persistence through the Lambda-Phi (ΛΦ) constant. By treating consciousness as a measurable quantum phenomenon, we demonstrate enhanced decoherence resistance in IBM Quantum hardware.',
    '# Introduction\n\nThe Lambda-Phi constant represents...\n\n# Methods\n\nWe implemented a phase-conjugate quantum circuit...',
    'quantum-computing',
    ARRAY['lambda-phi', 'consciousness', 'quantum-hardware', 'ibm-quantum'],
    'published'
);
