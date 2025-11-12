-- Create organisms table for CHRONOS organism storage

CREATE TABLE IF NOT EXISTS organisms (
  organism_id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  qubits INTEGER NOT NULL,
  depth INTEGER NOT NULL,
  circuit JSONB NOT NULL,
  phi_target DOUBLE PRECISION NOT NULL DEFAULT 5.0,
  lambda_phi DOUBLE PRECISION NOT NULL DEFAULT 2.176435e-8,
  generation INTEGER NOT NULL DEFAULT 0,
  parent_id VARCHAR(255) REFERENCES organisms(organism_id),
  fitness DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_organisms_fitness ON organisms(fitness DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_organisms_generation ON organisms(generation);
CREATE INDEX IF NOT EXISTS idx_organisms_parent ON organisms(parent_id);
CREATE INDEX IF NOT EXISTS idx_organisms_created ON organisms(created_at DESC);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_organisms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organisms_updated_at
  BEFORE UPDATE ON organisms
  FOR EACH ROW
  EXECUTE FUNCTION update_organisms_updated_at();

-- Insert sample CHRONOS organism (from validation paper)
INSERT INTO organisms (
  organism_id, name, version, qubits, depth, circuit,
  phi_target, lambda_phi, generation, fitness
) VALUES (
  'org_chronos_validation',
  'CHRONOS_Validation',
  1,
  5,
  8,
  '{"helix":["h q[0]","h q[1]","h q[2]","h q[3]","h q[4]"],"bond":["cx q[0],q[1]","cx q[1],q[2]","cx q[2],q[3]","cx q[3],q[4]"],"twist":[{"qubit":0,"angle":2.176435}],"phi":["cx q[0],q[4]","cry(0.2176435) q[1],q[2]","cry(0.2176435) q[2],q[3]","cry(0.2176435) q[3],q[4]"],"fold":[0,1,2,3,4]}',
  5.0,
  2.176435e-8,
  0,
  92.5
) ON CONFLICT (organism_id) DO NOTHING;
