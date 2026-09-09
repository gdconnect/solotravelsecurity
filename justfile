# Solo Travel Security - Task Automation
set shell := ["bash", "-cu"]

# Show available recipes
default:
    @just --list

# Start development server on port 3005
dev:
    npm run dev

# Fast lint with Oxlint
lint-ox:
    npm run lint:ox:quiet

# Alias for lint-ox
oxlint: lint-ox

# Standard Next.js ESLint check
lint-es:
    npm run lint

# Run all linters (Oxlint + ESLint)
lint: lint-ox lint-es

# Verify code formatting with oxfmt
format-check:
    npm run format:check

# Format code in place with oxfmt (including Tailwind class sorting)
format:
    npm run format:ox

# TypeScript type check
typecheck:
    npx tsc --noEmit

# Lint GitHub Actions workflow files with actionlint
actionlint:
    actionlint

# Next.js production build
build:
    npm run build

# Cloudflare OpenNext preview build and local emulation
preview:
    npm run preview

# Deploy application to Cloudflare Workers
deploy:
    npm run deploy

# Run Git pre-commit checks via Lefthook
pre-commit:
    lefthook run pre-commit

# Run Git pre-push checks via Lefthook
pre-push:
    lefthook run pre-push

# Clean compiled build artifacts
clean:
    rm -rf .next .open-next out
