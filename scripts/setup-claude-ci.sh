#!/bin/bash
# Setup script for Claude Code CI integration - Woningpaspoort

set -e

echo "🏠 Woningpaspoort - Claude Code CI Setup"
echo "========================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not found. Install it first:"
    echo "   brew install gh"
    exit 1
fi

# Check if logged in
if ! gh auth status &> /dev/null; then
    echo "❌ Not logged into GitHub CLI. Run:"
    echo "   gh auth login"
    exit 1
fi

echo "✅ GitHub CLI authenticated"
echo ""

# Get repository info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")

if [ -z "$REPO" ]; then
    echo "⚠️  Not linked to a GitHub repository yet."
    echo "   Run: gh repo create woningpaspoort --private"
    echo ""
fi

# Check for existing secret
if gh secret list 2>/dev/null | grep -q "ANTHROPIC_API_KEY"; then
    echo "✅ ANTHROPIC_API_KEY secret already exists"
else
    echo "🔑 Setting up ANTHROPIC_API_KEY secret..."
    echo ""
    echo "Enter your Anthropic API key (input hidden):"
    read -s API_KEY
    
    if [ -z "$API_KEY" ]; then
        echo "⚠️  No API key provided. Set it manually:"
        echo "   gh secret set ANTHROPIC_API_KEY"
    else
        echo "$API_KEY" | gh secret set ANTHROPIC_API_KEY
        echo "✅ Secret configured"
    fi
fi

echo ""
echo "📋 CI Workflows available:"
echo "   - .github/workflows/ci.yml (lint, test, build)"
echo "   - .github/workflows/claude-code-review.yml (AI code review)"
echo ""
echo "🚀 Next steps:"
echo "   1. npm install"
echo "   2. Create .env from .env.example"
echo "   3. Set up PostgreSQL database"
echo "   4. npm run db:push"
echo "   5. npm run dev"
echo ""
echo "Done! 🎉"
