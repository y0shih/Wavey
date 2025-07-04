# Agent Guidelines for Wavey

## Build/Test Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run start` - Start production server
- No test framework configured yet

## Architecture
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Theme**: Custom emerald-based color scheme with dark/light mode
- **Components**: Radix UI primitives in `components/ui/`
- **State**: React hooks (no global state management)
- **Pages**: `app/` directory with layout.tsx, page.tsx, login/, register/, search/

## Code Style
- **Language**: TypeScript with strict mode
- **Imports**: Use `@/` alias for root imports
- **Components**: Functional components with hooks
- **Styling**: Tailwind classes with `cn()` utility from `lib/utils.ts`
- **Theme**: Use emerald color palette (`from-emerald-400 to-emerald-600`)
- **Icons**: Lucide React icons
- **Buttons**: shadcn/ui Button component with gradient variants
- **Layout**: Responsive design with container classes
