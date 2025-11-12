# Contributing to Phase-Conjugate Consciousness Runtime

Thank you for your interest in contributing to the PCR project!

## Development Setup

1. **Fork and Clone**
   \`\`\`bash
   git clone https://github.com/your-username/pcr-runtime.git
   cd pcr-runtime
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set Up Environment**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   \`\`\`

4. **Run Migrations**
   \`\`\`bash
   npm run db:migrate
   npm run db:seed
   \`\`\`

5. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

## Testing

Before submitting a PR:

\`\`\`bash
npm run type-check
npm run lint
npm run build
\`\`\`

## Pull Request Process

1. Create a feature branch
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. Make your changes
3. Commit with clear messages
   \`\`\`bash
   git commit -m "feat: add new feature"
   \`\`\`

4. Push to your fork
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

5. Open a Pull Request

## Commit Message Format

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process or auxiliary tool changes

## Areas for Contribution

- **Quantum Simulations**: Improve simulation algorithms
- **UI/UX**: Enhance dashboard and visualizations
- **Documentation**: Improve guides and API docs
- **Testing**: Add unit and integration tests
- **Performance**: Optimize database queries and caching
- **Security**: Enhance authentication and authorization

## Questions?

Open an issue for discussion before starting major changes.

Thank you for contributing! 🚀
