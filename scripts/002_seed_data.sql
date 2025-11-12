-- Seed data for Phase-Conjugate Consciousness Runtime
-- Version: 1.0.0
-- Description: Initial seed data for development and testing

-- Insert admin user (password: Admin123!)
-- Note: In production, use proper password hashing with bcrypt
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@phaseconjugate.io', '$2a$10$rKZLvXZnJQQJ5K5Z5Z5Z5uK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'System Administrator', 'admin'),
('researcher@phaseconjugate.io', '$2a$10$rKZLvXZnJQQJ5K5Z5Z5Z5uK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Dr. Quantum Researcher', 'researcher'),
('user@phaseconjugate.io', '$2a$10$rKZLvXZnJQQJ5K5Z5Z5Z5uK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Test User', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert system metrics for initial dashboard
INSERT INTO system_metrics (metric_type, metric_name, value, unit, tags) VALUES
('constant', 'lambda_phi', 2.176e-8, 's^-1', '{"source": "theoretical", "precision": "planck"}'),
('constant', 'lambda_phi_normalized', 1e-17, 'dimensionless', '{"source": "theoretical"}'),
('constant', 'planck_time', 5.391e-44, 's', '{"source": "fundamental"}'),
('constant', 'planck_length', 1.616e-35, 'm', '{"source": "fundamental"}'),
('system', 'coherence_baseline', 0.95, 'ratio', '{"backend": "ibm_quantum"}'),
('system', 'decoherence_rate', 1e-5, 's^-1', '{"backend": "ibm_quantum"}')
ON CONFLICT DO NOTHING;

-- Insert sample job for demonstration
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@phaseconjugate.io';
    
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO jobs (
            user_id, 
            job_type, 
            status, 
            parameters,
            backend,
            lambda_phi_value,
            lambda_phi_normalized,
            coherence_time,
            fidelity,
            purity,
            result
        ) VALUES (
            admin_user_id,
            'phase_conjugate',
            'completed',
            '{"edge_length": 1.616e-35, "time_steps": 1000, "qubit_count": 5}',
            'ibm_quantum',
            2.176e-8,
            1e-17,
            0.00015,
            0.987,
            0.945,
            '{"success": true, "coherence_recovery": 0.92, "entropy_reduction": 0.15}'
        );
    END IF;
END $$;
